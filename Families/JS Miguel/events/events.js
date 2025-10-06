document.addEventListener("DOMContentLoaded", main);

function main () {
    let titol =  document.getElementById("titol");
    titol.textContent = "Bon dia";

    document.getElementById("boto").addEventListener("click", ()=> {
        titol.textContent = "Bon Vesprada";
    })

    document.getElementById("boto2").addEventListener("click", ()=> {
        titol.textContent = "Bon Nit";
    })
}

setTimeout(()=> {
    titol.style = "color : red";
},3000);

setInterval(()=> {
    let data = new Date;
    document.getElementById("rellotge").textContent = data.toLocaleTimeString();
},1000);