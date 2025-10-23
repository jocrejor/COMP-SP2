window.onload = iniciar;

function iniciar() {
    const form = document.getElementById("pedidoForm");
    form.addEventListener("submit", validar, false);

    const addButtons = document.getElementsByClassName("addProduct");
    Array.from(addButtons).forEach(btn => {
        btn.addEventListener("click", afegirProducte, false);
    });

    document.getElementById("llista").addEventListener("click", function () {
        window.location.href = 'comandesLlistar.html';
    });
}

// Mostrar missatge d’error
function error(element, missatge) {
    let container = document.getElementById("missatgeError");
    let miss = document.createTextNode(missatge);
    container.appendChild(miss);
    container.appendChild(document.createElement("br"));
    element.classList.add("error");
    element.focus();
}

// Netejar errors
function esborrarError() {
    const container = document.getElementById("missatgeError");
    container.textContent = "";
    let formulari = document.getElementById("pedidoForm");
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}

// Validar despeses d'enviament
function validarShipping() {
    const element = document.getElementById("shipping");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) error(element, "Deus d'introduïr les despeses d'enviament.");
        if (element.validity.rangeOverflow || element.validity.rangeUnderflow) error(element, "Les despeses han d'estar entre 0 i 500.");
        if (element.validity.patternMismatch) error(element, "El format ha de ser 0.00 amb màxim 2 decimals.");
        return false;
    }
    return true;
}

// Validar productes (quantitat i descompte)
function validarProductes() {
    const quantities = document.getElementsByName("quantity[]");
    const discounts = document.getElementsByName("discount[]");
    let valid = true;

    for (let i = 0; i < quantities.length; i++) {
        const q = quantities[i];
        const d = discounts[i];

        if (!q.checkValidity()) {
            if (q.validity.valueMissing) error(q, "Deus d'introduïr una quantitat.");
            if (q.validity.rangeUnderflow) error(q, "La quantitat ha de ser >= 1.");
            valid = false;
        }
        if (!d.checkValidity()) {
            error(d, "El descompte ha de ser >=0 amb màxim 2 decimals.");
            valid = false;
        }
    }

    return valid;
}

// Afegir producte
function afegirProducte(e) {
    const button = e.target;
    const row = button.closest("tr");

    const productSelect = row.querySelector("select[name='product_id[]']");
    const quantityInput = row.querySelector("input[name='quantity[]']");
    const priceInput = row.querySelector("input[name='price[]']");
    const discountInput = row.querySelector("input[name='discount[]']");

    esborrarError();

    if (!quantityInput.checkValidity()) { error(quantityInput, "La quantitat ha de ser >= 1."); return; }
    if (!priceInput.checkValidity()) { error(priceInput, "El preu ha de ser >= 0 amb màxim 2 decimals."); return; }
    if (!discountInput.checkValidity()) { error(discountInput, "El descompte ha de ser >=0 amb màxim 2 decimals."); return; }

    const orderSection = document.getElementById("productesAfegits");
    const div = document.createElement("div");
    div.textContent = `${productSelect.options[productSelect.selectedIndex].text} - Quantitat: ${quantityInput.value} - Preu: ${parseFloat(priceInput.value).toFixed(2)}€ - Descompte: ${parseFloat(discountInput.value).toFixed(2)}€`;
    orderSection.appendChild(div);

    quantityInput.value = "";
    priceInput.value = "";
    discountInput.value = "0.00";
}

// Validació global
function validar(e) {
    esborrarError();
    const orderSection = document.getElementById("productesAfegits");

    if (!validarShipping() || !validarProductes()) {
        e.preventDefault();
        return false;
    }

    if (orderSection.children.length <= 1) { // només té el títol
        alert("Cal afegir almenys un producte a la comanda.");
        e.preventDefault();
        return false;
    }

    if (confirm("Confirma si vols enviar el formulari")) {
        alert("Comanda guardada correctament!");
        window.location.href = 'comandesLlistar.html';
    }
    e.preventDefault();
    return false;
}
