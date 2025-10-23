// Afegeix un event listener quan el DOM està completament carregat
document.addEventListener("DOMContentLoaded", main);

// Declaració de variables globals
let arrFamilia = new Array();
let accio = "Afegir";

// Funció principal que s'executa quan es carrega la pàgina
function main() {
    // Configuració inicial dels elements i esdeveniments
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
    // Recupera les famílies del localStorage o crea un array buit
    arrFamilia = localStorage.getItem("families") ? JSON.parse(localStorage.getItem("families")) : [];
    mostrarFamilies();
    actualitzarSelect();

    // Gestiona el clic al botó d'afegir/actualitzar
    afegirButton.addEventListener("click", (e) => {
        if (validar(e)) {
            if (accio === "Afegir") {
                crearFamilia();
            } else {
                actualitzarFamilia();
                accio = "Afegir";
                afegirButton.textContent = accio;
            }

            // Neteja el formulari després d'afegir o actualitzar
            document.getElementById("nom").value = "";
            document.getElementById("familia_de").value = "";
            document.getElementById("index").value = "-1";
            document.getElementById("descripcio").value = "";
            document.getElementById("imatge").value = "";
            actualitzarSelect();
            mostrarFamilies();
        }
    });
}

// Funció per crear una nova família
function crearFamilia() {
    // Obté els valors del formulari i guarda la família
    const nom = document.getElementById("nom").value.trim();
    const familia_de = document.getElementById("familia_de").value;
    const descripcio = document.getElementById("descripcio").value.trim();
    const archivo = document.getElementById("imatge").files[0];
    guardarFamilia(nom, familia_de, descripcio, archivo, null);
    document.getElementById("alerta").innerHTML = "";
}

// Funció per actualitzar una família existent
function actualitzarFamilia() {
    // Obté els valors actualitzats i actualitza la família
    const index = document.getElementById("index").value;
    const nom = document.getElementById("nom").value.trim();
    const familia_de = document.getElementById("familia_de").value;
    const descripcio = document.getElementById("descripcio").value.trim();
    const archivo = document.getElementById("imatge").files[0];
    guardarFamilia(nom, familia_de, descripcio, archivo, index);
    document.getElementById("alerta").innerHTML = "";
}

// Funció per mostrar totes les famílies en una taula
function mostrarFamilies() {
    const visualitzarFamilies = document.getElementById("taulaFamilia");
    visualitzarFamilies.innerHTML = "";
    let aux = "";
    arrFamilia.forEach((item, index) => {
        // Obté el nom de la família pare si existeix
        let familiaDeText =
            item.familia_de !== "" && item.familia_de !== null && item.familia_de !== undefined
                ? arrFamilia[parseInt(item.familia_de)]?.nom || ""
                : "";

        // Genera l'HTML per a la imatge si existeix
        let imgHTML = item.imatge
            ? `<img src="${item.imatge}" alt="imatge" style="max-width: 100px; max-height: 100px;" />`
            : "";

        // Genera la fila de la taula
        aux += `<tr>
                    <td>${imgHTML}</td>
                    <td>${item.nom}</td>
                    <td>${item.descripcio}</td>
                    <td>${familiaDeText}</td>
                    <td>
                        <button onclick='esborrar(${index})'>Del</button>
                        <button onclick='actualitzar(${index})'>Upd</button>
                    </td>
                </tr>`;
    });
    visualitzarFamilies.innerHTML = aux;
}

// Funció per esborrar una família
function esborrar(index) {
    arrFamilia.splice(index, 1);
    localStorage.setItem("families", JSON.stringify(arrFamilia));
    actualitzarSelect();
    mostrarFamilies();
}

// Funció per carregar les dades d'una família al formulari per actualitzar-la
function actualitzar(index) {
    const item = arrFamilia[index];
    document.getElementById("index").value = index;
    document.getElementById("nom").value = item.nom;
    document.getElementById("familia_de").value = item.familia_de;
    document.getElementById("descripcio").value = item.descripcio;
    document.getElementById("imatge").value = "";
    accio = "Actualitzar";
    document.getElementById("afegir").textContent = accio;
}

