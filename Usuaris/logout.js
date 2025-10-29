document.addEventListener("DOMContentLoaded", main);

function main() {
    // Buscar el botó de tancar sessió
    const btnLogout = document.getElementById("logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            // Eliminar l'usuari actual del localStorage
            localStorage.removeItem("usuariActual");
            // Redirigir al login
            window.location.href = "login.html";
        });
    }

    // Comprovar si hi ha un usuario loguejat
    verificarLogin();
}

// Funció per a redirigir al login si no hi ha un usuari loguejat
function verificarLogin() {
    const usuariActual = JSON.parse(localStorage.getItem("usuariActual"));
    if (!usuariActual) {
        // Si no hi ha usuaris, redirigir al login
        window.location.href = "login.html";
    }

    else {
        const text = document.createTextNode("Benvingut/da, " + usuariActual.name);
        usuariNom.appendChild(text);
    }
}