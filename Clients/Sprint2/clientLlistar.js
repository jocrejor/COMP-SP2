document.addEventListener("DOMContentLoaded", main);

function main() {

    console.log(Client);
    let clientBBDD = JSON.parse(localStorage.getItem("Client")) || localStorage.setItem("Client", JSON.stringify(Client)) ;
    cargarClients(clientBBDD);
}


function cargarClients(clients) {
    let taulaClients = document.getElementById("taulaClients");

    clients.forEach(client => {
        let fila = document.createElement("tr");

        let celId = document.createElement("td");
        let txtId = document.createTextNode(client.id);
        celId.appendChild(txtId);
        fila.appendChild(celId);



       taulaClients.appendChild(fila); 
    });
}   

