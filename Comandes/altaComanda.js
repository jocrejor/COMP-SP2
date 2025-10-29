// Quan el document estigui completament carregat, s'executa la funció main()
document.addEventListener("DOMContentLoaded", main);

function main() {
    // Assigna els esdeveniments principals del formulari i botons
    document.getElementById("pedidoForm").addEventListener("submit", validar, false); // Validar formulari
    document.querySelector(".addProduct").addEventListener("click", afegirProducte, false); // Afegir producte
    document.getElementById("llista").addEventListener("click", () => location.href = "comandesLlistar.html"); // Anar a la pàgina de llistat
    // Carrega clients i productes al carregar la pàgina
    carregarClients();
    carregarProductes();
}

//  CARREGAR CLIENTS I PRODUCTES 
// Omple el select de clients amb les dades de l’array Client
function carregarClients() {
    let select = document.getElementById("client");
    select.innerHTML = '<option value="">Selecciona un client...</option>';
    Client.forEach(c => {
        let opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = `${c.name} ${c.surname}`;
        select.appendChild(opt);
    });
}

// Omple tots els selects de productes amb les dades de l’array Product
function carregarProductes() {
    document.querySelectorAll(".productSelect").forEach(select => {
        select.innerHTML = '<option value="">Selecciona un producte...</option>';
        Product.forEach(p => {
            let opt = document.createElement("option");
            opt.value = p.id;
            opt.textContent = p.name;
            select.appendChild(opt);
        });
    });
}

//  VALIDACIÓ 
// Valida el formulari abans d’enviar-lo
function validar(e) {
    e.preventDefault(); // Evita l’enviament per defecte del formulari
    esborrarError(); // Neteja errors anteriors

    // Llista de camps obligatoris amb els seus missatges d’error
    let camps = [
        { id: "date", msg: "Has d’introduir una data." },
        { id: "payment", msg: "Selecciona una forma de pagament." },
        { id: "shipping", msg: "Introdueix un valor vàlid per les despeses d’enviament." },
        { id: "client", msg: "Has de seleccionar un client." }
    ];

    // Comprova si cada camp és vàlid
    for (let c of camps) {
        let el = document.getElementById(c.id);
        if (!el.value || (c.id === "shipping" && el.value < 0)) {
            return error(el, c.msg); // Mostra l’error i atura la validació
        }
    }

    // Si tot és correcte, envia el formulari
    enviarFormulari();
}

// Mostra missatges d’error i marca el camp corresponent
function error(element, msg) {
    let err = document.getElementById("missatgeError");
    let p = document.createElement("p");
    p.textContent = msg;
    err.appendChild(p);
    element.classList.add("error");
    element.focus();
    return false;
}

// Esborra els errors visuals i els missatges del formulari
function esborrarError() {
    for (let el of document.forms[0].elements) el.classList.remove("error");
    let err = document.getElementById("missatgeError");
    while (err.firstChild) err.removeChild(err.firstChild);
}
//  PRODUCTES 
// Afegeix un nou producte a la llista temporal (localStorage)
function afegirProducte() {
    let fila = document.querySelector(".product-line");
    let quant = fila.querySelector("[name='quantity[]']");
    let preu = fila.querySelector("[name='price[]']");
    
    // Validació de quantitat i preu
    if (!quant.value || !preu.value) {
        alert("Has d'introduir una quantitat i un preu vàlids abans d'afegir el producte.");
        return;
    }

    // Elimina el requeriment per evitar errors posteriors
    quant.removeAttribute("required");
    preu.removeAttribute("required");

    // Crea un objecte amb les dades del producte
    let nou = {
        producte: fila.querySelector("[name='product_id[]']").value,
        quantitat: +quant.value,
        preu: +preu.value,
        descompte: +(fila.querySelector("[name='discount[]']").value || 0)
    };

    // Guarda la llista de productes al localStorage
    let llista = JSON.parse(localStorage.getItem("productesActuals")) || [];
    llista.push(nou);
    localStorage.setItem("productesActuals", JSON.stringify(llista));

    // Mostra els productes afegits a la interfície
    mostrarProductes(llista);

    // Neteja els camps
    quant.value = preu.value = fila.querySelector("[name='discount[]']").value = "";
}

// Mostra en una taula els productes afegits
function mostrarProductes(productes) {
    let cont = document.getElementById("productesAfegits");
    while (cont.firstChild) cont.removeChild(cont.firstChild);

    let h4 = document.createElement("h4");
    h4.textContent = "Productes a afegint-se";
    cont.appendChild(h4);

    if (productes.length === 0) return;

    // Crea una taula amb els productes
    let caps = ["Producte", "Quantitat", "Preu", "Descompte"];
    let taula = document.createElement("table");
    taula.border = "1";
    taula.cellPadding = "4";
    taula.cellSpacing = "0";

    // Capçalera de la taula
    let cap = document.createElement("tr");
    for (let t of caps) {
        let th = document.createElement("th");
        th.textContent = t;
        cap.appendChild(th);
    }
    taula.appendChild(cap);

    // Files amb dades dels productes
    for (let p of productes) {
        let tr = document.createElement("tr");
        [p.producte, p.quantitat, p.preu.toFixed(2), p.descompte.toFixed(2)]
            .forEach(v => {
                let td = document.createElement("td");
                td.textContent = v;
                tr.appendChild(td);
            });
        taula.appendChild(tr);
    }
    cont.appendChild(taula);
}

//  GUARDAR FORMULARI 
// Desa tota la comanda al localStorage
function enviarFormulari() {
    let clientSelect = document.getElementById("client");
    let clientNom = clientSelect.options[clientSelect.selectedIndex].textContent;

    // Recupera els productes afegits anteriorment
    let productesGuardats = JSON.parse(localStorage.getItem("productesActuals")) || [];

    // Substitueix els IDs per noms reals dels productes
    let productesAmbNom = productesGuardats.map(p => {
        let prod = Product.find(x => x.id == p.producte);
        return {
            producte: prod ? prod.name : `Producte ${p.producte}`,
            quantitat: p.quantitat,
            preu: p.preu,
            descompte: p.descompte
        };
    });

    // Crea l’objecte comanda
    let comanda = {
        id: Date.now(), 
        data: document.getElementById("date").value,
        pagament: document.getElementById("payment").value,
        enviament: +document.getElementById("shipping").value,
        client: clientNom,
        productes: productesAmbNom
    };

    // Desa la comanda al localStorage
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    comandes.push(comanda);
    localStorage.setItem("comandes", JSON.stringify(comandes));
    localStorage.removeItem("productesActuals"); // Neteja la llista temporal

    // Neteja el formulari i mostra un missatge de confirmació
    document.forms[0].reset();
    let cont = document.getElementById("productesAfegits");
    while (cont.firstChild) cont.removeChild(cont.firstChild);
    let msg = document.createElement("p");
    msg.textContent = "✅ Comanda guardada correctament.";
    cont.appendChild(msg);
}
