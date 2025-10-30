document.addEventListener("DOMContentLoaded", main);

function main() {
    const id = obtenerIdDeUrl();
    if (!id) {
        alert("ID de producte no especificat.");
        window.location.href = "index.html";
        return;
    }

    cargarImagenesProducto(id);

    const btnAnadir = document.getElementById("btnAnadir");
    btnAnadir.addEventListener("click", () => {
        window.location.href = `crearImagen.html?id=${id}`;
    });

    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "index.html";
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

function obtenerProductos() {
    return JSON.parse(localStorage.getItem('productos')) || [];
}

function cargarImagenesProducto(id) {
    const imagenes = obtenerImagenes();
    const imagenesProducto = [];
    for (let i = 0; i < imagenes.length; i++) {
        if (imagenes[i].product_id === id) {
            imagenesProducto.push(imagenes[i]);
        }
    }

    // Ordenar per ordre
    for (let i = 0; i < imagenesProducto.length - 1; i++) {
        for (let j = i + 1; j < imagenesProducto.length; j++) {
            if (imagenesProducto[i].order > imagenesProducto[j].order) {
                const temp = imagenesProducto[i];
                imagenesProducto[i] = imagenesProducto[j];
                imagenesProducto[j] = temp;
            }
        }
    }

    const contenedor = document.getElementById("imagenesContainer");
    contenedor.innerHTML = ''; // Netejar contenidor

    // Obtenir informació del producte per a mostrar
    const productos = obtenerProductos();
    let producto = null;
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            producto = productos[i];
            break;
        }
    }

    if (producto) {
        const h2 = document.createElement("h2");
        h2.textContent = `Imatges de: ${producto.name}`;
        contenedor.appendChild(h2);
    }

    if (imagenesProducto.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No hi ha imatges per a este producte.";
        contenedor.appendChild(p);
        return;
    }

    // Crear un contenedor flex para las imágenes
    const grid = document.createElement("div");
    grid.style.display = "flex";
    grid.style.flexWrap = "wrap";
    grid.style.gap = "20px";
    grid.style.marginTop = "20px";

    imagenesProducto.forEach(img => {
        const card = document.createElement("div");
        card.style.border = "1px solid #ccc";
        card.style.padding = "10px";
        card.style.borderRadius = "5px";
        card.style.width = "200px";

        // Imagen
        const imagen = document.createElement("img");
        imagen.src = img.url;
        imagen.alt = img.name;
        imagen.style.maxWidth = "100%";
        imagen.style.height = "auto";

        // Nombre
        const nombre = document.createElement("p");
        nombre.textContent = `Nom: ${img.name}`;

        // Orden
        const orden = document.createElement("p");
        orden.textContent = `Ordre: ${img.order}`;

        // Botones
        const botones = document.createElement("div");
        botones.style.marginTop = "10px";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.addEventListener("click", () => {
            editarImagen(id, img.id);
        });

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => {
            eliminarImagen(id, img.id);
        });

        botones.appendChild(btnEditar);
        botones.appendChild(btnEliminar);

        card.appendChild(imagen);
        card.appendChild(nombre);
        card.appendChild(orden);
        card.appendChild(botones);

        grid.appendChild(card);
    });

    contenedor.appendChild(grid);
}

function eliminarImagen(productId, imageId) {
    if (confirm("Segur que vols eliminar esta imatge?")) {
        const imagenes = obtenerImagenes();
        const nuevasImagenes = [];
        for (let i = 0; i < imagenes.length; i++) {
            if (imagenes[i].id !== imageId) {
                nuevasImagenes.push(imagenes[i]);
            }
        }
        guardarImagenes(nuevasImagenes);
        cargarImagenesProducto(productId);
    }
}

function editarImagen(productId, imageId) {
    window.location.href = `editarImagen.html?productId=${productId}&imageId=${imageId}`;
}