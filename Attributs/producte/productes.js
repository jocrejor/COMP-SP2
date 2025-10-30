window.onload = iniciar;

function iniciar() {
  carregardadeslocal();
}

function crearCeldacontingut(texto) {
  const td = document.createElement("td");
  const contenido = document.createTextNode(texto);
  td.appendChild(contenido);
  return td;
}

function carregardadeslocal() {

  if (typeof Product === "undefined" || !Array.isArray(Product)) {
    console.log("Error: la variable 'Product' no está definida o no es un array.");
    return;
  }
  if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(Product));
  }

  if (typeof Family !== "undefined" && Array.isArray(Family) && !localStorage.getItem("Family")) {
    localStorage.setItem("Family", JSON.stringify(Family));
  }

  const productos = JSON.parse(localStorage.getItem("productos"));
  const families = JSON.parse(localStorage.getItem("Family")) || [];
  const tbody = document.getElementById("cuerpoTabla");
  tbody.innerHTML = "";

 
  const limitacioproductes = productos.slice(0, 10);

  limitacioproductes.forEach(prod => {
    const fila = document.createElement("tr");

    fila.appendChild(crearCeldacontingut(prod.name));

    let categoria = "Sense família";
    const family = families.find(f => f.id === prod.family_id);
    if (family) categoria = family.name;
    fila.appendChild(crearCeldacontingut(categoria));

    const tdBoton = document.createElement("td");
    const boton = document.createElement("button");
    boton.classList.add("btn", "btn-success", "btn-sm", "fw-bold", "text-uppercase");
    boton.appendChild(document.createTextNode("característiques"));

    boton.addEventListener("click", () => {
      localStorage.setItem("productoSeleccionado", prod.id);
      window.location.href = "../productattribute/productattribute.html";
    });

    tdBoton.appendChild(boton);
    fila.appendChild(tdBoton);
    tbody.appendChild(fila);
  });
}
