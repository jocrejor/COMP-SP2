document.addEventListener("DOMContentLoaded", main);

function main() {
  const infoDiv = document.querySelector("#infoFavorit");

  // Carregar Favorits de la BBDD
  function carregarFavoritsBbdd() {
    if (typeof Favorite !== "undefined" && Array.isArray(Favorite)) {
      return Favorite;
    }
    return [];
  }

  // Obtener ID de la URL
  const params = new URLSearchParams(window.location.search);
  const favoritId = params.get("id");

  function mostrarInfo() {
    const favorits = carregarFavoritsBbdd();

    //netejar
    while (infoDiv.firstChild) infoDiv.removeChild(infoDiv.firstChild);

    // Buscar el favorit
    const favorit = favorits.find(f => f.id == favoritId);

    if (!favorit) {
      const pError = document.createElement("p");
      pError.appendChild(document.createTextNode("ERROR. Favorit no trobat."));
      infoDiv.appendChild(pError);
      return;
    }

    // Informació del favorit
    const dades = {
      "ID": favorit.id,
      "Nom": favorit.name
    };

    for (const [clau, valor] of Object.entries(dades)) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.appendChild(document.createTextNode(clau + ": "));
      const textNode = document.createTextNode(valor ?? "-");
      p.appendChild(strong);
      p.appendChild(textNode);
      infoDiv.appendChild(p);
    }
  }
  mostrarInfo();
}
