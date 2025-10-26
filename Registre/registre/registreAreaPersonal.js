document.addEventListener("DOMContentLoaded", main);

let client = null;
let clients = [];

function main(){
    // Carreguem els usuaris del localstorage
    clients = JSON.parse(localStorage.getItem ("clients") || []);

    client = clients[0];

    if(client){
        carregaDades ();
    }

    document.getElementById("modificar").addEventListener("click", () => {
    const clients = JSON.parse(localStorage.getItem("clients") || "[]");

    if (clients.length === 0) {
        alert("No hi ha cap client registrat.");
        return;
    }

    const client = clients[clients.length - 1];
    localStorage.setItem("modificar", JSON.stringify(client));

    window.location.href = "./registreModificar.html";
})
}

function carregaDades(){
    // Inputs normals
    document.getElementById("id").value = client.id;
    document.getElementById("name").value = client.name;
    document.getElementById("surname").value = client.surname;
    document.getElementById("taxidtype_display").value = client.taxidtype;
    document.getElementById("taxid").value = client.taxid;
    document.getElementById("birth_date").value = client.birth_date;
    document.getElementById("phone").value = client.phone;
    document.getElementById("email").value = client.email;
    document.getElementById("address").value = client.address;
    document.getElementById("cp").value = client.cp;

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


