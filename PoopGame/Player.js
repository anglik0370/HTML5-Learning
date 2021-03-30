class Player{
    constructor(x, y, speed, w, h, sprite){
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.w = w; //너비
        this.h = h; //높이
        this.sprite = sprite;

        this.input = new InputSystem();
    }

    update(){
        if(this.input.getKey(37)){
            this.x -= this.speed * (1/60);
        }
        if(this.input.getKey(39)){
            this.x += this.speed * (1/60);
        }
    }

    render(ctx){
        ctx.drawImage(this.sprite, this.x, this.y, this.w, this.h);
    }

    checkCol(poop){
        let px = this.x + this.w /2;
        let py = this.y + this.h /2;

        let d = Math.sqrt((poop.x - px) * (poop.x - px) + (poop.y - py) * (poop.y - py));

        return d < poop.r + this.w / 2;
    }
}