// Espera que el DOM estigui completament carregat abans d'executar 'main'
document.addEventListener("DOMContentLoaded", main);

function main() {
    // Esborrem productes anteriors a cada recàrrega de pàgina per començar net
    localStorage.removeItem("productesActuals");

    // Assignem la validació del formulari a l'esdeveniment submit
    document.getElementById("pedidoForm").addEventListener("submit", validarFormulari);

    // Botó per veure la llista de comandes
    document.getElementById("llista").addEventListener("click", () => location.href = "comandesLlistar.html");

    // Delegació del botó "Afegir" dins de la taula de productes
    document.getElementById("productsTable").addEventListener("click", function(e) {
        if (e.target.classList.contains("addProduct")) afegirProducte(e);
    });

    // Carreguem clients i productes per als selects
    carregarClients();
    carregarProductes();

    // Configuració per actualitzar automàticament el preu en seleccionar un producte
    configurarAutoPreu();

    // Inicialment, taula de productes buida
    mostrarProductes([]);
}

//  CARREGAR CLIENTS I PRODUCTES 
function carregarClients() {
    let select = document.getElementById("client");
    select.replaceChildren(); // Neteja prèvia
    select.appendChild(new Option("Selecciona un client...", ""));
    Client.forEach(c => select.appendChild(new Option(`${c.name} ${c.surname}`, c.id)));
}

function carregarProductes() {
    document.querySelectorAll(".productSelect").forEach(select => {
        select.replaceChildren();
        select.appendChild(new Option("Selecciona un producte...", ""));
        Product.forEach(p => select.appendChild(new Option(p.name, p.id)));
    });
}

//  AUTO-PREU 
function configurarAutoPreu() {
    document.querySelectorAll(".productSelect").forEach(select => {
        select.addEventListener("change", e => {
            let productId = Number(e.target.value);
            let fila = e.target.closest(".product-line");
            let inputPreu = fila.querySelector("[name='price[]']");
            let inputDescompte = fila.querySelector("[name='discount[]']");

            // Si no hi ha producte seleccionat, buidem preu i descompte
            if (!productId) {
                inputPreu.value = "";
                inputDescompte.value = "0";
                return;
            }

            // Busquem el producte seleccionat i assignem preu i descompte per defecte
            let producte = Product.find(p => p.id === productId);
            if (producte) {
                inputPreu.value = producte.price.toFixed(2);
                inputDescompte.value = (producte.discount || 0).toFixed(2);
            }
        });
    });
}

//-----------------------------------------------------------------------------------------
// VALIDACIÓ DE PAGAMENT, ENVIAMENT, CLIENT I PRODUCTES
//-----------------------------------------------------------------------------------------

function validarPagament() {
  const element = document.getElementById("payment");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(element, "Has de seleccionar una forma de pagament");
    }
    return false;
  }
  return true;
}

function validarEnviament() {
  const element = document.getElementById("shipping");

  if (!element.checkValidity() || element.value < 0) {
    if (element.validity.valueMissing) {
      error(element, "Has d'introduïr les despeses d’enviament");
    } else if (element.value < 0) {
      error(element, "Les despeses d’enviament no poden ser negatives");
    }
    return false;
  }
  return true;
}

function validarClient() {
  const element = document.getElementById("client");

  if (!element.checkValidity() || !element.value) {
    if (element.validity.valueMissing || !element.value) {
      error(element, "Has de seleccionar un client");
    }
    return false;
  }
  return true;
}

function validarProductes() {
  const element = document.getElementById("productes");
  const llista = JSON.parse(localStorage.getItem("productesActuals")) || [];

  if (llista.length === 0) {
    error(element, "Has d’afegir almenys un producte");
    return false;
  }
  return true;
}

//-----------------------------------------------------------------------------------------
// FUNCIÓ PRINCIPAL VALIDAR FORMULARI
//-----------------------------------------------------------------------------------------

function validarFormulari(e) {
  esborrarError();

  if (
    validarPagament() &&
    validarEnviament() &&
    validarClient() &&
    validarProductes() &&
    confirm("Confirma si vols enviar el formulari")
  ) {
    enviarFormulari();
    return true;
  } else {
    e.preventDefault();
    return false;
  }
}


//  ERROR HANDLERS 
function errorMissatge(msg) {
    let cont = document.getElementById("missatgeError");
    let p = document.createElement("p");
    p.style.color = "red";
    p.appendChild(document.createTextNode(msg));
    cont.appendChild(p);
}

function esborrarError() {
    document.getElementById("missatgeError").replaceChildren();
}

