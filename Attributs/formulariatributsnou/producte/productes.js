window.onload = iniciar;

function iniciar() {
  carregardadeslocal();
}

function crearCeldacontingut(texto) {
  const td = document.createElement("td");
  td.textContent = texto;
  return td;
}

function carregardadeslocal() {

  if (typeof Product === "undefined" || !Array.isArray(Product)) {
    console.log(" Error: la variable 'Product' no está definida .");
    return;
  }

  if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(Product));
  }

  const productos = JSON.parse(localStorage.getItem("productos"));
  const tbody = document.getElementById("cuerpoTabla");
  tbody.innerHTML = "";

  productos.forEach(prod => {
    const fila = document.createElement("tr");

    fila.appendChild(crearCeldacontingut(prod.name));

  
    let categoria = "Sense família";
    if (typeof Family !== "undefined") {
      const family = Family.find(f => f.id === prod.family_id);
      if (family) categoria = family.name;
    }
    fila.appendChild(crearCeldacontingut(categoria));

    
    const tdBoton = document.createElement("td");
    const boton = document.createElement("button");
    boton.classList.add("btn", "btn-success", "btn-sm", "fw-bold", "text-uppercase");
    boton.textContent = "característiques";

    boton.addEventListener("click", () => {
      localStorage.setItem("productoSeleccionado", prod.id);
      window.location.href = "../caracteristica/llistar/llistarcaracteristica.html";
    });

    tdBoton.appendChild(boton);
    fila.appendChild(tdBoton);
    tbody.appendChild(fila);
  });
}
