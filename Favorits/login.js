// Función para cargar los datos del cliente desde TendaFakeDades
async function cargarDatosCliente() {
    try {
        // Retorna directamente el objeto Client que viene de TendaFakeDades.js
        return Client;
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return [];
    }
}

// Función para verificar las credenciales del usuario
async function iniciarSesion(email, password) {
    try {
        const clientes = await cargarDatosCliente();
        const usuario = clientes.find(cliente => cliente.email === email);
        
        if (usuario) {
            if (usuario.password === password) {
                return { exito: true, usuario: usuario };
            } else {
                return { exito: false, mensaje: "Contraseña incorrecta" };
            }
        } else {
            return { exito: false, mensaje: "Usuario no encontrado" };
        }
    } catch (error) {
        console.error('Error en inicio de sesión:', error);
        return { exito: false, mensaje: "Error del servidor" };
    }
}

// Función para guardar los datos de la sesión
function guardarSesion(usuario) {
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
    localStorage.setItem('sesionIniciada', 'true');
}

// Función para verificar si hay una sesión activa
function verificarSesion() {
    return localStorage.getItem('sesionIniciada') === 'true';
}

// Función para redirigir si ya está logueado
function redirigirSiLogueado() {
    if (verificarSesion()) {
        window.location.href = 'COMPARADOR PRUEBA/productesLlistar.html';
    }
}

// Configuración inicial cuando el documento está listo
document.addEventListener('DOMContentLoaded', function() {
    redirigirSiLogueado();
    
    const formularioLogin = document.getElementById('formularioLogin');
    const divMensaje = document.getElementById('mensaje');
    
    formularioLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        divMensaje.style.color = 'blue';
        divMensaje.textContent = 'Verificando credenciales...';
        
        const resultado = await iniciarSesion(email, password);
        
        if (resultado.exito) {
            guardarSesion(resultado.usuario);
            window.location.href = 'COMPARADOR PRUEBA/productesLlistar.html';
        } else {
            divMensaje.style.color = 'red';
            divMensaje.textContent = resultado.mensaje;
        }
    });
});

// Función para cerrar sesión 
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('sesionIniciada');
    window.location.href = '../login.html';
    console.log('Sesión cerrada');
}

// Función para obtener el usuario actual
function obtenerUsuarioActual() {
    const usuario = localStorage.getItem('usuarioActual');
    return usuario ? JSON.parse(usuario) : null;
}