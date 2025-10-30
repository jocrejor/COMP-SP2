document.addEventListener("DOMContentLoaded", () => {
const selectFamilia = document.getElementById("familia");
const container = document.getElementById("productList");

  // Obtenir i guardar les dades en localStorage per a la seua manipulació
  let productsLS = localStorage.getItem("products");
  let ProductData = productsLS ? JSON.parse(productsLS) : Product;
  if (!productsLS) localStorage.setItem("products", JSON.stringify(ProductData));

  let productImagesLS = localStorage.getItem("productImages");
  let ProductimageData = productImagesLS ? JSON.parse(productImagesLS) : Productimage;
  if (!productImagesLS) localStorage.setItem("productImages", JSON.stringify(ProductimageData));

  let familiesLS = localStorage.getItem("families");
  let FamilyData = familiesLS ? JSON.parse(familiesLS) : Family;
  if (!familiesLS) localStorage.setItem("families", JSON.stringify(FamilyData));

  let salesLS = localStorage.getItem("sales");
  let SaleData = salesLS ? JSON.parse(salesLS) : Sale;
  if (!salesLS) localStorage.setItem("sales", JSON.stringify(SaleData));
  
  let productSalesLS = localStorage.getItem("productSales");
  let ProductSaleData = productSalesLS ? JSON.parse(productSalesLS) : ProductSale;
  if (!productSalesLS) localStorage.setItem("productSales", JSON.stringify(ProductSaleData));

// Funció per a mostrar productes
function mostrarProductos(productosFiltrados) {
  // Netejar el contenidor
  container.replaceChildren();

  // Recórrer cada producte filtrat
  productosFiltrados.forEach(product => {
    // Contenidor del producte
    const div = document.createElement("div");
    div.className = "product-card";

    // Nom del producte
    const h2 = document.createElement("h2");
    h2.className = "product-card-title";
    h2.appendChild(document.createTextNode(product.name));
    div.appendChild(h2);

    // Imatge del producte
    const productImg = ProductimageData.find(img => img.product_id === product.id);
    const img = document.createElement("img");
    img.className = "product-card-image";
    img.src = productImg ? productImg.url : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg";
    img.alt = product.name;
    div.appendChild(img);


    // Preu i ofertes
    const now = new Date();

    // Obtenir els IDs de les ofertes associades a este producte
    const saleIds = [];
    ProductSaleData.forEach(ps => {
      if (ps.product_id === product.id) {
        saleIds.push(ps.sale_id);
      }
    });

  // Filtrar les ofertes actives segons la data
  const oPrice = SaleData.filter(s => 
  saleIds.includes(s.id) &&
  new Date(s.start_date) <= now &&
  now <= new Date(s.end_date)
  );

  const pPrice = document.createElement("p");
  pPrice.className = "product-card-price";

  // Mostrar preu amb descompte si hi ha oferta activa
  if(oPrice.length > 0){
    const oferta = oPrice[0]; 
    const priceWithDiscount = product.price * (1 - oferta.discount_percent / 100);
    pPrice.classList.add("product-card-price-discount");
    pPrice.appendChild(document.createTextNode(`Precio: ${priceWithDiscount.toFixed(2)} € - ${oferta.discount_percent}% (${oferta.description})`));
  } else {
    pPrice.classList.add("product-card-price-normal");
    pPrice.appendChild(document.createTextNode(`Precio: ${product.price.toFixed(2)} €`));
  }

  div.appendChild(pPrice);

    // Descripció del producte
    const pDesc = document.createElement("p");
    pDesc.className = "product-card-description";
    pDesc.appendChild(document.createTextNode(product.description));
    div.appendChild(pDesc);

    // Botó per a veure el producte
    const aVer = document.createElement("button");
    aVer.className = "btn-view-product";
    aVer.appendChild(document.createTextNode("Veure producte"));
    aVer.onclick = () => {
      window.location.href = `product.html?id=${product.id}`;
    };
    div.appendChild(aVer);

    // Botó per a afegir al carret
    const aCar = document.createElement("button");
    aCar.className = "btn-add-to-cart";
    aCar.appendChild(document.createTextNode("Afexir al carret"));
    div.appendChild(aCar);

    const hr = document.createElement("hr");
    div.appendChild(hr);

    container.appendChild(div);
  });
}

// Mostrar tots els productes a l'inici
mostrarProductos(ProductData);

// Filtrar per familia quan canvie el select
selectFamilia.addEventListener("change", function() {
  const familiaId = parseInt(this.value);
  if (isNaN(familiaId)) {
    mostrarProductos(ProductData);
  } else {
    const filtrados = ProductData.filter(p => p.family_id === familiaId);
    mostrarProductos(filtrados);
  }
});
});