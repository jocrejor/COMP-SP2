document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  // Funció per afegir nous contactes des de localStorage a la llista global
  function carregarContactesDeLocalStorage() {
    try {
      const missatgesGuardats = JSON.parse(localStorage.getItem("missatges")) || [];
      
      // Si no existeix la variable Contact, la creem
      if (typeof Contact === 'undefined') {
        window.Contact = [];
      }
      
      missatgesGuardats.forEach(missatge => {
        // Verificar si el missatge ja existeix per evitar duplicats
        const existeix = Contact.some(contacte => contacte.id === missatge.id);
        if (!existeix) {
          Contact.push({
            id: missatge.id,
            name: missatge.name,
            phone: missatge.phone,
            email: missatge.email,
            subject: missatge.subject,
            date: missatge.date
          });
        }
      });
    } catch (error) {
      console.error("Error carregant contactes de localStorage:", error);
    }
  }

  // Carregar contactes existents de localStorage al cargar la página
  carregarContactesDeLocalStorage();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      alert("Tots els camps obligatoris han d'estar emplenats.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("El correu electrònic no és vàlid.");
      return;
    }

    if (phone && !/^\d{9,15}$/.test(phone)) {
      alert("El telèfon ha de contenir només números (9-15 dígits).");
      return;
    }

    // Guardar en localStorage
    let missatges = JSON.parse(localStorage.getItem("missatges")) || [];
    const nouMissatge = {
      id: Date.now(), // ID únic basat en el timestamp
      name,
      email,
      phone: phone || '',
      subject,
      message,
      date: new Date().toISOString()
    };
    
    missatges.push(nouMissatge);
    localStorage.setItem("missatges", JSON.stringify(missatges));

    // Actualitzar la llista global Contact
    if (typeof Contact !== 'undefined') {
      // Verificar si ja existeix per evitar duplicats
      const existeix = Contact.some(contacte => contacte.id === nouMissatge.id);
      if (!existeix) {
        Contact.push({
          id: nouMissatge.id,
          name: nouMissatge.name,
          phone: nouMissatge.phone,
          email: nouMissatge.email,
          subject: nouMissatge.subject,
          date: nouMissatge.date
        });
      }
    }

    alert("Missatge enviat correctament! Ens posarem en contacte aviat.");
    form.reset();
  });
});