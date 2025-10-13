
//Boto de logount
let botoEixir = document.getElementById('logount');

botoEixir.addEventListener('click', function(){
    // Esborrem dades d'usuari de la sessió
    sessionStorage.clear();

    // Tornem al login
    window.location.href = "informacio.html";
});
function logout() {
  sessionStorage.removeItem("usuariActiu");
  window.location.href = "informacio.html"; 
}