document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------
    // CARREGAR PRODUCTES GLOBALS
    // -----------------------------
    if (!window.products || !Array.isArray(window.products)) {
        if (typeof Product !== "undefined") {
            window.products = Product; // Assignem Product a window.products
        } else {
            console.error("La llista de productes no està disponible!");
            return;
        }
    }

    let index = localStorage.getItem("comandaEditar");
    if (index === null) {
        alert("No s'ha seleccionat cap comanda per modificar.");
        window.location.href = "comandesLlistar.html";
        return;
    }

    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    let comanda = comandes[index];
    if (!comanda) {
        alert("Comanda no trobada.");
        window.location.href = "comandesLlistar.html";
        return;
    }

    // -----------------------------
    // MOSTRAR INFORMACIÓ FIXA
    // -----------------------------
    document.getElementById("date").value = comanda.data || "";
    document.getElementById("date").disabled = true;

    document.getElementById("payment").value = comanda.pagament || "";
    document.getElementById("payment").disabled = true;

    document.getElementById("shipping").value = comanda.enviament || 0;
    document.getElementById("shipping").disabled = true;

    let clientSelect = document.getElementById("client");
    clientSelect.innerHTML = "";
    let optionClient = document.createElement("option");
    optionClient.value = comanda.client || "";
    optionClient.textContent = comanda.client || "Desconegut";
    clientSelect.appendChild(optionClient);
    clientSelect.disabled = true;

    // -----------------------------
    // GESTIÓ PRODUCTES
    // -----------------------------
    let productsTableBody = document.querySelector("#productsTable tbody");

    // Netejar fila inicial
    while (productsTableBody.firstChild) {
        productsTableBody.removeChild(productsTableBody.firstChild);
    }

    function omplirSelect(select, producteId) {
        select.innerHTML = "";
        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Selecciona producte...";
        select.appendChild(defaultOption);

        window.products.forEach(p => {
            let opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;

            // Comparar com a número per seleccionar correctament
            if (Number(p.id) === Number(producteId)) opt.selected = true;

            select.appendChild(opt);
        });
    }

    function crearProducteRow(producteData = {}) {
        let tr = document.createElement("tr");
        tr.classList.add("product-line");

        // Producte
        let tdProducte = document.createElement("td");
        let select = document.createElement("select");
        select.name = "product_id[]";
        select.required = true;
        tdProducte.appendChild(select);
        tr.appendChild(tdProducte);
        omplirSelect(select, producteData.id);

        // Quantitat
        let tdQuantitat = document.createElement("td");
        let inputQuantitat = document.createElement("input");
        inputQuantitat.type = "number";
        inputQuantitat.name = "quantity[]";
        inputQuantitat.min = 1;
        inputQuantitat.value = producteData.quantitat || 1;
        inputQuantitat.required = true;
        tdQuantitat.appendChild(inputQuantitat);
        tr.appendChild(tdQuantitat);

        // Preu
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

        // Descompte
        let tdDescompte = document.createElement("td");
        let inputDescompte = document.createElement("input");
        inputDescompte.type = "number";
        inputDescompte.step = "0.01";
        inputDescompte.name = "discount[]";
        inputDescompte.min = 0;
        inputDescompte.value = producteData.descompte?.toFixed(2) || 0;
        tdDescompte.appendChild(inputDescompte);
        tr.appendChild(tdDescompte);

        // Acció
        let tdAccio = document.createElement("td");
        let btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", () => tr.remove());
        tdAccio.appendChild(btnEliminar);
        tr.appendChild(tdAccio);

        productsTableBody.appendChild(tr);
    }

    // Carregar productes existents de la comanda
    (comanda.productes || []).forEach(p => crearProducteRow(p));

    // -----------------------------
    // CREAR BOTÓ AFEGIR A LA TAULA
    // -----------------------------
    let addRowButton = document.createElement("button");
    addRowButton.type = "button";
    addRowButton.textContent = "Afegir";
    addRowButton.classList.add("addProduct");
    addRowButton.addEventListener("click", () => crearProducteRow());

    // Afegim el botó al peu de la taula o on vulguis
    let tableContainer = document.getElementById("productsTableContainer"); // afegeix un div al HTML amb id="productsTableContainer"
    if (tableContainer) tableContainer.appendChild(addRowButton);

    // Guardar modificacions
    document.getElementById("pedidoForm").addEventListener("submit", e => {
        e.preventDefault();

        let productes = [];
        document.querySelectorAll(".product-line").forEach(tr => {
            let select = tr.querySelector("select[name='product_id[]']");
            let productId = parseInt(select.value) || null;
            let productNom = window.products.find(p => p.id === productId)?.name || "";
            let quantitat = parseFloat(tr.querySelector("input[name='quantity[]']").value) || 1;
            let preu = parseFloat(tr.querySelector("input[name='price[]']").value) || 0;
            let descompte = parseFloat(tr.querySelector("input[name='discount[]']").value) || 0;

            if (productId) {
                productes.push({
                    id: productId,
                    producte: productNom,
                    quantitat,
                    preu,
                    descompte
                });
            }
        });

        comanda.productes = productes;
        comandes[index] = comanda;
        localStorage.setItem("comandes", JSON.stringify(comandes));

        alert("Comanda actualitzada!");
        window.location.href = "comandesLlistar.html";
    });

    // Botó tornar
    document.getElementById("tornar").addEventListener("click", e => {
        e.preventDefault();
        window.location.href = "comandesLlistar.html";
    });

});
