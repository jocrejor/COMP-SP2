// visualitzaComanda.js

document.addEventListener("DOMContentLoaded", () => {
  const detalle = document.getElementById("detallePedido");
  const index = localStorage.getItem("pedidoVisualizar");
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  if (index === null || !pedidos[index]) {
    detalle.innerHTML = "<p>No s'ha trobat la comanda seleccionada.</p>";
    return;
  }

  const p = pedidos[index];
  let html = "";
  html += `<h3>Informació de la Comanda</h3>`;
  html += `<table border="1" cellpadding="4" cellspacing="0">
    <tr><td><b>ID</b></td><td>${p.id}</td></tr>
    <tr><td><b>Data</b></td><td>${p.date}</td></tr>
    <tr><td><b>Client</b></td><td>${p.client}</td></tr>
    <tr><td><b>Forma de pagament</b></td><td>${p.payment}</td></tr>
    <tr><td><b>Despeses d'enviament</b></td><td>${(+p.shipping).toFixed(2)} €</td></tr>
    <tr><td><b>Total</b></td><td><b>${(+p.total).toFixed(2)} €</b></td></tr>
  </table>`;
  html += `<hr size="1" noshade>`;
  html += `<h3>Productes</h3>`;
  html += `<table border="1" cellpadding="4" cellspacing="0">
    <tr>
      <th>#</th>
      <th>Producte</th>
      <th>Quantitat</th>
      <th>Preu</th>
      <th>Descompte</th>
      <th>Subtotal</th>
    </tr>`;
  p.products.forEach((prod, i) => {
    html += `<tr>
      <td>${i + 1}</td>
      <td>Producte ${prod.product_id}</td>
      <td>${prod.quantity}</td>
      <td>${(+prod.price).toFixed(2)} €</td>
      <td>${(+prod.discount).toFixed(2)} €</td>
      <td>${((prod.quantity * prod.price) - prod.discount).toFixed(2)} €</td>
    </tr>`;
  });
  html += `</table>`;
  detalle.innerHTML = html;
});
    
        // Botó "Nova Comanda"
        let boto = document.getElementById("tornar");
        boto.addEventListener("click", function() {
          window.location.href = "comandesLlistar.html";
        });
    
