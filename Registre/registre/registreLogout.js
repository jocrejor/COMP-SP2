document.addEventListener("DOMContentLoaded", () => {
    const tancaBtn = document.getElementById("tanca");

    tancaBtn.addEventListener("click", () => {
        // Si vols esborrar alguna dada d'usuari de la sessió:
        // localStorage.removeItem("usuariActual"); // exemple si guardaves l'usuari loguejat

        // Redirigir al login
        window.location.href = "./registreLogin.html";
    });
});
