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
  contenedor.textContent = "";

  if (!producto) {
    mostrarTexto(contenedor, "Producto no encontrado.");
    return;
  }

  mostrarTexto(contenedor, "Nombre del producto: " + producto.nombre);

  let caracteristicas = atributos[idSeleccionado]?.caracteristicas || [];

  if (caracteristicas.length === 0) {
    mostrarTexto(contenedor, "Este producto no tiene características aún.");
  } else {

    let tabla = document.createElement("table");

    let cabecera = document.createElement("tr");
    let nombre = document.createElement("th");
    let valor = document.createElement("th");
    nombre.appendChild(document.createTextNode("Nombre característica"));
    valor.appendChild(document.createTextNode("Valor"));
    cabecera.appendChild(nombre);
    cabecera.appendChild(valor);
    tabla.appendChild(cabecera);

    caracteristicas.forEach(caracteristica => {
      let fila = document.createElement("tr");

      let tdNom = document.createElement("td");
      let tdValor = document.createElement("td");

      tdNom.appendChild(document.createTextNode(caracteristica.nom));
      tdValor.appendChild(document.createTextNode(caracteristica.valor));

      fila.appendChild(tdNom);
      fila.appendChild(tdValor);
      tabla.appendChild(fila);
    });

    contenedor.appendChild(tabla);
  }
}

function mostrarTexto(contenedor, texto) {
  let p = document.createElement("p");
  p.appendChild(document.createTextNode(texto));
  contenedor.appendChild(p);
}
