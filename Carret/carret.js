// Muestra el carrito automáticamente cuando la página termina de cargarse
document.addEventListener('DOMContentLoaded', () => {
        mostrarCarret();
});

// Función principal para mostrar el carrito y gestionar las acciones
function mostrarCarret() {
    // Obtiene el carrito del localStorage o crea un array vacío si no existe
    const carret = JSON.parse(localStorage.getItem('carret')) || [];
    const elementsCarret = document.getElementById('elementsCarret');
    const totalSpan = document.getElementById('total');
    let total = 0;

    // Obtener datos del cliente que está comprando (login no implementado aún)
    const client = obtenerClient();
    // Mostrar info básica del cliente en la UI (si hay un contenedor con id 'clientInfo', usarlo; si no, crear uno arriba)
    let clientInfoEl = document.getElementById('clientInfo');
    if (!clientInfoEl) {
        clientInfoEl = document.createElement('div');
        clientInfoEl.id = 'clientInfo';
        // Insertar el bloque de cliente antes del contenido del carrito si existe
        const cont = document.getElementById('contingutCarret') || elementsCarret;
        if (cont && cont.parentNode) cont.parentNode.insertBefore(clientInfoEl, cont);
    }
    clientInfoEl.textContent = `Client: ${client.name || ''} ${client.surname || ''} — ${client.email || ''}`;

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

        const img = document.createElement('img');
        img.src = p.image;
        img.alt = p.name;
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

