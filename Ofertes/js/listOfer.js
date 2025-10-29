document.addEventListener("DOMContentLoaded", function () {
    const tableBody               = document.getElementById('tableBody');
    const paginationContainer     = document.createElement('div');
    paginationContainer.className = 'pagination';

    let data = JSON.parse(localStorage.getItem("formData")) || [];
    let currentPage = 1;
    const itemsPerPage = 10;

    // Solo cargar datos de TendaFakeDades si NO hay datos en localStorage
    if (data.length === 0 && typeof Sale !== 'undefined' && Sale.length > 0) {
        console.log("Cargando datos iniciales de TendaFakeDades...");
        data = Sale.map(function (sale) {
            return {
                oferta: sale.description,
                percentaje: sale.discount_percent,
                dataInici: sale.start_date.split(' ')[0],
                dataFi: sale.end_date.split(' ')[0],
                coupon: sale.coupon || ""
            };
        });
        localStorage.setItem("formData", JSON.stringify(data));
    } else if (data.length > 0) {
        console.log("Usando datos existentes de localStorage:", data.length, "ofertas");
    }

    function saveDataToLocalStorage() {
        localStorage.setItem("formData", JSON.stringify(data));
    }

    function deleteData(index) {
        if (confirm("Estàs segur que vols eliminar aquesta oferta?")) {
            data.splice(index, 1);
            saveDataToLocalStorage();
            renderTable();
        }
    }

    function renderTable() {
        if (!tableBody) return;

        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        if (data.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.setAttribute("colspan", "8");
            cell.className = 'no-data';
            cell.appendChild(document.createTextNode("No hi ha ofertes registrades"));
            row.appendChild(cell);
            tableBody.appendChild(row);
            return;
        }

        const startIndex   = (currentPage - 1) * itemsPerPage;
        const endIndex     = startIndex + itemsPerPage;
        const currentItems = data.slice(startIndex, endIndex);

        currentItems.forEach(function (item, index) {
            const globalIndex    = startIndex + index;
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

            idCell.appendChild(document.createTextNode(globalIndex + 1));
            ofertaCell.appendChild(document.createTextNode(item.oferta));
            percentajeCell.appendChild(document.createTextNode(item.percentaje + "%"));
            dataIniciCell.appendChild(document.createTextNode(item.dataInici));
            dataFiCell.appendChild(document.createTextNode(item.dataFi));
            couponCell.appendChild(document.createTextNode(item.coupon || "-"));

            editButton.appendChild(document.createTextNode("Edit"));
            deleteButton.appendChild(document.createTextNode("Delete"));
            addProductSale.appendChild(document.createTextNode("Productes aplicats"));

            editButton.addEventListener("click", function () {
                window.location.href = `edit.html?edit=${globalIndex}`;
            });

            deleteButton.addEventListener("click", function () {
                deleteData(globalIndex);
            });

            addProductSale.addEventListener("click", function () {
                window.location.href = `productsList.html?oferta=${globalIndex}`;
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

        renderPagination();
    }

    function renderPagination() {
        const totalPages = Math.ceil(data.length / itemsPerPage);

        while (paginationContainer.firstChild) {
            paginationContainer.removeChild(paginationContainer.firstChild);
        }

        if (totalPages <= 1) return;

        // Botón Anterior
        const prevButton = document.createElement("button");
        prevButton.appendChild(document.createTextNode("« Anterior"));
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener("click", function () {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
        paginationContainer.appendChild(prevButton);

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement("button");
            pageButton.appendChild(document.createTextNode(i));
            if (i === currentPage) {
                pageButton.className = 'active';
            }
            pageButton.addEventListener("click", function () {
                currentPage = i;
                renderTable();
            });
            paginationContainer.appendChild(pageButton);
        }

        // Botón Siguiente
        const nextButton = document.createElement("button");
        nextButton.appendChild(document.createTextNode("Següent »"));
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener("click", function () {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
        paginationContainer.appendChild(nextButton);

        // Información de paginación
        const info = document.createElement("span");
        info.className = 'pagination-info';
        info.appendChild(document.createTextNode(
            `Pàgina ${currentPage} de ${totalPages} - ${data.length} ofertes`
        ));
        paginationContainer.appendChild(info);

        // Añadir paginación al DOM si no está ya
        if (!paginationContainer.parentNode) {
            tableBody.parentNode.parentNode.appendChild(paginationContainer);
        }
    }

    renderTable();
});