//  Espera que el DOM estigui completament carregat abans d’executar la funció 'main'
document.addEventListener("DOMContentLoaded", main);

// Variables globals per a la paginació
let paginaActual = 1;                // Guarda en quina pàgina de comandes estem
let COMANDES_PER_PAGINA = 5;         // Número de comandes per pàgina

//  FUNCIONS DE GESTIÓ D’ERRORS

// Mostra missatges d’error tant per consola com visualment a la pàgina
function mostrarError(missatge) {
    console.error(missatge); // Mostra l’error a la consola (útil per depuració)

    // Cerquem si ja existeix un contenidor per a errors
    let contError = document.getElementById("errors");
    if (!contError) {
        // Si no existeix, el creem dinàmicament
        contError = document.createElement("div");
        contError.id = "errors";
        contError.style.color = "red";
        contError.style.margin = "10px 0";
        // Afegim el contenidor a la part superior del body
        document.body.prepend(contError);
    }

    // Afegim el text de l’error dins del contenidor
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(missatge));
    contError.appendChild(p);
}

// Esborra tots els missatges d’error visibles
function esborrarErrors() {
    let contError = document.getElementById("errors");
    if (contError) contError.replaceChildren(); // Neteja el contingut intern
}

//  CÀRREGA DE DADES DE COMANDES I PRODUCTES

function carregarDades() {
    // Comprovem que les dades globals Order i Orderdetail existisquen
    if (!Order || !Orderdetail) {
        mostrarError("Les dades Order o Orderdetail no estan disponibles.");
        return;
    }

    // Transformem les dades de la base (Order + Orderdetail)
    let comandesBase = Order.map(o => {
        // Busquem els productes associats a cada comanda (Orderdetail)
        let productes = Orderdetail
            .filter(d => d.order_id === o.id) // Només els detalls que coincideixen amb la comanda
            .map(d => ({
                producte: `Producte ${d.product_id}`,
                quantitat: d.quantity,
                preu: d.price,
                descompte: d.discount
            }));

        //  Assignem el nom del client
        let clientNom = "Client desconegut";
        if (typeof Client !== "undefined" && Array.isArray(Client)) {
            // Troba el client corresponent (l’ID pot estar desfasat)
            let cli = Client.find(c => c.id === (o.client_id - 100));
            if (cli) clientNom = `${cli.name} ${cli.surname}`;
        }

        // Retornem un objecte comanda amb totes les dades necessàries
        return {
            id: o.id,
            data: o.date,
            client: clientNom,
            pagament: o.payment,
            enviament: o.shipping_amount,
            productes: productes
        };
    });

    //  Recuperem comandes guardades manualment al localStorage
    let comandesLocal = JSON.parse(localStorage.getItem("comandes")) || [];

    //  Evitem duplicats: només afegim les que no estan a la base
    let idsBase = comandesBase.map(c => c.id);
    let comandesTotals = [
        ...comandesBase,
        ...comandesLocal.filter(c => !idsBase.includes(c.id))
    ];

    //  Guardem el conjunt complet de comandes al localStorage
    localStorage.setItem("comandes", JSON.stringify(comandesTotals));
}

//  FILTRAR COMANDES PER DATA

function filtrarPerData(comandes) {
    let dataDesde = document.getElementById("data_desde").value;
    let dataFins = document.getElementById("data_fins").value;

    // Si no hi ha dates seleccionades, retornem totes les comandes
    if (!dataDesde && !dataFins) return comandes;

    // Si hi ha dates, filtrem les comandes dins del rang
    return comandes.filter(c => {
        let dataComanda = new Date(c.data);
        let ok = true;

        if (dataDesde) ok = ok && (dataComanda >= new Date(dataDesde));
        if (dataFins) ok = ok && (dataComanda <= new Date(dataFins));

        return ok;
    });
}

// FILTRAR COMANDES PER DATA, CLIENT I FORMA DE PAGAMENT

