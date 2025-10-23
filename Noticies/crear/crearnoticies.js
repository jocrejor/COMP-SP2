document.addEventListener("DOMContentLoaded", main);

function main() {
    document.getElementById("tornar").addEventListener("click", tornar);
    document.getElementById("enviar").addEventListener("click", guardarDades, false);
}

// Torna al llistat
function tornar () {
    window.location.assign("../llistar/llistarnoticies.html");
}

function validarTitol () {
    var titol = document.getElementById("titol");

    if (!titol.checkValidity()) {
        if (titol.validity.valueMissing) {
            error(titol, "Deus d'introduïr un titol.");
        }
        if (titol.validity.patternMismatch) {
            error(titol, "El titol ha de tindre entre 2 i 50 caracters.");
        }
        return false;
    }

    return true;
}

function validarSubtitol () {
    var subtitol = document.getElementById("subtitol");

    if (!subtitol.checkValidity()) {
        if (subtitol.validity.valueMissing) {
            error(subtitol, "Deus d'introduïr una descripció.");
        }
        if (subtitol.validity.patternMismatch) {
            error(subtitol, "El subtitol ha de tindre entre 5 i 100 caracters.");
        }

        return false;
    }
    return true;
}

function validarContingut () {
    var contingut = document.getElementById("contingut");

    if (!contingut.checkValidity()) {
        if (contingut.validity.valueMissing) {
            error(contingut, "Deus d'introduïr una descripció.");
        }

        if (contingut.validity.patternMismatch) {
            error(contingut, "El contingut ha de tindre entre 2 i 255 caracters.");
        }

        return false;
    }

    return true;
}

function validarData () {
    var data = document.getElementById("data");

    if (!data.checkValidity()) {
        if (data.validity.valueMissing) {
            error(data, "Has d'introduïr una data.");
        }

        return false;
    }

    return true;

}

function guardarDades (e) {
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

        // Valors aleatoris hasta que no lligcam de la base de dades
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

function validar (e) {
    esborrarError();

    if (validarTitol() && validarSubtitol() && validarContingut() && validarData() && confirm("Confirma si vols enviar el formulari")) {
        return true;
    }

    else {
        e.preventDefault();
        return false;
    }
}

function error (element, missatge) {
    let msg = document.createTextNode(missatge);

    document.getElementById("missatgeError").appendChild(msg);
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
