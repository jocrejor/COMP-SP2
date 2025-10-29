
let productos = localStorage.getItem('productes') ? JSON.parse(localStorage.getItem('productes')) : Product;

document.addEventListener("DOMContentLoaded", main)

function main(){
    const productListTable = document.getElementById('productListTable')

    while (productListTable.firstChild) {
        productListTable.removeChild(productListTable.firstChild);
    }

    let storedProducts = localStorage.getItem('productes')
        ? JSON.parse(localStorage.getItem('productes'))
        : Product;
    localStorage.setItem('productes', JSON.stringify(storedProducts));

    storedProducts.forEach( (product, index) => {
        const tr = document.createElement('tr');

        const tdBtn = document.createElement('td');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Comp';
        btn.addEventListener('click', () => obrirComparador(index));
        tdBtn.appendChild(btn);
        tr.appendChild(tdBtn);

        const tdIndex = document.createElement('td');
        tdIndex.textContent = index + 1;
        tr.appendChild(tdIndex);

        const tdName = document.createElement('td');
        tdName.textContent = product.name || '';
        tr.appendChild(tdName);
        

        const tdPrice = document.createElement('td');
        tdPrice.textContent = (product.price != null) ? product.price : '';
        tr.appendChild(tdPrice);


        const tdDesc = document.createElement('td');
        tdDesc.textContent = product.description || product.descripton || '';
        tr.appendChild(tdDesc);


        productListTable.appendChild(tr);
    });
}

function obrirComparador(index){
   window.location.href = "comparador.html?index="+index;
}
