
document.addEventListener("DOMContentLoaded", main);

let accio = "afegir";

function main() {
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
    mostrarLlista();
    
    afegirButton.addEventListener("click", () => {
        if (accio === "afegir") {
            crearCategoria();
        } else {
            actualitzarCategoria();
            accio = "afegir";
            afegirButton.textContent = accio;
        }
        document.getElementById("category").value = "";
        document.getElementById("index").value = "-1";
        mostrarLlista();
    });  
}

function crearCategoria() {
    const categoria = document.getElementById("category").value.trim();
    const missatgeError = document.getElementById("missatgeError");
    
    if (!validationName(categoria, missatgeError)) {
        return;
    }
    
    const existingCategories = localStorage.getItem("category") ? JSON.parse(localStorage.getItem("category")) : [];
    existingCategories.push(categoria);
    localStorage.setItem("category", JSON.stringify(existingCategories));
    removeErrors(missatgeError);
}

function actualitzarCategoria() {
    const categoria = document.getElementById("category").value.trim();
    const missatgeError = document.getElementById("missatgeError");
    
    if (!validationName(categoria, missatgeError)) {
        return;
    }
    
    const categories = JSON.parse(localStorage.getItem("category")) || [];
    categories[document.getElementById("index").value] = categoria;
    localStorage.setItem("category", JSON.stringify(categories));
    removeErrors(missatgeError);
}

function mostrarLlista() {
    const visualitzarLlista = document.getElementById("llista");
    const categories = localStorage.getItem("category") ? JSON.parse(localStorage.getItem("category")) : [];
    visualitzarLlista.textContent = "";
    let aux = "";
    
    categories.forEach((item, index) => {
        aux += "<li><button onclick='esborrar(" + index + ")'>Esborrar</button><button onclick='actualitzar(" + index + ")'>Modificar</button> " + item + "</li>";
    });

    visualitzarLlista.innerHTML = aux;
}

function esborrar(index) {
    const categories = JSON.parse(localStorage.getItem("category")) || [];
    const confirmDelete = confirm(`Segur que vols eliminar la categoria ${categories[index]}?`);
    if (confirmDelete) {
        categories.splice(index, 1);
        localStorage.setItem("category", JSON.stringify(categories));
        mostrarLlista();
    }
}

function actualitzar(index) {
    const categories = JSON.parse(localStorage.getItem("category")) || [];
    console.log(categories[index]);
    document.getElementById("index").value = index;
    document.getElementById("category").value = categories[index];
    accio = "actualitzar";      
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
}

// Validació del nom
function validationName(categoria, messageElement) {
    const element = document.getElementById("category");

    if (categoria === "") {
        error(messageElement, "Has d'introduir una categoria");
        return false;
    }

    if (!element.checkValidity()) {
        if (element.validity.patternMismatch) {
            error(messageElement, "La categoria ha de tindre entre 2 i 20 caràcters i començar amb majúscula.");
        } else {
            error(messageElement, "Categoria no vàlida");
        }
        return false;
    }
    
    removeErrors(messageElement);
    return true;
}

function error(element, missatge) {
    element.textContent = missatge;
    element.style.color = "red";
}

function removeErrors(element) {
    element.textContent = "";
    element.style.color = "";
}