// Funció per actualitzar el selector de famílies pare
function actualitzarSelect() {
    const select = document.getElementById("familia_de");
    select.innerHTML = "";

    // Afegeix l'opció buida
    const opcioBuid = document.createElement("option");
    opcioBuid.value = "";
    opcioBuid.textContent = "";
    select.appendChild(opcioBuid);

    // Afegeix totes les famílies com a opcions
    arrFamilia.forEach((item, index) => {
        const opcio = document.createElement("option");
        opcio.value = index;
        opcio.textContent = item.nom;
        select.appendChild(opcio);
    });
}

// Funció per guardar o actualitzar una família
function guardarFamilia(nom, familia_de, descripcio, archivo, index = null) {
    if (archivo) {
        // Si hi ha una nova imatge, la converteix a base64
        const reader = new FileReader();
        reader.onload = function (e) {
            const familia = {
                nom,
                familia_de,
                descripcio,
                imatge: e.target.result
            };
            if (index === null) {
                arrFamilia.push(familia);
            } else {
                arrFamilia[index] = familia;
            }
            localStorage.setItem("families", JSON.stringify(arrFamilia));
            actualitzarSelect();
            mostrarFamilies();
        };
        reader.readAsDataURL(archivo);
    } else {
        // Si no hi ha nova imatge, manté la imatge anterior o la deixa buida
        const familia = {
            nom,
            familia_de,
            descripcio,
            imatge: index !== null ? (arrFamilia[index].imatge || "") : ""
        };
        if (index === null) {
            arrFamilia.push(familia);
        } else {
            arrFamilia[index] = familia;
        }
        localStorage.setItem("families", JSON.stringify(arrFamilia));
        actualitzarSelect();
        mostrarFamilies();
    }
}

/* ---------------- VALIDACIONS ---------------- */

// Validació del camp nom
function validarNom() {
    const element = document.getElementById("nom");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduir un nom.");
        }
        if (element.validity.patternMismatch) {
            error(element, "El nom només pot tindre lletres, números i espais.");
        }
        if (element.validity.tooShort || element.validity.tooLong) {
            error(element, "El nom ha de tindre entre 3 i 100 caràcters.");
        }
        return false;
    }
    return true;
}

// Validació del camp descripció
function validarDescripcio() {
    const element = document.getElementById("descripcio");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduir una descripció.");
        }
        if (element.validity.tooShort || element.validity.tooLong) {
            error(element, "La descripció ha de tindre entre 3 i 250 caràcters.");
        }
        return false;
    }
    return true;
}

// Validació de la imatge
function validarImatge() {
    const archivo = document.getElementById("imatge").files[0];
    if (archivo && archivo.size > 2 * 1024 * 1024) { // 2 MB
        error(document.getElementById("imatge"), "La imatge no pot pesar més de 2MB.");
        return false;
    }
    return true;
}

// Validació de la subfamília
function validarSubfamilia() {
    const index = document.getElementById("index").value;
    const familia_de = document.getElementById("familia_de").value;
    if (index !== "-1" && familia_de !== "" && parseInt(index) === parseInt(familia_de)) {
        error(document.getElementById("familia_de"), "Una família no pot ser subfamília de sí mateixa.");
        return false;
    }
    return true;
}

// Funció principal de validació
function validar(e) {
    esborrarError();
    if (validarNom() && validarDescripcio() && validarImatge() && validarSubfamilia()) {
        return true;
    } else {
        e.preventDefault();
        return false;
    }
}

// Funcions d'error i neteja d'errors
function error(element, missatge) {
    const alerta = document.getElementById("alerta");
    alerta.textContent = missatge;
    element.classList.add("error");
    element.focus();
}

function esborrarError() {
    document.getElementById("alerta").textContent = "";
    const inputs = document.querySelectorAll("input, textarea, select");
    inputs.forEach(el => el.classList.remove("error"));
}