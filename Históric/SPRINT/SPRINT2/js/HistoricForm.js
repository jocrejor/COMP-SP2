document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("formRegistre");
  const btnCancelar = document.getElementById("cancelar");

  //Si venim d'editar les dades
  const editIndex = sessionStorage.getItem("editIndex");


  if (editIndex !== null && typeof Register !== "undefined" && Register[editIndex]) {
    const registre = registres[editIndex];
    if (registre) {
      document.getElementById("client_id").value = registre.client_id;
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

    let dadesRegistre;
    //Vinculació BBDD
    if (editIndex !== null && Register[editIndex]) {
      // Editar registro existente de la BBDD
      dadesRegistre = {
        ...Register[editIndex], // session_id y user_agent existentes
        client_id: document.getElementById("client_id").value,
        comparator_id: document.getElementById("comparator_id").value,
        favorite_id: document.getElementById("favorite_id").value,
        date_start,
        date_end,
      };
      Register[editIndex] = dadesRegistre;
      sessionStorage.removeItem("editIndex");
    } else {
      // Crear registro nuevo
      dadesRegistre = {
        id: Register.length ? Register[Register.length - 1].id + 1 : 1, // autoincrement
        session_id: crypto.randomUUID(),
        user_agent: navigator.userAgent,
        client_id: document.getElementById("client_id").value,
        comparator_id: document.getElementById("comparator_id").value,
        favorite_id: document.getElementById("favorite_id").value,
        date_start,
        date_end,
      };
      Register.push(dadesRegistre);
    }


    window.location.href = "./HistoricLlistar.html"; //Tornar al llistat
  });

  btnCancelar.addEventListener("click", () => {
    sessionStorage.removeItem("editIndex");
    window.location.href = "./HistoricLlistar.html";
  });
});