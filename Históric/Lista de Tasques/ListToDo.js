document.addEventListener("DOMContentLoaded", main);

let llista = new Array();

let accio = "afegir";

function main() {
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;
  llista = localStorage.getItem("listtodo")
    ? JSON.parse(localStorage.getItem("listtodo"))
    : [];
  mostrarLlista();
  afegirButton.addEventListener("click", () => {
    if (accio === "afegir") {
      crearTasca();
    } else {
      actualitzarTasca();
      accio = "afegir";
      afegirButton.textContent = accio;
    }
    document.getElementById("tasca").value = "";
    document.getElementById("prioritat").value = "3";
    document.getElementById("index").value = "-1";
    mostrarLlista();
  });
}
function crearTasca() {
  const tasca = document.getElementById("tasca").value;
  if (tasca === "") {
    alert("La tasca no pot estar buida");
    return;
  }
  const prioritat = document.getElementById("prioritat").value;
  llista.push({ tasca: tasca, prioritat: prioritat });
  localStorage.setItem("listtodo", JSON.stringify(llista));
}
function actualitzarTasca() {
  const tasca = document.getElementById("tasca").value;
  if (tasca === "") {
    alert("La tasca no pot estar buida");
    return;
  }
  const prioritat = document.getElementById("prioritat").value;
  // actualitzar l'element
  llista[document.getElementById("index").value] = {
    tasca: tasca,
    prioritat: prioritat,
  };
  localStorage.setItem("listtodo", JSON.stringify(llista));
}
function mostrarLlista() {
  const visualitzarLlista = document.getElementById("llista");
  visualitzarLlista.innerHTML = "";
  let aux = "";
  llista.forEach((item, index) => {
    aux +=
      " <li><button onclick='esborrar(" +
      index +
      ")'>Del</button><button onclick='actualitzar(" +
      index +
      ")'>Upd</button>" +
      item.tasca +
      " Prioritat: " +
      item.prioritat +
      "</li>";
  });
  visualitzarLlista.innerHTML = aux;
}

function esborrar(index) {
  llista.splice(index, 1);
  localStorage.setItem("listtodo", JSON.stringify(llista));
  mostrarLlista();
}

function actualitzar(index) {
  console.log(llista[index]);
  document.getElementById("index").value = index;
  document.getElementById("tasca").value = llista[index].tasca;
  document.getElementById("prioritat").value = llista[index].prioritat;
  accio = "actualitzar";
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;
}
