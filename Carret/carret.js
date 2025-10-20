// Función principal para mostrar el carrito y gestionar las acciones
function mostrarCarret() {
    // Obtiene el carrito del localStorage o crea un array vacío si no existe
    const carret = JSON.parse(localStorage.getItem('carret')) || [];
    const elementsCarret = document.getElementById('elementsCarret');
    const totalSpan = document.getElementById('total');
    let total = 0;

    // Si el carrito está vacío, muestra el mensaje y oculta el contenido
    if (!carret.length) {
        document.getElementById('carretBuit').style.display = 'block';
        document.getElementById('contingutCarret').style.display = 'none';
        return;
    }

    // Si hay productos, muestra el contenido del carrito
    document.getElementById('carretBuit').style.display = 'none';
    document.getElementById('contingutCarret').style.display = 'block';

    // Genera dinámicamente el HTML de cada producto en el carrito
    // Incluye botones para aumentar, disminuir cantidad o eliminar un producto
    elementsCarret.innerHTML = carret.map((p, i) => `
        <div>
            <img src="${p.image}" alt="${p.name}" width="60" height="60">
            <span>${p.name}</span>
            <span>${p.price.toFixed(2)} €</span>
            <span>
                <button data-i="${i}" onclick="restar(${i})">-</button>
                <span>${p.quantity}</span>
                <button data-i="${i}" onclick="sumar(${i})">+</button>
            </span>
            <button data-i="${i}" onclick="eliminar(${i})">✖</button>
        </div>
    `).join('');

    // Calcula el total del carrito sumando el precio por cantidad de cada producto
    total = carret.reduce((s, p) => s + p.price * p.quantity, 0);
    totalSpan.textContent = `${total.toFixed(2)} €`;
}

// Funciones para modificar el carrito

// Incrementa en 1 la cantidad del producto seleccionado
function sumar(index) {
    const carret = JSON.parse(localStorage.getItem('carret')) || [];
    carret[index].quantity++;
    localStorage.setItem('carret', JSON.stringify(carret));
    mostrarCarret(); // Se actualiza la vista del carrito
}

// Disminuye en 1 la cantidad del producto seleccionado (siempre que sea mayor a 1)
function restar(index) {
    const carret = JSON.parse(localStorage.getItem('carret')) || [];
    if (carret[index].quantity > 1) {
        carret[index].quantity--;
        localStorage.setItem('carret', JSON.stringify(carret));
        mostrarCarret(); // Se actualiza la vista del carrito
    }
}

// Elimina completamente el producto seleccionado del carrito
function eliminar(index) {
    const carret = JSON.parse(localStorage.getItem('carret')) || [];
    carret.splice(index, 1); // Quita el elemento del array
    localStorage.setItem('carret', JSON.stringify(carret));
    mostrarCarret(); // Se actualiza la vista del carrito
}

// Muestra el carrito automáticamente cuando la página termina de cargarse
document.addEventListener('DOMContentLoaded', mostrarCarret);

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

    const container = document.getElementById('productes-container');

    productes.forEach(p => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p><strong>${p.name}</strong></p>
            <p>${p.description}</p>
            <p>Preu: ${p.price.toFixed(2)} €</p>
            <img src="${p.image}" alt="${p.name}" width="120" height="120">
            <br>
            <button onclick="afegirAlCarret(${p.id})">Afegir al carret</button>
            <hr>
        `;
        container.appendChild(div);
    });
}