// Funció principal que s'executa quan el DOM està carregat
document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("tableBody"); // Cos de la taula on es mostraran les dades

    // Funció per carregar les dades
    function loadData() {        
        // Primer comprovem si hi ha dades a localStorage
        const savedData = JSON.parse(localStorage.getItem("saleData"));
        
        // Si hi ha dades guardades, les utilitzem
        if (savedData && savedData.length > 0) {
            console.log("Utilitzant dades de localStorage"); 
            return savedData;
        }
        
        // Si no hi ha dades a localStorage, comprovem si existeix Sale
        if (typeof Sale !== 'undefined' && Sale.length > 0) {
            console.log("Utilitzant dades de TendaFakeDades.js - Sale:", Sale); 
            // Guardem les dades de Sale a localStorage per primera vegada
            localStorage.setItem("saleData", JSON.stringify(Sale));
            return Sale;
        }
        
        // Si no hi ha dades enlloc, retornem array buit
        console.log("No s'han trobat dades"); 
        return [];
    }

    let data = loadData();
    console.log("Dades carregades:", data);

    // Funció per desar les dades a localStorage
    function saveDataToLocalStorage() {
        localStorage.setItem("saleData", JSON.stringify(data));
        console.log("Dades guardades a localStorage");
    }

    // Funció per eliminar una fila
    function deleteData(index) {
        if (confirm("Estàs segur que vols eliminar aquesta oferta?")) {
            data.splice(index, 1); // Eliminem l'element de l'array
            saveDataToLocalStorage();
            renderTable();
        }
    }

    // Funció per renderitzar la taula
    function renderTable() {
        console.log("Renderitzant taula...");
        if (!tableBody) {
            console.error("No s'ha trobat l'element tableBody");
            return;
        }
        
        tableBody.innerHTML = "";
        // Comprovem si hi ha dades per mostrar
        if (data.length === 0) {
            const emptyRow = document.createElement("tr");
            const emptyCell = document.createElement("td");
            emptyCell.colSpan = 8;
            emptyCell.textContent = "No hi ha ofertes per mostrar";
            emptyCell.style.textAlign = "center";
            emptyRow.appendChild(emptyCell);
            tableBody.appendChild(emptyRow);
            return;
        }
        
        // Recorrem les dades i creem les files de la taula
        data.forEach(function (item, index) {
            const row            = document.createElement("tr");
            const idCell         = document.createElement("td");
            const ofertaCell     = document.createElement("td");
            const percentajeCell = document.createElement("td");
            const dataIniciCell  = document.createElement("td");
            const dataFiCell     = document.createElement("td");
            const couponCell     = document.createElement("td");
            const actionCell     = document.createElement("td");
            const productsCell   = document.createElement("td");

            const editButton     = document.createElement("button");
            const deleteButton   = document.createElement("button");
            const addProductSale = document.createElement("button");

            idCell.textContent         = item.id || (index + 1);
            ofertaCell.textContent     = item.description || item.oferta || "Sense nom";
            percentajeCell.textContent = (item.discount_percent || item.percentaje || 0) + "%";
            
            // Formatem les dates
            try {
                const startDate = new Date(item.start_date || item.dataInici || "");
                const endDate = new Date(item.end_date || item.dataFi || "");
                
                dataIniciCell.textContent  = !isNaN(startDate.getTime()) ? startDate.toLocaleDateString('ca-ES') : "No definida";
                dataFiCell.textContent     = !isNaN(endDate.getTime()) ? endDate.toLocaleDateString('ca-ES') : "No definida";
            } catch (e) {
                dataIniciCell.textContent = "Error data";
                dataFiCell.textContent = "Error data";
            }
            
            couponCell.textContent     = item.coupon || "-";

            editButton.textContent = "Editar";
            deleteButton.textContent = "Borrar";
            addProductSale.textContent = "Visualitzar";
            
            // Afegim els esdeveniments als botons
            editButton.addEventListener("click", function () {
                editData(index);
            });

            deleteButton.addEventListener("click", function () {
                deleteData(index);
            });
            
            // Botó per anar a la pàgina de productes amb l'índex de l'oferta
            addProductSale.addEventListener("click", function () {
                goToProducts(index);
            });
            
            // Afegim les cel·les a la fila
            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
            productsCell.appendChild(addProductSale);
            
            row.appendChild(idCell);
            row.appendChild(ofertaCell);
            row.appendChild(percentajeCell);
            row.appendChild(dataIniciCell);
            row.appendChild(dataFiCell);
            row.appendChild(couponCell);
            row.appendChild(actionCell);
            row.appendChild(productsCell);

            tableBody.appendChild(row);
        });
        
        console.log("Taula renderitzada amb", data.length, "elements");
    }

    // Funció per anar a la pàgina de productes amb l'índex de l'oferta
    function goToProducts(index) {
        window.location.href = `productsList.html?oferta=${index}`;
    }

    // Funció per anar a la pàgina d'edició amb l'índex de l'oferta
    function editData(index) {
        window.location.href = `edit.html?edit=${index}`;
    }

    // Renderitzem la taula
    renderTable();
});