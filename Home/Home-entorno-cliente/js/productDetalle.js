// Esperar a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id")); // Obtener ID de la URL
  const container = document.getElementById("productDetail");

  // Buscar el producto con ese ID
  const product = Product.find(p => p.id === productId);

  if (!product) {
    container.textContent = "Producto no encontrado ";
    return;
  }

  // Crear estructura del detalle
  const div = document.createElement("div");
  div.style.maxWidth = "600px";
  div.style.margin = "20px auto";
  div.style.padding = "20px";
  div.style.border = "1px solid #ccc";
  div.style.borderRadius = "8px";
  div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.1)";

  //Imagen

  // Nombre
  const h2 = document.createElement("h2");
  h2.textContent = product.name;
  div.appendChild(h2);

  // Precio
  const pPrice = document.createElement("p");
  pPrice.textContent = ` Precio: $${product.price.toFixed(2)}`;
  div.appendChild(pPrice);

  // Descripción
  const pDesc = document.createElement("p");
  pDesc.textContent = product.description;
  div.appendChild(pDesc);

  // Botón para añadir al carrito (opcional)
  const btn = document.createElement("button");
  btn.textContent = " Añadir al carrito";
  btn.style.marginTop = "10px";
  div.appendChild(btn);

  container.appendChild(div);
});
