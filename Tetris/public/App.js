import { Game } from '/Game.js';
import { $ } from '/Query.js';

class App {
    constructor() {
        //App의 생성자
        this.socket = new io();
        this.addSocketEvent();
        this.pageContainer = $(".page-container");
        this.init();
        //this.debug();
        this.game = new Game(this.socket);
        Game.instance = this.game;
    }

    init() {
        $("#btnLogin").addEventListener("click", () => {
            let email = $("#loginEmail").value;
            let pw = $("#loginPassword").value;

            if (email.trim() === "" || pw.trim() === "") {
                alert("필수값이 비어있습니다");
                return;
            }

            this.socket.emit("login-process", { email, pw });
        });

        $("#btnStart").addEventListener("click", () => {
            this.socket.emit("game-start");
            //this.game.start();
        });
        $("#btnStart").addEventListener("keydown", e => {
            e.preventDefault();
            return false;
        });

        //회원가입 버튼 눌렸을때

        $("#btnRegister").addEventListener("click", () => {
            this.registerProcess();
        });

        $("#btnCreateRoom").addEventListener("click", e => {
            this.creatRoom();
        });
        $("#btnLobby").addEventListener("click", e => {
            this.socket.emit("goto-lobby");

            this.pageContainer.style.left = "-1024px"; //로비로 돌아오게
            this.socket.emit("room-list"); //방 정보 요청
        });
        $("#btnRefresh").addEventListener("click", e => {
            this.socket.emit("room-list");
        });

        //디버그용 이벤트
        document.addEventListener("keydown", e => {
            console.log(e.keyCode);
            if (e.keyCode == 81) {
                //방만들기
                this.debug("tjsdn@gmail.com", "1234");
                setTimeout(() => {
                    this.socket.emit("create-room", { name: "더미 방입니다" });
                }, 500);
            }
            else if (e.keyCode == 87) {
                //만들어진 첫번째 방 들어가기
                this.debug("juju@naver.com", "1234");
                setTimeout(() => {
                    this.socket.emit("join-room", { roomName: 1 });
                }, 500);
            }
            else if (e.keyCode == 69) {
                this.debug("tjsdn@gmail.com", "1234");
            }
        });
    }

    addSocketEvent() {
        this.socket.on("register-response", data => {
            alert(data.msg);

            if (data.status) {
                $("#registerEmail").value = "";
                $("#registerName").value = "";
                $("#registerPass").value = "";
                $("#registerPassConfirm").value = "";
            }
        });

        this.socket.on("login-response", data => {
            //alert(data.msg);
            if (data.status) {
                $("#loginEmail").value = "";
                $("#loginPassword").value = "";
                this.pageContainer.style.left = "-1024px";

                this.makeRoomData(data.roomList);
            }
        });

        this.socket.on("room-list", data => {
            const { roomList } = data;
            this.makeRoomData(roomList);
        });

        //방 만들고 들어오기
        this.socket.on("enter-room", data => {
            this.pageContainer.style.left = "-2048px";
        });
        //남의 방 들어가기
        this.socket.on("join-room", data => {
            this.pageContainer.style.left = "-2048px";
            $("#btnStart").disabled = true;
        })
        this.socket.on("bad-access", data => {
            alert(data.msg);
        });

        this.socket.on("game-start", data => {
            //게임시작
            this.game.start();
            this.socket.emit("in-playing");

            $("#btnStart").disabled = true;
        });
    }

    creatRoom() {
        let result = prompt("방 이름을 입력하세요");

        if (result !== null || result !== "") {
            this.socket.emit("create-room", { name: result });
        }
        else {
            alert("방 이름은 비워둘 수 없습니다");
        }
    }

    registerProcess() {
        let email = $("#registerEmail").value;
        let name = $("#registerName").value;
        let pw = $("#registerPass").value;
        let pwc = $("#registerPassConfirm").value;


        //이런 로직은 서버에 넣자
        if (email.trim() == "" || name.trim() === "" || pw.trim() === "" || pwc !== pw) {
            alert("공백이거나 비밀번호가 일치하지 않습니다");
            return;
        }

        this.socket.emit("register-request", { email, name, pw, pwc });
    }

    makeRoomData(roomList) {

        const roomBox = $("#roomListBox");
        roomBox.innerHTML = "";
        roomList.forEach(room => {
            let div = document.createElement("div");
            div.classList.add("room");
            div.innerHTML = `<span class="name">${room.name}<span>
                            <span class="number>"${room.number}<span>`;

            div.addEventListener("click", e => {
                this.socket.emit("join-room", { roomName: room.roomName });
            });

            roomBox.appendChild(div);
        });
    }

    debug(id, pw) {
        $("#loginEmail").value = id;
        $("#loginPassword").value = pw;
        $("#btnLogin").click();
    }
}

window.addEventListener("load", e => {
    let app = new App();
});