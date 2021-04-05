let btn = document.querySelector("#startBtn");
btn.addEventListener("click", function () {
    alert("게임시작? 어림도없지")
});

let canvas = document.querySelector("#gameCanvas");
let ctx = canvas.getContext("2d");

let cp = document.querySelector("#colorPicker");
let bold = document.querySelector("#bold");

let draw = document.querySelector("#drawRaido");
let remove = document.querySelector("#removeRaido");

let isDown = false;
let x = 0;
let y = 0;

canvas.addEventListener("mousedown", function (e) {
    isDown = true;
    x = e.offsetX;
    y = e.offsetY;
});
canvas.addEventListener("mouseup", function (e) {
    isDown = false;
});
canvas.addEventListener("mousemove", function (e) {
    if (!isDown) return;

    if (draw.checked) {
        ctx.lineWidth = bold.value;
        ctx.lineCap = "round";
        ctx.strokeStyle = cp.value;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    else {
        ctx.clearRect(x, y, bold.value, bold.value);
    }

    x = e.offsetX;
    y = e.offsetY;
});
