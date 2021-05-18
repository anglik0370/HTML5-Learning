import { Player } from '/Player.js';
import { Block } from '/Block.js';
import {$} from '/Query.js';

export class Game {
    static instance = null;

    constructor(socket) {
        this.socket = socket; //게임에서도 소켓을 쓸 수 있다
        this.addSocketEvent(); //소켓을 받아서 게임에서 사용할 소켓 이벤트들을 연동
        
        this.canvas = $("#gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.otherCanvas = $("#otherCanvas");
        this.oCtx = this.otherCanvas.getContext("2d");

        this.frame = null;
        this.player = null; //가독성을 위한 코드
        this.arr = [];
        this.addKeyEvent(); //반드시 한번만 실행

        this.time = 2000;
        this.minTime = 0.5;
        this.currentTime = 0;

        this.score = 0;
        this.scoreBox = $(".score-box");

        this.gameOverPanal = $("#gameOverBox");
        this.gameOver = false;

        this.addLineCount = 0;
    }

    setGameOver(win = false)
    {
        this.gameOver = true;
        clearInterval(this.frame);
        this.gameOverPanal.classList.add("on");

        if(win)
        {
            this.gameOverPanal.querySelector(".title").innerHTML = "너 승";
        }
        else
        {
            this.gameOverPanal.querySelector(".title").innerHTML = "너 패배";
            this.socket.emit("game-lose");
        }

        this.render();
    }

    addKeyEvent(){
        document.addEventListener("keydown" , e => {
            if(this.player == null || this.gameOver) return;

            if(e.keyCode == 37){
                this.player.moveLeft();
            }
            else if(e.keyCode == 39){
                this.player.moveRight();
            }
            else if(e.keyCode == 38){
                this.player.rotate();
            }
            else if(e.keyCode == 40){
                this.player.moveDown();
            }
            else if(e.keyCode == 32){
                this.player.straightDown();
            }
        })
    }

    update() {
        this.arr.forEach(row => row.forEach(item => item.update(1000/30)));

        this.currentTime += 1000/30;
        if(this.currentTime >= this.time)
        {
            this.currentTime = 0;
            this.player.moveDown();
        }

        //한줄을 삭제하면 스코어 증가
        //스코어는 화면에 표시
        //스코어가 올라갈 때 마다 time이 최대 0.5초까지 감소
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.arr.forEach(row => row.forEach(item => item.render(this.ctx)));

        this.scoreBox.innerHTML = `${this.score}점`

        this.player.render(this.ctx);
    }

    start() {
        if(this.frame != null) {
            clearInterval(this.frame);
        }
        this.frame = setInterval(() => {
            this.update();
            this.render();
        }, 1000 / 30);

        this.gameOverPanal.classList.remove("on");
        this.gameOver = false;

        this.arr = [];

        for(let i = 0; i < 20; i++) {
            let row = [];

            for(let j = 0; j < 10; j++) {
                row.push(new Block(j, i));
            }
            this.arr.push(row);
        }
        // this.debug();
        this.player = new Player();
        this.time = 2000;
        this.score = 0;
    }
    //한줄이 꽉찼는지 검사
    checkLine()
    {
        let removedCount = 0; //몇줄이 사라질건지를 카운트

        for(let i = this.arr.length - 1; i >= 0; i--)
        {
            let full = true;
            for(let j = 0; j < this.arr[i].length; j++)
            {
                if(!this.arr[i][j].fill)
                {
                    full = false;
                    break;
                }
            }

            if(full)
            {
                this.lineRemove(i); //i 윗줄을 한칸씩 내려
                this.addScore();

                i++;
                removedCount++;
            }
        }

        if(this.addLineCount > 0)
        {
            if(this.addLineCount > removedCount) 
            {
                this.addLineCount -= removedCount;
                removedCount = 0;
            }
            else
            {
                removedCount -= this.addLineCount;
                this.addLineCount = 0;
            }
        }

        if(removedCount > 0)
        {
            this.socket.emit("remove-line", {count:removedCount});
        }

        //내가 만약 상대한테 몇줄 받았다면

        if(this.addLineCount > 0)
        {
            this.addLine(this.addLineCount);
            this.addLineCount = 0;
        }

        let sendData = [];

        for(let i = 0; i < this.arr.length; i++)
        {
            sendData.push(this.arr[i].map( x => ({color:x.color, fill:x.fill})));
        }

        //console.log(sendData);
        this.socket.emit("game-data", {sendData});
    }

    //게임에서 받게 될 소켓 이벤트들으 붙여주는 메서드
    addSocketEvent()
    {
        this.socket.on("game-data", data =>
        {
            const {sendData, sender} = data;
            //2인 이상 게임에서는 sender를 사용해야 함
            this.drawOtherCanvas(sendData);
        });
        this.socket.on("remove-line" , data => 
        {
            const {count, sender} = data;
            this.addLineCount += count; //받은 카운트 만큼 addLineCount에 합산
        });
        this.socket.on("game-win", data =>
        {
            this.setGameOver(true);
        });
        this.socket.on("leave-player", data =>
        {
            const {isAdmin} = data;

            if(isAdmin)
            {
                $("#btnStart").disabled = false;
            }
            else
            {
                this.setGameOver(true);
            }
        });
    }

    addLine(count)
    {
        for(let i = count; i < this.arr.length; i++)
        {
            for(let j = 0; j < this.arr[i].length; j++)
            {
                this.arr[i - count][j].copyBlockData(this.arr[i][j]);
            }
        }

        for(let i = this.arr.length - count; i < this.arr.length; i++)
        {
            let empty = Math.floor(Math.random() * this.arr[i].length);//0~9까지 하나

            for(let j = 0; j < this.arr[i].length; j++)
            {
                if(j !== empty)
                {
                    this.arr[i][j].setBlockData(true, "#555");
                }
                else
                {
                    this.arr[i][j].setBlockData(false, "#fff");
                }
            }
        }
    }

    addScore() {
        this.score++;
        if(this.score % 5 == 0 && this.time > 100)
        {
            this.time -= 300;

            if(this.time < 500) this.time = 100;
        }
    }
    //해당 줄의 위쪽부터 한칸씩 내리기
    lineRemove(from)
    {
        for(let i = from; i >= 1; i--)
        {
            for(let j = 0; j < this.arr[i].length; j++)
            {
                this.arr[i][j].copyBlockData(this.arr[i-1][j]);
            }
            for(let j = 0; j > this.arr[0].length; j++)
            {
                this.arr[0][j].setBlockData(false); //맨 윗줄 날리기
            }
        }
    }

    drawOtherCanvas(data)
    {
        this.oCtx.clearRect(0, 0, 100, 200);

        for(let i = 0; i < data.length; i++)
        {
            for(let j = 0; j < data[i].length; j++)
            {
                if(data[i][j].fill)
                {
                    this.oCtx.fillStyle = data[i][j].color;
                    this.oCtx.fillRect(j*10, i*10, 10, 10);
                }
            }
        }
    }

    debug() {
        this.arr[19][0].setBlockData(true, "#007bff");
        this.arr[19][1].setBlockData(true, "#007bff");
        this.arr[19][2].setBlockData(true, "#007bff");
        this.arr[19][3].setBlockData(true, "#007bff");
    }
}