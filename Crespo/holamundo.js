
let element;

//window.onload = main;
document.addEventListener("DOMContentLoaded", main);



function main () {
let element = document.getElementById("accio");
 element.addEventListener("click", function(){
    let entrada = document.getElementById("entrada").value;
    missatge(entrada);
 });
document.getElementsByName("esborrar")[0].addEventListener("click", esborrarElement);
 
}



function missatge (mis){
    //let element = document.getElementById("veureMissatge");
    let element = document.getElementsByTagName("p")[0];
    //let element = document.getElementsByName("veureMissatge")[0];
    //let element = document.querySelector("#veureMissatge");
    
    let elementNou = document.createElement("strong")
    let textElementNou = document.createTextNode(mis);
    elementNou.appendChild(textElementNou);
    elementNou.addEventListener("mouseover", function(){    
        elementNou.style.color = "red";
    });

    element.appendChild(elementNou);
    
}

function esborrarElement(){
    let element = document.getElementsByTagName("p")[0];
    if (element.hasChildNodes()){
        element.removeChild(element.lastChild);
    } else {
        alert("No hi ha elements a esborrar");
    }
   // element.querySelector("strong").remove();
}