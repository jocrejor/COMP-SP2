document.addEventListener('DOMContentLoaded', () => {
    mostrarInfoCliente();
    mostrarResumenCompra();
});

function obtenerClienteActual() {
    const clienteId = localStorage.getItem('clienteId');
    if (clienteId && typeof Client !== 'undefined') {
        return Client.find(c => c.id === parseInt(clienteId));
    }
    return null;
}

function obtenerSesion() {
    return JSON.parse(localStorage.getItem('sesion'));
}

function mostrarInfoCliente() {
    const clientInfoDiv = document.getElementById('clientInfo');
    const cliente = obtenerClienteActual();
    const sesion = obtenerSesion();

    clientInfoDiv.textContent = '';

    const h3 = document.createElement('h3');
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');

    if (cliente) {
        h3.textContent = 'Informació d\'enviament';
        p1.textContent = `${cliente.name} ${cliente.surname}`;
        p2.textContent = `${cliente.address}, ${cliente.cp}`;
        
        const p3 = document.createElement('p');
        p3.textContent = cliente.email;
        
        clientInfoDiv.appendChild(h3);
        clientInfoDiv.appendChild(p1);
        clientInfoDiv.appendChild(p2);
        clientInfoDiv.appendChild(p3);
    } else {
        h3.textContent = 'Sessió anònima';
        p1.textContent = `ID: ${sesion ? sesion.carretId : 'N/A'}`;
        
        clientInfoDiv.appendChild(h3);
        clientInfoDiv.appendChild(p1);
    }
}

function mostrarResumenCompra() {
    const comandaStr = localStorage.getItem('ultimaComanda');
    
    if (!comandaStr) {
        const container = document.querySelector('.container');
        container.textContent = '';
        
        const h1 = document.createElement('h1');
        h1.textContent = "No s'ha trobat cap comanda";
        
        const p = document.createElement('p');
        p.className = 'subtitle';
        p.textContent = 'Sembla que no hi ha cap comanda recent';
        
        const divButtons = document.createElement('div');
        divButtons.className = 'buttons';
        
        const btnTenda = document.createElement('a');
        btnTenda.href = 'listarproductes.html';
        btnTenda.className = 'btn btn-primary';
        btnTenda.textContent = 'Anar a la tenda';
        
        divButtons.appendChild(btnTenda);
        container.appendChild(h1);
        container.appendChild(p);
        container.appendChild(divButtons);
        return;
    }

    const comanda = JSON.parse(comandaStr);

    document.getElementById('numComanda').textContent = comanda.numeroComanda || 'N/A';
    
    const fecha = new Date(comanda.fecha);
    document.getElementById('dataComanda').textContent = fecha.toLocaleString('ca-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const totalProductes = comanda.productes.reduce((sum, p) => sum + p.quantity, 0);
    document.getElementById('numProductes').textContent = totalProductes;
    document.getElementById('totalComanda').textContent = comanda.total.toFixed(2) + ' €';

    const productsListDiv = document.getElementById('productsList');
    productsListDiv.textContent = '';

    comanda.productes.forEach(p => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'product-item';

        const img = document.createElement('img');
        img.src = p.image || 'https://freesvg.org/img/Simple-Image-Not-Found-Icon.png';
        img.alt = p.name;
        img.width = 80;
        img.height = 80;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'product-item-info';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'product-item-name';
        nameDiv.textContent = p.name;

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'product-item-details';
        detailsDiv.textContent = `${p.quantity} x ${p.price.toFixed(2)} € = ${(p.quantity * p.price).toFixed(2)} €`;

        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(detailsDiv);

        itemDiv.appendChild(img);
        itemDiv.appendChild(infoDiv);

        productsListDiv.appendChild(itemDiv);
    });
}
