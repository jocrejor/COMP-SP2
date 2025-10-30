document.addEventListener("DOMContentLoaded", main);

function main() {
    const id = obtenerIdDeUrl();
    if (!id) {
        alert("ID de producte no especificat.");
        window.location.href = "index.html";
        return;
    }

    const form = document.getElementById("formImagen");
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        añadirImagen(id);
    });

    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = `imagenes.html?id=${id}`;
    });
}

function obtenerIdDeUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

function obtenerImagenes() {
    return JSON.parse(localStorage.getItem('imagenes')) || [];
}

function guardarImagenes(imagenes) {
    localStorage.setItem('imagenes', JSON.stringify(imagenes));
}

function añadirImagen(productId) {
    const nombre = document.getElementById("nombre").value.trim();
    const url = document.getElementById("url").value.trim();
    const orden = parseInt(document.getElementById("orden").value) || 1;

    if (!nombre || !url) {
        alert("El nom i la URL són obligatoris");
        return;
    }

    const imagenes = obtenerImagenes();
    
    // Generar nou ID per a la imatge
    let newImageId = 1;
    if (imagenes.length > 0) {
        let maxId = imagenes[0].id;
        imagenes.forEach(img => {
            if (img.id > maxId) {
                maxId = img.id;
            }
        });
        newImageId = maxId + 1;
    }

    const nuevaImagen = {
        id: newImageId,
        name: nombre,
        url: url,
        order: orden,
        product_id: productId
    };

    imagenes.push(nuevaImagen);
    guardarImagenes(imagenes);
    alert("Imatge afegida correctament");
    window.location.href = `imagenes.html?id=${productId}`;
}