document.addEventListener("DOMContentLoaded", main);

function main() {
    const btnCrear = document.getElementById("btnCrear");
    btnCrear.addEventListener("click", () => {
        window.location.href = "crear.html";
    });

    cargarProductos();
}