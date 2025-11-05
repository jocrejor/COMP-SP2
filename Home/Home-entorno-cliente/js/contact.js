// Quan la pàgina carrega, mostrem tots els contactes guardats
document.addEventListener("DOMContentLoaded", function() {
  showContacts();
  
  // Capturem el formulari
  const form = document.getElementById("contactForm");
  const cancelEdit = document.getElementById("cancelEdit");

  // Funció per a validar el nom
  function validarNom(nom) {
    if (nom.trim().length < 3) {
      mostrarError("errorName", "El nom ha de tindre almenys 3 caràcters");
      return false;
    }
    amagarError("errorName");
    return true;
  }

  // Funció per a validar el telèfon
  function validarTelefon(telefon) {
    const regexTelefon = /^[0-9]{9}$/;
    if (!regexTelefon.test(telefon.trim())) {
      mostrarError("errorPhone", "El telèfon ha de tindre 9 dígits");
      return false;
    }
    amagarError("errorPhone");
    return true;
  }

  // Funció per a validar l'email
  function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email.trim())) {
      mostrarError("errorEmail", "L'email no és vàlid");
      return false;
    }
    amagarError("errorEmail");
    return true;
  }

  // Funció per a validar el missatge
  function validarMissatge(missatge) {
    if (missatge.trim().length < 10) {
      mostrarError("errorSubject", "El missatge ha de tindre almenys 10 caràcters");
      return false;
    }
    amagarError("errorSubject");
    return true;
  }

  // Funció per a validar la data
  function validarData(data) {
    if (!data) {
      mostrarError("errorDate", "La data és obligatòria");
      return false;
    }
    amagarError("errorDate");
    return true;
  }

  // Funció per a mostrar error
  function mostrarError(idElement, missatge) {
    const element = document.getElementById(idElement);
    element.replaceChildren();
    element.appendChild(document.createTextNode(missatge));
    element.classList.add("actiu");
  }

  // Funció per a amagar error
  function amagarError(idElement) {
    const element = document.getElementById(idElement);
    element.replaceChildren();
    element.classList.remove("actiu");
  }

  // Esdeveniment per a guardar un nou contacte
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Obtenim els valors del formulari
    const id = document.getElementById("contactId").value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const date = document.getElementById("date").value;

    // Validem tots els camps
    const nomValid = validarNom(name);
    const telefonValid = validarTelefon(phone);
    const emailValid = validarEmail(email);
    const misatgeValid = validarMissatge(subject);
    const dataValid = validarData(date);

    // Si algun camp no és vàlid, no continuem
    if (!nomValid || !telefonValid || !emailValid || !misatgeValid || !dataValid) {
      return;
    }

    // Llegim els contactes del localStorage
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    // Si hi ha id i no està buit → s'està editant un contacte existent
    if (id !== "") {
      contacts[parseInt(id)] = { name, phone, email, subject, date };
    } else {
      // Si no hi ha id → és un contacte nou
      contacts.push({ name, phone, email, subject, date });
    }

    // Guardem la llista actualitzada
    localStorage.setItem("contacts", JSON.stringify(contacts));

    // Netegem el formulari i actualitzem la llista
    form.reset();
    document.getElementById("contactId").value = "";
    
    // Amagar tots els errors després de guardar
    amagarError("errorName");
    amagarError("errorPhone");
    amagarError("errorEmail");
    amagarError("errorSubject");
    amagarError("errorDate");
    
    showContacts();
  });

  // Cancel·lar l'edició
  cancelEdit.addEventListener("click", function () {
    form.reset();
    document.getElementById("contactId").value = "";
    // Amagar tots els errors
    amagarError("errorName");
    amagarError("errorPhone");
    amagarError("errorEmail");
    amagarError("errorSubject");
    amagarError("errorDate");
  });

  // Mostrar els contactes en la pàgina
  function showContacts() {
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    const list = document.getElementById("contactList");
    list.replaceChildren();

    if (contacts.length === 0) {
      const p = document.createElement("p");
      p.appendChild(document.createTextNode("No hi ha contactes guardats."));
      list.appendChild(p);
      return;
    }

    // Si hi ha contactes, els mostrem un per un
    contacts.forEach((contact, index) => {
      const div = document.createElement("div");
      div.className = "item-contacte-llista";

      const capsalera = document.createElement("div");
      capsalera.className = "capsalera-item-contacte";

      const nomElement = document.createElement("span");
      nomElement.className = "nom-contacte-llista";
      nomElement.appendChild(document.createTextNode(contact.name));
      capsalera.appendChild(nomElement);

      const accions = document.createElement("div");
      accions.className = "accions-contacte-llista";

      // Botó editar
      const editBtn = document.createElement("button");
      editBtn.className = "boto-editar-contacte";
      editBtn.appendChild(document.createTextNode("Editar"));
      editBtn.addEventListener("click", () => editContact(index));
      accions.appendChild(editBtn);

      // Botó eliminar
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "boto-eliminar-contacte";
      deleteBtn.appendChild(document.createTextNode("Eliminar"));
      deleteBtn.addEventListener("click", () => deleteContact(index));
      accions.appendChild(deleteBtn);

      capsalera.appendChild(accions);
      div.appendChild(capsalera);

      const infoDiv = document.createElement("div");
      infoDiv.className = "info-contacte-llista";

      infoDiv.appendChild(document.createTextNode(`Telèfon: ${contact.phone}`));
      infoDiv.appendChild(document.createElement("br"));

      infoDiv.appendChild(document.createTextNode(`Email: ${contact.email}`));
      infoDiv.appendChild(document.createElement("br"));

      infoDiv.appendChild(document.createTextNode(`Data: ${contact.date}`));
      infoDiv.appendChild(document.createElement("br"));

      infoDiv.appendChild(document.createTextNode(`Missatge: ${contact.subject}`));

      div.appendChild(infoDiv);
      list.appendChild(div);
    });
  }

  // Funció per a editar un contacte
  function editContact(index) {
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    const c = contacts[index];

    // Omplim els camps del formulari
    document.getElementById("contactId").value = index;
    document.getElementById("name").value = c.name;
    document.getElementById("phone").value = c.phone;
    document.getElementById("email").value = c.email;
    document.getElementById("subject").value = c.subject;
    document.getElementById("date").value = c.date;
  }

  // Funció per a eliminar un contacte
  function deleteContact(index) {
    let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.splice(index, 1);
    localStorage.setItem("contacts", JSON.stringify(contacts));
    showContacts();
  }
});