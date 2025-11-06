// INICI DESPRÉS DE CARREGAR EL DOM 
document.addEventListener("DOMContentLoaded", main);
let paginaActual = 1;
const COMANDES_PER_PAGINA = 5;

// FUNCIONS DE GESTIÓ D’ERRORS 
function mostrarError(missatge) {
    console.error(missatge);
    let contError = document.getElementById("errors");
    if (!contError) {
        contError = document.createElement("div");
        contError.id = "errors";
        contError.style.color = "red";
        contError.style.margin = "10px 0";
        document.body.prepend(contError);
    }
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(missatge));
    contError.appendChild(p);
}

function esborrarErrors() {
    let contError = document.getElementById("errors");
    if (contError) contError.replaceChildren();
}

// CÀRREGA DE DADES 
function carregarDades() {
    if (!Order || !Orderdetail) {
        mostrarError("Les dades Order o Orderdetail no estan disponibles.");
        return;
    }

    let comandesBase = Order.map(o => {
        let productes = Orderdetail
            .filter(d => d.order_id === o.id)
            .map(d => ({
                producte: `Producte ${d.product_id}`,
                quantitat: d.quantity,
                preu: d.price,
                descompte: d.discount
            }));

        let clientNom = "Client desconegut";
        if (typeof Client !== "undefined" && Array.isArray(Client)) {
            let cli = Client.find(c => c.id === (o.client_id - 100));
            if (cli) clientNom = `${cli.name} ${cli.surname}`;
        }

        return {
            id: o.id,
            data: o.date,
            client: clientNom,
            pagament: o.payment,
            enviament: o.shipping_amount,
            productes: productes
        };
    });

    let comandesLocal = JSON.parse(localStorage.getItem("comandes")) || [];
    let idsBase = comandesBase.map(c => c.id);
    let comandesTotals = [
        ...comandesBase,
        ...comandesLocal.filter(c => !idsBase.includes(c.id))
    ];

    localStorage.setItem("comandes", JSON.stringify(comandesTotals));
}

// FILTRAR COMANDES PER DATA
function filtrarPerData(comandes) {
    let dataDesde = document.getElementById("data_desde").value;
    let dataFins = document.getElementById("data_fins").value;

    if (!dataDesde && !dataFins) return comandes;

    return comandes.filter(c => {
        let dataComanda = new Date(c.data);
        let ok = true;

        if (dataDesde) ok = ok && (dataComanda >= new Date(dataDesde));
        if (dataFins) ok = ok && (dataComanda <= new Date(dataFins));

        return ok;
    });
}
// FILTRAR COMANDES PER DATA I CLIENT
function filtrarComandes(comandes) {
    let dataDesde = document.getElementById("data_desde").value;
    let dataFins = document.getElementById("data_fins").value;
    let textClient = document.getElementById("filtrar_client").value.trim().toLowerCase();
    let pagament = document.getElementById("payment").value;

    // Si no hi ha cap filtre, retornem totes
    if (!dataDesde && !dataFins && !textClient && !pagament) return comandes;

    return comandes.filter(c => {
        let ok = true;

        // Filtres independents però combinables
        if (dataDesde || dataFins) {
            let dataComanda = new Date(c.data);
            if (dataDesde) ok = ok && (dataComanda >= new Date(dataDesde));
            if (dataFins) ok = ok && (dataComanda <= new Date(dataFins));
        }

        if (textClient) {
            let nom = (c.client || "").toLowerCase();
            ok = ok && nom.includes(textClient);
        }

        if (pagament) {
            ok = ok && c.pagament === pagament;
        }

        return ok;
    });
}


