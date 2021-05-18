const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const {Query, Pool} = require('./DB.js');
const State = require('./State.js');
const { Socket } = require('dgram');

const app = new express(); //익스프레스 웹서버
const server = http.createServer(app); //웹서버에 익스프레스 붙이기
const io = socketio(server); //해당 서버에 소켓도 붙이기

app.use(express.static('public'));

app.get('/', (req, res) => {
    //어떤 요청이 오건간에 index.html을 보낸다
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

let roomList = [
   
]

io.on("connect", socket => {
    console.log(`${socket.id}님이 연결되었어요. 피자는 가져오셨겠죠?`);
    socket.state = State.IN_LOGIN;

    socket.on("disconnecting", () =>
    {
        console.log(`${socket.id}님이 떠나셨어요`);

        if(socket.state === State.IN_GAME || socket.state === State.IN_PLAYING)
        {
            let rooms = [...socket.rooms];
            let targetRoom = rooms.find(x => x !== socket.id);

            let idx = roomList.findIndex(x => x.roomName === targetRoom);

            roomList[idx].number--;

            if(roomList[idx].number <= 0)
            {
                //모두 나갔으면 방을 삭제
                roomList.splice(idx, 1);
            }
            else if (socket.state === State.IN_GAME)
            {
                //그렇지 않다면 상대방에게 메세지 전송
                io.to(roomList[idx].roomName).emit("leave-player", {isAdmin:true});
            }
            else if (socket.state === State.IN_PLAYING)
            {
                io.to(roomList[idx].roomName).emit("leave-player", {isAdmin:false});
            }
        }
    })

    socket.on("login-process", async data => {
        const {email, pw} = data;
        let sql = "SELECT * FROM users WHERE email = ? AND password = PASSWORD(?)";
        let result = await Query(sql, [email, pw]);

        if(result.length !== 1)
        {
            socket.emit("login-response", {status:false, msg:"로그인 실패"});
            return;
        }

        socket.emit("login-response", {status:true, msg:"로그인 성공", roomList});
        socket.loginUser = result[0];
        socket.state = State.IN_LOBBY;
    });

    socket.on("register-request", async data => {
        const {email, name, pw, pwc} = data;

        if(email.trim() === "" || name.trim() ==="" || pw.trim() ==="" || pwc !== pw)
        {
            socket.emit("register-response", {status:false, msg:"공백이거나 비밀번호가 일치하지 않습니다."});
            return;
        }

        let sql = "SELECT * FROM users WHERE email = ?";
        let result = await Query(sql, [email]);

        if(result.length != 0)
        {
            socket.emit("register-response", {status:false, msg:"이미 존재하는 이메일입니다."});
            return;
        }

        sql = `INSERT INTO users(email, name, password) VALUES (?, ?, PASSWORD(?))`;
        result = await Query(sql, [email, name, pw]);

        if(result.affectedRows == 1)
        {
            socket.emit("register-response", {status:true, msg:"정상적으로 회원가입 되었습니다."});
        }
        else
        {
            socket.emit("register-response", {status:false, msg:"비정상적으로 회원가입에 실패했습니다"});
        }
    });

    socket.on("create-room", data => {
        if(socket.state !== State.IN_LOBBY)
        {
            socket.emit("bad-access", {msg:"잘못된 접근입니다."});
            return;
        }

        const {name} = data;

        const roomName = roomList.length < 1 ? 1 : Math.max(...roomList.map(x => x.roomName)) + 1;
        //벌도의 방 리스트
        roomList.push({name, roomName ,number:1});
        socket.join(roomName); //해당 소켓을 해당 룸으로 진입

        socket.state = State.IN_GAME;
        socket.emit("enter-room");
    });

    socket.on("join-room", data => {
        if(socket.state !== State.IN_LOBBY)
        {
            socket.emit("bad-access", {msg:"잘못된 접근입니다"});
            return;
        }

        const {roomName} = data;
        let targetRoom = roomList.find(x => x.roomName === roomName);

        //존재하지 않는 방이거나 이미 풀방이라면
        if(targetRoom === undefined || targetRoom.number >= 2)
        {
            socket.emit("bad-access", {msg:"들어갈 수 없는 방입니다"});
            return;
        }

        socket.join(roomName);

        socket.emit("join-room");
        socket.state = State.IN_GAME;
        targetRoom.number++; //인원수 증가
    });

    socket.on("game-start", data => {
        if(socket.state !== State.IN_GAME)
        {
            socket.emit("bad-access", {msg:"잘못된 접근입니다"});
            return;
        }

        let socketRooms = [...socket.rooms];
        let room = socketRooms.find(x => x != socket.id); //자기 소켓방이 아닌 다른방

        console.log(room);

        let targetRoom = roomList.find(x => x.roomName === room)

        if(targetRoom === undefined || targetRoom.number < 2)
        {
            console.log(targetRoom.number);
            socket.emit("bad-access", {msg:"시작할 수 없는 상태입니다"});
            return;
        }

        io.to(room).emit("game-start");
    });

    socket.on("in-playing", data => {
        socket.state = State.IN_PLAYING;
    });

    socket.on("game-data", data => {
        if(socket.state !== State.IN_PLAYING)
        {
            socket.emit("bad-access", {msg:"잘못된 접근입니다"});
            return;
        }

        let room = findRoom(socket);
        data.sender = socket.id;
        socket.broadcast.to(room).emit("game-data", data);
    });

    socket.on("remove-line", data => {
        if(socket.state !== State.IN_PLAYING)
        {
            socket.emit("bad-access", {msg:"잘못된 접근입니다"});
            return;
        }

        let room = findRoom(socket);
        data.sender = socket.id;
        socket.broadcast.to(room).emit("remove-line", data); //나빼고 다른애들한테 쏘기
    });

    socket.on("game-lose", data => {
        let room = findRoom(socket);
        //2인 이상이라면 모든 유저가 전부 패배했는지를 체크

        socket.broadcast.to(room).emit("game-win")
    });

    socket.on("goto-lobby", data => {
        socket.state = State.IN_LOBBY;

        let room = findRoom(socket);
        let idx = roomList.findIndex(x => x.roomName === room);
        roomList[idx].number--; //한명 증발

        if(roomList[idx].number <= 0)
        {
            roomList.splice(idx, 1);
        }
    });

    socket.on("room-list", data => {
        socket.emit("room-list", {roomList});
    });
})

function findRoom(socket)
{
    let socketRooms = [...socket.rooms];
    let room = socketRooms.find(x => x != socket.id);
    return room;
}

server.listen(9000, () => {
    console.log(`Server is running on 9000 port`);
});