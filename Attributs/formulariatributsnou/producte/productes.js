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
      const productos = [
        { id: 1, nombre: "Pantalla Samsung 27", categoria: "Monitores" },
        { id: 2, nombre: "Teclado Mecánico RGB", categoria: "Periféricos" },
        { id: 3, nombre: "Mouse Gamer Logitech", categoria: "Periféricos" },
        { id: 4, nombre: "Laptop Dell Inspiron", categoria: "Computadoras" },
        { id: 5, nombre: "Auriculares Sony", categoria: "Audio" },
        { id: 6, nombre: "Webcam Logitech HD", categoria: "Periféricos" },
        { id: 7, nombre: "Disco Duro SSD 1TB", categoria: "Almacenamiento" },
        { id: 8, nombre: "Memoria RAM 16GB", categoria: "Componentes" },
        { id: 9, nombre: "Procesador Intel i7", categoria: "Componentes" },
        { id: 10, nombre: "Impresora HP LaserJet", categoria: "Impresoras" }
      ];

      if (!localStorage.getItem("productos")) {
        localStorage.setItem("productos", JSON.stringify(productos));
      }

      const productes = JSON.parse(localStorage.getItem("productos"));
      const tabla = document.getElementById("tablaProductos");

      productes.forEach(prod => {
        const fila = document.createElement("tr");

        fila.appendChild(crearCeldacontingut(prod.nombre));
        fila.appendChild(crearCeldacontingut(prod.categoria));

        const tdBoton = document.createElement("td");
        const boton = document.createElement("button");
        const textoBoton = document.createTextNode(" característiques");
        boton.appendChild(textoBoton);

        boton.addEventListener("click", () => {
          localStorage.setItem("productoSeleccionado", prod.id);
          window.location.href = "../caracteristica/llistar/llistarcaracteristica.html";
        });

        tdBoton.appendChild(boton);
        fila.appendChild(tdBoton);

        tabla.appendChild(fila);
      });
    }