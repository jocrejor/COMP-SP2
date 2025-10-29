document.addEventListener("DOMContentLoaded", () => {
const selectFamilia = document.getElementById("familia");
const container = document.getElementById("productList");

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
    const productImg = Productimage.find(img => img.product_id === product.id);
    const img = document.createElement("img");
    img.src = productImg ? productImg.url : "https://png.pngtree.com/png-vector/20221125/ourmid/pngtree-no-image-available-icon-flatvector-illustration-pic-design-profile-vector-png-image_40966566.jpg";
    img.alt = product.name;
    img.style.width = "50%";
    img.style.height = "auto";
    img.style.borderRadius = "8px";
    div.appendChild(img);

    // Precio
    const pPrice = document.createElement("p");
    pPrice.textContent = `Precio: $${product.price.toFixed(2)}`;
    div.appendChild(pPrice);4

    // Descripción
    const pDesc = document.createElement("p");
    pDesc.textContent = product.description;
    div.appendChild(pDesc);


    // Enlace al detalle
    const aVer = document.createElement("button");
    aVer.textContent = "Ver producto";
    aVer.onclick = () => {
      window.location.href = `product.html?id=${product.id}`;
    };
    aVer.style.marginRight = "10px";
    div.appendChild(aVer);

    //Boton para añadir al carrito
    const aCar = document.createElement("button");
    aCar.textContent = "Añadir al carrito";
    div.appendChild(aCar);

    const hr = document.createElement("hr");
    div.appendChild(hr);

    // Añadir el producto al contenedor principal
    container.appendChild(div);
  });
}

// Mostrar todos al inicio
mostrarProductos(Product);

// Filtrar por familia
selectFamilia.addEventListener("change", function() {
  const familiaId = parseInt(this.value);
  if (isNaN(familiaId)) {
    mostrarProductos(Product);
  } else {
    const filtrados = Product.filter(p => p.family_id === familiaId);
    mostrarProductos(filtrados);
  }
});
});
