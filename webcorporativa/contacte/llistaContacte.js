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

  // Funció per combinar contactes de webCorporativaDades.js i localStorage
  function obtenirTotsElsContactes() {
    // Contactes inicials del archivo webCorporativaDades.js
    const contactesInicials = typeof Contact !== 'undefined' ? [...Contact] : [];
    
    // Contactes de localStorage
    let contactesLocalStorage = [];
    try {
      const missatgesGuardats = JSON.parse(localStorage.getItem("missatges")) || [];
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
    
    // Combinar i eliminar duplicats
    const totsElsContactes = [...contactesInicials];
    contactesLocalStorage.forEach(contacte => {
      const existeix = totsElsContactes.some(c => c.id === contacte.id);
      if (!existeix) {
        totsElsContactes.push(contacte);
      }
    });
    
    // Ordenar per data (més nous primer)
    return totsElsContactes.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Funció per carregar i mostrar els contactes
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

  // Funció per crear una targeta de contacte
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

  // Funció per mostrar detalls d'un contacte
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

  // Funció per obrir el modal d'edició
  function obrirModalEditar() {
    if (!contacteActual) return;

    // Rellenar el formulario con los datos actuales
    document.getElementById('editName').value = contacteActual.name;
    document.getElementById('editEmail').value = contacteActual.email;
    document.getElementById('editPhone').value = contacteActual.phone || '';
    document.getElementById('editSubject').value = contacteActual.subject;

    detailModal.style.display = 'none';
    editModal.style.display = 'block';
  }

  // Funció per guardar les edicions
  function guardarEdicio(e) {
    e.preventDefault();

    const dadesActualitzades = {
      id: contacteActual.id,
      name: document.getElementById('editName').value.trim(),
      email: document.getElementById('editEmail').value.trim(),
      phone: document.getElementById('editPhone').value.trim(),
      subject: document.getElementById('editSubject').value.trim(),
      date: contacteActual.date // Mantener la fecha original
    };

    // Validaciones básicas
    if (!dadesActualitzades.name || !dadesActualitzades.email || !dadesActualitzades.subject) {
      alert('Els camps nom, email i assumpte són obligatoris.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(dadesActualitzades.email)) {
      alert('El correu electrònic no és vàlid.');
      return;
    }

    // Actualizar el contacto
    actualitzarContacte(contacteActual.id, dadesActualitzades);
    editModal.style.display = 'none';
    carregarContactes();
  }

  // Funció per actualitzar un contacte
  function actualitzarContacte(id, novesDades) {
    // Actualizar en localStorage
    let missatges = JSON.parse(localStorage.getItem("missatges")) || [];
    const index = missatges.findIndex(m => m.id == id);
    
    if (index !== -1) {
      missatges[index] = { ...missatges[index], ...novesDades };
      localStorage.setItem("missatges", JSON.stringify(missatges));
    }

    // Actualizar en la lista global Contact si existe
    if (typeof Contact !== 'undefined') {
      const contactIndex = Contact.findIndex(c => c.id == id);
      if (contactIndex !== -1) {
        Contact[contactIndex] = { ...Contact[contactIndex], ...novesDades };
      }
    }

    alert('Contacte actualitzat correctament.');
  }

  // Funció per obrir el modal de confirmació d'eliminació
  function obrirModalConfirmacio() {
    detailModal.style.display = 'none';
    confirmModal.style.display = 'block';
  }

  // Funció per eliminar un contacte
  function eliminarContacte() {
    if (!contacteActual) return;

    // Eliminar de localStorage
    let missatges = JSON.parse(localStorage.getItem("missatges")) || [];
    const missatgesActualitzats = missatges.filter(m => m.id != contacteActual.id);
    localStorage.setItem("missatges", JSON.stringify(missatgesActualitzats));

    // Eliminar de la lista global Contact si existe
    if (typeof Contact !== 'undefined') {
      const contactIndex = Contact.findIndex(c => c.id == contacteActual.id);
      if (contactIndex !== -1) {
        Contact.splice(contactIndex, 1);
      }
    }

    confirmModal.style.display = 'none';
    carregarContactes();
    alert('Contacte eliminat correctament.');
  }

  // Funció per cercar contactes
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

  // Funció per netejar la cerca
  function netejarCerca() {
    searchInput.value = '';
    carregarContactes();
  }

  // Funció per tancar tots els modals
  function tancarTotsModals() {
    detailModal.style.display = 'none';
    editModal.style.display = 'none';
    confirmModal.style.display = 'none';
  }

  // Inicializar la aplicación
  inicialitzar();
});