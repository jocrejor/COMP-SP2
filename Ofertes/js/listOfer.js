document.addEventListener("DOMContentLoaded", main);

function main() {
    const cosTaula = document.getElementById('tableBody');
    const contenidorPaginacio = document.createElement('div');
    contenidorPaginacio.className = 'pagination';

    let dades = JSON.parse(localStorage.getItem("formData")) || [];
    let paginaActual = 1;
    const elementsPerPagina = 10;

    function carregarOfertesBbdd() {
        const local = localStorage.getItem("Sale");
        if (local) return JSON.parse(local);
        if (typeof Sale !== "undefined" && Array.isArray(Sale)) {
            localStorage.setItem("Sale", JSON.stringify(Sale));
            return Sale.slice();
        }
        return [];
    }
    if (dades.length === 0) {
        const ofertesBbdd = carregarOfertesBbdd();
        if (ofertesBbdd.length > 0) {
            dades = ofertesBbdd.map(function (venda) {
                return {
                    oferta: venda.description,
                    percentaje: venda.discount_percent,
                    dataInici: venda.start_date.split(' ')[0],
                    dataFi: venda.end_date.split(' ')[0],
                    coupon: venda.coupon || ""
                };
            });
            localStorage.setItem("formData", JSON.stringify(dades));
        }
    }

    function guardarDadesLocalStorage() {
        localStorage.setItem("formData", JSON.stringify(dades));
    }

    function eliminarDada(index) {
        if (confirm("Estàs segur que vols eliminar aquesta oferta?")) {
            dades.splice(index, 1);
            guardarDadesLocalStorage();
            renderitzarTaula();
        }
    }

    function renderitzarTaula() {
        if (!cosTaula) return;

        while (cosTaula.firstChild) {
            cosTaula.removeChild(cosTaula.firstChild);
        }

        if (dades.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");
            celda.setAttribute("colspan", "8");
            celda.className = 'no-data';
            celda.appendChild(document.createTextNode("No hi ha ofertes registrades"));
            fila.appendChild(celda);
            cosTaula.appendChild(fila);
            return;
        }

        const indexInici = (paginaActual - 1) * elementsPerPagina;
        const indexFi = indexInici + elementsPerPagina;
        const elementsActuals = dades.slice(indexInici, indexFi);

        elementsActuals.forEach(function (element, index) {
            const indexGlobal = indexInici + index;
            const fila = document.createElement("tr");
            const celdaId = document.createElement("td");
            const celdaOferta = document.createElement("td");
            const celdaPercentatge = document.createElement("td");
            const celdaDataInici = document.createElement("td");
            const celdaDataFi = document.createElement("td");
            const celdaCupo = document.createElement("td");
            const celdaAccio = document.createElement("td");
            const celdaProductes = document.createElement("td");

            const botoEditar = document.createElement("button");
            const botoEliminar = document.createElement("button");
            const botoProductesAplicats = document.createElement("button");

            celdaId.appendChild(document.createTextNode(indexGlobal + 1));
            celdaOferta.appendChild(document.createTextNode(element.oferta));
            celdaPercentatge.appendChild(document.createTextNode(element.percentaje + "%"));
            celdaDataInici.appendChild(document.createTextNode(element.dataInici));
            celdaDataFi.appendChild(document.createTextNode(element.dataFi));
            celdaCupo.appendChild(document.createTextNode(element.coupon || "-"));

            botoEditar.appendChild(document.createTextNode("Editar"));
            botoEliminar.appendChild(document.createTextNode("Eliminar"));
            botoProductesAplicats.appendChild(document.createTextNode("Productes aplicats"));

            botoEditar.addEventListener("click", function () {
                editarDada(indexGlobal);
            });

            botoEliminar.addEventListener("click", function () {
                eliminarDada(indexGlobal);
            });

            botoProductesAplicats.addEventListener("click", function () {
                anarAProductes(indexGlobal);
            });

            celdaAccio.appendChild(botoEditar);
            celdaAccio.appendChild(botoEliminar);
            celdaProductes.appendChild(botoProductesAplicats);

            fila.appendChild(celdaId);
            fila.appendChild(celdaOferta);
            fila.appendChild(celdaPercentatge);
            fila.appendChild(celdaDataInici);
            fila.appendChild(celdaDataFi);
            fila.appendChild(celdaCupo);
            fila.appendChild(celdaAccio);
            fila.appendChild(celdaProductes);

            cosTaula.appendChild(fila);
        });

        renderitzarPaginacio();
    }

    function renderitzarPaginacio() {
        const totalPagines = Math.ceil(dades.length / elementsPerPagina);

        while (contenidorPaginacio.firstChild) {
            contenidorPaginacio.removeChild(contenidorPaginacio.firstChild);
        }

        if (totalPagines <= 1) return;

        const botoAnterior = document.createElement("button");
        botoAnterior.appendChild(document.createTextNode("« Anterior"));
        botoAnterior.disabled = paginaActual === 1;
        botoAnterior.addEventListener("click", function () {
            if (paginaActual > 1) {
                paginaActual--;
                renderitzarTaula();
            }
        });
        contenidorPaginacio.appendChild(botoAnterior);

        for (let i = 1; i <= totalPagines; i++) {
            const botoPagina = document.createElement("button");
            botoPagina.appendChild(document.createTextNode(i));
            if (i === paginaActual) {
                botoPagina.className = 'active';
            }
            botoPagina.addEventListener("click", function () {
                paginaActual = i;
                renderitzarTaula();
            });
            contenidorPaginacio.appendChild(botoPagina);
        }

        const botoSegüent = document.createElement("button");
        botoSegüent.appendChild(document.createTextNode("Següent »"));
        botoSegüent.disabled = paginaActual === totalPagines;
        botoSegüent.addEventListener("click", function () {
            if (paginaActual < totalPagines) {
                paginaActual++;
                renderitzarTaula();
            }
        });
        contenidorPaginacio.appendChild(botoSegüent);

        const info = document.createElement("span");
        info.className = 'pagination-info';
        info.appendChild(document.createTextNode(
            `Pàgina ${paginaActual} de ${totalPagines} - ${dades.length} ofertes`
        ));
        contenidorPaginacio.appendChild(info);

        if (!contenidorPaginacio.parentNode) {
            cosTaula.parentNode.parentNode.appendChild(contenidorPaginacio);
        }
    }

    function anarAProductes(index) {
        window.location.href = `productsList.html?oferta=${index}`;
    }

    function editarDada(index) {
        window.location.href = `edit.html?edit=${index}`;
    }

    renderitzarTaula();
}

