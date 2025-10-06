document.addEventListener("DOMContentLoaded",main);

function main(){
    let titol = document.getElementById("titol");
    titol.textContent="Bon dia";

    document.getElementById("boto").addEventListener("click",()=>{
        titol.textContent = "Bona Vesprada"
    })

    
    
}
