// Función para cargar los datos desde el archivo externo
async function loadClientData() {
    try {
        // Importar datos directamente del objeto Client desde TendaFakeDades.js
        return Client; 
    } catch (error) {
        console.error('Error cargando datos:', error);
        return [];
    }
}

// Función para verificar el login
async function loginUser(email, password) {
    try {
        // Cargar datos desde el archivo externo
        const Client = await loadClientData();
        
        // Buscar el usuario por email
        const user = Client.find(client => client.email === email);
        
        if (user) {
            // Verificar la contraseña
            if (user.password === password) {
                return { success: true, user: user };
            } else {
                return { success: false, message: "Contraseña incorrecta" };
            }
        } else {
            return { success: false, message: "Usuario no encontrado" };
        }
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, message: "Error del servidor" };
    }
}

// Función para guardar datos de sesión
function saveSession(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
}

// Función para verificar si el usuario está logueado
function checkLogin() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

// Función para redirigir si ya está logueado
function redirectIfLoggedIn() {
    if (checkLogin()) {
        window.location.href = 'favorits.html';
    }
}

// Manejar el envío del formulario
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está logueado
    redirectIfLoggedIn();
    
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Mostrar mensaje de carga
        messageDiv.style.color = 'blue';
        messageDiv.textContent = 'Verificando credenciales...';
        
        const result = await loginUser(email, password);
        
        if (result.success) {
            // Guardar sesión y redirigir
            saveSession(result.user);
            messageDiv.style.color = 'green';
            messageDiv.textContent = `¡Bienvenido ${result.user.name}! Redirigiendo...`;
            
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = result.message;
        }
    });
});

// Función para cerrar sesión (la puedes usar en otras páginas)
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
    console.log('Sesión cerrada');
}

// Función para obtener el usuario actual
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}