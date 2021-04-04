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

        if (this.distance < 1) {
            this.x = this.x;
            this.y = this.y;
        } else{
            this.x += ((this.targetX - this.x) / this.distance) * this.speed * d;
            this.y += ((this.targetY - this.y) / this.distance) * this.speed * d;
        }

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