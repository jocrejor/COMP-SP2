//  EXECUTAR TOT QUAN EL DOM ESTIGUI CARREGAT 
document.addEventListener("DOMContentLoaded", main);

function main() {
    //  CARREGAR PRODUCTES GLOBALS 
    if (!window.products || !Array.isArray(window.products)) {
        if (typeof Product !== "undefined") {
            window.products = Product; // Assignem la llista global
        } else {
            console.error("No s'ha pogut carregar la llista de productes!");
            return;
        }
    }

    //  RECUPERAR L’ÍNDEX DE LA COMANDA A EDITAR 
    let index = localStorage.getItem("comandaEditar");
    if (index === null) {
        alert("No s'ha seleccionat cap comanda per modificar.");
        window.location.href = "comandesLlistar.html";
        return;
    }

    //  OBTENIR COMANDA I VALIDAR 
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    let comanda = comandes[index];
    if (!comanda) {
        alert("Comanda no trobada.");
        window.location.href = "comandesLlistar.html";
        return;
    }

    //  MOSTRAR INFORMACIÓ FIXA DE LA COMANDA 
    document.getElementById("datetime").value = comanda.data || "";
    document.getElementById("payment").value = comanda.pagament || "";
    document.getElementById("shipping").value = comanda.enviament || 0;

    //  AFEGIR CLIENT AL SELECT 
    let clientSelect = document.getElementById("client");
    clientSelect.replaceChildren(); // Neteja opcions existents
    let optClient = document.createElement("option");
    optClient.value = comanda.client;
    optClient.appendChild(document.createTextNode(comanda.client));
    clientSelect.appendChild(optClient);

    let productsTableBody = document.querySelector("#productsTable tbody");

    //  FUNCIONS AUXILIARS 
    // Omplir select amb productes disponibles
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
            if (Number(p.id) === Number(producteId)) opt.selected = true; // Seleccionem correctament
            select.appendChild(opt);
        });
    }

    // Crear fila de producte a la taula
    function crearProducteRow(producteData = {}) {
        let tr = document.createElement("tr");
        tr.classList.add("product-line");

        //  CEL·LA PRODUCTE 
        let tdProducte = document.createElement("td");
        let select = document.createElement("select");
        select.name = "product_id[]";
        select.required = true;

        // Determinar ID del producte
        let producteId = producteData.id 
                        || window.products.find(p => p.name.toLowerCase() === (producteData.producte || "").toLowerCase())?.id;

        if (!producteId && window.products.length > 0) producteId = window.products[0].id;

        omplirSelect(select, producteId);
        tdProducte.appendChild(select);
        tr.appendChild(tdProducte);

        //  CEL·LA QUANTITAT 
        let tdQuantitat = document.createElement("td");
        let inputQuantitat = document.createElement("input");
        inputQuantitat.type = "number";
        inputQuantitat.name = "quantity[]";
        inputQuantitat.min = 1;
        inputQuantitat.value = producteData.quantitat || 1;
        inputQuantitat.required = true;
        tdQuantitat.appendChild(inputQuantitat);
        tr.appendChild(tdQuantitat);

        //  CEL·LA PREU 
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

        //  CEL·LA DESCOMPTE 
        let tdDescompte = document.createElement("td");
        let inputDescompte = document.createElement("input");
        inputDescompte.type = "number";
        inputDescompte.step = "0.01";
        inputDescompte.name = "discount[]";
        inputDescompte.min = 0;
        inputDescompte.value = producteData.descompte?.toFixed(2) || 0;
        tdDescompte.appendChild(inputDescompte);
        tr.appendChild(tdDescompte);

        //  CEL·LA ACCIÓ 
        let tdAccio = document.createElement("td");
        let btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.appendChild(document.createTextNode("Eliminar"));
        btnEliminar.classList.add("eliminar");
        btnEliminar.addEventListener("click", () => tr.remove()); // Eliminem fila
        tdAccio.appendChild(btnEliminar);
        tr.appendChild(tdAccio);

        productsTableBody.appendChild(tr); // Afegim fila a la taula
    }

    //  CARREGAR PRODUCTES EXISTENTS DE LA COMANDA 
    (comanda.productes || []).forEach(p => crearProducteRow(p));

    // BOTÓ "AFEGIR PRODUCTE" 
    let btnAfegir = document.getElementById("afegirProducte");
    if (btnAfegir) {
        btnAfegir.addEventListener("click", e => {
            e.preventDefault();
            crearProducteRow(); // Afegim fila buida
        });
    }

    //  GUARDAR CANVIS DE LA COMANDA 
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

        // Actualitzar comanda i guardar a localStorage
        comanda.productes = productes;
        comandes[index] = comanda;
        localStorage.setItem("comandes", JSON.stringify(comandes));

        alert(" Comanda actualitzada correctament!");
        window.location.href = "comandesLlistar.html";
    });

    //  BOTÓ "TORNAR" 
    let btnTornar = document.getElementById("tornar");
    if (btnTornar) {
        btnTornar.addEventListener("click", e => {
            e.preventDefault();
            window.location.href = "comandesLlistar.html";
        });
    }
}
