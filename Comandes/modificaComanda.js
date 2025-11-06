document.addEventListener("DOMContentLoaded", main);

function main() {
  // Recuperar índex de la comanda a editar
  let index = localStorage.getItem("comandaEditar");
  if (index === null) {
    alert("No s'ha seleccionat cap comanda per modificar.");
    window.location.href = "comandesLlistar.html";
    return;
  }

  // Carregar totes les comandes
  let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
  let comanda = comandes[index];
  if (!comanda) {
    alert("Comanda no trobada.");
    window.location.href = "comandesLlistar.html";
    return;
  }

  // Carregar dades generals
  document.getElementById("date").value = (comanda.data || "").substring(0, 10);
  document.getElementById("payment").value = comanda.pagament || "";
  document.getElementById("shipping").value = comanda.enviament || 0;

  // Client
  let clientSelect = document.getElementById("client");
  while (clientSelect.firstChild) clientSelect.removeChild(clientSelect.firstChild);
  let op = document.createElement("option");
  op.value = comanda.client;
  op.selected = true;
  let txt = document.createTextNode(comanda.client);
  op.appendChild(txt);
  clientSelect.appendChild(op);

  // Productes disponibles
  let products = typeof Product !== "undefined" ? Product : [];
  let tableBody = document.querySelector("#productsTable tbody");

  // -------------------------------
  // Funcions auxiliars
  // -------------------------------

  function omplirSelect(select, selectedId) {
    while (select.firstChild) select.removeChild(select.firstChild);
    let op0 = document.createElement("option");
    op0.value = "";
    op0.appendChild(document.createTextNode("Selecciona producte..."));
    select.appendChild(op0);

    for (let i = 0; i < products.length; i++) {
      let p = products[i];
      let op = document.createElement("option");
      op.value = p.id;
      if (Number(p.id) === Number(selectedId)) op.selected = true;
      let t = document.createTextNode(p.name);
      op.appendChild(t);
      select.appendChild(op);
    }
  }

  function crearFilaProducte(p) {
    let tr = document.createElement("tr");
    tr.className = "product-line";

    // PRODUCTE
    let tdProd = document.createElement("td");
    let select = document.createElement("select");
    select.name = "product_id[]";
    select.required = true;

    let producteId = null;
    if (p && !isNaN(p.producte)) producteId = parseInt(p.producte);
    else if (p) {
      for (let j = 0; j < products.length; j++) {
        if (products[j].name.toLowerCase() === (p.producte || "").toLowerCase()) {
          producteId = products[j].id;
          break;
        }
      }
    }

    omplirSelect(select, producteId);
    tdProd.appendChild(select);
    tr.appendChild(tdProd);

    // QUANTITAT
    let tdQuant = document.createElement("td");
    let inputQuant = document.createElement("input");
    inputQuant.type = "number";
    inputQuant.name = "quantity[]";
    inputQuant.min = 1;
    inputQuant.required = true;
    inputQuant.value = (p && p.quantitat) ? p.quantitat : 1;
    tdQuant.appendChild(inputQuant);
    tr.appendChild(tdQuant);

    // PREU
    let tdPreu = document.createElement("td");
    let inputPreu = document.createElement("input");
    inputPreu.type = "number";
    inputPreu.step = "0.01";
    inputPreu.name = "price[]";
    inputPreu.min = 0;
    inputPreu.required = true;
    inputPreu.value = (p && p.preu) ? p.preu.toFixed(2) : 0;
    tdPreu.appendChild(inputPreu);
    tr.appendChild(tdPreu);

    // DESCOMPTE
    let tdDesc = document.createElement("td");
    let inputDesc = document.createElement("input");
    inputDesc.type = "number";
    inputDesc.step = "0.01";
    inputDesc.name = "discount[]";
    inputDesc.min = 0;
    inputDesc.readOnly = true;
    inputDesc.value = (p && p.descompte) ? p.descompte.toFixed(2) : 0;
    tdDesc.appendChild(inputDesc);
    tr.appendChild(tdDesc);

    // ACCIÓ (Eliminar)
    let tdAccio = document.createElement("td");
    let btn = document.createElement("button");
    btn.type = "button";
    let txtBtn = document.createTextNode("Eliminar");
    btn.appendChild(txtBtn);
    btn.addEventListener("click", function () {
      tr.parentNode.removeChild(tr);
    });
    tdAccio.appendChild(btn);
    tr.appendChild(tdAccio);

    // Quan es canvia el producte, s'actualitza el preu i descompte automàticament
    select.addEventListener("change", function () {
      let id = parseInt(select.value);
      let prod = null;
      let desc = 0;

      for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
          prod = products[i];
          break;
        }
      }

      for (let k = 0; k < Orderdetail.length; k++) {
        if (Orderdetail[k].product_id === id) {
          desc = Orderdetail[k].discount;
          break;
        }
      }

      if (prod) inputPreu.value = prod.price.toFixed(2);
      inputDesc.value = desc.toFixed(2);
    });

    tableBody.appendChild(tr);
  }

  // -------------------------------
  // Carregar productes existents
  // -------------------------------
  let llista = comanda.productes || [];
  for (let i = 0; i < llista.length; i++) {
    crearFilaProducte(llista[i]);
  }

  // -------------------------------
  // Afegir nou producte
  // -------------------------------
  let btnAfegir = document.getElementById("afegirProducte");
  btnAfegir.addEventListener("click", function (e) {
    e.preventDefault();
    crearFilaProducte({});
  });

  // -------------------------------
  // Guardar modificacions
  // -------------------------------
  let form = document.getElementById("pedidoForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let nousProductes = [];
    let files = document.querySelectorAll(".product-line");

    for (let i = 0; i < files.length; i++) {
      let tr = files[i];
      let prodSelect = tr.querySelector("[name='product_id[]']");
      let quant = parseFloat(tr.querySelector("[name='quantity[]']").value) || 0;
      let preu = parseFloat(tr.querySelector("[name='price[]']").value) || 0;
      let desc = parseFloat(tr.querySelector("[name='discount[]']").value) || 0;

      if (!prodSelect.value) continue;

      // Quan prepares el nou producte per guardar
      nousProductes.push({
        producte: prodSelect.value,    // l'id del producte
        quantitat: quant,              // quantitat introduïda
        preu: preu,                    // preu unitari
        descompte: desc,               // descompte en %
        preuFinal: quant * preu * (1 - desc / 100) // preu total del producte
      });

    }

    comanda.productes = nousProductes;
    comandes[index] = comanda;
    localStorage.setItem("comandes", JSON.stringify(comandes));

    // Eliminar bandera d’edició i redirigir
    localStorage.removeItem("comandaEditar");
    alert("Comanda actualitzada correctament!");

    //  Redirigeix i força refresc de la pàgina llistar
    window.location.replace("comandesLlistar.html");
  });

  // -------------------------------
  // Botó tornar
  // -------------------------------
  let tornarBtn = document.getElementById("tornar");
  tornarBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("comandaEditar");
    window.location.replace("comandesLlistar.html");
  });
}
