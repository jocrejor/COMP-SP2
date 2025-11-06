document.addEventListener("DOMContentLoaded", main);

function main() {
    const infoDiv = document.querySelector("#infoClient");

    // Carregar Clients de la BBDD
    function carregarClientsBbdd() {
        if (typeof Client !== "undefined" && Array.isArray(Client)) {
            return Client;
        }
        return [];
    }

    // Obtindre ID de la URL
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get("id");

    function mostrarInfo() {
        const clients = carregarClientsBbdd();

        // Netejar contingut anterior
        while (infoDiv.firstChild) infoDiv.removeChild(infoDiv.firstChild);

        // Buscar el client
        const client = clients.find(c => c.id == clientId);

        if (!client) {
            const pError = document.createElement("p");
            pError.appendChild(document.createTextNode("ERROR. Client no trobat."));
            infoDiv.appendChild(pError);
            return;
        }

        // Informació del client
        const dades = {
            "ID": client.id,
            "Tipus d'identificació": client.taxidtype,
            "Identificador": client.taxid,
            "Nom": client.name,
            "Cognom": client.surname,
            "Email": client.email,
            "Contrasenya": client.password,
            "Telèfon": client.phone,
            "Aniversari": client.birth_date,
            "Adreça": client.address,
            "CP": client.cp,
            "ID País": client.country_id,
            "ID Província": client.province_id,
            "ID Ciutat": client.city_id
        };

        for (const [clau, valor] of Object.entries(dades)) {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.appendChild(document.createTextNode(clau + ": "));
            const textNode = document.createTextNode(valor ?? "-");
            p.appendChild(strong);
            p.appendChild(textNode);
            infoDiv.appendChild(p);
        }
    }

    mostrarInfo();
}
