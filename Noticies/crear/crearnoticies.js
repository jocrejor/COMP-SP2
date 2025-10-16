document.addEventListener("DOMContentLoaded", main);

function main () {
    document.getElementById("tornar").addEventListener("click", tornar);
    document.getElementById("enviar").addEventListener("click", guardardadeslocalsstorage, false);
}

function tornar () {
    window.location.assign("../llistar/llistarnoticies.html");
}

function validartitol() {
    var element = document.getElementById("titol");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Deus d'introduïr un titol.");
        }
        if (element.validity.patternMismatch) {
            error(element, "El titol ha de tindre entre 2 i 15 caracters.");
        }
        //error(element);
        return false;
    }
    return true;
}
function validarcontingut() {
    var element = document.getElementById("contingut");
    let valor = element.value.trim();
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Deus d'introduïr una descripció.");
        }
        return false;
    }
    let pattern = /^[A-Za-z\s]{2,255}$/;
    if (!pattern.test(valor)) {
        error(element, "El contingut ha de tindre entre 2 i 255 caracters i només lletres.");
        return false;
    }

    return true;
}


function validarsubtitol() {
    var element = document.getElementById("subtitol");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Deus d'introduïr una descripció.");
        }
        if (element.validity.patternMismatch) {
            error(element, "El contingut  ha de tindre entre 2 i 15 caracters.");
        }
        //error(element);
        return false;
    }
    return true;
}

function validarData() {
    var data = document.getElementById("data");
    if (!data.checkValidity()) {
        if (data.validity.valueMissing) {
            error(data, "Has d'introduïr una data.");
        }
        if (data.validity.patternMismatch) {
            error(data, "La data ha de seguir el format YYYY-MM-DD.");
        }

        return false;
    }

    return true;

}

function guardardadeslocalsstorage(e) {
    if (!validar()) {
        e.preventDefault();
        return;
    }
    let comprovararray = JSON.parse(localStorage.getItem("noticies")) || [];
    let id = 1;
    if (comprovararray.length > 0) {
        let ultim_id = comprovararray[comprovararray.length - 1].id;
        id = ultim_id + 1;
    }
    let dades = {
        id: id,
        title: document.getElementById("titol").value.trim(),
        description: document.getElementById("subtitol").value.trim(),
        body: document.getElementById("contingut").value.trim(),
        date: document.getElementById("data").value,

        //  valors aleatoris hasta que no lligcam de la base de dades
        id_category: Math.floor(Math.random() * 100) + 1,
        id_user: Math.floor(Math.random() * 1000) + 1,
        id_image: Math.floor(Math.random() * 500) + 1
    };

    comprovararray.push(dades);
    localStorage.setItem("noticies", JSON.stringify(comprovararray));
    alert("Formulari guardat en localStorage!");

    document.getElementById("titol").value = "";
    document.getElementById("subtitol").value = "";
    document.getElementById("contingut").value = "";
    document.getElementById("data").value = "";
    window.location.href = "../llistar/llistarnoticies.html";
}



function validar(e) {
    esborrarError();
    if (validartitol() && validarsubtitol() && validarcontingut() && validarData() && confirm("Confirma si vols enviar el formulari")) {
        return true;

    }
    else {
        e.preventDefault();
        return false;
    }
}


function error(element, missatge) {
    let miss = document.createTextNode(missatge);
    document.getElementById("missatgeError").appendChild(miss);
    element.classList.add("error");
    element.focus();
}


function esborrarError() {
    document.getElementById("missatgeError").textContent = "";
    let formulari = document.forms[0];
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}