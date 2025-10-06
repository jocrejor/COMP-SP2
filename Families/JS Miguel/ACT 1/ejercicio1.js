
let element;

//window.onload = main;
document.addEventListener("DOMContentLoaded", main);

function main () {
    element = document.getElementById("veureMissatge");
    console.log(element);
    console.error(element);
}

let novaFuncio = () => {

}

function missatge (mis) {
    element.textContent = new Date;
    //element.innerHTML = "<strong>NOOOOOOOOOOOOOOOOOO</strong>";
    element.style = "color : red";
}