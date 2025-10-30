document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const idParam = parseInt(params.get("id"), 10);

    const clients = JSON.parse(localStorage.getItem("Client"));
    const client = clients.find(c => c.id === idParam);
    if (!client) {
        alert("Client no trobat!");
        window.location.href = "clientLlistar.html";
        return;
    }

    // Omplir camps
    document.getElementById("id").value = client.id;
    document.getElementById("name").value = client.name;
    document.getElementById("surname").value = client.surname;
    document.getElementById("email").value = client.email;
    document.getElementById("phone").value = client.phone;
    document.getElementById("address").value = client.address;
    document.getElementById("cp").value = client.cp;

    document.getElementById("formEditar").addEventListener("submit", e => {
        e.preventDefault();

        const idx = clients.findIndex(c => c.id === idParam);
        clients[idx] = {
            ...client,
            name: document.getElementById("name").value,
            surname: document.getElementById("surname").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            address: document.getElementById("address").value,
            cp: document.getElementById("cp").value
        };

        localStorage.setItem("Client", JSON.stringify(clients));
        alert("✅ Client actualitzat correctament!");
        window.location.href = "clientLlistar.html";
    });
});

