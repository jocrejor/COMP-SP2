document.addEventListener('DOMContentLoaded', () => {
        mostrarProductes();
});

function mostrarProductes() {
    const container = document.getElementById('productes-container');
    Product.forEach(p => {
        const div = document.createElement('div');

        const pName = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = p.name;
        pName.appendChild(strong);
        div.appendChild(pName);

        const pDesc = document.createElement('p');
        pDesc.textContent = p.description;
        div.appendChild(pDesc);

        const pPrice = document.createElement('p');
        pPrice.textContent = `Preu: ${p.price.toFixed(2)} €`;
        div.appendChild(pPrice);
        
        // Buscar la imagen asociada usando la id del producto actual (p)
        const productImg = Productimage ? Productimage.find(img => img.product_id === p.id) : null;
        const img = document.createElement("img");
        img.src = productImg && productImg.url ? productImg.url : "https://freesvg.org/img/Simple-Image-Not-Found-Icon.png";
        img.alt = p.name || 'product';
        img.width = 120;
        img.height = 120;
        div.appendChild(img);

        div.appendChild(document.createElement('br'));

        const btn = document.createElement('button');
        btn.textContent = 'Afegir al carret';
    btn.addEventListener('click', () => afegirAlCarret(p.id));
        div.appendChild(btn);

        div.appendChild(document.createElement('hr'));

        container.appendChild(div);
    });
}

function afegirAlCarret(id) {
    // Buscar el producto por id en el array Product
    const producte =  Product ? Product.find(pr => pr.id === id) : null;
    if (!producte) {
        alert('Producte no trobat');
        return;
    }

    let carret = JSON.parse(localStorage.getItem('carret')) || [];
    const index = carret.findIndex(p => p.id === id);

    if (index >= 0) {
        carret[index].quantity = (carret[index].quantity || 1) + 1;
    } else {
        // Añadimos solo los campos necesarios al carret
        carret.push({ id: producte.id, name: producte.name, price: producte.price, quantity: 1 });
    }

    localStorage.setItem('carret', JSON.stringify(carret));
    alert("Producte afegit!");
}