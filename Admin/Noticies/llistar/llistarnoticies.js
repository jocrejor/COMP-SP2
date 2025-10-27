document.addEventListener("DOMContentLoaded", main);

function main () {
    carregardadeslocal();
    document.getElementById("enviar").addEventListener("click", anarcrear);
}

function anarcrear () {
    window.location.href = "../crear/crearnoticies.html";

}

function carregardadeslocal () {
    let noticies   = JSON.parse(localStorage.getItem("noticies")) || [];
    let contenedor = document.getElementById("llistatnoticies");
    contenedor.innerHTML = ""; // 🔧 evita duplicats al tornar a carregar

    if (noticies.length === 0) {
        contenedor.textContent = "No hi ha notícies guardades.";
        return;
    }

    noticies.forEach(function (noticia) {
        let parrafo = document.createElement("p");
        parrafo.style.whiteSpace = "pre-line";
        parrafo.textContent =
            `ID: ${noticia.id}\nTítol: ${noticia.title}\nSubtítol: ${noticia.description}\nContingut: ${noticia.body}\nData: ${noticia.date}\nID categoria: ${noticia.id_category}\nID usuari: ${noticia.id_user}\nID imatge associada: ${noticia.id_image}\n\n`;

        let btnModificar = document.createElement("button");
        btnModificar.textContent = "Modificar";
        btnModificar.addEventListener("click", function () {
            editarNoticia(noticia.id);
        });

        let btnEliminar = document.createElement("button");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener("click", function () {
            eliminarNoticia(noticia.id);
        });

        parrafo.appendChild(btnModificar);
        parrafo.appendChild(btnEliminar);
        contenedor.appendChild(parrafo);
    });
}


function eliminarNoticia (id) {
    if (confirm("Segur que vols eliminar aquesta notícia?")) {
        let noticies = JSON.parse(localStorage.getItem("noticies")) || [];
        noticies = noticies.filter(noticia => noticia.id !== id);
        localStorage.setItem("noticies", JSON.stringify(noticies));
        carregardadeslocal();
    }
}

function editarNoticia (id) {
    localStorage.setItem("indiceEdicion", id);
    window.location.href = "../modificar/modificarnoticies.html";
}
