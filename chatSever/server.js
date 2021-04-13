const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const server = http.createServer((req, res) =>
{
    let url = req.url;
    let pathList = url.split("/");

    if(pathList[1] == "public")
    {
        let file = fs.readFileSync(`${__dirname}/public/${pathList[2]}`);
        res.write(file);
        res.end();
        return;
    }

    let html = fs.readFileSync(`${__dirname}/views/index.html`);
    res.write(html);
    res.end();
});

const io = socketio(server);
//io는 서버의 모든 소켓을 관리하는 객체

io.on("connection", socket =>
{
    socket.on("chat", data =>
    {
        io.emit("idk", {sender:socket.id, msg:data.msg});
    });
});
//on은 이벤트를 연결해주는 것으로 addEventListener와 동일

server.listen(15451, () =>
{
    console.log("서버가 15451포트에서 돌아가고 있습니다.");
});