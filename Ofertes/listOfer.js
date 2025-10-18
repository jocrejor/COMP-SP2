const tableBody = document.getElementById('tableBody');

let data = JSON.parse(localStorage.getItem("formData")) || [];

function saveDataToLocalStorage() {
    localStorage.setItem("formData", JSON.stringify(data));
}

function deleteData(index) {
    data.splice(index, 1);
    saveDataToLocalStorage();
    renderTable();
}

function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    data.forEach(function (item, index) {
        const row = document.createElement("tr");
        const idCell = document.createElement("td");
        const ofertaCell = document.createElement("td");
        const percentajeCell = document.createElement("td");
        const dataIniciCell = document.createElement("td");
        const dataFiCell = document.createElement("td");
        const actionCell = document.createElement("td");
        const productsCell = document.createElement("td");

        const editButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        const addProductSale = document.createElement("button");

        idCell.textContent = index + 1;
        ofertaCell.textContent = item.oferta;
        percentajeCell.textContent = item.percentaje + "%";
        dataIniciCell.textContent = item.dataInici;
        dataFiCell.textContent = item.dataFi;

        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";
        addProductSale.textContent = "Productes aplicats";

        editButton.addEventListener("click", function () {
            editData(index);
        });

        deleteButton.addEventListener("click", function () {
            deleteData(index);
        });

        addProductSale.addEventListener("click", function () {
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
        row.appendChild(actionCell);
        row.appendChild(productsCell);

        tableBody.appendChild(row);
    });
}

function goToProducts(index) {
    window.location.href = `productsList.html?oferta=${index}`;
}

function editData(index) {
    window.location.href = `edit.html?edit=${index}`;
}

renderTable();