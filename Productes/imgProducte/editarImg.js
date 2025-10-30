document.addEventListener("DOMContentLoaded", main);

function main() {
    const productId = obtenerProductIdDeUrl();
    const imageId = obtenerImageIdDeUrl();
    if (!productId || !imageId) {
        alert("Paràmetres incorrectes.");
        window.location.href = "index.html";
        return;
    }

    cargarImagen(imageId);

    const form = document.getElementById("formImagen");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        guardarCambios(productId, imageId);
    });

    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = `indexImg.html?id=${productId}`;
    });
}

function obtenerProductIdDeUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("productId"));
}

function obtenerImageIdDeUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("imageId"));
}

function obtenerImagenes() {
    return JSON.parse(localStorage.getItem('imagenes')) || [];
}

function guardarImagenes(imagenes) {
    localStorage.setItem('imagenes', JSON.stringify(imagenes));
}

function cargarImagen(imageId) {
    const imagenes = obtenerImagenes();
    let imagen = null;
    for (let i = 0; i < imagenes.length; i++) {
        if (imagenes[i].id === imageId) {
            imagen = imagenes[i];
            break;
        }
    }

    if (!imagen) {
        alert("Imatge no trobada.");
        window.history.back();
        return;
    }

    document.getElementById("nombre").value = imagen.name;
    document.getElementById("url").value = imagen.url;
    document.getElementById("orden").value = imagen.order;
}

function guardarCambios(productId, imageId) {
    const nombre = document.getElementById("nombre").value.trim();
    const url = document.getElementById("url").value.trim();
    const orden = parseInt(document.getElementById("orden").value) || 1;

    if (!nombre || !url) {
        alert("El nom i la URL són obligatoris");
        return;
    }

    const imagenes = obtenerImagenes();
    let imagenIndex = -1;
    for (let i = 0; i < imagenes.length; i++) {
        if (imagenes[i].id === imageId) {
            imagenIndex = i;
            break;
        }
    }

    if (imagenIndex === -1) {
        alert("Imatge no trobada.");
        return;
    }

    imagenes[imagenIndex].name = nombre;
    imagenes[imagenIndex].url = url;
    imagenes[imagenIndex].order = orden;

    guardarImagenes(imagenes);
    alert("Imatge actualitzada correctament");
    window.location.href = `indexImg.html?id=${productId}`;
}