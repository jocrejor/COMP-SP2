// Executem el codi només quan tot el contingut del document estigui carregat
document.addEventListener("DOMContentLoaded", () => {
    // CARREGAR PRODUCTES GLOBALS
    // Comprovem que existeixi l’array global de productes
    if (!window.products || !Array.isArray(window.products)) {
        // Si no existeix, intentem obtenir-lo de la variable "Product"
        if (typeof Product !== "undefined") {
            window.products = Product;
        } else {
            console.error("❌ No s'ha pogut carregar la llista de productes!");
            return;
        }
    }
    // Recuperem l’índex de la comanda a editar del localStorage
    let index = localStorage.getItem("comandaEditar");
    if (index === null) {
        alert("⚠️ No s'ha seleccionat cap comanda per modificar.");
        window.location.href = "comandesLlistar.html";
        return;
    }
    // Obtenim totes les comandes i la que volem editar
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    let comanda = comandes[index];
    if (!comanda) {
        alert(" Comanda no trobada.");
        window.location.href = "comandesLlistar.html";
        return;
    }
    // MOSTRAR INFORMACIÓ FIXA DE LA COMANDA
    document.getElementById("date").value = comanda.data || "";
    document.getElementById("payment").value = comanda.pagament || "";
    document.getElementById("shipping").value = comanda.enviament || 0;
    document.getElementById("client").innerHTML = `<option value="${comanda.client}">${comanda.client}</option>`;

    let productsTableBody = document.querySelector("#productsTable tbody");
    // FUNCIONS AUXILIARS
    // Omple el <select> amb la llista de productes disponibles
    function omplirSelect(select, producteId) {
        select.innerHTML = "";
        let defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Selecciona producte...";
        select.appendChild(defaultOption);

        // Creem una opció per a cada producte
        window.products.forEach(p => {
            let opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            if (Number(p.id) === Number(producteId)) opt.selected = true; // seleccionem si coincideix
            select.appendChild(opt);
        });
    }

    // Crea una nova fila de producte a la taula (per editar o afegir)
    function crearProducteRow(producteData = {}) {
        let tr = document.createElement("tr");
        tr.classList.add("product-line");

        //  Cel·la PRODUCTE 
        let tdProducte = document.createElement("td");
        let select = document.createElement("select");
        select.name = "product_id[]";
        select.required = true;
        omplirSelect(select, producteData.id);
        tdProducte.appendChild(select);
        tr.appendChild(tdProducte);

        //  Cel·la QUANTITAT 
        let tdQuantitat = document.createElement("td");
        let inputQuantitat = document.createElement("input");
        inputQuantitat.type = "number";
        inputQuantitat.name = "quantity[]";
        inputQuantitat.min = 1;
        inputQuantitat.value = producteData.quantitat || 1;
        inputQuantitat.required = true;
        tdQuantitat.appendChild(inputQuantitat);
        tr.appendChild(tdQuantitat);

        //  Cel·la PREU 
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

        //  Cel·la DESCOMPTE 
        let tdDescompte = document.createElement("td");
        let inputDescompte = document.createElement("input");
        inputDescompte.type = "number";
        inputDescompte.step = "0.01";
        inputDescompte.name = "discount[]";
        inputDescompte.min = 0;
        inputDescompte.value = producteData.descompte?.toFixed(2) || 0;
        tdDescompte.appendChild(inputDescompte);
        tr.appendChild(tdDescompte);

        //  Cel·la ACCIÓ (Eliminar fila) 
        let tdAccio = document.createElement("td");
        let btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.textContent = "Eliminar";
        btnEliminar.classList.add("eliminar");
        // Quan es clica, elimina la fila
        btnEliminar.addEventListener("click", () => tr.remove());
        tdAccio.appendChild(btnEliminar);
        tr.appendChild(tdAccio);

        // Afegim la nova fila al cos de la taula
        productsTableBody.appendChild(tr);
    }

    // CARREGAR PRODUCTES EXISTENTS A LA COMANDA
    (comanda.productes || []).forEach(p => crearProducteRow(p));

    // BOTÓ "AFEGIR PRODUCTE"
    let btnAfegir = document.getElementById("afegirProducte");
    if (btnAfegir) {
        btnAfegir.addEventListener("click", e => {
            e.preventDefault();
            crearProducteRow(); // Afegim una fila buida
        });
    }
    // GUARDAR CANVIS DE LA COMANDA
    let form = document.getElementById("pedidoForm");
    form.addEventListener("submit", e => {
        e.preventDefault();

        // Recompilem totes les dades dels productes de la taula
        let productes = [];
        document.querySelectorAll(".product-line").forEach(tr => {
            let select = tr.querySelector("select[name='product_id[]']");
            let productId = parseInt(select.value);
            if (!productId) return; // si no hi ha producte seleccionat, el saltem

            // Extraiem les dades de cada camp
            let productNom = window.products.find(p => p.id === productId)?.name || "";
            let quantitat = parseFloat(tr.querySelector("input[name='quantity[]']").value) || 1;
            let preu = parseFloat(tr.querySelector("input[name='price[]']").value) || 0;
            let descompte = parseFloat(tr.querySelector("input[name='discount[]']").value) || 0;

            // Afegim el producte a l’array final
            productes.push({ id: productId, producte: productNom, quantitat, preu, descompte });
        });

        // Actualitzem la comanda amb els nous productes
        comanda.productes = productes;
        comandes[index] = comanda;

        // Guardem al localStorage
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
});
