let saveBtn = document.querySelector("#btnSave");
let loadBtn = document.querySelector("#btnLoad");
let closeBtn = document.querySelector("#btnClose");
let openBtn = document.querySelector("#btnOpen");
let nameInput = document.querySelector("#nameInput");
let scoreInput = document.querySelector("#scoreInput");
let massageInput = document.querySelector("#massageInput");
let rl = document.querySelector("#rankList");
let p = document.querySelector("#popup");

//이름, 점수, 남길말 3개의 입력을 받고 저장
//저장이 끝나면 각각의 칸을 지움

saveBtn.addEventListener("click", ()=>{

    let list = localStorage.getItem("list");

    if(list == null)
    {
        list = []; //리스트가 null일 시 새로운 배열 생성
    }
    else
    {
        list = JSON.parse(list);
    }

    let obj = {
        name : nameInput.value,
        score : scoreInput.value * 1,
        massage : massageInput.value
    };

    list.push(obj)

    console.log(obj);

    localStorage.setItem("list", JSON.stringify(list))

    nameInput.value = "";
    scoreInput.value = "";
    massageInput.value = "";
});

loadBtn.addEventListener("click", ()=>{

    let list = localStorage.getItem("list");

    if (list == null)
    {
        list = [];
    }
    else
    {
        list = JSON.parse(list);
    }

    rl.innerHTML = "";
    for(let i = 0; i < list.length; i++)
    {
        //console.log(list[i]);
        let div = document.createElement("div");
        div.innerHTML = `
            <span>${list[i].name}<span>
            <span>${list[i].score}<span>
            <span>${list[i].massage}<span>
            `;

        rl.appendChild(div);
    }
});

openBtn.addEventListener("click", ()=>{

    p.classList.add("on");
});

closeBtn.addEventListener("click", ()=>{

    p.classList.remove("on");
});