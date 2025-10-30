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