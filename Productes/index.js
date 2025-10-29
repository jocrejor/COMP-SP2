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
    // Verificar si les dades ja estan en localStorage
    if (!localStorage.getItem('productos')) {
        // Inicialitzar productes
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
        td.textContent = "No hi ha productes per a mostrar.";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    productos.forEach(producto => {
        const tr = document.createElement("tr");
        if (!producto.active) {
            tr.classList.add('inactive');
        }

        // Cercar el nom de la família
        let familia = null;
        for (let j = 0; j < familias.length; j++) {
            if (familias[j].id === producto.family_id) {
                familia = familias[j];
                break;
            }
        }
        const nombreFamilia = familia ? familia.name : "Sense família";

        // Comptar imatges del producte
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

        // Nom
        const tdNombre = document.createElement("td");
        tdNombre.textContent = producto.name;
        tr.appendChild(tdNombre);

        // Preu
        const tdPrecio = document.createElement("td");
        tdPrecio.textContent = `${producto.price.toFixed(2)} €`;
        tr.appendChild(tdPrecio);

        // Descripció
        const tdDescripcion = document.createElement("td");
        tdDescripcion.textContent = producto.description;
        tr.appendChild(tdDescripcion);

        // Família
        const tdFamilia = document.createElement("td");
        tdFamilia.textContent = nombreFamilia;
        tr.appendChild(tdFamilia);

        // Imatges
        const tdImagenes = document.createElement("td");
        const btnImagenes = document.createElement("button");
        btnImagenes.textContent = `Imatges (${numImagenes})`;
        btnImagenes.classList.add("btn", "btn-images");
        btnImagenes.setAttribute("data-id", producto.id);
        tdImagenes.appendChild(btnImagenes);
        tr.appendChild(tdImagenes);

        // Detalls
        const tdDetalles = document.createElement("td");
        const btnDetalles = document.createElement("button");
        btnDetalles.textContent = "Detalls";
        btnDetalles.classList.add("btn", "btn-details");
        btnDetalles.setAttribute("data-id", producto.id);
        tdDetalles.appendChild(btnDetalles);
        tr.appendChild(tdDetalles);

        // Atributs
        const tdAtributos = document.createElement("td");
        const btnAtributos = document.createElement("button");
        btnAtributos.textContent = "Atributs";
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

        // Actiu/Inactiu
        const tdToggle = document.createElement("td");
        const btnToggle = document.createElement("button");
        btnToggle.textContent = producto.active ? 'Activat' : 'Desactivat';
        btnToggle.classList.add("btn", "btn-toggle");
        btnToggle.setAttribute("data-id", producto.id);
        tdToggle.appendChild(btnToggle);
        tr.appendChild(tdToggle);

        // Esborrar (només si està inactiu)
        const tdBorrar = document.createElement("td");
        if (!producto.active) {
            const btnBorrar = document.createElement("button");
            btnBorrar.textContent = "Esborrar";
            btnBorrar.classList.add("btn", "btn-delete");
            btnBorrar.setAttribute("data-id", producto.id);
            tdBorrar.appendChild(btnBorrar);
        }
        tr.appendChild(tdBorrar);

        tbody.appendChild(tr);
    });

    // Event listeners per als botons
    document.querySelectorAll(".btn-images").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            window.location.href = `imagenes.html?id=${id}`;
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
            if (confirm("Segur que vols esborrar permanentment este producte?")) {
                borrarProducto(id);
            }
        });
    });
}

function toggleActivo(id) {
    const productos = obtenerProductos();
    let producto = null;
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            producto = productos[i];
            break;
        }
    }
    if (producto) {
        producto.active = !producto.active;
        guardarProductos(productos);
        cargarProductos();
    }
}

function borrarProducto(id) {
    const productos = obtenerProductos();
    let index = -1;
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        // Eliminar també les imatges associades
        const imagenes = obtenerImagenes();
        const nuevasImagenes = [];
        for (let i = 0; i < imagenes.length; i++) {
            if (imagenes[i].product_id !== id) {
                nuevasImagenes.push(imagenes[i]);
            }
        }
        guardarImagenes(nuevasImagenes);

        productos.splice(index, 1);
        guardarProductos(productos);
        cargarProductos();
    }
}