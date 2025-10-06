const tableBody = document.getElementById('tableBody');


let data = JSON.parse(localStorage.getItem("formData")) || [];


function saveDataToLocalStorage(){
    localStorage.setItem("formData", JSON.stringify(data));
}
function delteData(index){

    data.splice(index, 1);
    saveDataToLocalStorage();
    renderTable();
}

function renderTable() {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    data.forEach(function (item, index){
        const row           =   document.createElement("tr"    );
        const idCell        =   document.createElement("td"    );
        const oferta        =   document.createElement("td"    );
        const percentaje    =   document.createElement("td"    );
        const dataInici     =   document.createElement("td"    );
        const dataFi        =   document.createElement("td"    );
        const actionCell    =   document.createElement("td"    );
        const editButton    =   document.createElement("button");
        const delteButton   =   document.createElement("button");
        const addProductSale=   document.createElement("button");

        idCell.textContent          = index               ;
        oferta.textContent          = item.oferta           ;
        percentaje.textContent      = item.percentaje + "%" ;
        dataInici.textContent       = item.dataInici        ;
        dataFi.textContent          = item.dataFi           ;

        editButton.textContent      = "Edit"                ;
        delteButton.textContent     = "Delte"               ;
        addProductSale.textContent  = "Productes aplicats"  ;

        editButton.addEventListener("click", function(){
            editData(index);
        })

        delteButton.addEventListener("click", function(){
            delteData(index);
        })

        addProductSale.addEventListener("click", function(){
            goToProducts(index);
        })
        actionCell.appendChild(editButton   );
        actionCell.appendChild(delteButton  );

        row.appendChild(idCell          );
        row.appendChild(oferta          );
        row.appendChild(percentaje      );
        row.appendChild(dataInici       );
        row.appendChild(dataFi          );
        row.appendChild(actionCell      );
        row.appendChild(addProductSale  );

        tableBody.appendChild(row       );

    })
}
function goToProducts(index){
    window.location.href = `productsList.html?oferta=${index}`;
    
}
function editData(index) {
    window.location.href = `edit.html?edit=${index}`;
    const item = data[index];
    ofertaInput.value = item.oferta;
    percentajeInput.value = item.percentaje;
    dataIniciInput.value  = item.dataInici;
    datafiInput.value     = item.dataFi;
    data.splice(index, 1);
    saveDataToLocalStorage();
    renderTable();
}


renderTable();
