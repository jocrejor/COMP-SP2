window.onload = iniciar;

function iniciar() {
  carregarDadesLocal();
  document.getElementById("enviar").addEventListener("click", anarcrear);
}

function anarcrear() {
  window.location.href = "../crear/crearcaracteristica.html";
}

function carregarDadesLocal() {
  let idSeleccionado = localStorage.getItem("productoSeleccionado");
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  let atributos = JSON.parse(localStorage.getItem("productAttributes")) || {};
  let producto = productos.find(p => p.id == idSeleccionado);

  let contenedor = document.getElementById("detalle");
let cos = document.getElementById("cuerpoTabla");

  if (!producto) {
    mostrarTexto(contenedor, "Producto no encontrado.");
    return;
  }

  mostrarTexto(contenedor, producto.nombre);

  let caracteristicas = atributos[idSeleccionado]?.caracteristicas || [];

  if (caracteristicas.length === 0) {
    mostrarTexto(cos, "Este producto no tiene características aún.");
  } else {


cos.textContent  = "";
    caracteristicas.forEach(caracteristica => {
      let fila = document.createElement("tr");

      let tdNom = document.createElement("td");
      let tdValor = document.createElement("td");

      tdNom.appendChild(document.createTextNode(caracteristica.nom));
      tdValor.appendChild(document.createTextNode(caracteristica.valor));

      fila.appendChild(tdNom);
      fila.appendChild(tdValor);
      cos.appendChild(fila);
    });


  }
}

function mostrarTexto(contenedor, texto) {
  let p = document.createElement("p");
  p.appendChild(document.createTextNode(texto));
  contenedor.appendChild(p);
}
