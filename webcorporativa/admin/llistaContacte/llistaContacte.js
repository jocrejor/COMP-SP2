document.addEventListener("DOMContentLoaded", () => {
  const contactesList = document.getElementById("contactesList");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const backBtn = document.getElementById("backBtn");

  // Modals
  const detailModal = document.getElementById("detailModal");
  const editModal = document.getElementById("editModal");
  const confirmModal = document.getElementById("confirmModal");

  // Botones de modals
  const closeDetailBtn = document.getElementById("closeDetailBtn");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

  // Formulario de edición
  const editForm = document.getElementById("editForm");

  // Variables para gestionar el estado
  let contacteActual = null;
  let contactes = [];

  // Inicializar la aplicación
  function inicialitzar() {
    carregarContactes();
    configurarEventListeners();
  }

  // Configurar event listeners
  function configurarEventListeners() {
    // Búsqueda
    searchInput.addEventListener('input', cercarContactes);
    clearSearchBtn.addEventListener('click', netejarCerca);

    // Navegación
    backBtn.addEventListener('click', () => {
      window.location.href = 'contacte.html';
    });

    // Modals - Cerrar con X
    document.querySelectorAll('.close').forEach(closeBtn => {
      closeBtn.addEventListener('click', tancarTotsModals);
    });

    // Modal de detalle
    closeDetailBtn.addEventListener('click', () => detailModal.style.display = 'none');
    editBtn.addEventListener('click', obrirModalEditar);
    deleteBtn.addEventListener('click', obrirModalConfirmacio);

    // Modal de edición
    cancelEditBtn.addEventListener('click', () => editModal.style.display = 'none');
    editForm.addEventListener('submit', guardarEdicio);

    // Modal de confirmación
    confirmDeleteBtn.addEventListener('click', eliminarContacte);
    cancelDeleteBtn.addEventListener('click', () => confirmModal.style.display = 'none');

    // Cerrar modals al hacer clic fuera
    window.addEventListener('click', (e) => {
      if (e.target === detailModal) detailModal.style.display = 'none';
      if (e.target === editModal) editModal.style.display = 'none';
      if (e.target === confirmModal) confirmModal.style.display = 'none';
    });
  }

  // Funció per combinar contactes de WebCorporativaDades.js i localStorage
  function obtenirTotsElsContactes() {
    // Contactes inicials del archivo WebCorporativaDades.js
    const contactesInicials = typeof Contact !== 'undefined' ? [...Contact] : [];

    // Contactes de localStorage
    let contactesLocalStorage = [];
    try {
      const missatgesGuardats = JSON.parse(localStorage.getItem("contactes")) || [];
      contactesLocalStorage = missatgesGuardats.map(missatge => ({
        id: missatge.id,
        name: missatge.name,
        phone: missatge.phone,
        email: missatge.email,
        subject: missatge.subject,
        date: missatge.date
      }));
    } catch (error) {
      console.error("Error obtenint contactes de localStorage:", error);
    }

    // Combinar y eliminar duplicados
    const totsElsContactes = [...contactesInicials];
    contactesLocalStorage.forEach(contacte => {
      const existeix = totsElsContactes.some(c => c.id === contacte.id);
      if (!existeix) {
        totsElsContactes.push(contacte);
      }
    });

    // Ordenar por fecha (más nuevos primero)
    return totsElsContactes.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Función para cargar y mostrar los contactos
  function carregarContactes(contactesFiltrats = null) {
    contactes = contactesFiltrats || obtenirTotsElsContactes();
    contactesList.innerHTML = '';

    if (!contactes || contactes.length === 0) {
      contactesList.innerHTML = '<div class="no-results">No s\'han trobat contactes.</div>';
      return;
    }

    contactes.forEach(contacte => {
      const contacteCard = crearContacteCard(contacte);
      contactesList.appendChild(contacteCard);
    });
  }

  // Función para crear una tarjeta de contacto
  function crearContacteCard(contacte) {
    const card = document.createElement('div');
    card.className = 'contacte-card';
    card.dataset.id = contacte.id;

    // Formatejar la data
    const dataFormatejada = new Date(contacte.date).toLocaleString('ca-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    card.innerHTML = `
      <div class="contacte-header">
        <h3 class="contacte-name">${contacte.name}</h3>
        <span class="contacte-date">${dataFormatejada}</span>
      </div>
      <div class="contacte-info">
        <div class="contacte-field">
          <span class="contacte-label">Email</span>
          <span class="contacte-value">${contacte.email}</span>
        </div>
        <div class="contacte-field">
          <span class="contacte-label">Telèfon</span>
          <span class="contacte-value">${contacte.phone || 'No especificat'}</span>
        </div>
      </div>
      <div class="contacte-subject">
        <div class="subject-label">Assumpte</div>
        <div class="subject-value">${contacte.subject}</div>
      </div>
    `;

    // Event listener para ver detalles
    card.addEventListener('click', () => mostrarDetallsContacte(contacte.id));

    return card;
  }

  // Función para mostrar los detalles de un contacto
  function mostrarDetallsContacte(id) {
    contacteActual = contactes.find(c => c.id == id);
    if (!contacteActual) return;

    const dataFormatejada = new Date(contacteActual.date).toLocaleString('ca-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    document.getElementById('contactDetail').innerHTML = `
      <div class="detail-field">
        <span class="detail-label">Nom complet</span>
        <div class="detail-value">${contacteActual.name}</div>
      </div>
      <div class="detail-field">
        <span class="detail-label">Email</span>
        <div class="detail-value">${contacteActual.email}</div>
      </div>
      <div class="detail-field">
        <span class="detail-label">Telèfon</span>
        <div class="detail-value">${contacteActual.phone || 'No especificat'}</div>
      </div>
      <div class="detail-field">
        <span class="detail-label">Data</span>
        <div class="detail-value">${dataFormatejada}</div>
      </div>
      <div class="detail-field">
        <span class="detail-label">Assumpte</span>
        <div class="detail-value">${contacteActual.subject}</div>
      </div>
    `;

    detailModal.style.display = 'block';
  }


  // Función para abrir el modal de edición
  function obrirModalEditar() {
    if (!contacteActual) return;
    // Rellenar el formulario de edición con los datos del contacto
    document.getElementById('editName').value = contacteActual.name;
    document.getElementById('editEmail').value = contacteActual.email;
    document.getElementById('editPhone').value = contacteActual.phone || '';
    document.getElementById('editSubject').value = contacteActual.subject;
    editModal.style.display = 'block';
  }

  // Función para abrir el modal de confirmación de eliminación
  function obrirModalConfirmacio() {
    if (!contacteActual) return;
    confirmModal.style.display = 'block';
  }

  // Función para guardar la edición de un contacto
function guardarEdicio(event) {
  event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

  // Obtener los valores del formulario de edición
  const name = document.getElementById('editName').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  const subject = document.getElementById('editSubject').value.trim();

  // Validar que los campos obligatorios no estén vacíos
  if (!name || !email || !subject) {
    alert("Tots els camps obligatoris han d'estar emplenats.");
    return;
  }

  // Actualizar el contacto actual con los nuevos valores
  if (contacteActual) {
    contacteActual.name = name;
    contacteActual.email = email;
    contacteActual.phone = phone || '';  // Si no hay teléfono, se guarda como cadena vacía
    contacteActual.subject = subject;
    contacteActual.date = new Date().toISOString();  // Actualizar la fecha

    // Guardar el contacto actualizado en localStorage
    let contactes = JSON.parse(localStorage.getItem("contactes")) || [];
    const index = contactes.findIndex(c => c.id === contacteActual.id);
    if (index !== -1) {
      contactes[index] = contacteActual;
      localStorage.setItem("contactes", JSON.stringify(contactes));
    }

    // Cerrar el modal de edición
    editModal.style.display = 'none';

    // Recargar los contactos para reflejar los cambios
    carregarContactes();

    alert('Contacte actualitzat correctament.');
  }
}

  // Función para eliminar un contacto
  function eliminarContacte() {
    if (!contacteActual) return;

    // Eliminar de localStorage
    let contactes = JSON.parse(localStorage.getItem("contactes")) || [];
    contactes = contactes.filter(contacte => contacte.id !== contacteActual.id);
    localStorage.setItem("contactes", JSON.stringify(contactes));

    // Eliminar de la lista global Contact si existe
    if (typeof Contact !== 'undefined') {
      const index = Contact.findIndex(c => c.id === contacteActual.id);
      if (index !== -1) {
        Contact.splice(index, 1);
      }
    }

    confirmModal.style.display = 'none';
    carregarContactes();
    alert('Contacte eliminat correctament.');
  }

  // Función para buscar contactos
  function cercarContactes() {
    const query = searchInput.value.toLowerCase().trim();
    const totsElsContactes = obtenirTotsElsContactes();

    if (!query) {
      carregarContactes(totsElsContactes);
      return;
    }

    const contactesFiltrats = totsElsContactes.filter(contacte =>
      contacte.name.toLowerCase().includes(query) ||
      contacte.email.toLowerCase().includes(query) ||
      contacte.subject.toLowerCase().includes(query) ||
      (contacte.phone && contacte.phone.includes(query))
    );

    carregarContactes(contactesFiltrats);
  }

  // Función para limpiar la búsqueda
  function netejarCerca() {
    searchInput.value = '';
    carregarContactes();
  }

  // Función para cerrar todos los modals
  function tancarTotsModals() {
    detailModal.style.display = 'none';
    editModal.style.display = 'none';
    confirmModal.style.display = 'none';
  }

  // Inicializar la aplicación
  inicialitzar();
});
