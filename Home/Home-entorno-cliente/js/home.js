

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


    // Imagen
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.width = 150;
    img.height = 150;
    div.appendChild(img);

    // Nombre
    const h2 = document.createElement("h2");
    h2.textContent = product.name;
    div.appendChild(h2);

    // Precio
    const pPrice = document.createElement("p");
    pPrice.textContent = `Precio: $${product.price.toFixed(2)}`;
    div.appendChild(pPrice);4

    // Descripción
    const pDesc = document.createElement("p");
    pDesc.textContent = product.description;
    div.appendChild(pDesc);

    // Atributos
    const atributosFamilia = Attribute.filter(a => a.family_id === product.family_id);
    if (atributosFamilia.length > 0) {
      const h4 = document.createElement("h4");
      h4.textContent = "Atributos:";
      div.appendChild(h4);

      const ul = document.createElement("ul");
      atributosFamilia.forEach(attr => {
        const li = document.createElement("li");
        li.textContent = attr.name;
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }

    // Enlace al detalle
    const a = document.createElement("a");
    a.href = `product.html?id=${product.id}`;
    a.textContent = "Ver producto";
    div.appendChild(a);

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

