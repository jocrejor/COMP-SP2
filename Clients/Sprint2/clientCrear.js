document.addEventListener("DOMContentLoaded", () => {
    carregarPaisos();

    const form = document.getElementById("formCrear");
    form.addEventListener("submit", crearClient);
});

function carregarPaisos() {
    const selectPais = document.getElementById("country");
    Country.forEach(pais => {
        const opt = document.createElement("option");
        opt.value = pais.id;
        opt.textContent = pais.name;
        selectPais.appendChild(opt);
    });
}

function crearClient(e) {
    e.preventDefault();

    let clients = JSON.parse(localStorage.getItem("Client")) || [];
    const nouClient = {
        id: clients.length + 1,
        name: name.value,
        surname: surname.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        country_id: parseInt(country.value),
        province_id: parseInt(province.value),
        city_id: parseInt(city.value)
    };

    clients.push(nouClient);
    localStorage.setItem("Client", JSON.stringify(clients));
    alert("Client creat correctament!");
    window.location.href = "clientLlistar.html";
}

