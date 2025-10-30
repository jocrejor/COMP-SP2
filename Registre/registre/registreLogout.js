document.addEventListener("DOMContentLoaded", () => {
    const tancaBtn = document.getElementById("tanca");

    tancaBtn.addEventListener("click", () => {
        // Borrar l'usuari del localStorage
        localStorage.removeItem("clientActiu");

        // Redirigir al login
        window.location.href = "./registreLogin.html";
    });
});
