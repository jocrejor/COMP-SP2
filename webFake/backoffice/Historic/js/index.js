document.addEventListener("DOMContentLoaded", main);

function main() {
    const tbody = document.querySelector("#taulaResultat tbody");
    const btnAfegir = document.getElementById("afegirNou");

    const filtreClient = document.getElementById("filtreClient");
    const dataDesde = document.getElementById("dataDesde");
    const dataFins = document.getElementById("dataFins");
    const btnFiltrar = document.getElementById("btnFiltrar");
    const btnReset = document.getElementById("btnReset");

    // Variables per la paginació
    let paginaActual = 1;
    const regsPerPagina = 10;

    // Afegim el contenidor de la paginació sota la taula
    const paginacioContainer = document.createElement("div");
    paginacioContainer.id = "paginacio";
    paginacioContainer.style.marginTop = "15px";
    document.body.appendChild(paginacioContainer);

    // -----------------------------
    // FUNCIONS AUXILIARS
    // -----------------------------
    function carregarRegistresBbdd() {
        const local = localStorage.getItem("Register");
        if (local) return JSON.parse(local);
        else if (typeof Register !== "undefined" && Array.isArray(Register)) {
            localStorage.setItem("Register", JSON.stringify(Register));
            return Register.slice();
        } else return [];
    }

    function carregarClientBbdd() {
        if (typeof Client !== "undefined" && Array.isArray(Client)) return Client;
        return [];
    }

    function guardarLocal(regs) {
        localStorage.setItem("Register", JSON.stringify(regs));
    }

    // -----------------------------
    // PAGINACIÓ
    // -----------------------------
    function crearPaginacio(totalRegistres) {
        paginacioContainer.innerHTML = ""; // netegem

        const totalPagines = Math.ceil(totalRegistres / regsPerPagina);
        if (totalPagines <= 1) return; // si només hi ha una pàgina, no mostrem res

        const btnAnterior = document.createElement("button");
        btnAnterior.textContent = "« Anterior";
        btnAnterior.disabled = paginaActual === 1;
        btnAnterior.addEventListener("click", () => {
            if (paginaActual > 1) {
                paginaActual--;
                mostrarTaula(); // recarregar
            }
        });
        paginacioContainer.appendChild(btnAnterior);

        // Botons numèrics
        for (let i = 1; i <= totalPagines; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.style.margin = "0 3px";
            if (i === paginaActual) btn.disabled = true;
            btn.addEventListener("click", () => {
                paginaActual = i;
                mostrarTaula();
            });
            paginacioContainer.appendChild(btn);
        }

        const btnSeguent = document.createElement("button");
        btnSeguent.textContent = "Següent »";
        btnSeguent.disabled = paginaActual === totalPagines;
        btnSeguent.addEventListener("click", () => {
            if (paginaActual < totalPagines) {
                paginaActual++;
                mostrarTaula();
            }
        });
        paginacioContainer.appendChild(btnSeguent);
    }

    // -----------------------------
    // MOSTRAR TAULA
    // -----------------------------
    function mostrarTaula(filtres = {}) {
        const registres = carregarRegistresBbdd();
        const clients = carregarClientBbdd();

        while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

        let pagRegistres = registres;

        // ---- APLICAR FILTRES ----
        if (filtres.client || filtres.desde || filtres.fins) {
            pagRegistres = registres.filter((reg) => {
                let coincideix = true;

                // Filtro client
                if (filtres.client) {
                    const clientNom = clients.find((c) => c.id == reg.client_id);
                    const nomComplet = (clientNom ? `${clientNom.name} ${clientNom.surname}` : "").toLowerCase();
                    coincideix = coincideix && nomComplet.includes(filtres.client.toLowerCase());
                }

                // Filtro per data -- NO VA
                if (filtres.desde || filtres.fins) {
                    const dataReg = new Date(reg.date_start);
                    if (filtres.desde) {
                        const desdeDate = new Date(filtres.desde);
                        coincideix = coincideix && dataReg >= desdeDate;
                    }
                    if (filtres.fins) {
                        const finsDate = new Date(filtres.fins);
                        coincideix = coincideix && dataReg <= finsDate;
                    }
                }

                return coincideix;
            });
        }

        if (!pagRegistres || pagRegistres.length === 0) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 8;
            td.textContent = "No hi ha registres que coincideixin amb el filtre.";
            tr.appendChild(td);
            tbody.appendChild(tr);
            paginacioContainer.innerHTML = "";
            return;
        }

        //---Paginació .--------
        const inici = (paginaActual - 1) * regsPerPagina;
        const final = inici + regsPerPagina;
        const registresPagina = pagRegistres.slice(inici, final);

        // ---- MOSTRAR FILES ----
        registresPagina.forEach((registre, index) => {
            const fila = document.createElement("tr");

            const clientNom = clients.find((c) => c.id == registre.client_id) || null;

            const linkClient = document.createElement("a");
            linkClient.href = `extra/Visualitzar_Client.html?id=${registre.client_id}`;
            linkClient.textContent =
                (clientNom ? clientNom.name : "Desconegut") + " " + (clientNom ? clientNom.surname : "");

            const linkComparador = document.createElement("a");
            linkComparador.href = `extra/Visualitzar_Comp.html?id=${registre.comparator_id}`;
            linkComparador.textContent = registre.comparator_id ? `${registre.comparator_id}` : "-";

            const linkFavorit = document.createElement("a");
            linkFavorit.href = `extra/Visualitzar_Favorit.html?id=${registre.favorite_id}`;
            linkFavorit.textContent = registre.favorite_id ? `${registre.favorite_id}` : "-";

            const camps = [
                registre.session_id,
                registre.user_agent,
                linkClient,
                linkComparador,
                linkFavorit,
                registre.date_start,
                registre.date_end,
            ];

            camps.forEach((valor) => {
                const td = document.createElement("td");
                if (valor && valor.tagName === "A") {
                    td.appendChild(valor);
                } else if (valor && !isNaN(Date.parse(valor))) {
                    const fecha = new Date(valor);
                    td.textContent = fecha.toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    });
                } else {
                    td.textContent = valor ?? "-";
                }
                fila.appendChild(td);
            });

            const tdAccions = document.createElement("td");

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("accio", "editar");
            btnEditar.addEventListener("click", () => {
                // Hem de calcular l’índex global del registre (no només el de la pàgina)
                const indexGlobal = inici + index;
                sessionStorage.setItem("editIndex", indexGlobal);
                window.location.href = "./HistoricForm.html";
            });

            const btnEsborrar = document.createElement("button");
            btnEsborrar.textContent = "Esborrar";
            btnEsborrar.classList.add("accio", "eliminar");
            btnEsborrar.addEventListener("click", () => {
                if (!confirm("Vols esborrar aquest registre?")) return;
                const regs = carregarRegistresBbdd();
                const indexGlobal = inici + index;
                regs.splice(indexGlobal, 1);
                regs.forEach((r, i) => (r.id = i + 1));
                guardarLocal(regs);
                if ((paginaActual - 1) * regsPerPagina >= regs.length) paginaActual--;
                mostrarTaula();
            });

            tdAccions.appendChild(btnEditar);
            tdAccions.appendChild(btnEsborrar);
            fila.appendChild(tdAccions);
            tbody.appendChild(fila);
        });

        //Crear o actualitzar la paginació
        crearPaginacio(pagRegistres.length);
    }

    // -----------------------------
    // EVENTS
    // -----------------------------
    btnAfegir.addEventListener("click", () => {
        sessionStorage.removeItem("editIndex");
        window.location.href = "./HistoricForm.html";
    });

    btnFiltrar.addEventListener("click", () => {
        paginaActual = 1;
        const filtres = {
            client: filtreClient.value.trim(),
            desde: dataDesde.value,
            fins: dataFins.value,
        };
        mostrarTaula(filtres);
    });

    btnReset.addEventListener("click", () => {
        filtreClient.value = "";
        dataDesde.value = "";
        dataFins.value = "";
        paginaActual = 1;
        mostrarTaula();
    });

    // Mostrar inicial
    mostrarTaula();
}
