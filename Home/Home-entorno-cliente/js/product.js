// --- Obtener ID del producto desde la URL ---
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

// --- Obtener datos del producto desde la base de datos ---
function getProductFromDB(id) {
  const db = JSON.parse(localStorage.getItem('productsDB'));
  const product = db.products.find(p => p.id === id);
  
  if (product) {
    const family = db.families.find(f => f.id === product.family_id);
    return { ...product, family_name: family ? family.name : "Desconocida" };
  }
  
  return null;
}

// --- Mostrar los datos del producto ---
function showProduct() {
  const id = getProductId();
  const product = getProductFromDB(id);

  if (!product) {
    document.getElementById("productDetail").innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  // Construir HTML del detalle
  const html = `
    <div class="product-detail">
      <img src="${product.image}" alt="${product.name}" width="300" onerror="this.src='https://via.placeholder.com/300x300?text=Imagen+no+disponible'">
      <h2>${product.name}</h2>
      <p><strong>Precio:</strong> $${product.price}</p>
      <p><strong>Descripción:</strong> ${product.description}</p>
      <p><strong>Familia:</strong> ${product.family_name}</p>
    </div>
  `;

  document.getElementById("productDetail").innerHTML = html;
}

// --- Ejecutar al cargar la página ---
showProduct();