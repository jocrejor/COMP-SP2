// Funció per mostrar totes les comandes guardades al localStorage
function mostrarPedidos() {

  //Mostrarà la taula
  let container = document.getElementById("listaPedidos");
  container.innerHTML = ""; // Netejar el contingut anterior

  // Recuperem les comandes en localStorage
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  // Si no hi ha cap comanda, mostrem un missatge
  if (pedidos.length === 0) {
    container.innerHTML = "<p>No hi ha comandes registrades.</p>";
    return;
  }

  //  Creem la taula principal amb innerHTML 
  let html = `
    <table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>ID</th>
        <th>Data</th>
        <th>Client</th>
        <th>Forma de pagament</th>
        <th>Enviament (€)</th>
        <th>Total (€)</th>
        <th>Productes</th>
        <th>Accions</th>
      </tr>
  `;

  // Totes les comandes per afegir-les a la taula
  pedidos.forEach((p, index) => {
    html += `
      <tr>
        <td>${p.id || 'N/A'}</td>
        <td>${p.date || 'N/A'}</td>
        <td>${p.client || 'N/A'}</td>
        <td>${p.payment || 'N/A'}</td>
        <td>${(+p.shipping || 0).toFixed(2)}</td>
        <td><b>${(+p.total || 0).toFixed(2)}</b></td>
        <td>
          <table border="1" cellpadding="2" cellspacing="0">
            <tr><th>Prod.</th><th>Quant.</th><th>Preu</th><th>Descompte</th></tr>
            ${
              //Subtaula amb tots els productes de la comanda
              (p.products || []).map(prod => `
                <tr>
                  <td>${prod.product_id || 'N/A'}</td>
                  <td>${prod.quantity || 0}</td>
                  <td>${(prod.price || 0).toFixed(2)}€</td>
                  <td>${(prod.discount || 0).toFixed(2)}€</td>
                </tr>
              `).join("")
            }
          </table>
        </td>
        <td align="center">
          <!-- Botons d'acció per visualitzar, modificar o eliminar -->
          <button onclick="visualitzarPedido(${index})">Visualitzar</button>
          &nbsp;
          <button onclick="modificarPedido(${index})">Modificar</button>
          &nbsp;
          <button onclick="eliminarPedido(${index})">Eliminar</button>
        </td>
      </tr>
    `;
  });

  html += "</table>";

  container.innerHTML = html;
}


// Obrir per a visualitzar una comanda
function visualitzarPedido(index) {
  localStorage.setItem("pedidoVisualizar", index);
  window.location.href = "visualitzaComanda.html";
}

// Obrir per a modificar una comanda
function modificarPedido(index) {
  localStorage.setItem("pedidoEditar", index);
  window.location.href = "modificaComanda.html";
}

// Eliminar una comanda i actualitzar 
function eliminarPedido(index) {
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.splice(index, 1); 
  localStorage.setItem("pedidos", JSON.stringify(pedidos));
  //Taula actualitzada
  mostrarPedidos(); 
}

document.addEventListener("DOMContentLoaded", () => {
  // Mostrar la llista de comandes
  mostrarPedidos();

  // Configurar el botó per crear una nova comanda
  let botoAfegir = document.getElementById("afegirPedido");
  botoAfegir.addEventListener("click", () => {
    window.location.href = "altaComanda.html";
  });
});
