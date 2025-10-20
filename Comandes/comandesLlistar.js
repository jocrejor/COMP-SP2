function mostrarPedidos() {
  let container = document.getElementById("listaPedidos");
  container.innerHTML = ""; 

  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  if (pedidos.length === 0) {
    container.innerHTML = "<p>No hi ha comandes registrades.</p>";
    return;
  }

  let aux = `<table border="1" cellpadding="5" cellspacing="0">
    <tr>
      <th>ID</th>
      <th>Data</th>
      <th>Client</th>
      <th>Forma de pagament</th>
      <th>Enviament (€)</th>
      <th>Total (€)</th>
      <th>Productes</th>
      <th>Accions</th>
    </tr>`;

  pedidos.forEach((p, index) => {
    // Verificar que el pedido tenga la estructura correcta
    if (!p || !Array.isArray(p.products)) {
      console.warn(`Pedido en índice ${index} tiene estructura inválida:`, p);
      return; // Saltar este pedido
    }

    aux += `<tr>
      <td>${p.id || 'N/A'}</td>
      <td>${p.date || 'N/A'}</td>
      <td>${p.client || 'N/A'}</td>
      <td>${p.payment || 'N/A'}</td>
      <td>${(+p.shipping || 0).toFixed(2)}</td>
      <td><b>${(+p.total || 0).toFixed(2)}</b></td>
      <td>
        <table border="1" cellpadding="2" cellspacing="0">
          <tr><th>Prod.</th><th>Quant.</th><th>Preu</th><th>Descompte</th></tr>
          ${p.products.map(prod => `
            <tr>
              <td>${prod.product_id || 'N/A'}</td>
              <td>${prod.quantity || 0}</td>
              <td>${(prod.price || 0).toFixed(2)}€</td>
              <td>${(prod.discount || 0).toFixed(2)}€</td>
            </tr>
          `).join("")}
        </table>
      </td>
      <td align="center">
        <button onclick="visualizarPedido(${index})">Visualitzar</button>
        &nbsp;&nbsp;
        <button onclick="modificarPedido(${index})">Modificar</button>
        &nbsp;&nbsp;
        <button onclick="eliminarPedido(${index})">Eliminar</button>
      </td>
    </tr>`;
  });

  aux += "</table>";
  container.innerHTML = aux;
}


function visualizarPedido(index) {
  localStorage.setItem("pedidoVisualizar", index);
  window.location.href = "visualitzaComanda.html";
}

function modificarPedido(index) {
  localStorage.setItem("pedidoEditar", index);
  window.location.href = "modificaComanda.html";
}

// Quan el DOM estigui carregat
      document.addEventListener("DOMContentLoaded", function() {
        mostrarPedidos();

        // Botó "Nova Comanda"
        let boto = document.getElementById("afegirPedido");
        boto.addEventListener("click", function() {
          window.location.href = "altaComanda.html";
        });
      });
      
document.addEventListener("DOMContentLoaded", mostrarPedidos);
