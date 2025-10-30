// === FUNCIONES BASE ===

// Obtiene la lista de clientes almacenados en localStorage
// Si no hay datos, devuelve un array vacío
function obtenerClientes() {
  return JSON.parse(localStorage.getItem("clientes")) || [];
}

// Guarda la lista de clientes en localStorage, serializándola a JSON
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

// Función que valida los datos de un cliente antes de guardarlos
function validarCliente(cliente, excludeIndex = -1) { 
  // Expresiones regulares para validar email, teléfono, código postal y campos solo letras
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+\-\s()]{6,20}$/;
  const cpRegex = /^\d{5}$/;
  const soloLetras = /^[\p{L}\s'-]+$/u; // Valida que solo contenga letras y caracteres comunes en nombres

  // Verifica que se haya seleccionado un tipo de ID
  if (!cliente.taxidtype) {
    alert("Por favor, selecciona un tipo de ID.");
    return false;
  }

  // Campos obligatorios que deben estar completos
  const camposObligatorios = [
    "taxid", "name", "surname", "email", "phone",
    "cp", "address", "country_id", "province_id", "city_id"
  ];

  // Recorre cada campo obligatorio para comprobar que no esté vacío
  for (let campo of camposObligatorios) {
    if (!cliente[campo] || cliente[campo].trim() === "") {
      alert(`Por favor, completa el campo: ${campo}`);
      return false;
    }
  }

  // Valida el formato del correo electrónico
  if (!emailRegex.test(cliente.email)) {
    alert("Por favor, introduce un correo electrónico válido.");
    return false;
  }

  // Valida el formato del teléfono
  if (!phoneRegex.test(cliente.phone)) {
    alert("El teléfono debe tener un formato válido.");
    return false;
  }

  // Valida que el código postal tenga 5 dígitos
  if (!cpRegex.test(cliente.cp)) {
    alert("El código postal debe tener 5 dígitos.");
    return false;
  }

  // Si se proporciona fecha de nacimiento, comprueba que no sea futura
  if (cliente.birth_date) {
    const hoy = new Date();
    const fechaNac = new Date(cliente.birth_date);
    if (fechaNac > hoy) {
      alert("La fecha de nacimiento no puede ser futura.");
      return false;
    }
  }

  // Campos que deben contener solo letras (con tildes y espacios permitidos)
  const camposSoloLetras = [
    { campo: cliente.name, nombre: "nombre" },
    { campo: cliente.surname, nombre: "apellido" },
    { campo: cliente.country_id, nombre: "país" },
    { campo: cliente.province_id, nombre: "provincia" },
    { campo: cliente.city_id, nombre: "ciudad" }
  ];

  // Recorre y valida cada campo que debe contener solo letras
  for (let item of camposSoloLetras) {
    if (!soloLetras.test(item.campo)) {
      alert(`El campo ${item.nombre} solo puede contener letras.`);
      return false;
    }
  }

  // VALIDACIÓN DE DUPLICADOS (NUEVO)
  if (existeClienteDuplicado(cliente.taxid, cliente.email, excludeIndex)) {
    alert("Ya existe un cliente con el mismo ID Fiscal o Email.");
    return false;
  }

  // Si todo pasa, devuelve true para indicar que es válido
  return true;
}

// === FORM EDITAR ===

// Selecciona el formulario de edición en la página
const formEditar = document.querySelector("#formEditar");
if (formEditar) {
  // Obtiene los parámetros de la URL para identificar qué cliente se edita (por índice)
  const params = new URLSearchParams(window.location.search);
  const index = parseInt(params.get("id"));
  const clientes = obtenerClientes(); // Obtiene la lista de clientes guardados
  const cliente = clientes[index];    // Cliente seleccionado para editar

  // Si no se encuentra el cliente, muestra alerta y redirige a la lista
  if (!cliente) {
    alert("Cliente no encontrado.");
    window.location.href = "index.html";
  } else {
    // Si existe el cliente, carga sus datos en el formulario para editar
    formEditar.taxidtype.value = cliente.taxidtype;
    formEditar.taxid.value = cliente.taxid;
    formEditar.name.value = cliente.name;
    formEditar.surname.value = cliente.surname;
    formEditar.email.value = cliente.email;
    formEditar.phone.value = cliente.phone;
    formEditar.birth_date.value = cliente.birth_date || "";
    formEditar.cp.value = cliente.cp;
    formEditar.address.value = cliente.address;
    formEditar.country_id.value = cliente.country_id;
    formEditar.province_id.value = cliente.province_id;
    formEditar.city_id.value = cliente.city_id;
  }

  // Escucha el evento submit del formulario para guardar cambios
  formEditar.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Crea un objeto cliente con los datos editados y limpiados (trim)
    const clienteEditado = {
      taxidtype: formEditar.taxidtype.value.trim(),
      taxid: formEditar.taxid.value.trim(),
      name: formEditar.name.value.trim(),
      surname: formEditar.surname.value.trim(),
      email: formEditar.email.value.trim(),
      phone: formEditar.phone.value.trim(),
      birth_date: formEditar.birth_date.value,
      cp: formEditar.cp.value.trim(),
      address: formEditar.address.value.trim(),
      country_id: formEditar.country_id.value.trim(),
      province_id: formEditar.province_id.value.trim(),
      city_id: formEditar.city_id.value.trim()
    };

    // Valida los datos antes de guardar, si no pasa la validación, no continúa
    if (!validarCliente(clienteEditado, index)) return;

    // Obtiene la lista de clientes, actualiza el cliente en la posición correspondiente
    const clientes = obtenerClientes();
    clientes[index] = clienteEditado;
    guardarClientes(clientes); // Guarda la lista actualizada en localStorage

    // Redirige a la página principal tras guardar los cambios
    window.location.href = "index.html";
  });
}