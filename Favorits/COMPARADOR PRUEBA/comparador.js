document.addEventListener("DOMContentLoaded", main)

// Variables globales per a emmagatzemar dades
let compare = localStorage.getItem('comparar') ? JSON.parse(localStorage.getItem('comparar')) : {};
let compareProduct = localStorage.getItem('compararProductes') ? JSON.parse(localStorage.getItem('compararProductes')) : [];
let productes = localStorage.getItem('productes') ? JSON.parse(localStorage.getItem('productes')) : [];

// Funció principal
function main() {
    // Obtenir paràmetres de la URL
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

        // Comprovar si existeix el comparador
        if (!localStorage.getItem('comparar')) {
            localStorage.setItem('comparar', JSON.stringify(compare))
        }
        // Verificar si el producte ja existeix
        let Existeix = compareProduct.some(p => p.product == index);
        
        if (!Existeix) {
            // Verificar família del producte
            let potAfegir = true;
            if (compareProduct.length > 0) {
                const firstIndex = compareProduct[0].product;
                const firstProduct = productes[firstIndex];
                if (firstProduct && firstProduct.family_id !== product.family_id) {
                    potAfegir = false;
                    alert("El producte no és de la mateixa família que els que ja vols comparar.");
                }
            }

            if (potAfegir) {
                afegirProducteComparador(compare.sessionId, index);
            }
        } else {
            alert("Ja existeix el producte en el comparador");
        }
        // Netejar URL després d'afegir
        window.history.replaceState({}, document.title, "comparador.html");
    }
    
    mostrarComparador();
}

// Generar ID de sessió únic
function obtindreSessionId() {
    return crypto.randomUUID();
}

// Afegir producte al comparador
function afegirProducteComparador(sessionId, index) {
    compareProduct.push({
        "sessionId": sessionId,
        "product": index
    });
    localStorage.setItem('compararProductes', JSON.stringify(compareProduct));
}

// Mostrar productes en el comparador
function mostrarComparador() {
    const compararDiv = document.getElementById('compararDiv');
    netejarElement(compararDiv);

    if (!compareProduct || compareProduct.length === 0) {
        alert("No tens productes per a comparar");
        return;
    }

    compareProduct.forEach((item) => {
        const product = productes[item.product];
        if (product) {
            const productDiv = crearElementProducte(product, item.product);
            compararDiv.appendChild(productDiv);
        }
    });
}

// Crear element de producte
function crearElementProducte(product, index) {
    const productDiv = document.createElement('div');
    productDiv.className = 'producto-comparar';

    // Descripció
    const descP = document.createElement('p');
    descP.textContent = product.descripton;
    productDiv.appendChild(descP);

    // Preu
    const priceP = document.createElement('p');
    priceP.textContent = `Preu: ${product.price}€`;
    productDiv.appendChild(priceP);

    // Imatge
    const img = document.createElement('img');
    img.src = product.img;
    img.alt = product.name;
    img.style.maxWidth = "100px";
    productDiv.appendChild(img);

    // Separador
    const hr = document.createElement('hr');
    productDiv.appendChild(hr);

    // Botó eliminar
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = "Eliminar";
    btnEliminar.onclick = () => eliminarProducteComparador(index);
    productDiv.appendChild(btnEliminar);

    return productDiv;
}

// Eliminar producte del comparador
function eliminarProducteComparador(index) {
    compareProduct = compareProduct.filter(item => item.product != index);
    localStorage.setItem('compararProductes', JSON.stringify(compareProduct));
    mostrarComparador();
}

// Netejar element
function netejarElement(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

// Configurar modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalFavoritos');
    const btnGuardar = document.getElementById('btnGuardarFavorito');
    const btnCerrar = document.getElementsByClassName('close')[0];

    btnGuardar.onclick = function() {
        if (compareProduct.length === 0) {
            alert('No hi ha productes per guardar');
            return;
        }
        obrirModal(modal);
    }

    btnCerrar.onclick = function() {
        tancarModal(modal);
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            tancarModal(modal);
        }
    }
});

// Obrir modal
function obrirModal(modal) {
    modal.style.display = 'block';
}

// Tancar modal
function tancarModal(modal) {
    modal.style.display = 'none';
    document.getElementById('nombreFavorito').value = '';
}

// Guardar comparació en favorits
function guardarComparacionFavoritos() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuario) {
        alert('Has d\'iniciar sessió per guardar favorits');
        window.location.href = '../login.html';
        return;
    }

    const nombre = document.getElementById('nombreFavorito').value;
    if (!nombre) {
        alert('Has de donar un nom a la comparació');
        return;
    }

    const productosGuardados = prepararProductosPerGuardar();
    guardarEnLocalStorage(usuario.id, nombre, productosGuardados);

    tancarModal(document.getElementById('modalFavoritos'));
    alert('Comparació guardada en favorits');
}

// Preparar productes per guardar
function prepararProductosPerGuardar() {
    return compareProduct.map(item => {
        const producto = productes[item.product];
        return {
            id: producto.id,
            nombre: producto.name,
            descripcion: producto.description || producto.descripton,
            precio: producto.price,
            img: producto.img
        };
    });
}

// Guardar en localStorage
function guardarEnLocalStorage(usuarioId, nombre, productos) {
    const favorito = {
        nombre: nombre,
        fecha: new Date().toISOString(),
        productos: productos
    };

    let favoritos = JSON.parse(localStorage.getItem(`favoritos_${usuarioId}`)) || [];
    favoritos.push(favorito);
    localStorage.setItem(`favoritos_${usuarioId}`, JSON.stringify(favoritos));
}