class Human {

    constructor(name = "겜마고", age = 2){
        this.name = name
        this.age = age
    }

    move(){
        this.x += 10;
        console.log("이동", this.x);
    }
}