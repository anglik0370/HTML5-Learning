import { Block } from '/Block.js';

export class NextBlock
{
    constructor()
    {
        this.arr = [];

        for(let i = 0; i < 4; i++)
        {
            this.arr[i] = [];

            for(let j = 0; j < 4; j++)
            {
                this.arr[i][j] = new Block(j, i, 24);
            }
        }

        this.nextCanvas = document.querySelector("#nextCanvas");
        this.nextCtx = this.nextCanvas.getContext("2d");
    }

    render()
    {
        this.nextCtx.clearRect(0, 0, 100, 100);

        //this.arr.forEach(row => row.forEach(col => col.render(ctx)));

        for(let i = 0; i < this.arr.length; i++)
        {
            for(let j = 0; j < this.arr[i].length; j++)
            {
                this.arr[i][j].render(this.nextCtx);
            }
        }
    }

    setNextBlock(data, color)
    {
        let x = 1;
        let y = 1;

        //data = [{x:0, y:0}, {x:-1, y:0}, {x:-1, y:-1}, {x:0, y:-1}];

        if( x + Math.min(...data.map(x=> x.x)) < 0) x++;
        if( y + Math.min(...data.map(x=> x.y)) < 0) y++;

        this.arr.forEach(row => row.forEach(col => col.setBlockData(false, "#fff")));

        for(let i = 0; i < data.length; i++)
        {
            let point = data[i];
            this.arr[y + point.y][x + point.x].setBlockData(true, color);
        }
    }
}