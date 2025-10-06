document.addEventListener("DOMContentLoaded", mostra);
function mostra(){
let persona = {
nom:"Pepe",
edat: 30,
altura: 178
}
let paragraf = document.getElementById("dades");
paragraf.textContent = "Nom:" + persona.nom + "Edat: " + persona.edat + "Altura: " + persona.altura;
}