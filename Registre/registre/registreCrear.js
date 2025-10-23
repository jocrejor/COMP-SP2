document.addEventListener("DOMContentLoaded", main);

function main() {
    cargarLocation();
    const form = document.getElementById("formClient");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Validar el formulari
        if (!validarAlta(form)) return;

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
        let repetir_password = document.getElementById("repetir_password").value;
        
        if(!validarDni(taxid, taxidtype)){
            
        }

        validarAlta();
        validarDni();
        form.reset();
    });
}
    // Funció per fer les validacions del formulari
    function validarAlta(form) {

    // Netejem els errors anteriors
    document.getElementById("error_name").textContent = "";
    document.getElementById("error_surname").textContent = "";
    document.getElementById("error_taxid").textContent = "";
    document.getElementById("error_phone").textContent = "";
    document.getElementById("error_email").textContent = "";
    document.getElementById("error_address").textContent = "";
    document.getElementById("error_cp").textContent = "";
    document.getElementById("error_password").textContent = "";
    document.getElementById("error_repetir_password").textContent = "";

    // Validacions del HTML
    if (!form.checkValidity()) {
        if (!document.getElementById("name").checkValidity()) {
            let error_name = document.getElementById("error_name");
            error_name.textContent = "";
            let errorTextName = document.createTextNode ("El nom és obligatori");
            error_name.appendChild(errorTextName);
        }

        if (!document.getElementById("surname").checkValidity()) {
            let error_surname = document.getElementById("error_surname");
            error_surname.textContent = "";
            let errorTextSurname = document.createTextNode ("El cognom és obligatori");
            error_surname.appendChild(errorTextSurname);
        }

        if (!document.getElementById("taxid").checkValidity()) {
            let error_taxid = document.getElementById("error_taxid");
            error_taxid.textContent = "";
            let errorTextTaxid = document.createTextNode("El Dni no és vàlid");
            error_taxid.appendChild(errorTextTaxid);
        }

        if (!document.getElementById("phone").checkValidity()) {
            let error_phone = document.getElementById("error_phone");
            error_phone.textContent = "";
            let errorTextPhone = document.createTextNode("El telèfon no és vàlid");
            error_phone.appendChild(errorTextPhone);
        }

        if (!document.getElementById("email").checkValidity()) {
            let error_email = document.getElementById("error_email");
            error_email.textContent = "";
            let errorTextEmail = document.createTextNode("L'email no és vàlid");
            error_email.appendChild(errorTextEmail);
        }

        if (!document.getElementById("address").checkValidity()) {
            let error_address = document.getElementById("error_address");
            error_address.textContent = "";
            let errorTextAddress = document.createTextNode("L'adreça no és vàlida");
            error_address.appendChild(errorTextAddress);
        }

        if (!document.getElementById("cp").checkValidity()) {
            let error_cp = document.getElementById("error_cp");
            error_cp.textContent = "";
            let errorTextCp = document.createTextNode ("El codi postal no ès vàlid");
            error_cp.appendChild(errorTextCp);
        }

        if (!document.getElementById("password").checkValidity()) {
            let error_password = document.getElementById("error_password");
            error_password.textContent = "";
            let errorTextPassword = document.createTextNode("La contrasenya no ès vàlida");
            error_password.appendChild(errorTextPassword);
        }

        if(!document.getElementById("repetir_password").checkVisibility()){
            let error_repetir_password = document.getElementsByName("error_repetir_password");
            error_repetir_password.textContent = "";
            let errorTextRepetirPassword = document.createTextNode("Les contrasenyes no coincideixen");
            error_repetir_password.appendChild(errorTextRepetirPassword);
        }
        return false;
    }
    return true;    
    }


// Funció per validar el DNI
function validarDni(taxid, taxidtype){
    if(taxidtype === "DNI"){
        return /^[0-9]{8}[A-HJ-NP-TV-Z]$/i.test(taxid);    
    }else if (taxidtype === "NIE"){
        return /^[XYZ][0-9]{7}[A-Z]$/i.test(taxid);
    }else if (taxidtype === "Passaport"){
        return /^[a-z]{3}[0-9]{6}[a-z]?$/i.test(taxid);
    }
    return false;
}

// Funció per carregar les dades de localització
function cargarLocation (){
    const countrySelect = document.getElementById("country_id");
    const provinceSelect = document.getElementById("province_id");
    const citySelect = document.getElementById("city_id");

    // Carreguem els paisos
    Country.forEach(element => {
        let option = document.createElement("option");
        option.value = element.id;
        option.textContent = element.name;
        countrySelect.appendChild(option);
    });
}
