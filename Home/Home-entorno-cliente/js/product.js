
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
  const id = getProductId(); // Debes tener esta función que obtiene el ID del producto
  const product = products.find(p => p.id === id);

  const container = document.getElementById("productDetail");
  container.replaceChildren(); // Limpiar contenido anterior

  if (!product) {
    const p = document.createElement("p");
    p.textContent = "Producto no encontrado.";
    container.appendChild(p);
    return;
  }

  // Buscar la familia
  const family = families.find(f => f.id === product.family_id);

  // Contenedor del producto
  const div = document.createElement("div");

  // Imagen
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  img.width = 300;
  div.appendChild(img);

  // Nombre
  const h2 = document.createElement("h2");
  h2.textContent = product.name;
  div.appendChild(h2);

  // Precio
  const pPrice = document.createElement("p");
  pPrice.appendChild(document.createTextNode("Precio: $" + product.price));
  div.appendChild(pPrice);

  // Descripción
  const pDesc = document.createElement("p");
  pDesc.appendChild(document.createTextNode("Descripción: " + product.description));
  div.appendChild(pDesc);

  // Familia
  const pFam = document.createElement("p");
  pFam.appendChild(document.createTextNode("Familia: " + (family ? family.name : "Desconocida")));
  div.appendChild(pFam);

  // Añadir el producto al contenedor principal
  container.appendChild(div);
}

// --- Ejecutar al cargar la página ---
showProduct();


