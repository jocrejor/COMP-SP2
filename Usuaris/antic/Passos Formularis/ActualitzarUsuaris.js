window.onload = function() {
    // Cargar datos desde localStorage
    let usuari = JSON.parse(localStorage.getItem("usuari"));

    if (usuari) {
        document.getElementById("nom").value = usuari.nom;
        document.getElementById("correu").value = usuari.correu;
        document.getElementById("contrasenya").value = usuari.contrasenya;
    }

    // Guardar cambios al actualizar
    document.getElementById("formEditar").addEventListener("submit", function(e){
        e.preventDefault();

        let usuariActualitzat = {
            nom: document.getElementById("nom").value,
            correu: document.getElementById("correu").value,
            contrasenya: document.getElementById("contrasenya").value
        };

        localStorage.setItem("usuari", JSON.stringify(usuariActualitzat));
        alert("Usuari actualitzat correctament!");
    });
};
