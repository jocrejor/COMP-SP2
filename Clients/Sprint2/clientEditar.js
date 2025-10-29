document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const index = params.get("index");

    const clients = JSON.parse(localStorage.getItem("Client"));
    const client = clients[index];

    document.getElementById("name").value = client.name;
    document.getElementById("surname").value = client.surname;
    document.getElementById("email").value = client.email;
    document.getElementById("phone").value = client.phone;
    document.getElementById("address").value = client.address;

    document.getElementById("formEditar").addEventListener("submit", (e) => {
        e.preventDefault();

        clients[index].name = name.value;
        clients[index].surname = surname.value;
        clients[index].email = email.value;
        clients[index].phone = phone.value;
        clients[index].address = address.value;

        localStorage.setItem("Client", JSON.stringify(clients));
        alert("Client actualitzat correctament!");
        window.location.href = "clientLlistar.html";
    });
});

