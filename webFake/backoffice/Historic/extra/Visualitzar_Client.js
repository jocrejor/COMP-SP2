document.addEventListener("DOMContentLoaded", main)

function main() {
    const tbody = document.querySelector("#taulaClient tbody");

    // Carregar clients de la BBDD
    function carregarClientBbdd() {
        if (typeof Client !== "undefined" && Array.isArray(Client)) {
            return Client;
        }
        return [];
    }

    // Obtindre ID de la URL
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get("id");

    function mostrarTaula() {
        const clients = carregarClientBbdd();

        // Netejar tbody
        while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

        // Buscar client
        const client = clients.find(c => c.id == clientId);

        if (!client) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 14;
            td.textContent = "Client no trobat.";
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        //Mostrar camps a la taula
        const tr = document.createElement("tr");

        const camps = [
            client.id,
            client.taxidtype,
            client.taxid,
            client.name,
            client.surname,
            client.email,
            client.password,
            client.phone,
            client.birth_date,
            client.address,
            client.cp,
            client.country_id,
            client.province_id,
            client.city_id
        ];

        camps.forEach(valor => {
            const td = document.createElement("td");
            td.textContent = valor ?? "-";
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    }

    mostrarTaula();
}
