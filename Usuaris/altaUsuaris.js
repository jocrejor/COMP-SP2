document.addEventListener("DOMContentLoaded", main);

// Variables globals.
let usuaris = []; // Array per emmagatzemar tots els usuaris
let rols = []; // Rols per defecte.
let idCounter = 1; // Comptador per assignar IDs únics
let editantId = null; // Guarda l'ID de l'usuari que s'està editant

// Funció per iniciar els esdeveniments de la pàgina.
function main () {
    // Configuració del botó de tornar a la pàgina d'usuaris
    const usuarisButton= document.getElementById("usuaris");
    
    usuarisButton.addEventListener("click", (e) => {
        window.location.href='usuaris.html';
    });

    // Configuració dels event listeners per als botons
    document.getElementById("formulariUsuari").addEventListener("submit", validar);
    document.getElementById("formulariUsuari").addEventListener("reset", limpiar);
    document.getElementById("botoContrasenya").addEventListener("click", mostrarContrasenya, false);
    
    // Carreguem els usuaris
    carregarUsuaris();
    // Carreguem els rols
    rols = JSON.parse(localStorage.getItem('rols')) || Rol;
    
    // Actualitzar el selector de rols.
    actualitzarSelectorRolsHTML();
    
    // Comprovar si estem editant un usuari des de paràmetres URL
    const urlParams = new URLSearchParams(window.location.search);
    const editarId = urlParams.get('editar');
    if (editarId) {
        editarIdUsuari(parseInt(editarId));
    }
} 

// Funció per carregar els usuaris des del localStorage.
function carregarUsuaris() {
    usuaris = JSON.parse(localStorage.getItem('usuaris')) || User;
    // Trobar l'ID més alt per continuar des d'allà.
    if (usuaris.length > 0) {
        idCounter = Math.max(...usuaris.map(u => u.id)) + 1;
    }
}

// Funció per actualitzar el selector de rols al HTML.
function actualitzarSelectorRolsHTML() {
    const selectorRol = document.getElementById("rol");
    selectorRol.replaceChildren(); // Netejar opcions existents.
    
    // Afegir tots els rols disponibles dinàmicament
    rols.forEach(rol => {
        const option = document.createElement("option");
        option.setAttribute("value", rol.id);
        option.appendChild(document.createTextNode(rol.name));
        selectorRol.appendChild(option);
    });
}

// Funció per desar els usuaris al localStorage.
function guardarUsuaris() {
    localStorage.setItem('usuaris', JSON.stringify(usuaris));
}

// Funció per validar el nom.
function validarNom() {
    let element = document.getElementById("nom");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr un nom.");
        }
        if (element.validity.patternMismatch) {
            error(element, "El nom d'usuari ha de tindre entre 3 i 100 caràcters. A més no pots introduïr caracters especials");
        }
        return false;
    }
    return true;
}

// Funció per validar el nomUsuari.
function validarnomUsuari() {
    let element = document.getElementById("nomUsuari");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr un nom d'Usuari.");
        }
        if (element.validity.patternMismatch) {
            error(element, "El nom ha de tindre entre 3 i 50 caràcters. A més no pots introduïr caracters especials ni majuscules");
        }
        return false;
    }
    return true;
}

// Funció per validar el correu electrònic.
function validarCorreu() {
    let element = document.getElementById("correu");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr un correu electrònic.");
        }
        if (element.validity.typeMismatch) {
            error(element, "Introdueix un correu electrònic vàlid.");
        }
        if (element.validity.patternMismatch) {
            error(element, "L'email ha de tindre entre 5 i 100 caràcters.");
        }
        return false;
    }
    return true;
}

//Funció per validar la contrasenya.
function validarContrasenya() {
    let element = document.getElementById("contrasenya");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr una contrasenya.");
        }
        if (element.validity.patternMismatch) {
            error(element, "La contrasenya ha de tindre entre 5 i 30 caràcters, amb majúscula, minúscula i símbol.");
        }
        return false;
    }
    console.log("Validació:", document.getElementById("contrasenya").checkValidity());
    return true;
}

