// Cuando el DOM se carga completamente, se ejecuta la función main()
document.addEventListener("DOMContentLoaded", main)

function main() {
  const categoryList = document.getElementById("categoryList")
  const addCategoryButton = document.getElementById("btInput")
  const listCategoryButton = document.getElementById("btList")

  // Mostrar categorías guardadas
  displayCategory(categoryList)

  // Botón para volver a añadir categoría
  addCategoryButton.addEventListener("click", () => {
    window.location.href = "CategoriesNoticies.html"
  })

  // Botón para refrescar lista
  listCategoryButton.addEventListener("click", () => {
    displayCategory(categoryList)
  })
}

// Función para mostrar las categorías desde localStorage
function displayCategory(container) {
  const categories = localStorage.getItem("category") 
    ? JSON.parse(localStorage.getItem("category")) 
    : [];
  
  // Netejem el contingut previ
  container.textContent = "";
  
  if (categories.length > 0) {
    // Creem element llista
    const ul = document.createElement("ul");

    // Creem elements li per a cada categoria
    categories.forEach((cat, index) => {
      const li = document.createElement("li");

      // Afegim text de la categoria
      li.textContent = cat;

      // Creem botó d'eliminar
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Eliminar";
      deleteBtn.addEventListener("click", () => deleteCategory(index));

      // Creem botó d'editar  
      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.addEventListener("click", () => editCategory(index));
      
      //Posem els botons dins del li
      li.appendChild(document.createTextNode(" ")); // space before button
      li.appendChild(deleteBtn);
      li.appendChild(document.createTextNode(" ")); // space between buttons
      li.appendChild(editBtn);
      // Posem li dins del ul
      ul.appendChild(li);
    });
    
    // Append ul to container
    container.appendChild(ul);
  } else {
    container.textContent = "No hi han dades";
  }
}

// Función para eliminar categorías
function deleteCategory(index) {
  const categories = JSON.parse(localStorage.getItem("category")) || []
  const confirmDelete = confirm(`¿Segur que vols eliminar la categoria ${categories[index]}?`)
  if (confirmDelete) {
    categories.splice(index, 1)
    localStorage.setItem("category", JSON.stringify(categories))
    displayCategory(document.querySelector("#categoryList"))
  }
}

// Función para editar categorías
function editCategory(index) {
  const categories = JSON.parse(localStorage.getItem("category")) || [];
  const oldName = categories[index];
  const newName = prompt("Escriu el nou nom per a la categoria:", oldName);

  if (newName && newName.trim() !== "") {
    if (!validateCategoryName(newName.trim())) {
      alert("La categoria ha de tenir entre 2 i 20 lletres, començar amb majúscula i només lletres.");
      return;
    }
    categories[index] = newName.trim();
    localStorage.setItem("category", JSON.stringify(categories));
    displayCategory(document.querySelector("#categoryList")); //Actualització de la llista
  }
}


// Validacio dels noms cuan s'escriuen
function validateCategoryName(name) {
  const pattern = /^[A-Z][a-z]{1,19}$/; // 2 a 20 lletres, comença amb majúscula
  return pattern.test(name);
}