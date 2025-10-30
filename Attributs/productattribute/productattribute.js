window.onload = iniciar;

function iniciar() {
  carregarDadesLocal();
  mostrarNomProducte();
  carregarAtributs();

  document.getElementById("formulario").addEventListener("click", guardarProductAttribute, false);

}

function carregarDadesLocal() {
  if (typeof Product !== "undefined" && Array.isArray(Product) && !localStorage.getItem("Product")) {
    localStorage.setItem("Product", JSON.stringify(Product));
  }

  if (typeof Attribute !== "undefined" && Array.isArray(Attribute) && !localStorage.getItem("Attribute")) {
    localStorage.setItem("Attribute", JSON.stringify(Attribute));
  }

  if (typeof Productattribute !== "undefined" && Array.isArray(Productattribute) && !localStorage.getItem("Productattribute")) {
    localStorage.setItem("ProductAttribute", JSON.stringify(Productattribute));
  }

  mostrarLlistat();
}

function mostrarNomProducte() {
  let productoId = parseInt(localStorage.getItem("productoSeleccionado"));
  let productos = JSON.parse(localStorage.getItem("Product")) || [];
  let producto = productos.find(p => p.id === productoId);

  let contenedor = document.getElementById("nomProducte");
  contenedor.textContent = "";

  let text = producto
    ? "Producte: " + producto.name
    : "Cap producte seleccionat";

  contenedor.appendChild(document.createTextNode(text));
}

function mostrarLlistat() {
  let cos = document.getElementById("cuerpoTabla");
  cos.textContent = "";

  let products = JSON.parse(localStorage.getItem("Product")) || [];
  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  let productAttributes = JSON.parse(localStorage.getItem("ProductAttribute")) || [];

  if (productAttributes.length === 0) {
    let fila = document.createElement("tr");
    let celda = document.createElement("td");
    celda.setAttribute("colspan", "3");
    celda.classList.add("text-center", "text-muted");
    celda.appendChild(document.createTextNode("No hi ha Product Attributes registrats."));
    fila.appendChild(celda);
    cos.appendChild(fila);
    return;
  }

  productAttributes.forEach(pa => {
    let fila = document.createElement("tr");

    let tdProduct = document.createElement("td");
    let tdAttr = document.createElement("td");
    let tdValue = document.createElement("td");

    let producte = products.find(p => p.id === pa.product_id);
    let atribut = attributes.find(a => a.id === pa.attribute_id);

    let nomProducte = producte ? producte.name : "Sense producte";
    let nomAtribut = atribut ? atribut.name : "Sense atribut";

    tdProduct.appendChild(document.createTextNode(nomProducte));
    tdAttr.appendChild(document.createTextNode(nomAtribut));
    tdValue.appendChild(document.createTextNode(pa.value));

    fila.appendChild(tdProduct);
    fila.appendChild(tdAttr);
    fila.appendChild(tdValue);

    cos.appendChild(fila);
  });
}


function carregarAtributs() {
  let select = document.getElementById("atributo");
  select.textContent = "";

  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];

  let opcionInicial = document.createElement("option");
  opcionInicial.setAttribute("value", "");
  opcionInicial.appendChild(document.createTextNode("Selecciona un atribut"));
  select.appendChild(opcionInicial);

  attributes.forEach(attr => {
    if (attr && attr.name) {
      let option = document.createElement("option");
      option.setAttribute("value", attr.id);
      option.appendChild(document.createTextNode(attr.name));
      select.appendChild(option);
    }
  });
}

function validarAtributo() {
  let element = document.getElementById("atributo");

  if (!element.checkValidity() || element.value.trim() === "") {
    error(element, "Has de seleccionar un atribut vàlid.");
    return false;
  }
  return true;
}

function validarValor() {
  let element = document.getElementById("valor");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduir un valor.");
    } else if (element.validity.patternMismatch) {
      error(element, "El valor només pot contenir lletres i números (màxim 255 caràcters).");
    }
    return false;
  }
  return true;
}

function validar(e) {
  esborrarError();

  if (validarAtributo() && validarValor() && confirm("Confirma si vols afegir el Product Attribute?")) {
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

  let productAttributes = JSON.parse(localStorage.getItem("ProductAttribute")) || [];

  let existent = productAttributes.find(pa => pa.product_id === productId && pa.attribute_id === attributeId);

  if (existent) {
    existent.value = value;
  } else {
    productAttributes.push({ product_id: productId, attribute_id: attributeId, value });
  }

  localStorage.setItem("ProductAttribute", JSON.stringify(productAttributes));

  alert("Product Attribute guardat correctament!");
  mostrarLlistat();
  document.getElementById("atributo").value = "";
  document.getElementById("valor").value = "";
}





function error(element, missatge) {
  const cont = document.getElementById("missatgeError");
  cont.textContent = missatge;
  element.classList.add("error");
  element.focus();
}


function esborrarError() {
  const missatge = document.getElementById("missatgeError");
  missatge.textContent = "";

  const form = document.forms[0];
  for (let i = 0; i < form.elements.length; i++) {
    form.elements[i].classList.remove("error");
  }
}
