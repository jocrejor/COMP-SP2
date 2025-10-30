window.onload = iniciar;

function iniciar() {
  mostrarnomproducte(); 
  carregarAttributes();       
  document.getElementById("enviar").addEventListener("click", guardarProductAttribute, false);
  document.getElementById("cancelar").addEventListener("click", cancelar);
}

function cancelar() {
  window.location.href = "../llistar/lilistarproductattribute.html";
}

function mostrarnomproducte() {
    if (typeof Product !== "undefined" && Array.isArray(Product) && !localStorage.getItem("productos")) {
  localStorage.setItem("productos", JSON.stringify(Product));
}

  let productoId = localStorage.getItem("productoSeleccionado");
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  let producto = null;

  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id == productoId) {
      producto = productos[i];
      break;
    }
  }

  let h5 = document.createElement("h5");
  h5.className = "text-center mb-4 fw-bold fs-4";
  let texto = document.createTextNode(producto ? "Producto seleccionado: " + producto.name : "Producto no encontrado");
  h5.appendChild(texto);

  let contenedor = document.getElementById("formulario");
  contenedor.insertBefore(h5, contenedor.firstChild);
}

function carregarAttributes() {
  if (typeof Attribute !== "undefined" && Array.isArray(Attribute) && !localStorage.getItem("Attribute")) {
    localStorage.setItem("Attribute", JSON.stringify(Attribute));
  }

  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  let select = document.getElementById("atributo");

  if (!select) return;

  while (select.firstChild) select.removeChild(select.firstChild);

  let opcionInicial = document.createElement("option");
  opcionInicial.value = "";
  opcionInicial.appendChild(document.createTextNode(" Selecciona un atribut "));
  select.appendChild(opcionInicial);

  for (let i = 0; i < attributes.length; i++) {
    let attr = attributes[i];
    if (attr && attr.name) {
      let option = document.createElement("option");
      option.value = attr.id;
      option.appendChild(document.createTextNode(attr.name));
      select.appendChild(option);
    }
  }
}

function validarAtributo() {
  let element = document.getElementById("atributo");
  if (!element.checkValidity()) {
    if (element.validity.valueMissing) error(element, "Has de seleccionar un atribut.");
    return false;
  }
  return true;
}

function validarValor() {
  let element = document.getElementById("valor");
  if (!element.checkValidity()) {
    if (element.validity.valueMissing) error(element, "Has d'introduir un valor.");
    if (element.validity.patternMismatch) error(element, "El valor només pot contenir lletres i números (màxim 255 caràcters).");
    return false;
  }
  return true;
}


function error(element, mensaje) {
  let nodo = document.createTextNode(mensaje);
  document.getElementById("missatgeError").appendChild(nodo);
  element.classList.add("error");
  element.focus();
}

function esborrarError() {
  let missatge = document.getElementById("missatgeError");
  while (missatge.firstChild) missatge.removeChild(missatge.firstChild);

  let form = document.forms[0];
  for (let i = 0; i < form.elements.length; i++) {
    form.elements[i].classList.remove("error");
  }
}

function validar(e) {
  esborrarError();

  if ( validarAtributo() && validarValor() && confirm("Confirma si vols enviar el formulari")) {
    return true;
  } else {
    e.preventDefault();
    return false;
  }
}

function guardarProductAttribute(e) {
  if (!validar(e)) return;

  let productId = parseInt(localStorage.getItem("productoSeleccionado"));
  let attributeId = parseInt(document.getElementById("atributo").value);
  let value = document.getElementById("valor").value.trim();

  let productAttributes = JSON.parse(localStorage.getItem("Productattribute")) || [];

  let existente = productAttributes.find(pa => pa.product_id === productId && pa.attribute_id === attributeId);

  if (existente) {
    existente.value = value;
  } else {
    productAttributes.push({ product_id: productId, attribute_id: attributeId, value });
  }

  localStorage.setItem("ProductAttribute", JSON.stringify(productAttributes));

alert("Creacio del productattribute exitosa");
  document.getElementById("atributo").value = "";
  document.getElementById("valor").value = "";
}
