import {Game} from '/Game.js';

class App{
    constructor()
    {
        //App의 생성자
        this.socket = new io();
        this.addSocketEvent();
        this.pageContainer = $(".page-container");
        this.init();
        this.debug();
        this.game = new Game();
        Game.instance = this.game;
    }

    init()
    {
        $("#btnLogin").addEventListener("click", () => {
            let email = $("#loginEmail").value;
            let pw = $("#loginPassword").value;

            if(email.trim() === "" || pw.trim() === "")
            {
                alert("필수값이 비어있습니다");
                return;
            }
            
            this.socket.emit("login-process", {email, pw});
        });

        $("#btnStart").addEventListener("click", () => {
            this.game.start();
            this.game.score = 0;
        });
        $("#btnStart").addEventListener("keydown", e => {
            e.preventDefault();
            return false;
        });

        //회원가입 버튼 눌렸을때

        $("#btnRegister").addEventListener("click", () => {
            this.registerProcess();
        });
    }

    addSocketEvent()
    {
        this.socket.on("register-response", data => {
            alert(data.msg);

            if(data.status)
            {
                $("#registerEmail").value = "";
                $("#registerName").value = "";
                $("#registerPass").value = "";
                $("#registerPassConfirm").value = "";
            }
        });

        this.socket.on("login-response", data => {
            alert(data.msg);
            if(data.status)
            {
                $("#loginEmail").value = "";
                $("#loginPassword").value = "";
                this.pageContainer.style.left = "-1024px";
            }

        });
    }

    registerProcess()
    {
        let email = $("#registerEmail").value;
        let name = $("#registerName").value;
        let pw = $("#registerPass").value;
        let pwc = $("#registerPassConfirm").value;


        //이런 로직은 서버에 넣자
        if(email.trim() == "" || name.trim() === "" || pw.trim() === "" || pwc !== pw)
        {
            alert("공백이거나 비밀번호가 일치하지 않습니다");
            return;
        }

        this.socket.emit("register-request", {email, name, pw, pwc});

        debug();
    }

    debug()
    {
        $("#loginEmail").value = "JuJu@Jumail.com";
        $("#loginPassword").value = "49642";
        $("#btnLogin").click();
    }
}

function $(css)
{
    return document.querySelector(css);
}

window.addEventListener("load", e => {
    let app = new App();
});