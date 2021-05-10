export class Block {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 35;
        this.padding = 2;

        this.fill = false;
        this.color = "#ff0000";
    }

    setBlockData(fill, color) {
        this.fill = fill;
        this.color = color;
    }

    update(delta) {

    }
    
    render(ctx) {
        //사각형 그리는 친구 xy랑 wh
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.strokeRect(this.x * this.size + this.padding, 
                       this.y * this.size + this.padding, 
                       this.size, this.size);

        if(this.fill) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x * this.size + this.padding, 
                this.y * this.size + this.padding, 
                this.size, this.size);
        }
    }

    copyBlockData(other)
    {
        this.fill = other.fill;
        this.color = other.color;
    }
}