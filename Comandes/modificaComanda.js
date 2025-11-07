//  Quan el document HTML ha carregat completament
document.addEventListener("DOMContentLoaded", main);

//  FUNCIÓ PRINCIPAL (main)
// S’executa quan la pàgina està llesta
function main() {

  //  Recuperem l’índex de la comanda que volem editar des del localStorage
  let index = localStorage.getItem("comandaEditar");

  // Si no hi ha cap índex, significa que l’usuari ha arribat ací per error
  if (index === null) {
    alert("No s'ha seleccionat cap comanda per modificar.");
    window.location.href = "comandesLlistar.html"; // Tornem a la llista de comandes
    return;
  }

  //  Carreguem totes les comandes desades al localStorage
  let comandes = JSON.parse(localStorage.getItem("comandes")) || [];

  // Obtenim la comanda específica a editar
  let comanda = comandes[index];

  // Si no trobem la comanda (potser s’ha esborrat), informem i redirigim
  if (!comanda) {
    alert("Comanda no trobada.");
    window.location.href = "comandesLlistar.html";
    return;
  }

  //  Variables globals segures per accedir a Product i Orderdetail
  // Si existeixen les variables globals del sistema, les usem.
  // Si no, deixem un array buit per evitar errors.
  let products = typeof Product !== "undefined" ? Product : [];
  let orderdetail = typeof Orderdetail !== "undefined" ? Orderdetail : [];

  // Mostrem informació a la consola per depurar (opcional)
  console.log("Productes disponibles:", products);
  console.log("Comanda actual:", comanda);

  //  Carregar dades generals de la comanda en el formulari
  document.getElementById("date").value = (comanda.data || "").substring(0, 10);
  document.getElementById("payment").value = comanda.pagament || "";
  document.getElementById("shipping").value = comanda.enviament || 0;

  //  Carregar el client associat a la comanda
  let clientSelect = document.getElementById("client");

  // Primer, buidem les opcions existents
  while (clientSelect.firstChild) clientSelect.removeChild(clientSelect.firstChild);

  // Afegim una opció seleccionada amb el nom del client actual
  let op = document.createElement("option");
  op.value = comanda.client;
  op.selected = true;
  op.textContent = comanda.client;
  clientSelect.appendChild(op);

  //  Referència al <tbody> de la taula de productes
  let tableBody = document.querySelector("#productsTable tbody");
  if (!tableBody) {
    console.error("No s'ha trobat el tbody de #productsTable");
    return;
  }

  //  FUNCIONS AUXILIARS

  //  Omplir el <select> amb tots els productes disponibles
  function omplirSelect(select, selectedId) {
    // Buidem el select abans d’afegir opcions
    while (select.firstChild) select.removeChild(select.firstChild);

    // Primera opció per defecte
    let op0 = document.createElement("option");
    op0.value = "";
    op0.textContent = "Selecciona producte...";
    select.appendChild(op0);

    // Recorrem tots els productes i els afegim com a opcions
    for (let i = 0; i < products.length; i++) {
      let p = products[i];
      let op = document.createElement("option");
      op.value = p.id;
      op.textContent = p.name;
      // Si coincideix amb el producte seleccionat, el marquem com a “selected”
      if (Number(p.id) === Number(selectedId)) op.selected = true;
      select.appendChild(op);
    }
  }
  //  Crear una nova fila de producte a la taula
  function crearFilaProducte(p) {
    // Creem la fila (<tr>) i assignem una classe per identificar-la
    let tr = document.createElement("tr");
    tr.className = "product-line";

    //  1. PRODUCTE (select)
    let tdProd = document.createElement("td");
    let select = document.createElement("select");
    select.name = "product_id[]";
    select.required = true;

    // Determinem quin producte ha de quedar seleccionat
    let producteId = null;
    if (p && !isNaN(p.producte)) {
      producteId = parseInt(p.producte);
    } else if (p && p.producte) {
      // Busquem per nom si només tenim el text
      let trobat = products.find(prod => prod.name.toLowerCase() === p.producte.toLowerCase());
      if (trobat) producteId = trobat.id;
    }

    // Omplim el desplegable amb tots els productes
    omplirSelect(select, producteId);
    tdProd.appendChild(select);
    tr.appendChild(tdProd);

    //  2. QUANTITAT
    let tdQuant = document.createElement("td");
    let inputQuant = document.createElement("input");
    inputQuant.type = "number";
    inputQuant.name = "quantity[]";
    inputQuant.min = 1;
    inputQuant.required = true;
    inputQuant.value = (p && p.quantitat) ? p.quantitat : 1;
    tdQuant.appendChild(inputQuant);
    tr.appendChild(tdQuant);

    //  3. PREU
    let tdPreu = document.createElement("td");
    let inputPreu = document.createElement("input");
    inputPreu.type = "number";
    inputPreu.step = "0.01";
    inputPreu.name = "price[]";
    inputPreu.min = 0;
    inputPreu.required = true;
    inputPreu.value = (p && p.preu) ? Number(p.preu).toFixed(2) : 0;
    tdPreu.appendChild(inputPreu);
    tr.appendChild(tdPreu);

    //  4. DESCOMPTE
    let tdDesc = document.createElement("td");
    let inputDesc = document.createElement("input");
    inputDesc.type = "number";
    inputDesc.step = "0.01";
    inputDesc.name = "discount[]";
    inputDesc.min = 0;
    inputDesc.readOnly = true; // No editable per l’usuari
    inputDesc.value = (p && p.descompte) ? Number(p.descompte).toFixed(2) : 0;
    tdDesc.appendChild(inputDesc);
    tr.appendChild(tdDesc);

    //  5. ACCIÓ (Eliminar fila)
    let tdAccio = document.createElement("td");
    let btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Eliminar";
    // Si l’usuari prem el botó, s’elimina la fila completa
    btn.addEventListener("click", () => tr.remove());
    tdAccio.appendChild(btn);
    tr.appendChild(tdAccio);

    //  Quan es canvia el producte seleccionat
    // S’actualitzen automàticament el preu i el descompte
    select.addEventListener("change", function () {
      let id = parseInt(select.value);
      let prod = products.find(pr => pr.id === id);
      let detall = orderdetail.find(od => od.product_id === id);
      let desc = detall ? detall.discount : 0;

      if (prod) inputPreu.value = prod.price.toFixed(2);
      inputDesc.value = desc.toFixed(2);
    });

    // Finalment, afegim la fila al cos de la taula
    tableBody.appendChild(tr);
  }

  //  Carregar els productes existents de la comanda
  let llista = comanda.productes || [];
  console.log("Productes de la comanda:", llista);

  // Si la comanda no té productes, creem una fila buida
  if (llista.length === 0) {
    crearFilaProducte({});
  } else {
    // Si hi ha productes, creem una fila per a cadascun
    for (let i = 0; i < llista.length; i++) crearFilaProducte(llista[i]);
  }

  //  Botó “Afegir nou producte”
  let btnAfegir = document.getElementById("afegirProducte");
  if (btnAfegir) {
    btnAfegir.addEventListener("click", function (e) {
      e.preventDefault(); // Evita enviar el formulari accidentalment
      crearFilaProducte({}); // Afig una nova línia buida
    });
  }

  //  Guardar modificacions de la comanda
  let form = document.getElementById("pedidoForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita el refresc automàtic del formulari

    // Array on guardarem els nous productes actualitzats
    let nousProductes = [];

    // Seleccionem totes les files de productes
    let files = document.querySelectorAll(".product-line");

    // Recorrem cada fila per extreure la informació
    for (let tr of files) {
      let prodSelect = tr.querySelector("[name='product_id[]']");
      let quant = parseFloat(tr.querySelector("[name='quantity[]']").value) || 0;
      let preu = parseFloat(tr.querySelector("[name='price[]']").value) || 0;
      let desc = parseFloat(tr.querySelector("[name='discount[]']").value) || 0;

      // Si no s’ha seleccionat producte, saltem la fila
      if (!prodSelect.value) continue;

      // Afegim el producte a l’array amb càlcul del preu final
      nousProductes.push({
        producte: prodSelect.value,
        quantitat: quant,
        preu: preu,
        descompte: desc,
        preuFinal: quant * preu * (1 - desc / 100)
      });
    }

    // Actualitzem la comanda amb els nous productes
    comanda.productes = nousProductes;

    // Guardem la comanda modificada dins de l’array complet
    comandes[index] = comanda;

    // Tornem a guardar totes les comandes al localStorage
    localStorage.setItem("comandes", JSON.stringify(comandes));

    // Eliminem la clau temporal “comandaEditar”
    localStorage.removeItem("comandaEditar");

    // Missatge de confirmació
    alert("Comanda actualitzada correctament!");

    // Tornem a la pàgina principal de llistat
    window.location.replace("comandesLlistar.html");
  });

  //  Botó “Tornar” (sense guardar)
  let tornarBtn = document.getElementById("tornar");
  tornarBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("comandaEditar"); // Eliminem referència
    window.location.replace("comandesLlistar.html"); // Tornem a la llista
  });
}
