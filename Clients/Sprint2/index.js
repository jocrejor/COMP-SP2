// === FUNCIONES BASE ===

/**
 * Obtiene la lista de clientes desde el almacenamiento local (localStorage)
 * @returns {Array} Lista de clientes, o array vacío si no hay datos
 */
function obtenerClientes() {
  // localStorage.getItem("clientes") obtiene el string JSON almacenado
  // JSON.parse() convierte el string JSON a un objeto/array de JavaScript
  // || [] devuelve array vacío si localStorage.getItem("clientes") es null/undefined
  return JSON.parse(localStorage.getItem("clientes")) || [];
}

/**
 * Guarda la lista de clientes en el almacenamiento local
 * @param {Array} clientes - Array de objetos cliente a guardar
 */
function guardarClientes(clientes) {
  // localStorage.setItem("clientes", ...) almacena datos persistentemente en el navegador
  // JSON.stringify(clientes) convierte el array de clientes a formato string JSON
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

/**
 * Elimina un cliente de la lista por su índice
 * @param {number} index - Posición del cliente en el array a eliminar
 */
function eliminarCliente(index) {
  // confirm() muestra un diálogo de confirmación al usuario
  // Si el usuario cancela (!confirm), la función termina sin hacer cambios
  if (!confirm("¿Estás seguro de que quieres eliminar este cliente?")) return;
  
  // Obtiene la lista actual de clientes
  const clientes = obtenerClientes();
  
  // array.splice(index, 1) elimina 1 elemento en la posición 'index'
  // Esto modifica el array original
  clientes.splice(index, 1);
  
  // Guarda la lista actualizada (sin el cliente eliminado)
  guardarClientes(clientes);
  
  // Vuelve a renderizar la tabla para reflejar los cambios
  mostrarClientes();
}

// === MOSTRAR CLIENTES EN INDEX ===

/**
 * Renderiza la tabla de clientes en la página principal
 * Crea filas dinámicamente con los datos de localStorage
 */
function mostrarClientes() {
  // Selecciona el cuerpo de la tabla donde se insertarán los clientes
  const tbody = document.querySelector("#tablaClientes tbody");
  
  // Si no encuentra el elemento tbody, sale de la función (página no cargada correctamente)
  if (!tbody) return;

  // Obtiene la lista de clientes actual
  const clientes = obtenerClientes();
  
  // Limpia el contenido actual del tbody para re-renderizar
  tbody.innerHTML = "";

  // Si no hay clientes registrados, muestra mensaje de "vacío"
  if (clientes.length === 0) {
    const fila = document.createElement("tr");
    // colspan="14" hace que la celda ocupe todas las columnas de la tabla
    fila.innerHTML = `<td colspan="14" style="text-align: center;">No hay clientes registrados</td>`;
    tbody.appendChild(fila);
    return; // Termina la función aquí
  }

  // Itera sobre cada cliente en el array y crea una fila en la tabla
  clientes.forEach((cliente, index) => {
    // Crea un nuevo elemento <tr> (fila de tabla)
    const fila = document.createElement("tr");
    
    // Template literal que genera el HTML para cada celda de la fila
    fila.innerHTML = `
      <td>${index}</td> 
      <td>${cliente.taxidtype}</td> 
      <td>${cliente.taxid}</td> 
      <td>${cliente.name}</td> 
      <td>${cliente.surname}</td> 
      <td>${cliente.email}</td> 
      <td>${cliente.phone}</td> 
      <td>${cliente.birth_date || ""}</td> 
      <td>${cliente.cp}</td> 
      <td>${cliente.address}</td> 
      <td>${cliente.country_id}</td> 
      <td>${cliente.province_id}</td> 
      <td>${cliente.city_id}</td> 
      <td>
        
        <a href="editar.html?id=${index}">Editar</a> |
        <button onclick="eliminarCliente(${index})">Eliminar</button>
      </td>
    `;
    
    // Añade la fila completa al cuerpo de la tabla
    tbody.appendChild(fila);
  });
}

// === INICIALIZACIÓN ===

// Ejecuta mostrarClientes() cuando se carga la página
// Esto asegura que la tabla se renderice con los datos actuales
mostrarClientes();