document.addEventListener("DOMContentLoaded", main);

// Array guarda els clients
let llista = [];
let accio = "alta";

function main() {
  inicialitzarOpcions();
  carregarOpcions();

  let altaButton = document.getElementById("alta");
  altaButton.textContent = accio;

  // Recuperem la llista de clients de localStorage
  llista = localStorage.getItem("client")
    ? JSON.parse(localStorage.getItem("client"))
    : [];

  // Si ve de modificar
  let clientIndex = sessionStorage.getItem("clientIndex");
  if (clientIndex !== null) {
    carregarFormulari(clientIndex);
    accio = "modificar";
    altaButton.textContent = accio;
    sessionStorage.removeItem("clientIndex");
  }

  //Ajustar el màxim de caràcters i el placeholder segons el tipus de document
  let select = document.getElementById("taxidtype");
  let input = document.getElementById("taxid");

  function actualizarMaxLength() {
    if (select.value === "DNI") {
      input.maxLength = 9;   
      input.placeholder = "Ej: 12345678A";
    } else if (select.value === "NIE") {
      input.maxLength = 9;  
      input.placeholder = "Ej: X1234567B";
    } else if (select.value === "Passaport") {
      input.maxLength = 9;   
      input.placeholder = "Ej: ABC123456";
    } else {
      input.maxLength = 20; 
      input.placeholder = "";
    }
  }

  // Executar la carrega de la pagina 
  actualizarMaxLength();
  select.addEventListener("change", actualizarMaxLength);

  // Clic al botó d'alta
  altaButton.addEventListener("click", () => {
    if (accio === "alta") {
      crearClient();
    } else {
      actualitzarClient();
      accio = "alta";
      altaButton.textContent = accio;
    }
    netejarFormulari();
  });
}

// Inicialitzar arrays en localStorage
function inicialitzarOpcions() {
  if (!localStorage.getItem("countries")) {
    localStorage.setItem("countries", JSON.stringify([
      { id: 1, name: "Espanya" },
      { id: 2, name: "França" },
      { id: 3, name: "Itàlia" }
    ]));
  }

  if (!localStorage.getItem("provinces")) {
    localStorage.setItem("provinces", JSON.stringify([
      { id: 1, countryId: 1, name: "Barcelona" },
      { id: 2, countryId: 1, name: "Girona" },
      { id: 3, countryId: 2, name: "París" },
      { id: 4, countryId: 3, name: "Roma" }
    ]));
  }

  if (!localStorage.getItem("cities")) {
    localStorage.setItem("cities", JSON.stringify([
      { id: 1, provinceId: 1, name: "Badalona" },
      { id: 2, provinceId: 1, name: "Mataró" },
      { id: 3, provinceId: 3, name: "Versalles" },
      { id: 4, provinceId: 4, name: "Ostia" }
    ]));
  }
}

// Carregar select dinàmics
function carregarOpcions() {
  let countries = JSON.parse(localStorage.getItem("countries")) || [];
  let provinces = JSON.parse(localStorage.getItem("provinces")) || [];
  let cities = JSON.parse(localStorage.getItem("cities")) || [];

  let countrySelect = document.getElementById("country_id");
  let provinceSelect = document.getElementById("province_id");
  let citySelect = document.getElementById("city_id");

  countrySelect.innerHTML = '<option value="">-- Selecciona país --</option>';
  countries.forEach(c => {
    let option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.name;
    countrySelect.appendChild(option);
  });

  countrySelect.addEventListener("change", () => {
    let selectedCountry = parseInt(countrySelect.value);
    provinceSelect.innerHTML = '<option value="">-- Selecciona província --</option>';
    citySelect.innerHTML = '<option value="">-- Selecciona ciutat --</option>';
    
    provinces
      .filter(p => p.countryId === selectedCountry)
      .forEach(p => {
        let option = document.createElement("option");
        option.value = p.id;
        option.textContent = p.name;
        provinceSelect.appendChild(option);
      });
  });

  provinceSelect.addEventListener("change", () => {
    let selectedProvince = parseInt(provinceSelect.value);
    citySelect.innerHTML = '<option value="">-- Selecciona ciutat --</option>';

    cities
      .filter(c => c.provinceId === selectedProvince)
      .forEach(c => {
        let option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name;
        citySelect.appendChild(option);
      });
  });
}

// Carregar formulari amb dades d'un client
function carregarFormulari(index) {
  const client = llista[index];
  document.getElementById("index").value = index;
  document.getElementById("id_registreClient").value = client.id;
  document.getElementById("name").value = client.name;
  document.getElementById("surnames").value = client.surnames;
  document.getElementById("taxidtype").value = client.taxidtype;
  document.getElementById("taxid").value = client.taxid;
  document.getElementById("birthdate").value = client.birthdate;
  document.getElementById("phone").value = client.phone;
  document.getElementById("user_name").value = client.user_name;
  document.getElementById("email").value = client.email;
  document.getElementById("adress").value = client.address;
  document.getElementById("cp").value = client.cp;
  document.getElementById("country_id").value = client.country;
  document.getElementById("province_id").value = client.province;
  document.getElementById("city_id").value = client.city;
}

