const productes = [
    {
        id: 1,
        name: "Philips Bombilla LED",
        price: 6.99,
        description: "Bombilla LED de alta eficiencia, casquillo E27, ideal para sustituir incandescentes. Luz cálida y consumo reducido.",
        image: "https://tse1.mm.bing.net/th/id/OIP.gFS6_FPcJxXnhKYdo1xAdgHaHs?pid=Api"
    },
    {
        id: 2,
        name: "Salamina",
        price: 64.95,
        description: "Ventilador de Techo Silencioso Salamina Blanco 132cm Motor DC",
        image: "https://www.efectoled.com/957216-thickbox_sklum/ventilador-de-techo-silencioso-salamina-blanco-132cm-motor-dc.jpg"
    },
    {
        id: 3,
        name: "Interruptor Conmutador",
        price: 330.95,
        description: "Interruptor Conmutador de Transferencia automática de redes 4-P 125A. MAXGE",
        image: "https://www.efectoled.com/1559785-thickbox_sklum/interruptor-conmutador-de-transferencia-automatica-de-redes-4-p-125a-maxge.jpg"
    },
    {
        id: 4,
        name: "Cable Eléctrico Plano",
        price: 1.25,
        description: "Cable Eléctrico Plano Manguera 4x0.5mm² para Tiras LED RGB a metros",
        image: "https://www.efectoled.com/1501000-thickbox_sklum/cable-electrico-plano-manguera-4x05mm2-para-tiras-led-rgb.jpg"
    },
    {
        id: 5,
        name: "Plafón LED 24W Cuadrado",
        price: 24.95,
        description: "Plafón LED 24W Cuadrado SwitchCCT Seleccionable 420x420 mm Doble Cara",
        image: "https://www.efectoled.com/1088951-thickbox_sklum/plafon-led-24w-cuadrado-cct-420x420-mm-doble-cara-switchcct.jpg"
    }
];

document.addEventListener('DOMContentLoaded', () => {
        mostrarProductes();
});

function mostrarProductes() {
    const container = document.getElementById('productes-container');
    productes.forEach(p => {
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

        const img = document.createElement('img');
        img.src = p.image;
        img.alt = p.name;
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
    const producte = productes.find(p => p.id === id);
    let carret = JSON.parse(localStorage.getItem('carret')) || [];
    const index = carret.findIndex(p => p.id === id);

    if (index >= 0) {
        carret[index].quantity++;
    } else {
        carret.push({ ...producte, quantity: 1 });
    }

    localStorage.setItem('carret', JSON.stringify(carret));
    alert("Producte afegit!");
}