// Esperar a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id")); // Obtener ID de la URL
  const container = document.getElementById("productDetail");

  //Obtindre les dades i guardes en localStorage per a la seua manipulacio
  let productsLS = localStorage.getItem("products");
  let ProductData = productsLS ? JSON.parse(productsLS) : Product;
  if (!productsLS) localStorage.setItem("products", JSON.stringify(ProductData));
  
  let productImagesLS = localStorage.getItem("productImages");
  let ProductimageData = productImagesLS ? JSON.parse(productImagesLS) : Productimage;
  if (!productImagesLS) localStorage.setItem("productImages", JSON.stringify(ProductimageData));

  let salesLS = localStorage.getItem("sales");
  let SaleData = salesLS ? JSON.parse(salesLS) : Sale;
  if (!salesLS) localStorage.setItem("sales", JSON.stringify(SaleData));
  
  let productSalesLS = localStorage.getItem("productSales");
  let ProductSaleData = productSalesLS ? JSON.parse(productSalesLS) : ProductSale;
  if (!productSalesLS) localStorage.setItem("productSales", JSON.stringify(ProductSaleData));

  let attributesLS = localStorage.getItem("attributes");
  let AttributeData = attributesLS ? JSON.parse(attributesLS) : Attribute;
  if (!attributesLS) localStorage.setItem("attributes", JSON.stringify(AttributeData));

  let productAttributesLS = localStorage.getItem("productAttributes");
  let ProductattributeData = productAttributesLS ? JSON.parse(productAttributesLS) : Productattribute;
  if (!productAttributesLS) localStorage.setItem("productAttributes", JSON.stringify(ProductattributeData));




  // Buscar el producto con ese ID
  const product = ProductData.find(p => p.id === productId);

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

  // Nombre
  const h2 = document.createElement("h2");
  h2.textContent = product.name;
  div.style.textAlign = "center"
  div.appendChild(h2);

  //Imagen i carrusel para poder pasar las imagenes
  const productImg = ProductData.filter(img => img.product_id === product.id);
  let imgActual = 0;
  const carrusel = document.createElement("div");
  carrusel.style.display = "flex";
  carrusel.style.flexDirection = "column";
  carrusel.style.alignItems = "center";
  carrusel.style.position = "relative";
  carrusel.style.maxWidth = "500px";
  carrusel.style.margin = "0 auto";

  const img = document.createElement("img");
  img.style.width = "100%";
  img.style.height = "auto";
  img.style.objectFit = "cover";

  //Logica para el carrusel
  if(productImg.length > 0){
    img.src = productImg[imgActual].url;
  }else {
    img.src = "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg";
  }
  carrusel.appendChild(img);

  // Crear botones de navegación
  const btnAnt = document.createElement("button");
  btnAnt.textContent = "<-";
  btnAnt.style.position = "absolute";
  btnAnt.style.left = "10px";
  btnAnt.style.top = "50%";
  btnAnt.style.fontSize = "24px";
  btnAnt.style.background = "rgba(255, 255, 255, 1)";
  btnAnt.style.border = "none";
  btnAnt.style.cursor = "pointer";

  const btnSeg = document.createElement("button");
  btnSeg.textContent = "->";
  btnSeg.style.position = "absolute";
  btnSeg.style.right = "10px";
  btnSeg.style.top = "50%";
  btnSeg.style.fontSize = "24px";
  btnSeg.style.background = "rgba(255, 255, 255, 1)";
  btnSeg.style.border = "none";
  btnSeg.style.cursor = "pointer";

  // Funciones para cambiar de imagen
  btnAnt.onclick = () => {
    if (productImg.length === 0) return;
    imgActual = (imgActual - 1 + productImg.length) % productImg.length;
    img.src = productImg[imgActual].url;
  };

  btnSeg.onclick = () => {
    if (productImg.length === 0) return;
    imgActual = (imgActual + 1) % productImg.length;
    img.src = productImg[imgActual].url;
  };

  // Añadir botones al carrusel
  carrusel.appendChild(btnAnt);
  carrusel.appendChild(btnSeg);

  // Añadir carrusel al div principal
  div.appendChild(carrusel);

  
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

  

  // Atributos
  const atributosFamilia = AttributeData.filter(a => a.family_id === product.family_id);
  if (atributosFamilia.length > 0) {
  const h4 = document.createElement("h4");
  h4.textContent = "Atributos:";
  h4.style.textAlign = "left";
  div.appendChild(h4);

  const ul = document.createElement("ul");
  ul.style.listStyle = "none";
  ul.style.padding = "0";
  ul.style.margin = "0";

  atributosFamilia.forEach(attr => {
    // Buscar el valor del atributo
    const valor = ProductattributeData.find(
      pAttri => pAttri.product_id === product.id && pAttri.attribute_id === attr.id
    );

    //Crear elementos
    const li = document.createElement("li");
    li.style.textAlign = "left";
    li.style.marginBottom = "4px";

    //Mostramos el valor si existe, si no solo mostramos el atributo
    if (valor) {
      li.textContent = `${attr.name}: ${valor.value}`;
    } else {
      li.textContent = `${attr.name}: -`;
    }

    ul.appendChild(li);
  });

  div.appendChild(ul);
}

    

  // Descripción
  const tDesc = document.createElement("h4");
  tDesc.textContent = "Descripción:";
  tDesc.style.marginTop = "1rem";
  tDesc.style.textAlign = "left";
  div.appendChild(tDesc);

  const pDesc = document.createElement("p");
  pDesc.textContent = product.description;
  pDesc.style.textAlign = "left";
  div.appendChild(pDesc);

  // Botón para añadir al carrito
  const btn = document.createElement("button");
  btn.textContent = " Afegir al carret";
  btn.style.marginTop = "1rem";
  btn.style.marginRight= "1rem";
  div.appendChild(btn);

  //Boton para volver a la home
  const btnVol = document.createElement("button");
  btnVol.textContent = "Tornar a la pagina principal";
  btnVol.onclick = () => {
  window.location.href = "home.html";
  };
  div.appendChild(btnVol);
  
  container.appendChild(div);
});
