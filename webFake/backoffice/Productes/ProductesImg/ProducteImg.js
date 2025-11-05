document.addEventListener("DOMContentLoaded", main);

function main() {
    const id = obtenerIdDeUrl();
    if (!id) {
        alert("ID de producte no especificat.");
        window.location.href = "../ProducteImg.html";
        return;
    }

    cargarImagenesProducto(id);

    const btnAnadir = document.getElementById("btnAnadir");
    btnAnadir.addEventListener("click", () => {
        window.location.href = `ProducteCrearImg.html?id=${id}`;
    });

    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "../Index.html";
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
        p.classList.add("mensaje-vacio");
        contenedor.appendChild(p);
        return;
    }

    // Crear un contenedor grid centrado para las imágenes
    const grid = document.createElement("div");
    grid.classList.add("grid-imagenes");

    imagenesProducto.forEach(img => {
        const card = document.createElement("div");
        card.classList.add("card-imagen");

        // Imagen
        const imagen = document.createElement("img");
        imagen.src = img.url;
        imagen.alt = img.name;
        imagen.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYXRnZSBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
        };

        // Nombre
        const nombre = document.createElement("p");
        nombre.textContent = `Nom: ${img.name}`;
        nombre.style.fontWeight = '500';

        // Orden
        const orden = document.createElement("p");
        orden.textContent = `Ordre: ${img.order}`;

        // Botones
        const botones = document.createElement("div");
        botones.classList.add("botones-card");

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn", "btn-edit");
        btnEditar.addEventListener("click", () => {
            editarImagen(id, img.id);
        });

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("btn", "btn-delete");
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
    window.location.href = `ProducteModificarImg.html?productId=${productId}&imageId=${imageId}`;
}