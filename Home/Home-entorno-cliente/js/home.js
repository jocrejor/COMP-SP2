const selectFamilia = document.getElementById("familia");
const container = document.getElementById("productList");

// Función para mostrar productos
function mostrarProductos(productosFiltrados) {
  container.replaceChildren(); // limpia el contenedor

  productosFiltrados.forEach(product => {
    // Contenedor del producto
    const div = document.createElement("div");

    // Imagen
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.width = 150;
    div.appendChild(img);

    // Nombre
    const h2 = document.createElement("h2");
    h2.textContent = product.name;
    div.appendChild(h2);

    // Precio
    const pPrice = document.createElement("p");
    pPrice.textContent = `Precio: $${product.price.toFixed(2)}`;
    div.appendChild(pPrice);

    // Descripción
    const pDesc = document.createElement("p");
    pDesc.textContent = product.description;
    div.appendChild(pDesc);

    // Enlace al detalle
    const a = document.createElement("a");
    a.href = `product.html?id=${product.id}`;
    a.textContent = "Ver producto";
    div.appendChild(a);

    const hr = document.createElement("hr");
    div.appendChild(hr);

    // Añadir el producto al contenedor principal
    container.appendChild(div);
  });
}

// Mostrar todos al inicio
mostrarProductos(products);

// Filtrar por familia
selectFamilia.addEventListener("change", function() {
  const familiaId = parseInt(this.value);
  if (isNaN(familiaId)) {
    mostrarProductos(products);
  } else {
    const filtrados = products.filter(p => p.family_id === familiaId);
    mostrarProductos(filtrados);
  }
});
