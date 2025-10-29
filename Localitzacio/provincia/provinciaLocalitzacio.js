// Iniciem l'aplicació quan el DOM estiga completament carregat
document.addEventListener("DOMContentLoaded", main);
let provinceArray;
let llista = new Array();          // Array on guardarem totes les províncies
let accio = "Afegir";     // Estat actual del botó
let nombreCountry = "";   // Nom del país seleccionat, obtingut des de la URL

// Funció principal que s'executa quan la pàgina està llesta
async function main() {

    provinceArray =  JSON.parse(localStorage.getItem("localitzacioPais")) || localStorage.setItem("localitzacioPais",JSON.stringify(Province)); 
    
    console.log(provinceArray)
    
    
    
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;

    mostrarLlista();

    // Si encara no existeix un ID automàtic al localStorage, el creem
    if (!localStorage.getItem("countryLastId")) {
        localStorage.setItem("countryLastId", 0);
    }

    // Listener del botó Afegir/Modificar
    afegirButton.addEventListener("click", () => {
        let validarPais = validarNomPais(); // Comprovem que el país siga vàlid

        if (validarPais === false) {
            return; // Si no és vàlid, parem l'execució
        } else {
            if (accio === "Afegir") {
                crearPais(); // Mode afegir nou país
            } else {
                actualitzarPais(); // Mode actualitzar país existent
                accio = "Afegir"; // Tornem a l'estat inicial
                afegirButton.textContent = accio;
            }
        }

        // Netejem el formulari després d'afegir o actualitzar
        document.getElementById("country").value = "";
        document.getElementById("index").value = "-1";

        // Tornem a mostrar la llista actualitzada
        mostrarLlista();
    });
}

// Funció per afegir una nova província
function crearprovince() {
  const province = document.getElementById("province").value;

  // Guardem un objecte amb el nom de la província i el país corresponent
  llista.push({ province: province, country: nombreCountry });
  localStorage.setItem("localitzacioprovince", JSON.stringify(llista));
}

// Funció per actualitzar una província existent
function actualitzarprovince() {
  const province = document.getElementById("province").value;

  // Actualitzem la província en la posició indicada pel camp ocult "index"
  llista[document.getElementById("index").value] = {
    province: province,
    country: nombreCountry,
  };
  localStorage.setItem("localitzacioprovince", JSON.stringify(llista));
}

// Funció per mostrar la llista filtrada de províncies del país actual
function mostrarLlista() {
  const visualitzarLlista = document.getElementById("llista");
  visualitzarLlista.innerHTML = ""; // Neteja la llista abans de pintar
  let aux = "";

  // Recorrem totes les províncies i només mostrem les del país actual
  for (let i = 0; i < llista.length; i++) {
    if (llista[i].country === nombreCountry) {

      // Afegim un element <li> amb botons per esborrar, modificar i accedir a poblacions
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
        encodeURIComponent(nombreCountry) +
        "&province=" +
        encodeURIComponent(llista[i].province) +
        "'>" +
        "<button>Població</button></a>" +
        "</li>";
    }
  }
  
  // Mostrem la llista al DOM
  visualitzarLlista.innerHTML = aux; 
}

// Quan cliquem "Modificar", carreguem la informació de la província al formulari
function actualitzar(index) {
  console.log(llista[index]);
  document.getElementById("index").value = index;
  document.getElementById("province").value = llista[index].province;
  accio = "Actualitzar"; // Canviem l'estat del botó
  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;
}

// Funció per esborrar una província
function esborrarprovince(index) {
  llista.splice(index, 1); // Eliminem 1 element a la posició indicada
  localStorage.setItem("localitzacioprovince", JSON.stringify(llista)); // Guardem els canvis
  mostrarLlista(); // Refresquem la vista
}

// Validació del nom de la província abans d'afegir o modificar
function validarProvincia() {
  let province = document.getElementById("province");

  // Eliminem espais i passem a minúscules per comparar de forma consistent
  let provinceSinEspacio = province.value.trim().toLowerCase();

  // Comprovem que el camp no estiga buit
  if (provinceSinEspacio === "") {
    document.getElementById("mensajeError").textContent =
      "Has d'introduïr una provincia.";
    return false;
  }

  // Comprovem que el text complisca el pattern
  if (province.validity.patternMismatch) {
    document.getElementById("mensajeError").textContent =
      "Ha de tindre una mida de 3 a 30 caracters";
    return false;
  }

  // Comprovem que no existeix una altra província amb el mateix nom
  let indexActual = document.getElementById("index").value;
  for (let i = 0; i < llista.length; i++) {
    if (
      i != indexActual &&
      llista[i].province.toLowerCase() === provinceSinEspacio.toLowerCase()
    ) {
      document.getElementById("mensajeError").textContent =
        "La provincia ja està a la llista";
      return false;
    }
  }
  
  // Si tot és correcte, netegem el missatge d'error
  document.getElementById("mensajeError").textContent = "";
  return true;
}