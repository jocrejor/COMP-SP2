
document.addEventListener('DOMContentLoaded', main)

function main() {
    mostrarInfoCliente();
    mostrarCarret();

    // Agregar evento al botón de finalizar
    const btnFinalitzar = document.getElementById('btnFinalitzar');
    if (btnFinalitzar) {
        btnFinalitzar.addEventListener('click', finalitzarComanda);
    }
}

// Gestión de usuario/sesión
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
        const textId = document.createTextNode(`ID de carret: ${sesion.carretId}`);
        pId.appendChild(textId);
        divContainer.appendChild(pId);

        const pMensatge = document.createElement('p');
        const em = document.createElement('em');
        const textMensatge = document.createTextNode("Per a guardar les teues comandes, inicia sessió o registra't");
        em.appendChild(textMensatge);
        pMensatge.appendChild(em);
        divContainer.appendChild(pMensatge);
    }

    infoClientDiv.appendChild(divContainer);
}



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
        img.width = 80;
        img.height = 80;
        img.style.objectFit = 'cover';
        div.appendChild(img);

        const divInfo = document.createElement('div');
        divInfo.style.flex = '1';

        const spanNom = document.createElement('p');
        const textNom = document.createTextNode(p.name);
        spanNom.appendChild(textNom);
        spanNom.style.cssText = 'margin: 0; font-weight: bold;';
        divInfo.appendChild(spanNom);

        const spanPreu = document.createElement('p');
        const textPreu = document.createTextNode('Preu: ' + p.price.toFixed(2) + ' €');
        spanPreu.appendChild(textPreu);
        spanPreu.style.margin = '5px 0';
        divInfo.appendChild(spanPreu);

        div.appendChild(divInfo);

        const spanQuantitat = document.createElement('div');
        spanQuantitat.style.cssText = 'display: flex; align-items: center; gap: 10px;';

        const btnRestar = document.createElement('button');
        btnRestar.dataset.i = i;
        const textRestar = document.createTextNode('-');
        btnRestar.appendChild(textRestar);
        btnRestar.style.cssText = 'padding: 5px 10px; cursor: pointer;';
        btnRestar.addEventListener('click', () => restar(i));

        const spanNumQuantitat = document.createElement('span');
        const textQuantitat = document.createTextNode(p.quantity);
        spanNumQuantitat.appendChild(textQuantitat);
        spanNumQuantitat.style.cssText = 'min-width: 30px; text-align: center; font-weight: bold;';

        const btnSumar = document.createElement('button');
        btnSumar.dataset.i = i;
        const textSumar = document.createTextNode('+');
        btnSumar.appendChild(textSumar);
        btnSumar.style.cssText = 'padding: 5px 10px; cursor: pointer;';
        btnSumar.addEventListener('click', () => sumar(i));

        spanQuantitat.appendChild(btnRestar);
        spanQuantitat.appendChild(spanNumQuantitat);
        spanQuantitat.appendChild(btnSumar);
        div.appendChild(spanQuantitat);

        const spanSubtotal = document.createElement('span');
        const textSubtotal = document.createTextNode((p.price * p.quantity).toFixed(2) + ' €');
        spanSubtotal.appendChild(textSubtotal);
        spanSubtotal.style.cssText = 'min-width: 80px; text-align: right; font-weight: bold;';
        div.appendChild(spanSubtotal);

        const btnEliminar = document.createElement('button');
        btnEliminar.dataset.i = i;
        const textEliminar = document.createTextNode('✖');
        btnEliminar.appendChild(textEliminar);
        btnEliminar.style.cssText = 'padding: 5px 10px; cursor: pointer; background: #dc3545; color: white; border: none; border-radius: 3px;';
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

//Simular login de un cliente (para pruebas)
function simularLogin(clienteId) {
    localStorage.setItem('clienteId', clienteId);
    mostrarInfoCliente();
    alert('Login simulat per al client ID: ' + clienteId);
}

//Cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('clienteId');
    mostrarInfoCliente();
    alert('Sessió tancada');
}

// Función para finalizar la compra
function finalitzarComanda() {
    const carret = JSON.parse(localStorage.getItem('carret')) || [];

    if (!carret.length) {
        alert('El carret està buit!');
        return;
    }

    // Verificar si hay un cliente logueado
    const clienteId = localStorage.getItem('clienteId');
    if (!clienteId) {
        alert('Has d\'iniciar sessió per finalitzar la compra.\n\nSi us plau, registra\'t o inicia sessió per continuar.');
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
        clienteId: clienteId,
        sesionId: obtenerOCrearSesion().carretId
    };

    // Guardar la última comanda
    localStorage.setItem('ultimaComanda', JSON.stringify(comanda));

    // Vaciar el carrito
    localStorage.removeItem('carret');

    // Redirigir a la página de confirmación
    window.location.href = 'confirmacio.html';
}

