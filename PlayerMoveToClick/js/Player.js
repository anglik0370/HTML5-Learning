class Player {
    constructor(x, y){
        this.speed = 200;
        this.sprite = new Image();
        this.sprite.src = "/images/mario.png";
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 20;

        this.targetX = x;
        this.targetY = y;

        this.distance = 0;
    }

    setTarget(x, y){
        this.targetX = x - this.w/2;
        this.targetY = y - this.h/2;

        console.log(this.targetX);
        console.log(this.targetY);
        console.log(this.x);
        console.log(this.y);
    }

    update(d){
        this.distance = Math.sqrt((this.targetX - this.x) * (this.targetX - this.x) + (this.targetY - this.y) * (this.targetY - this.y));

        if (this.distance > 2)
        {
            this.x += ((this.targetX - this.x) / this.distance) * this.speed * d;
            this.y += ((this.targetY - this.y) / this.distance) * this.speed * d;
        }

        //let tx = this.targetX;
        //let ty = this.targetY;
        //let x = this.x;
        //let y = this.y;

        //let dx = tx = x;
        //let dy = ty = y;

        //let d = Math.sqrt(dx * dx + dy * dy);

        //let vx = 0;
        //let vy = 0;

        // if(d > 1)
        // {
        //     vx = dx / d;
        //     vy = dy / d;
        // }


        // this.x += this.speed * d;

        // if (this.x >= 600 - this.w || this.x <= 0)
        // this.speed *= -1;
    }

    render(ctx){
        //ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.drawImage(this.sprite, this.x, this.y, this.w, this.h);
    }

    checkCol(){

    }
}