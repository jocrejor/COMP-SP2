window.onload = iniciar;

function iniciar() {
  carregarDadesLocal();
  document.getElementById("enviar").addEventListener("click", anarcrear);
}

function anarcrear() {
  window.location.href = "../crear/crearcaracteristica.html";
}

function carregarDadesLocal() {
  let idSeleccionado = parseInt(localStorage.getItem("productoSeleccionado"));
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  let productAttributes = JSON.parse(localStorage.getItem("Productattribute")) || [];

  let producto = productos.find(p => p.id == idSeleccionado);
  let contenedor = document.getElementById("detalle");
  let cos = document.getElementById("cuerpoTabla");

  if (!producto) {
    mostrarTexto(contenedor, "Producto no encontrado.");
    return;
  }

  mostrarTexto(contenedor, producto.nombre);

  // Filtrar atributs de eixe producte
  const caracteristicasProducto = productAttributes.filter(
    pa => pa.product_id == idSeleccionado
  );

  if (caracteristicasProducto.length === 0) {
    cos.textContent = "";
    mostrarTexto(cos, "Este producto no tiene características aún.");
    return;
  }

  cos.textContent = "";

  caracteristicasProducto.forEach(pa => {
    // Buscar el atributo por ID para obtener su nombre
    const attr = attributes.find(a => a.id == pa.attribute_id);

    let fila = document.createElement("tr");
    let tdNom = document.createElement("td");
    let tdValor = document.createElement("td");

   mostrarTexto(tdNom, attr ? attr.name : "(Atributo desconocido)");
  mostrarTexto(tdValor, pa.value);

    fila.appendChild(tdNom);
    fila.appendChild(tdValor);
    cos.appendChild(fila);
  });
}


function mostrarTexto(contenedor, texto) {
  let p = document.createElement("p");
  p.appendChild(document.createTextNode(texto));
  contenedor.appendChild(p);
}
