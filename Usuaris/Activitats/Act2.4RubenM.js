let persona = {
    nom: "Pepe",
    edat: 30,
    altura: 178
};

function mostrar() {
    let missatge = "El usuario " + persona.nom + " tiene " + persona.edat + " años y mide " + persona.altura + " centímetros.";
    document.getElementById("resultat").innerText = missatge;
}


document.getElementById("mostrar").addEventListener("click", function() {
    document.getElementById("resultat").innerText = missatge;
});