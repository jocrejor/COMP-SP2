document.addEventListener("DOMContentLoaded", main)

let compare = localStorage.getItem('comparar') ? JSON.parse(localStorage.getItem('comparar')) : {};
let compareProduct = localStorage.getItem('compararProductes') ? JSON.parse(localStorage.getItem('compararProductes')) : [];
let productes = localStorage.getItem('productes') ? JSON.parse(localStorage.getItem('productes')) : [];
let productesMesAtributs = localStorage.getItem('productesMesAtributs') ? JSON.parse(localStorage.getItem('productesMesAtributs')) : {};
let productAtribut  = localStorage.getItem('productAtribut') ? JSON.parse(localStorage.getItem('productAtribut')) : Productattribute;
let atribute  = localStorage.getItem('atribute') ? JSON.parse(localStorage.getItem('atribute')) : Attribute;

function main() {
     
    // Obtenir l'index del producte a través de la URL
    const params = new URLSearchParams(window.location.search);
    const index = params.get('index');

    if (index !== null && productes[index]) {
        const product = productes[index]

        // Crear objecte compararador
        const compare = {
            "sessionId": obtindreSessionId(),
            "userAgent": navigator.userAgent,
                "dateStart": new Date().toISOString()
            };

        // Comprovar si ja existeix ja comparador
        if (!localStorage.getItem('comparar')) {
            localStorage.setItem('comparar', JSON.stringify(compare))
            
        }
        // SI no existeix el producte afegir
        let Existeix = compareProduct.some(p => p.product == index);
        if (!Existeix) {
            // Comprovar que coincideixi la família amb els productes ja afegits
            let canAdd = true;
            if (compareProduct.length > 0) {
                const firstIndex = compareProduct[0].product;
                const firstProduct = productes[firstIndex];
                const firstFamilyId = firstProduct ? firstProduct.family_id : null;
                if (firstFamilyId != null && product.family_id != firstFamilyId) {
                    canAdd = false;
                    alert("El producte no és de la mateixa família que els que ja vols comparar.");
                }
            }
            if (canAdd) {
                // Afegir producte a comparar
                compareProduct.push({
                    "sessionId": compare.sessionId,
                    "product": index
                });
                localStorage.setItem('compararProductes', JSON.stringify(compareProduct));
            }
        } else {
            alert("Ja existeix el producte en el comparador");
        }
        //Neteja el comparador si lleves tots els productes encara que recàrregues la pàgina
        window.history.replaceState({}, document.title, "comparador.html");

    }
    
    // Llamar a la función para crear el array de atributos
    arrayMesAtribut();
    
    mostrarComparador();

}



function arrayMesAtribut(){

    productes.forEach((product, index) => {
        if (product.id) {
            // Buscar el attribute_id que corresponde a este product_id
            const atribut = productAtribut.find(attr => attr.product_id === product.id);
            if (atribut) {
                productesMesAtributs[product.id] = atribut.attribute_id;
            }
        }
    });
    

    localStorage.setItem('productesAtributs', JSON.stringify(productesMesAtributs));
    
    // Mostrar el contenido en la consola del navegador
    console.log('Contenido de productesMesAtributs:', productesMesAtributs);
}


//Crear un ID de sessió aleatori
function obtindreSessionId() {
    return crypto.randomUUID();

}
// Mostrar productes a comparar
function mostrarComparador() {
    const compararDiv = document.getElementById('compararDiv');
    compararDiv.innerHTML = ""; // Limpiar contenido anterior
    
    const taulaDiv = document.getElementById('taulaDiv');
    taulaDiv.innerHTML = ""; // Limpiar contenido de la tabla

    if (!compareProduct || compareProduct.length === 0) {
        alert("No tens productes per a comparar");
        return;
    }

    // Crear la tabla de comparación de atributos
    crearTaulaComparacio();

    // Mostrar productos individuales (código existente)
    compareProduct.forEach((item) => {
        const product = productes[item.product];
        if (product) {
            const productDiv = document.createElement('div');
            productDiv.style.border = "1px solid #000";
            productDiv.style.margin = "10px";
            productDiv.style.padding = "10px";

            const descP = document.createElement('p');
            descP.textContent = product.descripton;
            productDiv.appendChild(descP);

            const priceP = document.createElement('p');
            priceP.textContent = `Preu: ${product.price}€`;
            productDiv.appendChild(priceP);

            const img = document.createElement('img');
            img.src = product.img;
            img.alt = product.name;
            img.style.maxWidth = "100px";
            productDiv.appendChild(img);

            const hr = document.createElement('hr');
            productDiv.appendChild(hr);

            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = "Eliminar";
            btnEliminar.addEventListener('click', () => eliminarProducteComparador(item.product));
            productDiv.appendChild(btnEliminar);

            compararDiv.appendChild(productDiv);
        }
    });
}


