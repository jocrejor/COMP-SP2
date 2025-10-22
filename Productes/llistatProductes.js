document.addEventListener("DOMContentLoaded", main);

let llista = new Array();

function main () {
    document.getElementById("nouProducte").addEventListener("click",nouProducte);
    document.getElementById("modProducte").addEventListener("click",modProducte);

    obtindreProductes();
}

function nouProducte (){
    window.location.assign("altaProducte.html");
}

function modProducte (){
    window.location.assign("modificarProducte.html");
}

// Obtindre les dades
function obtindreProductes () {
      
    var arrProductes = ""; //obtindre de localstorage 
    // recorrer l'arrray i mostar en pantalla els elements.                
}

function esborrar (index) {
    llista.splice(index,1);
    localStorage.setItem("llistaProductes", JSON.stringify(llista));
}

function modificar (id,nom,preu,descripcio) {
    //guardar valors al local storage 
    localStorage.setItem("modProducte",JSON.stringify(producte));
}