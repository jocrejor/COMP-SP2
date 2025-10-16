document.addEventListener("DOMContentLoaded", main);

// Array per emmagatzemar els rols.
let rols = ['Usuari', 'Admin']; // Rols per defecte del sistema

// Inicialització - s'executa quan la pàgina està carregada
function main() {

    const usuarisButton= document.getElementById("usuaris");

    usuarisButton.addEventListener("click", (e) => {
        window.location.href='usuaris.html';
    });

    carregarRols();
    mostrarRols();
    
    // Configurar l'event listener per al formulari d'afegir rols
    document.getElementById("formulariRol").addEventListener("submit", afegirRol);
}

// Funció per carregar els rols del localStorage.
function carregarRols() {
    const rolsGuardats = localStorage.getItem('rols');
    if (rolsGuardats) {
        rols = JSON.parse(rolsGuardats);
    }
}

// Funció per guardar els rols al localStorage.
function guardarRols() {
    localStorage.setItem('rols', JSON.stringify(rols));
    // Actualitzar també el selector de rols a la pàgina d'alta d'usuaris.
    actualitzarSelectorRols();
}

// Funció per mostrar tots els rols en la llista HTML.
function mostrarRols() {
    const llista = document.getElementById('llistaRols');
    llista.innerHTML = ''; // Netejar la llista abans d'afegir
    
    // Crear dinàmicament cada element de la llista amb el seu botó d'eliminar
    for (let i = 0; i < rols.length; i++) {
        const rol = rols[i];
        const element = document.createElement('li');
        element.innerHTML = `
            ${rol}
            <button onclick="eliminarRol('${rol}')">Eliminar</button>
        `;
        llista.appendChild(element);
    }
}

// Funció per afegir un nou rol des del formulari.
function afegirRol(e) {
    e.preventDefault(); // Evitar l'enviament tradicional del formulari
    
    const nouRol = document.getElementById('nouRol').value.trim();
    
    // Validacions per afegir el nou rol
    if (nouRol && !rols.includes(nouRol)) {
        rols.push(nouRol);
        guardarRols();
        mostrarRols();
        document.getElementById('nouRol').value = ''; // Netejar el camp
        alert(`Rol "${nouRol}" afegit correctament.`);
    } else if (rols.includes(nouRol)) {
        alert('Aquest rol ja existeix.');
    }
}

// Funció per eliminar un rol amb confirmació.
function eliminarRol(rol) {
    if (confirm(`Estàs segur que vols eliminar el rol "${rol}"?`)) {
        // Protecció - no permetre eliminar els rols bàsics.
        if (rol === 'Usuari' || rol === 'Admin') {
            alert('No es pot eliminar aquest rol bàsic.');
            return;
        }
        
        // Filtrar l'array per eliminar el rol especificat
        rols = rols.filter(r => r !== rol);
        guardarRols();
        mostrarRols();
        alert(`Rol "${rol}" eliminat correctament.`);
    }
}

// Funció per actualitzar el selector de rols a totes les pàgines.
function actualitzarSelectorRols() {
    // Aquesta funció assegura que els rols estan sincronitzats.
    // En un sistema real, aquí s'actualitzarien totes les pàgines obertes
    console.log('Rols actualitzats:', rols);
}