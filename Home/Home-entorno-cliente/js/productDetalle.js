document.addEventListener("DOMContentLoaded", () => {
  // Obtenir els paràmetres de la URL
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id")); // Obtenir l'ID de la URL
  const container = document.getElementById("productDetail");

  // Obtenir i guardar les dades en localStorage per a la seua manipulació
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

  // Buscar el producte amb eixe ID
  const product = ProductData.find(p => p.id === productId);

  // Si no existeix el producte, mostrar missatge d'error
  if (!product) {
    const errorMsg = document.createElement("p");
    errorMsg.className = "error-message";
    errorMsg.appendChild(document.createTextNode("Producte no trobat"));
    container.appendChild(errorMsg);
    return;
  }

  const div = document.createElement("div");
  div.className = "product-detail-container";

  // Nom del producte
  const h2 = document.createElement("h2");
  h2.className = "product-title";
  h2.appendChild(document.createTextNode(product.name));
  div.appendChild(h2);

  // Imatges i carrusel per a poder passar les imatges
  const productImg = ProductimageData.filter(img => img.product_id === product.id);
  let imgActual = 0;
  const carrusel = document.createElement("div");
  carrusel.className = "carousel-container";

  const img = document.createElement("img");
  img.className = "carousel-image";

  if(productImg.length > 0){
    img.src = productImg[imgActual].url;
  }else {
    img.src = "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg";
  }
  carrusel.appendChild(img);

  // Crear botons de navegació del carrusel
  const btnAnt = document.createElement("button");
  btnAnt.className = "carousel-btn carousel-btn-prev";
  btnAnt.appendChild(document.createTextNode("<-"));

  const btnSeg = document.createElement("button");
  btnSeg.className = "carousel-btn carousel-btn-next";
  btnSeg.appendChild(document.createTextNode("->"));

  // Funcions per a canviar d'imatge
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

  // Posar els botons al carrusel
  carrusel.appendChild(btnAnt);
  carrusel.appendChild(btnSeg);

  // Afegir carrusel al div principal
  div.appendChild(carrusel);


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

  // Crear element per a mostrar el preu
  const pPrice = document.createElement("p");
  pPrice.className = "product-price";

  // Mostrar preu amb descompte si hi ha oferta activa
  if(oPrice.length > 0){
    const oferta = oPrice[0]; // Agafem la primera oferta activa
    const priceWithDiscount = product.price * (1 - oferta.discount_percent / 100);
    pPrice.classList.add("product-price-discount");
    pPrice.appendChild(document.createTextNode(`Preu: ${priceWithDiscount.toFixed(2)} € - ${oferta.discount_percent}% (${oferta.description})`));
  } else {
    pPrice.classList.add("product-price-normal");
    pPrice.appendChild(document.createTextNode(`Preu: ${product.price.toFixed(2)} €`));
  }

  // Afegir el preu al div principal
  div.appendChild(pPrice);

  // Atributs del producte
  const atributosFamilia = AttributeData.filter(a => a.family_id === product.family_id);
  if (atributosFamilia.length > 0) {
    const h4 = document.createElement("h4");
    h4.className = "attributes-title";
    h4.appendChild(document.createTextNode("Atributs:"));
    div.appendChild(h4);

    const ul = document.createElement("ul");
    ul.className = "attributes-list";

    atributosFamilia.forEach(attr => {
      // Buscar el valor de l'atribut
      const valor = ProductattributeData.find(
        pAttri => pAttri.product_id === product.id && pAttri.attribute_id === attr.id
      );

      const li = document.createElement("li");
      li.className = "attribute-item";

      // Mostrem el valor si existeix, si no només mostrem l'atribut
      if (valor) {
        li.appendChild(document.createTextNode(`${attr.name}: ${valor.value}`));
      } else {
        li.appendChild(document.createTextNode(`${attr.name}: -`));
      }

      ul.appendChild(li);
    });

    div.appendChild(ul);
  }

  // Descripció del producte
  const tDesc = document.createElement("h4");
  tDesc.className = "description-title";
  tDesc.appendChild(document.createTextNode("Descripcio:"));
  div.appendChild(tDesc);

  const pDesc = document.createElement("p");
  pDesc.className = "description-text";
  pDesc.appendChild(document.createTextNode(product.description));
  div.appendChild(pDesc);

  // Botó per a afegir al carret
  const btn = document.createElement("button");
  btn.className = "btn-add-cart";
  btn.appendChild(document.createTextNode("Afegir al carret"));
  div.appendChild(btn);

  // Botó per a tornar a la pàgina principal
  const btnVol = document.createElement("button");
  btnVol.className = "btn-back-home";
  btnVol.appendChild(document.createTextNode("Tornar a la pagina principal"));
  btnVol.onclick = () => {
    window.location.href = "home.html";
  };
  div.appendChild(btnVol);
  
  // Afegir tot al contenidor principal
  container.appendChild(div);
});