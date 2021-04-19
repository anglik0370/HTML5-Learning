const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const app = new express();
const server = http.createServer(app); //미안 서버야...사과할께..
const path = require('path');

const State = require('./State');

app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "views", "index.html"));
});
const io = socketio(server); //이렇게하면 서버에 소켓이 붙는다.
//io는 서버의 모든 소켓을 관리하는 객체
//on은 이벤트를 연결해주는 것으로 addEventListener과 동일

let roomList = [
    {title:"dummyRoom1", roomNo:1, number:1, maxNumber:4},
    {title:"dummyRoom2", roomNo:2, number:1, maxNumber:4}
];

let maxNo = roomList.map( x => x.roomNo);

let conSo = {};

io.on("connection", socket => {
    console.log(`${socket.id} is connected`);
    socket.state = State.IN_LOGIN; //처음 접속하면 로그인 상태로 만든다.

    socket.on("disconnecting", ()=>{
        console.log(`${socket.id} is disconnected`);//소켓 연결 종료
        delete conSo[socket.id];
    });

    socket.on("login", data => {
        socket.nickname = data.nickName;
        socket.state = State.IN_LOBBY; //로비로 진입시킨다.

        conSo[socket.id] = socket;
        socket.emit("login", {roomList});  //로그인시 서버의 방정보 리스트를 보낸다.

        console.log(conSo);
    });

    socket.on("chat", data => {
        // data => {msg:"asdasd", nickName:"오"}
        let {msg, nickName} = data;
        io.emit("chat", {sender:socket.id, msg, nickName});
    });

});

server.listen(15454, ()=>{
    console.log("서버가 15454포트에서 돌아가고 있습니다.");
});