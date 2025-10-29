// Esperar a que el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id")); // Obtener ID de la URL
  const container = document.getElementById("productDetail");

  // Buscar el producto con ese ID
  const product = Product.find(p => p.id === productId);

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

  //Imagen
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
  pPrice.textContent = ` Precio: $${product.price.toFixed(2)}`;
  div.appendChild(pPrice);

  // Atributos
    const atributosFamilia = Attribute.filter(a => a.family_id === product.family_id);
    if (atributosFamilia.length > 0) {
      const h4 = document.createElement("h4");
      h4.textContent = "Atributos:";
      h4.style.textAlign = "left";
      div.appendChild(h4);

      const ul = document.createElement("ul");
      atributosFamilia.forEach(attr => {
        const li = document.createElement("li");
        li.textContent = attr.name;
        li.style.textAlign = "left";
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }

  // Descripción
  const tDesc = document.createElement("h4");
  tDesc.textContent = "Descripción:";
  div.appendChild(tDesc);

  const pDesc = document.createElement("p");
  pDesc.textContent = product.description;
  div.appendChild(pDesc);

  // Botón para añadir al carrito
  const btn = document.createElement("button");
  btn.textContent = " Añadir al carrito";
  btn.style.marginTop = "10px";
  div.appendChild(btn);

  //Boton para volver a la home
  const btnVol = document.createElement("button");
  btnVol.textContent = "Volver a la página principal";
  btnVol.onclick = () => {
  window.location.href = "home.html";
  };
  div.appendChild(btnVol);
  
  container.appendChild(div);
});
