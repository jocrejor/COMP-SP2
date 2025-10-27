document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById('tableBody');

    // Cargar datos de localStorage O de TendaFakeDades.js si no hay datos
    let data = JSON.parse(localStorage.getItem("formData")) || [];
    
    // Si no hay datos en localStorage, usar los de TendaFakeDades.js (array Sale)
    if (data.length === 0 && typeof Sale !== 'undefined') {
        // Convertir la estructura de Sale a la estructura que espera tu código
        data = Sale.map(function(sale, index) {
            return {
                oferta: sale.description,
                percentaje: sale.discount_percent,
                dataInici: sale.start_date.split(' ')[0], // Solo la fecha, sin la hora
                dataFi: sale.end_date.split(' ')[0], // Solo la fecha, sin la hora
                coupon: sale.coupon
            };
        });
        localStorage.setItem("formData", JSON.stringify(data));
    }

    function saveDataToLocalStorage(){
        localStorage.setItem("formData", JSON.stringify(data));
    }

    function deleteData(index){
        if (confirm("Estàs segur que vols eliminar aquesta oferta?")) {
            data.splice(index, 1);
            saveDataToLocalStorage();
            renderTable();
        }
    }

    function renderTable() {
        if (!tableBody) {
            console.error("No s'ha trobat l'element tableBody");
            return;
        }
        
        // Limpiar la tabla
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        // Verificar si hay datos
        if (data.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.setAttribute("colspan", "8");
            cell.appendChild(document.createTextNode("No hi ha ofertes registrades"));
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        data.forEach(function (item, index){
            const row = document.createElement("tr");
            const idCell = document.createElement("td");
            const ofertaCell = document.createElement("td");
            const percentajeCell = document.createElement("td");
            const dataIniciCell = document.createElement("td");
            const dataFiCell = document.createElement("td");
            const couponCell = document.createElement("td");
            const actionCell = document.createElement("td");
            const productsCell = document.createElement("td");
            
            const editButton = document.createElement("button");
            const deleteButton = document.createElement("button");
            const addProductSale = document.createElement("button");

            // Usar createTextNode para todo el contenido de texto
            idCell.appendChild(document.createTextNode(index + 1));
            ofertaCell.appendChild(document.createTextNode(item.oferta));
            percentajeCell.appendChild(document.createTextNode(item.percentaje + "%"));
            dataIniciCell.appendChild(document.createTextNode(item.dataInici));
            dataFiCell.appendChild(document.createTextNode(item.dataFi));
            couponCell.appendChild(document.createTextNode(item.coupon || "-"));

            editButton.appendChild(document.createTextNode("Edit"));
            deleteButton.appendChild(document.createTextNode("Delete"));
            addProductSale.appendChild(document.createTextNode("Productes aplicats"));

            // Añadir estilos básicos a los botones
            editButton.style.marginRight = "5px";
            deleteButton.style.marginRight = "5px";
            addProductSale.style.marginRight = "5px";

            editButton.addEventListener("click", function(){
                editData(index);
            });

            deleteButton.addEventListener("click", function(){
                deleteData(index);
            });

            addProductSale.addEventListener("click", function(){
                goToProducts(index);
            });

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
    }

    function goToProducts(index){
        window.location.href = `productsList.html?oferta=${index}`;
    }

    function editData(index) {
        window.location.href = `edit.html?edit=${index}`;
    }

    // Renderizar la tabla cuando se carga la página
    renderTable();
});