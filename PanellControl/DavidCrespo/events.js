document.addEventListener("DOMContentLoaded",main);

function main (){
    let titol = document.getElementById("titol");
    titol.textContent="Bon dia";

    document.getElementById("boto").addEventListener("click",()=>{
       titol.textContent="Bona vesprada"
    })
    const data= new Date 
    document.getElementById("rellotge").textContent= data.toLocaleTimeString();
}

setTimeout(()=>{
       titol.style='color:red';
},3000)

setInterval(()=> {
    const data= new Date
    document.getElementById("rellotge").textContent= data.toLocaleTimeString();
},1000)