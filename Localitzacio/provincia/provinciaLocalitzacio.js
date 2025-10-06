// Iniciem l'aplicació quan el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

let llista = [];
let accio = "Afegir";
let nombreCountry = "";

// Funció principal que s'executa la carregar la pàgina
function main() {
  // Recuperem el país de la URL
  const urlCountry = window.location.href;
  let partes = urlCountry.split("=");
  nombreCountry = partes[1];

  // Mostrem el país seleccionat a l'encapçalament
  document.getElementById("id").textContent =
    "País seleccionat: " + nombreCountry;

  // Botó per afegir o actualitzar  
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;

  // Recuperem la llista del localStorage si existeix o inicialitzem un array buit
  llista = localStorage.getItem("localitzacioprovince")
    ? JSON.parse(localStorage.getItem("localitzacioprovince"))
    : [];

  mostrarLlista();

  // Afegim l'escoltador per al botó
  afegirButton.addEventListener("click", () => {
    // Fem les validacions
    let valida = validarProvincia();
    if (valida === false) {
      return;
    } else {
      if (valida === false) {
        return;
      }

      if (accio === "Afegir") {
        crearprovince();
      } else {
        actualitzarprovince();
        accio = "Afegir";
        afegirButton.textContent = accio;
      }
    }

    // Netegem els camps després d'afegir o actualitzar i refresquem
    document.getElementById("province").value = "";
    document.getElementById("index").value = "-1";
    mostrarLlista();
  });
}

// Funció per donar d'alta una nova provincia
function crearprovince() {
  const province = document.getElementById("province").value;

  llista.push({ province: province, country: nombreCountry });
  localStorage.setItem("localitzacioprovince", JSON.stringify(llista));
}

// Funció per actualitzar una provincia existent
function actualitzarprovince() {
  const province = document.getElementById("province").value;

  //Actualitzem els elements
  llista[document.getElementById("index").value] = {
    province: province,
    country: nombreCountry,
  };
  localStorage.setItem("localitzacioprovince", JSON.stringify(llista));
}

// Funció per mostrar la llista de provincies filtrada per país
function mostrarLlista() {
  const visualitzarLlista = document.getElementById("llista");
  visualitzarLlista.innerHTML = ""; // Limpiar lista al inicio
  let aux = "";

  for (let i = 0; i < llista.length; i++) {
    if (llista[i].country === nombreCountry) {

      aux +=
        "<li>" +
        "<button onclick='esborrarprovince(" +
        i +
        ")'>Esborrar</button>" +
        "<button onclick='actualitzar(" +
        i +
        ")'>Modificar</button>" +
        llista[i].province +
        "<a href='../poblacio/poblacioLocalitzacio.html?country=" +
        nombreCountry +
        "&province=" +
        llista[i].province +
        "'>" +
        "<button>Població</button></a>" +
        "</li>";
    }
  }
  
  // Pintem la llista completa
  visualitzarLlista.innerHTML = aux; 
}

// Funció per fer que a l'apretar el botó modificar, es carreguen las dades del formulari
function actualitzar(index) {
  console.log(llista[index]);
  document.getElementById("index").value = index;
  document.getElementById("province").value = llista[index].province;
  accio = "Actualitzar";
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;
}

// Funció per esborrar una provincia
function esborrarprovince(index) {
  llista.splice(index, 1);
  localStorage.setItem("localitzacioprovince", JSON.stringify(llista));
  mostrarLlista();
}

// Funció per fer validacions de la provincia
function validarProvincia() {
  let province = document.getElementById("province");

  // Comprovar que el camp no està buit
  let provinceSinEspacio = province.value.trim().toLowerCase();

  if (provinceSinEspacio === "") {
    document.getElementById("mensajeError").textContent =
      "Has d'introduïr una provincia.";
    return false;
  }

  // Comprovem que té una mida mínima i màxima (pattern)
  if (province.validity.patternMismatch) {
    document.getElementById("mensajeError").textContent =
      "Ha de tindre una mida de 3 a 30 caracters";
    return false;
  }

  //Comprovem que no està duplicada (excepte en modificar)
  let indexActual = document.getElementById("index").value;
  for (let i = 0; i < llista.length; i++) {
    if (i != indexActual && llista[i].province.toLowerCase() === provinceSinEspacio.toLowerCase()) {
      document.getElementById("mensajeError").textContent =
        "La provincia ja està a la llista";
      return false;
    }
  }
  
  document.getElementById("mensajeError").textContent = "";
  return true;
}
