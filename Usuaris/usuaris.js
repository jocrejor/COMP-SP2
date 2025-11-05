document.addEventListener("DOMContentLoaded", main);

// Array per emmagatzemar els usuaris.
let usuaris = [];
let rols = [];
let paginaActual;

// Funció per iniciar els esdeveniments de la pàgina
function main() { 

    const usuarisButton= document.getElementById("afegirUsuari");
    const rolsButton= document.getElementById("gestionarRols");
    const paginaAnterior= document.getElementById("paginaAnterior");
    const paginaSeguent= document.getElementById("paginaSeguent");
    const pagina = document.getElementById("pagina");

    // Configuració del botó per a tornar al formulari d'altaUsuaris
    usuarisButton.addEventListener("click", (e) => {
        window.location.href='altaUsuaris.html';
    });

    // Configuració del botó per a tornar al formulari d'usuarisRols
    rolsButton.addEventListener("click", (e) => {
        window.location.href='rols.html';
    });

    paginaAnterior.addEventListener("click", (e) => {
        paginaActual -= paginaActual;
    });

    paginaSeguent.addEventListener("click", (e) => {
        paginaActual += paginaActual;
    });

    rols = JSON.parse(localStorage.getItem('rols')) || Rol;
    usuaris = JSON.parse(localStorage.getItem('usuaris')) || User;
    mostrarUsuaris();
}

// Funció per mostrar tots els usuaris en una taula HTML.
function mostrarUsuaris() {
    const llista = document.getElementById('llistaUsuaris');

    // Buidar contingut anterior
    llista.replaceChildren();

    // Si no hi ha usuaris
    if (usuaris.length === 0) {
        const missatge = document.createElement('p');
        missatge.appendChild(document.createTextNode('No hi ha usuaris registrats'));
        llista.appendChild(missatge);
        return;
    }

    // Crear taula
    const taula = document.createElement('table');
    taula.id = 'taula_usuaris';

    // Crear capçalera
    const header = document.createElement('tr');
    const columnes = ['ID', 'Usuari', 'Email', 'Nom', 'Rol', 'Accions'];
    columnes.forEach(text => {
        const th = document.createElement('th');
        th.appendChild(document.createTextNode(text));
        header.appendChild(th);
    });
    taula.appendChild(header);

    // Crear files per a cada usuari
    usuaris.forEach(usuari => {
        const fila = document.createElement('tr');

        // Camps bàsics (adaptats a les claus en anglès)
        ['id', 'nickname', 'email', 'name'].forEach(clau => {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(usuari[clau]));
            fila.appendChild(td);
        });
        
        // Introduim també el rol de cada usuari
        const rol = rols.find(r => r.id === usuari.rol_id);
        const tdRol = document.createElement('td');
        tdRol.appendChild(document.createTextNode(rol.name));
        fila.appendChild(tdRol);

        // Cel·la d'accions
        const accionsTd = document.createElement('td');
        accionsTd.classList.add('accions');

        // Botó editar
        const botoEditar = document.createElement('button');
        botoEditar.appendChild(document.createTextNode('Editar'));
        botoEditar.addEventListener('click', () => editarUsuari(usuari.id));
        accionsTd.appendChild(botoEditar);

        // Botó eliminar
        const botoEliminar = document.createElement('button');
        botoEliminar.appendChild(document.createTextNode('Eliminar'));
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
