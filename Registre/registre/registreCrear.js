document.addEventListener("DOMContentLoaded", main);

function main() {
    const form = document.getElementById("formClient");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Validar el formulari
        if (!validarAlta()) return;

        // Arrepleguem els valors del formulari
        let id = document.getElementById("id").value;
        let name = document.getElementById("name").value;
        let surname = document.getElementById("surname").value;
        let taxidtype = document.getElementById("taxidtype").value;
        let taxid = document.getElementById("taxid").value;
        let birth_date = document.getElementById("birth_date").value;
        let phone = document.getElementById("phone").value;
        //let user_name = document.getElementById("user_name").value;
        let email = document.getElementById("email").value;
        let address = document.getElementById("address").value;
        let cp = document.getElementById("cp").value;
        let country_id = document.getElementById("country_id").value;
        let province_id = document.getElementById("province_id").value;
        let city_id = document.getElementById("city_id").value;
        let password = document.getElementById("password").value;
        //let repetir = document.getElementById("repetir").value;

        mostrarClients();
    });

    // Les validacions
    function validarAlta() {

    // Netejem els errors anteriors
    document.getElementById("error_name").textContent = "";
    document.getElementById("error_surname").textContent = "";
    document.getElementById("error_taxid").textContent = "";
    document.getElementById("error_phone").textContent = "";
    document.getElementById("error_email").textContent = "";
    document.getElementById("error_address").textContent = "";
    document.getElementById("error_cp").textContent = "";
    document.getElementById("error_password").textContent = "";

    // Validacions del HTML
    if (!form.checkValidity()) {
        if (!document.getElementById("name").checkValidity()) {
            document.getElementById("error_name").textContent = "El nom és obligatori";
        }

        if (!document.getElementById("surname").checkValidity()) {
            document.getElementById("error_surname").textContent = "El cognom és obligatori";
        }

        if (!document.getElementById("taxid").checkValidity()) {
            document.getElementById("error_taxid").textContent = "El Dni no és vàlid";
        }

        if (!document.getElementById("phone").checkValidity()) {
            document.getElementById("error_phone").textContent = "El telèfon no és vàlid";
        }

        if (!document.getElementById("email").checkValidity()) {
            document.getElementById("error_email").textContent = "L'email no és vàlid";
        }

        if (!document.getElementById("address").checkValidity()) {
            document.getElementById("error_address").textContent = "L'adreça no és vàlida";
        }

        if (!document.getElementById("cp").checkValidity()) {
            document.getElementById("error_cp").textContent = "El codi postal no ès vàlid";
        }

        if (!document.getElementById("password").checkValidity()) {
            document.getElementById("error_password").textContent = "La contrasenya no ès vàlida";
        }
        return false;
    }
    return true;    
    }
}
