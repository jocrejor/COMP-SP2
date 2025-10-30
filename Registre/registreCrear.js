document.addEventListener("DOMContentLoaded", main);

function main() {
  carregarLocation();
  const formulari = document.getElementById("formClient");
  formulari.addEventListener("submit", validar, false);
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// VALIDACIONS
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

function validarNom() {
  let element = document.getElementById("name");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduïr un nom");
    }
    if (element.validity.patternMismatch) {
      error(element, "El nom ha de tindre entre 3 i 15 caracters");
    }
    return false;
  }
  return true;
}

function validarCognom() {
  let element = document.getElementById("surname");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduïr un cognom");
    }
    if (element.validity.patternMismatch) {
      error(element, "El cognom ha de tindre entre 3 i 15 caracters");
    }
    return false;
  }
  return true;
}

function validarTaxidType() {
  const element = document.getElementById("taxidtype");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has de seleccionar un tipus de document");
    }
    return false;
  }
  return true;
}

function validarTaxid() {
  let element = document.getElementById("taxid");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduïr un número de document vàlid");
    }
    if (element.validity.patternMismatch) {
      error(element, "El format del document no és vàlid");
    }
    return false;
  }
  return true;
}

function validarDataNeixement() {
  let element = document.getElementById("birth_date");
  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Deus d'introduïr una data");
    }
    if (element.validity.rangeUnderflow) {
      error(element, "La data mínima ha de ser superior al 01/01/1900.");
    }
    if (element.validity.rangeOverflow) {
      error(element, "La data màxima ha de ser inferior al 01/01/2007");
    }
    return false;
  }
  return true;
}

function validarTelefon() {
  let element = document.getElementById("phone");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduïr un telèfon");
    }
    if (element.validity.patternMismatch) {
      error(element, "El telèfon ha de tindre entre 7 i 20 números");
    }
    return false;
  }
  return true;
}

function validarEmail() {
  let element = document.getElementById("email");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduïr un email");
    } else if (element.validity.typeMismatch) {
      error(element, "El format del email no és vàlid");
    }
    return false;
  }
  return true;
}


function validarAddress() {
  let element = document.getElementById("address");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduïr una adreça");
    }
    if (element.validity.patternMismatch) {
      error(element, "L'adreça ha de tindre un format vàlid");
    }
    return false;
  }
  return true;
}

function validarCp() {
  let element = document.getElementById("cp");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduïr un codi postal");
    }
    if (element.validity.patternMismatch) {
      error(element, "El codi postal no és vàlid");
    }
    return false;
  }
  return true;
}

function validarCountry() {
  const element = document.getElementById("country_id");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has de seleccionar un país");
    }
    return false;
  }
  return true;
}

function validarProvince() {
  const element = document.getElementById("province_id");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has de seleccionar una província");
    }
    return false;
  }
  return true;
}

function validarCity() {
  const element = document.getElementById("city_id");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has de seleccionar una ciutat");
    }
    return false;
  }
  return true;
}

function validarContrasenya() {
  const element = document.getElementById("password");
  const repetirElement = document.getElementById("repetir_password");

  // Validem el primer camp (password)
  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduir una contrasenya");
    } else if (element.validity.tooShort) {
      error(element, "La contrasenya ha de tenir almenys 6 caràcters");
    } else if (element.validity.patternMismatch) {
      error(element, "Ha de contenir lletra, número i símbol (@$!%*#?&)");
    }
    return false;
  }

  // Validem que s'haja repetit la contrasenya
  if (!repetirElement.checkValidity()) {
    if (repetirElement.validity.valueMissing) {
      error(repetirElement, "Has de repetir la contrasenya");
    }
    return false;
  }

  // Comprovem que coincidixquen
  if (element.value !== repetirElement.value) {
    error(repetirElement, "Les contrasenyes no coincideixen");
    return false;
  }
  return true;
}



//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// FUNCIÓ PRINCIPAL VALIDAR
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

