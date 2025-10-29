window.onload = iniciar;

function iniciar() {
  carregarDadesLocal();
  document.getElementById("enviar").addEventListener("click", anarcrear);
}

function anarcrear() {
  window.location.href = "../crear/crearcaracteristica.html";
}

function carregarDadesLocal() {
  if (typeof Family !== "undefined" && Array.isArray(Family) && !localStorage.getItem("Family")) {
    localStorage.setItem("Family", JSON.stringify(Family));
  }

  if (typeof Attribute !== "undefined" && Array.isArray(Attribute) && !localStorage.getItem("Attribute")) {
    localStorage.setItem("Attribute", JSON.stringify(Attribute));
  }

  const families = JSON.parse(localStorage.getItem("Family")) || [];
  const attributes = JSON.parse(localStorage.getItem("Attribute")) || [];

  const cos = document.getElementById("cuerpoTabla");

  cos.textContent = "";

  if (attributes.length === 0) {
    mostrarTexto(cuerpoTabla, "No hay características registradas.");
    return;
  }

  attributes.forEach(caracteristica => {
    const familia = families.find(f => f.id === caracteristica.family_id);
    const nombreFamilia = familia ? familia.name : "Sense família";

    let fila = document.createElement("tr");

    let tdNom = document.createElement("td");
    let tdCategoria = document.createElement("td");
    let tdAcciones = document.createElement("td");

    mostrarTexto(tdNom, caracteristica.name);
    mostrarTexto(tdCategoria, nombreFamilia);

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
