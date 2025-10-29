document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

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

    // Guarda missatges en localStorage (simulant enviament)
    let missatges = JSON.parse(localStorage.getItem("missatges")) || [];
    missatges.push({ name, email, phone, subject, message, date: new Date().toLocaleString() });
    localStorage.setItem("missatges", JSON.stringify(missatges));

    alert("Missatge enviat correctament! Ens posarem en contacte aviat.");
    form.reset();
  });
});
