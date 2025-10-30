// Executem tot quan el DOM estigui carregat
document.addEventListener("DOMContentLoaded", main);

function main() {
    // CARREGAR PRODUCTES GLOBALS
    if (!window.products || !Array.isArray(window.products)) {
        if (typeof Product !== "undefined") {
            window.products = Product;
        } else {
            console.error("No s'ha pogut carregar la llista de productes!");
            return;
        }
    }

    // Recuperem l’índex de la comanda a editar
    let index = localStorage.getItem("comandaEditar");
    if (index === null) {
        alert("No s'ha seleccionat cap comanda per modificar.");
        window.location.href = "comandesLlistar.html";
        return;
    }

    // Obtenim totes les comandes i la que volem editar
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    let comanda = comandes[index];
    if (!comanda) {
        alert("Comanda no trobada.");
        window.location.href = "comandesLlistar.html";
        return;
    }

    // MOSTRAR INFORMACIÓ FIXA DE LA COMANDA
    document.getElementById("datetime").value = comanda.data || "";
    document.getElementById("payment").value = comanda.pagament || "";
    document.getElementById("shipping").value = comanda.enviament || 0;

    // Afegir el client al select
    let clientSelect = document.getElementById("client");
    clientSelect.replaceChildren();
    let optClient = document.createElement("option");
    optClient.value = comanda.client;
    optClient.appendChild(document.createTextNode(comanda.client));
    clientSelect.appendChild(optClient);

    let productsTableBody = document.querySelector("#productsTable tbody");

    // FUNCIONS AUXILIARS
    function omplirSelect(select, producteId) {
        select.replaceChildren();
        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.appendChild(document.createTextNode("Selecciona producte..."));
        select.appendChild(defaultOption);

        window.products.forEach(p => {
            let opt = document.createElement("option");
            opt.value = p.id;
            opt.appendChild(document.createTextNode(p.name));
            if (Number(p.id) === Number(producteId)) opt.selected = true;
            select.appendChild(opt);
        });
    }

    function crearProducteRow(producteData = {}) {
        let tr = document.createElement("tr");
        tr.classList.add("product-line");

        // Cel·la PRODUCTE
        let tdProducte = document.createElement("td");
        let select = document.createElement("select");
        select.name = "product_id[]";
        select.required = true;

        // Seleccionem correctament el producte
        let producteId = producteData.id || window.products.find(p => p.name === producteData.producte)?.id || "";
        omplirSelect(select, producteId);

        tdProducte.appendChild(select);
        tr.appendChild(tdProducte);

        // Cel·la QUANTITAT
        let tdQuantitat = document.createElement("td");
        let inputQuantitat = document.createElement("input");
        inputQuantitat.type = "number";
        inputQuantitat.name = "quantity[]";
        inputQuantitat.min = 1;
        inputQuantitat.value = producteData.quantitat || 1;
        inputQuantitat.required = true;
        tdQuantitat.appendChild(inputQuantitat);
        tr.appendChild(tdQuantitat);

        // Cel·la PREU
        let tdPreu = document.createElement("td");
        let inputPreu = document.createElement("input");
        inputPreu.type = "number";
        inputPreu.step = "0.01";
        inputPreu.name = "price[]";
        inputPreu.min = 0;
        inputPreu.value = producteData.preu?.toFixed(2) || 0;
        inputPreu.required = true;
        tdPreu.appendChild(inputPreu);
        tr.appendChild(tdPreu);

        // Cel·la DESCOMPTE
        let tdDescompte = document.createElement("td");
        let inputDescompte = document.createElement("input");
        inputDescompte.type = "number";
        inputDescompte.step = "0.01";
        inputDescompte.name = "discount[]";
        inputDescompte.min = 0;
        inputDescompte.value = producteData.descompte?.toFixed(2) || 0;
        tdDescompte.appendChild(inputDescompte);
        tr.appendChild(tdDescompte);

        // Cel·la ACCIÓ
        let tdAccio = document.createElement("td");
        let btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.appendChild(document.createTextNode("Eliminar"));
        btnEliminar.classList.add("eliminar");
        btnEliminar.addEventListener("click", () => tr.remove());
        tdAccio.appendChild(btnEliminar);
        tr.appendChild(tdAccio);

        productsTableBody.appendChild(tr);
    }

    // CARREGAR PRODUCTES EXISTENTS A LA COMANDA
    (comanda.productes || []).forEach(p => crearProducteRow(p));

    // BOTÓ "AFEGIR PRODUCTE"
    let btnAfegir = document.getElementById("afegirProducte");
    if (btnAfegir) {
        btnAfegir.addEventListener("click", e => {
            e.preventDefault();
            crearProducteRow(); // Afegir fila buida
        });
    }

    // GUARDAR CANVIS DE LA COMANDA
    let form = document.getElementById("pedidoForm");
    form.addEventListener("submit", e => {
        e.preventDefault();

        let productes = [];
        document.querySelectorAll(".product-line").forEach(tr => {
            let select = tr.querySelector("select[name='product_id[]']");
            let productId = parseInt(select.value);
            if (!productId) return;

            let productNom = window.products.find(p => p.id === productId)?.name || "";
            let quantitat = parseFloat(tr.querySelector("input[name='quantity[]']").value) || 1;
            let preu = parseFloat(tr.querySelector("input[name='price[]']").value) || 0;
            let descompte = parseFloat(tr.querySelector("input[name='discount[]']").value) || 0;

            productes.push({ id: productId, producte: productNom, quantitat, preu, descompte });
        });

        comanda.productes = productes;
        comandes[index] = comanda;

        localStorage.setItem("comandes", JSON.stringify(comandes));
        alert("✅ Comanda actualitzada correctament!");
        window.location.href = "comandesLlistar.html";
    });

    // BOTÓ "TORNAR"
    let btnTornar = document.getElementById("tornar");
    if (btnTornar) {
        btnTornar.addEventListener("click", e => {
            e.preventDefault();
            window.location.href = "comandesLlistar.html";
        });
    }
}