//  AFEGIR PRODUCTE 
function afegirProducte(e) {
    esborrarError();
    let fila = e.target.closest(".product-line");
    let quant = fila.querySelector("[name='quantity[]']");
    let preu = fila.querySelector("[name='price[]']");
    let productSelect = fila.querySelector("[name='product_id[]']");
    let descompte = fila.querySelector("[name='discount[]']");

    // Validació de dades obligatòries
    if (!productSelect.value || !quant.value || quant.value <= 0 || !preu.value || preu.value < 0) {
        errorMissatge("Introdueix correctament el producte, quantitat i preu."); 
        return;
    }

    // Creem l'objecte del producte
    let nou = {
        producte: productSelect.value,
        quantitat: +quant.value,
        preu: +preu.value,
        descompte: +descompte.value
    };

    // Guardem a localStorage
    let llista = JSON.parse(localStorage.getItem("productesActuals")) || [];
    llista.push(nou);
    localStorage.setItem("productesActuals", JSON.stringify(llista));

    // Mostrem taula actualitzada
    mostrarProductes(llista);

    // Neteja inputs per afegir un altre producte
    quant.value = "1";
    preu.value = "";
    descompte.value = "0";
    productSelect.value = "";
}

//  MOSTRAR PRODUCTES 
function mostrarProductes(productes) {
    let cont = document.getElementById("productesAfegits");
    cont.replaceChildren(); // Neteja prèvia
    if (!productes || productes.length === 0) return;

    let h4 = document.createElement("h4");
    h4.appendChild(document.createTextNode("Productes afegits"));
    cont.appendChild(h4);

    let taula = document.createElement("table");
    taula.border = "1";
    taula.cellPadding = "4";
    taula.cellSpacing = "0";

    // Capçalera de la taula
    let caps = ["#", "Producte", "Quantitat", "Preu", "Descompte", "Acció"];
    let trCap = document.createElement("tr");
    caps.forEach(t => { 
        let th = document.createElement("th"); 
        th.appendChild(document.createTextNode(t)); 
        trCap.appendChild(th); 
    });
    taula.appendChild(trCap);

    let total = 0;

    // Afegim files amb productes
    productes.forEach((p, i) => {
        let tr = document.createElement("tr");
        let prodObj = Product.find(x => x.id == p.producte);
        let nomProducte = prodObj ? prodObj.name : "Desconegut";

        [i+1, nomProducte, p.quantitat, p.preu.toFixed(2), p.descompte.toFixed(2)]
            .forEach(v => { const td = document.createElement("td"); td.appendChild(document.createTextNode(v)); tr.appendChild(td); });

        // Botó eliminar
        let tdAccio = document.createElement("td");
        let btn = document.createElement("button");
        btn.appendChild(document.createTextNode("Eliminar"));
        btn.addEventListener("click", () => eliminarProducte(i));
        tdAccio.appendChild(btn);
        tr.appendChild(tdAccio);

        total += p.quantitat * p.preu * (1 - p.descompte / 100);
        taula.appendChild(tr);
    });

    // Fila preu total
    let trTotal = document.createElement("tr");
    let tdTotal = document.createElement("td");
    tdTotal.colSpan = 5;
    tdTotal.style.textAlign = "right";
    tdTotal.appendChild(document.createTextNode("Total:"));
    trTotal.appendChild(tdTotal);

    let tdValor = document.createElement("td");
    tdValor.appendChild(document.createTextNode(total.toFixed(2) + " €"));
    trTotal.appendChild(tdValor);

    taula.appendChild(trTotal);
    cont.appendChild(taula);
}

//  ELIMINAR PRODUCTE 
function eliminarProducte(index) {
    let llista = JSON.parse(localStorage.getItem("productesActuals")) || [];
    llista.splice(index, 1);
    localStorage.setItem("productesActuals", JSON.stringify(llista));
    mostrarProductes(llista);
}

//  ENVIAR FORMULARI 
function enviarFormulari() {
    let clientSelect = document.getElementById("client");
    let clientNom = clientSelect.options[clientSelect.selectedIndex].text;

    let productesGuardats = JSON.parse(localStorage.getItem("productesActuals")) || [];
    if (productesGuardats.length === 0) { errorMissatge("No hi ha productes a enviar."); return; }

    // Convertim data a format correcte
    let dataRaw = document.getElementById("date").value;
    let dataFormatada = dataRaw.replace("T", " ");

    // Creem objecte de comanda
    let comanda = {
        id: Date.now(),
        data: dataFormatada,
        pagament: document.getElementById("payment").value,
        enviament: +document.getElementById("shipping").value,
        client: clientNom,
        productes: productesGuardats
    };

    // Guardem al localStorage
    let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
    comandes.push(comanda);
    localStorage.setItem("comandes", JSON.stringify(comandes));
    localStorage.removeItem("productesActuals");

    // Neteja formulari i taula de productes
    document.forms[0].reset();
    document.getElementById("productesAfegits").replaceChildren();

    // Mostrem missatge d'èxit
    let msg = document.createElement("p");
    msg.style.color = "green";
    msg.appendChild(document.createTextNode("Comanda guardada correctament."));
    document.getElementById("missatgeError").appendChild(msg);
}
