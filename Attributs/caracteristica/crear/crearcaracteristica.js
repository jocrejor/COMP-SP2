window.onload = iniciar;

function iniciar (){
    document.getElementById("enviar").addEventListener("click", guardarEnLocalStorage, false);
      document.getElementById("cancelar").addEventListener("click", cancelar);
}

  function cancelar() {

    window.location.href = "../llistar/llistarcaracteristica.html";
      
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


function comprobarid(id) {

  if (!id || !id.some(e => e && e.id !== undefined)) return 1;

  let maxId = 0;
  for (const item of id) {
    const id = item && typeof item.id === "number" ? item.id : 0;
    if (id > maxId) maxId = id;
  }
  return maxId + 1;
}


function guardarEnLocalStorage(e) {

  if (!validar(e)) {
    return;
  }

  const name = document.getElementById("nom").value.trim();  
  const value = document.getElementById("valor").value.trim(); 
  const idSeleccionado = localStorage.getItem("productoSeleccionado");

  // obtener producto
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const producto = productos.find(p => p.id == idSeleccionado);

  if (!producto) {
    alert("Error: producto no encontrado");
    return;
  }


  const attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  const productAttributes = JSON.parse(localStorage.getItem("Productattribute")) || [];

  // Determina family_id
  const familyId = producto.family_id !== undefined ? producto.family_id : 1;


  let atributoExistente = attributes.find(a => a.name === name && (a.family_id == familyId));

  if (!atributoExistente) {
    const nuevoAttrId = comprobarid(attributes);
    atributoExistente = {
      id: nuevoAttrId,
      name: name,
      family_id: familyId
    };
    attributes.push(atributoExistente);
// Guarda atribut
    localStorage.setItem("Attribute", JSON.stringify(attributes));
  }


  const existeproatr = productAttributes.some(proatr =>
    proatr.product_id == producto.id && proatr.attribute_id == atributoExistente.id
  );

  if (existeproatr) {
    for (let i = 0; i < productAttributes.length; i++) {
      if (productAttributes[i].product_id == producto.id && productAttributes[i].attribute_id == atributoExistente.id) {
        productAttributes[i].value = value;
        break;
      }
    }
  } else {
    // Insertar nou registre en productattribute
    const nuevoProductAttribute = {
      product_id: producto.id,
      attribute_id: atributoExistente.id,
      value: value
    };
    productAttributes.push(nuevoProductAttribute);
  }

  // Guarda Productattribute 
  localStorage.setItem("Productattribute", JSON.stringify(productAttributes));


  document.getElementById("nom").value = "";
  document.getElementById("valor").value = "";

  window.location.href = "../llistar/llistarcaracteristica.html";
}

