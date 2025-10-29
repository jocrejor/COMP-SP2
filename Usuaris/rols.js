// Array per emmagatzemar els rols.
let rols = []; // Rols per defecte del sistema

// Inicialització - s'executa quan la pàgina està carregada
document.addEventListener("DOMContentLoaded",main); 
    
function main () {
    rols = JSON.parse(localStorage.getItem('rols')) || Rol;
    mostrarRols();
    
    // Configuració del botó de tornar a la pàgina d'usuaris
    const usuarisButton= document.getElementById("usuaris");
    
    usuarisButton.addEventListener("click", (e) => {
        window.location.href='usuaris.html';
    });


    // Configurar l'event listener per al formulari d'afegir rols
    document.getElementById("formulariRol").addEventListener("submit", afegirRol);
};


// Funció per guardar els rols al localStorage.
function guardarRols() {
    localStorage.setItem('rols', JSON.stringify(rols));
    // Actualitzar també el selector de rols a la pàgina d'alta d'usuaris.
    actualitzarSelectorRols();
}

// Funció per mostrar tots els rols en una taula HTML.
function mostrarRols() {
    const llista = document.getElementById('llistaRols');
    
    llista.replaceChildren();

    // Crear taula
    const taula = document.createElement('table');
    taula.id = 'taula_rols';

    // Crear capçalera
    const header = document.createElement('tr');
    const columnes = ['ID', 'Nom', 'Accio'];
    columnes.forEach(text => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(text));
        header.appendChild(th);
    });
    taula.appendChild(header);

    // Crear dinàmicament cada element de la taula amb el seu botó d'eliminar
    
    //for (let i = 0; i < rols.length; i++) {
// Crear files per a cada rol
    rols.forEach((rol, index) => {
        const fila = document.createElement('tr');

        // ID
        const tdId = document.createElement('td');
        tdId.appendChild(document.createTextNode(rol.id));
        fila.appendChild(tdId);

        // Nom del rol
        const tdNom = document.createElement('td');
        tdNom.appendChild(document.createTextNode(rol.name));
        fila.appendChild(tdNom);

        // Cel·la d'accions
        const accionsTd = document.createElement('td');
        accionsTd.classList.add('accio');

        // Botó eliminar
        const botoEliminar = document.createElement('button');
        botoEliminar.appendChild(document.createTextNode('Eliminar'));
        botoEliminar.addEventListener('click', () => eliminarRol(index));
        accionsTd.appendChild(botoEliminar);

        fila.appendChild(accionsTd);

        // Afegir la fila a la taula
        taula.appendChild(fila);
    });

    // Afegir taula al contenidor
    llista.appendChild(taula);
}

// Funció per afegir un nou rol des del formulari.
function afegirRol(e) {
    e.preventDefault(); // Evitar l'enviament tradicional del formulari
    
    const nouRol = document.getElementById('nouRol').value.trim();
    
    // Validacions per afegir el nou rol
    if (nouRol && !rols.includes(nouRol)) {
        const nouId = rols.length > 0 ? Math.max(...rols.map(r => r.id || 0)) + 1 : 1;
        const rolObj = { id: nouId, name: nouRol };

        rols.push(rolObj);
        guardarRols();
        mostrarRols();
        document.getElementById('nouRol').value = ''; // Netejar el camp
        alert(`Rol "${nouRol}" afegit correctament.`);
    } else if (rols.includes(nouRol)) {
        alert('Aquest rol ja existeix.');
    }
}

// Funció per eliminar un rol amb confirmació.
function eliminarRol(idRol) {
    const rol = rols[idRol];

    // Impedir eliminar roles base
    if (rol.name === "Admin" || rol.name === "Usuari") {
        alert("No pots eliminar els rols base del sistema (Admin i Usuari).");
        return;
    }

    if (confirm(`Estàs segur que vols eliminar el rol "${rol.name}}"?`)) {
        // Filtrar l'array per eliminar el rol especificat
        rols.splice(idRol, 1);
        guardarRols();
        mostrarRols();
        alert(`Rol "${rol.name}" eliminat correctament.`);
    }
}

// Funció per actualitzar el selector de rols a totes les pàgines.
function actualitzarSelectorRols() {
    // Aquesta funció assegura que els rols estan sincronitzats.
    // En un sistema real, aquí s'actualitzarien totes les pàgines obertes
    console.log('Rols actualitzats:', rols);
}