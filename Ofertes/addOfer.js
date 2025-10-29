document.addEventListener("DOMContentLoaded", function () {
    const form            = document.getElementById('formOferta');
    const ofertaInput     = document.getElementById('ofertaInput');
    const percentajeInput = document.getElementById('percentajeInput');
    const couponInput     = document.getElementById('couponInput');
    const dataIniciInput  = document.getElementById('dataIniciInput');
    const datafiInput     = document.getElementById('datafiInput');

    const params    = new URLSearchParams(window.location.search);
    const editIndex = params.get('edit');

    let data = JSON.parse(localStorage.getItem("formData")) || [];

    if (editIndex !== null && !isNaN(editIndex) && data[editIndex]) {
        const item            = data[editIndex];
        ofertaInput.value     = item.oferta || "";
        percentajeInput.value = item.percentaje || "";
        couponInput.value     = item.coupon || "";
        dataIniciInput.value  = item.dataInici || "";
        datafiInput.value     = item.dataFi || "";
    }

    function mostrarMensaje(texto, tipo = "error") {
        let mensaje = document.getElementById("mensaje");
        if (!mensaje) {
            mensaje = document.createElement("p");
            mensaje.id = "mensaje";
            while (mensaje.firstChild) {
                mensaje.removeChild(mensaje.firstChild);
            }
            mensaje.appendChild(document.createTextNode(texto));
            mensaje.style.color = tipo === "error" ? "red" : "green";
            form.parentNode.insertBefore(mensaje, form);
        } else {
            while (mensaje.firstChild) {
                mensaje.removeChild(mensaje.firstChild);
            }
            mensaje.appendChild(document.createTextNode(texto));
            mensaje.style.color = tipo === "error" ? "red" : "green";
        }
    }

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

    function validarDataInici() {
        if (!dataIniciInput.value) {
            return "La data d'inici és obligatòria.";
        }
        const dataInici = new Date(dataIniciInput.value);
        const avui      = new Date();
        avui.setHours(0, 0, 0, 0);

        if (dataInici < avui) {
            return "La data d'inici no pot ser anterior a avui.";
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
        if (datafiInput.value && dataIniciInput.value) {
            const dataInici = new Date(dataIniciInput.value);
            const dataFi = new Date(datafiInput.value);

            if (dataInici >= dataFi) {
                return "La data d'inici ha de ser anterior a la data de fi.";
            }
        }
        return "";
    }

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
            coupon: couponInput.value.trim(),
            dataInici: dataIniciInput.value,
            dataFi: datafiInput.value
        };

        if (editIndex !== null && !isNaN(editIndex)) {
            data[editIndex] = newData;
            mostrarMensaje("Oferta editada correctament!", "success");
        } else {
            data.push(newData);
            mostrarMensaje("Oferta afegida correctament!", "success");
        }

        localStorage.setItem("formData", JSON.stringify(data));

        setTimeout(() => window.location.href = "listOfer.html", 1200);
    });
});