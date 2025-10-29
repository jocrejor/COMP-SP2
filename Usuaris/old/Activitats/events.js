document.addEventListener("DOMContentLoaded",main);

function main (){
    let titol = document.getElementById("titol");
    titol.textContent="Bon dia";
    document.getElementById("boto").addEventListener("click",()=>{
        titol.textContent="Bona vesprada"
    })
    
}

setTimeout(()=>{
    titol.style='color:red';
},2500)

setInterval(()=> {
    const data = new Date
    document.getElementById("rellotge").textContent = data.toLocaleTimeString()
},1000)

