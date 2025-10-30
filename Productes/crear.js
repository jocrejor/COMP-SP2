document.addEventListener("DOMContentLoaded", main);

function main() {
    cargarFamilias();

    const form = document.getElementById("productForm");
    form.addEventListener("submit", crearProducto);

    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Agregar validación en tiempo real
    agregarValidacionEnTiempoReal();
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

    // Limpiar opciones existentes
    select.innerHTML = '';

    // Agregar opción por defecto
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecciona una familia";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    familias.forEach(familia => {
        const option = document.createElement("option");
        option.value = familia.id;
        option.textContent = familia.name;
        select.appendChild(option);
    });
}

function agregarValidacionEnTiempoReal() {
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const descriptionInput = document.getElementById("description");
    const familySelect = document.getElementById("family_id");

    // Validar nombre
    nameInput.addEventListener("blur", function () {
        const name = this.value.trim();
        if (name === "") {
            mostrarError(this, "El nombre es obligatorio");
        } else if (name.length < 2) {
            mostrarError(this, "El nombre debe tener al menos 2 caracteres");
        } else if (name.length > 100) {
            mostrarError(this, "El nombre no puede tener más de 100 caracteres");
        } else if (existeProductoConNombre(name)) {
            mostrarError(this, "Ya existe un producto con este nombre");
        } else {
            limpiarError(this);
        }
    });

    // Validar precio
    priceInput.addEventListener("blur", function () {
        const price = parseFloat(this.value);
        if (isNaN(price)) {
            mostrarError(this, "El precio debe ser un número válido");
        } else if (price < 0) {
            mostrarError(this, "El precio no puede ser negativo");
        } else if (price > 1000000) {
            mostrarError(this, "El precio no puede ser mayor a 1,000,000");
        } else {
            limpiarError(this);
        }
    });

    // Validar descripción
    descriptionInput.addEventListener("blur", function () {
        const description = this.value.trim();
        if (description === "") {
            mostrarError(this, "La descripción es obligatoria");
        } else if (description.length > 500) {
            mostrarError(this, "La descripción no puede tener más de 500 caracteres");
        } else {
            limpiarError(this);
        }
    });

    // Validar familia
    familySelect.addEventListener("change", function () {
        const familyId = parseInt(this.value);
        if (isNaN(familyId)) {
            mostrarError(this, "Debes seleccionar una familia válida");
        } else {
            limpiarError(this);
        }
    });
}

function mostrarError(input, mensaje) {
    // Limpiar error anterior
    limpiarError(input);

    // Agregar clase de error
    input.classList.add("error");

    // Crear elemento de error
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = mensaje;

    // Insertar después del input
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

function limpiarError(input) {
    // Remover clase de error
    input.classList.remove("error");

    // Remover mensaje de error si existe
    const errorElement = input.parentNode.querySelector(".error-message");
    if (errorElement) {
        errorElement.remove();
    }
}

function existeProductoConNombre(nombre) {
    const productos = obtenerProductos();
    return productos.some(producto =>
        producto.name.toLowerCase() === nombre.toLowerCase()
    );
}

function validarFormulario() {
    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value.trim();
    const familyId = parseInt(document.getElementById("family_id").value);

    let esValido = true;

    // Validar nombre
    if (name === "") {
        mostrarError(document.getElementById("name"), "El nombre es obligatorio");
        esValido = false;
    } else if (name.length < 2) {
        mostrarError(document.getElementById("name"), "El nombre debe tener al menos 2 caracteres");
        esValido = false;
    } else if (name.length > 100) {
        mostrarError(document.getElementById("name"), "El nombre no puede tener más de 100 caracteres");
        esValido = false;
    } else if (existeProductoConNombre(name)) {
        mostrarError(document.getElementById("name"), "Ya existe un producto con este nombre");
        esValido = false;
    }

    // Validar precio
    if (isNaN(price)) {
        mostrarError(document.getElementById("price"), "El precio debe ser un número válido");
        esValido = false;
    } else if (price < 0) {
        mostrarError(document.getElementById("price"), "El precio no puede ser negativo");
        esValido = false;
    } else if (price > 1000000) {
        mostrarError(document.getElementById("price"), "El precio no puede ser mayor a 1,000,000");
        esValido = false;
    }

    // Validar descripción
    if (description === "") {
        mostrarError(document.getElementById("description"), "La descripción es obligatoria");
        esValido = false;
    } else if (description.length > 500) {
        mostrarError(document.getElementById("description"), "La descripción no puede tener más de 500 caracteres");
        esValido = false;
    }

    // Validar familia
    if (isNaN(familyId)) {
        mostrarError(document.getElementById("family_id"), "Debes seleccionar una familia válida");
        esValido = false;
    }

    return esValido;
}

function crearProducto(event) {
    event.preventDefault();

    // Validar formulario
    if (!validarFormulario()) {
        alert("Por favor, corrige los errores en el formulario");
        return;
    }

    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value.trim();
    const family_id = parseInt(document.getElementById("family_id").value);

    const productos = obtenerProductos();

    // Generar nuevo ID
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

    // Crear nuevo producto
    const nuevoProducto = {
        id: newId,
        name,
        price,
        description,
        family_id,
        active: true
    };

    // Agregar al array de productos
    productos.push(nuevoProducto);
    guardarProductos(productos);

    alert("Producto creado correctamente");
    window.location.href = "index.html";
}