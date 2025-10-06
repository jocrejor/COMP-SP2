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
    
    // Comprovar si no hi ha usuaris
    if (usuaris.length === 0) {
        llista.innerHTML = '<p>No hi ha usuaris registrats</p>';
        return;
    }
    
    // Crear la taula HTML dinàmicament
    let html = '<table border="1" width="80%">';
    html += '<tr><th>ID</th><th>Nom Usuari</th><th>Correu</th><th>Nom</th><th>Rol</th><th>Accions</th></tr>';
    
    // Recórrer tots els usuaris i crear files de la taula
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
                    <!-- Botons d'acció amb els IDs corresponents -->
                    <button onclick="editarUsuari(${usuari.id})">Editar</button>
                    <button onclick="eliminarUsuari(${usuari.id})">Eliminar</button>
                </td>
            </tr>
        `;
    }
    
    html += '</table>';
    llista.innerHTML = html;
}

// Funció per eliminar un usuari amb confirmació.
function eliminarUsuari(id) {
    if (confirm("Estàs segur que vols eliminar aquest usuari?")) {
        // Filtrar l'array per eliminar l'usuari amb la ID especificada
        usuaris = usuaris.filter(usuari => usuari.id !== id);
        guardarUsuaris();
        mostrarUsuaris(); // Actualitzar la visualització
    }
}

// Funció per editar un usuari - redirigeix al formulari d'edició.
function editarUsuari(id) {
    // Redirigir a la pàgina d'alta d'usuaris amb l'ID com a paràmetre URL
    window.location.href = `altaUsuaris.html?editar=${id}`;
}

// Funció per desar els usuaris al localStorage.
function guardarUsuaris() {
    localStorage.setItem('usuaris', JSON.stringify(usuaris));
}