document.addEventListener("DOMContentLoaded", main);

function main () {
    document.getElementById("tornar").addEventListener("click",tornar);
    document.getElementById("btnGravar").addEventListener("click", validar, false);
}

function tornar () {
    window.location.assign("llistatProductes.html");
}

function validarNom() {
    
    return true;

}


function validarPreu() {
    return true;
}


function validarDescripcio() {
    return true;
}


function validar(e) {
    esborrarError();
    e.preventDefault();
    if (validarNom() && 
        validarPreu() &&
        validarDescripcio()) {

        enviarFormulari();
        return true;

    } else {
        return false;
    }
}


function error(element, missatge) {
    const textError = document.createTextNode(missatge);
    const elementError = document.getElementById("missatgeError")
    elementError.appendChild(textError)
    element.classList.add( "error" )
    element.focus();
}

function esborrarError() {
    
    let formulari = document.forms[0].elements;
        for (let ele of formulari) {
            ele.classList.remove("error")
        }    
    document.getElementById("missatgeError").replaceChildren(); 

}

// enviar dades
function enviarFormulari() {
    // Grabar al localStorage

    setTimeout(function (){
        /* document.getElementById("nom").value="";
        document.getElementById("anynaix").value=0; */

    },1000);
}

// Formulari anterior
/* document.addEventListener("DOMContentLoaded", main);

let llista = new Array();

let accio = "Afegir";

function main () {
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
    llista = localStorage.getItem("llistaProductes") ? JSON.parse(localStorage.getItem("llistaProductes")) : [];
    mostrarLlista();

    afegirButton.addEventListener("click", () => {
        if (accio === "Afegir") {
            crearProducte();
        } else {
            actualitzarProducte();
            accio = "Afegir";
            afegirButton.textContent = accio;
        }
        document.getElementById("nom").value = "";
        document.getElementById("preu").value = "";
        document.getElementById("descripcio").value = "";
        document.getElementById("index").value = "-1";
        mostrarLlista();
    })
}

function crearProducte () {
    const nom = document.getElementById("nom").value;
    const preu = document.getElementById("preu").value;
    const descripcio = document.getElementById("descripcio").value;

    if (nom === "") {
        alert("El nom no pot estar buit");
        return
    }

    if (preu === "") {
        alert("El preu no pot estar buit");
        return
    }

    llista.push({"nom":nom, "preu":preu, "descripcio":descripcio});
    localStorage.setItem("llistaProductes", JSON.stringify(llista));
}

function actualitzarProducte () {
    const nom = document.getElementById("nom").value;
    const preu = document.getElementById("preu").value;
    const descripcio = document.getElementById("descripcio").value;
    
    if (nom === "") {
        alert("El nom no pot estar buit");
        return
    }

    if (preu === "") {
        alert("El preu no pot estar buit");
        return
    }

    if (descripcio === "") {
        descripcio = "&nbsp;"
        return
    }
    // Actualitzar l'element

    llista[document.getElementById("index").value] = {"nom":nom, "preu":preu, "descripcio":descripcio};
    localStorage.setItem("llistaProductes", JSON.stringify(llista));
}

function mostrarLlista () {
    const visualitzarLlista = document.getElementById("llista");
    visualitzarLlista.innerHTML = "";

    let aux = "";
    llista.forEach((item, index) => {
        aux += "<li>" + item.nom + ", Preu: " + item.preu + "€, Descripció: " + item.descripcio + " <button type='button' onclick='actualitzar("+ index +")'>Veure imatges</button><button type='button' onclick='actualitzar("+ index +")'>Modificar</button><button type='button' onclick='esborrar("+ index +")'>Borrar</button></li>";
        visualitzarLlista.innerHTML = aux;
    })
}

function esborrar(index) {
    llista.splice(index,1);
    localStorage.setItem("llistaProductes", JSON.stringify(llista));
    mostrarLlista();
}

function actualitzar(index) {
    console.log(llista[index]);
    document.getElementById("index").value = index;
    document.getElementById("nom").value = llista[index].nom;
    document.getElementById("preu").value = llista[index].preu;
    document.getElementById("descripcio").value = llista[index].descripcio;
    accio = "Actualitzar";      
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
} */