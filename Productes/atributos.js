document.addEventListener("DOMContentLoaded", main);

function main() {
    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}