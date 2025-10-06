window.onload = iniciar;

function iniciar (){
    carregardadeslocal();
   document.getElementById("enviar").addEventListener("click", anarcrear);
 
}

function anarcrear(){
window.location.href = "../crear/crearimatges.html";

}
function carregardadeslocal() {
    let imatges = JSON.parse(localStorage.getItem("image")) || [];
    let contenedor = document.getElementById("llistatimatges");

    if (imatges.length === 0) {
        contenedor.textContent = "No hi ha imatges guardades.";
        return;
    }

    imatges.forEach(function(imatge, index){
        let parrafo = document.createElement("p");
        parrafo.style.whiteSpace = "pre-line";
        
        parrafo.textContent = `ID : ${imatge.id}\n  Nom: ${imatge.name}\n URL: ${imatge.url}\n Ordre: ${imatge.order}\n`;

        let btnModificar = document.createElement("button");
        btnModificar.textContent = "Modificar";
        btnModificar.addEventListener("click", function() {
            editarimatge(imatge.id);
        });

        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", function() {
            elinarimatge(imatge.id);
        });

        parrafo.appendChild(btnModificar);
        parrafo.appendChild(btnEliminar);

        contenedor.appendChild(parrafo);
       
    });

}

function elinarimatge(id) {
    if (confirm("Segur que vols eliminar aquesta imatge?")) {
        let imatges = JSON.parse(localStorage.getItem("image")) || [];
        imatges = imatges.filter(imatge => imatge.id !== id); 
        localStorage.setItem("image", JSON.stringify(imatges));
        carregardadeslocal();
    }
}
function editarimatge(id) {
    
    localStorage.setItem("indiceEdicionimg", id);
   window.location.href = "../modificar/modificarimatges.html";

}
