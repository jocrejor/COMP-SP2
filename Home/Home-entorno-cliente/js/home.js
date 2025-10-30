document.addEventListener("DOMContentLoaded", () => {
const selectFamilia = document.getElementById("familia");
const container = document.getElementById("productList");

  //Guardar les dades en el localStorage per a la seua manipulacio
  let productsLS = localStorage.getItem("products");
  let ProductData = productsLS ? JSON.parse(productsLS) : Product;
  if (!productsLS) localStorage.setItem("products", JSON.stringify(ProductData));

  let productImagesLS = localStorage.getItem("productImages");
  let ProductimageData = productImagesLS ? JSON.parse(productImagesLS) : Productimage;
  if (!productImagesLS) localStorage.setItem("productImages", JSON.stringify(ProductimageData));

  // Carregar les families en el select
  let familiesLS = localStorage.getItem("families");
  let FamilyData = familiesLS ? JSON.parse(familiesLS) : Family;
  if (!familiesLS) localStorage.setItem("families", JSON.stringify(FamilyData));

  let salesLS = localStorage.getItem("sales");
  let SaleData = salesLS ? JSON.parse(salesLS) : Sale;
  if (!salesLS) localStorage.setItem("sales", JSON.stringify(SaleData));
  
  let productSalesLS = localStorage.getItem("productSales");
  let ProductSaleData = productSalesLS ? JSON.parse(productSalesLS) : ProductSale;
  if (!productSalesLS) localStorage.setItem("productSales", JSON.stringify(ProductSaleData));



// Función para mostrar productos
function mostrarProductos(productosFiltrados) {
  container.replaceChildren(); // limpia el contenedor

  productosFiltrados.forEach(product => {
    // Contenedor del producto
    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.maxWidth = "500px";
    div.style.height = "auto";
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.margin = "10px";


    // Nombre
    const h2 = document.createElement("h2");
    h2.textContent = product.name;
    div.appendChild(h2);

    // Imagen
    const productImg = ProductimageData.find(img => img.product_id === product.id);
    const img = document.createElement("img");
    img.src = productImg ? productImg.url : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg";
    img.alt = product.name;
    img.style.width = "50%";
    img.style.height = "auto";
    img.style.borderRadius = "8px";
    div.appendChild(img);


        // Preu i ofertes
    const now = new Date();

    // Obtener los IDs de las ofertas asociadas a este producto
    const saleIds = [];
    ProductSaleData.forEach(ps => {
      if (ps.product_id === product.id) {
        saleIds.push(ps.sale_id);
      }
    });

    // Filtrar las ofertas activas según la fecha
  const oPrice = SaleData.filter(s => 
  saleIds.includes(s.id) &&
  new Date(s.start_date) <= now &&
  now <= new Date(s.end_date)
  );

  // Crear elemento para mostrar el precio
  const pPrice = document.createElement("p");
  pPrice.style.fontWeight = "bold";
  pPrice.style.fontSize = "1.2rem";

  // Mostrar precio con descuento si hay oferta activa
  if(oPrice.length > 0){
    const oferta = oPrice[0]; // Tomamos la primera oferta activa
    const priceWithDiscount = product.price * (1 - oferta.discount_percent / 100);
    pPrice.textContent = `Precio: ${priceWithDiscount.toFixed(2)}$ - ${oferta.discount_percent}% (${oferta.description})`;
    pPrice.style.color = "red";
  } else {
    pPrice.textContent = `Precio: $${product.price.toFixed(2)}`;
    pPrice.style.color = "black";
  }

  // Añadir el precio al div principal
  div.appendChild(pPrice);

    // Descripción
    const pDesc = document.createElement("p");
    pDesc.textContent = product.description;
    pDesc.style.marginTop = "0.5rem";
    div.appendChild(pDesc);


    // Enlace al detalle
    const aVer = document.createElement("button");
    aVer.textContent = "Ver producto";
    aVer.style.marginTop = "0.5rem";
    aVer.style.width= "120px";
    aVer.onclick = () => {
      window.location.href = `product.html?id=${product.id}`;
    };
    aVer.style.marginRight = "10px";
    div.appendChild(aVer);

    //Boton para añadir al carrito
    const aCar = document.createElement("button");
    aCar.textContent = "Añadir al carrito";
    aCar.style.width= "120px";
    div.appendChild(aCar);

    const hr = document.createElement("hr");
    div.appendChild(hr);

    // Añadir el producto al contenedor principal
    container.appendChild(div);
  });
}

// Mostrar todos al inicio
mostrarProductos(ProductData);

// Filtrar por familia
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
