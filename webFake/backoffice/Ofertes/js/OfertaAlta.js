document.addEventListener("DOMContentLoaded", main);

// Funció principal que gestiona l'alta de noves ofertes
// Inicialitza el formulari i configura la validació en temps real
function main() {
    const formulari          = document.getElementById('formOferta');
    const entradaOferta      = document.getElementById('ofertaInput');
    const entradaPercentatge = document.getElementById('percentajeInput');
    const entradaCupo        = document.getElementById('couponInput');
    const entradaDataInici   = document.getElementById('dataIniciInput');
    const entradaDataFi      = document.getElementById('datafiInput');

    // Funció per a crear els elements que mostraran els missatges d'error
    // Crea un div per a cada camp del formulari on es mostraran els errors
    // Els elements es creen només si no existeixen ja en el DOM
    function crearElementsError() {
        const camps = ['oferta', 'percentaje', 'coupon', 'dataInici', 'datafi'];
        camps.forEach(function(camp) {
            const campInput = document.getElementById(camp + 'Input');
            const errorExist = document.getElementById(camp + 'Error');
            if (campInput && !errorExist) {
                const errorElement = document.createElement('div');
                errorElement.id = camp + 'Error';
                errorElement.className = 'error-message';
                campInput.parentNode.appendChild(errorElement);
            }
        });
    }

    const avui           = new Date().toISOString().split('T')[0];
    entradaDataInici.min = avui;
    entradaDataFi.min    = avui;

    const parametres  = new URLSearchParams(window.location.search);
    const indexEditar = parametres.get('edit');

    let dades = JSON.parse(localStorage.getItem("formData")) || [];

    if (indexEditar !== null && !isNaN(indexEditar) && dades[indexEditar]) {
        const element            = dades[indexEditar];
        entradaOferta.value      = element.oferta || "";
        entradaPercentatge.value = element.percentaje || "";
        entradaCupo.value        = element.coupon || "";
        entradaDataInici.value   = element.dataInici || "";
        entradaDataFi.value      = element.dataFi || "";
    }

    function mostrarMissatge(text, tipus = "error") {
        let missatge = document.getElementById("mensaje");
        if (!missatge) {
            missatge = document.createElement("p");
            missatge.id = "mensaje";
            while (missatge.firstChild) {
                missatge.removeChild(missatge.firstChild);
            }
            missatge.appendChild(document.createTextNode(text));
            missatge.style.color = tipus === "error" ? "red" : "green";
            formulari.parentNode.insertBefore(missatge, formulari);
        } else {
            while (missatge.firstChild) {
                missatge.removeChild(missatge.firstChild);
            }
            missatge.appendChild(document.createTextNode(text));
            missatge.style.color = tipus === "error" ? "red" : "green";
        }
    }

    // Funció per a mostrar o amagar errors en els camps
    // Si no hi ha missatge, neteja l'error del camp
    function mostrarErrorCamp(campId, missatge) {
        const campError = document.getElementById(campId + 'Error');
        const camp      = document.getElementById(campId + 'Input');
        
        if (campError && camp) {
            if (missatge) {
                campError.textContent   = missatge;
                campError.style.display = 'block';
                camp.style.borderColor  = '#e74c3c';
            } else {
                campError.textContent   = '';
                campError.style.display = 'none';
                camp.style.borderColor  = '';
            }
        }
    }

    // Funció principal de validació del formulari
    // Comprova tots els camps obligatoris i les seues restriccions
    function validarFormulari() {
        let esValid = true;

        mostrarErrorCamp('oferta');
        mostrarErrorCamp('percentaje');
        mostrarErrorCamp('dataInici');
        mostrarErrorCamp('datafi');

        if (!entradaOferta.value.trim()) {
            mostrarErrorCamp('oferta', 'El nom de l\'oferta és obligatori');
            esValid = false;
        } else if (entradaOferta.value.trim().length < 2) {
            mostrarErrorCamp('oferta', 'L\'oferta ha de tenir com a mínim 2 caràcters');
            esValid = false;
        }

        if (!entradaPercentatge.value) {
            mostrarErrorCamp('percentaje', 'El percentatge és obligatori');
            esValid = false;
        } else {
            const percentatge = parseInt(entradaPercentatge.value);
            if (percentatge < 1 || percentatge > 100) {
                mostrarErrorCamp('percentaje', 'El percentatge ha de ser entre 1 i 100');
                esValid = false;
            }
        }

        if (!entradaDataInici.value) {
            mostrarErrorCamp('dataInici', 'La data d\'inici és obligatòria');
            esValid = false;
        }

        if (!entradaDataFi.value) {
            mostrarErrorCamp('datafi', 'La data de fi és obligatòria');
            esValid = false;
        }

        if (entradaDataInici.value && entradaDataFi.value) {
            const dataInici = new Date(entradaDataInici.value);
            const dataFi    = new Date(entradaDataFi.value);
            
            if (dataInici >= dataFi) {
                mostrarErrorCamp('datafi', 'La data de fi ha de ser posterior a la data d\'inici');
                esValid = false;
            }
        }

        return esValid;
    }

    crearElementsError();

    formulari.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validarFormulari()) {
            mostrarMissatge("Corregeix els errors del formulari", "error");
            return;
        }

        const novaDada = {
            oferta: entradaOferta.value.trim(),
            percentaje: entradaPercentatge.value.trim(),
            coupon: entradaCupo.value.trim(),
            dataInici: entradaDataInici.value,
            dataFi: entradaDataFi.value
        };

        if (indexEditar !== null && !isNaN(indexEditar)) {
            dades[indexEditar] = novaDada;
            mostrarMissatge("Oferta editada correctament!", "success");
        } else {
            dades.push(novaDada);
            mostrarMissatge("Oferta afegida correctament!", "success");
        }
        
        localStorage.setItem("formData", JSON.stringify(dades));

        setTimeout(() => window.location.href = "index.html", 1200);
    });

    entradaOferta.addEventListener('input', function() {
        if (this.value.trim().length >= 2) {
            mostrarErrorCamp('oferta');
        }
    });

    entradaPercentatge.addEventListener('input', function() {
        const valor = parseInt(this.value);
        if (valor >= 1 && valor <= 100) {
            mostrarErrorCamp('percentaje');
        }
    });

    entradaDataInici.addEventListener('change', function() {
        if (this.value && entradaDataFi.value) {
            const dataInici = new Date(this.value);
            const dataFi    = new Date(entradaDataFi.value);
            if (dataFi > dataInici) {
                mostrarErrorCamp('datafi');
            }
        }
    });

    entradaDataFi.addEventListener('change', function() {
        if (entradaDataInici.value && this.value) {
            const dataInici = new Date(entradaDataInici.value);
            const dataFi    = new Date(this.value);
            if (dataFi > dataInici) {
                mostrarErrorCamp('datafi');
            }
        }
    });
}