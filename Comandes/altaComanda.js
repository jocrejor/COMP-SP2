document.addEventListener("DOMContentLoaded", main);

function main() {
    document.getElementById("pedidoForm").addEventListener("submit", validarFormulari, false);
    document.querySelector(".addProduct").addEventListener("click", afegirProducte, false);
    document.getElementById("llista").addEventListener("click", () => location.href = "comandesLlistar.html");

    carregarClients();
    carregarProductes();
    mostrarProductes(JSON.parse(localStorage.getItem("productesActuals")) || []);
}

//  CARREGAR CLIENTS I PRODUCTES 
function carregarClients() {
    let select = document.getElementById("client");
    select.replaceChildren();
    select.appendChild(new Option("Selecciona un client...", ""));

    Client.forEach(c => {
        select.appendChild(new Option(`${c.name} ${c.surname}`, c.id));
    });
}

function carregarProductes() {
    document.querySelectorAll(".productSelect").forEach(select => {
        select.replaceChildren();
        select.appendChild(new Option("Selecciona un producte...", ""));
        Product.forEach(p => select.appendChild(new Option(p.name, p.id)));
    });
}

//  VALIDACIÓ 
function validarPagament() {
    let el = document.getElementById("payment");
    if (!el.checkValidity()) {
        if (el.validity.valueMissing) error(el, "Selecciona una forma de pagament.");
        return false;
    }
    return true;
}

function validarEnviament() {
    let el = document.getElementById("shipping");
    if (!el.checkValidity() || el.value < 0) {
        if (el.validity.valueMissing) error(el, "Introdueix despeses d’enviament.");
        else error(el, "Les despeses d’enviament no poden ser negatives.");
        return false;
    }
    return true;
}

function validarClient() {
    let el = document.getElementById("client");
    if (!el.checkValidity() || !el.value) {
        error(el, "Has de seleccionar un client.");
        return false;
    }
    return true;
}

function validarProductes() {
    let llista = JSON.parse(localStorage.getItem("productesActuals")) || [];
    if (llista.length === 0) {
        let cont = document.getElementById("missatgeError");
        let p = document.createElement("p");
        p.textContent = "Has d’afegir almenys un producte.";
        cont.appendChild(p);
        return false;
    }

    let valid = true;
    llista.forEach((p, i) => {
        if (!p.producte) {
            let cont = document.getElementById("missatgeError");
            let msg = document.createElement("p");
            msg.textContent = `El producte de la línia ${i + 1} no és vàlid.`;
            cont.appendChild(msg);
            valid = false;
        }
        if (p.quantitat <= 0) {
            let cont = document.getElementById("missatgeError");
            let msg = document.createElement("p");
            msg.textContent = `La quantitat del producte de la línia ${i + 1} ha de ser major que 0.`;
            cont.appendChild(msg);
            valid = false;
        }
    });
    return valid;
}

function validarFormulari(e) {
    e.preventDefault();
    esborrarError();

    if (validarPagament() && validarEnviament() && validarClient() && validarProductes()) {
        enviarFormulari();
        return true;
    }

    return false;
}

//  FUNCIONS D'ERROR 
// Funció d'error millorada per mostrar el missatge al costat del camp
function error(element, missatge) {
    // Marquem el camp com a error
    element.classList.add("error");

    // Eliminem missatges anteriors d'aquest element
    let existing = element.parentElement.querySelector(".error-msg");
    if (existing) existing.remove();

    // Creem un nou missatge d'error
    let span = document.createElement("span");
    span.className = "error-msg";
    span.style.color = "red";
    span.textContent = missatge;

    // Afegim el missatge al costat del camp
    element.parentElement.appendChild(span);

    // Posar focus en el primer camp amb error
    element.focus();
}

// Esborrar tots els errors inline
function esborrarError() {
    let formulari = document.forms[0];
    for (let el of formulari.elements) el.classList.remove("error");
    document.querySelectorAll(".error-msg").forEach(span => span.remove());
    // També podem esborrar missatges generals
    document.getElementById("missatgeError").replaceChildren();
}
 

