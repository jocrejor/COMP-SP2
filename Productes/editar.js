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
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        guardarCambios(id);
    });

    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Afegir validació en temps real
    agregarValidacionEnTiempoReal(id);
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

    // Netejar opcions existents
    select.innerHTML = '';

    // Afegir opció per defecte
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Selecciona una família";
    defaultOption.disabled = true;
    select.appendChild(defaultOption);

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

function agregarValidacionEnTiempoReal(productoId) {
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const descriptionInput = document.getElementById("description");
    const familySelect = document.getElementById("family_id");

    // Validar nom
    nameInput.addEventListener("blur", function () {
        const name = this.value.trim();
        if (name === "") {
            mostrarError(this, "El nom és obligatori");
        } else if (name.length < 2) {
            mostrarError(this, "El nom ha de tenir almenys 2 caràcters");
        } else if (name.length > 100) {
            mostrarError(this, "El nom no pot tenir més de 100 caràcters");
        } else if (existeProductoConNombre(name, productoId)) {
            mostrarError(this, "Ja existeix un producte amb este nom");
        } else {
            limpiarError(this);
        }
    });

    // Validar preu
    priceInput.addEventListener("blur", function () {
        const price = parseFloat(this.value);
        if (isNaN(price)) {
            mostrarError(this, "El preu ha de ser un número vàlid");
        } else if (price < 0) {
            mostrarError(this, "El preu no pot ser negatiu");
        } else if (price > 1000000) {
            mostrarError(this, "El preu no pot ser major a 1.000.000");
        } else {
            limpiarError(this);
        }
    });

    // Validar descripció
    descriptionInput.addEventListener("blur", function () {
        const description = this.value.trim();
        if (description === "") {
            mostrarError(this, "La descripció és obligatòria");
        } else if (description.length > 500) {
            mostrarError(this, "La descripció no pot tenir més de 500 caràcters");
        } else {
            limpiarError(this);
        }
    });

    // Validar família
    familySelect.addEventListener("change", function () {
        const familyId = parseInt(this.value);
        if (isNaN(familyId)) {
            mostrarError(this, "Has de seleccionar una família vàlida");
        } else {
            limpiarError(this);
        }
    });
}

function mostrarError(input, mensaje) {
    // Netejar error anterior
    limpiarError(input);

    // Afegir classe d'error
    input.classList.add("error");

    // Crear element d'error
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = mensaje;

    // Inserir després de l'input
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

function limpiarError(input) {
    // Eliminar classe d'error
    input.classList.remove("error");

    // Eliminar missatge d'error si existeix
    const errorElement = input.parentNode.querySelector(".error-message");
    if (errorElement) {
        errorElement.remove();
    }
}

function existeProductoConNombre(nombre, productoId) {
    const productos = obtenerProductos();
    return productos.some(producto =>
        producto.id !== productoId &&
        producto.name.toLowerCase() === nombre.toLowerCase()
    );
}

function validarFormulario(productoId) {
    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value.trim();
    const familyId = parseInt(document.getElementById("family_id").value);

    let esValido = true;

    // Validar nom
    if (name === "") {
        mostrarError(document.getElementById("name"), "El nom és obligatori");
        esValido = false;
    } else if (name.length < 2) {
        mostrarError(document.getElementById("name"), "El nom ha de tenir almenys 2 caràcters");
        esValido = false;
    } else if (name.length > 100) {
        mostrarError(document.getElementById("name"), "El nom no pot tenir més de 100 caràcters");
        esValido = false;
    } else if (existeProductoConNombre(name, productoId)) {
        mostrarError(document.getElementById("name"), "Ja existeix un producte amb este nom");
        esValido = false;
    }

    // Validar preu
    if (isNaN(price)) {
        mostrarError(document.getElementById("price"), "El preu ha de ser un número vàlid");
        esValido = false;
    } else if (price < 0) {
        mostrarError(document.getElementById("price"), "El preu no pot ser negatiu");
        esValido = false;
    } else if (price > 1000000) {
        mostrarError(document.getElementById("price"), "El preu no pot ser major a 1.000.000");
        esValido = false;
    }

    if (description === "") {
        mostrarError(document.getElementById("description"), "La descripció és obligatòria");
        esValido = false;
    } else if (description.length > 500) {
        mostrarError(document.getElementById("description"), "La descripció no pot tenir més de 500 caràcters");
        esValido = false;
    }

    // Validar família
    if (isNaN(familyId)) {
        mostrarError(document.getElementById("family_id"), "Has de seleccionar una família vàlida");
        esValido = false;
    }

    return esValido;
}

function guardarCambios(id) {
    // Validar formulari
    if (!validarFormulario(id)) {
        alert("Per favor, corregeix els errors en el formulari");
        return;
    }

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
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value.trim();
    const family_id = parseInt(document.getElementById("family_id").value);

    // Actualitzar el producte
    producto.name = name;
    producto.price = price;
    producto.description = description;
    producto.family_id = family_id;

    guardarProductos(productos);
    alert("Producte modificat correctament");
    window.location.href = "index.html";
}