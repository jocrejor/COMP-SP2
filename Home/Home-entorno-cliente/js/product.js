  // Esperamos a que el HTML cargue
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("productDetail");

    // 1️ Obtener el ID del producto desde la URL
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));

    if (!productId) {
      container.textContent = "No se ha encontrado el producto.";
      return;
    }

    // 2️ Buscar el producto por su ID en el array Product
    const product = Product.find(p => p.id === productId);

    if (!product) {
      container.textContent = "Producto no encontrado.";
      return;
    }

    // 3️ Crear los elementos del detalle
    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "20px";
    div.style.maxWidth = "600px";

    // Imagen
    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.width = 200;
    img.height = 200;
    div.appendChild(img);

    // Nombre
    const h2 = document.createElement("h2");
    h2.textContent = product.name;
    div.appendChild(h2);

    // Precio
    const pPrice = document.createElement("p");
    pPrice.textContent = `Precio: $${product.price.toFixed(2)}`;
    div.appendChild(pPrice);

    // Descripción
    const pDesc = document.createElement("p");
    pDesc.textContent = `📖 ${product.description}`;
    div.appendChild(pDesc);

    // 4 Mostrar los atributos de la familia
    const atributosFamilia = Attribute.filter(a => a.family_id === product.family_id);
    if (atributosFamilia.length > 0) {
      const h4 = document.createElement("h4");
      h4.textContent = "🔧 Atributos:";
      div.appendChild(h4);

      const ul = document.createElement("ul");
      atributosFamilia.forEach(attr => {
        const li = document.createElement("li");
        li.textContent = attr.name;
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }

    // 5️ Botón para añadir al carrito (solo ejemplo)
    const btn = document.createElement("button");
    btn.textContent = "🛒 Añadir al carrito";
    btn.onclick = () => alert(`${product.name} añadido al carrito`);
    div.appendChild(btn);

    // Añadir todo al contenedor
    container.appendChild(div);
  });
