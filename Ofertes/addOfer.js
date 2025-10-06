const form = document.getElementById('formOferta');
const ofertaInput = document.getElementById('ofertaInput');
const percentajeInput = document.getElementById('percentajeInput');
const dataIniciInput = document.getElementById('dataIniciInput');
const datafiInput = document.getElementById('datafiInput');

const params = new URLSearchParams(window.location.search);
const editIndex = params.get('edit');

let data = JSON.parse(localStorage.getItem("formData")) || [];

if (editIndex !== null) {
    const item = data[editIndex];
    if (item) {
        ofertaInput.value = item.oferta;
        percentajeInput.value = item.percentaje;
        dataIniciInput.value  = item.dataInici;
        datafiInput.value     = item.dataFi;
    }
}

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

function validarOferta() {
    if (!ofertaInput.value.trim()) {
        return "El camp Oferta és obligatori.";
    }
    return "";
}

function validarPercentaje() {
    const val = percentajeInput.value.trim();
    if (!val) {
        return "El percentatge és obligatori.";
    }
    if (isNaN(val) || !Number.isInteger(Number(val))) {
        return "El percentatge ha de ser un número enter.";
    }
    if (Number(val) > 100) {
        return "El percentatge no pot ser superior a 100.";
    }
    if (Number(val) <= 0) {
        return "El percentatge ha de ser major que 0.";
    }
    return "";
}

function validarDataInici() {
    if (!dataIniciInput.value) {
        return "La data d'inici és obligatòria.";
    }
    return "";
}

function validarDataFi() {
    if (!datafiInput.value) {
        return "La data de fi és obligatòria.";
    }
    return "";
}

function validarFechas() {
    if (datafiInput.value && dataIniciInput.value && dataIniciInput.value > datafiInput.value) {
        return "La data d'inici no pot ser superior a la data de fi.";
    }
    return "";
}

form.addEventListener('submit', function(e) {
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

    if (editIndex !== null) {
        data[editIndex] = newData;
    } else {
        data.push(newData);
    }
    localStorage.setItem("formData", JSON.stringify(data));

    form.reset();
    mostrarMensaje(editIndex !== null ? "Oferta editada correctament!" : "Oferta afegida correctament!", "success");
    setTimeout(() => window.location.href = "listOfer.html", 1200);
});


