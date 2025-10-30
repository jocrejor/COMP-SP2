document.addEventListener("DOMContentLoaded", main);

function main() {
    const id = obtenerIdDeUrl();
    if (!id) {
        alert("ID de producte no especificat.");
        window.location.href = "index.html";
        return;
    }

    cargarDetallesProducto(id);

    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

function obtenerIdDeUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

function obtenerProductos() {
    return JSON.parse(localStorage.getItem('productos')) || [];
}

function obtenerFamilias() {
    return JSON.parse(localStorage.getItem('familias')) || [];
}

function obtenerImagenes() {
    return JSON.parse(localStorage.getItem('imagenes')) || [];
}

function obtenerAtributos() {
    return JSON.parse(localStorage.getItem('atributos')) || [];
}

function cargarDetallesProducto(id) {
    const productos = obtenerProductos();
    let producto = null;
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            producto = productos[i];
            break;
        }
    }
    
    if (!producto) {
        alert("Producte no trobat.");
        window.location.href = "index.html";
        return;
    }

    const familias = obtenerFamilias();
    let familia = null;
    for (let i = 0; i < familias.length; i++) {
        if (familias[i].id === producto.family_id) {
            familia = familias[i];
            break;
        }
    }
    const nombreFamilia = familia ? familia.name : "Sense família";

    // Obtenir imatges del producte
    const imagenes = obtenerImagenes();
    const imagenesProducto = [];
    for (let i = 0; i < imagenes.length; i++) {
        if (imagenes[i].product_id === id) {
            imagenesProducto.push(imagenes[i]);
        }
    }
    
    // Ordenar imatges per ordre
    for (let i = 0; i < imagenesProducto.length - 1; i++) {
        for (let j = i + 1; j < imagenesProducto.length; j++) {
            if (imagenesProducto[i].order > imagenesProducto[j].order) {
                const temp = imagenesProducto[i];
                imagenesProducto[i] = imagenesProducto[j];
                imagenesProducto[j] = temp;
            }
        }
    }

    // Obtenir atributs del producte
    const atributos = obtenerAtributos();
    const atributosProducto = [];
    for (let i = 0; i < atributos.length; i++) {
        if (atributos[i].product_id === id) {
            atributosProducto.push(atributos[i]);
        }
    }

    const contenedor = document.getElementById("detallesProducto");
    contenedor.innerHTML = ''; // Netejar contenidor
    
    // Crear elements principals
    const h2 = document.createElement("h2");
    h2.textContent = producto.name;
    contenedor.appendChild(h2);

    // Funció auxiliar per crear paràgrafs amb etiquetes strong
    function crearParrafoConEtiqueta(etiqueta, valor) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = etiqueta;
        p.appendChild(strong);
        p.appendChild(document.createTextNode(` ${valor}`));
        return p;
    }

    // Afegir detalls del producte
    contenedor.appendChild(crearParrafoConEtiqueta("ID:", producto.id));
    contenedor.appendChild(crearParrafoConEtiqueta("Preu:", `${producto.price.toFixed(2)} €`));
    contenedor.appendChild(crearParrafoConEtiqueta("Descripció:", producto.description));
    contenedor.appendChild(crearParrafoConEtiqueta("Família:", nombreFamilia));
    contenedor.appendChild(crearParrafoConEtiqueta("Estat:", producto.active ? 'Actiu' : 'Inactiu'));

    // Mostrar imatges si existeixen
    if (imagenesProducto.length > 0) {
        const h3Imagenes = document.createElement("h3");
        h3Imagenes.textContent = "Imatges del Producte";
        contenedor.appendChild(h3Imagenes);

        const divImagenes = document.createElement("div");
        divImagenes.classList.add("imagenes-container");

        imagenesProducto.forEach(img => {
            const divImg = document.createElement("div");
            
            const imagen = document.createElement("img");
            imagen.src = img.url;
            imagen.alt = img.name;
            imagen.classList.add("imagen-producto");
            
            const pImg = document.createElement("p");
            pImg.textContent = `${img.name} (Ordre: ${img.order})`;
            
            divImg.appendChild(imagen);
            divImg.appendChild(pImg);
            divImagenes.appendChild(divImg);
        });
        
        contenedor.appendChild(divImagenes);
    } else {
        const pNoImagenes = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = "No hi ha imatges per a este producte";
        pNoImagenes.appendChild(em);
        contenedor.appendChild(pNoImagenes);
    }

    // Mostrar atributs si existeixen
    if (atributosProducto.length > 0) {
        const divAtributos = document.createElement("div");
        divAtributos.classList.add("atributos");
        
        const h3Atributos = document.createElement("h3");
        h3Atributos.textContent = "Atributs";
        divAtributos.appendChild(h3Atributos);

        atributosProducto.forEach(attr => {
            const atributosGlobal = Attribute || [];
            let atributoInfo = null;
            for (let j = 0; j < atributosGlobal.length; j++) {
                if (atributosGlobal[j].id === attr.attribute_id) {
                    atributoInfo = atributosGlobal[j];
                    break;
                }
            }
            
            const divAtributo = document.createElement("div");
            divAtributo.classList.add("atributo");
            
            const strong = document.createElement("strong");
            strong.textContent = `${atributoInfo ? atributoInfo.name : 'Atribut'}: `;
            
            const textoValor = document.createTextNode(attr.value);
            
            divAtributo.appendChild(strong);
            divAtributo.appendChild(textoValor);
            divAtributos.appendChild(divAtributo);
        });
        
        contenedor.appendChild(divAtributos);
    }
}