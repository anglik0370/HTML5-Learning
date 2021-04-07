class App
{
    constructor()
    {
        this.player = new Player(290, 190);
        this.canvas = document.querySelector("#myGame");
        this.ctx = this.canvas.getContext("2d");

        this.제가한거아니에요 = [];
        for (let i = 0; i < 10; i++)
        {
            this.제가한거아니에요.push(new Coin());
        }

        this.canvas.addEventListener("click",e => {
            this.player.setTarget(e.offsetX, e.offsetY);
        });

        this.gameOver = false;

        setInterval(() => {

            this.update();
            this.render();
    
        }, 1000/60);
    }

    setGameClear()
    {
        alert("클리어!");
    }

    update() {
        if (this.gameOver) return;
 
        this.player.update(1/60);

        for (let i = 0; i < this.제가한거아니에요.length; i++)
        {
            this.제가한거아니에요[i].update(1/60);

            if (this.제가한거아니에요[i].checkCol(this.player))
            {
                if (this.제가한거아니에요[i].isGray)
                {
                    this.gameOver = true;
                    alert("게임오버!");
                }
                else
                {
                    this.제가한거아니에요[i].remove();
                }
            }
        }

        let coinCnt = this.제가한거아니에요.filter(x => x.active).length;

        if(coinCnt == 0)
        {
            this.setGameClear();
        }
    }

    render() {
        this.ctx.clearRect(0, 0, 600, 400);
        this.player.render(this.ctx);

        for (let i = 0; i < this.제가한거아니에요.length; i++)
        {
            this.제가한거아니에요[i].render(this.ctx);
        }
    }
}