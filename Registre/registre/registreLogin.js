document.addEventListener("DOMContentLoaded", main);

function main() {
    // Dos usuaris per defecte
    const defaultClients = [
        { user_name: "admin", password: "solsolet@123" },
        { user_name: "user", password: "llunalluneta@123" }
    ];

    // Guardar al localStorage si no hi ha clients
    if (!localStorage.getItem("client")) {
        localStorage.setItem("client", JSON.stringify(defaultClients));
    }

    // Event per iniciar sessió
    const loginBtn = document.getElementById("login");
    loginBtn.addEventListener("click", () => {

        if (!validarUser() || !validarContrasenya()) {
            return;
        }

        const user = document.getElementById("login_user").value.trim();
        const pass = document.getElementById("login_pass").value.trim();

        // Recuperar llista d'usuaris
        const clients = JSON.parse(localStorage.getItem("client") || "[]");

        // Comprovar usuari i contrasenya
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].user_name === user && clients[i].password === pass) {
                usuari = clients[i]; 
            break;
            }
        }
        
        if (usuari) {
            // Guardar el usuario activo en localStorage
            localStorage.setItem("clientActiu", JSON.stringify(usuari));

            // Limpiar errores
            document.getElementById("error_login_user").textContent = "";
            document.getElementById("error_login_pass").textContent = "";

            alert("Sessió iniciada correctament!");
            window.location.href = "./registreLogout.html";
        } else {
            const error = document.getElementById("error_login_user");
            error.textContent = "Usuari o contrasenya incorrectes!";
        }
    });
}

function validarUser() {
    const user = document.getElementById("login_user");
    const error = document.getElementById("error_login_user");
    const userSenseEspai = user.value.trim();

    if (userSenseEspai === "") {
        error.textContent = "L'usuari és obligatori";
        return false;
    }

    if (userSenseEspai.length < 3) {
        error.textContent = "L'usuari ha de tenir al menys 3 caràcters";
        return false;
    }

    const regex = /^[A-Za-zÀ-ÿ0-9]+$/;
    if (!regex.test(userSenseEspai)) {
        error.textContent = "L'usuari només pot contenir lletres i nombres";
        return false;
    }

    error.textContent = "";
    return true;
}

function validarContrasenya() {
    const pwd = document.getElementById("login_pass");
    const errorPwd = document.getElementById("error_login_pass");

    const valorPwd = pwd.value.trim();

    if (valorPwd === "") {
        errorPwd.textContent = "La contrasenya és obligatoria";
        return false;
    }

    if (valorPwd.length < 5) {
        errorPwd.textContent = "La contrasenya ha de tenir almenys 8 caràcters";
        return false;
    }

    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{5,}$/;
    if (!regex.test(valorPwd)) {
        errorPwd.textContent = "La contrasenya ha de tenir lletra, número i símbol";
        return false;
    }

    errorPwd.textContent = "";
    return true;
}
