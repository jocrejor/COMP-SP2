window.onload = iniciar;

function iniciar() {
  carregarDadesLocal();
  document.getElementById("enviar").addEventListener("click", anarcrear);
}

function anarcrear() {
  window.location.href = "../crear/crearproductattribuct.html";
}

function carregarDadesLocal() {

  if (typeof Product !== "undefined" && Array.isArray(Product) && !localStorage.getItem("Product")) {
    localStorage.setItem("Product", JSON.stringify(Product));
  }

  if (typeof Attribute !== "undefined" && Array.isArray(Attribute) && !localStorage.getItem("Attribute")) {
    localStorage.setItem("Attribute", JSON.stringify(Attribute));
  }

  if (typeof ProductAttribute !== "undefined" && Array.isArray(ProductAttribute) && !localStorage.getItem("ProductAttribute")) {
    localStorage.setItem("ProductAttribute", JSON.stringify(ProductAttribute));
  }


  let products = JSON.parse(localStorage.getItem("Product")) || [];
  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  let productAttributes = JSON.parse(localStorage.getItem("ProductAttribute")) || [];

  let cos = document.getElementById("cuerpoTabla");
  cos.textContent = "";

  if (productAttributes.length === 0) {
    mostrarInformacio(cos, "No hi ha Product Attributes registrats.");
    return;
  }

  productAttributes.forEach(pa => {
    let fila = document.createElement("tr");

    let tdProduct = document.createElement("td");
    let tdAttribute = document.createElement("td");
    let tdValue = document.createElement("td");

    let producte = products.find(p => p.id === pa.product_id);
    let nomProducte = producte ? producte.name : "Sense producte";

    let atribut = attributes.find(a => a.id === pa.attribute_id);
    let nomAtribut = atribut ? atribut.name : "Sense atribut";

    mostrarInformacio(tdProduct, nomProducte);
    mostrarInformacio(tdAttribute, nomAtribut);
    mostrarInformacio(tdValue, pa.value);

    fila.appendChild(tdProduct);
    fila.appendChild(tdAttribute);
    fila.appendChild(tdValue);

    cos.appendChild(fila);
  });
}

function mostrarInformacio(contenidor, text) {
  let p = document.createElement("p");
  p.appendChild(document.createTextNode(text));
  contenidor.appendChild(p);
}
