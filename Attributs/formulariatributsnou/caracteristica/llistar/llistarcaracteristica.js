window.onload = iniciar;

function iniciar() {
  carregarDadesLocal();
  document.getElementById("enviar").addEventListener("click", anarcrear);
}

function anarcrear() {
  window.location.href = "../crear/crearcaracteristica.html";
}

function carregarDadesLocal() {
  let idSeleccionado = parseInt(localStorage.getItem("productoSeleccionado"));
  let productos = JSON.parse(localStorage.getItem("productos")) || [];
  let attributes = JSON.parse(localStorage.getItem("Attribute")) || [];
  let productAttributes = JSON.parse(localStorage.getItem("Productattribute")) || [];
  let families = JSON.parse(localStorage.getItem("Family")) || [];  

  let producto = productos.find(p => p.id == idSeleccionado);
  let contenedor = document.getElementById("detalle");
  let cos = document.getElementById("cuerpoTabla");

  contenedor.textContent = "";
  cos.textContent = "";

  if (!producto) {
    mostrarTexto(contenedor, "Producto no encontrado.");
    return;
  }

  mostrarTexto(contenedor, producto.name);


  let categoria = "Sense família";
  const familia = families.find(f => f.id === producto.family_id);
  if (familia) categoria = familia.name;


  const caracteristicasProducto = productAttributes.filter(
    productattribute => productattribute.product_id == idSeleccionado
  );

  if (caracteristicasProducto.length === 0) {
    cos.textContent = "";
    mostrarTexto(cos, "Este producto no tiene características aún.");
    return;
  }

  cos.textContent = "";

  caracteristicasProducto.forEach(caracteristica => {
    const attr = attributes.find(a => a.id == caracteristica.attribute_id);

    let fila = document.createElement("tr");
    let tdNom = document.createElement("td");
    let tdValor = document.createElement("td");
    let tdCategoria = document.createElement("td");
    let tdAcciones = document.createElement("td");

    mostrarTexto(tdNom, attr ? attr.name : "(Atributo desconocido)");
    mostrarTexto(tdValor, caracteristica.value);
    mostrarTexto(tdCategoria, categoria); 

 
    const btnEditar = document.createElement("button");
    mostrarTexto(btnEditar, "Modificar");
    btnEditar.className = "btn btn-warning  me-2";
    btnEditar.addEventListener("click", () => {
      localStorage.setItem("atributoAEditar", caracteristica.attribute_id);
      window.location.href = "../modificar/modificarcaracteristica.html";
    });

 
    const btnEliminar = document.createElement("button");
    mostrarTexto(btnEliminar, "Eliminar");
    btnEliminar.className = "btn btn-danger";
    btnEliminar.addEventListener("click", () => eliminarCaracteristica(caracteristica));

    tdAcciones.appendChild(btnEditar);
    tdAcciones.appendChild(btnEliminar);

    fila.appendChild(tdNom);
    fila.appendChild(tdValor);
    fila.appendChild(tdCategoria);
    fila.appendChild(tdAcciones);

    cos.appendChild(fila);
  });
}

function eliminarCaracteristica(caracteristica) {
  if (!confirm("¿Seguro que deseas eliminar esta característica?")) return;

  let productAttributes = JSON.parse(localStorage.getItem("Productattribute")) || [];
  productAttributes = productAttributes.filter(
    item => !(item.product_id === caracteristica.product_id && item.attribute_id === caracteristica.attribute_id)
  );
  localStorage.setItem("Productattribute", JSON.stringify(productAttributes));

  carregarDadesLocal();
}

function mostrarTexto(contenedor, texto) {
  let p = document.createElement("p");
  p.appendChild(document.createTextNode(texto));
  contenedor.appendChild(p);
}
