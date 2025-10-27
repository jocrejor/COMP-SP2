
window.onload = iniciar;

function iniciar (){
    document.getElementById("enviar").addEventListener("click", guardarEnLocalStorage, false);
    carregardades();
}

function carregardades(){
 const atributoId = parseInt(localStorage.getItem("atributoAEditar"));
  const attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  const productAttributes = JSON.parse(localStorage.getItem("Productattribute")) || [];

  const attr = attributes.find(a => a.id === atributoId);
  const productatribut = productAttributes.find(producatr => producatr.attribute_id === atributoId);

    if (!attr || !productatribut) {
    alert("Error: Atribut no trobat.");
    window.location.href = "../llistar/llistarcaracteristica.html";
    return;
  }

  document.getElementById("nom").value = attr.name;
  document.getElementById("valor").value = productatribut.value;


}


function validarnom () {
    var element = document.getElementById("nom");
    if (!element.checkValidity()){
        if (element.validity.valueMissing){
            error(element,"Has d'introduir un nom.");
        }
        if (element.validity.patternMismatch){
            error(element, "El nom ha de tindre entre 2 i 100 caràcters.");
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
            error(element, "El valor ha de tindre entre 2 i 255 caràcters.");
        }
        return false;
    }
    return true;
}

function validar (e) {
    esborrarError();

    if (validarnom() && validarvalor() && confirm("Confirma si vols enviar el formulari")) {
       

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

function guardarEnLocalStorage(e) {
  if (!validar(e)) return;

  e.preventDefault();

  const atributoId = parseInt(localStorage.getItem("atributoAEditar"));
  const attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  const productAttributes = JSON.parse(localStorage.getItem("Productattribute")) || [];

  const nuevoNombre = document.getElementById("nom").value.trim();
  const nuevoValor = document.getElementById("valor").value.trim();
//Actualiza el name
  const attrIndex = attributes.findIndex(a => a.id === atributoId);
  if (attrIndex !== -1) {
    attributes[attrIndex].name = nuevoNombre;
  }

  // Actualiza el valor
  const producteatribut = productAttributes.findIndex(prodatr => prodatr.attribute_id === atributoId);
  if (producteatribut !== -1) {
    productAttributes[producteatribut].value = nuevoValor;
  }

  localStorage.setItem("Attribute", JSON.stringify(attributes));
  localStorage.setItem("Productattribute", JSON.stringify(productAttributes));

  alert("Característica modificada correctament!");
  window.location.href = "../llistar/llistarcaracteristica.html";
}
