// Variables globals
let productes = [];           // Array de productes
let producteActual = null;    // Producte seleccionat actualment
let indexEdicio = null;       // Index de la característica a editar (null si estem afegint)

// Carrega productes des de localStorage o, si no n'hi ha, des de CSV
function inicialitzarProductes() {
    const productesGuardats = localStorage.getItem('productes');
    if (productesGuardats) {
        productes = JSON.parse(productesGuardats);
        mostrarProductes();
        mostrarMissatge('Productes carregats des de la memòria local', false);
    } else {
        carregarCSV();
    }
}

// Llig el CSV i guarda els productes al localStorage
function carregarCSV() {
    const params = new URLSearchParams(window.location.search);
    const fitxerCSV = params.get('csv') || 'productes.csv';

    fetch(fitxerCSV)
        .then(response => {
            if (!response.ok) throw new Error('No s\'ha pogut obtindre el CSV: ' + response.statusText);
            return response.text();
        })
        .then(data => {
            const linies = data.split('\n');
            productes = [];

            // Processa cada línia del CSV (excloent la capçalera)
            for (let i = 1; i < linies.length; i++) {
                if (linies[i].trim() === '') continue;
                const dades = linies[i].split(',');
                productes.push({
                    id: Date.now() + i,
                    nom: dades[0]?.trim() || '',
                    categoria: dades[1]?.trim() || '',
                    caracteristiques: []
                });
            }
            localStorage.setItem('productes', JSON.stringify(productes)); // Guarda al localStorage
            mostrarProductes();
            mostrarMissatge('Productes carregats des de ' + fitxerCSV, false);
        })
        .catch(error => {
            mostrarMissatge('Error en carregar el fitxer CSV: ' + error.message);
        });
}

// Mostra missatges d'error o èxit a la interfície
function mostrarMissatge(text, esError = true) {
    let missatge = document.getElementById('missatge');
    if (!missatge) {
        missatge = document.createElement('p');
        missatge.id = 'missatge';
        missatge.style.color = esError ? 'red' : 'green';
        missatge.style.fontWeight = 'bold';
        missatge.style.marginTop = '10px';
        const contenidor = document.querySelector('.content') || document.body;
        contenidor.insertBefore(missatge, contenidor.firstChild);
    }
    missatge.textContent = text;
    missatge.style.color = esError ? 'red' : 'green';
    missatge.style.display = 'block';
    setTimeout(() => {
        missatge.style.display = 'none';
    }, 3000);
}

