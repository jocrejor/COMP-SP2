// Base de datos de productos
const productsDB = {
  // Tabla Family
  families: [
    { id: 1, name: "Tiras LED" },
    { id: 2, name: "Bombillas LED" },
    { id: 3, name: "Paneles LED" },
    { id: 4, name: "Focos LED" }
  ],
  
  // Tabla Product
  products: [
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
    },
    {
      id: 4,
      name: "Foco LED empotrable",
      price: 14.99,
      description: "Foco LED empotrable para techos, disponible en varios colores.",
      image: "img/spotlight.jpg",
      family_id: 4
    },
    {
      id: 5,
      name: "Tira LED RGBW",
      price: 24.99,
      description: "Tira LED con RGB + blanco para mayor versatilidad en iluminación.",
      image: "img/strip_rgbw.jpg",
      family_id: 1
    },
    {
      id: 6,
      name: "Bombilla LED RGB",
      price: 12.99,
      description: "Bombilla LED con cambio de colores, controlable por app.",
      image: "img/bulb_rgb.jpg",
      family_id: 2
    }
  ]
};

// Guardar la base de datos en localStorage si no existe
if (!localStorage.getItem('productsDB')) {
  localStorage.setItem('productsDB', JSON.stringify(productsDB));
}

// Función para obtener productos de la base de datos
function getProducts(familyId = 'all') {
  const db = JSON.parse(localStorage.getItem('productsDB'));
  let products = db.products;
  
  if (familyId !== 'all') {
    products = products.filter(product => product.family_id === parseInt(familyId));
  }
  
  return products;
}

// Función para obtener familias de productos
function getFamilies() {
  const db = JSON.parse(localStorage.getItem('productsDB'));
  return db.families;
}

// Función para mostrar productos en la página
function displayProducts(products) {
  const productList = document.getElementById('productList');
  const families = getFamilies();
  
  productList.innerHTML = '';
  
  if (products.length === 0) {
    productList.innerHTML = '<p>No se encontraron productos.</p>';
    return;
  }
  
  products.forEach(product => {
    const family = families.find(f => f.id === product.family_id);
    const productCard = document.createElement('div');
    productCard.className = 'product-card led-glow';
    
    productCard.innerHTML = `
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x180?text=Imagen+no+disponible'">
      <h3>${product.name}</h3>
      <p class="price">$${product.price}</p>
      <p class="description">${product.description}</p>
      <p class="family">Familia: ${family ? family.name : 'Desconocida'}</p>
      <a href="product.html?id=${product.id}">Ver producto</a>
    `;
    
    productList.appendChild(productCard);
  });
}

// Función para cargar filtros de familia
function loadFamilyFilters() {
  const familyFilter = document.getElementById('familyFilter');
  const families = getFamilies();
  
  // Limpiar opciones existentes (excepto la primera)
  while (familyFilter.children.length > 1) {
    familyFilter.removeChild(familyFilter.lastChild);
  }
  
  // Agregar opciones de familia
  families.forEach(family => {
    const option = document.createElement('option');
    option.value = family.id;
    option.textContent = family.name;
    familyFilter.appendChild(option);
  });
}

// Función para inicializar la página
function initHomePage() {
  // Cargar filtros
  loadFamilyFilters();
  
  // Mostrar todos los productos inicialmente
  displayProducts(getProducts());
  
  // Configurar evento de filtro
  document.getElementById('familyFilter').addEventListener('change', function() {
    const selectedFamily = this.value;
    displayProducts(getProducts(selectedFamily));
  });
}

// Ejecutar cuando la página esté cargada
document.addEventListener('DOMContentLoaded', initHomePage);