document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const index = params.get("index");

    const clients = JSON.parse(localStorage.getItem("Client"));
    const client = clients[index];
    const missatge = document.getElementById("missatge");

    // Comprovar si el client té ordres, comparadors o carret
    const orders = Order.filter(o => o.client_id === client.id);
    const comparators = Comparator.filter(c => c.client_id === client.id);
    const carts = Cart.filter(c => c.client_id === client.id);

    if (orders.length > 0 || comparators.length > 0 || carts.length > 0) {
        missatge.textContent = "⚠️ No es pot eliminar aquest client perquè té dades associades (comandes, comparadors o carrets).";
        document.getElementById("confirmar").disabled = true;
    } else {
        missatge.textContent = `Vols eliminar el client ${client.name} ${client.surname}?`;
        document.getElementById("confirmar").addEventListener("click", () => {
            clients.splice(index, 1);
            localStorage.setItem("Client", JSON.stringify(clients));
            alert("Client eliminat correctament!");
            window.location.href = "clientLlistar.html";
        });
    }
});

