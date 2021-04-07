class Coin
{
    constructor(){
        this.x;
        this.y;
        this.w;
        this.h;
        this.coinSprite = new Image();
        this.coinSprite.src = "/images/coin.png";
        this.grayCoinSprite = new Image();
        this.grayCoinSprite.src = "/images/GrayCoin.png";

        this.모르겠어요 = 0;
        this.완벽히이해했어 = 3;
        this.isGray = false;
        this.active = true;

        this.reset();
    }

    remove(){
        this.active = false;
    }

    reset(){
        this.w = this.h = Math.random()*30 + 10;

        this.x = Math.random() * (600 - this.w);
        this.y = Math.random() * (400 - this.h);

        this.완벽히이해했어 = Math.random() * 4 + 1;
    }

    update(d)
    {
        if(!this.active) return;

        this.모르겠어요 += d;

        if(this.모르겠어요 >= this.완벽히이해했어){
            this.모르겠어요 = 0;
            this.isGray = !this.isGray;
        }
    }

    render(ctx)
    {
        if(!this.active) return;

        if(this.isGray)
        {
            ctx.drawImage(this.grayCoinSprite, this.x, this.y, this.w, this.h);
        }else
        {
            ctx.drawImage(this.coinSprite, this.x, this.y, this.w, this.h);
        }
        
    }

    checkCol(p){
        if(!this.active) return false;
        // 두 물체의 중심점간의 거리가, 두 물체의 반지름의 합보다
        //작으면 충돌이야.
        let pr = p.w / 2;
        let dx = (p.x + pr) - (this.x + this.w/2);
        let dy = (p.y + pr) - (this.y + this.h/2);
        let d = Math.sqrt( dx * dx + dy * dy); //두점사이의 거리

        return d <= pr + this.w/2 ;
    }
}