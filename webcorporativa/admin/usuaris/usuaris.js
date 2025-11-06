// Variables globals per paginació
let paginaActual = 1;
const usuarisPerPagina = 5; // Reduced to 5 to make pagination more visible

document.addEventListener("DOMContentLoaded", function() {
    // Inicialitzar localStorage amb usuaris si no existeix
    inicialitzarUsuaris();
    
    // Carregar i mostrar usuaris
    llistaUsuaris();
    
    // Afegir event listeners
    configurarEventListeners();
    
    // Configurar validació en temps real
    configurarValidacioTempsReal();
});

// Inicialitzar usuaris desde l'array User
function inicialitzarUsuaris() {
    let sessioiniciada = sessionStorage.getItem("usuariActual");
    const usuarisGuardats = localStorage.getItem("usuaris");
    
    // Netejar la sessió si conté un objecte JSON mal format
    if (sessioiniciada && (sessioiniciada.startsWith('{') || sessioiniciada.startsWith('['))) {
        try {
            const userData = JSON.parse(sessioiniciada);
            // Si és un objecte, extreure només l'email i guardar-lo netament
            if (userData.email) {
                sessionStorage.setItem("usuariActual", userData.email);
                sessioiniciada = userData.email;
            }
        } catch (e) {
            console.log("Netejant dades de sessió mal formades");
            // Si no es pot parsejar, intentar extreure l'email amb regex
            const emailMatch = sessioiniciada.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (emailMatch) {
                sessionStorage.setItem("usuariActual", emailMatch[0]);
                sessioiniciada = emailMatch[0];
            }
        }
    }
    
    if(!sessioiniciada) {
        window.location.href='../login.html';
    } else {
        // Mostrar el nom de l'usuari actual a la navbar
        mostrarUsuariActual(sessioiniciada);
    }
    
    if (!usuarisGuardats) {
        // Si localStorage està buit, copiar l'array User si existeix
        if (typeof User !== 'undefined' && User) {
            localStorage.setItem("usuaris", JSON.stringify(User));
            console.log("Usuaris inicialitzats des de l'array User");
        } else {
            // Si no hi ha array User, crear array buit
            localStorage.setItem("usuaris", JSON.stringify([]));
            console.log("Array d'usuaris buit creat");
        }
    }
}

// Mostrar el nom de l'usuari actual a la navbar
function mostrarUsuariActual(sessionData) {
    const userNameElement = document.getElementById("currentUserName");
    if (!userNameElement) return;
    
    let emailUsuari = sessionData;
    let userName = "Usuari";
    
    // Comprovar si sessionData és un objecte o un string
    try {
        // Si és un string que sembla JSON, intentar parsejar-lo
        if (typeof sessionData === 'string' && (sessionData.startsWith('{') || sessionData.startsWith('['))) {
            const userData = JSON.parse(sessionData);
            emailUsuari = userData.email || userData.mail || sessionData;
            userName = userData.name || userData.nom || userName;
        } else if (typeof sessionData === 'object' && sessionData !== null) {
            // Si ja és un objecte
            emailUsuari = sessionData.email || sessionData.mail || '';
            userName = sessionData.name || sessionData.nom || userName;
        } else if (typeof sessionData === 'string') {
            // Si és només un string (email)
            emailUsuari = sessionData;
            
            // Buscar l'usuari a la base de dades local
            const usuaris = obtenirUsuaris();
            const usuariActual = usuaris.find(u => 
                u.email === emailUsuari || 
                u.mail === emailUsuari ||
                u.name === emailUsuari ||
                u.nom === emailUsuari
            );
            
            if (usuariActual) {
                userName = usuariActual.name || usuariActual.nom || userName;
            } else if (emailUsuari && emailUsuari.includes('@')) {
                // Si no trobem l'usuari però tenim un email, usar la part abans del @
                userName = emailUsuari.split('@')[0];
            } else if (emailUsuari) {
                // Si no és un email, usar el valor tal qual
                userName = emailUsuari;
            }
        }
    } catch (e) {
        // Si hi ha algun error en el parsing, usar el valor per defecte
        console.log("Error processant dades d'usuari:", e);
        
        // Intentar extreure almenys alguna cosa útil del string
        if (typeof sessionData === 'string') {
            // Si conté "name":", intentar extreure el nom
            const nameMatch = sessionData.match(/"name"\s*:\s*"([^"]+)"/);
            if (nameMatch && nameMatch[1]) {
                userName = nameMatch[1];
            } else if (sessionData.includes('@')) {
                userName = sessionData.split('@')[0];
            } else {
                userName = sessionData.substring(0, 20); // Limitar la longitud
            }
        }
    }
    
    // Actualitzar l'element amb el nom d'usuari
    userNameElement.textContent = userName;
    userNameElement.title = `Sessió iniciada com: ${emailUsuari || userName}`;
}

