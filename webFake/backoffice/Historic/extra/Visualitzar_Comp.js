// Quan es carregue el document, executem la funció principal
document.addEventListener("DOMContentLoaded", main);

function main() {
    // Element on es mostraran els productes del comparador
    const compararDiv = document.getElementById("compararDiv");
    const infoComparador = document.getElementById("infoComparador");

    // Obtenim l'id del comparador de la URL (ex: ?id=2)
    const params = new URLSearchParams(window.location.search);
    const idComparador = params.get("id");

    // Si no hi ha id, no podem mostrar res
    if (!idComparador) {
        compararDiv.textContent = "No s'ha especificat cap comparador.";
        return;
    }

    // Llegim les dades de la BBDD o del localStorage
    const registres = carregarRegistresBbdd();
    const productes = carregarProductesBbdd();
    const compararProductes = carregarCompararProductes();

    // Buscar el comparador concret pel seu ID
    const comparadorTrobat = registres.find(r => r.comparator_id == idComparador);

    if (!comparadorTrobat) {
        compararDiv.textContent = "No s'ha trobat cap comparador amb aquest ID.";
        return;
    }

    // Mostrar informació general del comparador (només lectura)
    if (infoComparador) {
        infoComparador.innerHTML = `
            <p><strong>ID Sessió:</strong> ${comparadorTrobat.session_id}</p>
            <p><strong>User Agent:</strong> ${comparadorTrobat.user_agent}</p>
            <p><strong>Data inici:</strong> ${comparadorTrobat.date_start}</p>
            <p><strong>Data fi:</strong> ${comparadorTrobat.date_end || "-"}</p>
        `;
    }

    // Filtrar els productes que pertanyen a aquest comparador segons el sessionId
    const productesComparats = compararProductes.filter(
        item => item.sessionId == comparadorTrobat.session_id
    );

    // Si no hi ha productes associats, mostrem missatge
    if (productesComparats.length === 0) {
        compararDiv.textContent = "Aquest comparador no té cap producte associat.";
        return;
    }

    // Mostrar tots els productes d’aquest comparador
    productesComparats.forEach(item => {
        const prod = productes[item.product];
        if (prod) {
            const div = document.createElement("div");
            div.innerHTML = `
                <h4>${prod.name}</h4>
                <p>${prod.descripton}</p>
                <p>Preu: ${prod.price}€</p>
                <img src="${prod.img}" alt="${prod.name}">
                <hr>
            `;
            compararDiv.appendChild(div);
        }
    });
}


// ------------------------------------------------------
// FUNCIONS AUXILIARS (llegir dades de la BBDD o localStorage)
// ------------------------------------------------------

// Carregar la taula de registres (històrics)
function carregarRegistresBbdd() {
    const local = localStorage.getItem("Register");
    if (local) {
        return JSON.parse(local);
    } else if (typeof Register !== "undefined" && Array.isArray(Register)) {
        localStorage.setItem("Register", JSON.stringify(Register));
        return Register.slice();
    } else {
        return [];
    }
}

// Carregar la taula de productes (BBDD simulada)
function carregarProductesBbdd() {
    const local = localStorage.getItem("productes");
    if (local) {
        return JSON.parse(local);
    } else if (typeof Product !== "undefined" && Array.isArray(Product)) {
        localStorage.setItem("productes", JSON.stringify(Product));
        return Product.slice();
    } else {
        return [];
    }
}

// Carregar la taula dels productes comparats
function carregarCompararProductes() {
    const local = localStorage.getItem("compararProductes");
    if (local) {
        return JSON.parse(local);
    } else {
        return [];
    }
}
