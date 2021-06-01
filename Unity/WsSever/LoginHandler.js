const SocketState = require('./SocketState');
const Vector3 = require('./Vector3');

function LoginHandler(data, socket)
{
    data = JSON.parse(data);
    const {tank, name} = data;

    //console.log(tank, name);

    socket.state = SocketState.IN_GAME;

    let sendData = {
        //탱크 생성지점
        position:Vector3.zero,
        rotation:Vector3.zero,
        turretRotation:Vector3.zero,
        socketId:socket.id,
        tank,
        name
    }

    const paylord = JSON.stringify(sendData);
    const type = "LOGIN";

    socket.send(JSON.stringify({type, paylord}));

    return sendData;

    //로그인 된 유저 리턴하면 서버에서 리스트에 등록
}

module.exports = LoginHandler;