// Obtenir usuaris de localStorage
function obtenirUsuaris() {
    const usuarisJSON = localStorage.getItem("usuaris");
    return usuarisJSON ? JSON.parse(usuarisJSON) : [];
}

// Guardar usuaris a localStorage
function guardarUsuaris(usuaris) {
    localStorage.setItem("usuaris", JSON.stringify(usuaris));
}

// Llistar tots els usuaris a la taula amb paginació
function llistaUsuaris(pagina = 1) {
    const usuaris = obtenirUsuaris();
    const tbody = document.getElementById("llistaUsuaris");
    const divSenseUsuaris = document.getElementById("senseUsuaris");
    const contadorUsuaris = document.getElementById("totalUsuaris");
    
    // Actualitzar el nom d'usuari per si ha canviat
    const sessioiniciada = sessionStorage.getItem("usuariActual");
    if (sessioiniciada) {
        mostrarUsuariActual(sessioiniciada);
    }
    
    // Actualitzar contador
    contadorUsuaris.textContent = usuaris.length;
    
    // Calcular paginació
    const totalPagines = Math.ceil(usuaris.length / usuarisPerPagina);
    paginaActual = pagina;
    
    // Validar pàgina
    if (paginaActual < 1) paginaActual = 1;
    if (paginaActual > totalPagines) paginaActual = totalPagines || 1;
    
    // Mostrar informació de paginació al header
    const infoPaginacio = document.getElementById("infoPaginacio");
    if (infoPaginacio) {
        if (totalPagines > 1) {
            infoPaginacio.textContent = ` | Pàgina ${paginaActual} de ${totalPagines} (${usuarisPerPagina} per pàgina)`;
            infoPaginacio.style.display = "inline";
        } else {
            infoPaginacio.style.display = "none";
        }
    }
    
    // Calcular índexs
    const inici = (paginaActual - 1) * usuarisPerPagina;
    const final = Math.min(inici + usuarisPerPagina, usuaris.length);
    
    // Netejar taula
    tbody.innerHTML = "";
    
    if (usuaris.length === 0) {
        // Mostrar missatge si no hi ha usuaris
        divSenseUsuaris.style.display = "block";
        document.getElementById("taulaUsuaris").style.display = "none";
        // Ocultar controls de paginació
        const paginacioElement = document.getElementById("paginacio");
        if (paginacioElement) {
            paginacioElement.style.display = "none";
        }
    } else {
        // Ocultar missatge i mostrar taula
        divSenseUsuaris.style.display = "none";
        document.getElementById("taulaUsuaris").style.display = "table";
        
        // Afegir cada usuari de la pàgina actual a la taula
        for (let i = inici; i < final; i++) {
            const usuari = usuaris[i];
            const fila = document.createElement("tr");
            
            // Crear cel·les
            const tdId = document.createElement("td");
            tdId.textContent = usuari.id;
            
            const tdNom = document.createElement("td");
            tdNom.textContent = usuari.name || usuari.nom || '';
            
            const tdEmail = document.createElement("td");
            tdEmail.textContent = usuari.email || '';
            
            const tdRol = document.createElement("td");
            tdRol.textContent = usuari.rol || '';
            
            const tdAccions = document.createElement("td");
            const divAccions = document.createElement("div");
            divAccions.className = "accions";
            
            // Crear botons amb data attributes (utilitzant l'índex real de l'array)
            const btnEditar = document.createElement("button");
            btnEditar.className = "btn-editar";
            btnEditar.textContent = "Editar";
            btnEditar.dataset.index = i;
            
            const btnEliminar = document.createElement("button");
            btnEliminar.className = "btn-eliminar";
            btnEliminar.textContent = "Eliminar";
            btnEliminar.dataset.index = i;
            
            divAccions.appendChild(btnEditar);
            divAccions.appendChild(btnEliminar);
            tdAccions.appendChild(divAccions);
            
            // Afegir cel·les a la fila
            fila.appendChild(tdId);
            fila.appendChild(tdNom);
            fila.appendChild(tdEmail);
            fila.appendChild(tdRol);
            fila.appendChild(tdAccions);
            
            tbody.appendChild(fila);
        }
        
        // Actualitzar controls de paginació
        actualitzarPaginacio(totalPagines);
    }
}

