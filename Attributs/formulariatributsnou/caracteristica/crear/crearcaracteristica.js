window.onload = iniciar;

function iniciar (){
    document.getElementById("enviar").addEventListener("click", guardarEnLocalStorage, false);
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

//  obtiene el siguiente id para una colección (autoincremental)
function getNextId(array) {
  if (!array || array.length === 0) return 1;
  return Math.max.apply(null, array.map(a => a.id || 0)) + 1;
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

  // Determinar family_id: si el producto tiene family_id lo usamos, si no, puedes asignar 1 o generar uno.
  const familyId = producto.family_id !== undefined ? producto.family_id : 1;


  let atributoExistente = attributes.find(a => a.name === name && (a.family_id == familyId));

  if (!atributoExistente) {
    const nuevoAttrId = getNextId(attributes);
    atributoExistente = {
      id: nuevoAttrId,
      name: name,
      family_id: familyId
    };
    attributes.push(atributoExistente);

    localStorage.setItem("Attribute", JSON.stringify(attributes));
  }


  const yaExistePA = productAttributes.some(pa =>
    pa.product_id == producto.id && pa.attribute_id == atributoExistente.id
  );

  if (yaExistePA) {
    for (let i = 0; i < productAttributes.length; i++) {
      if (productAttributes[i].product_id == producto.id && productAttributes[i].attribute_id == atributoExistente.id) {
        productAttributes[i].value = value;
        break;
      }
    }
  } else {
    // Insertamos nuevo registro product-attribute
    const nuevoProductAttribute = {
      product_id: producto.id,
      attribute_id: atributoExistente.id,
      value: value
    };
    productAttributes.push(nuevoProductAttribute);
  }

  // Guardar Productattribute actualizado
  localStorage.setItem("Productattribute", JSON.stringify(productAttributes));


  document.getElementById("nom").value = "";
  document.getElementById("valor").value = "";

  // Redirigir al listado
  window.location.href = "../llistar/llistarcaracteristica.html";
}

