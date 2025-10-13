document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // evitar envío real

    // Obtener datos del pedido
    const date = document.getElementById("date").value;
    const payment = document.getElementById("payment").value;
    const shipping = parseFloat(document.getElementById("shipping").value) || 0;
    const client = document.getElementById("client").value;

    // Obtener productos (pueden ser varios si agregas dinámicamente)
    const products = [];
    document.querySelectorAll(".product-line").forEach((line) => {
      const product_id = line.querySelector("select[name='product_id[]']").value;
      const quantity = parseInt(line.querySelector("input[name='quantity[]']").value) || 0;
      const price = parseFloat(line.querySelector("input[name='price[]']").value) || 0;
      const discount = parseFloat(line.querySelector("input[name='discount[]']").value) || 0;

      products.push({ product_id, quantity, price, discount });
    });

    // Calcular total
    let total = 0;
    products.forEach(p => {
      total += (p.quantity * p.price) - p.discount;
    });
    total += shipping;

    // Crear objeto pedido
    const pedido = {
      id: Date.now(), // ID único
      date,
      payment,
      shipping,
      client,
      total,
      products
    };

    // Recuperar pedidos existentes en localStorage
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(pedido);

    // Guardar en localStorage
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    alert("Pedido guardado con éxito ✅");

    // Redirigir a la lista de pedidos
    window.location.href = "llistaComanda.html";
  });
});