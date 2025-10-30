// === FUNCIONES BASE ===

// Función que obtiene la lista de clientes del almacenamiento local (localStorage).
// Si no hay clientes guardados, devuelve un array vacío.
function obtenerClientes() {
  return JSON.parse(localStorage.getItem("clientes")) || [];
}

// Función que guarda la lista de clientes en el almacenamiento local.
function guardarClientes(clientes) {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

// Función para verificar duplicados 
function existeClienteDuplicado(taxid, email, excludeIndex = -1) {
  const clientes = obtenerClientes();
  return clientes.some((cliente, index) => {
    // Si estamos en modo edición, excluimos el cliente actual
    if (index === excludeIndex) return false;
    return cliente.taxid === taxid || cliente.email === email;
  });
}

// === VALIDACIÓN ===

// Función que valida los datos ingresados de un cliente antes de guardarlos.
function validarCliente(cliente, excludeIndex = -1) { 
  // Expresiones regulares para validaciones específicas
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valida formato de correo
  const phoneRegex = /^[0-9+\-\s()]{6,20}$/; // Valida formato de teléfono
  const cpRegex = /^\d{5}$/; // Valida que el código postal tenga 5 dígitos
  const soloLetras = /^[\p{L}\s'-]+$/u; // Valida que solo contenga letras y caracteres comunes en nombres

  // Verifica si el tipo de ID está seleccionado
  if (!cliente.taxidtype) {
    alert("Por favor, selecciona un tipo de ID.");
    return false;
  }

  // Lista de campos que son obligatorios
  const camposObligatorios = [
    "taxid", "name", "surname", "email", "phone",
    "cp", "address", "country_id", "province_id", "city_id"
  ];

  // Verifica que todos los campos obligatorios estén completos
  for (let campo of camposObligatorios) {
    if (!cliente[campo] || cliente[campo].trim() === "") {
      alert(`Por favor, completa el campo: ${campo}`);
      return false;
    }
  }

  // Validación del formato del correo electrónico
  if (!emailRegex.test(cliente.email)) {
    alert("Por favor, introduce un correo electrónico válido.");
    return false;
  }

  // Validación del formato del número de teléfono
  if (!phoneRegex.test(cliente.phone)) {
    alert("El teléfono debe tener un formato válido.");
    return false;
  }

  // Validación del código postal
  if (!cpRegex.test(cliente.cp)) {
    alert("El código postal debe tener 5 dígitos.");
    return false;
  }

  // Verifica que la fecha de nacimiento no sea una fecha futura
  if (cliente.birth_date) {
    const hoy = new Date();
    const fechaNac = new Date(cliente.birth_date);
    if (fechaNac > hoy) {
      alert("La fecha de nacimiento no puede ser futura.");
      return false;
    }
  }

  // Lista de campos que deben contener solo letras
  const camposSoloLetras = [
    { campo: cliente.name, nombre: "nombre" },
    { campo: cliente.surname, nombre: "apellido" },
    { campo: cliente.country_id, nombre: "país" },
    { campo: cliente.province_id, nombre: "provincia" },
    { campo: cliente.city_id, nombre: "ciudad" }
  ];

  // Verifica que los campos definidos contengan solo letras
  for (let item of camposSoloLetras) {
    if (!soloLetras.test(item.campo)) {
      alert(`El campo ${item.nombre} solo puede contener letras.`);
      return false;
    }
  }

  // VALIDACIÓN DE DUPLICADOS 
  if (existeClienteDuplicado(cliente.taxid, cliente.email, excludeIndex)) {
    alert("Ya existe un cliente con el mismo ID Fiscal o Email.");
    return false;
  }

  // Si todas las validaciones pasan, devuelve true
  return true;
}

// === FORM CREAR ===

// Selecciona el formulario de creación de clientes
const formCrear = document.querySelector("#formCrear");

if (formCrear) {
  // Agrega un manejador al evento 'submit' del formulario
  formCrear.addEventListener("submit", function (e) {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar página)

    // Crea un objeto cliente con los valores ingresados en el formulario
    const cliente = {
      taxidtype: formCrear.taxidtype.value.trim(),
      taxid: formCrear.taxid.value.trim(),
      name: formCrear.name.value.trim(),
      surname: formCrear.surname.value.trim(),
      email: formCrear.email.value.trim(),
      phone: formCrear.phone.value.trim(),
      birth_date: formCrear.birth_date.value,
      cp: formCrear.cp.value.trim(),
      address: formCrear.address.value.trim(),
      country_id: formCrear.country_id.value.trim(),
      province_id: formCrear.province_id.value.trim(),
      city_id: formCrear.city_id.value.trim()
    };

    // Si el cliente no pasa la validación, se detiene el proceso
    if (!validarCliente(cliente)) return; 

    // Obtiene la lista actual de clientes, agrega el nuevo y guarda la lista actualizada
    const clientes = obtenerClientes();
    clientes.push(cliente); // Agrega el nuevo cliente a la lista
    guardarClientes(clientes);

    // Redirige a la página principal (index.html) después de guardar
    window.location.href = "index.html";
  });
}