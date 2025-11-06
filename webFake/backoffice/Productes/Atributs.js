window.onload = iniciar;

let seguentpagina = 1;
let maxim = 10;
let paginainicial = 1;
let paginesmaximpaginacio = 3;
let filtroFamilia = "";

function iniciar() {
  carregarDadesLocal();

 document.getElementById("enviar").addEventListener("click", anarcrear);
document.getElementById("applyFilter").addEventListener("click", aplicarFiltre);
document.getElementById("clearFilter").addEventListener("click", netejarFiltre);
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

  carregarFamilies();
  mostrarPagina();
}

function carregarFamilies() {
  let select = document.getElementById("familia");
  if (!select) return;

  select.textContent = "";

  let opcioinicial = document.createElement("option");
  opcioinicial.setAttribute("value", "");
  opcioinicial.appendChild(document.createTextNode("Selecciona una família"));
  select.appendChild(opcioinicial);

  let families = JSON.parse(localStorage.getItem("Family")) || [];

  families.forEach(familia => {
    if (familia && familia.name) {
      let opcio = document.createElement("option");
      opcio.setAttribute("value", familia.id);
      opcio.appendChild(document.createTextNode(familia.name));
      select.appendChild(opcio);
    }
  });
}

function mostrarPagina() {
  let families = JSON.parse(localStorage.getItem("Family")) || [];
  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];

  if (filtroFamilia) {
    attributes = attributes.filter(attr => String(attr.family_id) === String(filtroFamilia));
  }

  const cos = document.getElementById("cuerpoTabla");
  if (!cos) return;
  cos.textContent = "";

  if (attributes.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.setAttribute("colspan", "4");
    td.className = "text-center py-3";
    td.appendChild(document.createTextNode("No hi ha característiques registrades."));
    tr.appendChild(td);
    cos.appendChild(tr);
    crearPaginacion(attributes);
    return;
  }

  let inici = (seguentpagina - 1) * maxim;
  let final = inici + maxim;
  let paginaAtributos = attributes.slice(inici, final);

  paginaAtributos.forEach(caracteristica => {
    let familia = families.find(f => String(f.id) === String(caracteristica.family_id));
    let nomFamilia = familia ? familia.name : "Sense família";

    let tr = document.createElement("tr");

    let tdId = document.createElement("td");
    tdId.appendChild(document.createTextNode(caracteristica.id));

    let tdNom = document.createElement("td");
    tdNom.appendChild(document.createTextNode(caracteristica.name));

    let tdFam = document.createElement("td");
    tdFam.appendChild(document.createTextNode(nomFamilia));

    let tdAcc = document.createElement("td");

    let btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-warning me-2";
    btnEditar.appendChild(document.createTextNode("Modificar"));
    btnEditar.addEventListener("click", () => {
      localStorage.setItem("atributoAEditar", caracteristica.id);
      window.location.href = "./AtributsModificar.html";
    });

    let btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-danger";
    btnEliminar.appendChild(document.createTextNode("Eliminar"));
    btnEliminar.addEventListener("click", () => eliminarCaracteristica(caracteristica, tr));

    tdAcc.appendChild(btnEditar);
    tdAcc.appendChild(btnEliminar);

    tr.appendChild(tdId);
    tr.appendChild(tdNom);
    tr.appendChild(tdFam);
    tr.appendChild(tdAcc);

    cos.appendChild(tr);
  });

  crearPaginacion(attributes);
}

function crearPaginacion(attributes) {
  let pagContainer = document.getElementById("pagination");
  if (!pagContainer) return;
  pagContainer.textContent = "";

  let totalPages = Math.max(1, Math.ceil(attributes.length / maxim));
  if (seguentpagina > totalPages) seguentpagina = totalPages;
  let endPage = Math.min(paginainicial + paginesmaximpaginacio - 1, totalPages);

  let liPrev = document.createElement("li");
  liPrev.className = "page-item" + (paginainicial === 1 ? " disabled" : "");
  let linkPrev = document.createElement("a");
  linkPrev.className = "page-link";
  linkPrev.setAttribute("href", "#");
  linkPrev.appendChild(document.createTextNode("«"));
  linkPrev.addEventListener("click", e => {
    e.preventDefault();
    if (paginainicial > 1) {
      paginainicial -= paginesmaximpaginacio;
      seguentpagina = paginainicial;
      mostrarPagina();
    }
  });
  liPrev.appendChild(linkPrev);
  pagContainer.appendChild(liPrev);

  for (let i = paginainicial; i <= endPage; i++) {
    let li = document.createElement("li");
    li.className = "page-item" + (i === seguentpagina ? " active" : "");
    const a = document.createElement("a");
    a.className = "page-link";
    a.setAttribute("href", "#");
    a.appendChild(document.createTextNode(i));
    a.addEventListener("click", e => {
      e.preventDefault();
      seguentpagina = i;
      mostrarPagina();
    });
    li.appendChild(a);
    pagContainer.appendChild(li);
  }
  let liNext = document.createElement("li");
  liNext.className = "page-item" + (endPage >= totalPages ? " disabled" : "");
  let linkNext = document.createElement("a");
  linkNext.className = "page-link";
  linkNext.setAttribute("href", "#");
  linkNext.appendChild(document.createTextNode("»"));
  linkNext.addEventListener("click", e => {
    e.preventDefault();
    if (endPage < totalPages) {
      paginainicial += paginesmaximpaginacio;
      seguentpagina = paginainicial;
      mostrarPagina();
    }
  });
  liNext.appendChild(linkNext);
  pagContainer.appendChild(liNext);
}

function eliminarCaracteristica(caracteristica, fila) {
  if (!confirm("Segur que vols eliminar aquesta característica?")) return;

  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  attributes = attributes.filter(attr => attr.id !== caracteristica.id);
  localStorage.setItem("Attribute", JSON.stringify(attributes));

  fila.remove();
  
}

function aplicarFiltre() {
  const sel = document.getElementById("familia");
  if (!sel) return;
  filtroFamilia = sel.value;
  seguentpagina = 1;
  paginainicial = 1;
  mostrarPagina();
}

function netejarFiltre() {
  const sel = document.getElementById("familia");
  if (sel) sel.value = "";
  filtroFamilia = "";
  seguentpagina = 1;
  paginainicial = 1;
  mostrarPagina();
}
