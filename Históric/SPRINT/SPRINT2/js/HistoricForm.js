document.addEventListener("DOMContentLoaded", function () {
  // Generar un session_id únic si encara no existeix
  if (!sessionStorage.getItem("session_id")) {
    sessionStorage.setItem("session_id", crypto.randomUUID());
  }

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
      alert("ERROR. La data final no pot ser anterior a la data inicial.");
      return;
    }

    const dadesRegistre = {
      session_id: sessionStorage.getItem("session_id"),
      user_agent: navigator.userAgent,
      client_id: document.getElementById("client_id").value,
      comparator_id: document.getElementById("comparator_id").value,
      favorite_id: document.getElementById("favorite_id").value,
      date_start,
      date_end,
    };

    //Vincle amb la BBDD
    if (editIndex !== null && typeof Register !== "undefined") {
      Register[editIndex] = dadesRegistre;
      sessionStorage.removeItem("editIndex");
    } else if (typeof Register !== "undefined") {
      Register.push(dadesRegistre);
    } else {
      alert("No s'ha trobat la base de dades Register.");
    }

    window.location.href = "./HistoricLlistar.html"; //Tornar al llistat
  });

  btnCancelar.addEventListener("click", () => {
    sessionStorage.removeItem("editIndex");
    window.location.href = "./HistoricLlistar.html";
  });
});