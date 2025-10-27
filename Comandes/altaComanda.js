window.onload = iniciar;

// Array global per guardar els productes afegits
let productesAfegits = [];

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

// Validar productes dins del formulari principal (inputs actuals)
function validarProductesFormulari(row) {
    const quantityInput = row.querySelector("input[name='quantity[]']");
    const priceInput = row.querySelector("input[name='price[]']");
    const discountInput = row.querySelector("input[name='discount[]']");
    let valid = true;

    if (!quantityInput.checkValidity()) {
        if (quantityInput.validity.valueMissing) error(quantityInput, "Deus d'introduïr una quantitat.");
        if (quantityInput.validity.rangeUnderflow) error(quantityInput, "La quantitat ha de ser >= 1.");
        valid = false;
    }
    if (!priceInput.checkValidity()) {
        error(priceInput, "El preu ha de ser >= 0 amb màxim 2 decimals.");
        valid = false;
    }
    if (!discountInput.checkValidity()) {
        error(discountInput, "El descompte ha de ser >=0 amb màxim 2 decimals.");
        valid = false;
    }

    return valid;
}

// Afegir producte al DOM i a l'array global
function afegirProducte(e) {
    let button = e.target;
    let row = button.closest("tr");

    if (!validarProductesFormulari(row)) return;

    let productSelect = row.querySelector("select[name='product_id[]']");
    let quantityInput = row.querySelector("input[name='quantity[]']");
    let priceInput = row.querySelector("input[name='price[]']");
    let discountInput = row.querySelector("input[name='discount[]']");

    let nomProducte = productSelect.options[productSelect.selectedIndex].text;
    let quantitat = parseFloat(quantityInput.value);
    let preu = parseFloat(priceInput.value);
    let descompte = parseFloat(discountInput.value);

    // Afegir al DOM
    let orderSection = document.getElementById("productesAfegits");
    let div = document.createElement("div");
    div.textContent = `${nomProducte} - Quantitat: ${quantitat} - Preu: ${preu.toFixed(2)}€ - Descompte: ${descompte.toFixed(2)}€`;
    orderSection.appendChild(div);

    // Afegir a l'array global
    productesAfegits.push({ nom: nomProducte, quantitat, preu, descompte });

    // Netejar inputs
    quantityInput.value = "";
    priceInput.value = "";
    discountInput.value = "0.00";

    esborrarError();
}

// Validació global i guardat comanda
function validar(e) {
    esborrarError();

    if (!validarShipping()) {
        e.preventDefault();
        return false;
    }

    if (productesAfegits.length === 0) {
        alert("Cal afegir almenys un producte a la comanda.");
        e.preventDefault();
        return false;
    }

    // Crear objecte comanda
    let comanda = {
        shipping: parseFloat(document.getElementById("shipping").value),
        productes: productesAfegits,
        data: new Date().toISOString()
    };

    // Guardar comanda a localStorage
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    comandes.push(comanda);
    localStorage.setItem("comandes", JSON.stringify(comandes));

    alert("Comanda guardada correctament!");
    window.location.href = 'comandesLlistar.html';

    e.preventDefault();
    return false;
}
