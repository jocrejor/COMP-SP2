// Verificar sesión antes de cargar la página
    (function() {
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        if (!usuario) {
            window.location.href = '../login.html';
        }
    })();

// Variables globales
let productos = localStorage.getItem('productes') ? JSON.parse(localStorage.getItem('productes')) : Product;
let families = localStorage.getItem('families') ? JSON.parse(localStorage.getItem('families')) : Family;



// Inicialización cuando el documento está listo
document.addEventListener("DOMContentLoaded", function() {
    verificarSesion();
    main();
    cargarUsuarios();
});

// Función para verificar si hay sesión activa
function verificarSesion() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        window.location.href = '../login.html';
        return;
    }
}

// Función para cargar el selector de usuarios
function cargarUsuarios() {
    const selectUsuario = document.getElementById('userSelect');
    limpiarElemento(selectUsuario);
    
    const opcionDefault = document.createElement('option');
    opcionDefault.value = "";
    opcionDefault.textContent = "Seleccione un usuario";
    selectUsuario.appendChild(opcionDefault);
    
    Client.forEach(cliente => {
        const opcion = document.createElement('option');
        opcion.value = cliente.id;
        opcion.textContent = `${cliente.name} ${cliente.surname}`;
        
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        if (usuarioActual && usuarioActual.id === cliente.id) {
            opcion.selected = true;
        }
        
        selectUsuario.appendChild(opcion);
    });
    
    selectUsuario.addEventListener('change', manejarCambioUsuario);
}

// Manejador de cambio de usuario
function manejarCambioUsuario(e) {
    const idSeleccionado = e.target.value;
    if (idSeleccionado) {
        const usuarioSeleccionado = Client.find(c => c.id === parseInt(idSeleccionado));
        if (usuarioSeleccionado) {
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioSeleccionado));
            localStorage.setItem('sesionIniciada', 'true');
        }
    }
}

// Función principal
function main() {
    const tabla = document.getElementById('tablaProductos');
    limpiarElemento(tabla);
    
    productos.forEach((producto, index) => {
        const fila = crearFilaProducto(producto, index);
        tabla.appendChild(fila);
    });
}

// Crear fila de producto
function crearFilaProducto(producto, index) {
    const fila = document.createElement('tr');
    
    // Celda de acciones
    const celdaAcciones = document.createElement('td');
    const botonComparar = document.createElement('button');
    botonComparar.textContent = 'Comparar';
    botonComparar.onclick = () => abrirComparador(index);
    celdaAcciones.appendChild(botonComparar);
    fila.appendChild(celdaAcciones);
    
    // Celda de ID
    const celdaId = document.createElement('td');
    celdaId.textContent = producto.id;
    fila.appendChild(celdaId);
    
    // Celda de nombre
    const celdaNombre = document.createElement('td');
    celdaNombre.textContent = producto.name;
    fila.appendChild(celdaNombre);
    
    // Celda de descripción
    const celdaDescripcion = document.createElement('td');
    celdaDescripcion.textContent = producto.description;
    fila.appendChild(celdaDescripcion);
    
    // Celda de precio
    const celdaPrecio = document.createElement('td');
    celdaPrecio.textContent = `${producto.price}€`;
    fila.appendChild(celdaPrecio);
    
    return fila;
}

// Función para abrir el comparador
function abrirComparador(index) {
    window.location.href = "comparador.html?index=" + index;
}

// Función para obtener el nombre de la familia
function obtenerNombreFamilia(id) {
    const familia = families.find(f => f.id === id);
    return familia ? familia.name : 'Desconocida';
}

// Utilidad para limpiar elementos
function limpiarElemento(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}
