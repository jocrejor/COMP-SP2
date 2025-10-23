document.addEventListener('DOMContentLoaded', function() {
    const formulari = document.getElementById('formulariLogin');
    
    formulari.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita l'enviament per defecte del formulari
        
        const usuari = document.getElementById('usuari').value;
        const contrasenya = document.getElementById('contrasenya').value;
        
        function validarCredencials(usuari, contrasenya) {
            const elementUsuari = document.getElementById('usuari');
            const elementContrasenya = document.getElementById('contrasenya');
            
            if(!elementContrasenya.checkValidity()) {
                const error = document.getElementById('missatgeError');
                error.textContent = 'La contrasenya ha de tenir entre 8 i 20 caràcters.';
                return false;
            }
            
            if(!elementUsuari.checkValidity()) {
                const error = document.getElementById('missatgeError');
                error.textContent = 'El nom d\'usuari ha de tenir entre 5 i 15 caràcters.';
                return false;
            }
            
            return true;
        }
        
        if(validarCredencials(usuari, contrasenya)) {
            window.location.href = '/dashboard/dashboard.html';
        }
    });
});