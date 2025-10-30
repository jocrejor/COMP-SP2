// INICI DESPRÉS DE CARREGAR EL DOM 
document.addEventListener("DOMContentLoaded", main);

//  FUNCIONS DE GESTIÓ D’ERRORS 
function mostrarError(missatge) {
    console.error(missatge); // Mostra l'error a la consola

    // Busquem o creem un contenidor d'errors al DOM
    let contError = document.getElementById("errors");
    if (!contError) {
        contError = document.createElement("div");
        contError.id = "errors";
        contError.style.color = "red";
        contError.style.margin = "10px 0";
        document.body.prepend(contError);
    }

    // Creem un paràgraf per cada missatge i l'afegim al contenidor
    let p = document.createElement("p");
    p.appendChild(document.createTextNode(missatge));
    contError.appendChild(p);
}

function esborrarErrors() {
    let contError = document.getElementById("errors");
    if (contError) contError.replaceChildren(); // Neteja tots els missatges
}

//  CÀRREGA DE DADES 
function carregarDades() {
    // Comprovem si les dades globals existeixen
    if (!Order || !Orderdetail) {
        mostrarError("Les dades Order o Orderdetail no estan disponibles.");
        return;
    }

    // Transformem les dades en un format uniforme
    let comandesBase = Order.map(o => {
        // Extraiem els productes de cada comanda
        let productes = Orderdetail
            .filter(d => d.order_id === o.id)
            .map(d => ({
                producte: `Producte ${d.product_id}`, // Nom provisional
                quantitat: d.quantity,
                preu: d.price,
                descompte: d.discount
            }));

        // Obtenim el nom real del client si existeix
        let clientNom = "Client desconegut";
        if (typeof Client !== "undefined" && Array.isArray(Client)) {
            let cli = Client.find(c => c.id === (o.client_id - 100)); // Ajust ID
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

    // Recuperem comandes desades prèviament a localStorage
    let comandesLocal = JSON.parse(localStorage.getItem("comandes")) || [];
    let idsBase = comandesBase.map(c => c.id);

    // Combinem comandes base i locals sense duplicats
    let comandesTotals = [
        ...comandesBase,
        ...comandesLocal.filter(c => !idsBase.includes(c.id))
    ];

    // Guardem la llista completa a localStorage
    localStorage.setItem("comandes", JSON.stringify(comandesTotals));
}

//  MOSTRAR COMANDES 
function mostrarComandes() {
    esborrarErrors(); // Neteja missatges previs

    let container = document.getElementById("listaPedidos");
    if (!container) {
        mostrarError("No s'ha trobat el contenidor de comandes amb id 'listaPedidos'.");
        return;
    }

    container.replaceChildren(); // Neteja contingut previ

    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];

    // Si no hi ha comandes, mostrem un missatge
    if (comandes.length === 0) {
        let missatge = document.createElement("p");
        missatge.appendChild(document.createTextNode("No hi ha comandes registrades."));
        container.appendChild(missatge);
        return;
    }

    // Creem taula amb atributs de format
    let taula = document.createElement("table");
    taula.setAttribute("border", "1");
    taula.setAttribute("cellpadding", "5");
    taula.setAttribute("cellspacing", "0");

    // Capçalera de la taula
    let cap = document.createElement("tr");
    ["#", "Data", "Client", "Forma de pagament", "Enviament (€)", "Total (€)", "Accions"].forEach(text => {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(text)); // Sense innerHTML ni textContent
        cap.appendChild(th);
    });
    taula.appendChild(cap);

    // Afegim files amb les dades de cada comanda
    comandes.forEach((c, index) => {
        let fila = document.createElement("tr");

        // Número seqüencial
        let tdIndex = document.createElement("td");
        tdIndex.appendChild(document.createTextNode(index + 1));
        fila.appendChild(tdIndex);

        // Dades bàsiques de la comanda
        let dadesText = [c.data || "N/A", c.client || "N/A", c.pagament || "N/A", (+c.enviament || 0).toFixed(2)];
        dadesText.forEach(d => {
            let td = document.createElement("td");
            td.appendChild(document.createTextNode(d)); // Sense innerHTML ni textContent
            fila.appendChild(td);
        });

        // Càlcul del total incloent productes i enviament
        let tdTotal = document.createElement("td");
        let total = 0;
        (c.productes || []).forEach(p => {
            total += p.quantitat * p.preu * (1 - (p.descompte || 0) / 100);
        });
        total += c.enviament || 0;
        tdTotal.appendChild(document.createTextNode(total.toFixed(2))); // Text amb createTextNode
        fila.appendChild(tdTotal);

        // Botons d'acció
        let tdAccions = document.createElement("td");
        tdAccions.style.textAlign = "center";

        // Creem cada botó sense innerHTML/textContent
        let botoVisualitzar = document.createElement("button");
        botoVisualitzar.appendChild(document.createTextNode("Visualitzar"));
        botoVisualitzar.classList.add("visualitzar");
        botoVisualitzar.addEventListener("click", () => visualitzarComanda(index));

        let botoModificar = document.createElement("button");
        botoModificar.appendChild(document.createTextNode("Modificar"));
        botoModificar.classList.add("modificar");
        botoModificar.addEventListener("click", () => modificarComanda(index));

        let botoEliminar = document.createElement("button");
        botoEliminar.appendChild(document.createTextNode("Eliminar"));
        botoEliminar.classList.add("eliminar");
        botoEliminar.addEventListener("click", () => eliminarComanda(index));

        tdAccions.append(botoVisualitzar, document.createTextNode(" "), botoModificar, document.createTextNode(" "), botoEliminar);
        fila.appendChild(tdAccions);
        taula.appendChild(fila);
    });

    container.appendChild(taula); // Inserim la taula al DOM
}

//  ACCIONS SOBRE COMANDES 
function visualitzarComanda(index) {
    localStorage.setItem("comandaVisualitzar", index); // Guardem índex a localStorage
    window.location.href = "visualitzarComanda.html"; // Redirigim
}

function modificarComanda(index) {
    localStorage.setItem("comandaEditar", index);
    window.location.href = "modificarComanda.html";
}

function eliminarComanda(index) {
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    if (!confirm("Segur que vols eliminar aquesta comanda?")) return; // Confirmació
    comandes.splice(index, 1); // Eliminem comanda
    localStorage.setItem("comandes", JSON.stringify(comandes)); // Guardem canvis
    mostrarComandes(); // Actualitzem la visualització
}

//  MAIN 
function main() {
    carregarDades();    // Carreguem les dades de base i locals
    mostrarComandes();   // Mostrem la llista de comandes

    // Botó per afegir nova comanda
    let botoAfegir = document.getElementById("afegirPedido");
    if (botoAfegir) {
        botoAfegir.addEventListener("click", () => {
            window.location.href = "altaComanda.html";
        });
    }
}
