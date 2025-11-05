window.onload = iniciar;

function iniciar() {
    carregarDades();
    document.getElementById("enviar").addEventListener("click", guardarEnLocalStorage, false);
    document.getElementById("cancelar").addEventListener("click", cancelar);
}

function cancelar() {
    window.location.href = "../llistar/llistarcaracteristica.html";
}

function carregarDades() {
    let atributoId = parseInt(localStorage.getItem("atributoAEditar"));
    let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
    let families = JSON.parse(localStorage.getItem("Family")) || [];

    let attr = attributes.find(a => a.id === atributoId);
    let select = document.getElementById("familia");

    // Cargar families en el select
    select.textContent = "";
    let opcionInicial = document.createElement("option");
    opcionInicial.setAttribute("value", "");
    opcionInicial.appendChild(document.createTextNode("Selecciona una família"));
    select.appendChild(opcionInicial);

    families.forEach(familia => {
        if (familia && familia.name) {
            const option = document.createElement("option");
            option.setAttribute("value", familia.id);
            option.appendChild(document.createTextNode(familia.name));
            select.appendChild(option);
        }
    });

    if (attr) {
        document.getElementById("nom").value = attr.name;
        select.value = attr.family_id;
    }
}

function validarnom() {
    let element = document.getElementById("nom");
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

function validarfamilia() {
    let element = document.getElementById("familia");

    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has de seleccionar una família.");
        }
        return false;
    }
    return true;
}


function validar(e) {
    esborrarError();

    if (validarnom() && validarfamilia() && confirm("Confirma si vols modificar la característica?")) {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

function error(element, missatge) {
    const missatgeNode = document.createTextNode(missatge);
    document.getElementById("missatgeError").appendChild(missatgeNode);
    element.classList.add("error");
    element.focus();
}

function esborrarError() {
    document.getElementById("missatgeError").textContent = "";
    const formulari = document.forms[0];
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
    let nuevaFamiliaId = parseInt(document.getElementById("familia").value);

    let attrIndex = attributes.findIndex(a => a.id === atributoId);
    if (attrIndex !== -1) {
        let duplicado = attributes.find(a =>
            a.name === nuevoNombre &&
            a.family_id === nuevaFamiliaId &&
            a.id !== atributoId
        );

        if (duplicado) {
            alert("Ja existeix una característica amb aquest nom en aquesta família.");
            return;
        }

        // Actualizar  datos
        attributes[attrIndex].name = nuevoNombre;
        attributes[attrIndex].family_id = nuevaFamiliaId;
    }

    localStorage.setItem("Attribute", JSON.stringify(attributes));
    alert("Característica modificada correctament!");
    window.location.href = "../llistar/llistarcaracteristica.html";
}
