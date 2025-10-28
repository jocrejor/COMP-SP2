document.addEventListener("DOMContentLoaded", main);

function main() {
    const btnCrear = document.getElementById("btnCrear");
    btnCrear.addEventListener("click", () => {
        window.location.href = "crear.html";
    });

    inicializarDades();
    cargarProductos();
}

function inicializarDades() {

    if (!localStorage.getItem('productos')) {

        const productosConEstado = [];
        Product.forEach(producto => {
            productosConEstado.push({
                ...producto,
                active: producto.active !== undefined ? producto.active : true
            });
        });
        localStorage.setItem('productos', JSON.stringify(productosConEstado));
    }

    if (!localStorage.getItem('familias')) {
        localStorage.setItem('familias', JSON.stringify(Family));
    }

    if (!localStorage.getItem('imagenes')) {
        localStorage.setItem('imagenes', JSON.stringify(Productimage));
    }

    if (!localStorage.getItem('atributos')) {
        localStorage.setItem('atributos', JSON.stringify(Productattribute));
    }
}

function obtenerProductos() {
    return JSON.parse(localStorage.getItem('productos')) || [];
}

function obtenerFamilias() {
    return JSON.parse(localStorage.getItem('familias')) || [];
}

function obtenerImagenes() {
    return JSON.parse(localStorage.getItem('imagenes')) || [];
}

function obtenerAtributos() {
    return JSON.parse(localStorage.getItem('atributos')) || [];
}

function guardarProductos(productos) {
    localStorage.setItem('productos', JSON.stringify(productos));
}

function guardarImagenes(imagenes) {
    localStorage.setItem('imagenes', JSON.stringify(imagenes));
}

