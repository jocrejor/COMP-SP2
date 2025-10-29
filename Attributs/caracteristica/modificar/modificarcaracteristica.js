window.onload = iniciar;

function iniciar() {
    document.getElementById("enviar").addEventListener("click", guardarEnLocalStorage, false);
    carregardades();
    document.getElementById("cancelar").addEventListener("click", cancelar);
}

function cancelar() {
    window.location.href = "../llistar/llistarcaracteristica.html";
}

function carregardades() {
    let atributoId = parseInt(localStorage.getItem("atributoAEditar"));
    let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];

    let attr = attributes.find(a => a.id === atributoId);

    if (attr) {
        document.getElementById("nom").value = attr.name;
    }
}

function validarnom() {
    var element = document.getElementById("nom");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduir un nom.");
        }
        if (element.validity.patternMismatch) {
            error(element, "El nom ha de tindre entre 2 i 100 caràcters.");
        }
        return false;
    }
    return true;
}

function validar(e) {
    esborrarError();

    if (validarnom() && confirm("Confirma si vols enviar el formulari")) {
        return true;
    } else {
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

function guardarEnLocalStorage(e) {
    if (!validar(e)) return;

    e.preventDefault();

    let atributoId = parseInt(localStorage.getItem("atributoAEditar"));
    let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];

    let nuevoNombre = document.getElementById("nom").value.trim();

    // Actualiza el name
    let attrIndex = attributes.findIndex(a => a.id === atributoId);
    if (attrIndex !== -1) {
        attributes[attrIndex].name = nuevoNombre;
    }

    localStorage.setItem("Attribute", JSON.stringify(attributes));

    alert("Característica modificada correctament!");
    window.location.href = "../llistar/llistarcaracteristica.html";
}
