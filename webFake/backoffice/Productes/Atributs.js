window.onload = iniciar;

let currentPage = 1;
const maxim = 10;
let startPage = 1; 
const pagesPerGroup = 3; 

function iniciar() {
  carregarDadesLocal();
  document.getElementById("enviar").addEventListener("click", anarcrear);
}

function anarcrear() {
  window.location.href = "./AtributsAlta.html";
}
function carregarDadesLocal() {
  if (typeof Family !== "undefined" && Array.isArray(Family) && !localStorage.getItem("Family")) {
    localStorage.setItem("Family", JSON.stringify(Family));
  }

  if (typeof Attribute !== "undefined" && Array.isArray(Attribute) && !localStorage.getItem("Attribute")) {
    localStorage.setItem("Attribute", JSON.stringify(Attribute));
  }

  mostrarPagina();
}

function mostrarPagina() {
  let families = JSON.parse(localStorage.getItem("Family")) || [];
  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];

  let cos = document.getElementById("cuerpoTabla");
  cos.textContent = "";

  if (attributes.length === 0) {
    mostrarimformacio(cos, "No hay características registradas.");
    return;
  }

  let inici = (currentPage - 1) * maxim;
  let final = inici + maxim;
  let paginaAtributos = attributes.slice(inici, final);

  paginaAtributos.forEach(caracteristica => {
    let familia = families.find(f => f.id === caracteristica.family_id);
    let nombreFamilia = familia ? familia.name : "Sense família";

    let fila = document.createElement("tr");
    let tdId = document.createElement("td");
    let tdNom = document.createElement("td");
    let tdCategoria = document.createElement("td");
    let tdAcciones = document.createElement("td");

    mostrarimformacio(tdId, caracteristica.id);
    mostrarimformacio(tdNom, caracteristica.name);
    mostrarimformacio(tdCategoria, nombreFamilia);

    let btnEditar = document.createElement("button");
    mostrarimformacio(btnEditar, "Modificar");
    btnEditar.className = "btn btn-warning me-2";
    btnEditar.addEventListener("click", () => {
      localStorage.setItem("atributoAEditar", caracteristica.id);
      window.location.href = "./AtributsModificar.html";
    });

    let btnEliminar = document.createElement("button");
    mostrarimformacio(btnEliminar, "Eliminar");
    btnEliminar.className = "btn btn-danger";
    btnEliminar.addEventListener("click", () => eliminarCaracteristica(caracteristica, fila));

    tdAcciones.appendChild(btnEditar);
    tdAcciones.appendChild(btnEliminar);
    fila.appendChild(tdId);
    fila.appendChild(tdNom);
    fila.appendChild(tdCategoria);
    fila.appendChild(tdAcciones);

    cos.appendChild(fila);
  });

 crearPaginacion(attributes);
}


function crearPaginacion(attributes) {
  const totalPages = Math.ceil(attributes.length / maxim);
  const pagContainer = document.getElementById("pagination");
  if (!pagContainer) return;
  pagContainer.textContent = "";

  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  // Boto anterior
  let liPrev = document.createElement("li");
  liPrev.setAttribute("class", "page-item" + (startPage === 1 ? " disabled" : ""));
  
  let linkprevi = document.createElement("a");
  linkprevi.setAttribute("class", "page-link");
  linkprevi.setAttribute("href", "#");
  linkprevi.appendChild(document.createTextNode("«"));

  linkprevi.addEventListener("click", function (e) {
    e.preventDefault();
    if (startPage > 1) {
      startPage -= pagesPerGroup;
      currentPage = startPage;
      mostrarPagina();
    }
  });

  liPrev.appendChild(linkprevi);
  pagContainer.appendChild(liPrev);

  // Pagines numerades
  for (let i = startPage; i <= endPage; i++) {
    let li = document.createElement("li");
    li.setAttribute("class", "page-item" + (i === currentPage ? " active" : ""));
    
    let a = document.createElement("a");
    a.setAttribute("class", "page-link");
    a.setAttribute("href", "#");
    a.appendChild(document.createTextNode(i));

    a.addEventListener("click", function (e) {
      e.preventDefault();
      currentPage = i;
      mostrarPagina();
    });

    li.appendChild(a);
    pagContainer.appendChild(li);
  }
  // Boto seguent
  let liNext = document.createElement("li");
  liNext.setAttribute("class", "page-item" + (endPage >= totalPages ? " disabled" : ""));
  
  let siguiente = document.createElement("a");
  siguiente.setAttribute("class", "page-link");
  siguiente.setAttribute("href", "#");
  siguiente.appendChild(document.createTextNode("»"));

  siguiente.addEventListener("click", function (e) {
    e.preventDefault();
    if (endPage < totalPages) {
      startPage += pagesPerGroup;
      currentPage = startPage;
      mostrarPagina();
    }
  });

  liNext.appendChild(siguiente);
  pagContainer.appendChild(liNext);
}


function mostrarimformacio(contenedor, texto) {
  let p = document.createElement("p");
  p.appendChild(document.createTextNode(texto));
  contenedor.appendChild(p);
}

function eliminarCaracteristica(caracteristica, fila) {
  if (!confirm("¿Seguro que deseas eliminar esta característica?")) return;

  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  attributes = attributes.filter(attr => attr.id !== caracteristica.id);
  localStorage.setItem("Attribute", JSON.stringify(attributes));

  fila.remove();
}