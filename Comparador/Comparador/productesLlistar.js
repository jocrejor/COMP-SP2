
let Product = [
    {name:"Televisor", price:500, img:"img/tv.png", descripton:"Televisor 4K UHD"},
    {name:"Portàtil", price:700, img:"img/portatil.png", descripton:"Portàtil 15.6'' i7"},
    {name:"Tablet", price:300, img:"img/tablet.png", descripton:"Tablet 10'' 64GB"},
    {name:"Smartphone", price:400, img:"img/movil.png", descripton:"Smartphone 6.5'' 128GB"},
    {name:"Smartwatch", price:200, img:"img/reloj.png", descripton:"Smartwatch GPS"}
]




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

        const tdDesc = document.createElement('td');
        tdDesc.textContent = product.description || product.descripton || '';
        tr.appendChild(tdDesc);

        const tdPrice = document.createElement('td');
        tdPrice.textContent = (product.price != null) ? product.price : '';
        tr.appendChild(tdPrice);

        productListTable.appendChild(tr);
    });
}

function obrirComparador(index){
   window.location.href = "comparador.html?index="+index;
}
