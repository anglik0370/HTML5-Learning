class Poop {
    constructor(){
        this.x;
        this.y;
        this.speed;
        this.r;
        this.color = 'rgba(230, 150, 30, 0.5)';
        this.reset();
    }

    reset(){
        this.y = 0;
        this.x = 10 + Math.random() * 480;
        this.speed =  20 + Math.random() * 20;
        this.r = 5 + Math.random() * 5;

        let r;
        let g;
        let b;

        r = Math.random() * 255;
        g = Math.random() * 255;
        b = Math.random() * 255;

        this.color = 'rgba('+ r +','+ g + ','+ b + ', 0.5)';
    }

    update(){
        this.y += this.speed * 1/60;
        if(this.y > 800 - this.r)
        {
            this.reset();
        }
    }
    //1번과제 reset 시 색상도 랜덤하게 나오게 (0~255)
    render(ctx){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}