document.addEventListener("DOMContentLoaded", function () {
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

    function guardarLocal(regs) {
        localStorage.setItem("Register", JSON.stringify(regs));
    }

    function mostrarTaula() {
        const registres = carregarRegistresBbdd();

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

            const camps = [
                registre.session_id,
                registre.user_agent,
                registre.client_id,
                registre.comparator_id,
                registre.favorite_id,
                registre.date_start,
                registre.date_end,
            ];

            camps.forEach((valor) => {
                const td = document.createElement("td");
                td.textContent = valor ?? "-";
                fila.appendChild(td);
            });

            // Accions
            const tdAccions = document.createElement("td");

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", () => {
                sessionStorage.setItem("editIndex", index);
                window.location.href = "./HistoricForm.html";
            });

            const btnEsborrar = document.createElement("button");
            btnEsborrar.textContent = "Esborrar";
            btnEsborrar.addEventListener("click", () => {
                if (!confirm("Vols esborrar aquest registre?")) return;

                // borrar en localStorage
                const regs = carregarRegistresBbdd();
                regs.splice(index, 1);

                // reasignar ids para mantener consecutividad (opcional)
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
        sessionStorage.removeItem("editIndex"); // modo añadir
        window.location.href = "./HistoricForm.html";
    });

    // mostrar al inicio
    mostrarTaula();
});
