document.addEventListener('DOMContentLoaded', inicializarFavoritos);

function inicializarFavoritos() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        window.location.href = '../login.html';
        return;
    }
    
    cargarFavoritos();
    configurarBotones();
}

function cargarFavoritos() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    const favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`)) || [];
    const contenedor = document.getElementById('listaFavoritos');
    
    limpiarElemento(contenedor);
    
    if (favoritos.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No tienes comparaciones guardadas';
        contenedor.appendChild(mensaje);
        return;
    }
    
    favoritos.forEach((favorito, index) => {
        const favoritoElement = crearElementoFavorito(favorito, index);
        contenedor.appendChild(favoritoElement);
    });
}

function crearElementoFavorito(favorito, index) {
    const div = document.createElement('div');
    div.className = 'favorito-item';
    
    // Crear título
    const titulo = document.createElement('h3');
    titulo.textContent = favorito.nombre;
    div.appendChild(titulo);
    
    // Crear fecha
    const fecha = document.createElement('p');
    fecha.textContent = `Fecha: ${new Date(favorito.fecha).toLocaleDateString()}`;
    div.appendChild(fecha);
    
    // Crear lista de productos
    const productosDiv = document.createElement('div');
    productosDiv.className = 'productos-favorito';
    
    favorito.productos.forEach(producto => {
        const span = document.createElement('span');
        span.textContent = producto.nombre;
        productosDiv.appendChild(span);
        
        // Agregar coma separadora
        if (producto !== favorito.productos[favorito.productos.length - 1]) {
            const coma = document.createElement('span');
            coma.textContent = ', ';
            productosDiv.appendChild(coma);
        }
    });
    
    div.appendChild(productosDiv);
    
    // Crear botones de acción
    const botonesDiv = document.createElement('div');
    botonesDiv.className = 'botones-favorito';
    
    const btnVer = document.createElement('button');
    btnVer.textContent = 'Ver Comparación';
    btnVer.onclick = () => verComparacion(index);
    botonesDiv.appendChild(btnVer);
    
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.onclick = () => eliminarFavorito(index);
    botonesDiv.appendChild(btnEliminar);
    
    div.appendChild(botonesDiv);
    
    return div;
}

function verComparacion(index) {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    const favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`)) || [];
    const favorito = favoritos[index];
    
    localStorage.setItem('compararProductes', JSON.stringify(favorito.productos));
    window.location.href = 'comparador.html';
}

function eliminarFavorito(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta comparación?')) {
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        let favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuario.id}`)) || [];
        
        favoritos.splice(index, 1);
        localStorage.setItem(`favoritos_${usuario.id}`, JSON.stringify(favoritos));
        
        cargarFavoritos();
    }
}

function configurarBotones() {
    const botonesDiv = document.querySelector('.buttons');
    
    const btnComparador = document.createElement('button');
    btnComparador.textContent = 'Volver al Comparador';
    btnComparador.onclick = () => window.location.href = 'comparador.html';
    botonesDiv.appendChild(btnComparador);
    
    const btnCerrarSesion = document.createElement('button');
    btnCerrarSesion.textContent = 'Cerrar Sesión';
    btnCerrarSesion.onclick = cerrarSesion;
    botonesDiv.appendChild(btnCerrarSesion);
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('sesionIniciada');
    window.location.href = '../login.html';
}

function limpiarElemento(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}