// Actualitzar controls de paginació
function actualitzarPaginacio(totalPagines) {
    let paginacioElement = document.getElementById("paginacio");
    
    // Si no trobem l'element, sortir
    if (!paginacioElement) {
        console.error("Element de paginació no trobat!");
        return;
    }
    
    // Netejar contingut anterior
    paginacioElement.innerHTML = "";
    
    // Només mostrar paginació si hi ha més d'una pàgina
    if (totalPagines <= 1) {
        paginacioElement.style.display = "none";
        return;
    }
    
    paginacioElement.style.display = "flex";
    
    // Botó pàgina anterior
    const btnAnterior = document.createElement("button");
    btnAnterior.className = "btn-paginacio";
    btnAnterior.innerHTML = "&laquo; Anterior";
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.onclick = () => {
        if (paginaActual > 1) {
            llistaUsuaris(paginaActual - 1);
        }
    };
    paginacioElement.appendChild(btnAnterior);
    
    // Crear botons de pàgines amb ellipsis
    const crearBotoPagina = (num) => {
        const btn = document.createElement("button");
        btn.className = "btn-paginacio";
        if (num === paginaActual) {
            btn.classList.add("actiu");
        }
        btn.textContent = num;
        btn.onclick = () => llistaUsuaris(num);
        return btn;
    };
    
    // Lògica per mostrar pàgines amb ellipsis
    if (totalPagines <= 7) {
        // Si hi ha 7 o menys pàgines, mostrar-les totes
        for (let i = 1; i <= totalPagines; i++) {
            paginacioElement.appendChild(crearBotoPagina(i));
        }
    } else {
        // Si hi ha més de 7 pàgines, utilitzar ellipsis
        if (paginaActual <= 3) {
            // Mostrar: 1 2 3 4 5 ... última
            for (let i = 1; i <= 5; i++) {
                paginacioElement.appendChild(crearBotoPagina(i));
            }
            const ellipsis = document.createElement("span");
            ellipsis.className = "ellipsis";
            ellipsis.textContent = "...";
            paginacioElement.appendChild(ellipsis);
            paginacioElement.appendChild(crearBotoPagina(totalPagines));
        } else if (paginaActual >= totalPagines - 2) {
            // Mostrar: 1 ... últimes 5 pàgines
            paginacioElement.appendChild(crearBotoPagina(1));
            const ellipsis = document.createElement("span");
            ellipsis.className = "ellipsis";
            ellipsis.textContent = "...";
            paginacioElement.appendChild(ellipsis);
            for (let i = totalPagines - 4; i <= totalPagines; i++) {
                paginacioElement.appendChild(crearBotoPagina(i));
            }
        } else {
            // Mostrar: 1 ... pàgina-1 pàgina pàgina+1 ... última
            paginacioElement.appendChild(crearBotoPagina(1));
            const ellipsis1 = document.createElement("span");
            ellipsis1.className = "ellipsis";
            ellipsis1.textContent = "...";
            paginacioElement.appendChild(ellipsis1);
            
            for (let i = paginaActual - 1; i <= paginaActual + 1; i++) {
                paginacioElement.appendChild(crearBotoPagina(i));
            }
            
            const ellipsis2 = document.createElement("span");
            ellipsis2.className = "ellipsis";
            ellipsis2.textContent = "...";
            paginacioElement.appendChild(ellipsis2);
            paginacioElement.appendChild(crearBotoPagina(totalPagines));
        }
    }
    
    // Botó pàgina següent
    const btnSeguent = document.createElement("button");
    btnSeguent.className = "btn-paginacio";
    btnSeguent.innerHTML = "Següent &raquo;";
    btnSeguent.disabled = paginaActual === totalPagines;
    btnSeguent.onclick = () => {
        if (paginaActual < totalPagines) {
            llistaUsuaris(paginaActual + 1);
        }
    };
    paginacioElement.appendChild(btnSeguent);
    
    // Informació de pàgina
    const infoPagina = document.createElement("div");
    infoPagina.className = "info-paginacio";
    infoPagina.textContent = `Pàgina ${paginaActual} de ${totalPagines}`;
    paginacioElement.appendChild(infoPagina);
}

