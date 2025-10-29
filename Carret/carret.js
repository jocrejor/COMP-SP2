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

function mostrarInfoCliente() {
    const infoClientDiv = document.getElementById('infoClient');
    const cliente = obtenerClienteActual();
    const sesion = obtenerOCrearSesion();
    
    // Limpiar contenido anterior
    infoClientDiv.textContent = '';
    
    const divContainer = document.createElement('div');
    divContainer.style.cssText = 'padding: 10px; border-radius: 5px; margin-bottom: 20px;';
    
    if (cliente) {
        divContainer.style.background = '#f0f0f0';
        
        const h3 = document.createElement('h3');
        h3.textContent = 'Informació del client';
        divContainer.appendChild(h3);
        
        const pNom = document.createElement('p');
        const strongNom = document.createElement('strong');
        strongNom.textContent = 'Nom: ';
        pNom.appendChild(strongNom);
        pNom.appendChild(document.createTextNode(`${cliente.name} ${cliente.surname}`));
        divContainer.appendChild(pNom);
        
        const pEmail = document.createElement('p');
        const strongEmail = document.createElement('strong');
        strongEmail.textContent = 'Email: ';
        pEmail.appendChild(strongEmail);
        pEmail.appendChild(document.createTextNode(cliente.email));
        divContainer.appendChild(pEmail);
        
        const pTelefon = document.createElement('p');
        const strongTelefon = document.createElement('strong');
        strongTelefon.textContent = 'Telèfon: ';
        pTelefon.appendChild(strongTelefon);
        pTelefon.appendChild(document.createTextNode(cliente.phone));
        divContainer.appendChild(pTelefon);
        
        const pAdreca = document.createElement('p');
        const strongAdreca = document.createElement('strong');
        strongAdreca.textContent = 'Adreça: ';
        pAdreca.appendChild(strongAdreca);
        pAdreca.appendChild(document.createTextNode(`${cliente.address}, ${cliente.cp}`));
        divContainer.appendChild(pAdreca);
    } else {
        divContainer.style.background = '#fff3cd';
        
        const pSessio = document.createElement('p');
        const strongSessio = document.createElement('strong');
        strongSessio.textContent = 'Sessió anònima';
        pSessio.appendChild(strongSessio);
        divContainer.appendChild(pSessio);
        
        const pId = document.createElement('p');
        pId.textContent = `ID de carret: ${sesion.carretId}`;
        divContainer.appendChild(pId);
        
        const pMensatge = document.createElement('p');
        const em = document.createElement('em');
        em.textContent = "Per a guardar les teues comandes, inicia sessió o registra't";
        pMensatge.appendChild(em);
        divContainer.appendChild(pMensatge);
    }
    
    infoClientDiv.appendChild(divContainer);
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

// Gestión de usuario/sesión
function obtenerOCrearSesion() {
    let sesion = JSON.parse(localStorage.getItem('sesion'));
    
    if (!sesion) {
        // Crear nueva sesión con ID de carrito único
        sesion = {
            carretId: 'carret_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
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


// Función para finalizar la compra
function finalitzarComanda() {
    const carret = JSON.parse(localStorage.getItem('carret')) || [];
    
    if (!carret.length) {
        alert('El carret està buit!');
        return;
    }
    
    // Calcular total
    const total = carret.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    
    // Agregar imágenes a los productos del carrito
    const carretConImagenes = carret.map(p => {
        let imageUrl = null;
        if (typeof Productimage !== 'undefined' && Array.isArray(Productimage)) {
            const productImg = Productimage.find(img => img.product_id === p.id);
            if (productImg && productImg.url) {
                imageUrl = productImg.url;
            }
        }
        return { ...p, image: imageUrl };
    });
    
    // Crear objeto de comanda
    const comanda = {
        numeroComanda: 'ORD-' + Date.now(),
        fecha: new Date().toISOString(),
        productes: carretConImagenes,
        total: total,
        clienteId: localStorage.getItem('clienteId') || null,
        sesionId: obtenerOCrearSesion().carretId
    };
    
    // Guardar la última comanda
    localStorage.setItem('ultimaComanda', JSON.stringify(comanda));
    
    // Vaciar el carrito
    localStorage.removeItem('carret');
}


