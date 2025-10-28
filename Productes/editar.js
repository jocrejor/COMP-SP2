document.addEventListener("DOMContentLoaded", main);

function main() {
    const id = obtindreIdDeUrl();
    if (!id) {
        alert("ID de producte no especificat.");
        window.location.href = "index.html";
        return;
    }

    carregarFamilies();
    carregarProducte(id);

    const form = document.getElementById("productForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        guardarCanvis(id);
    });

    const btnVolver = document.getElementById("btnVolver");
    btnVolver.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

function obtindreProductes() {
    return JSON.parse(localStorage.getItem('productes')) || [];
}

function obtindreFamilies() {
    return JSON.parse(localStorage.getItem('families')) || [];
}

function guardarProductes(productes) {
    localStorage.setItem('productes', JSON.stringify(productes));
}

function carregarFamilies() {
    const select = document.getElementById("family_id");
    const families = obtindreFamilies();
    
    families.forEach(familia => {
        const option = document.createElement("option");
        option.value = familia.id;
        option.textContent = familia.name;
        select.appendChild(option);
    });
}

function obtindreIdDeUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

function carregarProducte(id) {
    const productes = obtindreProductes();
    let producte = null;
    for (let i = 0; i < productes.length; i++) {
        if (productes[i].id === id) {
            producte = productes[i];
            break;
        }
    }

    if (!producte) {
        alert("Producte no trobat.");
        window.location.href = "index.html";
        return;
    }

    document.getElementById("name").value = producte.name;
    document.getElementById("price").value = producte.price;
    document.getElementById("description").value = producte.description;
    document.getElementById("family_id").value = producte.family_id;
}

function guardarCanvis(id) {
    const productes = obtindreProductes();
    let producte = null;
    for (let i = 0; i < productes.length; i++) {
        if (productes[i].id === id) {
            producte = productes[i];
            break;
        }
    }

    if (!producte) {
        alert("Producte no trobat.");
        window.location.href = "index.html";
        return;
    }

    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value) || 0;
    const description = document.getElementById("description").value.trim();
    const family_id = parseInt(document.getElementById("family_id").value);

    if (!name) {
        alert("El nom és obligatori");
        return;
    }

    // Actualitzar el producte
    producte.name = name;
    producte.price = price;
    producte.description = description;
    producte.family_id = family_id;

    guardarProductes(productes);
    alert("Producte modificat correctament");
    window.location.href = "index.html";
}
