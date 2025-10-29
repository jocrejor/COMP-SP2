document.addEventListener("DOMContentLoaded", function () {
  // Generar un session_id únic si encara no existeix
  if (!sessionStorage.getItem("session_id")) {
    sessionStorage.setItem("session_id", crypto.randomUUID());
  }

  const form = document.getElementById("formRegistre");
  const btnCancelar = document.getElementById("cancelar");

  
  let registres = JSON.parse(localStorage.getItem("registres")) || [];

  //Si venim d'editar les dades
  const editIndex = sessionStorage.getItem("editIndex");


  if (editIndex !== null) {
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

    if (editIndex !== null) {
      registres[editIndex] = dadesRegistre;
      sessionStorage.removeItem("editIndex");
    } else {
      registres.push(dadesRegistre);
    }

    localStorage.setItem("registres", JSON.stringify(registres));
    window.location.href = "./HistoricLlistar.html"; //Tornar al llistat
  });

  cancelarBtn.addEventListener("click", () => {
    sessionStorage.removeItem("editIndex");
    window.location.href = "./HistoricLlistar.html";
  });
});