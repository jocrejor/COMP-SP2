document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById('tableBody');
    const pageTitle = document.getElementById('pageTitle');
    const paginationInfo = document.getElementById('paginationInfo');
    
    // Obtener el ID de la oferta de la URL
    const params = new URLSearchParams(window.location.search);
    const ofertaId = params.get('oferta');
    
    // Cargar datos de la oferta
    const data = JSON.parse(localStorage.getItem("formData")) || [];
    const oferta = data[ofertaId];
    
    if (!oferta) {
        mostrarError("No s'ha trobat l'oferta sol·licitada");
        return;
    }
    
    // Actualizar título de la página
    pageTitle.appendChild(document.createTextNode(`Productes - ${oferta.oferta}`));
    
    // Buscar productos aplicados a esta oferta
    const productosAplicados = buscarProductosAplicados(ofertaId);
    
    if (productosAplicados.length === 0) {
        mostrarNoProductos();
        return;
    }
    
    // Mostrar información de paginación
    const infoText = document.createTextNode(
        `Mostrant ${productosAplicados.length} productes aplicats a l'oferta "${oferta.oferta}"`
    );
    paginationInfo.appendChild(infoText);
    
    // Renderizar tabla de productos
    renderTable(productosAplicados);
});

function buscarProductosAplicados(ofertaId) {
    const productosAplicados = [];
    
    // Buscar en ProductSale los productos asociados a esta oferta
    if (typeof ProductSale !== 'undefined') {
        // Para cada relación en ProductSale
        ProductSale.forEach(function(relacion) {
            // Convertir ofertaId (índice en localStorage) a sale_id (de TendaFakeDades)
            // Como no tenemos una relación directa, usamos el índice + 1 como aproximación
            // En un caso real, deberías guardar el sale_id en localStorage
            const saleIdAproximado = parseInt(ofertaId) + 1;
            
            if (relacion.sale_id === saleIdAproximado) {
                // Buscar el producto en el array Product
                const producto = Product.find(function(p) {
                    return p.id === relacion.product_id;
                });
                
                if (producto) {
                    // Buscar la familia del producto
                    const familia = Family.find(function(f) {
                        return f.id === producto.family_id;
                    });
                    
                    productosAplicados.push({
                        id: producto.id,
                        name: producto.name,
                        price: producto.price,
                        description: producto.description,
                        familyName: familia ? familia.name : 'Desconeguda'
                    });
                }
            }
        });
    }
    
    return productosAplicados;
}

function renderTable(productos) {
    if (!tableBody) return;
    
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    
    productos.forEach(function(producto, index) {
        const row = document.createElement("tr");
        
        const idCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const priceCell = document.createElement("td");
        const descCell = document.createElement("td");
        const familyCell = document.createElement("td");
        
        idCell.appendChild(document.createTextNode(producto.id));
        nameCell.appendChild(document.createTextNode(producto.name));
        priceCell.appendChild(document.createTextNode(producto.price + " €"));
        descCell.appendChild(document.createTextNode(producto.description));
        familyCell.appendChild(document.createTextNode(producto.familyName));
        
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(descCell);
        row.appendChild(familyCell);
        
        tableBody.appendChild(row);
    });
}

function mostrarError(mensaje) {
    if (!tableBody) return;
    
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.setAttribute("colspan", "5");
    cell.className = 'no-data';
    cell.appendChild(document.createTextNode(mensaje));
    row.appendChild(cell);
    tableBody.appendChild(row);
}

function mostrarNoProductos() {
    if (!tableBody) return;
    
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.setAttribute("colspan", "5");
    cell.className = 'no-data';
    cell.appendChild(document.createTextNode("No hi ha productes aplicats a aquesta oferta"));
    row.appendChild(cell);
    tableBody.appendChild(row);
}