let element; // Variable global

window.onload = main;

function main (){
    element = document.getElementById("veureMissatge");
    console.log(element);
}

function missatge (mis){
    element.textContent="És la 1 i 12 minuts";
    element.style="color:red";
}
