document.addEventListener("DOMContentLoaded", main);

function main() {
    // Inicialitzar dades si no hi són
    if (!localStorage.getItem("Client")) {
        localStorage.setItem("Client", JSON.stringify(Client));
    }

    const clients = JSON.parse(localStorage.getItem("Client"));
    carregarClients(clients);
}

function carregarClients(clients) {
    const taula = document.getElementById("taulaClients");
    taula.innerHTML = "";

    clients.forEach(client => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${client.id}</td>
            <td>${client.name}</td>
            <td>${client.surname}</td>
            <td>${client.address}</td>
            <td>${client.phone}</td>
            <td>${client.email}</td>
            <td>
                <button onclick="window.location.href='clientEditar.html?id=${client.id}'">✏️ Editar</button>
                <button onclick="window.location.href='clientEliminar.html?id=${client.id}'">🗑️ Eliminar</button>
            </td>
        `;

        taula.appendChild(fila);
    });
}