// Mostra la taula de productes en la pàgina principal
function mostrarProductes() {
    const tbody = document.getElementById('taulaProductes');
    tbody.innerHTML = '';
    productes.forEach(producte => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${producte.nom}</td>
            <td>${producte.categoria}</td>
            <td>${producte.caracteristiques.length}</td>
            <td>
                <button onclick="obrirCaracteristiques(${producte.id})">
                    Característiques
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// Obri la pàgina de característiques del producte seleccionat
function obrirCaracteristiques(idProducte) {
    producteActual = productes.find(p => p.id === idProducte);
    if (!producteActual) return;
    localStorage.setItem('producteActual', JSON.stringify(producteActual));
    window.location.href = 'caracteristiques.html?id=' + encodeURIComponent(idProducte);
}

// Valida els inputs de característica segons HTML (pattern, maxlength)
function validarCaracteristica() {
    const nomInput = document.getElementById('nomCaract');
    const valorInput = document.getElementById('valorCaract');

    // Validació de longitud i patró per al nom
    if (nomInput.value.length < 2 || nomInput.value.length > 20) {
        return 'El nom ha de tindre entre 2 i 20 caràcters';
    }
    if (nomInput.validity.patternMismatch) {
        return 'El nom no compleix el patró definit';
    }
    // Validació de longitud i patró per al valor
    if (valorInput.value.length < 1 || valorInput.value.length > 15) {
        return 'El valor ha de tindre entre 1 i 15 caràcters';
    }
    if (valorInput.validity.patternMismatch) {
        return 'El valor no compleix el patró definit';
    }
    return null;
}

// Carrega les característiques del producte seleccionat
function carregarCaracteristiques() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    const productesGuardats = localStorage.getItem('productes');
    if (productesGuardats) {
        productes = JSON.parse(productesGuardats);
    }
    if (idParam) {
        const idNum = parseInt(idParam, 10);
        producteActual = productes.find(p => p.id === idNum);
    }
    if (!producteActual) {
        const producteGuardat = localStorage.getItem('producteActual');
        if (!producteGuardat) return;
        producteActual = JSON.parse(producteGuardat);
    }
    document.getElementById('nomProducte').textContent = producteActual.nom;
    mostrarCaracteristiques();
}

// Mostra la llista de característiques del producte actual
function mostrarCaracteristiques() {
    const llista = document.getElementById('llistaCaracteristiques');
    llista.innerHTML = '';
    let html = '';
    if (!producteActual.caracteristiques || producteActual.caracteristiques.length === 0) {
        llista.innerHTML = '<p>No hi ha característiques afegides</p>';
        return;
    }
    producteActual.caracteristiques.forEach((caract, index) => {
        html += '<div>' +
               '<strong>' + caract.nom + '</strong>: ' + caract.valor +
               '</div>' +
               '<div>' +
               '<button onclick="editarCaracteristica(' + index + ')">Editar</button> ' +
               '<button onclick="eliminarCaracteristica(' + index + ')">Eliminar</button>' +
               '</div>' +
               '<hr>';
    });
    llista.innerHTML = html;
}

// Afegix una nova característica al producte actual
function afegirCaracteristica() {
    const nom = document.getElementById('nomCaract').value.trim();
    const valor = document.getElementById('valorCaract').value.trim();
    if (!nom || !valor) {
        mostrarMissatge('Per favor completa els dos camps');
        return;
    }
    const error = validarCaracteristica();
    if (error) {
        mostrarMissatge(error);
        return;
    }
    if (!producteActual.caracteristiques) {
        producteActual.caracteristiques = [];
    }
    producteActual.caracteristiques.push({ nom, valor });
    document.getElementById('nomCaract').value = '';
    document.getElementById('valorCaract').value = '';
    guardarCanvis();
    mostrarCaracteristiques();
    mostrarMissatge('Característica afegida correctament', false);
}

// Guarda una característica (afegir o editar segons indexEdicio)
function guardarCaracteristica() {
    const nom = document.getElementById('nomCaract').value.trim();
    const valor = document.getElementById('valorCaract').value.trim();

    // Validació de camps buits i patró
    if (!nom || !valor) {
        mostrarMissatge('Per favor completa els dos camps');
        return;
    }
    const error = validarCaracteristica();
    if (error) {
        mostrarMissatge(error);
        return;
    }

    if (indexEdicio == null) {
        // Afegir nova característica
        if (!producteActual.caracteristiques) {
            producteActual.caracteristiques = [];
        }
        producteActual.caracteristiques.push({ nom, valor });
        mostrarMissatge('Característica afegida correctament', false);
    } else {
        // Editar característica existent
        producteActual.caracteristiques[indexEdicio].nom = nom;
        producteActual.caracteristiques[indexEdicio].valor = valor;
        mostrarMissatge('Característica editada correctament', false);
        indexEdicio = null; // Reinicia mode edició
    }

    // Neteja els inputs
    document.getElementById('nomCaract').value = '';
    document.getElementById('valorCaract').value = '';

    guardarCanvis();
    mostrarCaracteristiques();
}

// Posa en mode edició la característica seleccionada
function editarCaracteristica(index) {
    const caract = producteActual.caracteristiques[index];
    document.getElementById('nomCaract').value = caract.nom;
    document.getElementById('valorCaract').value = caract.valor;
    indexEdicio = index; // Guarda l'índex per saber que estem editant
}

// Elimina una característica del producte actual
function eliminarCaracteristica(index) {
    producteActual.caracteristiques.splice(index, 1);
    guardarCanvis();
    mostrarCaracteristiques();
    mostrarMissatge('Característica eliminada correctament', false);
}

// Guarda la llista de productes amb les característiques al localStorage
function guardarCanvis() {
    const index = productes.findIndex(p => p.id === producteActual.id);
    if (index !== -1) {
        productes[index] = producteActual;
    }
    localStorage.setItem('producteActual', JSON.stringify(producteActual));
    localStorage.setItem('productes', JSON.stringify(productes));
    // Si la finestra principal està oberta, actualitza la taula
    if (window.opener && !window.opener.closed) {
        window.opener.actualitzarDesDeFinestra();
    }
}

// Actualitza la taula de productes des de la finestra principal
function actualitzarDesDeFinestra() {
    mostrarProductes();
}

// Tanca la finestra actual
function tancarFinestra() {
    window.close();
}

// Inicialització segons la pàgina
if (document.getElementById('taulaProductes')) {
    inicialitzarProductes();
}
if (document.getElementById('llistaCaracteristiques')) {
    carregarCaracteristiques();
}