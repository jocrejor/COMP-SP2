   window.onload = iniciar;

    function iniciar() {
      carregarDadesLocal();
       document.getElementById("enviar").addEventListener("click", anarcrear);
    }

    function anarcrear(){
window.location.href = "../crear/crearcaracteristica.html";

}

    function carregarDadesLocal() {
      let idSeleccionado = localStorage.getItem("productoSeleccionado");
      let productos = JSON.parse(localStorage.getItem("productos")) || [];

      let buscaridproducto = productos.find(p => p.id == idSeleccionado);

      let contenedor = document.getElementById("detalle");

      if (buscaridproducto) {
        let pNombre = document.createElement("p");
        let textoNombre = document.createTextNode("Nombre del producto: " + buscaridproducto.nombre);
        pNombre.appendChild(textoNombre);
        contenedor.appendChild(pNombre);
      } else {
        let pError = document.createElement("p");
        let textoError = document.createTextNode("Producto no encontrado.");
        pError.appendChild(textoError);
        contenedor.appendChild(pError);
      }
    }