//  AFEGIR PRODUCTE 
function afegirProducte() {
    esborrarError();
    let fila = document.querySelector(".product-line");
    let quant = fila.querySelector("[name='quantity[]']");
    let preu = fila.querySelector("[name='price[]']");
    let productSelect = fila.querySelector("[name='product_id[]']");
    let descompte = fila.querySelector("[name='discount[]']");

    let valid = true;

    if (!productSelect.value) {
        error(productSelect, "Selecciona un producte.");
        valid = false;
    }
    if (!quant.value || quant.value <= 0) {
        error(quant, "Introdueix una quantitat vàlida.");
        valid = false;
    }
    if (!preu.value || preu.value <= 0) {
        error(preu, "Introdueix un preu vàlid.");
        valid = false;
    }

    if (!valid) return;

    let nou = {
        producte: productSelect.value,
        quantitat: +quant.value,
        preu: +preu.value,
        descompte: +(descompte.value || 0)
    };

   // let llista = JSON.parse(localStorage.getItem("productesActuals")) || [];
   // llista.push(nou);
   // localStorage.setItem("productesActuals", JSON.stringify(llista));

    mostrarProductes(llista);

    quant.value = preu.value = descompte.value = "";
    productSelect.value = "";
}

//  MOSTRAR PRODUCTES 
function mostrarProductes(productes) {
    let cont = document.getElementById("productesAfegits");
    cont.replaceChildren();

    if (productes.length === 0) return;

    let h4 = document.createElement("h4");
    h4.textContent = "Productes a afegir-se";
    cont.appendChild(h4);

    let caps = ["Producte", "Quantitat", "Preu", "Descompte"];
    let taula = document.createElement("table");
    taula.border = "1";
    taula.cellPadding = "4";
    taula.cellSpacing = "0";

    let trCap = document.createElement("tr");
    caps.forEach(t => {
        let th = document.createElement("th");
        th.textContent = t;
        trCap.appendChild(th);
    });
    taula.appendChild(trCap);

    productes.forEach(p => {
        let tr = document.createElement("tr");
        let prodObj = Product.find(x => Number(x.id) === Number(p.producte));
        let nomProducte = prodObj ? prodObj.name : "Desconegut";

        [nomProducte, p.quantitat, p.preu.toFixed(2), p.descompte.toFixed(2)].forEach(v => {
            let td = document.createElement("td");
            td.textContent = v;
            tr.appendChild(td);
        });

        taula.appendChild(tr);
    });

    cont.appendChild(taula);
}

//  ENVIAR FORMULARI 
function enviarFormulari() {
    let clientSelect = document.getElementById("client");
    let clientNom = clientSelect.options[clientSelect.selectedIndex].text;

    let productesGuardats = JSON.parse(localStorage.getItem("productesActuals")) || [];
    let productesAmbNom = productesGuardats.map(p => {
        let prod = Product.find(x => Number(x.id) === Number(p.producte));
        return {
            producte: prod ? prod.name : "Desconegut",
            quantitat: p.quantitat,
            preu: p.preu,
            descompte: p.descompte
        };
    });

    let dataRaw = document.getElementById("datetime").value;
    let dataFormatada = dataRaw.replace("T", " ");

    let comanda = {
        id: Date.now(),
        data: dataFormatada,
        pagament: document.getElementById("payment").value,
        enviament: +document.getElementById("shipping").value,
        client: clientNom,
        productes: productesAmbNom
    };

    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    comandes.push(comanda);
    localStorage.setItem("comandes", JSON.stringify(comandes));
    localStorage.removeItem("productesActuals");

    document.forms[0].reset();
    document.getElementById("productesAfegits").replaceChildren();
    let msg = document.createElement("p");
    msg.textContent = "Comanda guardada correctament.";
    document.getElementById("productesAfegits").appendChild(msg);
}
