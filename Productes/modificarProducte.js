document.addEventListener("DOMContentLoaded", main);

function main() {
    document.getElementById("tornar").addEventListener("click",tornar);
    document.getElementById("btnModificar").addEventListener("click", validar, false);

    // recuperar les dades del locastorage
    
}

function tornar () {
    window.location.assign("llistatProductes.html");
}

function validarNom() {
    return true;

}



function validarPreu() {
    return true;
}


function validarDescripcio() {
    return true;
}


function validar(e) {
    esborrarError();
    e.preventDefault();
    if (validarNom() && 
        validarPreu() &&
        validarDescripcio()) {

        enviarFormulari();
        return true;

    } else {
        return false;
    }
}



function error(element, missatge) {
    const textError = document.createTextNode(missatge);
    const elementError = document.getElementById("missatgeError")
    elementError.appendChild(textError)
    element.classList.add( "error" )
    element.focus();
}

function esborrarError() {
    
    let formulari = document.forms[0].elements;
        for (let ele of formulari) {
            ele.classList.remove("error")
        }    
    document.getElementById("missatgeError").replaceChildren(); 

}

// enviar dades
function enviarFormulari() {

    // esborrar el localstorage 
    localStorage.removeItem("modAuto");

    // tornar al llistat 
    window.location.assign("llistatProductes.html");
    
}