// Configurar event listeners
function configurarEventListeners() {
    const formulari = document.getElementById("formulariUsuari");
    const btnCancelar = document.getElementById("btnCancelar");
    const tbody = document.getElementById("llistaUsuaris");
    
    // Submit del formulari amb HTML5 validation
    formulari.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Utilitzar checkValidity() per validar el formulari
        if (!formulari.checkValidity()) {
            // Mostrar missatges d'error personalitzats
            mostrarErrorsValidacio();
            // Trigger HTML5 validation UI
            formulari.reportValidity();
            return;
        }
        
        const index = parseInt(document.getElementById("indexUsuari").value);
        
        if (index === -1) {
            afegirUsuari();
        } else {
            actualitzarUsuari(index);
        }
    });
    
    // Botó cancel·lar
    btnCancelar.addEventListener("click", function() {
        cancelarEdicio();
    });
    
    // Event delegation per als botons de la taula
    tbody.addEventListener("click", function(e) {
        if (e.target.classList.contains("btn-editar")) {
            const index = parseInt(e.target.dataset.index);
            editarUsuari(index);
        } else if (e.target.classList.contains("btn-eliminar")) {
            const index = parseInt(e.target.dataset.index);
            eliminarUsuari(index);
        }
    });
    
    // Event listener per al botó de tancar sessió si existeix
    const btnTancarSessio = document.getElementById("btnTancarSessio");
    if (btnTancarSessio) {
        btnTancarSessio.addEventListener("click", function() {
            tancarSessio();
        });
    }
}

// Configurar validació en temps real
function configurarValidacioTempsReal() {
    const camps = ['nomUsuari', 'emailUsuari', 'passwordUsuari', 'rolUsuari'];
    
    camps.forEach(campId => {
        const element = document.getElementById(campId);
        if (element) {
            // Validar quan l'usuari surt del camp (blur)
            element.addEventListener('blur', function() {
                validarCamp(this);
            });
            
            // Netejar error quan l'usuari comença a escriure
            element.addEventListener('input', function() {
                if (this.validity.valid) {
                    netejarErrorCamp(this);
                }
            });
            
            // Per al camp select, validar on change
            if (element.tagName === 'SELECT') {
                element.addEventListener('change', function() {
                    validarCamp(this);
                });
            }
        }
    });
}

