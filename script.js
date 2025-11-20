// Vérifier si le prof est connecté
if (!localStorage.getItem("profConnecte")) {
  window.location.href = "index.html";
}

// Sélecteurs HTML
const inputJson = document.getElementById("importJson");
const listeLivres = document.getElementById("liste-livres");
const tableauEmprunts = document.querySelector("#tableau-emprunts tbody");
const searchInput = document.getElementById("searchInput");

// Stockage du JSON importé
let livres = [];

// === Importation JSON ===
inputJson.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      livres = JSON.parse(e.target.result);
      afficherLivres();
      afficherEmprunts();
    } catch (error) {
      alert("⚠️ Erreur : le fichier JSON n'est pas valide.");
    }
  };

  reader.readAsText(file);
});

// === Affiche tous les livres dans la liste ===
function afficherLivres() {
  listeLivres.innerHTML = "";

  livres.forEach(livre => {
    const li = document.createElement("li");
    li.textContent = `${livre.titre || "Titre inconnu"} (${livre.auteur || "Auteur ?"} / ${livre.langue || "Langue ?"})`;
    li.dataset.search = `${livre.titre} ${livre.auteur} ${livre.langue}`.toLowerCase();
    listeLivres.appendChild(li);
  });
}

// === Affiche les livres empruntés ===
function afficherEmprunts() {
  tableauEmprunts.innerHTML = "";

  livres.forEach(livre => {
    if (livre.nomEleve && livre.classe && livre.dateEmprunt) {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${livre.nomEleve}</td>
        <td>${livre.classe}</td>
        <td>${livre.titre || "Titre ?"} - ${livre.dateEmprunt}</td>
      `;

      tableauEmprunts.appendChild(tr);
    }
  });
}

// === Recherche ===
searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();

  document.querySelectorAll("#liste-livres li").forEach(li => {
    li.style.display = li.dataset.search.includes(q) ? "list-item" : "none";
  });
});

