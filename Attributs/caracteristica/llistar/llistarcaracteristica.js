window.onload = iniciar;

function iniciar() {
  carregarDadesLocal();
  document.getElementById("enviar").addEventListener("click", anarcrear);
  
}

function anarcrear() {
  window.location.href = "../crear/crearcaracteristica.html";
}

function carregarDadesLocal() {
  if (typeof Product === "undefined" || !Array.isArray(Product)) {
    console.log("Error: la variable 'Product' no está definida o no es un array.");
    return;
  }

  if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(Product));
  }

  if (typeof Family !== "undefined" && Array.isArray(Family) && !localStorage.getItem("Family")) {
    localStorage.setItem("Family", JSON.stringify(Family));
  }

  if (typeof Attribute !== "undefined" && Array.isArray(Attribute) && !localStorage.getItem("Attribute")) {
    localStorage.setItem("Attribute", JSON.stringify(Attribute));
  }

  const idSeleccionado = parseInt(localStorage.getItem("productoSeleccionado"));
  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const families = JSON.parse(localStorage.getItem("Family")) || [];
  const attributes = JSON.parse(localStorage.getItem("Attribute")) || [];

  const producto = productos.find(p => p.id == idSeleccionado);
  const contenedor = document.getElementById("detalle");
  const cos = document.getElementById("cuerpoTabla");

  contenedor.textContent = "";
  cos.textContent = "";

  if (!producto) {
    mostrarTexto(contenedor, "Producto no encontrado.");
    return;
  }

  mostrarTexto(contenedor, producto.name);

  let categoria = "Sense família";
  const familia = families.find(f => f.id === producto.family_id);
  if (familia) categoria = familia.name;

  const atributosFamilia = attributes.filter(a => a.family_id === producto.family_id);

  if (atributosFamilia.length === 0) {
    mostrarTexto(cos, "Esta familia no tiene características asociadas.");
    return;
  }

  atributosFamilia.forEach(caracteristica => {
    let fila = document.createElement("tr");

    let tdNom = document.createElement("td");
    let tdCategoria = document.createElement("td");
    let tdAcciones = document.createElement("td");

    mostrarTexto(tdNom, caracteristica.name);
    mostrarTexto(tdCategoria, categoria);

    const btnEditar = document.createElement("button");
    mostrarTexto(btnEditar, "Modificar");
    btnEditar.className = "btn btn-warning me-2";
    btnEditar.addEventListener("click", () => {
      localStorage.setItem("atributoAEditar", caracteristica.id);
      window.location.href = "../modificar/modificarcaracteristica.html";
    });

    const btnEliminar = document.createElement("button");
    mostrarTexto(btnEliminar, "Eliminar");
    btnEliminar.className = "btn btn-danger";
    btnEliminar.addEventListener("click", () => eliminarCaracteristica(caracteristica, fila));

    tdAcciones.appendChild(btnEditar);
    tdAcciones.appendChild(btnEliminar);

    fila.appendChild(tdNom);
    fila.appendChild(tdCategoria);
    fila.appendChild(tdAcciones);

    cos.appendChild(fila);
  });
}


function eliminarCaracteristica(caracteristica, fila) {
  if (!confirm("¿Seguro que deseas eliminar esta característica?")) return;

  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];

  attributes = attributes.filter(attr => attr.id !== caracteristica.id);
  localStorage.setItem("Attribute", JSON.stringify(attributes));

  fila.remove();
}




function mostrarTexto(contenedor, texto) {
  let p = document.createElement("p");
  p.appendChild(document.createTextNode(texto));
  contenedor.appendChild(p);
}
