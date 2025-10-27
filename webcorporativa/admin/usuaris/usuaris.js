document.addEventListener("DOMContentLoaded"), llistaUsuaris()
function llistaUsuaris() {
    window.localStorage.getItem("usuaris");
    if(!localStorage.usuaris){
        const usuaris = window.User;
        localStorage.setItem("usuaris", JSON.stringify(usuaris));
    }
    const taulaUsuaris = document.getElementById("taulaUsuaris");
    
}
