// Iniciem l'aplicació quan el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

let llista = new Array();
let accio = "Afegir";

let nombreCountry = "";
let nombreProvince = "";
let nombreCity = "";

// Funció principal: s'executa al carregar la pàgina
function main() {
  // Obtenim la URL actual i n'extraiem els paràmetres
  let urlProvince = window.location.href;
  let separaParts = urlProvince.split("?");
  let parametrosCity = separaParts[1].split("&");

  // Guardem país i província
  nombreCountry = decodeURIComponent(parametrosCity[0].split("=")[1]);
  nombreProvince = decodeURIComponent(parametrosCity[1].split("=")[1]);

  // Mostrem país i província seleccionats al títol
  document.getElementById("id_country").textContent =
    "País seleccionat: " + nombreCountry;
  document.getElementById("id_province").textContent =
    "Provincia seleccionada: " + nombreProvince;

  // Botó per tornar a la pàgina de províncies
  let botoTorna = document.getElementById("torna");
  botoTorna.addEventListener("click", () => {
    window.location.href =
      "../provincia/provinciaLocalitzacio.html?country=" + encodeURIComponent(nombreCountry);
  });

  // Inicialitzem el botó Afegir / Actualitzar
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;

  // Recuperem la llista de poblacions del localStorage o en creem una nova
  llista = localStorage.getItem("localitzacioPoblacio")
    ? JSON.parse(localStorage.getItem("localitzacioPoblacio"))
    : [];

  // Mostrem les dades inicials
  mostrarLlista();

  // Event per al botó d'afegir/actualitzar
  afegirButton.addEventListener("click", () => {
    let validar = validarCiutat();
    if (validar === false) return;

    if (accio === "Afegir") {
      crearPoblacio();
    } else {
      actualitzarPoblacio();
      accio = "Afegir";
      afegirButton.textContent = accio;
    }

    // Buidem els camps i refresquem la llista
    document.getElementById("city").value = "";
    document.getElementById("index").value = "-1";
    mostrarLlista();
  });
}

// Funció per crear una nova població
function crearPoblacio() {
  const city = document.getElementById("city").value;
  if (city === "") {
    alert("El país no pot estar buit");
    return;
  }

  // Afegim l'objecte amb país, província i ciutat
  llista.push({ country: nombreCountry, province: nombreProvince, city: city });
  localStorage.setItem("localitzacioPoblacio", JSON.stringify(llista));
}

// Funció per actualitzar una població existent
function actualitzarPoblacio() {
  const city = document.getElementById("city").value;

  // Actualitzem la posició corresponent de la llista
  llista[document.getElementById("index").value] = {
    country: nombreCountry,
    province: nombreProvince,
    city: city,
  };
  localStorage.setItem("localitzacioPoblacio", JSON.stringify(llista));
}

// Mostra totes les poblacions del país i província actuals
function mostrarLlista() {
  const visualitzarLlista = document.getElementById("llista");
  visualitzarLlista.innerHTML = "";
  let aux = "";

  // Recorrem totes les entrades i filtrem per país i província
  llista.forEach((item, index) => {
    if (item.country === nombreCountry && item.province === nombreProvince) {
      aux +=
        "<li>" +
        "<button onclick='esborrarPoblacio(" + index + ")'>Esborrar</button>" +
        "<button onclick='actualitzar(" + index + ")'>Modificar</button>" +
        item.city +
        "</li>";
    }
  });

  visualitzarLlista.innerHTML = aux;
}

// Carrega una població al formulari per poder modificar-la
function actualitzar(index) {
  document.getElementById("index").value = index;
  document.getElementById("city").value = llista[index].city;
  accio = "Actualitzar";
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;
}

// Elimina una població de la llista
function esborrarPoblacio(index) {
  llista.splice(index, 1);
  localStorage.setItem("localitzacioPoblacio", JSON.stringify(llista));
  mostrarLlista();
}

// Validacions de la ciutat abans d'afegir o actualitzar
function validarCiutat() {
  let city = document.getElementById("city");
  let senseEspai = city.value.trim().toLowerCase();

  // Comprovem que no estiga buit
  if (senseEspai === "") {
    document.getElementById("mensajeError").textContent =
      "Has d'introduïr una ciutat.";
    return false;
  }

  // Comprovem el patró del camp HTML
  if (city.validity.patternMismatch) {
    document.getElementById("mensajeError").textContent =
      "Ha de tindre una mida de 3 a 30 caracters";
    return false;
  }

  // Comprovem que no estiga duplicada
  let indexActual = document.getElementById("index").value;
  for (let i = 0; i < llista.length; i++) {
    if (i != indexActual && llista[i].city.toLowerCase() === senseEspai) {
      document.getElementById("mensajeError").textContent =
        "La ciutat ja està a la llista";
      return false;
    }
  }

  // Si tot està bé, netegem els errors
  document.getElementById("mensajeError").textContent = "";
  return true;
}