// Validar un camp individual
function validarCamp(camp) {
    const errorElement = document.getElementById(camp.id + 'Error');
    
    // Utilitzar l'API de validació HTML5
    if (!camp.validity.valid) {
        let missatgeError = '';
        
        // Personalitzar missatges d'error segons el tipus de validació
        if (camp.validity.valueMissing) {
            missatgeError = 'Aquest camp és obligatori';
        } else if (camp.validity.typeMismatch) {
            if (camp.type === 'email') {
                missatgeError = 'Introdueix un correu electrònic vàlid';
            }
        } else if (camp.validity.tooShort) {
            missatgeError = `Mínim ${camp.minLength} caràcters (actual: ${camp.value.length})`;
        } else if (camp.validity.tooLong) {
            missatgeError = `Màxim ${camp.maxLength} caràcters`;
        } else if (camp.validity.patternMismatch) {
            // Missatges personalitzats segons el camp
            switch(camp.id) {
                case 'nomUsuari':
                    missatgeError = 'El nom només pot contenir lletres i espais';
                    break;
                case 'emailUsuari':
                    missatgeError = 'Format de correu electrònic invàlid';
                    break;
                case 'passwordUsuari':
                    missatgeError = 'La contrasenya ha de tenir entre 8 i 20 caràcters';
                    break;
                default:
                    missatgeError = camp.validationMessage;
            }
        } else {
            missatgeError = camp.validationMessage;
        }
        
        // Mostrar error
        if (errorElement) {
            errorElement.textContent = missatgeError;
            errorElement.style.display = 'block';
        }
        camp.classList.add('invalid');
        camp.classList.remove('valid');
        
        return false;
    } else {
        // Camp vàlid
        netejarErrorCamp(camp);
        return true;
    }
}

