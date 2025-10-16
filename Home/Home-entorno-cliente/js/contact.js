
// ✅ Cuando la página carga, mostramos todos los contactos guardados
document.addEventListener("DOMContentLoaded", showContacts);

// 🎯 Capturamos el formulario
const form = document.getElementById("contactForm");
const cancelEdit = document.getElementById("cancelEdit");

// ✅ Evento para guardar un nuevo contacto
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Evita que se recargue la página

  // Obtenemos los valores del formulario
  const id = document.getElementById("contactId").value;
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const date = document.getElementById("date").value;

  // Leemos los contactos del localStorage
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

  // Si hay id → se está editando un contacto existente
  if (id) {
    contacts[id] = { name, phone, email, subject, date };
  } else {
    // Si no hay id → es un contacto nuevo
    contacts.push({ name, phone, email, subject, date });
  }

  // Guardamos la lista actualizada
  localStorage.setItem("contacts", JSON.stringify(contacts));

  // Limpiamos el formulario y actualizamos la lista
  form.reset();
  document.getElementById("contactId").value = "";
  showContacts();
});

// ✅ Cancelar la edición
cancelEdit.addEventListener("click", function () {
  form.reset();
  document.getElementById("contactId").value = "";
});

// Mostrar los contactos en la página
function showContacts() {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  const list = document.getElementById("contactList");
  list.replaceChildren(); // Limpiamos la lista

  // Si no hay contactos guardados
  if (contacts.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No hay contactos guardados.";
    list.appendChild(p);
    return;
  }

  // Si hay contactos, los mostramos uno por uno
  contacts.forEach((contacts, index) => {
    const div = document.createElement("div");

    div.appendChild(document.createTextNode(`name: ${contacts.name}`));
    div.appendChild(document.createElement("br"));

    div.appendChild(document.createTextNode(`teléfono: ${contacts.phone}`));
    div.appendChild(document.createElement("br"));

    div.appendChild(document.createTextNode(`email: ${contacts.email}`));
    div.appendChild(document.createElement("br"));

    div.appendChild(document.createTextNode(`fecha: ${contacts.date}`));
    div.appendChild(document.createElement("br"));

    div.appendChild(document.createTextNode(`subject: ${contacts.subject}`));
    div.appendChild(document.createElement("br"));

    list.appendChild(div);
  })
}

// ✅ Eliminar un contacto
function deleteContact(index) {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  contacts.splice(index, 1); // Elimina el contacto por posición
  localStorage.setItem("contacts", JSON.stringify(contacts));
  showContacts(); // Actualiza la lista
}

// ✅ Editar un contacto
function editContact(index) {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  const c = contacts[index];

  // Rellenamos los campos del formulario
  document.getElementById("contactId").value = index;
  document.getElementById("name").value = c.name;
  document.getElementById("phone").value = c.phone;
  document.getElementById("email").value = c.email;
  document.getElementById("subject").value = c.subject;
  document.getElementById("date").value = c.date;
}

