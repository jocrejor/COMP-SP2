document.addEventListener("DOMContentLoaded", main);

function main() {
    const id = obtenerIdDeUrl();
    if (!id) {
        alert("ID de producte no especificat.");
        window.location.href = "index.html";
        return;
    }

    cargarFamilias();
    cargarProducto(id);

    const form = document.getElementById("productForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        guardarCambios(id);
    });

    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

function obtenerProductos() {
    return JSON.parse(localStorage.getItem('productos')) || [];
}

function obtenerFamilias() {
    return JSON.parse(localStorage.getItem('familias')) || [];
}

function guardarProductos(productos) {
    localStorage.setItem('productos', JSON.stringify(productos));
}

function cargarFamilias() {
    const select = document.getElementById("family_id");
    const familias = obtenerFamilias();
    
    familias.forEach(familia => {
        const option = document.createElement("option");
        option.value = familia.id;
        option.textContent = familia.name;
        select.appendChild(option);
    });
}

function obtenerIdDeUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

function cargarProducto(id) {
    const productos = obtenerProductos();
    let producto = null;
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            producto = productos[i];
            break;
        }
    }

    if (!producto) {
        alert("Producte no trobat.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("name").value = producto.name;
    document.getElementById("price").value = producto.price;
    document.getElementById("description").value = producto.description;
    document.getElementById("family_id").value = producto.family_id;
}

function guardarCambios(id) {
    const productos = obtenerProductos();
    let producto = null;
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            producto = productos[i];
            break;
        }
    }

    if (!producto) {
        alert("Producte no trobat.");
        window.location.href = "index.html";
        return;
    }

    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value) || 0;
    const description = document.getElementById("description").value.trim();
    const family_id = parseInt(document.getElementById("family_id").value);

    if (!name) {
        alert("El nom és obligatori");
        return;
    }

    // Actualitzar el producte
    producto.name = name;
    producto.price = price;
    producto.description = description;
    producto.family_id = family_id;

    guardarProductos(productos);
    alert("Producte modificat correctament");
    window.location.href = "index.html";
}