// Netejar error d'un camp
function netejarErrorCamp(camp) {
    const errorElement = document.getElementById(camp.id + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
    camp.classList.remove('invalid');
    camp.classList.add('valid');
}

// Mostrar errors de validació per tots els camps
function mostrarErrorsValidacio() {
    const camps = document.querySelectorAll('#formulariUsuari input[required], #formulariUsuari select[required]');
    let primerCampInvalid = null;
    
    camps.forEach(camp => {
        if (!camp.validity.valid) {
            validarCamp(camp);
            if (!primerCampInvalid) {
                primerCampInvalid = camp;
            }
        }
    });
    
    // Focus al primer camp invàlid
    if (primerCampInvalid) {
        primerCampInvalid.focus();
    }
}

// Afegir nou usuari
function afegirUsuari() {
    const formulari = document.getElementById("formulariUsuari");
    
    // Doble comprovació amb HTML5 validation API
    if (!formulari.checkValidity()) {
        formulari.reportValidity();
        return;
    }
    
    const nom = document.getElementById("nomUsuari").value.trim();
    const email = document.getElementById("emailUsuari").value.trim();
    const password = document.getElementById("passwordUsuari").value;
    const rol = document.getElementById("rolUsuari").value;
    
    // Validació addicional: comprovar si l'email ja existeix
    const usuaris = obtenirUsuaris();
    if (usuaris.some(u => u.email === email)) {
        mostrarError("Aquest correu electrònic ja està registrat.");
        document.getElementById("emailUsuari").focus();
        return;
    }
    
    // Obtenir el següent ID
    const maxId = usuaris.reduce((max, u) => Math.max(max, u.id || 0), 0);
    
    // Crear nou usuari
    const nouUsuari = {
        id: maxId + 1,
        name: nom,
        password: password,
        email: email,
        rol: rol
    };
    
    // Afegir a l'array i guardar
    usuaris.push(nouUsuari);
    guardarUsuaris(usuaris);
    
    // Actualitzar UI - anar a l'última pàgina per veure el nou usuari
    const totalPagines = Math.ceil(usuaris.length / usuarisPerPagina);
    llistaUsuaris(totalPagines);
    netejarFormulari();
    mostrarExit("Usuari afegit correctament!");
}

// Editar usuari existent
function editarUsuari(index) {
    const usuaris = obtenirUsuaris();
    const usuari = usuaris[index];
    
    if (!usuari) return;
    
    // Omplir formulari amb dades de l'usuari
    document.getElementById("indexUsuari").value = index;
    document.getElementById("nomUsuari").value = usuari.name || usuari.nom || '';
    document.getElementById("emailUsuari").value = usuari.email || '';
    document.getElementById("passwordUsuari").value = usuari.password || '';
    document.getElementById("rolUsuari").value = usuari.rol || '';
    
    // Netejar estats de validació
    const camps = document.querySelectorAll('#formulariUsuari input, #formulariUsuari select');
    camps.forEach(camp => {
        camp.classList.remove('invalid', 'valid');
        netejarErrorCamp(camp);
    });
    
    // Canviar títol i botons
    document.getElementById("titolFormulari").textContent = "Editar Usuari";
    document.getElementById("btnAfegir").style.display = "none";
    document.getElementById("btnActualitzar").style.display = "inline-block";
    document.getElementById("btnCancelar").classList.remove("ocult");
    
    // Scroll al formulari
    document.querySelector(".formulari-usuari").scrollIntoView({ behavior: 'smooth' });
    
    // Focus al primer camp
    document.getElementById("nomUsuari").focus();
}

// Actualitzar usuari
function actualitzarUsuari(index) {
    const formulari = document.getElementById("formulariUsuari");
    
    // Validació HTML5
    if (!formulari.checkValidity()) {
        formulari.reportValidity();
        return;
    }
    
    const nom = document.getElementById("nomUsuari").value.trim();
    const email = document.getElementById("emailUsuari").value.trim();
    const password = document.getElementById("passwordUsuari").value;
    const rol = document.getElementById("rolUsuari").value;
    
    const usuaris = obtenirUsuaris();
    
    // Comprovar si l'email ja existeix en un altre usuari
    const emailExistent = usuaris.some((u, i) => i !== index && u.email === email);
    if (emailExistent) {
        mostrarError("Aquest correu electrònic ja està en ús per un altre usuari.");
        document.getElementById("emailUsuari").focus();
        return;
    }
    
    // Actualitzar usuari mantenint l'ID original
    usuaris[index] = {
        ...usuaris[index],
        name: nom,
        email: email,
        password: password,
        rol: rol
    };
    
    // Guardar canvis
    guardarUsuaris(usuaris);
    
    // Actualitzar UI mantenint la pàgina actual
    llistaUsuaris(paginaActual);
    cancelarEdicio();
    mostrarExit("Usuari actualitzat correctament!");
}

// Eliminar usuari
function eliminarUsuari(index) {
    // Confirmació abans d'eliminar
    if (!confirm("Estàs segur que vols eliminar aquest usuari?")) {
        return;
    }
    
    const usuaris = obtenirUsuaris();
    const usuariEliminat = usuaris[index];
    
    // Eliminar usuari de l'array
    usuaris.splice(index, 1);
    
    // Guardar canvis
    guardarUsuaris(usuaris);
    
    // Actualitzar UI - verificar si cal canviar de pàgina
    const totalPagines = Math.ceil(usuaris.length / usuarisPerPagina);
    if (paginaActual > totalPagines && totalPagines > 0) {
        paginaActual = totalPagines;
    }
    llistaUsuaris(paginaActual);
    mostrarExit(`Usuari "${usuariEliminat.name || usuariEliminat.email}" eliminat correctament.`);
}

// Cancel·lar edició
function cancelarEdicio() {
    netejarFormulari();
    
    // Restaurar títol i botons
    document.getElementById("titolFormulari").textContent = "Afegir Nou Usuari";
    document.getElementById("btnAfegir").style.display = "inline-block";
    document.getElementById("btnActualitzar").style.display = "none";
    document.getElementById("btnCancelar").classList.add("ocult");
}

// Netejar formulari
function netejarFormulari() {
    const formulari = document.getElementById("formulariUsuari");
    formulari.reset();
    document.getElementById("indexUsuari").value = "-1";
    
    // Netejar estats de validació i missatges d'error
    const camps = formulari.querySelectorAll('input, select');
    camps.forEach(camp => {
        camp.classList.remove('invalid', 'valid');
        netejarErrorCamp(camp);
    });
    
    netejarMissatges();
}

// Mostrar missatge d'error general
function mostrarError(missatge) {
    netejarMissatges();
    const divError = document.getElementById("missatgeError");
    divError.textContent = missatge;
    divError.style.display = "block";
    
    // Ocultar després de 5 segons
    setTimeout(() => {
        divError.style.display = "none";
    }, 5000);
}

// Mostrar missatge d'èxit
function mostrarExit(missatge) {
    netejarMissatges();
    const divExit = document.getElementById("missatgeExit");
    divExit.textContent = missatge;
    divExit.style.display = "block";
    
    // Ocultar després de 3 segons
    setTimeout(() => {
        divExit.style.display = "none";
    }, 3000);
}

// Netejar missatges
function netejarMissatges() {
    document.getElementById("missatgeError").style.display = "none";
    document.getElementById("missatgeExit").style.display = "none";
}

// Tancar Sessió
function tancarSessio() {
    sessionStorage.clear();
    window.location.href = '../login.html';
}

// Personalitzar missatges de validació HTML5 (opcional)
document.addEventListener("DOMContentLoaded", function() {
    // Personalitzar missatges per cada camp si és necessari
    const nomUsuari = document.getElementById("nomUsuari");
    if (nomUsuari) {
        nomUsuari.addEventListener("invalid", function(e) {
            e.preventDefault();
            if (this.validity.valueMissing) {
                this.setCustomValidity("El nom és obligatori");
            } else if (this.validity.tooShort) {
                this.setCustomValidity("El nom ha de tenir almenys 2 caràcters");
            } else if (this.validity.patternMismatch) {
                this.setCustomValidity("El nom només pot contenir lletres i espais");
            } else {
                this.setCustomValidity("");
            }
        });
        
        nomUsuari.addEventListener("input", function() {
            this.setCustomValidity("");
        });
    }
    
    const emailUsuari = document.getElementById("emailUsuari");
    if (emailUsuari) {
        emailUsuari.addEventListener("invalid", function(e) {
            e.preventDefault();
            if (this.validity.valueMissing) {
                this.setCustomValidity("El correu electrònic és obligatori");
            } else if (this.validity.typeMismatch || this.validity.patternMismatch) {
                this.setCustomValidity("Introdueix un correu electrònic vàlid");
            } else {
                this.setCustomValidity("");
            }
        });
        
        emailUsuari.addEventListener("input", function() {
            this.setCustomValidity("");
        });
    }
    
    const passwordUsuari = document.getElementById("passwordUsuari");
    if (passwordUsuari) {
        passwordUsuari.addEventListener("invalid", function(e) {
            e.preventDefault();
            if (this.validity.valueMissing) {
                this.setCustomValidity("La contrasenya és obligatòria");
            } else if (this.validity.tooShort) {
                this.setCustomValidity("La contrasenya ha de tenir almenys 8 caràcters");
            } else if (this.validity.tooLong) {
                this.setCustomValidity("La contrasenya no pot tenir més de 20 caràcters");
            } else {
                this.setCustomValidity("");
            }
        });
        
        passwordUsuari.addEventListener("input", function() {
            this.setCustomValidity("");
        });
    }
    
    const rolUsuari = document.getElementById("rolUsuari");
    if (rolUsuari) {
        rolUsuari.addEventListener("invalid", function(e) {
            e.preventDefault();
            if (this.validity.valueMissing) {
                this.setCustomValidity("Has de seleccionar un rol");
            } else {
                this.setCustomValidity("");
            }
        });
        
        rolUsuari.addEventListener("change", function() {
            this.setCustomValidity("");
        });
    }
});