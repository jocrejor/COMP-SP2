// INICI DESPRÉS DE CARREGAR EL DOM
document.addEventListener("DOMContentLoaded", main);

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

        return {
            id: o.id,
            data: o.date,
            client: `Client ${o.client_id}`,
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

    if (comandes.length === 0) {
        let missatge = document.createElement("p");
        missatge.appendChild(document.createTextNode("No hi ha comandes registrades."));
        container.appendChild(missatge);
        return;
    }

    let taula = document.createElement("table");
    taula.setAttribute("border", "1");
    taula.setAttribute("cellpadding", "5");
    taula.setAttribute("cellspacing", "0");

    let cap = document.createElement("tr");
    ["#", "Data", "Client", "Forma de pagament", "Enviament (€)", "Productes", "Accions"].forEach(text => {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(text));
        cap.appendChild(th);
    });
    taula.appendChild(cap);

    comandes.forEach((c, index) => {
        let fila = document.createElement("tr");

        let tdIndex = document.createElement("td");
        tdIndex.appendChild(document.createTextNode(index + 1));
        fila.appendChild(tdIndex);

        let dadesText = [c.data || "N/A", c.client || "N/A", c.pagament || "N/A", (+c.enviament || 0).toFixed(2)];
        dadesText.forEach(d => {
            let td = document.createElement("td");
            td.appendChild(document.createTextNode(d));
            fila.appendChild(td);
        });
        let tdProductes = document.createElement("td");

        let total = 0;
        (c.productes || []).forEach(p => {
            let subtotal = p.quantitat * p.preu * (1 - (p.descompte || 0) / 100);
            total += subtotal;
        });

        total += c.enviament || 0;

        let totalText = document.createElement("b");
        totalText.appendChild(document.createTextNode(`${total.toFixed(2)} €`));

        tdProductes.appendChild(totalText);
        fila.appendChild(tdProductes);
        
        //Subtaula
        /*let tdProductes = document.createElement("td");
        let subTaula = document.createElement("table");
        subTaula.setAttribute("border", "1");
        subTaula.setAttribute("cellpadding", "2");
        subTaula.setAttribute("cellspacing", "0");

        let capProductes = document.createElement("tr");
        ["Producte", "Quantitat", "Preu", "Descompte (%)"].forEach(text => {
            let th = document.createElement("th");
            th.appendChild(document.createTextNode(text));
            capProductes.appendChild(th);
        });
        subTaula.appendChild(capProductes);

        let total = 0;
        (c.productes || []).forEach(p => {
            let f = document.createElement("tr");
            let subtotal = p.quantitat * p.preu * (1 - (p.descompte || 0) / 100);
            total += subtotal;

            let dades = [
                p.producte,
                p.quantitat,
                `${p.preu.toFixed(2)}€`,
                `${(p.descompte || 0).toFixed(2)}%`
            ];

            dades.forEach(valor => {
                let td = document.createElement("td");
                td.appendChild(document.createTextNode(valor));
                f.appendChild(td);
            });

            subTaula.appendChild(f);
        });

        total += c.enviament || 0;

        let totalText = document.createElement("b");
        totalText.appendChild(document.createTextNode(`Total: ${total.toFixed(2)}€`));

        tdProductes.appendChild(subTaula);
        tdProductes.appendChild(totalText);
        fila.appendChild(tdProductes);*/

        let tdAccions = document.createElement("td");
        tdAccions.style.textAlign = "center";

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

        tdAccions.appendChild(botoVisualitzar);
        tdAccions.appendChild(document.createTextNode(" "));
        tdAccions.appendChild(botoModificar);
        tdAccions.appendChild(document.createTextNode(" "));
        tdAccions.appendChild(botoEliminar);

        fila.appendChild(tdAccions);
        taula.appendChild(fila);
    });

    container.appendChild(taula);
}

// ACCIONS
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

    let botoAfegir = document.getElementById("afegirPedido");
    if (botoAfegir) {
        botoAfegir.addEventListener("click", () => {
            window.location.href = "altaComanda.html";
        });
    }
}
