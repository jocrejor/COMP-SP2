let botoEixir = document.getElementById('logount'); 

botoEixir.addEventListener('click', function() {
    // Borra l'usuari actiu
    sessionStorage.removeItem("usuariActiu");

    // Torna a llistar
    window.location.href = "informacio.html";
});
