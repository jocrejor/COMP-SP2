//  EXECUTAR TOT QUAN EL DOM ESTIGUI CARREGAT 
document.addEventListener("DOMContentLoaded", main);

function main() {
    // Mostrem tota la informació de la comanda seleccionada
    mostrarComanda();

    //  BOTÓ "TORNAR" 
    let botoTornar = document.getElementById("tornar");
    // Si existeix el botó, afegim event listener per tornar a la llista
    botoTornar?.addEventListener("click", () => {
        window.location.href = "comandesLlistar.html";
    });
}

/**
 * Mostra tota la informació de la comanda seleccionada
 */
function mostrarComanda() {
    // Recuperem l'índex de la comanda seleccionada del localStorage
    let index = localStorage.getItem("comandaVisualitzar");
    let detalleContainer = document.getElementById("detallePedido");

    // Neteja el contenidor abans de mostrar la informació
    detalleContainer.replaceChildren();

    if (index === null) {
        mostrarMissatge(detalleContainer, " No hi ha cap comanda seleccionada.");
        return;
    }

    // Recuperem totes les comandes del localStorage i seleccionem la corresponent
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    let comanda = comandes[index];

    if (!comanda) {
        mostrarMissatge(detalleContainer, " Comanda no trobada.");
        return;
    }

    //  FORMAT DE DATA (nou)
    let dataFormatejada = formatData(comanda.data);

    //  INFORMACIÓ BÀSICA DE LA COMANDA 
    let infoBàsica = [
        { label: "Data", value: dataFormatejada || "N/A" },
        { label: "Client", value: comanda.client || "N/A" },
        { label: "Tipus de pagament", value: comanda.pagament || "N/A" },
        { label: "Enviament (€)", value: (+comanda.enviament || 0).toFixed(2) }
    ];

    // Creem paràgrafs per cada dada bàsica
    infoBàsica.forEach(info => {
        let p = document.createElement("p");
        let textNode = document.createTextNode(info.label + ": " + info.value);
        p.appendChild(textNode);
        detalleContainer.appendChild(p);
    });

    //  TAULA DE PRODUCTES 
    let taula = document.createElement("table");
    taula.border = "1";
    taula.cellPadding = "5";
    taula.cellSpacing = "0";
    taula.style.borderCollapse = "collapse";
    taula.style.marginTop = "10px";

    // Capçalera de la taula
    let cap = document.createElement("tr");
    ["Producte", "Quantitat", "Preu (€)", "Descompte (%)", "Subtotal (€)"].forEach(text => {
        let th = document.createElement("th");
        let textNode = document.createTextNode(text);
        th.appendChild(textNode);
        cap.appendChild(th);
    });
    taula.appendChild(cap);

    //  FILES DE PRODUCTES 
    let total = 0;
    let productes = comanda.productes || [];

    if (productes.length === 0) {
        // Mostrem fila buida si no hi ha productes
        let filaBuida = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 5;
        td.style.textAlign = "center";
        td.appendChild(document.createTextNode("Cap producte a la comanda."));
        filaBuida.appendChild(td);
        taula.appendChild(filaBuida);
    } else {
        // Creem fila per cada producte
        productes.forEach(p => {
            let fila = document.createElement("tr");

            // Obtenim el nom real del producte
            let producteNom = obtenirNomProducte(p);

            let quantitat = +p.quantitat || 0;
            let preu = +p.preu || 0;
            let descompte = +p.descompte || 0;

            let subtotal = quantitat * preu * (1 - descompte / 100);
            total += subtotal;

            // Dades de la fila
            let dades = [
                producteNom,
                quantitat,
                preu.toFixed(2),
                descompte.toFixed(2),
                subtotal.toFixed(2)
            ];

            dades.forEach(valor => {
                let td = document.createElement("td");
                td.appendChild(document.createTextNode(valor));
                fila.appendChild(td);
            });

            taula.appendChild(fila);
        });
    }

    //  TOTAL FINAL 
    total += +comanda.enviament || 0;

    let filaTotal = document.createElement("tr");

    let tdTotal = document.createElement("td");
    tdTotal.colSpan = 4;
    tdTotal.style.textAlign = "right";
    tdTotal.appendChild(document.createTextNode("Total amb enviament (€):"));

    let tdValor = document.createElement("td");
    tdValor.appendChild(document.createTextNode(total.toFixed(2)));

    filaTotal.append(tdTotal, tdValor);
    taula.appendChild(filaTotal);

    // Afegim la taula al contenidor
    detalleContainer.appendChild(taula);
}

/**
 * Mostra un missatge simple dins d'un contenidor
 */
function mostrarMissatge(container, text) {
    let p = document.createElement("p");
    let textNode = document.createTextNode(text);
    p.appendChild(textNode);
    container.appendChild(p);
}

/**
 * Retorna sempre el NOM del producte.
 * Si el localStorage guarda un número, busca el nom a window.products.
 */
function obtenirNomProducte(p) {
    // Si el camp "producte" ja és un nom (no numèric)
    if (typeof p.producte === "string" && isNaN(p.producte)) {
        return p.producte;
    }

    // Si tenim la llista global de productes carregada
    if (window.products && Array.isArray(window.products)) {
        let trobat = window.products.find(prod =>
            Number(prod.id) === Number(p.producte) || Number(prod.id) === Number(p.id)
        );
        if (trobat) return trobat.name;
    }

    // Últim recurs si no es troba el nom
    return "Nom no disponible";
}

/**
 * Formata una data al format DD/MM/YYYY
 */
function formatData(dataString) {
    if (!dataString) return "N/A";

    let data = new Date(dataString);
    if (isNaN(data)) return dataString; // si no és una data vàlida

    let dia = String(data.getDate()).padStart(2, "0");
    let mes = String(data.getMonth() + 1).padStart(2, "0");
    let any = data.getFullYear();

    return `${dia}/${mes}/${any}`;
}
