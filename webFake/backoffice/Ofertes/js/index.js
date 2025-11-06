document.addEventListener("DOMContentLoaded", main);

// Funció principal que inicialitza la llista d'ofertes
// Gestiona la visualització de les ofertes en una taula paginada
function main() {
    const cosTaula                = document.getElementById('tableBody');
    const contenidorPaginacio     = document.createElement('div');
    contenidorPaginacio.className = 'pagination';

    // Obtindre les dades guardades en localStorage o inicialitzar un array buit
    let dades = JSON.parse(localStorage.getItem("formData")) || [];
    let dadesFiltrades = [...dades];
    let paginaActual = 1;
    const elementsPerPagina = 10;

    // Elementos de filtro
    const filterName      = document.getElementById('filterName');
    const filterDateStart = document.getElementById('filterDateStart');
    const filterDateEnd   = document.getElementById('filterDateEnd');
    const applyFilter     = document.getElementById('applyFilter');
    const clearFilter     = document.getElementById('clearFilter');

    // Funció per a carregar les ofertes des de la base de dades
    // Si existeixen en localStorage, les retorna
    // Si no, utilitza les dades predefinides de 'Sale' si estan disponibles
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
            dadesFiltrades = [...dades];
        }
    }

    // Funció per a guardar les dades en localStorage
    // Actualitza l'emmagatzematge local amb l'estat actual de les ofertes
    function guardarDadesLocalStorage() {
        localStorage.setItem("formData", JSON.stringify(dades));
        dadesFiltrades = [...dades];
    }

    // Funció per a eliminar una oferta específica
    // Demana confirmació abans d'eliminar i actualitza la vista
    function eliminarDada(index) {
        if (confirm("Estàs segur que vols eliminar aquesta oferta?")) {
            dades.splice(index, 1);
            guardarDadesLocalStorage();
            aplicarFiltres();
        }
    }

    // Funció per a aplicar filtros
    function aplicarFiltres() {
        const nomFiltre       = filterName.value.toLowerCase().trim();
        const dataIniciFiltre = filterDateStart.value;
        const dataFiFiltre    = filterDateEnd.value;

        dadesFiltrades = dades.filter(function(oferta) {
            // Filtrar por nombre
            if (nomFiltre && !oferta.oferta.toLowerCase().includes(nomFiltre)) {
                return false;
            }

            // Filtrar por fecha de inicio
            if (dataIniciFiltre && oferta.dataInici !== dataIniciFiltre) {
                return false;
            }

            // Filtrar por fecha de fin
            if (dataFiFiltre && oferta.dataFi !== dataFiFiltre) {
                return false;
            }

            return true;
        });

        paginaActual = 1;
        renderitzarTaula();
    }

    // Función para limpiar filtros
    function netejarFiltres() {
        filterName.value      = '';
        filterDateStart.value = '';
        filterDateEnd.value   = '';
        dadesFiltrades        = [...dades];
        paginaActual          = 1;
        renderitzarTaula();
    }

    // Event listeners para filtros
    if (applyFilter) {
        applyFilter.addEventListener('click', aplicarFiltres);
    }

    if (clearFilter) {
        clearFilter.addEventListener('click', netejarFiltres);
    }

    // También permitir filtrar con Enter en el campo de nombre
    if (filterName) {
        filterName.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                aplicarFiltres();
            }
        });
    }

    // Funció principal per a mostrar les ofertes en la taula
    // Gestiona la paginació i la visualització de totes les ofertes
    // Si no hi ha ofertes, mostra un missatge indicant-ho
    function renderitzarTaula() {
        if (!cosTaula) return;

        while (cosTaula.firstChild) {
            cosTaula.removeChild(cosTaula.firstChild);
        }

        if (dadesFiltrades.length === 0) {
            const fila  = document.createElement("tr");
            const celda = document.createElement("td");
            celda.setAttribute("colspan", "8");
            celda.className = 'no-data';
            
            let missatge = "No hi ha ofertes registrades";
            if (dades.length > 0 && dadesFiltrades.length === 0) {
                missatge = "No s'han trobat ofertes que coincideixin amb els filtres";
            }
            
            celda.appendChild(document.createTextNode(missatge));
            fila.appendChild(celda);
            cosTaula.appendChild(fila);
            return;
        }

        const indexInici = (paginaActual - 1) * elementsPerPagina;
        const indexFi = indexInici + elementsPerPagina;
        const elementsActuals = dadesFiltrades.slice(indexInici, indexFi);

        elementsActuals.forEach(function (element, index) {
            const indexGlobal      = dades.indexOf(element);
            const fila             = document.createElement("tr");
            const celdaId          = document.createElement("td");
            const celdaOferta      = document.createElement("td");
            const celdaPercentatge = document.createElement("td");
            const celdaDataInici   = document.createElement("td");
            const celdaDataFi      = document.createElement("td");
            const celdaCupo        = document.createElement("td");
            const celdaAccio       = document.createElement("td");
            const celdaProductes   = document.createElement("td");

            const botoEditar            = document.createElement("button");
            const botoEliminar          = document.createElement("button");
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

    // Funció per a crear i mostrar els controls de paginació
    // Crea els botons de navegació i mostra informació sobre la pàgina actual
    // Inclou botons "Anterior" i "Següent", números de pàgina i comptador d'ofertes
    function renderitzarPaginacio() {
        const totalPagines = Math.ceil(dadesFiltrades.length / elementsPerPagina);

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

        const info     = document.createElement("span");
        info.className = 'pagination-info';
        info.appendChild(document.createTextNode(
            `Pàgina ${paginaActual} de ${totalPagines} - ${dadesFiltrades.length} ofertes (${dades.length} totals)`
        ));
        contenidorPaginacio.appendChild(info);

        if (!contenidorPaginacio.parentNode) {
            cosTaula.parentNode.parentNode.appendChild(contenidorPaginacio);
        }
    }

    function anarAProductes(index) {
        window.location.href = `ProducteLlistar.html?oferta=${index}`;
    }

    function editarDada(index) {
        window.location.href = `OfertaModificar.html?edit=${index}`;
    }

    renderitzarTaula();
}
