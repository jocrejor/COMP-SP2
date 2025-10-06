// Array d'usuaris, s'hauria de pasar a BBDD més endavant
const usuaris = ["Anna", "Joan", "Maria", "Pere", "Laura"];

document.addEventListener("DOMContentLoaded", function() {
    const selectorUsuari = document.getElementById("userSelector");
    const llistaFavorits = document.getElementById("favoritesList");
    const formulariAfegir = document.getElementById("addForm");
    const capcaleraFavorit = document.getElementById("favoriteheader");

    // Omple el selector amb usuaris
    if (selectorUsuari) {
        selectorUsuari.innerHTML = "";
        usuaris.forEach((usuari, idx) => {
            const opcio = document.createElement("option");
            opcio.value = idx;
            opcio.textContent = usuari;
            selectorUsuari.appendChild(opcio);
        });
    }

    // Obté l'ID de l'usuari actual
    let idUsuari = window.localStorage.getItem("userId");
    if (idUsuari === null && selectorUsuari) {
        idUsuari = selectorUsuari.selectedIndex;
        window.localStorage.setItem("userId", idUsuari);
    }

    // Mostra la capçalera i la llista de favorits
    if (capcaleraFavorit) {
        capcaleraFavorit.textContent = "";
    }
    if (llistaFavorits) {
        llistaFavorits.innerHTML = "";
    }
    if (idUsuari !== null && usuaris[idUsuari]) {
        if (capcaleraFavorit) {
            capcaleraFavorit.textContent = "Ací tens els teus favorits, " + usuaris[idUsuari];
            capcaleraFavorit.style.display = "";
        }
        if (formulariAfegir) formulariAfegir.style.display = "";
        if (llistaFavorits) {
            llistaFavorits.style.display = "";
            llistarFavorits();
        }
        if (selectorUsuari) selectorUsuari.selectedIndex = idUsuari;
    } else {
        if (formulariAfegir) formulariAfegir.style.display = "none";
        if (llistaFavorits) {
            llistaFavorits.innerHTML = "";
            llistaFavorits.style.display = "none";
        }
        if (capcaleraFavorit) {
            capcaleraFavorit.textContent = "";
            capcaleraFavorit.style.display = "none";
        }
    }

    // Escolta els canvis en el selector d'usuari
    if (selectorUsuari) {
        selectorUsuari.addEventListener("change", function() {
            window.localStorage.setItem("userId", selectorUsuari.selectedIndex);
            // Actualitza la interfície dinàmicament
            const llistaFavorits = document.getElementById("favoritesList");
            const formulariAfegir = document.getElementById("addForm");
            const capcaleraFavorit = document.getElementById("favoriteheader");
            const idUsuari = selectorUsuari.selectedIndex;
            if (usuaris[idUsuari]) {
                if (formulariAfegir) formulariAfegir.style.display = "";
                if (llistaFavorits) llistaFavorits.style.display = "";
                if (capcaleraFavorit) capcaleraFavorit.style.display = "";
                if (capcaleraFavorit) {
                    capcaleraFavorit.textContent = "Ací tens els teus favorits, " + usuaris[idUsuari];
                }
                llistarFavorits();
            } else {
                if (formulariAfegir) formulariAfegir.style.display = "none";
                if (llistaFavorits) {
                    llistaFavorits.innerHTML = "";
                    llistaFavorits.style.display = "none";
                }
                if (capcaleraFavorit) {
                    capcaleraFavorit.textContent = "";
                    capcaleraFavorit.style.display = "none";
                }
            }
        });
    }
    gestorFormulari();
});

let favorites = [];

function obtenirClauFavorits() {
    const idUsuari = window.localStorage.getItem("userId");
    return idUsuari !== null ? `favorits_${idUsuari}` : "favorits_default";
}

function gestorFormulari() {
    // Si el localStorage està buit, emplena amb dades del selector
    const idUsuari = window.localStorage.getItem("userId");
    const clauFavorits = idUsuari !== null ? `favorits_${idUsuari}` : "favorits_default";
    if (window.localStorage.length === 0) {
        window.localStorage.setItem(clauFavorits, JSON.stringify([]));
        window.localStorage.setItem("userId", idUsuari);
        window.localStorage.setItem("client_id", 1);
    }

    // Inicialitza el localStorage si no està inicialitzat
    const formulari = document.getElementById("addForm");
    formulari.addEventListener("submit", function(event) {
        event.preventDefault(); // El formulari no s'envia mai buit
        if (validarNom()) {
            // Llegeix els favorits del localStorage
            let favorits = JSON.parse(window.localStorage.getItem(clauFavorits)) || [];
            favorits.push({
                nom: document.getElementById("comparison_name").value,
                id_comparador: favorits.length > 0 ? favorits[favorits.length - 1].id_comparador + 1 : 1, // Assigna un ID incremental
                id: favorits.length > 0 ? favorits[favorits.length - 1].id + 1 : 1
            });
            window.localStorage.setItem(clauFavorits, JSON.stringify(favorits));
            esborrarError();
            document.getElementById("comparison_name").value = "";
            location.reload();
        }
    });
}

function mostrarError(element, missatge) {
    let miss = document.createTextNode(missatge);
    document.getElementById("missatgeError").appendChild(miss);
    element.classList.add("error");
    element.focus();
}

function esborrarError() {
    document.getElementById("missatgeError").textContent = "";
    let formulari = document.forms[0];
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}
// Validem el nom del favorit
function validarNom() {
    let inputNom = document.getElementById("comparison_name");
    if (inputNom.validity.valueMissing) {
        mostrarError(inputNom, "Cal posar nom al favorit");
        return false;
    } else if (inputNom.validity.tooLong) {
        mostrarError(inputNom, "El nom del favorit és massa llarg");
        return false;
    }
    return true;
}

function llistarFavorits() {
    // Mostra la llista utilitzant l'índex de l'array
    let llista = document.getElementById("favoritesList");
    const idUsuari = window.localStorage.getItem("userId");
    const clauFavorits = idUsuari !== null ? `favorits_${idUsuari}` : "favorits_default";
    let favorits = JSON.parse(window.localStorage.getItem(clauFavorits)) || [];
    llista.innerHTML = "";
    favorits.forEach((fav, idx) => {
        let elementLlista = document.createElement("li");
        elementLlista.textContent = `Nom: ${fav.nom}, ID: ${fav.id_comparador} `;

        // Botó d'edició
        const botoEditar = document.createElement("button");
        botoEditar.textContent = "Edita";
        botoEditar.onclick = function() {
            const nouNom = prompt("Edita el nom del favorit:", fav.nom);
            if (nouNom && nouNom.trim() !== "") {
                favorits[idx].nom = nouNom.trim();
                window.localStorage.setItem(clauFavorits, JSON.stringify(favorits));
                location.reload();
            }
        };
        elementLlista.appendChild(botoEditar);

        // Botó esborrar
        const botoEsborrar = document.createElement("button");
        botoEsborrar.textContent = "Esborra";
        botoEsborrar.onclick = function() {
            if (confirm("Segur que vols esborrar aquest favorit?")) {
                favorits.splice(idx, 1);
                window.localStorage.setItem(clauFavorits, JSON.stringify(favorits));
                location.reload();
            }
        };
        elementLlista.appendChild(botoEsborrar);
        llista.appendChild(elementLlista);
    });
}
