document.addEventListener("DOMContentLoaded", main);

function main() {
    const params = new URLSearchParams(window.location.search);
    const idParam = parseInt(params.get("id"), 10);

    if (isNaN(idParam)) {
        showError("ID de client invàlid.");
        return;
    }

    const clients = JSON.parse(localStorage.getItem("Client")) || [];
    const client = clients.find(c => c.id === idParam);

    if (!client) {
        showError("Client no trobat.");
        return;
    }

    mostrarDetallsClient(client);

    const orders = getArrayFromLSorGlobal("Order");
    const comparators = getArrayFromLSorGlobal("Comparator");
    const carts = getArrayFromLSorGlobal("Cart");

    const dependencias =
        (orders?.some(o => o.client_id === idParam) ||
         comparators?.some(c => c.client_id === idParam) ||
         carts?.some(c => c.client_id === idParam));

    const confirmar = document.getElementById("confirmar");
    const cancelar = document.getElementById("cancelar");
    const missatge = document.getElementById("missatge");

    if (dependencias) {
        missatge.textContent = "⚠️ No es pot eliminar el client perquè té dependències actives.";
        confirmar.disabled = true;
    } else {
        missatge.textContent = `Vols eliminar el client ${client.name} ${client.surname}?`;
        confirmar.addEventListener("click", () => {
            const idx = clients.findIndex(c => c.id === idParam);
            clients.splice(idx, 1);
            localStorage.setItem("Client", JSON.stringify(clients));
            alert("Client eliminat correctament!");
            window.location.href = "clientLlistar.html";
        });
    }

    cancelar.addEventListener("click", () => window.location.href = "clientLlistar.html");
}

function mostrarDetallsClient(c) {
    document.getElementById("detallsClient").innerHTML = `
        <p><strong>ID:</strong> ${c.id}</p>
        <p><strong>Nom:</strong> ${c.name} ${c.surname}</p>
        <p><strong>Email:</strong> ${c.email}</p>
        <p><strong>Telèfon:</strong> ${c.phone}</p>
    `;
}

function getArrayFromLSorGlobal(name) {
    try {
        return JSON.parse(localStorage.getItem(name)) || window[name] || [];
    } catch {
        return window[name] || [];
    }
}

function showError(msg) {
    document.getElementById("contenedor").innerHTML =
        `<p style="color:red">${msg}</p><button onclick="window.location.href='clientLlistar.html'">Tornar</button>`;
}