// Crear client
function crearClient() {
  let index = document.getElementById("index").value;
  let id = document.getElementById("id_registreClient").value;
  let name = document.getElementById("name").value;
  let surnames = document.getElementById("surnames").value;
  let taxidtype = document.getElementById("taxidtype").value;
  let taxid = document.getElementById("taxid").value; 
  let birthdate = document.getElementById("birthdate").value;
  let phone = document.getElementById("phone").value;
  let user_name = document.getElementById("user_name").value;
  let email = document.getElementById("email").value;
  let address = document.getElementById("adress").value; 
  let cp = document.getElementById("cp").value;
  let country = document.getElementById("country_id").value;
  let province = document.getElementById("province_id").value;
  let city = document.getElementById("city_id").value;
  let password = document.getElementById("password").value;
  let repetir = document.getElementById("repetir").value;

  if (
    !index || !id || !name || !surnames || !taxidtype || !taxid || !birthdate ||
    !phone || !user_name || !email || !address || !cp ||
    !country || !province || !city || !password || !repetir
  ) {
    alert("Tots els camps són obligatoris");
    return;
  }

  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Correu electrònic invàlid");
    return;
  }

  if (!/^\d{9,15}$/.test(phone)) {
    alert("El telèfon ha de contenir només números (9-15 dígits)");
    return;
  }

  if (!/^\d{5}$/.test(cp)) {
    alert("El codi postal ha de tenir 5 dígits");
    return;
  }

  let passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!passRegex.test(password)) {
    alert("La contrasenya ha de tenir mínim 8 caràcters, una majúscula, un número i un símbol");
    return;
  }

  if (password !== repetir) {
    alert("Les contrasenyes no coincideixen");
    return;
  }

  let existeix = llista.some(client => client.id === id);
  if (existeix) {
    alert("Ja existeix un client amb aquest ID!");
    return;
  }

  llista.push({
    id, name, surnames, taxid, taxidtype, birthdate, phone,
    user_name, email, address, cp, country, province, city, password
  });
  localStorage.setItem("client", JSON.stringify(llista));

  alert("Client creat correctament!");
  window.open("login.html", "_blank");
}

// Actualitzar client
function actualitzarClient() {
  let index = document.getElementById("index").value;
  let id = document.getElementById("id_registreClient").value;
  let name = document.getElementById("name").value;
  let surnames = document.getElementById("surnames").value;
  let taxidtype = document.getElementById("taxidtype").value;
  let taxid = document.getElementById("taxid").value;
  let birthdate = document.getElementById("birthdate").value;
  let phone = document.getElementById("phone").value;
  let user_name = document.getElementById("user_name").value;
  let email = document.getElementById("email").value;
  let address = document.getElementById("adress").value; 
  let cp = document.getElementById("cp").value;
  let country = document.getElementById("country_id").value;
  let province = document.getElementById("province_id").value;
  let city = document.getElementById("city_id").value;
  let password = document.getElementById("password").value;
  let repetir = document.getElementById("repetir").value;

  if (
    !index || !id || !name || !surnames || !taxidtype || !taxid || !birthdate ||
    !phone || !user_name || !email || !address || !cp ||
    !country || !province || !city || !password || !repetir
  ) {
    alert("Tots els camps són obligatoris");
    return;
  }
//Validacións
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Correu electrònic invàlid");
    return;
  }

  if (!/^\d{9,15}$/.test(phone)) {
    alert("El telèfon ha de contenir només números (9-15 dígits)");
    return;
  }

  if (!/^\d{5}$/.test(cp)) {
    alert("El codi postal ha de tenir 5 dígits");
    return;
  }

  let passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!passRegex.test(password)) {
    alert("La contrasenya ha de tenir mínim 8 caràcters, una majúscula, un número i un símbol");
    return;
  }

  if (password !== repetir) {
    alert("Les contrasenyes no coincideixen");
    return;
  }

  llista[index] = {
    id, name, surnames, taxidtype, taxid, birthdate, phone,
    user_name, email, address, cp, country, province, city, password
  };
  localStorage.setItem("client", JSON.stringify(llista));
  alert("Client actualitzat correctament!");
}

// Netejar formulari
function netejarFormulari() {
  document.getElementById("index").value = "-1";
  document.getElementById("id_registreClient").value = "";
  document.getElementById("name").value = "";
  document.getElementById("surnames").value = "";
  document.getElementById("taxidtype").value = "";
  document.getElementById("taxid").value = "";
  document.getElementById("birthdate").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("user_name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("adress").value = ""; 
  document.getElementById("cp").value = "";   
  document.getElementById("country_id").value = "";
  document.getElementById("province_id").value = "";
  document.getElementById("city_id").value = "";
  document.getElementById("password").value = "";
  document.getElementById("repetir").value = "";
}