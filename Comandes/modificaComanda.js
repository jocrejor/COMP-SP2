document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");

  // Recuperar lista de pedidos y el índice del que vamos a modificar
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  const index = localStorage.getItem("pedidoEditar");

  if (index === null) {
    alert("No se seleccionó ningún pedido para modificar");
    window.location.href = "comandesLlistar.html";
    return;
  }

  const pedido = pedidos[index];

  // Rellenar datos en el formulario
  document.getElementById("date").value = pedido.date;
  document.getElementById("client").value = pedido.client;
  document.getElementById("payment").value = pedido.payment;
  document.getElementById("shipping").value = pedido.shipping;

  // Rellenar productos en formato tabla
  const container = document.getElementById("productosContainer");
  let aux = "";
  pedido.products.forEach((prod) => {
    aux += `
      <tr class="product-line">
        <td>
          <select name="product_id[]">
            <option value="1" ${prod.product_id == 1 ? "selected" : ""}>Producto 1</option>
            <option value="2" ${prod.product_id == 2 ? "selected" : ""}>Producto 2</option>
          </select>
        </td>
        <td><input type="number" name="quantity[]" value="${prod.quantity}" required></td>
        <td><input type="number" name="price[]" step="0.01" value="${prod.price}" required></td>
        <td><input type="number" name="discount[]" step="0.01" value="${prod.discount}" required></td>
      </tr>
    `;
  });
  container.innerHTML = aux;

  // Evento de envío del formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // evitar envío real

    // Obtener datos del pedido
    const date = document.getElementById("date").value;
    const payment = document.getElementById("payment").value;
    const shipping = parseFloat(document.getElementById("shipping").value);
    const client = document.getElementById("client").value;

    // Obtener productos
    const products = [];
    document.querySelectorAll(".product-line").forEach((line) => {
      const product_id = line.querySelector("select[name='product_id[]']").value;
      const quantity = parseInt(line.querySelector("input[name='quantity[]']").value);
      const price = parseFloat(line.querySelector("input[name='price[]']").value);
      const discount = parseFloat(line.querySelector("input[name='discount[]']").value);

      products.push({ product_id, quantity, price, discount });
    });

    // Calcular total
    let total = 0;
    products.forEach(p => {
      total += (p.quantity * p.price) - p.discount;
    });
    total += shipping;

    // Actualizar pedido
    pedidos[index] = {
      ...pedido, // mantenemos el mismo id
      date,
      payment,
      shipping,
      client,
      total,
      products
    };

    // Guardar en localStorage
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    alert("Pedido modificado con éxito ✅");

    // Volver a la lista
    window.location.href = "comandesLlistar.html";
  });
});