// Crear tabla de comparación de atributos
function crearTaulaComparacio() {
    const taulaDiv = document.getElementById('taulaDiv');
    
    // Crear el contenedor de la tabla
    const tableContainer = document.createElement('div');
    tableContainer.style.marginBottom = "20px";
    
    const title = document.createElement('h3');
    title.textContent = "Comparació d'Atributs";
    tableContainer.appendChild(title);
    
    // Crear la tabla
    const table = document.createElement('table');
    table.style.border = "1px solid #000";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";
    
    // Obtener productos a comparar
    const productesComparar = compareProduct.map(item => productes[item.product]).filter(p => p);
    
    if (productesComparar.length === 0) return;
    
    // Crear cabecera de la tabla
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    // Primera columna: Atributos
    const attrHeader = document.createElement('th');
    attrHeader.textContent = "Atributs";
    attrHeader.style.border = "1px solid #000";
    attrHeader.style.padding = "10px";
    attrHeader.style.backgroundColor = "#f0f0f0";
    headerRow.appendChild(attrHeader);
    
    // Columnas de productos
    productesComparar.forEach(product => {
        const productHeader = document.createElement('th');
        productHeader.textContent = product.name || product.descripton;
        productHeader.style.border = "1px solid #000";
        productHeader.style.padding = "10px";
        productHeader.style.backgroundColor = "#f0f0f0";
        headerRow.appendChild(productHeader);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');
    
    // Añadir fila del precio primero
    const priceRow = document.createElement('tr');
    
    // Primera columna: "Preu"
    const priceAttrCell = document.createElement('td');
    priceAttrCell.textContent = "Preu";
    priceAttrCell.style.border = "1px solid #000";
    priceAttrCell.style.padding = "10px";
    priceAttrCell.style.fontWeight = "bold";
    priceRow.appendChild(priceAttrCell);
    
    // Columnas de precios para cada producto
    productesComparar.forEach(product => {
        const priceCell = document.createElement('td');
        priceCell.style.border = "1px solid #000";
        priceCell.style.padding = "10px";
        priceCell.style.textAlign = "center";
        priceCell.textContent = product.price ? `${product.price}€` : "N/A";
        priceRow.appendChild(priceCell);
    });
    
    tbody.appendChild(priceRow);
    
    // Obtener todos los atributos únicos de los productos
    const todosAtributos = new Set();
    productesComparar.forEach(product => {
        const productAttrs = productAtribut.filter(attr => attr.product_id === product.id);
        productAttrs.forEach(attr => {
            const atributoInfo = atribute.find(a => a.id === attr.attribute_id);
            if (atributoInfo) {
                todosAtributos.add(JSON.stringify({id: atributoInfo.id, name: atributoInfo.name}));
            }
        });
    });
    
    // Crear filas para cada atributo
    Array.from(todosAtributos).forEach(attrStr => {
        const attr = JSON.parse(attrStr);
        const row = document.createElement('tr');
        
        // Primera columna: nombre del atributo
        const attrCell = document.createElement('td');
        attrCell.textContent = attr.name;
        attrCell.style.border = "1px solid #000";
        attrCell.style.padding = "10px";
        attrCell.style.fontWeight = "bold";
        row.appendChild(attrCell);
        
        // Columnas de valores para cada producto
        productesComparar.forEach(product => {
            const valueCell = document.createElement('td');
            valueCell.style.border = "1px solid #000";
            valueCell.style.padding = "10px";
            valueCell.style.textAlign = "center";
            
            // Buscar el valor del atributo para este producto
            const productAttr = productAtribut.find(pa => 
                pa.product_id === product.id && pa.attribute_id === attr.id
            );
            
            if (productAttr) {
                valueCell.textContent = productAttr.value || "N/A";
            } else {
                valueCell.textContent = "-";
                valueCell.style.color = "#999";
            }
            
            row.appendChild(valueCell);
        });
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    taulaDiv.appendChild(tableContainer);
}

function eliminarProducteComparador(index) {
    // Llig l'array dels productes comparats
    let currentCompareProduct = localStorage.getItem('compararProductes')
        ? JSON.parse(localStorage.getItem('compararProductes'))
        : [];

    // Eliminar el producte seleccionat
    const nouCompareProduct = currentCompareProduct.filter(item => item.product != index);
    //Guardar en localStorage
    localStorage.setItem('compararProductes', JSON.stringify(nouCompareProduct));

    // Actualizar la variable global
    compareProduct = nouCompareProduct;

    mostrarComparador();  //Actualitza la vista del comparador
}