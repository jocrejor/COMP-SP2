// --- Simulación de base de datos (nombres de campos en inglés) ---

// Tabla Family
const families = [
  { id: 1, name: "Tiras LED" },
  { id: 2, name: "Bombillas LED" },
  { id: 3, name: "Paneles LED" }
];

// Tabla Product
const products = [
  {
    id: 1,
    name: "Tira LED RGB",
    price: 19.99,
    description: "Tira flexible RGB perfecta para decorar habitaciones, techos o muebles.",
    image: "img/strip.jpg",
    family_id: 1
  },
  {
    id: 2,
    name: "Bombilla LED cálida",
    price: 9.99,
    description: "Bombilla LED de bajo consumo con luz cálida, ideal para interiores.",
    image: "img/bulb.jpg",
    family_id: 2
  },
  {
    id: 3,
    name: "Panel LED blanco",
    price: 29.99,
    description: "Panel LED ultrafino con luz blanca brillante, perfecto para oficinas.",
    image: "img/panel.jpg",
    family_id: 3
  }
];

// --- Obtener ID del producto desde la URL ---
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

// --- Mostrar los datos del producto ---
function showProduct() {
  const id = getProductId();
  const product = products.find(p => p.id === id);

  if (!product) {
    document.getElementById("productDetail").innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  // Buscar la familia
  const family = families.find(f => f.id === product.family_id);

  // Construir HTML del detalle
  const html = `
    <div>
      <img src="${product.image}" alt="${product.name}" width="300">
      <h2>${product.name}</h2>
      <p><strong>Precio:</strong> $${product.price}</p>
      <p><strong>Descripción:</strong> ${product.description}</p>
      <p><strong>Familia:</strong> ${family ? family.name : "Desconocida"}</p>
    </div>
  `;

  document.getElementById("productDetail").innerHTML = html;
}

// --- Ejecutar al cargar la página ---
showProduct();


