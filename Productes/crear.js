document.addEventListener("DOMContentLoaded", main);

function main() {
    console.log("Página de crear producto cargada");
    
    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    const form = document.getElementById("productForm");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
    });
}