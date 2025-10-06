document.addEventListener("DOMContentLoaded", main);

let llista = new Array();
let accio = "afegit";


function main() {    
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
    llista = localStorage.getItem("listtodo") ? JSON.parse(localStorage.getItem("listtodo")) : []; 
    mostraLlista();

    afegirButton.addEventListener("click", () =>{
        const tasca = document.getElementById("tasca").value;
        if (tasca === ""){
            alert("No buida");
            return;
        }
        const prioritat = document.getElementById("prioritat").value;
        llista.push({"tasca":tasca, "prioritat":prioritat});
        localStorage.setItem("listtodo", JSON.stringify(llista));
        mostraLlista();
        console.log(llista);
    });
}

function crear(){

}

function actualitzarTasca(){

}

function mostraLlista(){
    const visualitzarLlista = document.getElementById("llista");
    visualitzarLlista.innerHTML = "";
    let aux = ""
    llista.forEach((item, index) =>{
        aux += "<li><button onclick='esborrar("+ index + ")'> Del</button> <button>Upd</button>" + item.tasca + " Prioritat: " + item.prioritat + "</li>";
    });
    visualitzarLlista.innerHTML = aux;
}

function esborrar(index){
    llista.splice(index, 1);
    localStorage.setItem("listtodo", JSON.stringify(llista));
    mostraLlista();
}

function actualitzar(index){
    console.log(llista[index]);
    document.getElementById("tasca").value = llista[index].tasca;
    document.getElementById("prioritat").value = llista[index].prioritat;
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
}