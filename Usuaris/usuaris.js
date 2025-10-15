// Array per emmagatzemar els usuaris.
let usuaris = [];

// Carregar usuaris en iniciar la pàgina.
window.onload = function() {
    carregarUsuaris();
    mostrarUsuaris();
};

// Funció per carregar els usuaris des del localStorage.
function carregarUsuaris() {
    const usuarisGuardats = localStorage.getItem('usuaris');
    if (usuarisGuardats) {
        usuaris = JSON.parse(usuarisGuardats);
    }
}

// Funció per mostrar tots els usuaris en una taula HTML.
function mostrarUsuaris() {
    const llista = document.getElementById('llistaUsuaris');

    // 🧹 Buidar contingut anterior sense usar innerHTML
    llista.replaceChildren();

    // Si no hi ha usuaris
    if (usuaris.length === 0) {
        const missatge = document.createElement('p');
        missatge.textContent = 'No hi ha usuaris registrats';
        llista.appendChild(missatge);
        return;
    }

    // Crear taula
    const taula = document.createElement('table');
    taula.border = '1';
    taula.cellPadding = '5px';

    // Crear capçalera
    const header = document.createElement('tr');
    const columnes = ['ID', 'Nom Usuari', 'Correu', 'Nom', 'Rol', 'Accions'];
    columnes.forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        header.appendChild(th);
    });
    taula.appendChild(header);

    // Crear files per a cada usuari
    usuaris.forEach(usuari => {
        const fila = document.createElement('tr');

        // Camps bàsics
        ['id', 'nomUsuari', 'correu', 'nom', 'rol'].forEach(clau => {
            const td = document.createElement('td');
            td.textContent = usuari[clau];
            fila.appendChild(td);
        });

        // Cel·la d'accions
        const accionsTd = document.createElement('td');

        // Botó editar
        const botoEditar = document.createElement('button');
        botoEditar.textContent = 'Editar';
        botoEditar.addEventListener('click', () => editarUsuari(usuari.id));
        accionsTd.appendChild(botoEditar);

        // Botó eliminar
        const botoEliminar = document.createElement('button');
        botoEliminar.textContent = 'Eliminar';
        botoEliminar.addEventListener('click', () => eliminarUsuari(usuari.id));
        accionsTd.appendChild(botoEliminar);

        fila.appendChild(accionsTd);
        taula.appendChild(fila);
    });

    // Afegir taula al contenidor
    llista.appendChild(taula);
}

// Funció per eliminar un usuari amb confirmació.
function eliminarUsuari(id) {
    if (confirm("Estàs segur que vols eliminar aquest usuari?")) {
        usuaris = usuaris.filter(usuari => usuari.id !== id);
        guardarUsuaris();
        mostrarUsuaris(); // Actualitzar vista
    }
}

// Funció per editar un usuari - redirigeix al formulari d'edició.
function editarUsuari(id) {
    window.location.href = `altaUsuaris.html?editar=${id}`;
}

// Funció per desar els usuaris al localStorage.
function guardarUsuaris() {
    localStorage.setItem('usuaris', JSON.stringify(usuaris));
}
