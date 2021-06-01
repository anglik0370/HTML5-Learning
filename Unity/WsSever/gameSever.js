const WebSocket = require('ws');
const port = 15450;

const LoginHandler = require('./LoginHandler.js');
const SocketState = require('./SocketState.js');

let socketIndex = 0;
let userList = {} //로그인 한 유저들을 관리하는 리스트
let connectedSocket = {}; //연결된 소켓들 관리

const wsService = new WebSocket.Server({port}, () => {
    console.log(`웹 소켓이 ${port} 에서 구동중이에요!`);
});

const getPlayLord = str => {
    let idx = str.indexOf(":");
    let op = str.substr(0, idx);
    let paylord = str.substr(idx + 1);
    
    return {op, paylord};
}

wsService.on("connection", socket => {

    console.log(`서버에 새로운 소켓이 착륙했어요!`);

    socket.state = SocketState.IN_LOGIN;
    socket.id = socketIndex;
    connectedSocket[socketIndex] =socket;
    socketIndex++;

    socket.on("close", () => {
        console.log(`소켓의 연결이 끊어졌어요 :(`);
        delete connectedSocket[socket.id];
        delete userList[socket.id];
    });

    socket.on("message", msg => {
        
        try{
            const data = JSON.parse(msg); //json파싱

            if(data.type === "LOGIN")
            {
                let userData = LoginHandler(data.paylord, socket);
                userList[socket.id] = userData;
                return;
                //어떤 소켓이 어떤 페이로드를 보냇는가?
                return;
            }
        }
        catch(err)
        {
            console.log(`잘못된 요청 발생 : ${msg}`);
            console.log(err);
        }
    });
});