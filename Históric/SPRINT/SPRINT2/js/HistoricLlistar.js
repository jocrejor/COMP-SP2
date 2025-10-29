document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.querySelector("#taulaResultat tbody");
    const btnAfegir = document.getElementById("afegirNou");

    function mostrarTaula() {
        tbody.textContent = "";

        const registres = JSON.parse(localStorage.getItem("registres")) || [];

        //Assegurar-se de que hi ha registres
        if (registres.length === 0) {
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
                td.textContent = valor || "-";
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
                if (confirm("Vols esborrar aquest registre?")) {
                    const registres = JSON.parse(localStorage.getItem("registres")) || [];
                    registres.splice(index, 1);
                    localStorage.setItem("registres", JSON.stringify(registres));
                    mostrarTaula();
                }
            });

            tdAccions.appendChild(btnEditar);
            tdAccions.appendChild(btnEsborrar);
            fila.appendChild(tdAccions);

            tbody.appendChild(fila);
        });
    }

    btnAfegir.addEventListener("click", () => {
        sessionStorage.removeItem("editIndex"); //Per afegir
        window.location.href = "./HistoricForm.html";
    });

    mostrarTaula();
});
