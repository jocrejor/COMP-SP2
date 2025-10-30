document.addEventListener('DOMContentLoaded', main)

function main() {
    // Inicializar productos en localStorage si no existen
    if (!localStorage.getItem('productes') && typeof Product !== 'undefined') {
        localStorage.setItem('productes', JSON.stringify(Product));
    }
    
    mostrarProductes();
}

function mostrarProductes() {
    const container = document.getElementById('productes-container');
    
    // Verificar que el contenedor existe
    if (!container) {
        console.error('No s\'ha trobat el contenidor #productes-container');
        return;
    }
    
    // Obtener productos del localStorage o usar Product directamente
    let productes = null;
    
    // Intentar obtener del localStorage primero
    const productesStorage = localStorage.getItem('productes');
    if (productesStorage) {
        productes = JSON.parse(productesStorage);
    } else if (typeof Product !== 'undefined') {
        // Si no hay en localStorage, usar la variable global Product
        productes = Product;
        localStorage.setItem('productes', JSON.stringify(Product));
    }
    
    // Verificar que tenemos productos
    if (!productes || !Array.isArray(productes) || productes.length === 0) {
        container.innerHTML = '<p>No hi ha productes disponibles</p>';
        console.error('No s\'han trobat productes');
        return;
    }
    
    // Limpiar el contenedor
    container.innerHTML = '';
    
    productes.forEach(p => {
        const div = document.createElement('div');
        div.style.cssText = 'border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px;';

        // Buscar la imagen asociada usando la id del producto actual (p)
        const productImg = (typeof Productimage !== 'undefined') 
            ? Productimage.find(img => img.product_id === p.id) 
            : null;
        
        const img = document.createElement("img");
        img.src = (productImg && productImg.url) 
            ? productImg.url 
            : "https://freesvg.org/img/Simple-Image-Not-Found-Icon.png";
        img.alt = p.name || 'product';
        img.width = 120;
        img.height = 120;
        img.style.cssText = 'display: block; margin-bottom: 10px; object-fit: cover;';
        div.appendChild(img);

        const pName = document.createElement('p');
        const strong = document.createElement('strong');
        const textName = document.createTextNode(p.name);
        strong.appendChild(textName);
        pName.appendChild(strong);
        pName.style.cssText = 'margin: 10px 0; font-size: 18px;';
        div.appendChild(pName);

        const pDesc = document.createElement('p');
        const textDesc = document.createTextNode(p.description);
        pDesc.appendChild(textDesc);
        pDesc.style.cssText = 'margin: 10px 0; color: #666;';
        div.appendChild(pDesc);

        const pPrice = document.createElement('p');
        const textPrice = document.createTextNode(`Preu: ${p.price.toFixed(2)} €`);
        pPrice.appendChild(textPrice);
        pPrice.style.cssText = 'margin: 10px 0; font-size: 20px; font-weight: bold; color: #28a745;';
        div.appendChild(pPrice);

        const btn = document.createElement('button');
        const textBtn = document.createTextNode('Afegir al carret');
        btn.appendChild(textBtn);
        btn.style.cssText = 'padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;';
        btn.addEventListener('click', () => afegirAlCarret(p.id));
        div.appendChild(btn);

        container.appendChild(div);
    });
}

function afegirAlCarret(id) {
    // Obtener productos del localStorage o de la variable global
    let productes = null;
    const productesStorage = localStorage.getItem('productes');
    
    if (productesStorage) {
        productes = JSON.parse(productesStorage);
    } else if (typeof Product !== 'undefined') {
        productes = Product;
    }
    
    // Buscar el producto
    const producte = productes ? productes.find(pr => pr.id === id) : null;
    
    if (!producte) {
        showModal('Producte no trobat');
        console.error('Producte amb id', id, 'no trobat');
        return;
    }

    // Obtener carrito actual
    let carret = JSON.parse(localStorage.getItem('carret')) || [];
    const index = carret.findIndex(p => p.id === id);

    if (index >= 0) {
        // Si ya existe, incrementar cantidad
        carret[index].quantity = (carret[index].quantity || 1) + 1;
    } else {
        // Si no existe, añadirlo con cantidad 1
        carret.push({ 
            id: producte.id, 
            name: producte.name, 
            price: producte.price, 
            quantity: 1 
        });
    }

    // Guardar en localStorage
    localStorage.setItem('carret', JSON.stringify(carret));
    showModal(`Producte "${producte.name}" afegit al carret!`);
}

// Función para mostrar el modal
function showModal(message, onClose = null) {
    // Crear o reutilizar el overlay del modal
    let modalOverlay = document.getElementById('modalOverlay');
    if (!modalOverlay) {
        modalOverlay = document.createElement('div');
        modalOverlay.id = 'modalOverlay';
        modalOverlay.className = 'modal-overlay';
        document.body.appendChild(modalOverlay);
    }

    // Crear el contenido del modal
    const modalContent = document.createElement('div');
    modalContent.className = 'modal';

    const messageP = document.createElement('p');
    messageP.className = 'modal-message';
    messageP.appendChild(document.createTextNode(message));
    modalContent.appendChild(messageP);

    const closeButton = document.createElement('button');
    closeButton.className = 'modal-button';
    closeButton.appendChild(document.createTextNode('Acceptar'));
    closeButton.onclick = () => {
        modalOverlay.style.display = 'none';
        if (onClose) onClose();
    };
    modalContent.appendChild(closeButton);

    // Limpiar y mostrar el modal
    modalOverlay.textContent = '';
    modalOverlay.appendChild(modalContent);
    modalOverlay.style.display = 'flex';
}
