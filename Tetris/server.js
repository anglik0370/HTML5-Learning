const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const {Query, Pool} = require('./DB.js');
const state = require("./State.js");
const State = require('./State.js');

const app = new express(); //익스프레스 웹서버
const server = http.createServer(app); //웹서버에 익스프레스 붙이기
const io = socketio(server); //해당 서버에 소켓도 붙이기

app.use(express.static('public'));

app.get('/', (req, res) => {
    //어떤 요청이 오건간에 index.html을 보낸다
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

io.on("connect", socket => {
    console.log(`${socket.id}님이 연결되었어요. 피자는 가져오셨겠죠?`);
    socket.state = State.IN_LOGIN;

    socket.on("login-process", async data => {
        const {email, pw} = data;
        let sql = "SELECT * FROM users WHERE email = ? AND password = PASSWORD(?)";
        let result = await Query(sql, [email, pw]);

        if(result.length !== 1)
        {
            socket.emit("login-response", {status:false, msg:"로그인 실패"});
            return;
        }

        socket.emit("login-response", {status:true, msg:"로그인 성공"});
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
})

server.listen(9000, () => {
    console.log(`Server is running on 9000 port`);
});