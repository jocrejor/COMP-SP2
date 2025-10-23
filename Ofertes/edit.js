document.addEventListener("DOMContentLoaded", function () { // Esperem que el DOM estiga carregat
    const form = document.getElementById('formOferta'); // Formulari d'ofertes
    const ofertaInput = document.getElementById('ofertaInput'); // Input d'oferta
    const percentajeInput = document.getElementById('percentajeInput'); // Input de percentatge
    const dataIniciInput = document.getElementById('dataIniciInput'); // Input de data d'inici
    const datafiInput = document.getElementById('datafiInput'); // Input de data de fi

    const params = new URLSearchParams(window.location.search);// Obtenim els paràmetres de la URL
    const editIndex = params.get('edit');// Obtenim l'índex de l'oferta a editar

    let data = JSON.parse(localStorage.getItem("formData")) || []; // Recuperem les dades desades a localStorage

    // Si hi ha un índex d'edició, omplim els camps amb les dades existents

    if (editIndex !== null && !isNaN(editIndex) && data[editIndex]) {
        const item = data[editIndex];
        ofertaInput.value = item.oferta || "";
        percentajeInput.value = item.percentaje || "";
        dataIniciInput.value = item.dataInici || "";
        datafiInput.value = item.dataFi || "";
    }
    // Funció per mostrar missatges d'error o èxit
    function mostrarMensaje(texto, tipo = "error") {
        let mensaje = document.getElementById("mensaje");
        if (!mensaje) {
            mensaje = document.createElement("p");
            mensaje.id = "mensaje";
            form.parentNode.insertBefore(mensaje, form);
        }
        mensaje.textContent = texto;
        mensaje.style.color = tipo === "error" ? "red" : "green";
    }
    // Funció per validar l'oferta
    function validarOferta() {
        const valor = ofertaInput.value.trim();
        if (!valor) {
            return "El camp Oferta és obligatori.";
        }
        if (valor.length < 2) {
            return "L'oferta ha de tenir com a mínim 2 caràcters.";
        }
        return "";
    }
    // Funció per validar el percentatge
    function validarPercentaje() {
        const val = percentajeInput.value.trim();
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
    // Funció per validar la data d'inici
    function validarDataInici() {
        if (!dataIniciInput.value) {
            return "La data d'inici és obligatòria.";
        }
        const dataInici = new Date(dataIniciInput.value);
        const avui = new Date();
        avui.setHours(0, 0, 0, 0);

        if (dataInici < avui) {
            return "La data d'inici no pot ser anterior a avui.";
        }
        return "";
    }
    // Funció per validar la data de fi
    function validarDataFi() {
        if (!datafiInput.value) {
            return "La data de fi és obligatòria.";
        }
        return "";
    }
    // Funció per validar que la data d'inici sigua anterior a la data de fi
    function validarFechas() {
        if (datafiInput.value && dataIniciInput.value) {
            const dataInici = new Date(dataIniciInput.value);
            const dataFi = new Date(datafiInput.value);

            if (dataInici >= dataFi) {
                return "La data d'inici ha de ser anterior a la data de fi.";
            }
        }
        return "";
    }
    // Gestor de l'esdeveniment de submissió del formulari
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        let errors = [];

        const errorOferta = validarOferta();
        if (errorOferta) errors.push(errorOferta);

        const errorPercentaje = validarPercentaje();
        if (errorPercentaje) errors.push(errorPercentaje);

        const errorDataInici = validarDataInici();
        if (errorDataInici) errors.push(errorDataInici);

        const errorDataFi = validarDataFi();
        if (errorDataFi) errors.push(errorDataFi);

        const errorFechas = validarFechas();
        if (errorFechas) errors.push(errorFechas);

        if (errors.length > 0) {
            mostrarMensaje(errors.join('\n'), "error");
            return;
        }

        const newData = {
            oferta: ofertaInput.value.trim(),
            percentaje: percentajeInput.value.trim(),
            dataInici: dataIniciInput.value,
            dataFi: datafiInput.value
        };

        if (editIndex !== null && !isNaN(editIndex)) {
            data[editIndex] = newData;
            localStorage.setItem("formData", JSON.stringify(data));
            mostrarMensaje("Oferta editada correctament!", "success");
        } else {
            mostrarMensaje("Error: No s'ha trobat l'índex per editar.", "error");
            return;
        }

        setTimeout(() => window.location.href = "listOfer.html", 1200);
    });
});