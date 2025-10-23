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

// Funció per mostrar tots els rols en la llista HTML.
function mostrarRols() {
    const llista = document.getElementById('llistaRols');
    llista.replaceChildren(); // Netejar la llista abans d'afegir
    
    // Crear dinàmicament cada element de la llista amb el seu botó d'eliminar
    
    //for (let i = 0; i < rols.length; i++) {
     rols.forEach((rolObj, ind) => {  
        const element = document.createElement('li');
        element.innerHTML = `
            ${rolObj.name}
            <button onclick="eliminarRol('${ind}')">Eliminar</button>
        `;
        llista.appendChild(element);
    });
}

// Funció per afegir un nou rol des del formulari.
function afegirRol(e) {
    e.preventDefault(); // Evitar l'enviament tradicional del formulari
    
    const nouRol = document.getElementById('nouRol').value.trim();
    
    // Validacions per afegir el nou rol
    if (nouRol && !rols.includes(nouRol)) {
        const rolObj = {'name': nouRol}; 
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
    if (confirm(`Estàs segur que vols eliminar el rol "${rols[idRol].name}"?`)) {
        // Filtrar l'array per eliminar el rol especificat
        rols.splice(idRol, 1);
        guardarRols();
        mostrarRols();
        alert(`Rol "${idRol}" eliminat correctament.`);
    }
}

// Funció per actualitzar el selector de rols a totes les pàgines.
function actualitzarSelectorRols() {
    // Aquesta funció assegura que els rols estan sincronitzats.
    // En un sistema real, aquí s'actualitzarien totes les pàgines obertes
    console.log('Rols actualitzats:', rols);
}