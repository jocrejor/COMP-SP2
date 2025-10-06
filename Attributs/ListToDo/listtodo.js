document.addEventListener('DOMContentLoaded', main);

let llista = new Array();

let accio = "Afegir";
function main() {
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio
    llista = localStorage.getItem("listodo") ? JSON.parse(localStorage.getItem("listodo")) : [];
    mostrarLlista();
    
    console.log(llista);
    afegirButton.addEventListener("click", () => {
        if (accio === "Afegir") {
            crearTasca();
        } else {
            actualitzarTasca();
            accio = "Afegir";
            afegirButton.textContent = accio;
        }
        mostrarLlista();
    });
}

function crearTasca(){
     const tasca = document.getElementById("tasca").value;
        if(tasca ===""){
            console.log("Introdueix una tasca");
            return;
        }

        const prioritat = document.getElementById("prioritat").value;
        llista.push({"tasca" : tasca, "prioritat" : prioritat});
        localStorage.setItem("listodo", JSON.stringify(llista));
}

function actualitzarTasca(){
    const tasca = document.getElementById("tasca").value;
        if(tasca ===""){
            console.log("Introdueix una tasca");
            return;
        }

        const prioritat = document.getElementById("prioritat").value;
        
}


function mostrarLlista() {
    const visualitzallista = document.getElementById("llista");
    visualitzallista.innerHTML = "";
    
    let li = "";
    llista.forEach((item, index) => {
        li += " <li><button onclick = 'esborrar("+ index + ")'>Del</button><button onclick = 'actualitzar("+ index + ")'>Upd</button>" + item.tasca + " Prioritat: " + item.prioritat + " </li>";
    });
    console.log(li);
    visualitzallista.innerHTML = li;
}

function esborrar(index) {
    llista.splice(index, 1);
    localStorage.setItem("listodo", JSON.stringify(llista));
    mostrarLlista();
}

function actualitzar(index) {
    console.log(llista [index]);
    document.getElementById("tasca").value = llista[index].tasca;
    document.getElementById("prioritat").value = llista[index].prioritat;
    accio = "actualitzar";
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
}