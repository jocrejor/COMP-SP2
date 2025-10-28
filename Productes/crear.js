document.addEventListener("DOMContentLoaded", main);

function main() {
    carregarFamilies();

    const form = document.getElementById("productForm");
    form.addEventListener("submit", crearProducte);

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

function crearProducte(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value) || 0;
    const description = document.getElementById("description").value.trim();
    const family_id = parseInt(document.getElementById("family_id").value);

    if (!name) {
        alert("El nom és obligatori");
        return;
    }

    const productes = obtindreProductes();

    // Generar nou ID
    let newId = 1;
    if (productes.length > 0) {
        let maxId = productes[0].id;
        productes.forEach(producte => {
            if (producte.id > maxId) {
                maxId = producte.id;
            }
        });
        newId = maxId + 1;
    }

    // Crear nou producte
    const nouProducte = {
        id: newId,
        name,
        price,
        description,
        family_id,
        active: true
    };

    // Afegir al conjunt de productes
    productes.push(nouProducte);
    guardarProductes(productes);

    alert("Producte creat correctament");
    window.location.href = "index.html";
}
