class Game{
    constructor(canvas){
        this.objectList = [];
        let img = new Image();
        img.src = "/player.jpg";
        let p = new Player(220, 740, 100, 60, 60, img);
        this.objectList.push(p);
        
        for(let i = 0; i < 50; i++){
            this.objectList.push(new Poop());
        }

        this.gameOver = false;
        this.time = 0;
        //맞으면 게임오버되고 게임오버되면 멈추게
        this.ctx = canvas.getContext("2d");

        setInterval(()=>{
            this.update();
            this.render(this.ctx);
        }, 1000/60);
    }

    update(){
        if(this.gameOver) return;

        this.objectList.forEach(item => item.update())

        let p = this.objectList[0];
        for(let i = 1; i < this.objectList.length; i++){
            if(p.checkCol(this.objectList[i])){
                this.gameOver = true;
                break;
            }
        }

        this.time += 10/6;
    }

    //시간이 표시되게
    render(){
        if(this.gameOver) return;

        this.ctx.clearRect(0, 0, 500, 800);

        this.ctx.fillStyle = "#000";
        this.ctx.font = "25px Arial";
        this.ctx.fillText(Math.round(this.time) / 100, 420, 30);

        this.objectList.forEach(item => item.render(this.ctx))
    }
}