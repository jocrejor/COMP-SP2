
 document.addEventListener("DOMContentLoaded", () => {
      document.getElementById("iniciar").addEventListener("click", () => {
        let user = document.getElementById("user_name").value;
        const pass = document.getElementById("password").value;

        // Recuperar llista d'usuaris
        let clients = JSON.parse(localStorage.getItem("client") || "[]");

        // Si existeix usuari i contrasenya
        let usuari = clients.find(c => c.user_name === user && c.password === pass);

        if (usuari) {
          alert("Sessió iniciada correctament!");
          //Página de logount
          window.location.href = "./registre/registreLlistar.html"; 
        } else {
          alert("Usuari o contrasenya incorrectes!");
        }
      });
    });