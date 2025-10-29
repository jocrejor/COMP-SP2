let element;

window.onload = main;

function main (){
    element = document.getElementById("veureMissatge");
    console.log(element);

}

function missatge (mis) {    
    element.textContent="Pau i Victor son novios";
    element.style = "color:red" ;
    element.textContent = new Date;
}