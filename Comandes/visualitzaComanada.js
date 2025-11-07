//  EXECUTAR TOT QUAN EL DOM ESTIGUI CARREGAT
// Quan el navegador haja carregat tot l’HTML (però abans de les imatges),
// s’executarà la funció principal `main()`.
document.addEventListener("DOMContentLoaded", main);


//  FUNCIÓ PRINCIPAL: main()
// S'encarrega d'iniciar la pàgina de visualització de comanda
function main() {
    //  Mostrem tota la informació de la comanda seleccionada
    mostrarComanda();

    //  BOTÓ "TORNAR"
    let botoTornar = document.getElementById("tornar");

    // Si el botó existeix (l'operador ?. evita errors si és null)
    // afegim un esdeveniment per tornar a la pàgina de llistat
    botoTornar?.addEventListener("click", () => {
        window.location.href = "comandesLlistar.html";
    });
}

//  FUNCIÓ: mostrarComanda()
// Mostra tota la informació de la comanda seleccionada en el DOM
function mostrarComanda() {
    //  Recuperem l’índex de la comanda seleccionada del localStorage
    let index = localStorage.getItem("comandaVisualitzar");

    // Referència al contenidor on mostrarem els detalls
    let detalleContainer = document.getElementById("detallePedido");

    // Neteja el contingut anterior (si n’hi havia)
    detalleContainer.replaceChildren();

    // Si no hi ha cap índex desat, mostrem un missatge i sortim
    if (index === null) {
        mostrarMissatge(detalleContainer, " No hi ha cap comanda seleccionada.");
        return;
    }

    //  Recuperem totes les comandes del localStorage
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];

    // Agafem la comanda que correspon a l’índex seleccionat
    let comanda = comandes[index];

    // Si no existeix, informem i eixim
    if (!comanda) {
        mostrarMissatge(detalleContainer, " Comanda no trobada.");
        return;
    }

    //  FORMAT DE DATA (fem que siga més llegible)
    let dataFormatejada = formatData(comanda.data);

    //  INFORMACIÓ BÀSICA DE LA COMANDA
    // Preparem un array amb les dades principals a mostrar
    let infoBàsica = [
        { label: "Data", value: dataFormatejada || "N/A" },
        { label: "Client", value: comanda.client || "N/A" },
        { label: "Tipus de pagament", value: comanda.pagament || "N/A" },
        { label: "Enviament (€)", value: (+comanda.enviament || 0).toFixed(2) }
    ];

    // Recorrem cada element i creem un <p> amb el text corresponent
    infoBàsica.forEach(info => {
        let p = document.createElement("p");
        let textNode = document.createTextNode(info.label + ": " + info.value);
        p.appendChild(textNode);
        detalleContainer.appendChild(p);
    });

    //  TAULA DE PRODUCTES
    let taula = document.createElement("table");
    taula.border = "1";                     // Borda visible
    taula.cellPadding = "5";                // Espai intern
    taula.cellSpacing = "0";                // Sense espai entre cel·les
    taula.style.borderCollapse = "collapse";
    taula.style.marginTop = "10px";

    //  Capçalera de la taula
    let cap = document.createElement("tr");

    // Textos de les columnes
    ["Producte", "Quantitat", "Preu (€)", "Descompte (%)", "Subtotal (€)"]
        .forEach(text => {
            let th = document.createElement("th");
            let textNode = document.createTextNode(text);
            th.appendChild(textNode);
            cap.appendChild(th);
        });

    taula.appendChild(cap);

    //  FILES DE PRODUCTES
    let total = 0; // Acumulador del total de la comanda
    let productes = comanda.productes || [];

    // Si no hi ha productes, mostrem un missatge dins la taula
    if (productes.length === 0) {
        let filaBuida = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 5; // Fila ocupa totes les columnes
        td.style.textAlign = "center";
        td.appendChild(document.createTextNode("Cap producte a la comanda."));
        filaBuida.appendChild(td);
        taula.appendChild(filaBuida);
    } else {
        // Recorrem cada producte de la comanda i creem una fila
        productes.forEach(p => {
            let fila = document.createElement("tr");

            // Obtenim el nom real del producte (numèric o text)
            let producteNom = obtenirNomProducte(p);

            // Extraiem quantitat, preu i descompte (amb valors per defecte)
            let quantitat = +p.quantitat || 0;
            let preu = +p.preu || 0;
            let descompte = +p.descompte || 0;

            // Calculem el subtotal amb descompte aplicat
            let subtotal = quantitat * preu * (1 - descompte / 100);
            total += subtotal; // L’acumulam al total general

            // Array amb les dades que s’escriuran a la fila
            let dades = [
                producteNom,
                quantitat,
                preu.toFixed(2),
                descompte.toFixed(2),
                subtotal.toFixed(2)
            ];

            // Creem cada cel·la (<td>) amb el valor corresponent
            dades.forEach(valor => {
                let td = document.createElement("td");
                td.appendChild(document.createTextNode(valor));
                fila.appendChild(td);
            });

            // Afegim la fila a la taula
            taula.appendChild(fila);
        });
    }

    // TOTAL FINAL (amb enviament)
    total += +comanda.enviament || 0; // Suma el cost d’enviament al total

    // Fila final amb text i import total
    let filaTotal = document.createElement("tr");

    // Primera cel·la: etiqueta
    let tdTotal = document.createElement("td");
    tdTotal.colSpan = 4; // ocupa diverses columnes
    tdTotal.style.textAlign = "right";
    tdTotal.appendChild(document.createTextNode("Total amb enviament (€):"));

    // Segona cel·la: valor total
    let tdValor = document.createElement("td");
    tdValor.appendChild(document.createTextNode(total.toFixed(2)));

    // Afegim la fila final a la taula
    filaTotal.append(tdTotal, tdValor);
    taula.appendChild(filaTotal);

    // Finalment, afegim tota la taula al contenidor principal
    detalleContainer.appendChild(taula);
}

//  FUNCIÓ: mostrarMissatge(container, text)
// Mostra un paràgraf amb un missatge dins del contenidor
function mostrarMissatge(container, text) {
    let p = document.createElement("p");
    let textNode = document.createTextNode(text);
    p.appendChild(textNode);
    container.appendChild(p);
}

//  FUNCIÓ: obtenirNomProducte(p)
// Retorna sempre el nom del producte, encara que al localStorage
// s'haja desat només el seu ID numèric
function obtenirNomProducte(p) {
    // Si el camp "producte" ja és un nom (textual)
    if (typeof p.producte === "string" && isNaN(p.producte)) {
        return p.producte;
    }

    // Si existeix la llista global "window.products"
    if (window.products && Array.isArray(window.products)) {
        // Busquem coincidència per ID o per camp "p.id"
        let trobat = window.products.find(prod =>
            Number(prod.id) === Number(p.producte) || Number(prod.id) === Number(p.id)
        );
        if (trobat) return trobat.name; // Retornem el nom trobat
    }

    // Últim recurs si no trobem res
    return "Nom no disponible";
}


//  FUNCIÓ: formatData(dataString)
// Converteix una data en format ISO a DD/MM/YYYY
function formatData(dataString) {
    if (!dataString) return "N/A"; // Si no hi ha data, retornem N/A

    let data = new Date(dataString);
    if (isNaN(data)) return dataString; // Si no és una data vàlida, la retornem tal qual

    // Formatem amb dos dígits per dia i mes
    let dia = String(data.getDate()).padStart(2, "0");
    let mes = String(data.getMonth() + 1).padStart(2, "0");
    let any = data.getFullYear();

    return `${dia}/${mes}/${any}`;
}
