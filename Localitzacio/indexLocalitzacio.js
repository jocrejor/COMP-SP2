// Iniciem l'aplicació quan el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

let llista = new Array();
let accio = "Afegir";

function main() {
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;

  // Recuperem la llista del localStorage o inicialitzem buit
  llista = localStorage.getItem("localitzacioPais")
    ? JSON.parse(localStorage.getItem("localitzacioPais"))
    : [];

  // Pintem la llista dels països
  mostrarLlista();

  // Creem un ID automàtic si no existeix al localStorage
  if (!localStorage.getItem("countryLastId")) {
    localStorage.setItem("countryLastId", 0);
  }

  // Afegim un listener per al botó afegir/modificar
  afegirButton.addEventListener("click", () => {
    let validarPais = validarNomPais();
    if (validarPais === false) {
      return;
    } else {
      if (accio === "Afegir") {
        crearPais();
      } else {
        actualitzarPais();
        accio = "Afegir";
        afegirButton.textContent = accio;
      }
    }

    // netejem el formulari després de guardar
    document.getElementById("country").value = "";
    document.getElementById("index").value = "-1";

    // Pintem la llista dels països
    mostrarLlista();
  });
}

// Funció per donar d'alta un nou país
function crearPais() {
  const country = document.getElementById("country").value;
  if (country === "") {
    alert("El país no pot estar buit");
    return;
  }

  // Recuperes el id dinàmic i el converteixes a nombre, i si no està, assigna 0
  let nuevoCountry = Number(localStorage.getItem("countryLastId")) || 0;
  nuevoCountry++;

  // L'objecte que guardem al localStorage
  let objetoCountry = {
    id: nuevoCountry,
    country: country,
  };

  llista.push(objetoCountry);
  localStorage.setItem("localitzacioPais", JSON.stringify(llista));
  localStorage.setItem("countryLastId", nuevoCountry);
}

// Funció per actualitzar el país existent
function actualitzarPais() {
  const country = document.getElementById("country").value;

  //Actualitzem els elements
  llista[document.getElementById("index").value] = { country: country };
  localStorage.setItem("localitzacioPais", JSON.stringify(llista));
}

// Funció per mostrar la llista de països
function mostrarLlista() {
  const visualitzarLlista = document.getElementById("llista");
  visualitzarLlista.innerHTML = "";
  let aux = "";
  llista.forEach((item, index) => {
    aux +=
      "<li><button onclick='esborrarPais(" +
      index +
      ")'>Esborrar</button><button onclick='actualitzar(" +
      index +
      ")'>Modificar</button>" +
      item.country +
      "<a href='./provincia/provinciaLocalitzacio.html?country=" +
      item.country +
      "'><button>Provincia</button></a></li>";
  });

  visualitzarLlista.innerHTML = aux;
}

// Quan cliquem Modificar, carreguem el país a modificar
function actualitzar(index) {
  console.log(llista[index]);
  document.getElementById("index").value = index;
  document.getElementById("country").value = llista[index].country;
  accio = "Actualitzar";
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;
}

// Funció per esborrar un país
function esborrarPais(index) {
  llista.splice(index, 1);
  localStorage.setItem("localitzacioPais", JSON.stringify(llista));
  mostrarLlista();
}

// Validar el país
function validarNomPais() {
  let country = document.getElementById("country");

  // Eliminem espais i ho passem a minúscules
  let countrySenseEspai = country.value.trim().toLowerCase();

  // Comprovem que el camp no estiga buit. 
  if (countrySenseEspai === "") {
    document.getElementById("mensajeError").textContent =
      "Has d'introduïr un país.";
    return false;
  }

  // Comprovem que té una mida mínima i màxima segons el Pattern
  if (country.validity.patternMismatch) {
    document.getElementById("mensajeError").textContent =
      "Ha de tindre una mida de 3 a 30 caracters";
    return false;
  }

  // Comprovem que país no está ja a l'array duplicat (menys en modificar)
  let indexActual = document.getElementById("index").value;
  for (let i = 0; i < llista.length; i++) {
    if (i != indexActual && llista[i].country.toLowerCase() === countrySenseEspai) {
      document.getElementById("mensajeError").textContent =
        "El país ja està a la llista";
      return false;
    }
  }
  
  document.getElementById("mensajeError").textContent = " ";
  return true;
}