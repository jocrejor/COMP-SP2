// Array per emmagatzemar els usuaris.
let usuaris = [];
let idCounter = 1;

// Assegurem que el botó tingui l’event listener.
window.onload = iniciar;

// Funció per iniciar els esdeveniments de la pàgina.
function iniciar() {
    document.getElementById("enviar").addEventListener("click", validar, false);
    document.getElementById("botoContrasenya").addEventListener("click", mostrarContrasenya, false);
    
    // Carregar usuaris existents del localStorage en iniciar.
    carregarUsuaris();
    mostrarUsuaris();
} 

// Funció per carregar els usuaris des del localStorage.
function carregarUsuaris() {
    const usuarisGuardats = localStorage.getItem('usuaris');
    if (usuarisGuardats) {
        usuaris = JSON.parse(usuarisGuardats);
        // Trobar l'ID més alt per continuar des d'allà.
        if (usuaris.length > 0) {
            idCounter = Math.max(...usuaris.map(u => u.id)) + 1;
        }
    }
}

// Funció per desar els usuaris al localStorage.
function guardarUsuaris() {
    localStorage.setItem('usuaris', JSON.stringify(usuaris));
}

// Funció per validar el nom.
function validarNom() {
    var element = document.getElementById("nom");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr un nom.");
        }
        if (element.validity.patternMismatch) {
            error(element, "El nom ha de tindre entre 2 i 15 lletres.");
        }
        return false;
    }
    return true;
}

// Funció per validar el nomUsuari.
function validarnomUsuari() {
    var element = document.getElementById("nomUsuari");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr un nom d'Usuari.");
        }
        if (element.validity.patternMismatch) {
            error(element, "El nom d'Usuari ha de tindre entre 2 i 15 lletres.");
        }
        return false;
    }
    return true;
}

// Funció per validar el correu electrònic.
function validarCorreu() {
    var element = document.getElementById("correu");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr un correu electrònic.");
        }
        if (element.validity.typeMismatch) {
            error(element, "Introdueix un correu electrònic vàlid.");
        }
        return false;
    }
    return true;
}

//Funció per validar la contrasenya.
function validarContrasenya() {
    var element = document.getElementById("contrasenya");
    if (!element.checkValidity()) {
        if (element.validity.valueMissing) {
            error(element, "Has d'introduïr una contrasenya.");
        }
        return false;
    }
    return true;
}

// Funció per validar el formulari.
function validar(e) {
    e.preventDefault();
    esborrarError();
    
    if (validarNom() && validarnomUsuari() && validarCorreu() && validarContrasenya()) {
        if (confirm("Confirma si vols enviar el formulari")) {
            afegirUsuari();
            return true;
        }
    }
    return false;
}

// Funció per a afegir un nou Usuari.
function afegirUsuari() {
    // Crear nou usuari.
    let nouUsuari = {
        id: idCounter++,
        nomUsuari: document.getElementById("nomUsuari").value,
        nom: document.getElementById("nom").value,
        correu: document.getElementById("correu").value,
        contrasenya: document.getElementById("contrasenya").value,
        rol: document.getElementById("rol").value
    };
    
    // Afegir a l'array.
    usuaris.push(nouUsuari);
    
    // Desa a localStorage.
    guardarUsuaris();
    
    // Mostra la taula actualitzada.
    mostrarUsuaris();
    
    // Netejar el formulari.
    document.getElementById("formulariUsuari").reset();
}

// Funció per als errors.
function error(element, missatge) {
    let miss = document.createTextNode(missatge);    
    document.getElementById("missatgeError").appendChild(miss);
    element.classList.add("error");
    element.focus();
}

// Funció per a esborrar els errors.
function esborrarError() {
    document.getElementById("missatgeError").textContent = "";
    let formulari = document.getElementById("formulariUsuari");
    for (let i = 0; i < formulari.elements.length; i++) {
        formulari.elements[i].classList.remove("error");
    }
}

// Funció per mostrar la contrasenya.
function mostrarContrasenya() {
    var campContrasenya = document.getElementById("contrasenya");
    var boto = document.getElementById("botoContrasenya");
            
    if (campContrasenya.type === "password") {
        campContrasenya.type = "text";
        boto.textContent = "🔒";
    } else {
        campContrasenya.type = "password";
        boto.textContent = "👁️";
    }
}

// Funció per mostrar tots els usuaris.
function mostrarUsuaris() {
    const llista = document.getElementById('llistaUsuaris');
    
    if (usuaris.length === 0) {
        llista.innerHTML = '<p>No hi ha usuaris registrats</p>';
        return;
    }
    
    let html = '<table border="1" width="60%">';
    html += '<tr><th>ID</th><th>Nom Usuari</th><th>Correu</th><th>Nom</th><th>Rol</th><th>Accions</th></tr>';
    
    for (let i = 0; i < usuaris.length; i++) {
        const usuari = usuaris[i];
        html += `
            <tr>
                <td>${usuari.id}</td>
                <td>${usuari.nomUsuari}</td>
                <td>${usuari.correu}</td>
                <td>${usuari.nom}</td>
                <td>${usuari.rol}</td>
                <td>
                    <button onclick="editarUsuari(${usuari.id})">Editar</button>
                    <button onclick="eliminarUsuari(${usuari.id})">Eliminar</button>
                </td>
            </tr>
        `;
    }
    
    html += '</table>';
    llista.innerHTML = html;
}

// Funció per eliminar un usuari.
function eliminarUsuari(id) {
    if (confirm("Estàs segur que vols eliminar aquest usuari?")) {
        usuaris = usuaris.filter(usuari => usuari.id !== id);
        guardarUsuaris();
        mostrarUsuaris();
    }
}

// Funció per editar un usuari.
function editarUsuari(id) {
    // Busca l'usuari.
    const usuari = usuaris.find(u => u.id === id);
    if (usuari) {
        // emplenat el formulari amb les dades de l'usuari.
        document.getElementById("nomUsuari").value = usuari.nomUsuari;
        document.getElementById("nom").value = usuari.nom;
        document.getElementById("correu").value = usuari.correu;
        document.getElementById("contrasenya").value = usuari.contrasenya;
        document.getElementById("rol").value = usuari.rol;
        
        // S'elimina l'usuari antic.
        usuaris = usuaris.filter(u => u.id !== id);
        guardarUsuaris();
    }
}