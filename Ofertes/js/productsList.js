document.addEventListener("DOMContentLoaded", function() {
    const tableBody        = document.getElementById('tableBody');
    const pageTitle        = document.getElementById('pageTitle');
    const paginationInfo   = document.getElementById('paginationInfo');
    const addProductButton = document.getElementById('addProductButton');
    
    const params = new URLSearchParams(window.location.search);
    const ofertaId = params.get('oferta');
    
    const data = JSON.parse(localStorage.getItem("formData")) || [];
    const oferta = data[ofertaId];
    
    if (!oferta) {
        mostrarError("No s'ha trobat l'oferta sol·licitada");
        return;
    }
    
    pageTitle.appendChild(document.createTextNode(`Productes - ${oferta.oferta}`));
    
    addProductButton.addEventListener('click', function() {
        mostrarModalProductos(ofertaId);
    });
    
    cargarProductosAplicados(ofertaId);
});

// Funció per a obtindre ProductSale des de localStorage o utilitzar l'original
// Si no existeix en localStorage, torna un array buit
function obtenerProductSale() {
    const productSaleGuardado = localStorage.getItem('productSaleData');
    if (productSaleGuardado) {
        return JSON.parse(productSaleGuardado);
    } else if (typeof ProductSale !== 'undefined') {
        // Guardar el ProductSale original en localStorage la primera vez
        localStorage.setItem('productSaleData', JSON.stringify(ProductSale));
        return ProductSale;
    }
    return [];
}

// Función para guardar ProductSale en localStorage
function guardarProductSale(productSale) {
    localStorage.setItem('productSaleData', JSON.stringify(productSale));
}

// Funció principal que carrega i mostra els productes aplicats a una oferta específica
// Utilitza buscarProductosAplicados per obtindre els productes i després els mostra en la taula
function cargarProductosAplicados(ofertaId) {
    const productosAplicados = buscarProductosAplicados(ofertaId);
    
    if (productosAplicados.length === 0) {
        mostrarNoProductos();
        return;
    }
    
    const infoText = document.createTextNode(
        `Mostrant ${productosAplicados.length} productes aplicats a l'oferta`
    );
    paginationInfo.appendChild(infoText);
    
    renderTable(productosAplicados, ofertaId);
}

// Funció que busca tots els productes que estan associats a una oferta específica
// Retorna un array amb els productes trobats
function buscarProductosAplicados(ofertaId) {
    const productosAplicados = [];
    const productSale = obtenerProductSale();
    
    productSale.forEach(function(relacion) {
        const saleIdAproximado = parseInt(ofertaId) + 1;
        
        if (relacion.sale_id === saleIdAproximado) {
            const producto = Product.find(function(p) {
                return p.id === relacion.product_id;
            });
            
            if (producto) {
                const familia = Family.find(function(f) {
                    return f.id === producto.family_id;
                });
                
                productosAplicados.push({
                    id: producto.id,
                    name: producto.name,
                    price: producto.price,
                    description: producto.description,
                    familyName: familia ? familia.name : 'Desconeguda',
                    productSaleId: relacion.id || null
                });
            }
        }
    });
    
    return productosAplicados;
}

// Funció que renderitza la taula amb els productes
// S'encarrega de netejar la taula i mostrar els productes amb les seues accions
function renderTable(productos, ofertaId) {
    if (!tableBody) return;
    
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    
    productos.forEach(function(producto, index) {
        const row = document.createElement("tr");
        
        const idCell     = document.createElement("td");
        const nameCell   = document.createElement("td");
        const priceCell  = document.createElement("td");
        const descCell   = document.createElement("td");
        const familyCell = document.createElement("td");
        const actionCell = document.createElement("td");
        
        idCell.appendChild(document.createTextNode(producto.id));
        nameCell.appendChild(document.createTextNode(producto.name));
        priceCell.appendChild(document.createTextNode(producto.price + " €"));
        descCell.appendChild(document.createTextNode(producto.description));
        familyCell.appendChild(document.createTextNode(producto.familyName));
        
        const removeButton = document.createElement("button");
        removeButton.appendChild(document.createTextNode("Eliminar"));
        removeButton.addEventListener('click', function() {
            eliminarProductoDeOferta(ofertaId, producto.id);
        });
        
        actionCell.appendChild(removeButton);
        
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(descCell);
        row.appendChild(familyCell);
        row.appendChild(actionCell);
        
        tableBody.appendChild(row);
    });
}

