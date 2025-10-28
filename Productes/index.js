document.addEventListener("DOMContentLoaded", main);

function main() {
    const btnCrear = document.getElementById("btnCrear");
    btnCrear.addEventListener("click", () => {
        window.location.href = "crear.html";
    });

    inicialitzarDades();
    carregarProductes();
}

function inicialitzarDades() {
    // Verificar si les dades ja estan en localStorage
    if (!localStorage.getItem('productes')) {
        // Inicialitzar productes
        const productesAmbEstat = [];
        Product.forEach(producte => {
            productesAmbEstat.push({
                ...producte,
                active: producte.active !== undefined ? producte.active : true
            });
        });
        localStorage.setItem('productes', JSON.stringify(productesAmbEstat));
    }

    if (!localStorage.getItem('families')) {
        localStorage.setItem('families', JSON.stringify(Family));
    }

    if (!localStorage.getItem('imatges')) {
        localStorage.setItem('imatges', JSON.stringify(Productimage));
    }

    if (!localStorage.getItem('atributs')) {
        localStorage.setItem('atributs', JSON.stringify(Productattribute));
    }
}

function obtindreProductes() {
    return JSON.parse(localStorage.getItem('productes')) || [];
}

function obtindreFamilies() {
    return JSON.parse(localStorage.getItem('families')) || [];
}

function obtindreImatges() {
    return JSON.parse(localStorage.getItem('imatges')) || [];
}

function obtindreAtributs() {
    return JSON.parse(localStorage.getItem('atributs')) || [];
}

function guardarProductes(productes) {
    localStorage.setItem('productes', JSON.stringify(productes));
}

function guardarImatges(imatges) {
    localStorage.setItem('imatges', JSON.stringify(imatges));
}

function carregarProductes() {
    const productes = obtindreProductes();
    const families = obtindreFamilies();
    const imatges = obtindreImatges();
    
    const tbody = document.querySelector("#productsTable tbody");
    tbody.innerHTML = "";

    if (productes.length === 0) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 11;
        td.textContent = "No hi ha productes per a mostrar.";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    productes.forEach(producte => {
        const tr = document.createElement("tr");
        if (!producte.active) {
            tr.classList.add('inactive');
        }

        // Buscar el nom de la família
        let familia = null;
        for (let j = 0; j < families.length; j++) {
            if (families[j].id === producte.family_id) {
                familia = families[j];
                break;
            }
        }
        const nomFamilia = familia ? familia.name : "Sense família";

        // Comptar imatges del producte
        const imatgesProducte = [];
        for (let j = 0; j < imatges.length; j++) {
            if (imatges[j].product_id === producte.id) {
                imatgesProducte.push(imatges[j]);
            }
        }
        const numImatges = imatgesProducte.length;

        // ID
        const tdId = document.createElement("td");
        tdId.textContent = producte.id;
        tr.appendChild(tdId);

        // Nom
        const tdNom = document.createElement("td");
        tdNom.textContent = producte.name;
        tr.appendChild(tdNom);

        // Preu
        const tdPreu = document.createElement("td");
        tdPreu.textContent = `${producte.price.toFixed(2)} €`;
        tr.appendChild(tdPreu);

        // Descripció
        const tdDescripcio = document.createElement("td");
        tdDescripcio.textContent = producte.description;
        tr.appendChild(tdDescripcio);

        // Família
        const tdFamilia = document.createElement("td");
        tdFamilia.textContent = nomFamilia;
        tr.appendChild(tdFamilia);

        // Imatges
        const tdImatges = document.createElement("td");
        const btnImatges = document.createElement("button");
        btnImatges.textContent = `Imatges (${numImatges})`;
        btnImatges.classList.add("btn", "btn-images");
        btnImatges.setAttribute("data-id", producte.id);
        tdImatges.appendChild(btnImatges);
        tr.appendChild(tdImatges);

        // Detalls
        const tdDetalls = document.createElement("td");
        const btnDetalls = document.createElement("button");
        btnDetalls.textContent = "Veure detalls";
        btnDetalls.classList.add("btn", "btn-details");
        btnDetalls.setAttribute("data-id", producte.id);
        tdDetalls.appendChild(btnDetalls);
        tr.appendChild(tdDetalls);

        // Atributs
        const tdAtributs = document.createElement("td");
        const btnAtributs = document.createElement("button");
        btnAtributs.textContent = "Atributs";
        btnAtributs.classList.add("btn", "btn-attributes");
        btnAtributs.setAttribute("data-id", producte.id);
        tdAtributs.appendChild(btnAtributs);
        tr.appendChild(tdAtributs);

        // Editar
        const tdEditar = document.createElement("td");
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn", "btn-edit");
        btnEditar.setAttribute("data-id", producte.id);
        tdEditar.appendChild(btnEditar);
        tr.appendChild(tdEditar);

        // Actiu/Inactiu
        const tdToggle = document.createElement("td");
        const btnToggle = document.createElement("button");
        btnToggle.textContent = producte.active ? 'Desactivar' : 'Activar';
        btnToggle.classList.add("btn", "btn-toggle");
        btnToggle.setAttribute("data-id", producte.id);
        tdToggle.appendChild(btnToggle);
        tr.appendChild(tdToggle);

        // Esborrar (només si està inactiu)
        const tdEsborrar = document.createElement("td");
        if (!producte.active) {
            const btnEsborrar = document.createElement("button");
            btnEsborrar.textContent = "Esborrar";
            btnEsborrar.classList.add("btn", "btn-delete");
            btnEsborrar.setAttribute("data-id", producte.id);
            tdEsborrar.appendChild(btnEsborrar);
        }
        tr.appendChild(tdEsborrar);

        tbody.appendChild(tr);
    });

    // Esdeveniments per als botons
    document.querySelectorAll(".btn-images").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            window.location.href = `imatges.html?id=${id}`;
        });
    });

    document.querySelectorAll(".btn-details").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            window.location.href = `detalls.html?id=${id}`;
        });
    });

    document.querySelectorAll(".btn-edit").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            window.location.href = `editar.html?id=${id}`;
        });
    });

    document.querySelectorAll(".btn-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            toggleActiu(id);
        });
    });

    document.querySelectorAll(".btn-attributes").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            window.location.href = `atributs.html?id=${id}`;
        });
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            if (confirm("Segur que vols esborrar permanentment aquest producte?")) {
                esborrarProducte(id);
            }
        });
    });
}

function toggleActiu(id) {
    const productes = obtindreProductes();
    let producte = null;
    for (let i = 0; i < productes.length; i++) {
        if (productes[i].id === id) {
            producte = productes[i];
            break;
        }
    }
    if (producte) {
        producte.active = !producte.active;
        guardarProductes(productes);
        carregarProductes();
    }
}

function esborrarProducte(id) {
    const productes = obtindreProductes();
    let index = -1;
    for (let i = 0; i < productes.length; i++) {
        if (productes[i].id === id) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        // Eliminar també les imatges associades
        const imatges = obtindreImatges();
        const novesImatges = [];
        for (let i = 0; i < imatges.length; i++) {
            if (imatges[i].product_id !== id) {
                novesImatges.push(imatges[i]);
            }
        }
        guardarImatges(novesImatges);

        productes.splice(index, 1);
        guardarProductes(productes);
        carregarProductes();
    }
}
