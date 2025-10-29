document.addEventListener("DOMContentLoaded", main);

function main() {
    // Inicialitzar dades si no existeixen
    if (!localStorage.getItem("Client")) {
        localStorage.setItem("Client", JSON.stringify(Client));
    }

    const clients = JSON.parse(localStorage.getItem("Client"));
    carregarClients(clients);
}

function carregarClients(clients) {
    const taula = document.getElementById("taulaClients");
    taula.innerHTML = "";

    clients.forEach((client, index) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${index}</td>
            <td>${client.name}</td>
            <td>${client.surname}</td>
            <td>${client.address}</td>
            <td>${client.phone}</td>
            <td>${client.email}</td>
            <td>${getCountryName(client.country_id)}</td>
            <td>${getProvinceName(client.province_id)}</td>
            <td>${getCityName(client.city_id)}</td>
            <td>
                <button onclick="editarClient(${index})">✏️</button>
                <button onclick="eliminarClient(${index})">🗑️</button>
            </td>
        `;
        taula.appendChild(fila);
    });
}

function getCountryName(id) {
    const country = Country.find(c => c.id === id);
    return country ? country.name : "-";
}

function getProvinceName(id) {
    const province = Province.find(p => p.id === id);
    return province ? province.name : "-";
}

function getCityName(id) {
    const city = City.find(c => c.id === id);
    return city ? city.name : "-";
}

function editarClient(index) {
    window.location.href = `clientEditar.html?index=${index}`;
}

function eliminarClient(index) {
    window.location.href = `clientEliminar.html?index=${index}`;
}