// MOSTRAR COMANDES 
function mostrarComandes() {
    esborrarErrors();

    let container = document.getElementById("listaPedidos");
    if (!container) {
        mostrarError("No s'ha trobat el contenidor de comandes amb id 'listaPedidos'.");
        return;
    }

    container.replaceChildren();

    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];

    // 🔹 Aplicar filtres complets (data, client, pagament)
    comandes = filtrarComandes(comandes);

    if (comandes.length === 0) {
        let missatge = document.createElement("p");
        missatge.appendChild(document.createTextNode("No hi ha comandes registrades."));
        container.appendChild(missatge);
        return;
    }

    // 🔹 Paginació (5 comandes per pàgina)
    const itemsPerPagina = 5;
    let paginaActual = window.paginaActual || 1;
    const totalPagines = Math.ceil(comandes.length / itemsPerPagina);
    if (paginaActual > totalPagines) paginaActual = totalPagines;

    const inici = (paginaActual - 1) * itemsPerPagina;
    const final = inici + itemsPerPagina;
    let comandesPaginades = comandes.slice(inici, final);

    // 🔹 Crear taula
    let taula = document.createElement("table");
    taula.setAttribute("border", "1");
    taula.setAttribute("cellpadding", "5");
    taula.setAttribute("cellspacing", "0");

    let cap = document.createElement("tr");
    ["#", "Data", "Client", "Forma de pagament", "Enviament (€)", "Total (€)", "Accions"].forEach(text => {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(text));
        cap.appendChild(th);
    });
    taula.appendChild(cap);

    // 🔹 Mostrar comandes de la pàgina actual
    comandesPaginades.forEach((c, index) => {
        let fila = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.appendChild(document.createTextNode(inici + index + 1));
        fila.appendChild(tdIndex);

        let dadesText = [c.data || "N/A", c.client || "N/A", c.pagament || "N/A", (+c.enviament || 0).toFixed(2)];
        dadesText.forEach(d => {
            let td = document.createElement("td");
            td.appendChild(document.createTextNode(d));
            fila.appendChild(td);
        });

        let tdTotal = document.createElement("td");
        let total = 0;
        (c.productes || []).forEach(p => {
            total += p.quantitat * p.preu * (1 - (p.descompte || 0) / 100);
        });
        total += c.enviament || 0;
        tdTotal.appendChild(document.createTextNode(total.toFixed(2)));
        fila.appendChild(tdTotal);

        // 🔹 Botons d'accions (sense canviar colors)
        let tdAccions = document.createElement("td");
        tdAccions.style.textAlign = "center";

        let botoVisualitzar = document.createElement("button");
        botoVisualitzar.appendChild(document.createTextNode("Visualitzar"));
        botoVisualitzar.classList.add("visualitzar");
        botoVisualitzar.addEventListener("click", () => visualitzarComanda(inici + index));

        let botoModificar = document.createElement("button");
        botoModificar.appendChild(document.createTextNode("Modificar"));
        botoModificar.classList.add("modificar");
        botoModificar.addEventListener("click", () => modificarComanda(inici + index));

        let botoEliminar = document.createElement("button");
        botoEliminar.appendChild(document.createTextNode("Eliminar"));
        botoEliminar.classList.add("eliminar");
        botoEliminar.addEventListener("click", () => eliminarComanda(inici + index));

        tdAccions.append(
            botoVisualitzar, document.createTextNode(" "),
            botoModificar, document.createTextNode(" "),
            botoEliminar
        );
        fila.appendChild(tdAccions);

        taula.appendChild(fila);
    });

    container.appendChild(taula);

    // 🔹 Crear navegació de pàgines
    let paginacio = document.createElement("nav");
    paginacio.setAttribute("aria-label", "Page navigation");

    let ul = document.createElement("ul");
    ul.classList.add("pagination", "justify-content-center");

    // Botó Previous
    let liPrev = document.createElement("li");
    liPrev.classList.add("page-item");
    if (paginaActual === 1) liPrev.classList.add("disabled");
    let aPrev = document.createElement("a");
    aPrev.classList.add("page-link");
    aPrev.textContent = "Previous";
    aPrev.href = "#";
    aPrev.addEventListener("click", (e) => {
        e.preventDefault();
        if (paginaActual > 1) {
            window.paginaActual = paginaActual - 1;
            mostrarComandes();
        }
    });
    liPrev.appendChild(aPrev);
    ul.appendChild(liPrev);

    // Números de pàgina
    for (let i = 1; i <= totalPagines; i++) {
        let li = document.createElement("li");
        li.classList.add("page-item");
        if (i === paginaActual) li.classList.add("active");
        let a = document.createElement("a");
        a.classList.add("page-link");
        a.href = "#";
        a.textContent = i;
        a.addEventListener("click", (e) => {
            e.preventDefault();
            window.paginaActual = i;
            mostrarComandes();
        });
        li.appendChild(a);
        ul.appendChild(li);
    }

    // Botó Next
    let liNext = document.createElement("li");
    liNext.classList.add("page-item");
    if (paginaActual === totalPagines) liNext.classList.add("disabled");
    let aNext = document.createElement("a");
    aNext.classList.add("page-link");
    aNext.textContent = "Next";
    aNext.href = "#";
    aNext.addEventListener("click", (e) => {
        e.preventDefault();
        if (paginaActual < totalPagines) {
            window.paginaActual = paginaActual + 1;
            mostrarComandes();
        }
    });
    liNext.appendChild(aNext);
    ul.appendChild(liNext);

    paginacio.appendChild(ul);
    container.appendChild(paginacio);
}


// ACCIONS SOBRE COMANDES 
function visualitzarComanda(index) {
    localStorage.setItem("comandaVisualitzar", index);
    window.location.href = "visualitzarComanda.html";
}

function modificarComanda(index) {
    localStorage.setItem("comandaEditar", index);
    window.location.href = "modificarComanda.html";
}

function eliminarComanda(index) {
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    if (!confirm("Segur que vols eliminar aquesta comanda?")) return;
    comandes.splice(index, 1);
    localStorage.setItem("comandes", JSON.stringify(comandes));
    mostrarComandes();
}

// MAIN 
function main() {
    carregarDades();
    mostrarComandes();

    // Botó per afegir nova comanda
    let botoAfegir = document.getElementById("afegirPedido");
    if (botoAfegir) {
        botoAfegir.addEventListener("click", () => {
            window.location.href = "altaComanda.html";
        });
    }

    // EVENTS DELS FILTRES
    let dataDesde = document.getElementById("data_desde");
    let dataFins = document.getElementById("data_fins");
    let inputClient = document.getElementById("filtrar_client");
    let btnFiltrar = document.getElementById("aplicarFiltres");

    if (dataDesde) dataDesde.addEventListener("change", mostrarComandes);
    if (dataFins) dataFins.addEventListener("change", mostrarComandes);
    if (inputClient) inputClient.addEventListener("input", mostrarComandes);
    if (btnFiltrar) btnFiltrar.addEventListener("click", mostrarComandes);
    // --- NOU: EVENT DEL FILTRE DE CLIENT I BOTÓ FILTRAR ---

    if (inputClient) {
        // Si vols que filtre automàticament mentre escrius
        inputClient.addEventListener("input", mostrarComandes);
    }

    if (btnFiltrar) {
        // Evita que el botó faça submit si està dins d'un form
        btnFiltrar.type = "button";
        btnFiltrar.addEventListener("click", (ev) => {
            ev.preventDefault();
            mostrarComandes(); // Torna a renderitzar la taula amb filtres aplicats
        });
    }

}
