document.addEventListener("DOMContentLoaded", main);

function main() {
    console.log("Página de detalles de producto cargada");
    
    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}