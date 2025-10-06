// Iniciem l'aplicació quan el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

let llista = new Array();
let accio = "Afegir";

let nombreCountry = "";
let nombreProvince = "";
let nombreCity = "";

function main() {
  // Obtenim la URL actual per extreure paràmetres de country i province
  let urlProvince = window.location.href;
  let separaParts = urlProvince.split("?"); // http...html, country=España&province=Valencia
  let parametrosCity = separaParts[1].split("&"); //country=España, province=Valencia

  // Guardem el país i la provincia
  nombreCountry = parametrosCity[0].split("=")[1]; // España
  nombreProvince = parametrosCity[1].split("=")[1]; // Valencia

  // Els pintem
  document.getElementById("id_country").textContent =
    "País seleccionat: " + nombreCountry;
  document.getElementById("id_province").textContent =
    "Provincia seleccionada: " + nombreProvince;

  // Botó per tornar a la pàgina de provincies  
  let botoTorna = document.getElementById("torna");
  botoTorna.addEventListener("click", () => {
    window.location.href =
      "../provincia/provinciaLocalitzacio.html?country=" + nombreCountry;
  });

  // Inicialitzem el botó d'afegir/actualitzar
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;

  // Carreguem dades del localStorage o iniciem un buit
  llista = localStorage.getItem("localitzacioPoblacio")
    ? JSON.parse(localStorage.getItem("localitzacioPoblacio"))
    : [];

  mostrarLlista();

  // Event per afegir o actualitzar població
  afegirButton.addEventListener("click", () => {
    let validar = validarCiutat();
    if (validar === false) {
      return;
    } else {
      if (accio === "Afegir") {
        crearPoblacio();
      } else {
        actualitzarPoblacio();
        accio = "Afegir";
        afegirButton.textContent = accio;
      }
    }

    // Buidem inputs i refresquem
    document.getElementById("city").value = "";
    document.getElementById("index").value = "-1";
    mostrarLlista();
  });
}

// Funció per donar d'alta un nou país
function crearPoblacio() {
  const city = document.getElementById("city").value;
  if (city === "") {
    alert("El país no pot estar buit");
    return;
  }
  llista.push({ country: nombreCountry, province: nombreProvince, city: city });
  localStorage.setItem("localitzacioPoblacio", JSON.stringify(llista));
}

//Funció per actualitzar els països existents
function actualitzarPoblacio() {
  const city = document.getElementById("city").value;

  //Actualitzem els elements
  llista[document.getElementById("index").value] = {
    country: nombreCountry,
    province: nombreProvince,
    city: city,
  };
  localStorage.setItem("localitzacioPoblacio", JSON.stringify(llista));
}

// Funció per mostrar la llista de països filtrades per país i provincia actual
function mostrarLlista() {
  const visualitzarLlista = document.getElementById("llista");
  visualitzarLlista.innerHTML = "";
  let aux = "";
  llista.forEach((item, index) => {
    if (item.country === nombreCountry && item.province === nombreProvince) {
      aux +=
        "<li><button onclick='esborrarPoblacio(" +
        index +
        ")'>Esborrar</button><button onclick='actualitzar(" +
        index +
        ")'>Modificar</button>" +
        item.city +
        "</li>";
    }
  });

  visualitzarLlista.innerHTML = aux;

}

// Funció per carregar una població al formulari per modificar-la
function actualitzar(index) {
  document.getElementById("index").value = index;
  document.getElementById("city").value = llista[index].city;
  accio = "Actualitzar";
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;
}

// Funció per esborrar una població
function esborrarPoblacio(index) {
  llista.splice(index, 1);
  localStorage.setItem("localitzacioPoblacio", JSON.stringify(llista));
  mostrarLlista();
}

// Funció per fer validacions
function validarCiutat() {
  let city = document.getElementById("city");

  let senseEspai = city.value.trim().toLowerCase();

  // Comprovem que no estiga buit
  if (senseEspai === "") {
    document.getElementById("mensajeError").textContent =
      "Has d'introduïr una ciutat.";
    return false;
  }

  // Comprovem si té el tamany mínim i màxim segons el pattern del HTML
  if (city.validity.patternMismatch) {
    document.getElementById("mensajeError").textContent =
      "Ha de tindre una mida de 3 a 30 caracters";
    return false;
  }

  // Comprovem si està duplicat el valor (ignorant l'element que s'edita)
  let indexActual = document.getElementById("index").value;
  for (let i = 0; i < llista.length; i++) {
    if (i != indexActual && llista[i].city.toLowerCase() === senseEspai) {
      document.getElementById("mensajeError").textContent =
        "La ciutat ja està a la llista";
      return false;
    }
  }
  
  document.getElementById("mensajeError").textContent = "";
  return true;
}
