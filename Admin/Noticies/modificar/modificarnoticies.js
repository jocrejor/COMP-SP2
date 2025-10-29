document.addEventListener("DOMContentLoaded", main);

function main() {
    document.getElementById("tornar").addEventListener("click", tornar);
    document.getElementById("enviar").addEventListener("click", guardarDades, false);
    arreplegarIndex();
}

function tornar() {
    window.location.assign("../llistar/llistarnoticies.html");
}

function guardarDades(e) {
    if (!validar(e)) {
        e.preventDefault();
        return;
    }

    let comprovararray = JSON.parse(localStorage.getItem("noticies")) || [];
    let dades = {
        title: document.getElementById("titol").value.trim(),
        description: document.getElementById("subtitol").value.trim(),
        body: document.getElementById("contingut").value.trim(),
        date: document.getElementById("data").value
    };

    let idEdicion = localStorage.getItem("indiceEdicion");

    if (idEdicion !== null) {
        let index = comprovararray.findIndex(n => n.id == idEdicion);

        if (index !== -1) {
            dades.id = comprovararray[index].id;
            dades.id_category = comprovararray[index].id_category;
            dades.id_user = comprovararray[index].id_user;
            dades.id_image = comprovararray[index].id_image;

            comprovararray[index] = dades;
            localStorage.removeItem("indiceEdicion");
            alert("Notícia modificada correctament!");
        } else {
            alert("No s'ha trobat la notícia per editar.");
        }
    } else {
        alert("No s'ha proporcionat cap ID d'edició.");
    }

    localStorage.setItem("noticies", JSON.stringify(comprovararray));

    document.getElementById("titol").value = "";
    document.getElementById("subtitol").value = "";
    document.getElementById("contingut").value = "";
    document.getElementById("data").value = "";

    window.location.href = "../llistar/llistarnoticies.html";
}

function arreplegarIndex() {
    let idEdicion = localStorage.getItem("indiceEdicion");

    if (idEdicion !== null) {
        let noticies = JSON.parse(localStorage.getItem("noticies")) || [];
        let noticia = noticies.find(n => n.id == idEdicion);

        if (noticia) {
            document.getElementById("id").value = noticia.id;
            document.getElementById("titol").value = noticia.title;
            document.getElementById("subtitol").value = noticia.description;
            document.getElementById("contingut").value = noticia.body;
            document.getElementById("data").value = noticia.date;
        }
    }
}

function validarTitol() {
    let element = document.getElementById("titol");

    if (!element.checkValidity()) {
        if (element.validity.valueMissing) error(element, "Deus d'introduïr un títol.");
        if (element.validity.patternMismatch) error(element, "El títol ha de tindre entre 2 i 15 caracters.");
        return false;
    }
    return true;
}

function validarsubtitol() {
    let element = document.getElementById("subtitol");

    if (!element.checkValidity()) {
        if (element.validity.valueMissing) error(element, "Deus d'introduïr un subtítol.");
        if (element.validity.patternMismatch) error(element, "El subtítol ha de tindre entre 2 i 15 caracters.");
        return false;
    }
    return true;
}

function validarcontingut() {
    let element = document.getElementById("contingut");

    if (!element.checkValidity()) {
        if (element.validity.valueMissing) error(element, "Deus d'introduïr un contingut.");
        if (element.validity.patternMismatch) error(element, "El contingut ha de tindre entre 2 i 255 caracters.");
        return false;
    }
    return true;
}

function validarData() {
    let data = document.getElementById("data");

    if (!data.checkValidity()) {
        if (data.validity.valueMissing) error(data, "Has d'introduïr una data.");
        return false;
    }
    return true;
}

function validar(e) {
    esborrarError();

    if (validarTitol() && validarsubtitol() && validarcontingut() && validarData() && confirm("Confirma si vols enviar el formulari")) {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

function error(element, missatge) {
    let contenedorError = document.getElementById("missatgeError");
    let p = document.createElement("p");
    let textNode = document.createTextNode(missatge);

    p.appendChild(textNode);
    contenedorError.appendChild(p);

    element.classList.add("error");
    element.focus();
}

function esborrarError() {
    let contenedorError = document.getElementById("missatgeError");

    while (contenedorError.firstChild) {
        contenedorError.removeChild(contenedorError.firstChild);
    }

    let formulari = document.forms[0];
    
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}
