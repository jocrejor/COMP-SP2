document.addEventListener("DOMContentLoaded", main);

let clients = [];

function main() {
    carregaSelect();

    const formulari = document.getElementById("formClient");
    formulari.addEventListener("submit", (event)=>{
        event.preventDefault();

        // Validem tots els camps
        const valid = validarCampsIndividuals(); 

        if (valid) {
            guardarClient();
            formulari.reset(); 
        }
    });
}

// Funció per carregar clients desde el localstorage
function carregaClients() {
  const dades = localStorage.getItem("clients");
  if (dades) {
    clients = JSON.parse(dades);
  } else {
    clients = [];
  }
  return clients;
}

// Funció per guardar nous usuaris
function guardarClient() {
  // Carreguem els clients existents
  carregaClients();

  // Recollim les dades del formulari
  const nouClient = {
    id: document.getElementById("id").value.trim(),
    name: document.getElementById("name").value.trim(),
    surname: document.getElementById("surname").value.trim(),
    taxidtype: document.getElementById("taxidtype").value,
    taxid: document.getElementById("taxid").value.trim(),
    birth_date: document.getElementById("birth_date").value,
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
    cp: document.getElementById("cp").value.trim(),
    country_id: document.getElementById("country_id").value,
    province_id: document.getElementById("province_id").value,
    city_id: document.getElementById("city_id").value,
    password: document.getElementById("password").value.trim()
  };

  // Afegim el nou client a l'array
  clients.push(nouClient);

  // Guardem tot l'array al localStorage
  localStorage.setItem("clients", JSON.stringify(clients));

  alert("Client creat correctament!");
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Part de les validacions
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Funció per fer les validacions del formulari generals
function validarFormulari() {
  validarUnCamp("name", "El nom és obligatori");
  validarUnCamp("surname", "El cognom és obligatori");
  validarUnCamp("taxid", "El DNI no és vàlid");
  validarUnCamp("phone", "El telèfon és obligatori");
  validarUnCamp("email", "El email és obligatori");
  validarUnCamp("address", "L'adreça és obligatoria");
  validarUnCamp("cp", "El codi postal és obligatori");
  validarUnCamp("password", "La contrasenya és obligatoria");
}

function validarUnCamp(id, missatge) {
  const input = document.getElementById(id);
  const error = document.getElementById("error_" + id);

  if (!input.checkValidity()) {
    error.textContent = missatge;
  } else {
    error.textContent = "";
  }
}

// Funció per fer validacions més concretes

// Validació del nom
function validarNom(){
    const input = document.getElementById("name");
    const error = document.getElementById("error_name");
    const valor = input.value.trim();

   // El camp està buit
  if (valor === "") {
    error.textContent = "El nom és obligatori";
    return false;
  }

  // El camp es massa curt
  if (valor.length < 3) {
    error.textContent = "El nom ha de tenir almenys 3 caràcters";
    return false;
  }

  // Sols espais i lletres
  const regex = /^[A-Za-zÀ-ÿ\s]+$/;
  if (!regex.test(valor)) {
    error.textContent = "El nom només pot contenir lletres i espais";
    return false;
  }

  // Tot correcte
  error.textContent = "";
  return true;
}


// Validar el cognom
function validarCognom() {
  const input = document.getElementById("surname");
  const error = document.getElementById("error_surname");
  const valor = input.value.trim();

   // El camp està buit
  if (valor === "") {
    error.textContent = "El cognom és obligatori";
    return false;
  }

  // El camp es massa curt
  if (valor.length < 3) {
    error.textContent = "El cognom ha de tenir almenys 2 caràcters";
    return false;
  }

  // Sols lletres, espais, guions o apostrof
  const regex = /^[A-Za-zÀ-ÿ\s'-]+$/;
  if (!regex.test(valor)) {
    error.textContent = "El cognom només pot contenir lletres, espais, guions i apòstrofs";
    return false;
  }

  // Tot correcte
  error.textContent = "";
  return true;
}

// Validació del tipus de document 
function validarTipusDocument() {
  const select = document.getElementById("taxidtype");
  const error = document.getElementById("error_taxidtype");

  if (select.value === "") {
    error.textContent = "Has de seleccionar un tipus de document";
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}


// Validacions del document
function validarTaxid() {
  const tipus = document.getElementById("taxidtype").value;
  const input = document.getElementById("taxid");
  const error = document.getElementById("error_taxid");
  const valor = input.value.trim();

   // El camp està buit
  if (valor === "") {
    error.textContent = "El número de document és obligatori";
    return false;
  }

  // Validació segons el tipus de document
  let patro;
  switch (tipus) {
    case "DNI":
      // 8 dígits + 1 lletra
      patro = /^[0-9]{8}[A-Za-z]$/;
      break;
    case "NIE":
      // Comença amb X, Y o Z + 7 dígits + 1 lletra
      patro = /^[XYZ][0-9]{7}[A-Za-z]$/;
      break;
    case "PASS":
      // Passaport: 6-9 caràcters alfanumèrics
      patro = /^[A-Za-z0-9]{6,9}$/;
      break;
    default:
      error.textContent = "Selecciona un tipus de document";
      return false;
  }

  // Comprovem si compleix el patró
  if (!patro.test(valor)) {
    error.textContent = "El format del document no és vàlid";
    return false;
  }

  // Tot correcte
  error.textContent = "";
  return true;
}


// Validació de l'aniversari
function validarAniversari() {
  const select = document.getElementById("birth_date");
  const error = document.getElementById("error_birth_date");

  if (select.value === "") {
    error.textContent = "Has de seleccionar una data";
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}


// Validació del telèfon
function validarTelefon() {
  const input = document.getElementById("phone");
  const error = document.getElementById("error_phone");
  const valor = input.value.trim();

   // El camp està buit
  if (valor === "") {
    error.textContent = "El telèfon és obligatori";
    return false;
  }

  // Comprovem el format: només números, opcional '+' al principi
  const regex = /^\+?[0-9]{7,15}$/; 
  if (!regex.test(valor)) {
    error.textContent = "El telèfon només pot contenir números i un '+' al principi, 7-15 dígits";
    return false;
  }

  // Tot correcte
  error.textContent = "";
  return true;
}


// Validació del email
function validarEmail() {
  const input = document.getElementById("email");
  const error = document.getElementById("error_email");
  const valor = input.value.trim();

   // El camp està buit
  if (valor === "") {
    error.textContent = "L'email és obligatori";
    return false;
  }

  // Comprovem el format 
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(valor)) {
    error.textContent = "El format de l'email no és vàlid";
    return false;
  }

  // Tot correcte
  error.textContent = "";
  return true;
}


// Validació de l'adreça
function validarAdreca() {
  const input = document.getElementById("address");
  const error = document.getElementById("error_address");
  const valor = input.value.trim();

   // El camp està buit
  if (valor === "") {
    error.textContent = "L'adreça és obligatoria";
    return false;
  }

  // Comprovem longitud mínima i màxima
  if (valor.length < 5) {
    error.textContent = "L'adreça ha de tenir almenys 5 caràcters";
    return false;
  }

  if (valor.length > 100) {
    error.textContent = "L'adreça no pot superar els 100 caràcters";
    return false;
  }

  // Comprovem els caràcters bàsics 
  const regex = /^[A-Za-z0-9À-ÿ\s.,'-]+$/;
  if (!regex.test(valor)) {
    error.textContent = "L'adreça conté caràcters no vàlids";
    return false;
  }

  // Tot correcte
  error.textContent = "";
  return true;
}


// Funció per validar el cp
function validarCP() {
  const input = document.getElementById("cp");
  const error = document.getElementById("error_cp");
  const valor = input.value.trim();

   // El camp està buit
  if (valor === "") {
    error.textContent = "El codi postal és obligatori";
    return false;
  }

  // Sols valen els nomnbres
  const regex = /^[0-9]{4,5}$/;
  if (!regex.test(valor)) {
    error.textContent = "El codi postal ha de tenir només 4 o 5 nombres";
    return false;
  }

  // Tot correcte
  error.textContent = "";
  return true;
}


// Funció per validar el país
function validarCountry() {
  const select = document.getElementById("country_id");
  const error = document.getElementById("error_country_id");

  if (select.value === "") {
    error.textContent = "Has de seleccionar un camp";
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}


// Funció per validar la provincia
function validarProvince() {
  const select = document.getElementById("province_id");
  const error = document.getElementById("error_province_id");

  if (select.value === "") {
    error.textContent = "Has de seleccionar un camp";
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}

// Funció per validar la ciutat
function validarCity() {
  const select = document.getElementById("city_id");
  const error = document.getElementById("error_city_id");

  if (select.value === "") {
    error.textContent = "Has de seleccionar un camp";
    return false;
  } else {
    error.textContent = "";
    return true;
  }
}


// Funció per validar la contrasenya
function validarContrasenya() {
  const pwd = document.getElementById("password");
  const repetirPwd = document.getElementById("repetir_password");
  const errorPwd = document.getElementById("error_password");
  const errorRepetir = document.getElementById("error_repetir_password");

  const valorPwd = pwd.value.trim();
  const valorRepetir = repetirPwd.value.trim();

   // El camp està buit
  if (valorPwd === "") {
    errorPwd.textContent = "La contrasenya és obligatoria";
    return false;
  } else {
    errorPwd.textContent = "";
  }

  // Longitud mínima
  if (valorPwd.length < 8) {
    errorPwd.textContent = "La contrasenya ha de tenir almenys 8 caràcters";
    return false;
  }

  if (valorRepetir === "") {
    errorRepetir.textContent = "Repeteix la contrasenya";
    return false;
  } else {
    errorRepetir.textContent = "";
  }

  // Comprovem si coincideixen les dos contrasenyes
  if (valorPwd !== valorRepetir) {
    errorRepetir.textContent = "Les contrasenyes no coincideixen";
    return false;
  }

  //  Que continga lletra, número i símbol
   const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
   if (!regex.test(valorPwd)) {
     errorPwd.textContent = "La contrasenya ha de tenir lletra, número i símbol";
     return false;
  }

  // Tot correcte
  errorPwd.textContent = "";
  errorRepetir.textContent = "";
  return true;
}


// Funció per cridar totes les validacions individuals
function validarCampsIndividuals(){
    const res =
        validarNom() &&
        validarCognom() &&
        validarTipusDocument() &&
        validarTaxid() &&
        validarAniversari() &&
        validarTelefon() &&
        validarEmail() &&
        validarAdreca() &&
        validarCP() &&
        validarCountry() &&
        validarProvince() &&
        validarCity() &&
        validarContrasenya();

    return res;
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Part del select de localització
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Neteja el select
function netejaSelect(select) {
    while (select.options.length > 0) {
        select.remove(0);
    }
}

// Carreguem els selects de location
function carregaSelect() {
    const countrySelect = document.getElementById("country_id");
    const provinceSelect = document.getElementById("province_id");
    const citySelect = document.getElementById("city_id");

    // Netejem els selects
    netejaSelect(countrySelect);
    netejaSelect(provinceSelect);
    netejaSelect(citySelect);

    // Posem les opciones per defecte del select
    const crearOpcioPerDefecte = (select, texto) => {
        let option = document.createElement("option");
        option.value = "";
        option.disabled = true;
        option.selected = true;
        option.textContent = texto;
        select.appendChild(option);
    };

    crearOpcioPerDefecte(provinceSelect, "Selecciona una provincia");
    crearOpcioPerDefecte(citySelect, "Selecciona una ciutat");

    // Carrega els països
    crearOpcioPerDefecte(countrySelect, "Selecciona un país");
    for (let i = 0; i < Country.length; i++) {
        let option = document.createElement("option");
        option.value = Country[i].id;
        option.textContent = Country[i].name;
        countrySelect.appendChild(option);
    }

    // Listener per poder canviar les provincies segons el pais
    countrySelect.addEventListener("change", () => {
        netejaSelect(provinceSelect);
        netejaSelect(citySelect);

        crearOpcioPerDefecte(provinceSelect, "Selecciona una provincia");
        crearOpcioPerDefecte(citySelect, "Selecciona una ciutat");

        const paisSeleccionado = parseInt(countrySelect.value);
        Province.forEach(province => {
            if (province.country_id === paisSeleccionado) {
                let option = document.createElement("option");
                option.value = province.id;
                option.textContent = province.name;
                provinceSelect.appendChild(option);
            }
        });
    });

    // Listener per canviar les ciutats segons la provincia
    provinceSelect.addEventListener("change", () => {
        netejaSelect(citySelect);
        crearOpcioPerDefecte(citySelect, "Selecciona una ciutat");

        const provinciaSeleccionada = parseInt(provinceSelect.value);
        City.forEach(city => {
            if (city.id_state === provinciaSeleccionada) {
                let option = document.createElement("option");
                option.value = city.id;
                option.textContent = city.name;
                citySelect.appendChild(option);
            }
        });
    });
}