function validar(e) {
  esborrarError();

  if (
    validarNom() &&
    validarCognom() &&
    validarTaxidType() &&
    validarTaxid() &&
    validarDataNeixement() &&
    validarTelefon() &&
    validarEmail() &&
    validarAddress() &&
    validarCp() &&
    validarCountry() &&
    validarProvince() &&
    validarCity() &&
    validarContrasenya() &&
    confirm("Confirma si vols enviar el formulari")) {
    guardaNouClient();
    return true;
  } else {
    e.preventDefault();
    return false;
  }
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// FUNCIÓ PER GUARDAR EL NOU USUARI AL LOCALSTORAGE
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

function guardaNouClient() {
  // Obtenim totes les dades del formulari
  const client = {
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
    password: document.getElementById("password").value
  };

  // Guardem al localStorage
  localStorage.setItem("client", JSON.stringify(client));

  alert("Client guardat correctament!");
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// FUNCIONS AUXILIARS
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

function error(element, missatge) {
  let miss = document.createTextNode(missatge);
  document.getElementById("missatgeError").appendChild(miss);
  element.classList.add("error");
  element.focus();
}


function esborrarError() {
  document.getElementById("missatgeError").textContent = "";
  let formulari = document.forms[0];
  for (let i = 0; i < formulari.elements.length; i++) {
    formulari.elements[i].classList.remove("error");
  }
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// SELECTS DE LOCALITZACIÓ
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

function carregarLocation() {
  let countrySelect = document.getElementById("country_id");
  let provinceSelect = document.getElementById("province_id");
  let citySelect = document.getElementById("city_id");

  // Netejem els selects
  while (countrySelect.firstChild) {
    countrySelect.removeChild(countrySelect.firstChild);
  }

  while (provinceSelect.firstChild) {
    provinceSelect.removeChild(provinceSelect.firstChild);
  }

  while (citySelect.firstChild) {
    citySelect.removeChild(citySelect.firstChild);
  }


  // Creem una opció per defecte
  let optionCountry = document.createElement("option");
  optionCountry.value = "";
  let textCountry = document.createTextNode("--Selecciona un país--");
  optionCountry.appendChild(textCountry);

  // Afegim l'opció al select
  countrySelect.appendChild(optionCountry);

  // Carreguem paísos
  Country.forEach(country => {
    let option = document.createElement("option");
    option.value = country.id;
    option.appendChild(document.createTextNode(country.name));
    countrySelect.appendChild(option);
  });

  // Quan triem un país
  countrySelect.addEventListener("change", () => {
    let countryId = parseInt(countrySelect.value);


    // Creem una opció per defecte
    let optionProvince = document.createElement("option");
    optionProvince.value = "";
    let textProvince = document.createTextNode("--Selecciona un país--");
    optionProvince.appendChild(textProvince);

    // Afegim l'opció al select
    provinceSelect.appendChild(optionProvince);


    // Filtra les provincies pel pais seleccionat
    let provinciesFiltrades = Province.filter(p => p.country_id === countryId);

    provinciesFiltrades.forEach(province => {
      let option = document.createElement("option");
      option.value = province.id;
      let texto = document.createTextNode(province.name);
      option.appendChild(texto);
      provinceSelect.appendChild(option);
    });


    // Quan canvie la província
    provinceSelect.addEventListener("change", () => {
      let provinceId = parseInt(provinceSelect.value);

      // Esborrem ciutats antigues
      let defaultCity = document.createElement("option");
      defaultCity.value = "";
      defaultCity.appendChild(document.createTextNode("--Selecciona una ciutat--"));
      citySelect.textContent = "";
      citySelect.appendChild(defaultCity);

      // Afegim les noves ciutats
      let ciutats = City.filter(city => city.province_id === provinceId);
      ciutats.forEach(city => {
        let option = document.createElement("option");
        option.value = city.id;
        let text = document.createTextNode(city.name);
        option.appendChild(text);
        citySelect.appendChild(option);
      });
    });
  })
}

