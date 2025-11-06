document.addEventListener("DOMContentLoaded", main);

function main() {
    carregardadeslocal();
    document.getElementById("enviar").addEventListener("click", anarcrear);
}

function anarcrear() {
    window.location.href = "../crear/crearnoticies.html";
}

function carregardadeslocal() {
    let noticies = JSON.parse(localStorage.getItem("noticies")) || [];
    let contenedor = document.getElementById("llistatnoticies");

    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }

    if (noticies.length === 0) {
        let missatge = document.createElement("p");
        missatge.appendChild(document.createTextNode("No hi ha notícies guardades."));
        contenedor.appendChild(missatge);
        return;
    }

    noticies.forEach(function (noticia) {
        let parrafo = document.createElement("p");

        parrafo.style.whiteSpace = "pre-line";

        let text = document.createTextNode(
            `ID: ${noticia.id}\n` +
            `Títol: ${noticia.title}\n` +
            `Subtítol: ${noticia.description}\n` +
            `Contingut: ${noticia.body}\n` +
            `Data: ${noticia.date}\n` +
            `ID categoria: ${noticia.id_category}\n` +
            `ID usuari: ${noticia.id_user}\n` +
            `ID imatge associada: ${noticia.id_image}\n\n`
        );

        parrafo.appendChild(text);

        // Botón "Modificar"
        let btnModificar = document.createElement("button");

        btnModificar.appendChild(document.createTextNode("Modificar"));
        btnModificar.addEventListener("click", function () {
            editarNoticia(noticia.id);
        });

        // Botón "Eliminar"
        let btnEliminar = document.createElement("button");

        btnEliminar.appendChild(document.createTextNode("Eliminar"));
        btnEliminar.addEventListener("click", function () {
            eliminarNoticia(noticia.id);
        });

        // Añadir botones al párrafo
        parrafo.appendChild(document.createElement("br"));
        parrafo.appendChild(btnModificar);
        parrafo.appendChild(btnEliminar);

        // Añadir la noticia al contenedor
        contenedor.appendChild(parrafo);
    });
}

function eliminarNoticia(id) {
    if (confirm("Segur que vols eliminar aquesta notícia?")) {
        let noticies = JSON.parse(localStorage.getItem("noticies")) || [];

        noticies = noticies.filter(noticia => noticia.id !== id);
        localStorage.setItem("noticies", JSON.stringify(noticies));
        carregardadeslocal();
    }
}

function editarNoticia(id) {
    localStorage.setItem("indiceEdicion", id);
    window.location.href = "../modificar/modificarnoticies.html";
}
