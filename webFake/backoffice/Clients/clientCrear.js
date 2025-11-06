document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem("Client")) {
        localStorage.setItem("Client", JSON.stringify(Client));
    }

    carregarPaisos();

    document.getElementById("country").addEventListener("change", e => {
        carregarProvincies(parseInt(e.target.value));
        document.getElementById("city").innerHTML = "<option value=''>-- Selecciona una ciutat --</option>";
    });

    document.getElementById("province").addEventListener("change", e => {
        carregarCiutats(parseInt(e.target.value));
    });

    document.getElementById("formCrear").addEventListener("submit", crearClient);
});

function carregarPaisos() {
    const sel = document.getElementById("country");
    sel.innerHTML = "<option value=''>-- Selecciona un país --</option>";
    Country.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        sel.appendChild(opt);
    });
}

function carregarProvincies(countryId) {
    const sel = document.getElementById("province");
    sel.innerHTML = "<option value=''>-- Selecciona una província --</option>";
    Province.filter(p => p.country_id === countryId).forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = p.name;
        sel.appendChild(opt);
    });
}

function carregarCiutats(provinceId) {
    const sel = document.getElementById("city");
    sel.innerHTML = "<option value=''>-- Selecciona una ciutat --</option>";
    City.filter(c => c.id_state === provinceId).forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id;
        opt.textContent = c.name;
        sel.appendChild(opt);
    });
}

function crearClient(e) {
    e.preventDefault();
    const clients = JSON.parse(localStorage.getItem("Client")) || [];
    const email = document.getElementById("email").value.trim();

    if (clients.some(c => c.email === email)) {
        alert("⚠️ Ja existeix un client amb aquest email!");
        return;
    }

    const nouId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;

    const nouClient = {
        id: nouId,
        taxidtype: document.getElementById("taxidtype").value,
        taxid: document.getElementById("taxid").value,
        name: document.getElementById("name").value,
        surname: document.getElementById("surname").value,
        email: email,
        password: "1234",
        phone: document.getElementById("phone").value,
        birth_date: document.getElementById("birth_date").value,
        address: document.getElementById("address").value,
        cp: document.getElementById("cp").value,
        country_id: parseInt(document.getElementById("country").value),
        province_id: parseInt(document.getElementById("province").value),
        city_id: parseInt(document.getElementById("city").value)
    };

    clients.push(nouClient);
    localStorage.setItem("Client", JSON.stringify(clients));
    alert("✅ Client creat correctament!");
    window.location.href = "clientLlistar.html";
}

