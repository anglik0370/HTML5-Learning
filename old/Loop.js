let canvas = document.querySelector("#gameCanvas");
let ctx = canvas.getContext("2d");

let x = 0;
let y = 0;

let width = 40;
let height = 40;

let ex = 50;
let ey = 60;
let eWidth = 30;
let eHeight = 100;

let e2x = 300;
let e2y = 0;
let e2Width = 30;
let e2Height = 100;

let speed = 200;
let eSpeed = 200;
let e2Speed = 400;

let beforeX = 0;
let beforeY = 0;

let keyArr = [];

let img = new Image();
img.src = "/Player.jpg";

document.addEventListener("keydown", function(e)
{
    keyArr[e.keyCode] = true;
});

document.addEventListener("keyup", function(e)
{
    keyArr[e.keyCode] = false;
});

function update()
{
    beforeX = x;
    beforeY = y;

    if(keyArr[37])
    {
        x -= speed * 1/60;
    }
    if(keyArr[38])
    {
        y -= speed * 1/60;
    }
    if(keyArr[39])
    {
        x += speed * 1/60;
    }
    if(keyArr[40])
    {
        y += speed * 1/60;
    }

    if(x <= 0)
    {
        x = 1;
    }
    if( x >= 960 - width)
    {
        x = 959 - width;
    }
    if(y <= 0)
    {
        y = 1;
    }
    if(y >= 480 - height)
    {
        y = 480 - height;
    }
    
    if(x + width > ex && x < ex + eWidth && y + height > ey && y < ey + eHeight)
    {
        x = 0;
        y = 0;
    }
    if(x + width > e2x && x < e2x + e2Width && y + height > e2y && y < e2y + e2Height)
    {
        x = 0;
        y = 0;
    }

    ey += eSpeed * 1/60;

    if(ey >= 480 - eHeight) eSpeed *= -1
    if(ey <= 0) eSpeed *= -1

    e2y += e2Speed * 1/60;

    if(e2y >= 480 - e2Height) e2Speed *= -1
    if(e2y <= 0) e2Speed *= -1

}
function render()
{
    ctx.clearRect(0,0,960, 480);

    ctx.drawImage(img ,x, y, width, height);

    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    ctx.fillRect(ex, ey, eWidth, eHeight);

    ctx.fillStyle = "rgba(255, 0, 0, 1)";
    ctx.fillRect(e2x, e2y, e2Width, e2Height);
}

setInterval(function()
{
    update();
    render();
}, 1000/60);
//시간간격동안 함수를 실행, 이때 시간은 ms 단위