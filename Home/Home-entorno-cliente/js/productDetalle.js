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
  pPrice.textContent = ` Preu: $${product.price.toFixed(2)}`;
  div.appendChild(pPrice);

  // Atributos
const atributosFamilia = Attribute.filter(a => a.family_id === product.family_id);
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
    const valor = Productattribute.find(
      pa => pa.product_id === product.id && pa.attribute_id === attr.id
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
