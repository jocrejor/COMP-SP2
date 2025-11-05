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
  let select = document.getElementById("familia");

  if (typeof Family !== "undefined" && Array.isArray(Family) && !localStorage.getItem("Family")) {
    localStorage.setItem("Family", JSON.stringify(Family));
  }

  let families = JSON.parse(localStorage.getItem("Family")) || [];

  select.textContent = "";

  let opcionInicial = document.createElement("option");
  opcionInicial.setAttribute("value", "");
  opcionInicial.appendChild(document.createTextNode("Selecciona una família"));
  select.appendChild(opcionInicial);

  families.forEach(familia => {
    if (familia && familia.name) {
      const option = document.createElement("option");
      option.setAttribute("value", familia.id); 
      option.appendChild(document.createTextNode(familia.name));
      select.appendChild(option);
    }
  });
}



function validarnom() {
  let element = document.getElementById("nom");
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

function validar (e) {
    esborrarError();

    if (validarnom() && validarfamilia() && confirm("Confirma si vols enviar el formulari")) {
       
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

function validarfamilia() {
  let element = document.getElementById("familia");

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

function comprobarId(id) {
  let maxId = 0;

  if (!id) return 1;

  for (let item of id) {
    if (item && typeof item.id === "number" && item.id > maxId) {
      maxId = item.id;
    }
  }

  return maxId + 1;
}


function guardarEnLocalStorage(e) {
  if (!validar(e)) {
    return;
  }

  let name = document.getElementById("nom").value.trim();
  let familiaId = document.getElementById("familia").value;

  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];

  // Comproba si el atribut ya existeix en eixa familia
  let atributoExistente = attributes.find(a => a.name === name && a.family_id == familiaId);

  if (!atributoExistente) {
    let nuevoAttrId = comprobarId(attributes);
    let nuevoAtributo = {
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
