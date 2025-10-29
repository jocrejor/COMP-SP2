// Muestra el carrito automáticamente cuando la página termina de cargarse
document.addEventListener('DOMContentLoaded', () => {
        mostrarInfoCliente();
        mostrarCarret();        
});

// Función principal para mostrar el carrito y gestionar las acciones
function mostrarCarret() {
    // Obtiene el carrito del localStorage o crea un array vacío si no existe
    const carret = JSON.parse(localStorage.getItem('carret')) || [];
    const elementsCarret = document.getElementById('elementsCarret');
    const totalSpan = document.getElementById('total');
    let total = 0;
    
    // Si el carrito está vacío, muestra el mensaje y oculta el contenido
    if (!carret.length) {
        document.getElementById('carretBuit').style.display = 'block';
        document.getElementById('contingutCarret').style.display = 'none';
        return;
    }

    document.getElementById('carretBuit').style.display = 'none';
    document.getElementById('contingutCarret').style.display = 'block';

    elementsCarret.textContent = '';
    const fragment = document.createDocumentFragment();

    carret.forEach((p, i) => {
        const div = document.createElement('div');

        const productImg = Productimage ? Productimage.find(img => img.product_id === p.id) : null;
        const img = document.createElement("img");
        img.src = productImg && productImg.url ? productImg.url : "https://freesvg.org/img/Simple-Image-Not-Found-Icon.png";
        img.alt = p.name || 'product';
        img.width = 60;
        img.height = 60;
        div.appendChild(img);

        const spanNom = document.createElement('span');
        spanNom.textContent = p.name;
        div.appendChild(spanNom);

        const spanPreu = document.createElement('span');
        spanPreu.textContent = p.price.toFixed(2) + ' €';
        div.appendChild(spanPreu);

        const spanQuantitat = document.createElement('span');

        const btnRestar = document.createElement('button');
        btnRestar.dataset.i = i;
        btnRestar.textContent = '-';
        btnRestar.addEventListener('click', () => restar(i));

        const spanNumQuantitat = document.createElement('span');
        spanNumQuantitat.textContent = p.quantity;

        const btnSumar = document.createElement('button');
        btnSumar.dataset.i = i;
        btnSumar.textContent = '+';
        btnSumar.addEventListener('click', () => sumar(i));

        spanQuantitat.appendChild(btnRestar);
        spanQuantitat.appendChild(spanNumQuantitat);
        spanQuantitat.appendChild(btnSumar);
        div.appendChild(spanQuantitat);

        const btnEliminar = document.createElement('button');
        btnEliminar.dataset.i = i;
        btnEliminar.textContent = '✖';
        btnEliminar.addEventListener('click', () => eliminar(i));
        div.appendChild(btnEliminar);

        fragment.appendChild(div);
    });
    

    elementsCarret.appendChild(fragment);
    // Calcula el total del carrito sumando el precio por cantidad de cada producto
    total = carret.reduce((s, p) => s + p.price * p.quantity, 0);
    totalSpan.textContent = `${total.toFixed(2)} €`;
}

// Funciones para modificar el carrito

// Incrementa en 1 la cantidad del producto seleccionado
function sumar(index) {
    const carret = JSON.parse(localStorage.getItem('carret')) || [];
    carret[index].quantity++;
    localStorage.setItem('carret', JSON.stringify(carret));
    mostrarCarret(); // Se actualiza la vista del carrito
}

// Disminuye en 1 la cantidad del producto seleccionado (siempre que sea mayor a 1)
function restar(index) {
    const carret = JSON.parse(localStorage.getItem('carret')) || [];
    if (carret[index].quantity > 1) {
        carret[index].quantity--;
        localStorage.setItem('carret', JSON.stringify(carret));
        mostrarCarret(); // Se actualiza la vista del carrito
    }
}

// Elimina completamente el producto seleccionado del carrito
function eliminar(index) {
    const carret = JSON.parse(localStorage.getItem('carret')) || [];
    carret.splice(index, 1); // Quita el elemento del array
    localStorage.setItem('carret', JSON.stringify(carret));
    mostrarCarret(); // Se actualiza la vista del carrito
}

function obtenerOCrearSesion() {
    let sesion = JSON.parse(localStorage.getItem('sesion'));
    
    if (!sesion) {
        // Crear nueva sesión con ID de carrito único
        sesion = {
            carretId: 'carret_' + Date.now(),
            fecha: new Date().toISOString()
        };
        localStorage.setItem('sesion', JSON.stringify(sesion));
    }
    
    return sesion;
}

function obtenerClienteActual() {
    // Intenta obtener el cliente del localStorage
    const clienteId = localStorage.getItem('clienteId');
    
    if (clienteId && typeof Client !== 'undefined') {
        return Client.find(c => c.id === parseInt(clienteId));
    }
    
    return null;
}

function mostrarInfoCliente() {
    const infoClientDiv = document.getElementById('infoClient');
    const cliente = obtenerClienteActual();
    const sesion = obtenerOCrearSesion();
    
    if (cliente) {
        infoClientDiv.innerHTML = `
            <div style="background: #f0f0f0; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                <h3>Informació del client</h3>
                <p><strong>Nom:</strong> ${cliente.name} ${cliente.surname}</p>
                <p><strong>Email:</strong> ${cliente.email}</p>
                <p><strong>Telèfon:</strong> ${cliente.phone}</p>
                <p><strong>Adreça:</strong> ${cliente.address}, ${cliente.cp}</p>
            </div>
        `;
    } else {
        infoClientDiv.innerHTML = `
            <div style="background: #fff3cd; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                <p><strong>Sessió anònima</strong></p>
                <p>ID de carret: ${sesion.carretId}</p>
                <p><em>Per a guardar les teues comandes, inicia sessió o registra't</em></p>
            </div>
        `;
    }
}

// Función extra: Simular login de un cliente (para pruebas)
function simularLogin(clienteId) {
    localStorage.setItem('clienteId', clienteId);
    mostrarInfoCliente();
    alert('Login simulat per al client ID: ' + clienteId);
}

// Función extra: Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('clienteId');
    mostrarInfoCliente();
    alert('Sessió tancada');
}


