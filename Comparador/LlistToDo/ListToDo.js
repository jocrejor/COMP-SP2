document.addEventListener("DOMContentLoaded", main);

let llista = new Array();
let accio = "afegir";


function main() {
    const visualitzarLlista = document.getElementById("llista");
    const afegirButton = document.getElementById("afegir");
    llista = localStorage.getItem("listtodo") ? JSON.parse(localStorage.getItem("listtodo")): [];
    mostrarLlista();
    afegirButton.addEventListener("click", () => {
        const tasca = document.getElementById("tasca").value;
        if (tasca == ""){
            alert("La tasca no pot estar buida");
            return;
        }
        const prioritat = document.getElementById("prioritat").value;
        llista.push({"tasca": tasca , "prioritat" :prioritat});
        localStorage.setItem("listtodo", JSON.stringify(llista));
        mostrarLlista();
        console.log(llista);
    });
}

function mostrarLlista(){
    const visualitzarLlista = document.getElementById("llista");
    visualitzarLlista.innerHTML = "";
    let aux = ""
    llista.forEach((item,index) => {
        aux += " <li> <button onclick id = 'esborrar'("+ index +") <button>DEL</button> <button>MOD</button> " + item.tasca + " Prioritat: " + item.prioritat + "</li>"
    });
    visualitzarLlista.innerHTML = aux;
}

function esborrar(index){
    llista.slice(index,1);
    localStorage.setItem("listtodo", JSON.stringify(llista));
    mostrarLlista();

}

function actualitzar(index){
    console.log(llista(index));
    document.getElementById("tasca").value = llista[index]
}