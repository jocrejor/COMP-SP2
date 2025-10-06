
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

// ✅ Mostrar los contactos en la página
function showContacts() {
  const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  const list = document.getElementById("contactList");
  list.innerHTML = "";

  // Si no hay contactos guardados
  if (contacts.length === 0) {
    list.innerHTML = "<p>No hay contactos registrados.</p>";
    return;
  }

  // Si hay contactos, los mostramos uno por uno
  contacts.forEach((contact, index) => {
    list.innerHTML += `
      <div>
        <strong>${contact.name}</strong><br>
        📞 ${contact.phone}<br>
        📧 ${contact.email}<br>
        🗓️ ${contact.date}<br>
        💬 ${contact.subject}<br><br>

        <button onclick="editContact(${index})">Editar</button>
        <button onclick="deleteContact(${index})">Eliminar</button>
        <hr>
      </div>
    `;
  });
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

