document.addEventListener("DOMContentLoaded", main)


function main() {
  // carregar dades de la BBDD o del LocalStorage
  let ClientArray = JSON.parse(localStorage.getItem("Client")) || Client;
  console.log(ClientArray);
  // Carregar Favorits
  let FavoriteArray = JSON.parse(localStorage.getItem("Favorite")) || Favorite;
  // Carregar Comparadors
  //let ComparatorArray = JSON.parse(localStorage.getItem("Comparator")) || Comparator;


  carregarSelects(ClientArray);


  const form = document.getElementById("formRegistre");
  const btnCancelar = document.getElementById("cancelar");

  //Carregar registres del LocalStorage si hi ha, si no de la BBDD
  function carregarRegistresBbdd() {
    const local = localStorage.getItem("Register");
    if (local) return JSON.parse(local);
    if (typeof Register !== "undefined" && Array.isArray(Register)) {
      localStorage.setItem("Register", JSON.stringify(Register));
      return Register.slice();
    }
    return [];
  }

  //Afegir els demés SELECTS
  function carregarSelects(clients) {
    const clientSelect = document.getElementById("client_id");
    clients.forEach(client => {
      const option = document.createElement("option");
      option.setAttribute("value", client.id);
      const nomClient = document.createTextNode(`${client.name} ${client.surname}`);
      option.appendChild(nomClient);
      clientSelect.appendChild(option);
    });
  }


  function guardarLocal(regs) {
    localStorage.setItem("Register", JSON.stringify(regs));
  }

  let registres = carregarRegistresBbdd();

  const editIndex = sessionStorage.getItem("editIndex");
  if (editIndex !== null && registres[editIndex]) {
    const registre = registres[editIndex];
    if (registre) {
      document.getElementById("client_id").value = String(registre.client_id);
      document.getElementById("comparator_id").value = registre.comparator_id;
      document.getElementById("favorite_id").value = registre.favorite_id;
      document.getElementById("date_start").value = registre.date_start;
      document.getElementById("date_end").value = registre.date_end;
    }
  }

  // Guardar (afegir o editar)
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const date_start = document.getElementById("date_start").value;
    const date_end = document.getElementById("date_end").value;

    //Validació de dates
    if (date_start && date_end && new Date(date_end) < new Date(date_start)) {
      alert("ERROR. La data final no pot ser anterior a la data d'inici.");
      return;
    }

    registres = carregarRegistresBbdd();

    // EDITAR: conservant id, session_id y user_agent de la BBDD
    if (editIndex !== null && registres[editIndex]) {
      const existing = registres[editIndex];
      const updated = {
        ...existing,
        client_id: document.getElementById("client_id").value,
        comparator_id: document.getElementById("comparator_id").value,
        favorite_id: document.getElementById("favorite_id").value,
        date_start,
        date_end,
      };
      registres[editIndex] = updated;
      sessionStorage.removeItem("editIndex");

    }
    // AFEGIR: id autoincrementat, session_id y user_agent autogenerats
    else {
      const nextId = registres.length ? Math.max(...registres.map(r => r.id)) + 1 : 1;
      const nou = {
        id: nextId,
        session_id: crypto.randomUUID(),
        user_agent: navigator.userAgent,
        client_id: document.getElementById("client_id").value,
        comparator_id: document.getElementById("comparator_id").value,
        favorite_id: document.getElementById("favorite_id").value,
        date_start,
        date_end,
      };
      registres.push(nou);
    }
    // Guardar al localStorage y tornar al llistat
    guardarLocal(registres);
    window.location.href = "./HistoricLlistar.html";
  });

  btnCancelar.addEventListener("click", () => {
    sessionStorage.removeItem("editIndex");
    window.location.href = "./HistoricLlistar.html";
  });
}