// Funció que mostra un modal amb els productes disponibles per a afegir a l'oferta
// Crea dinàmicament el modal amb tots els seus components i controls
function mostrarModalProductos(ofertaId) {
    const modal     = document.createElement("div");
    modal.className = 'modal';
    
    const modalContent     = document.createElement("div");
    modalContent.className = 'modal-content';
    
    const modalTitle     = document.createElement("h2");
    modalTitle.className = 'modal-title';
    modalTitle.appendChild(document.createTextNode("Seleccionar Productes per a l'Oferta"));
    
    const productosDisponibles = obtenerProductosDisponibles(ofertaId);
    
    const productList     = document.createElement("div");
    productList.className = 'product-list';
    
    if (productosDisponibles.length === 0) {
        const noProductsMsg = document.createElement("div");
        noProductsMsg.className = 'no-data';
        noProductsMsg.style.padding = '20px';
        noProductsMsg.style.textAlign = 'center';
        noProductsMsg.appendChild(document.createTextNode("No hi ha més productes disponibles per afegir"));
        productList.appendChild(noProductsMsg);
    } else {
        productosDisponibles.forEach(function(producto) {
            const productItem     = document.createElement("div");
            productItem.className = 'product-item';
            
            const productInfo     = document.createElement("div");
            productInfo.className = 'product-info';
            
            const productName     = document.createElement("div");
            productName.className = 'product-name';
            productName.appendChild(document.createTextNode(producto.name));
            
            const productDetails     = document.createElement("div");
            productDetails.className = 'product-details';
            productDetails.appendChild(document.createTextNode(
                `${producto.price} € | ${producto.familyName}`
            ));
            
            productInfo.appendChild(productName);
            productInfo.appendChild(productDetails);
            
            const addButton     = document.createElement("button");
            addButton.className = 'modal-add-button';
            addButton.appendChild(document.createTextNode("Afegir"));
            addButton.addEventListener('click', function() {
                afegirProducteAOferta(ofertaId, producto.id);
                modal.remove();
            });
            
            productItem.appendChild(productInfo);
            productItem.appendChild(addButton);
            productList.appendChild(productItem);
        });
    }
    
    const closeButton     = document.createElement("button");
    closeButton.className = 'modal-close-button';
    closeButton.appendChild(document.createTextNode("Tancar"));
    closeButton.addEventListener('click', function() {
        modal.remove();
    });
    
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(productList);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function obtenerProductosDisponibles(ofertaId) {
    const productosAplicados    = buscarProductosAplicados(ofertaId);
    const productosAplicadosIds = productosAplicados.map(p => p.id);
    
    const productosDisponibles = [];
    
    if (typeof Product !== 'undefined') {
        Product.forEach(function(producto) {
            if (!productosAplicadosIds.includes(producto.id)) {
                const familia = Family.find(function(f) {
                    return f.id === producto.family_id;
                });
                
                productosDisponibles.push({
                    id: producto.id,
                    name: producto.name,
                    price: producto.price,
                    familyName: familia ? familia.name : 'Desconeguda'
                });
            }
        });
    }
    
    return productosDisponibles;
}

// Funció per a afegir un producte a una oferta
// Comprova si ja existeix la relació i si no, la crea i guarda en localStorage
function afegirProducteAOferta(ofertaId, productId) {
    const productSale      = obtenerProductSale();
    const saleIdAproximado = parseInt(ofertaId) + 1;
    
    // Buscar si ya existe la relación
    const existeRelacion = productSale.find(function(rel) {
        return rel.sale_id === saleIdAproximado && rel.product_id === productId;
    });
    
    if (!existeRelacion) {
        // Crear nueva relación con ID único
        const nuevoId = Math.max(...productSale.map(r => r.id || 0), 0) + 1;
        
        const nuevaRelacion = {
            id: nuevoId,
            sale_id: saleIdAproximado,
            product_id: productId
        };
        
        productSale.push(nuevaRelacion);
        guardarProductSale(productSale);
        cargarProductosAplicados(ofertaId);
        mostrarMensaje("Producte afegit correctament a l'oferta", "success");
    } else {
        mostrarMensaje("Aquest producte ja està a l'oferta", "error");
    }
}

// Funció que elimina un producte d'una oferta específica
// Demana confirmació abans d'eliminar i actualitza la vista després
function eliminarProductoDeOferta(ofertaId, productId) {
    if (confirm("Estàs segur que vols eliminar aquest producte de l'oferta?")) {
        const productSale      = obtenerProductSale();
        const saleIdAproximado = parseInt(ofertaId) + 1;
        
        const index = productSale.findIndex(function(rel) {
            return rel.sale_id === saleIdAproximado && rel.product_id === productId;
        });
        
        if (index !== -1) {
            productSale.splice(index, 1);
            guardarProductSale(productSale);
            cargarProductosAplicados(ofertaId);
            mostrarMensaje("Producte eliminat correctament de l'oferta", "success");
        }
    }
}

function mostrarMensaje(texto, tipo = "success") {
    const mensaje     = document.createElement("div");
    mensaje.className = `notification ${tipo}`;
    mensaje.appendChild(document.createTextNode(texto));
    
    document.body.appendChild(mensaje);
    
    setTimeout(function() {
        mensaje.remove();
    }, 3000);
}

function mostrarError(mensaje) {
    if (!tableBody) return;
    
    const row  = document.createElement("tr");
    const cell = document.createElement("td");
    cell.setAttribute("colspan", "6");
    cell.className = 'no-data';
    cell.appendChild(document.createTextNode(mensaje));
    row.appendChild(cell);
    tableBody.appendChild(row);
}

function mostrarNoProductos() {
    if (!tableBody) return;
    
    const row  = document.createElement("tr");
    const cell = document.createElement("td");
    cell.setAttribute("colspan", "6");
    cell.className = 'no-data';
    cell.appendChild(document.createTextNode("No hi ha productes aplicats a aquesta oferta"));
    row.appendChild(cell);
    tableBody.appendChild(row);
}