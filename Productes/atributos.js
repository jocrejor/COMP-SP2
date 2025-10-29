document.addEventListener("DOMContentLoaded", main);

function main() {
    console.log("Pàgina de atributs del producte carregada");
    
    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}
