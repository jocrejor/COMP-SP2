document.addEventListener("DOMContentLoaded", () => {
  const selectFamilia = document.getElementById("familia");
  const container = document.getElementById("productList");
  const paginacioContainer = document.getElementById("paginacio");

  // Obtindre i guardar les dades en localStorage per a la seua manipulació
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

  // Variables per a fer la paginació
  let pagActual = 1;
  const productesPerPagina = 6;
  let productesActuals = ProductData;

  // Mostrar els productes d’una pàgina
  function mostrarPagina(pagina, productes) {
    const inici = (pagina - 1) * productesPerPagina;
    const fi = inici + productesPerPagina;
    const productesPagina = productes.slice(inici, fi);
    mostrarProductes(productesPagina);
    mostrarBotonsPaginacio(productes);
  }

  // Crear botons de paginació
  function mostrarBotonsPaginacio(productes) {
    paginacioContainer.replaceChildren();
    const totalPagines = Math.ceil(productes.length / productesPerPagina);

    if (totalPagines <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.textContent = "⟨ Anterior";
    prevBtn.disabled = pagActual === 1;
    prevBtn.onclick = () => {
      pagActual--;
      mostrarPagina(pagActual, productesActuals);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    paginacioContainer.appendChild(prevBtn);

    const pageInfo = document.createElement("span");
    pageInfo.textContent = `Pàgina ${pagActual} de ${totalPagines}`;
    paginacioContainer.appendChild(pageInfo);

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Següent ⟩";
    nextBtn.disabled = pagActual === totalPagines;
    nextBtn.onclick = () => {
      pagActual++;
      mostrarPagina(pagActual, productesActuals);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    paginacioContainer.appendChild(nextBtn);
  }

  // Funció per a mostrar productes
  function mostrarProductes(productesFiltrats) {
    container.replaceChildren();

    productesFiltrats.forEach(producte => {
      const div = document.createElement("div");
      div.className = "targeta-producte";

      const h2 = document.createElement("h2");
      h2.className = "titol-targeta-producte";
      h2.appendChild(document.createTextNode(producte.name));
      div.appendChild(h2);

      const productImg = ProductimageData.find(img => img.product_id === producte.id);
      const img = document.createElement("img");
      img.className = "imatge-targeta-producte";
      img.src = productImg
        ? productImg.url
        : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg";
      img.alt = producte.name;
      div.appendChild(img);

      const ara = new Date();
      const idOfertes = [];
      ProductSaleData.forEach(ps => {
        if (ps.product_id === producte.id) idOfertes.push(ps.sale_id);
      });

      const ofertesActives = SaleData.filter(
        s =>
          idOfertes.includes(s.id) &&
          new Date(s.start_date) <= ara &&
          ara <= new Date(s.end_date)
      );

      const pPreu = document.createElement("p");
      pPreu.className = "preu-targeta-producte";

      if (ofertesActives.length > 0) {
        const oferta = ofertesActives[0];
        const preuAmbDescompte = producte.price * (1 - oferta.discount_percent / 100);
        pPreu.classList.add("preu-targeta-producte-descompte");
        pPreu.appendChild(
          document.createTextNode(
            `Preu: ${preuAmbDescompte.toFixed(2)} € - ${oferta.discount_percent}% (${oferta.description})`
          )
        );
      } else {
        pPreu.classList.add("preu-targeta-producte-normal");
        pPreu.appendChild(document.createTextNode(`Preu: ${producte.price.toFixed(2)} €`));
      }
      div.appendChild(pPreu);

      const pDesc = document.createElement("p");
      pDesc.className = "descripcio-targeta-producte";
      pDesc.appendChild(document.createTextNode(producte.description));
      div.appendChild(pDesc);

      const btnVeure = document.createElement("button");
      btnVeure.className = "boto-veure-producte";
      btnVeure.appendChild(document.createTextNode("Veure producte"));
      btnVeure.onclick = () => {
        window.location.href = `product.html?id=${producte.id}`;
      };
      div.appendChild(btnVeure);

      const btnCarret = document.createElement("button");
      btnCarret.className = "boto-afegir-carret";
      btnCarret.appendChild(document.createTextNode("Afegir al carret"));
      div.appendChild(btnCarret);

      container.appendChild(div);
    });
  }

  // Mostrar tots els productes a l'inici
  mostrarPagina(pagActual, productesActuals);

  // Filtrar per família
  selectFamilia.addEventListener("change", function() {
    const familiaId = parseInt(this.value);
    if (isNaN(familiaId)) {
      productesActuals = ProductData;
    } else {
      productesActuals = ProductData.filter(p => p.family_id === familiaId);
    }
    pagActual = 1; // Reiniciar a la primera pàgina
    mostrarPagina(pagActual, productesActuals);
  });
});
