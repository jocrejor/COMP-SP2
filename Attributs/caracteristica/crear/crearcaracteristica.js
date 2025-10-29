window.onload = iniciar;

function iniciar() {
  carregarFamilies();
  document.getElementById("enviar").addEventListener("click", guardarEnLocalStorage, false);
  document.getElementById("cancelar").addEventListener("click", cancelar);
}

function cancelar() {
  window.location.href = "../llistar/llistarcaracteristica.html";
}

function carregarFamilies() {

  if (typeof Family !== "undefined" && Array.isArray(Family) && !localStorage.getItem("Family")) {
    localStorage.setItem("Family", JSON.stringify(Family));
  }

  const families = JSON.parse(localStorage.getItem("Family")) || [];
  const select = document.getElementById("familia");

  while (select.firstChild) {
    select.removeChild(select.firstChild);
  }

  // Opció inicial
  const opcionInicial = document.createElement("option");
  opcionInicial.value = "";
  opcionInicial.appendChild(document.createTextNode(" Selecciona una família "));
  select.appendChild(opcionInicial);

  // Crear una opció por cada familia
  for (let i = 0; i < families.length; i++) {
    const familia = families[i];
    if (familia && familia.name) {
      const option = document.createElement("option");
      option.value = familia.id;
      option.appendChild(document.createTextNode(familia.name));
      select.appendChild(option);
    }
  }
}

function validarnom() {
  var element = document.getElementById("nom");
  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduir un nom.");
    }
    if (element.validity.patternMismatch) {
      error(element, "El nom ha de tindre entre 2 i 100 caràcters.");
    }
    return false;
  }
  return true;
}

function validar(e) {
  esborrarError();

  if (validarnom() && validarfamilia() && confirm("Confirma si vols enviar el formulari")) {
    return true;
  } else {
    e.preventDefault();
    return false;
  }
}

function validarfamilia() {
  const element = document.getElementById("familia");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has de seleccionar una família.");
    }
    return false;
  }
  return true;
}

function error(element, missatge) {
  const missatgeNode = document.createTextNode(missatge);
  document.getElementById("missatgeError").appendChild(missatgeNode);
  element.classList.add("error");
  element.focus();
}

function esborrarError() {
  document.getElementById("missatgeError").textContent = "";
  const formulari = document.forms[0];
  for (let i = 0; i < formulari.elements.length; i++) {
    formulari.elements[i].classList.remove("error");
  }
}

function comprobarid(array) {
  if (!array || !array.some(e => e && e.id !== undefined)) return 1;

  let maxId = 0;
  for (const item of array) {
    const id = item && typeof item.id === "number" ? item.id : 0;
    if (id > maxId) maxId = id;
  }
  return maxId + 1;
}

function guardarEnLocalStorage(e) {
  if (!validar(e)) {
    return;
  }

  const name = document.getElementById("nom").value.trim();
  const familiaId = document.getElementById("familia").value;



  const attributes = JSON.parse(localStorage.getItem("Attribute")) || [];

  // Comprobar si el atributo ya existe en esa familia
  const atributoExistente = attributes.find(a => a.name === name && a.family_id == familiaId);

  if (!atributoExistente) {
    const nuevoAttrId = comprobarid(attributes);
    const nuevoAtributo = {
      id: nuevoAttrId,
      name: name,
      family_id: parseInt(familiaId)
    };
    attributes.push(nuevoAtributo);
    localStorage.setItem("Attribute", JSON.stringify(attributes));
  } else {
    alert("Aquesta característica ja existeix en aquesta família.");
  }

  document.getElementById("nom").value = "";
  document.getElementById("familia").value = "";

  window.location.href = "../llistar/llistarcaracteristica.html";
}
