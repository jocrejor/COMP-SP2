document.addEventListener("DOMContentLoaded", main)

function main() {
    const tbody = document.querySelector("#taulaResultat tbody");
    const btnAfegir = document.getElementById("afegirNou");

    //Mostrar les dades de la BBDD si no hi ha al LocalStorage
    function carregarRegistresBbdd() {
        const local = localStorage.getItem("Register");
        if (local) {
            return JSON.parse(local);
        } else if (typeof Register !== "undefined" && Array.isArray(Register)) {
            localStorage.setItem("Register", JSON.stringify(Register));
            return Register.slice();
        } else {
            return [];
        }
    }

    //Carregar la taula Client de la BBDD
    function carregarClientBbdd() {
        if (typeof Client !== "undefined" && Array.isArray(Client)) {
            return Client;
        } else {
            return [];
        }
    }
    function guardarLocal(regs) {
        localStorage.setItem("Register", JSON.stringify(regs));
    }

    function mostrarTaula() {
        const registres = carregarRegistresBbdd();
        const clients = carregarClientBbdd();


        // netejar tbody
        while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

        if (!registres || registres.length === 0) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 8;
            td.textContent = "No hi ha registres anteriors.";
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        registres.forEach((registre, index) => {
            const fila = document.createElement("tr");

            //Buscar el nom de client segons el nº de id de Client
            const clientNom = clients.find(c => c.id == registre.client_id) || null;

            //Cel·la de Client -> mostrar el nom+cognom en lloc del nº
            const linkClient = document.createElement("a");
            linkClient.href = `extra/Visualitzar_Client.html?id=${registre.client_id}`;
            linkClient.textContent = (clientNom ? clientNom.name : "Desconegut") + " " +
                (clientNom ? clientNom.surname : "");  //Nom i cognom 

            //link del comparador 
            const linkComparador = document.createElement("a");
            linkComparador.href = `extra/Visualitzar_Comp.html?id=${registre.comparator_id}`;
            linkComparador.textContent = registre.comparator_id ? `${registre.comparator_id}` : "-";

            //link del fav 
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
                // Si el valor es un <a>, afegir-lo
                if (valor && valor.tagName === "A") {
                    td.appendChild(valor);
                } 
                // Si el valor parece ser una fecha válida
                else if (valor && !isNaN(Date.parse(valor))) {
                const fecha = new Date(valor);
                // Formato: dd/mm/yyyy (puedes cambiar el locale)
                td.textContent = fecha.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                });
                }  else {
                    td.textContent = valor ?? "-";
                } fila.appendChild(td);
            });

            // Accions
            const tdAccions = document.createElement("td");

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("accio", "editar");
            btnEditar.addEventListener("click", () => {
                sessionStorage.setItem("editIndex", index);
                window.location.href = "./HistoricForm.html";
            });

            const btnEsborrar = document.createElement("button");
            btnEsborrar.textContent = "Esborrar";
            btnEsborrar.classList.add("accio", "eliminar");
            btnEsborrar.addEventListener("click", () => {
                if (!confirm("Vols esborrar aquest registre?")) return;

                // borrar en localStorage
                const regs = carregarRegistresBbdd();
                regs.splice(index, 1);

                // reasignar ids 
                regs.forEach((r, i) => {
                    r.id = i + 1;
                });

                guardarLocal(regs);
                mostrarTaula();
            });

            tdAccions.appendChild(btnEditar);
            tdAccions.appendChild(btnEsborrar);
            fila.appendChild(tdAccions);

            tbody.appendChild(fila);
        });
    }

    btnAfegir.addEventListener("click", () => {
        sessionStorage.removeItem("editIndex"); // modo afegir
        window.location.href = "./HistoricForm.html";
    });

    // mostrar al inici
    mostrarTaula();
}