function filtrarComandes(comandes) {
    // Recollim els valors dels filtres
    let dataDesde = document.getElementById("data_desde").value;
    let dataFins = document.getElementById("data_fins").value;
    let textClient = document.getElementById("filtrar_client").value.trim().toLowerCase();
    let pagament = document.getElementById("payment").value;

    // Si no hi ha cap filtre, retornem totes les comandes
    if (!dataDesde && !dataFins && !textClient && !pagament) return comandes;

    // Filtrem segons els camps indicats
    return comandes.filter(c => {
        let ok = true;

        //  Filtre per dates
        if (dataDesde || dataFins) {
            let dataComanda = new Date(c.data);
            if (dataDesde) ok = ok && (dataComanda >= new Date(dataDesde));
            if (dataFins) ok = ok && (dataComanda <= new Date(dataFins));
        }

        //  Filtre per client (coincidència parcial)
        if (textClient) {
            let nom = (c.client || "").toLowerCase();
            ok = ok && nom.includes(textClient);
        }

        //  Filtre per forma de pagament
        if (pagament) {
            ok = ok && c.pagament === pagament;
        }

        return ok;
    });
}

//  MOSTRAR COMANDES A LA PÀGINA

function mostrarComandes() {
    esborrarErrors(); // Neteja errors previs

    let container = document.getElementById("listaPedidos");
    if (!container) {
        mostrarError("No s'ha trobat el contenidor de comandes amb id 'listaPedidos'.");
        return;
    }

    // Neteja contingut previ
    container.replaceChildren();

    // Recuperem comandes del localStorage
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];

    // Aplicar filtres (data, client i pagament)
    comandes = filtrarComandes(comandes);

    // Si no hi ha resultats, mostrem un missatge informatiu
    if (comandes.length === 0) {
        let missatge = document.createElement("p");
        missatge.appendChild(document.createTextNode("No hi ha comandes registrades."));
        container.appendChild(missatge);
        return;
    }

    //  Paginació: només 5 comandes per pàgina
    let itemsPerPagina = 5;
    let paginaActual = window.paginaActual || 1;
    let totalPagines = Math.ceil(comandes.length / itemsPerPagina);
    if (paginaActual > totalPagines) paginaActual = totalPagines;

    // Calculem quin rang de comandes mostrar
    let inici = (paginaActual - 1) * itemsPerPagina;
    let final = inici + itemsPerPagina;
    let comandesPaginades = comandes.slice(inici, final);

    //  Creació de la taula HTML amb les comandes
    let taula = document.createElement("table");
    taula.setAttribute("border", "1");
    taula.setAttribute("cellpadding", "5");
    taula.setAttribute("cellspacing", "0");

    // Capçalera de la taula
    let cap = document.createElement("tr");
    ["#", "Data", "Client", "Forma de pagament", "Enviament (€)", "Total (€)", "Accions"].forEach(text => {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(text));
        cap.appendChild(th);
    });
    taula.appendChild(cap);

    //  Omplim la taula amb les comandes d’aquesta pàgina
    comandesPaginades.forEach((c, index) => {
        let fila = document.createElement("tr");

        // Número de fila (1-based)
        let tdIndex = document.createElement("td");
        tdIndex.appendChild(document.createTextNode(inici + index + 1));
        fila.appendChild(tdIndex);

        // Dades principals: data, client, pagament, enviament
        let dadesText = [c.data || "N/A", c.client || "N/A", c.pagament || "N/A", (+c.enviament || 0).toFixed(2)];
        dadesText.forEach(d => {
            let td = document.createElement("td");
            td.appendChild(document.createTextNode(d));
            fila.appendChild(td);
        });

        // Càlcul del total de la comanda (productes + enviament)
        let tdTotal = document.createElement("td");
        let total = 0;
        (c.productes || []).forEach(p => {
            total += p.quantitat * p.preu * (1 - (p.descompte || 0) / 100);
        });
        total += c.enviament || 0;
        tdTotal.appendChild(document.createTextNode(total.toFixed(2)));
        fila.appendChild(tdTotal);

        // Creem botons d'accions
        let tdAccions = document.createElement("td");
        tdAccions.style.textAlign = "center";

        // Botó per visualitzar la comanda
        let botoVisualitzar = document.createElement("button");
        botoVisualitzar.appendChild(document.createTextNode("Visualitzar"));
        botoVisualitzar.classList.add("visualitzar");
        botoVisualitzar.addEventListener("click", () => visualitzarComanda(inici + index));

        // Botó per modificar la comanda
        let botoModificar = document.createElement("button");
        botoModificar.appendChild(document.createTextNode("Modificar"));
        botoModificar.classList.add("modificar");
        botoModificar.addEventListener("click", () => modificarComanda(inici + index));

        // Botó per eliminar la comanda
        let botoEliminar = document.createElement("button");
        botoEliminar.appendChild(document.createTextNode("Eliminar"));
        botoEliminar.classList.add("eliminar");
        botoEliminar.addEventListener("click", () => eliminarComanda(inici + index));

        // Afegim tots els botons a la cel·la
        tdAccions.append(
            botoVisualitzar, document.createTextNode(" "),
            botoModificar, document.createTextNode(" "),
            botoEliminar
        );
        fila.appendChild(tdAccions);

        taula.appendChild(fila);
    });

    // Afegim la taula al contenidor principal
    container.appendChild(taula);

    // Creació del sistema de navegació per pàgines
    let paginacio = document.createElement("nav");
    paginacio.setAttribute("aria-label", "Page navigation");

    let ul = document.createElement("ul");
    ul.classList.add("pagination", "justify-content-center");

    //  Botó “Previous”
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

    //  Botó “Next”
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

    // Afegim la navegació al final del contenidor
    paginacio.appendChild(ul);
    container.appendChild(paginacio);
}

