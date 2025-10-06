const form = document.getElementById('productForm');
 const productos = [
    { name: "Led", price: 15.99, description: "llum led 15w",           },
    { name: "Perilla" , price: 5.99, description: "Perilla de llum",    },
    { name: "Pilea AA", price: 3.99, description: "Pila AA",            },
    { name: "Pilea AAA", price: 2.99, description: "Pila AAA",          },
    { name: "Regleta", price: 12.99, description: "Regleta 6 endolls",  },
];

    const productosString = JSON.stringify(productos);
    localStorage.setItem("productos", productosString);
    function renderTable() {
    const tableBody = document.getElementById("tableBody");
    const data = JSON.parse(localStorage.getItem("productos"));

    if (!tableBody || !data) return;

    tableBody.innerHTML = "";

    data.forEach(function (item, index) {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = index;

      const name = document.createElement("td");
      name.textContent = item.name;

      const price = document.createElement("td");
      price.textContent = item.price + " $";

      const check = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = index;
        

      const description = document.createElement("td");
      description.textContent = item.description;

      row.appendChild(idCell);
      row.appendChild(name);
      row.appendChild(price);
      row.appendChild(description);
      row.appendChild(check);
      check.appendChild(checkbox);

      tableBody.appendChild(row);
    });
  }
  renderTable();

  document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();

    
    const params = new URLSearchParams(window.location.search);
    const ofertaIndex = params.get('oferta');

    
    const seleccionados = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => parseInt(cb.value));

    
    let ofertasProductos = JSON.parse(localStorage.getItem("ofertasProductos")) || {};
    ofertasProductos[ofertaIndex] = seleccionados;
    localStorage.setItem("ofertasProductos", JSON.stringify(ofertasProductos));

    alert("Productos guardados para la oferta.");
    window.location.href = "listOfer.html";
});
