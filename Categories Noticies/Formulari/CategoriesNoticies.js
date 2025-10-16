<<<<<<< HEAD
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
        aux += "<li><button onclick='esborrar(" + index + ")'>Del</button><button onclick='actualitzar(" + index + ")'>Upd</button> " + item + "</li>";
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
=======
// Cuando el DOM se carga completamente, se ejecuta la función main()
document.addEventListener("DOMContentLoaded", main)


function main(){
  // Se seleccionan los elementos del HTML necesarios
  const sendCategoryButton = document.getElementById("btSend")
  const listCategoryButton = document.getElementById("btList")
  const nameCategoryText = document.getElementById("category")
  const categoryList = document.getElementById("categoryList")
  const messageDebugg = document.getElementById("message")

  // Se muestran las categorías guardadas al cargar la página
  displayCategory(categoryList)

  // Se añade un evento al botón para guardar una nueva categoría
  sendCategoryButton.addEventListener("click", () => {   // Se obtiene el valor del input
    addCategory(nameCategoryText, messageDebugg, categoryList)
          
    })

    listCategoryButton.addEventListener("click", () => {
      window.location.href = "CategoriesLlistat.HTML"
    })
}

  function addCategory(input, message, container){
    const nameCategory = input.value.trim()

    // Validació del nom
    if(!validationName(nameCategory, message)){
      return false;
    }

          if (nameCategory) {
            // Si ya existen categorías en localStorage, se recuperan, sino se inicializa un array vacío
            const existingCategories = localStorage.getItem("category") ? JSON.parse(localStorage.getItem("category")) : [];
            // Se añade la nueva categoría al array
            existingCategories.push(nameCategory);
            // Se guarda el array actualizado en localStorage
            localStorage.setItem("category", JSON.stringify(existingCategories));
            message.innerHTML = "Categoria guardada correctament."  // Se muestra un mensaje confirmando el guardado
            input.value = ""
          } else {
              displayCategory(container)
              message.innerHTML = "No s'ha introduït cap categoria."  // Si no se ha escrito nada, se muestra un mensaje
              }
  }
  
  //Funcio per a la validacio del nom
  function validationName(categoria, messageElement) {
  const element = document.getElementById("category");

  if (!element.checkValidity()) {
    if (element.validity.valueMissing) {
      error(messageElement, "Has d'introduir una categoria");
    } else if (element.validity.patternMismatch) {
      error(messageElement, "La categoria ha de tindre entre 2 i 20 caracters i començar amb majúscula.");
    } else {
      error(messageElement, "Categoria no vàlida");
    }
    return false;
  }
  return true;
}
  function error (element, missatge){
    element.innerHTML = missatge;
  }

  // Función que se encarga de mostrar las categorías guardadas
  function displayCategory(container) {
    // Se obtienen las categorías de localStorage (si no existen, se usa un array vacío)
    const nameFromLocalStorage = localStorage.getItem("category") 
      ? JSON.parse(localStorage.getItem("category")) : []

    console.log("hola " + nameFromLocalStorage)  // Se imprime en consola para depuración

    if(nameFromLocalStorage.length > 0){
      container.innerHTML = "Caregoria correctamety introduida"
    } else {
      container.innerHTML = "No hi han dades"
    }
  }

  

>>>>>>> 5776a92 (Renombrada la carpeta, passat a getElementById)
