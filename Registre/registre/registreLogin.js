document.addEventListener("DOMContentLoaded", main); 

function main() {
    // Dos usuaris per defecte
    const defaultClients = [
        { user_name: "admin", password: "123" },
        { user_name: "user", password: "abc" }
    ];

    // Guardar al localStorage si no hi ha clients
    if (!localStorage.getItem("client")) {
        localStorage.setItem("client", JSON.stringify(defaultClients));
    }

    // Event per iniciar sessió
    const loginBtn = document.getElementById("login");
    loginBtn.addEventListener("click", () => {
        const user = document.getElementById("login_user").value.trim();
        const pass = document.getElementById("login_pass").value;

        // Recuperar llista d'usuaris
        const clients = JSON.parse(localStorage.getItem("client") || "[]");

        // Comprovar usuari i contrasenya
        const usuari = clients.find(c => c.user_name === user && c.password === pass);

        if (usuari) {
            alert("Sessió iniciada correctament!");
            window.location.href = "./registreLogout.html"; 
        } else {
            alert("Usuari o contrasenya incorrectes!");
        }
    });
}
