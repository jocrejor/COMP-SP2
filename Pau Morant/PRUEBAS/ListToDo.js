document.addEventListener("DOMContentLoaded", main);

let llista = new Array();


function main() {    
    const afegirButton = document.getElementById("afegir");
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

function mostraLlista(){
    const visualitzarLlista = document.getElementById("llista");
    visualitzarLlista.innerHTML = "";
    let aux = ""
    llista.forEach((item) =>{
        aux += "<li> " + item.tasca + " Prioritat: " + item.prioritat + "</li>";
    });
    visualitzarLlista.innerHTML = aux;
}