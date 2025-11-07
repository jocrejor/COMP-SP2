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
  document.getElementById("productsTable").addEventListener("click", function (e) {
    if (e.target.classList.contains("addProduct")) afegirProducte(e);
  });
  // Carrega automàticament clients i productes
  carregarClients();
  carregarProductes();
  configurarAutoPreu();
  configurarCalculPreuFinal();

}

//  CARREGAR CLIENTS I PRODUCTES 
function carregarClients() {
  let select = document.getElementById("client");
  select.replaceChildren(); // Elimina totes les opcions anteriors del <select>
  select.appendChild(new Option("Selecciona un client...", ""));
  // forEach() recorre tot l’array Client i executa la funció per cada element
  // new Option(text, value) crea una nova etiqueta <option>
  // appendChild() afegeix aquesta opció dins de l’element <select>
  Client.forEach(c => select.appendChild(new Option(`${c.name} ${c.surname}`, c.id)));
}

function carregarProductes() {
  // querySelectorAll() agafa tots els elements amb la classe .productSelect
  document.querySelectorAll(".productSelect").forEach(select => {
    select.replaceChildren();
    select.appendChild(new Option("Selecciona un producte...", ""));
    // forEach() recorre l’array Product i crea una opció per a cada producte
    Product.forEach(p => select.appendChild(new Option(p.name, p.id)));
  });
}

//  CONFIGURAR AUTO-CÀLCUL DE PREU FINAL 
function configurarCalculPreuFinal() {
  document.querySelectorAll(".product-line").forEach(fila => {
    let quant = fila.querySelector("[name='quantity[]']");
    let preu = fila.querySelector("[name='price[]']");
    let descompte = fila.querySelector("[name='discount[]']");
    let finalPrice = fila.querySelector("[name='finalPrice[]']");

    function recalcular() {
      // parseFloat() converteix text (com "12.5") a número decimal 12.5

      let q = parseFloat(quant.value) || 0;
      let p = parseFloat(preu.value) || 0;
      let d = parseFloat(descompte.value) || 0;
      let total = q * p * (1 - d / 100);
      finalPrice.value = total.toFixed(2);       // toFixed(2) limita el resultat a dos decimals (ex: 12.345 → 12.35)
    }
    // Quan es canvia qualsevol dels tres valors, recalcula
    // addEventListener() escolta canvis a cada input i crida "recalcular"
    [quant, preu, descompte].forEach(input => {
      input.addEventListener("input", recalcular);
    });
  });
}
// CONFIGURAR AUTO-PREU AUTOMÀTIC SEGONS PRODUCTE
function configurarAutoPreu() {
  document.querySelectorAll(".productSelect").forEach(select => {
    select.addEventListener("change", function () {
      let id = this.value;
      let fila = this.closest(".product-line");
      let preuInput = fila.querySelector("[name='price[]']");
      let descInput = fila.querySelector("[name='discount[]']");
      let finalInput = fila.querySelector("[name='finalPrice[]']");
      let quantInput = fila.querySelector("[name='quantity[]']");

      if (!id) {
        preuInput.value = "";
        descInput.value = "";
        finalInput.value = "";
        return;
      }

      //  Busquem el producte dins de la taula Product
      // find() busca dins l’array Product l’objecte amb un id concret

      let prod = Product.find(p => p.id == id);
      if (!prod) return;

      let preu = prod.price;

      // Cerquem tots els descomptes que s’han aplicat a aquest producte a la BBDD (Orderdetail)
      // filter() selecciona només els elements que compleixen una condició
      // map() transforma l’array, extraient només el camp “discount”
      // filter(d > 0) elimina els descomptes que siguin 0
      let descomptes = Orderdetail
        .filter(o => o.product_id === Number(id))
        .map(o => o.discount)
        .filter(d => d > 0);


      // Escollim el descompte que volem aplicar
      // (pots canviar Math.max per Math.min o per la mitjana)
      let descompte = 0;
      if (descomptes.length > 0) {
        // Math.max() agafa el valor màxim d’un conjunt de nombres
        descompte = Math.max(...descomptes); // descompte més alt aplicat
      }

      //  Assignem preu i descompte automàticament
      preuInput.value = preu.toFixed(2);
      descInput.value = descompte.toFixed(2);

      //  Calculem el preu final segons la quantitat
      let quant = parseFloat(quantInput.value) || 1;
      let preuFinal = preu * quant * (1 - descompte / 100);
      finalInput.value = preuFinal.toFixed(2);
    });
  });
}

// VALIDACIÓ DE PAGAMENT, ENVIAMENT, CLIENT I PRODUCTES
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

// FUNCIÓ PRINCIPAL VALIDAR FORMULARI

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
  let finalPrice = fila.querySelector("[name='finalPrice[]']");

  // Validació de dades
  if (!productSelect.value || !quant.value || quant.value <= 0 || !preu.value || preu.value < 0) {
    errorMissatge("Introdueix correctament el producte, quantitat i preu.");
    return;
  }

  // Calcular preu final
  const preuFinal = (+quant.value) * (+preu.value) * (1 - (+descompte.value) / 100);
  finalPrice.value = preuFinal.toFixed(2);

  // Objecte producte
  let nou = {
    producte: productSelect.value,
    quantitat: +quant.value,
    preu: +preu.value,
    descompte: +descompte.value,
    preuFinal: preuFinal
  };

  // Guardar a localStorage
  let llista = JSON.parse(localStorage.getItem("productesActuals")) || [];
  llista.push(nou);
  localStorage.setItem("productesActuals", JSON.stringify(llista));

  // Mostrar taula actualitzada
  mostrarProductes(llista);

  // Netejar inputs
  quant.value = "1";
  preu.value = "";
  descompte.value = "0";
  finalPrice.value = "";
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
  let caps = ["#", "Producte", "Quantitat", "Preu", "Descompte", "Preu Final", "Acció"];
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

    [i + 1, nomProducte, p.quantitat, p.preu.toFixed(2), p.descompte.toFixed(2), p.preuFinal.toFixed(2)]
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
