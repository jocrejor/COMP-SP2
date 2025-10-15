window.onload = iniciar;

function iniciar (){
    document.getElementById("enviar").addEventListener("click", validar, false);
}

function validarnom () {
    var element = document.getElementById("nom");
    if (!element.checkValidity()){
        if (element.validity.valueMissing){
            error(element,"Has d'introduir un nom.");
        }
        if (element.validity.patternMismatch){
            error(element, "El nom ha de tindre entre 2 i 20 caràcters.");
        }
        return false;
    }
    return true;
}

function validarvalor () {
    var element = document.getElementById("valor");
    if (!element.checkValidity()){
        if (element.validity.valueMissing){
            error(element,"Has d'introduir un valor.");
        }
        if (element.validity.patternMismatch){
            error(element, "El valor ha de tindre entre 2 i 20 caràcters.");
        }
        return false;
    }
    return true;
}

function validar (e) {
    esborrarError();

    if (validarnom() && validarvalor() && confirm("Confirma si vols enviar el formulari")) {
        guardarEnLocalStorage();

        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

function error (element, missatge){
    let miss = document.createTextNode(missatge);    
    document.getElementById("missatgeError").appendChild(miss);
    element.classList.add("error");
    element.focus();
}

function esborrarError (){
    document.getElementById("missatgeError").textContent = "";
    let formulari = document.forms[0];
    for (let i = 0; i < formulari.elements.length; i++){
        formulari.elements[i].classList.remove("error");
    }
}

function guardarEnLocalStorage() {
    const nom = document.getElementById("nom").value.trim();
    const valor = document.getElementById("valor").value.trim();
    const idSeleccionado = localStorage.getItem("productoSeleccionado");

    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const producto = productos.find(p => p.id == idSeleccionado);

    if (!producto) {
        alert("Error: producto no encontrado");
        return;
    }
    const atributos = JSON.parse(localStorage.getItem("productAttributes")) || {};

    // Si no existeix producto mostrar la seua imformació
    if (!atributos[idSeleccionado]) {
        atributos[idSeleccionado] = {
            id: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            caracteristicas: []
        };
    }

    // Afegir les caracteristiques
    atributos[idSeleccionado].caracteristicas.push({
        nom: nom,
        valor: valor
    });
    localStorage.setItem("productAttributes", JSON.stringify(atributos));
    window.location.href = "../llistar/llistarcaracteristica.html";
}
