document.addEventListener("DOMContentLoaded", main);

function main() {
    const infoComparador = document.querySelector("#infoComparador");
    const compararDiv = document.getElementById("compararDiv");

    // Validar elementos HTML
    if (!infoComparador || !compararDiv) {
        console.error("Falten elements HTML (#infoComparador o #compararDiv)");
        return;
    }

    // Obtenir ID del comparador de la URL
    const params = new URLSearchParams(window.location.search);
    const idComparador = params.get("id");

    if (!idComparador) {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode("No s'ha especificat cap comparador."));
        infoComparador.appendChild(p);
        return;
    }

    // Carregar dades de la BBDD simulada
    const registres = carregarRegistresBbdd();
    const productes = carregarProductesBbdd();
    const compararProductes = carregarCompararProductes();

    // Buscar el comparador concret
    const comparadorTrobat = registres.find(r => String(r.comparator_id) === String(idComparador));

    if (!comparadorTrobat) {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode("No s'ha trobat cap comparador amb aquest ID."));
        infoComparador.appendChild(p);
        return;
    }

    // Mostrar dades generals del comparador
    const dades = {
        "ID Sessió": comparadorTrobat.session_id,
        "User Agent": comparadorTrobat.user_agent,
        "Data inici": comparadorTrobat.date_start,
        "Data fi": comparadorTrobat.date_end
    };

    // Netejar contingut antic
    while (infoComparador.firstChild) infoComparador.removeChild(infoComparador.firstChild);

    // Crear elements de text
    for (const [clau, valor] of Object.entries(dades)) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.appendChild(document.createTextNode(clau + ": "));
        p.appendChild(strong);

        // Format de data si és vàlida
        if (valor && !isNaN(Date.parse(valor))) {
            const fecha = new Date(valor);
            const textNode = document.createTextNode(
                fecha.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                })
            );
            p.appendChild(textNode);
        } else {
            const textNode = document.createTextNode(valor ?? "-");
            p.appendChild(textNode);
        }

        infoComparador.appendChild(p);
    }

    // Productes associats
    const productesComparats = compararProductes.filter(
        item => String(item.sessionId) === String(comparadorTrobat.session_id)
    );

    // Netejar div
    while (compararDiv.firstChild) compararDiv.removeChild(compararDiv.firstChild);

    if (productesComparats.length === 0) {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode("Aquest comparador no té cap producte associat."));
        compararDiv.appendChild(p);
        return;
    }

    // Mostrar productes
    productesComparats.forEach(item => {
        const prod = productes[item.product];
        if (prod) {
            const div = document.createElement("div");

            const h4 = document.createElement("h4");
            h4.appendChild(document.createTextNode(prod.name));
            div.appendChild(h4);

            const pDesc = document.createElement("p");
            pDesc.appendChild(document.createTextNode(prod.descripton || ""));
            div.appendChild(pDesc);

            const pPreu = document.createElement("p");
            pPreu.appendChild(document.createTextNode(`Preu: ${prod.price} €`));
            div.appendChild(pPreu);

            if (prod.img) {
                const img = document.createElement("img");
                img.src = prod.img;
                img.alt = prod.name;
                div.appendChild(img);
            }

            compararDiv.appendChild(div);
        }
    });
}

// ----------------------------
// FUNCIONS AUXILIARS
// ----------------------------
function carregarRegistresBbdd() {
    const local = localStorage.getItem("Register");
    if (local) return JSON.parse(local);
    if (typeof Register !== "undefined" && Array.isArray(Register)) return Register.slice();
    return [];
}

function carregarProductesBbdd() {
    const local = localStorage.getItem("productes");
    if (local) return JSON.parse(local);
    if (typeof Product !== "undefined" && Array.isArray(Product)) return Product.slice();
    return [];
}

function carregarCompararProductes() {
    const local = localStorage.getItem("compararProductes");
    if (local) return JSON.parse(local);
    return [];
}
