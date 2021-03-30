class Player {
    constructor(x, y){
        this.speed = 120;
        this.sprite = new Image();
        this.sprite.src = "/Mario.png";
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 20;

        this.targetX = x;
        this.targetY = y;
    }

    setTarget(x, y){
        this.targetX = x;
        this.targetY = y;

        console.log(this.targetX);
        console.log(this.targetY);
        console.log(this.x);
        console.log(this.y);
    }

    update(d){
        if ((this.targetX - this.x) != 0 && (this.targetY - this.y) != 0) {
            this.x += ((this.targetX - this.x) / (Math.sqrt((this.targetX - this.x) * (this.targetX - this.x) + (this.targetY - this.y) * (this.targetY - this.y)))) * this.speed * d;
            this.y += ((this.targetY - this.y) / (Math.sqrt((this.targetX - this.x) * (this.targetX - this.x) + (this.targetY - this.y) * (this.targetY - this.y)))) * this.speed * d;
        }else {
            
        }
        

        console.log(Math.sqrt((this.targetX - this.x) * (this.targetX - this.x) + (this.targetY - this.y) * (this.targetY - this.y)));

        // console.log(this.x);
        // console.log(this.y);
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