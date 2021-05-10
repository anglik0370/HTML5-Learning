import {Game} from '/Game.js';

class App{
    constructor()
    {
        //App의 생성자
        this.init();
        this.debug();
        this.game = new Game();
        Game.instance = this.game;
    }

    init()
    {
        document.querySelector("#btnLogin").addEventListener("click", () => {
            let pc = document.querySelector(".page-container");
            pc.style.left = "-2048px";
        });

        document.querySelector("#btnStart").addEventListener("click", () => {
            this.game.start();
            this.game.score = 0;
        });
        document.querySelector("#btnStart").addEventListener("keydown", e => {
            e.preventDefault();
            return false;
        });
    }

    debug()
    {
        document.querySelector("#btnLogin").click();
    }
}

window.addEventListener("load", e => {
    let app = new App();
});