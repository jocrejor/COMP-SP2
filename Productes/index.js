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

function cargarProductos() {
    const productos = obtenerProductos();
    const familias = obtenerFamilias();
    const imagenes = obtenerImagenes();

    const tbody = document.querySelector("#productsTable tbody");
    tbody.innerHTML = "";

    if (productos.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 11;
        td.textContent = "No hay productos para mostrar.";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    productos.forEach(producto => {
        const tr = document.createElement("tr");
        if (!producto.active) {
            tr.classList.add('inactive');
        }

        // Buscar el nombre de la familia
        let familia = null;
        for (let j = 0; j < familias.length; j++) {
            if (familias[j].id === producto.family_id) {
                familia = familias[j];
                break;
            }
        }
        const nombreFamilia = familia ? familia.name : "Sin familia";

        // Contar imágenes del producto
        const imagenesProducto = [];
        for (let j = 0; j < imagenes.length; j++) {
            if (imagenes[j].product_id === producto.id) {
                imagenesProducto.push(imagenes[j]);
            }
        }
        const numImagenes = imagenesProducto.length;

        // ID
        const tdId = document.createElement("td");
        tdId.textContent = producto.id;
        tr.appendChild(tdId);

        // Nombre
        const tdNombre = document.createElement("td");
        tdNombre.textContent = producto.name;
        tr.appendChild(tdNombre);

        // Precio
        const tdPrecio = document.createElement("td");
        tdPrecio.textContent = `${producto.price.toFixed(2)} €`;
        tr.appendChild(tdPrecio);

        // Descripción
        const tdDescripcion = document.createElement("td");
        tdDescripcion.textContent = producto.description;
        tr.appendChild(tdDescripcion);

        // Familia
        const tdFamilia = document.createElement("td");
        tdFamilia.textContent = nombreFamilia;
        tr.appendChild(tdFamilia);

        // Imágenes
        const tdImagenes = document.createElement("td");
        const btnImagenes = document.createElement("button");
        btnImagenes.textContent = `Imágenes (${numImagenes})`;
        btnImagenes.classList.add("btn", "btn-images");
        btnImagenes.setAttribute("data-id", producto.id);
        tdImagenes.appendChild(btnImagenes);
        tr.appendChild(tdImagenes);

        // Detalles
        const tdDetalles = document.createElement("td");
        const btnDetalles = document.createElement("button");
        btnDetalles.textContent = "Ver Detalles";
        btnDetalles.classList.add("btn", "btn-details");
        btnDetalles.setAttribute("data-id", producto.id);
        tdDetalles.appendChild(btnDetalles);
        tr.appendChild(tdDetalles);

        // Atributos
        const tdAtributos = document.createElement("td");
        const btnAtributos = document.createElement("button");
        btnAtributos.textContent = "Atributos";
        btnAtributos.classList.add("btn", "btn-attributes");
        btnAtributos.setAttribute("data-id", producto.id);
        tdAtributos.appendChild(btnAtributos);
        tr.appendChild(tdAtributos);

        // Editar
        const tdEditar = document.createElement("td");
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn", "btn-edit");
        btnEditar.setAttribute("data-id", producto.id);
        tdEditar.appendChild(btnEditar);
        tr.appendChild(tdEditar);

        // Activo/Inactivo
        const tdToggle = document.createElement("td");
        const btnToggle = document.createElement("button");
        btnToggle.textContent = producto.active ? 'Desactivar' : 'Activar';
        btnToggle.classList.add("btn", "btn-toggle");
        btnToggle.setAttribute("data-id", producto.id);
        tdToggle.appendChild(btnToggle);
        tr.appendChild(tdToggle);

        // Borrar (solo si está inactivo)
        const tdBorrar = document.createElement("td");
        if (!producto.active) {
            const btnBorrar = document.createElement("button");
            btnBorrar.textContent = "Borrar";
            btnBorrar.classList.add("btn", "btn-delete");
            btnBorrar.setAttribute("data-id", producto.id);
            tdBorrar.appendChild(btnBorrar);
        }
        tr.appendChild(tdBorrar);

        tbody.appendChild(tr);
    });

    // Event listeners para los botones
    document.querySelectorAll(".btn-images").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            gestionarImagenes(id);
        });
    });

    document.querySelectorAll(".btn-details").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            window.location.href = `detalles.html?id=${id}`;
        });
    });

    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            window.location.href = `editar.html?id=${id}`;
        });
    });

    document.querySelectorAll(".btn-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            toggleActivo(id);
        });
    });

    document.querySelectorAll(".btn-attributes").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            window.location.href = `atributos.html?id=${id}`;
        });
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            if (confirm("¿Seguro que quieres borrar permanentemente este producto?")) {
                borrarProducto(id);
            }
        });
    });
}
