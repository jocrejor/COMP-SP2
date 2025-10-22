document.addEventListener("DOMContentLoaded", function () {

})
 


// Generar un session_id únic si encara no existeix
if (!sessionStorage.getItem("session_id")) {
  sessionStorage.setItem("session_id", crypto.randomUUID());
}

// Variable per saber si estem editant un registre concret
let indexEdicio = null;

// Funció per mostrar els registres a la taula
function mostrarTaula() {
  const tbody = document.querySelector("#taulaResultat tbody");

  // Neteja contingut existent
  tbody.textContent = "";

  const registres = JSON.parse(localStorage.getItem("registres")) || [];

  registres.forEach((registre, index) => {
    const fila = document.createElement("tr");

    // Afegim totes les cel·les de dades
    const camps = [
      registre.session_id,
      registre.user_agent,
      registre.client_id,
      registre.comparator_id,
      registre.favorite_id,
      registre.date_start,
      registre.date_end,
    ];

    camps.forEach((valor) => {
      const td = document.createElement("td");
      td.textContent = valor;
      fila.appendChild(td);
    });

    // Cel·la d'accions 
    const tdAccions = document.createElement("td");

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => editarRegistre(index));

    const btnEsborrar = document.createElement("button");
    btnEsborrar.textContent = "Esborrar";
    btnEsborrar.addEventListener("click", () => esborrarRegistre(index));

    tdAccions.appendChild(btnEditar);
    tdAccions.appendChild(btnEsborrar);
    fila.appendChild(tdAccions);

    // Afegim la fila a la taula
    tbody.appendChild(fila);
  });
}



// Quan s’envia el formulari
document
  .getElementById("formulariRegistre")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const dadesRegistre = {
      session_id: sessionStorage.getItem("session_id"),
      user_agent:
        document.getElementById("user_agent").value || navigator.userAgent,
      client_id: document.getElementById("client_id").value,
      comparator_id: document.getElementById("comparator_id").value,
      favorite_id: document.getElementById("favorite_id").value,
      date_start: document.getElementById("date_start").value,
      date_end: document.getElementById("date_end").value,
    };

    let registres = JSON.parse(localStorage.getItem("registres")) || [];

    if (indexEdicio !== null) {
      // Si estem editant, substituir el registre existent
      registres[indexEdicio] = dadesRegistre;
      indexEdicio = null;
    } else {
      // Si no, afegim un de nou
      registres.push(dadesRegistre);
    }

    localStorage.setItem("registres", JSON.stringify(registres));

    mostrarTaula();
    document.getElementById("formulariRegistre").reset();
  });

// Netejar només el formulari
document
  .getElementById("netejarFormulari")
  .addEventListener("click", function () {
    document.getElementById("formulariRegistre").reset();
    indexEdicio = null; // Cancel·lar edició si estava activa
  });

// Funció per esborrar un registre
function esborrarRegistre(index) {
  let registres = JSON.parse(localStorage.getItem("registres")) || [];
  //registres.splice(index, 1); // eliminar l'element
  localStorage.setItem("registres", JSON.stringify(registres));
  mostrarTaula();
}

// Funció per editar un registre
function editarRegistre(index) {
  let registres = JSON.parse(localStorage.getItem("registres")) || [];
  const registre = registres[index];

  // Omplim el formulari amb les dades seleccionades
  document.getElementById("user_agent").value = registre.user_agent;
  document.getElementById("client_id").value = registre.client_id;
  document.getElementById("comparator_id").value = registre.comparator_id;
  document.getElementById("favorite_id").value = registre.favorite_id;
  document.getElementById("date_start").value = registre.date_start;
  document.getElementById("date_end").value = registre.date_end;

  indexEdicio = index; // Guardem quin registre s'està editant
}

//AÑADIR VALIDACIONES DE FECHA --> LA FECHA FINAL NO PUEDE SER ANTERIOR A LA DE INICIAL de edición

// Mostrar la taula quan carreguem la pàgina
mostrarTaula();
