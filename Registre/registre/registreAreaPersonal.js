let client = null;

document.addEventListener("DOMContentLoaded", main);

function main(){
    // Carrega el client del localStorage
    client = JSON.parse(localStorage.getItem("client") || "null");

    if (client) {
        carregaDades();
    } else {
        console.log("No hay cliente en localStorage");
    }

    // Botón modificar 
    document.getElementById("modificar").addEventListener("click", () => {
        if (!client) {
            alert("No hay ningún cliente registrado.");
            return;
        }

        localStorage.setItem("modificar", JSON.stringify(client));
        window.location.href = "./registreModificar.html";
    });

    // Botón "Torna"
    document.getElementById("torna").addEventListener("click", () => {
        window.location.href = "../registreCrear.html";
    });
}

function carregaDades(){
    // Inputs normales
    document.getElementById("id").value = client.id || "";
    document.getElementById("name").value = client.name || "";
    document.getElementById("surname").value = client.surname || "";
    document.getElementById("taxidtype_display").value = client.taxidtype || "";
    document.getElementById("taxid").value = client.taxid || "";
    document.getElementById("birth_date").value = client.birth_date || "";
    document.getElementById("phone").value = client.phone || "";
    document.getElementById("email").value = client.email || "";
    document.getElementById("address").value = client.address || "";
    document.getElementById("cp").value = client.cp || "";

    // Selects
    // País
    for (let i = 0; i < Country.length; i++) {
        if (Country[i].id == client.country_id) {
            document.getElementById("country_display").value = Country[i].name;
            break; 
        }
    }

    // Provincia
    for (let i = 0; i < Province.length; i++) {
        if (Province[i].id == client.province_id) {
            document.getElementById("province_display").value = Province[i].name;
            break;
        }
    }

    // Ciutat
    for (let i = 0; i < City.length; i++) {
        if (City[i].id == client.city_id) {
            document.getElementById("city_display").value = City[i].name;
            break;
        }
    }
}