// Funció principal per validar el formulari.
function validar(e) {
    e.preventDefault(); // Evita l'enviament tradicional del formulari
    
    esborrarError();
    
    // Validar tots els camps i demanar confirmació
    if (validarnomUsuari() && validarNom() && validarCorreu() && validarContrasenya()) {
        if (confirm("Confirma si vols enviar el formulari")) {
            // Decidir si afegir nou usuari o actualitzar existent
            if (editantId) {
                actualitzarUsuari();
            } else {
                afegirUsuari();
            }
            return true;
        }
    }
    return false;
}

function limpiar(e) {
    e.preventDefault(); // Evita l'enviament tradicional del formulari
    esborrarError();

    document.getElementById("nomUsuari").setAttribute("value", "");
    document.getElementById("nom").setAttribute("value", "");
    document.getElementById("correu").setAttribute("value", "");
    document.getElementById("contrasenya").setAttribute("value", "");
    document.getElementById("rol").setAttribute("value", "");
}

// Funció per a afegir un nou Usuari.
function afegirUsuari() {
    // Crear objecte nou usuari.
    let nouUsuari = {
        "id": idCounter++,
        "name": document.getElementById("nom").value,
        "email": document.getElementById("correu").value,
        "nickname": document.getElementById("nomUsuari").value,
        "password": document.getElementById("contrasenya").value,
        "rol_id": Number(document.getElementById("rol").value)
    };
    
    // Afegir a l'array.
    usuaris.push(nouUsuari);
    
    // Desa a localStorage.
    guardarUsuaris();
    
    // Redirigir a la llista després de guardar.
    window.location.href = 'usuaris.html';
}

// Funció per actualitzar un usuari existent.
function actualitzarUsuari() {
    // Buscar l'usuari per ID
    const index = usuaris.findIndex(u => u.id === editantId);
    
    if (index !== -1) {
        // Actualitzar les dades de l'usuari.
        usuaris[index].name = document.getElementById("nom").value;
        usuaris[index].email = document.getElementById("correu").value;
        usuaris[index].nickname = document.getElementById("nomUsuari").value;
        usuaris[index].password = document.getElementById("contrasenya").value;
        usuaris[index].rol_id = Number(document.getElementById("rol").value);
        
        // Desa a localStorage.
        guardarUsuaris();
        
        // Redirigir a la llista.
        window.location.href = 'usuaris.html';
    }
}

// Funció per editar un usuari específic.
function editarIdUsuari(id) {
    editantId = id;
    // Busca l'usuari per ID.
    const usuari = usuaris.find(u => u.id === id);
    if (usuari) {
        // Emplenar el formulari amb les dades de l'usuari existent.
        document.getElementById("nom").setAttribute("value", usuari.name);
        document.getElementById("correu").setAttribute("value", usuari.email);
        document.getElementById("nomUsuari").setAttribute("value", usuari.nickname);
        document.getElementById("contrasenya").setAttribute("value", usuari.password);
        
        // Assegurar-se que el selector de rols està actualitzat.
        actualitzarSelectorRolsHTML();
        
        // Establir el rol de l'usuari.
        document.getElementById("rol").setAttribute("value", usuari.rol_id);
        
        // Canviar el text del botó per indicar que s'està editant.
        document.getElementById("enviar").setAttribute("value", "Actualitzar");
    }
}

// Funció per mostrar errors als usuaris.
function error(element, missatge) {
    let miss = document.createTextNode(missatge);    
    document.getElementById("missatgeError").appendChild(miss);
    element.classList.add("error");
    element.focus(); // Posar el focus en el camp amb error
}

// Funció per a esborrar els errors.
function esborrarError() {
    const contError = document.getElementById("missatgeError");
    contError.replaceChildren();

    let formulari = document.getElementById("formulariUsuari");
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}

// Funció per mostrar/amagar la contrasenya.
function mostrarContrasenya() {
    let campContrasenya = document.getElementById("contrasenya");
    let boto = document.getElementById("botoContrasenya");
            
 // Netejar contingut existent
    while (boto.firstChild) {
        boto.removeChild(boto.firstChild);
    }

    if (campContrasenya.type === "password") {
        campContrasenya.type = "text";
        boto.appendChild(document.createTextNode("🔒"));
    } else {
        campContrasenya.type = "password";
        boto.appendChild(document.createTextNode("👁️"));
    }
}