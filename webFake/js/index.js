document.addEventListener("DOMContentLoaded",main);
  function main() {
  const llistaFamilies = document.getElementById("llistaFamilies");
  const productList = document.getElementById("productList");
  const paginacioContainer = document.getElementById("paginacio");

  // 🔹 Cargar datos de localStorage o desde TendaFakeDades.js
  const FamilyData = JSON.parse(localStorage.getItem("families")) || Family;
  const ProductData = JSON.parse(localStorage.getItem("products")) || Product;
  const ProductimageData = JSON.parse(localStorage.getItem("productImages")) || Productimage;
  const SaleData = JSON.parse(localStorage.getItem("sales")) || Sale;
  const ProductSaleData = JSON.parse(localStorage.getItem("productSales")) || ProductSale;

  // 🔹 Guardar en localStorage si no existen
  if (!localStorage.getItem("families")) localStorage.setItem("families", JSON.stringify(FamilyData));
  if (!localStorage.getItem("products")) localStorage.setItem("products", JSON.stringify(ProductData));
  if (!localStorage.getItem("productImages")) localStorage.setItem("productImages", JSON.stringify(ProductimageData));
  if (!localStorage.getItem("sales")) localStorage.setItem("sales", JSON.stringify(SaleData));
  if (!localStorage.getItem("productSales")) localStorage.setItem("productSales", JSON.stringify(ProductSaleData));

  // 🔹 Variables de paginación
  let pagActual = 1;
  const productesPerPagina = 6;
  let productesActuals = ProductData;

  // ==================== CREAR LISTA DE FAMILIAS DINÁMICAMENTE ====================
  const opcioTotes = document.createElement("li");
  opcioTotes.textContent = "Tots els equips";
  opcioTotes.classList.add("familia-item", "activa");
  llistaFamilies.appendChild(opcioTotes);

  FamilyData.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f.name;
    li.dataset.id = f.id;
    li.classList.add("familia-item");
    llistaFamilies.appendChild(li);
  });

  // ==================== EVENTO: clic sobre familia ====================
  llistaFamilies.addEventListener("click", e => {
    if (e.target.tagName === "LI") {
      document.querySelectorAll(".familia-item").forEach(item => item.classList.remove("activa"));
      e.target.classList.add("activa");

      const idFamilia = parseInt(e.target.dataset.id);
      if (isNaN(idFamilia)) {
        productesActuals = ProductData;
      } else {
        productesActuals = ProductData.filter(p => p.family_id === idFamilia);
      }

      pagActual = 1;
      mostrarPagina(pagActual, productesActuals);
    }
  });

  // ==================== MOSTRAR PRODUCTES ====================
  function mostrarPagina(page, productes) {
    const inici = (page - 1) * productesPerPagina;
    const fi = inici + productesPerPagina;
    const productesPagina = productes.slice(inici, fi);
    mostrarProductes(productesPagina);
    mostrarBotonsPaginacio(productes);
  }

  function mostrarProductes(productes) {
  productList.replaceChildren();

  productes.forEach(product => {
    const div = document.createElement("div");
    div.className = "targeta-producte";

    // 🔹 Nombre
    const h2 = document.createElement("h2");
    h2.textContent = product.name;
    div.appendChild(h2);

    // 🔹 Imagen
    const productImg = ProductimageData.find(img => img.product_id === product.id);
    const img = document.createElement("img");
    img.src = productImg
      ? productImg.url
      : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg";
    img.alt = product.name;
    div.appendChild(img);

    // 🔹 Precio
    const p = document.createElement("p");
    p.textContent = `Preu: ${product.price.toFixed(2)} €`;
    div.appendChild(p);

    // 🔹 Botones
    const btnContainer = document.createElement("div");
    btnContainer.classList.add("botons-producte");

    const veureBtn = document.createElement("button");
    veureBtn.textContent = "Detall del producte";
    veureBtn.classList.add("btn-veure");
    veureBtn.onclick = () => {
    window.location.href = `product.html?id=${product.id}`;
    };

    const afegirBtn = document.createElement("button");
    afegirBtn.textContent = "Afegir al carret";
    afegirBtn.classList.add("btn-afegir");
    afegirBtn.onclick = () => {
      afegirAlCarret(product);
    };

    btnContainer.appendChild(veureBtn);
    btnContainer.appendChild(afegirBtn);
    div.appendChild(btnContainer);

    productList.appendChild(div);
  });
}

// 🔹 Ejemplo simple de función afegir al carret
function afegirAlCarret(producte) {
  alert(`Afegit al carret: ${producte.name}`);
}


  // ==================== PAGINACIÓN ====================
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

  // Mostrar todo al cargar
  mostrarPagina(pagActual, productesActuals);
  }

