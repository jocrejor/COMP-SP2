document.addEventListener("DOMContentLoaded", main);

function main() {
    cargarFamilias();

    const form = document.getElementById("productForm");
    form.addEventListener("submit", crearProducto);

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

function crearProducto(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value) || 0;
    const description = document.getElementById("description").value.trim();
    const family_id = parseInt(document.getElementById("family_id").value);

    if (!name) {
        alert("El nom és obligatori");
        return;
    }

    const productos = obtenerProductos();

    // Generar nou ID
    let newId = 1;
    if (productos.length > 0) {
        let maxId = productos[0].id;
        productos.forEach(producto => {
            if (producto.id > maxId) {
                maxId = producto.id;
            }
        });
        newId = maxId + 1;
    }

    // Crear nou producte
    const nuevoProducto = {
        id: newId,
        name,
        price,
        description,
        family_id,
        active: true
    };

    // Afegir a l'array de productes
    productos.push(nuevoProducto);
    guardarProductos(productos);

    alert("Producte creat correctament");
    window.location.href = "index.html";
}document.addEventListener("DOMContentLoaded", main);

function main() {
    cargarFamilias();

    const form = document.getElementById("productForm");
    form.addEventListener("submit", crearProducto);

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

function crearProducto(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value) || 0;
    const description = document.getElementById("description").value.trim();
    const family_id = parseInt(document.getElementById("family_id").value);

    if (!name) {
        alert("El nom és obligatori");
        return;
    }

    const productos = obtenerProductos();

    // Generar nou ID
    let newId = 1;
    if (productos.length > 0) {
        let maxId = productos[0].id;
        productos.forEach(producto => {
            if (producto.id > maxId) {
                maxId = producto.id;
            }
        });
        newId = maxId + 1;
    }

    // Crear nou producte
    const nuevoProducto = {
        id: newId,
        name,
        price,
        description,
        family_id,
        active: true
    };

    // Afegir a l'array de productes
    productos.push(nuevoProducto);
    guardarProductos(productos);

    alert("Producte creat correctament");
    window.location.href = "index.html";
}