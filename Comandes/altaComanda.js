document.addEventListener("DOMContentLoaded", main);

function main() {
    document.getElementById("pedidoForm").addEventListener("submit", validar, false);
    document.querySelector(".addProduct").addEventListener("click", afegirProducte, false);
    document.getElementById("llista").addEventListener("click", () => location.href = "comandesLlistar.html");

    carregarClients();
    carregarProductes();
}

// ---------------- CARREGAR CLIENTS I PRODUCTES ----------------
function carregarClients() {
    const select = document.getElementById("client");
    select.innerHTML = '<option value="">Selecciona un client...</option>';
    Client.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.name} ${c.surname}`;
        select.appendChild(opt);
    });
}


function carregarProductes() {
    document.querySelectorAll(".productSelect").forEach(select => {
        select.innerHTML = '<option value="">Selecciona un producte...</option>';
        Product.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            select.appendChild(opt);
        });
    });
}


// ---------------- VALIDACIÓ ----------------
function validar(e) {
    e.preventDefault();
    esborrarError();

    const camps = [
        { id: "date", msg: "Has d’introduir una data." },
        { id: "payment", msg: "Selecciona una forma de pagament." },
        { id: "shipping", msg: "Introdueix un valor vàlid per les despeses d’enviament." },
        { id: "client", msg: "Has de seleccionar un client." }
    ];

    for (let c of camps) {
        const el = document.getElementById(c.id);
        if (!el.value || (c.id === "shipping" && el.value < 0)) {
            return error(el, c.msg);
        }
    }

    enviarFormulari();
}

function error(element, msg) {
    const err = document.getElementById("missatgeError");
    const p = document.createElement("p");
    p.textContent = msg;
    err.appendChild(p);
    element.classList.add("error");
    element.focus();
    return false;
}

function esborrarError() {
    for (let el of document.forms[0].elements) el.classList.remove("error");
    const err = document.getElementById("missatgeError");
    while (err.firstChild) err.removeChild(err.firstChild);
}

// ---------------- PRODUCTES ----------------
function afegirProducte() {
    const fila = document.querySelector(".product-line");
    const quant = fila.querySelector("[name='quantity[]']");
    const preu = fila.querySelector("[name='price[]']");
    if (!quant.value || !preu.value) {
        alert("Has d'introduir una quantitat i un preu vàlids abans d'afegir el producte.");
        return;
    }

    quant.removeAttribute("required");
    preu.removeAttribute("required");

    const nou = {
        producte: fila.querySelector("[name='product_id[]']").value,
        quantitat: +quant.value,
        preu: +preu.value,
        descompte: +(fila.querySelector("[name='discount[]']").value || 0)
    };

    let llista = JSON.parse(localStorage.getItem("productesActuals")) || [];
    llista.push(nou);
    localStorage.setItem("productesActuals", JSON.stringify(llista));

    mostrarProductes(llista);
    quant.value = preu.value = fila.querySelector("[name='discount[]']").value = "";
}

function mostrarProductes(productes) {
    const cont = document.getElementById("productesAfegits");
    while (cont.firstChild) cont.removeChild(cont.firstChild);

    const h4 = document.createElement("h4");
    h4.textContent = "Productes a afegint-se";
    cont.appendChild(h4);

    if (productes.length === 0) return;

    const caps = ["Producte", "Quantitat", "Preu", "Descompte"];
    const taula = document.createElement("table");
    taula.border = "1";
    taula.cellPadding = "4";
    taula.cellSpacing = "0";

    const cap = document.createElement("tr");
    for (let t of caps) {
        const th = document.createElement("th");
        th.textContent = t;
        cap.appendChild(th);
    }
    taula.appendChild(cap);

    for (let p of productes) {
        const tr = document.createElement("tr");
        [p.producte, p.quantitat, p.preu.toFixed(2), p.descompte.toFixed(2)]
            .forEach(v => {
                const td = document.createElement("td");
                td.textContent = v;
                tr.appendChild(td);
            });
        taula.appendChild(tr);
    }
    cont.appendChild(taula);
}

// ---------------- GUARDAR FORMULARI ----------------
function enviarFormulari() {
    const comanda = {
        data: document.getElementById("date").value,
        pagament: document.getElementById("payment").value,
        enviament: +document.getElementById("shipping").value,
        client: document.getElementById("client").value,
        productes: JSON.parse(localStorage.getItem("productesActuals")) || []
    };

    const comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    comandes.push(comanda);
    localStorage.setItem("comandes", JSON.stringify(comandes));
    localStorage.removeItem("productesActuals");

    document.forms[0].reset();
    const cont = document.getElementById("productesAfegits");
    while (cont.firstChild) cont.removeChild(cont.firstChild);
    const msg = document.createElement("p");
    msg.textContent = "✅ Comanda guardada correctament.";
    cont.appendChild(msg);
}
