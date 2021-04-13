let a = 10;
let b = 0;

setTimeout(()=>
{
    b = 20;
}, 1000);

console.log(a + b);