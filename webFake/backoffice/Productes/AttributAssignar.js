window.onload = iniciar;

let atributsCreades = [];

function iniciar() {
  carregarDadesLocal();
  mostrarNomProducte();
  carregarAtributs();
  mostrarAtributsCreades();
  document.getElementById("formulario").addEventListener("click", guardarProductAttribute, false);
}

function carregarDadesLocal() {
  if (typeof Product !== "undefined" && Array.isArray(Product) && !localStorage.getItem("Product")) {
    localStorage.setItem("Product", JSON.stringify(Product));
  }

  if (typeof Attribute !== "undefined" && Array.isArray(Attribute) && !localStorage.getItem("Attribute")) {
    localStorage.setItem("Attribute", JSON.stringify(Attribute));
  }
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

function carregarAtributs() {
  let select = document.getElementById("atributo");
  select.textContent = "";

  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  let productoId = parseInt(localStorage.getItem("productoSeleccionado"));
  let productos = JSON.parse(localStorage.getItem("Product")) || [];
  
  let producto = productos.find(p => p.id === productoId);
  let opcionInicial = document.createElement("option");
  opcionInicial.setAttribute("value", "");
  opcionInicial.appendChild(document.createTextNode("Selecciona un atribut"));
  select.appendChild(opcionInicial);

  let atributosFiltrados = attributes.filter(a => a.family_id === producto.family_id);
  atributosFiltrados.forEach(attr => {
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

  if (!element.checkValidity() ) {
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

function mostrarAtributsCreades() {
  const cos = document.getElementById("cuerpoTabla");
  cos.textContent = "";

  const products = JSON.parse(localStorage.getItem("Product")) || [];
  const attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  const productAttributes = JSON.parse(localStorage.getItem("ProductAttribute")) || [];

  if (productAttributes.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.setAttribute("colspan", "3");
    celda.classList.add("text-center", "text-muted");
    celda.appendChild(document.createTextNode("Encara no has creat cap productattribute."));
    fila.appendChild(celda);
    cos.appendChild(fila);
    return;
  }

  productAttributes.forEach(proattr => {
    const fila = document.createElement("tr");

    const tdProduct = document.createElement("td");
    const tdAttr = document.createElement("td");
    const tdValue = document.createElement("td");

    const producte = products.find(p => p.id === proattr.product_id);
    const atribut = attributes.find(a => a.id === proattr.attribute_id);

    tdProduct.appendChild(document.createTextNode(producte ? producte.name : "Sense producte"));
    tdAttr.appendChild(document.createTextNode(atribut ? atribut.name : "Sense atribut"));
    tdValue.appendChild(document.createTextNode(proattr.value));

    fila.appendChild(tdProduct);
    fila.appendChild(tdAttr);
    fila.appendChild(tdValue);
    cos.appendChild(fila);
  });
}

function guardarProductAttribute(e) {
  if (!validar(e)) return;

  const productId = parseInt(localStorage.getItem("productoSeleccionado"));
  const attributeId = parseInt(document.getElementById("atributo").value);
  const value = document.getElementById("valor").value.trim();

  let productAttributes = JSON.parse(localStorage.getItem("ProductAttribute")) || [];

  let existent = productAttributes.find(pa => pa.product_id === productId && pa.attribute_id === attributeId);

  if (existent) {
    // Actualiza  localStorage
    existent.value = value;
  } else {
    const nou = { product_id: productId, attribute_id: attributeId, value };
    productAttributes.push(nou);
  }

  localStorage.setItem("ProductAttribute", JSON.stringify(productAttributes));

  const temporal = atributsCreades.findIndex(pa => pa.product_id === productId && pa.attribute_id === attributeId);
  if (temporal >= 0) {
    // Si ya existia actualiza el valor
    atributsCreades[temporal].value = value;
  } else {
    atributsCreades.push({ product_id: productId, attribute_id: attributeId, value });
  }

mostrarAtributsCreades();
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
