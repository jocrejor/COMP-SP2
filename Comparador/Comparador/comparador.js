document.addEventListener("DOMContentLoaded", main);

let compare = localStorage.getItem('comparar') ? JSON.parse(localStorage.getItem('comparar')) : {};
let compareProduct = localStorage.getItem('compararProductes') ? JSON.parse(localStorage.getItem('compararProductes')) : [];
let productes = localStorage.getItem('productes') ? JSON.parse(localStorage.getItem('productes')) : [];

function main() {
    const params = new URLSearchParams(window.location.search);
    const index = params.get('index');
    
    if (index !== null && productes[index]) {
        const product = productes[index];

        const compare = {
            "sessionId": obtindreSessionId(),
            "userAgent": navigator.userAgent,
            "dateStart": new Date().toISOString()
        };

        if (!localStorage.getItem('comparar')) {
            localStorage.setItem('comparar', JSON.stringify(compare));
        }

        let Existeix = compareProduct.some(p => p.product == index);
        if (!Existeix) {
            compareProduct.push({
                "sessionId": compare.sessionId,
                "product": index
            });
            localStorage.setItem('compararProductes', JSON.stringify(compareProduct));
        }

        window.history.replaceState({}, document.title, "comparador.html");
    }

    mostrarComparador();
}

function obtindreSessionId() {
    return crypto.randomUUID();
}

function mostrarComparador() {
    const compararDiv = document.getElementById('compararDiv');

    // Limpiar elementos anteriores
    while (compararDiv.firstChild) {
        compararDiv.removeChild(compararDiv.firstChild);
    }

    if (!compareProduct || compareProduct.length === 0) {
        alert("No tens productes per a comparar");
        return;
    }

    compareProduct.forEach((item) => {
        const product = productes[item.product];
        if (product) {
            const container = document.createElement('div');
            container.style.border = "1px solid #000";
            container.style.margin = "10px";
            container.style.padding = "10px";

            const description = document.createElement('p');
            description.textContent = product.descripton;
            container.appendChild(description);

            const price = document.createElement('p');
            price.textContent = `Preu: ${product.price}€`;
            container.appendChild(price);

            const img = document.createElement('img');
            img.src = product.img;
            img.alt = product.name;
            img.style.maxWidth = "100px";
            container.appendChild(img);

            const hr = document.createElement('hr');
            container.appendChild(hr);

            const button = document.createElement('button');
            button.textContent = "Eliminar";
            button.addEventListener('click', () => eliminarProducteComparador(item.product));
            container.appendChild(button);

            compararDiv.appendChild(container);
        }
    });
}

function eliminarProducteComparador(index) {
    let currentCompareProduct = localStorage.getItem('compararProductes')
        ? JSON.parse(localStorage.getItem('compararProductes'))
        : [];

    const nouCompareProduct = currentCompareProduct.filter(item => item.product != index);
    localStorage.setItem('compararProductes', JSON.stringify(nouCompareProduct));
    compareProduct = nouCompareProduct;

    mostrarComparador();
}
