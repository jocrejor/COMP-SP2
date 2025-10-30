document.addEventListener("DOMContentLoaded", main);

function main() {
    const formulari = document.getElementById('formOferta');
    const entradaOferta = document.getElementById('ofertaInput');
    const entradaPercentatge = document.getElementById('percentajeInput');
    const entradaCupo = document.getElementById('couponInput');
    const entradaDataInici = document.getElementById('dataIniciInput');
    const entradaDataFi = document.getElementById('datafiInput');

    const parametres = new URLSearchParams(window.location.search);
    const indexEditar = parametres.get('edit');

    let dades = JSON.parse(localStorage.getItem("formData")) || [];

    if (indexEditar !== null && !isNaN(indexEditar) && dades[indexEditar]) {
        const element = dades[indexEditar];
        entradaOferta.value = element.oferta || "";
        entradaPercentatge.value = element.percentaje || "";
        entradaCupo.value = element.coupon || "";
        entradaDataInici.value = element.dataInici || "";
        entradaDataFi.value = element.dataFi || "";
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

    function validarOferta() {
        const valor = entradaOferta.value.trim();
        if (!valor) {
            return "El camp Oferta és obligatori.";
        }
        if (valor.length < 2) {
            return "L'oferta ha de tenir com a mínim 2 caràcters.";
        }
        return "";
    }

    function validarPercentatge() {
        const val = entradaPercentatge.value.trim();
        if (!val) {
            return "El percentatge és obligatori.";
        }
        const num = Number(val);
        if (isNaN(num)) {
            return "El percentatge ha de ser un número.";
        }
        if (!Number.isInteger(num)) {
            return "El percentatge ha de ser un número enter.";
        }
        if (num > 100) {
            return "El percentatge no pot ser superior a 100.";
        }
        if (num <= 0) {
            return "El percentatge ha de ser major que 0.";
        }
        return "";
    }

    function validarDataInici() {
        if (!entradaDataInici.value) {
            return "La data d'inici és obligatòria.";
        }
        const dataInici = new Date(entradaDataInici.value);
        const avui = new Date();
        avui.setHours(0, 0, 0, 0);
        
        if (dataInici < avui) {
            return "La data d'inici no pot ser anterior a avui.";
        }
        return "";
    }

    function validarDataFi() {
        if (!entradaDataFi.value) {
            return "La data de fi és obligatòria.";
        }
        return "";
    }

    function validarDates() {
        if (entradaDataFi.value && entradaDataInici.value) {
            const dataInici = new Date(entradaDataInici.value);
            const dataFi = new Date(entradaDataFi.value);
            
            if (dataInici >= dataFi) {
                return "La data d'inici ha de ser anterior a la data de fi.";
            }
        }
        return "";
    }

    formulari.addEventListener('submit', function(e) {
        e.preventDefault();

        let errors = [];

        const errorOferta = validarOferta();
        if (errorOferta) errors.push(errorOferta);

        const errorPercentatge = validarPercentatge();
        if (errorPercentatge) errors.push(errorPercentatge);

        const errorDataInici = validarDataInici();
        if (errorDataInici) errors.push(errorDataInici);

        const errorDataFi = validarDataFi();
        if (errorDataFi) errors.push(errorDataFi);

        const errorDates = validarDates();
        if (errorDates) errors.push(errorDates);

        if (errors.length > 0) {
            mostrarMissatge(errors.join('\n'), "error");
            return;
        }

        if (!formulari.checkValidity()) {
            mostrarMissatge("Completa tots els camps obligatoris", "error");
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
            localStorage.setItem("formData", JSON.stringify(dades));
            mostrarMissatge("Oferta editada correctament!", "success");
        } else {
            mostrarMissatge("Error: No s'ha trobat l'índex per editar.", "error");
            return;
        }

        setTimeout(() => window.location.href = "listOfer.html", 1200);
    });
}

