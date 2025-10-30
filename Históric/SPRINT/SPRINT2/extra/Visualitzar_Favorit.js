document.addEventListener("DOMContentLoaded", main);

function main() {
  const tbody = document.querySelector("#taulaFavorit tbody");

  // Carregar Favorits de la BBDD
  function carregarFavoritsBbdd() {
    if (typeof Favorite !== "undefined" && Array.isArray(Favorite)) {
      return Favorite;
    }
    return [];
  }

  // Agafar ID de la URL
  const params = new URLSearchParams(window.location.search);
  const favoritId = params.get("id");

  function mostrarTaula() {
    const favorits = carregarFavoritsBbdd();

    // Netejar tbody
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

    // Buscar el favorit
    const favorit = favorits.find(f => f.id == favoritId);

    if (!favorit) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 2;
      td.textContent = "Favorit no trobat.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    const tr = document.createElement("tr");
    const camps = [favorit.id, favorit.name];

    camps.forEach(valor => {
      const td = document.createElement("td");
      td.textContent = valor ?? "-";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  }

  mostrarTaula();
}
