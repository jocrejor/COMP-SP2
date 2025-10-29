document.addEventListener("DOMContentLoaded", main);

function main() {
    const form = document.getElementById("formulariLogin");

    // Carregar usuaris
    let usuaris = JSON.parse(localStorage.getItem('usuaris')) || User;
    if (!localStorage.getItem('usuaris')) {
        localStorage.setItem('usuaris', JSON.stringify(usuaris));
    }

    // Comprovar si ja hi ha usuari loguejat
    const usuariActual = JSON.parse(localStorage.getItem("usuariActual"));
    if (usuariActual) {
        window.location.href = "usuaris.html";
        return;
    }

    // Validar formulari
    form.addEventListener("submit", validar);
}

/* ---------------- VALIDACIONS ---------------- */

function validarCorreu() {
    let element = document.getElementById("correu");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr un correu electrònic.");
        }
        if (element.validity.typeMismatch || element.validity.patternMismatch) {
            error(element, "Introdueix un correu electrònic vàlid.");
        }
        return false;
    }
    return true;
}

function validarContrasenya() {
    let element = document.getElementById("contrasenya");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr una contrasenya.");
        }
        if (element.validity.patternMismatch) {
            error(element, "La contrasenya ha de tindre entre 5 i 30 caràcters, amb majúscula, minúscula i símbol.");
        }
        return false;
    }
    return true;
}

function validar(e) {
    e.preventDefault(); 
    esborrarError();

    if (validarCorreu() && validarContrasenya()) {
        const email = document.getElementById("correu").value.trim();
        const password = document.getElementById("contrasenya").value.trim();

        const usuaris = JSON.parse(localStorage.getItem('usuaris'));
        const usuariTrobat = usuaris.find(u => u.email === email && u.password === password);

        if (usuariTrobat) {
            localStorage.setItem("usuariActual", JSON.stringify(usuariTrobat));
            window.location.href = "usuaris.html";
        } else {
            error(null, "Usuari o contrasenya incorrectes.");
        }
    }
}

/* ---------------- FUNCIONS D'ERROR ---------------- */

function error(element, missatge) {
    let miss = document.createTextNode(missatge);    
    document.getElementById("missatgeError").appendChild(miss);
    if (element) {
        element.classList.add("error");
        element.focus();
    }
}

function esborrarError() {
    const contError = document.getElementById("missatgeError");
    contError.replaceChildren();

    let formulari = document.getElementById("formulariLogin");
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}