//  ACCIONS SOBRE COMANDES (visualitzar, modificar, eliminar)

// Guarda l’índex i redirigeix a la pàgina de visualització
function visualitzarComanda(index) {
    localStorage.setItem("comandaVisualitzar", index);
    window.location.href = "visualitzarComanda.html";
}

// Guarda l’índex i redirigeix a la pàgina d’edició
function modificarComanda(index) {
    localStorage.setItem("comandaEditar", index);
    window.location.href = "modificarComanda.html";
}

// Elimina una comanda després de confirmar-ho amb l’usuari
function eliminarComanda(index) {
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    if (!confirm("Segur que vols eliminar aquesta comanda?")) return;
    comandes.splice(index, 1);
    localStorage.setItem("comandes", JSON.stringify(comandes));
    mostrarComandes(); // Torna a actualitzar la llista
}

// FUNCIÓ PRINCIPAL MAIN

function main() {
    carregarDades();      // Carrega dades inicials
    mostrarComandes();    // Mostra totes les comandes

    // 🔹 Botó per afegir nova comanda
    let botoAfegir = document.getElementById("afegirPedido");
    if (botoAfegir) {
        botoAfegir.addEventListener("click", () => {
            window.location.href = "altaComanda.html";
        });
    }

    // Assignació d’esdeveniments als filtres

    let dataDesde = document.getElementById("data_desde");
    let dataFins = document.getElementById("data_fins");
    let inputClient = document.getElementById("filtrar_client");
    let btnFiltrar = document.getElementById("aplicarFiltres");

    // Quan canvien les dates → recarrega la taula
    if (dataDesde) dataDesde.addEventListener("change", mostrarComandes);
    if (dataFins) dataFins.addEventListener("change", mostrarComandes);

    // Quan s’escriu el nom del client → actualitza en temps real
    if (inputClient) inputClient.addEventListener("input", mostrarComandes);

    // Quan es clica el botó “Aplicar filtres”
    if (btnFiltrar) {
        btnFiltrar.type = "button"; // Evita que el botó envie formulari
        btnFiltrar.addEventListener("click", (ev) => {
            ev.preventDefault();
            mostrarComandes(); // Recarrega amb filtres aplicats
        });
    }
}
