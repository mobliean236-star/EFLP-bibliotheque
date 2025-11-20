// Vérifie si un prof est connecté
const profConnecte = localStorage.getItem('profConnecte');
if (!profConnecte) {
  window.location.href = "index.html";
}

// Récupération et affichage des livres
fetch('livres.json')
  .then(res => res.json())
  .then(data => {
    const listeLivres = document.getElementById('liste-livres');
    const tbody = document.querySelector('#tableau-emprunts tbody');

    // Affiche tous les livres
    data.forEach(livre => {
      const li = document.createElement('li');
      li.textContent = `${livre.titre} (${livre.auteur}, ${livre.langue})`;
      li.dataset.titre = livre.titre.toLowerCase();
      li.dataset.auteur = livre.auteur.toLowerCase();
      li.dataset.langue = livre.langue.toLowerCase();
      listeLivres.appendChild(li);

      // Si le livre est emprunté, ajoute au tableau emprunts
      if (livre.nomEleve && livre.classe && livre.dateEmprunt) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${livre.nomEleve}</td>
          <td>${livre.classe}</td>
          <td>${livre.titre} (${livre.auteur}, ${livre.langue}) - ${livre.dateEmprunt}</td>
        `;
        tbody.appendChild(tr);
      }
    });

    // Recherche
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      document.querySelectorAll('#liste-livres li').forEach(li => {
        const match = li.dataset.titre.includes(query) ||
                      li.dataset.auteur.includes(query) ||
                      li.dataset.langue.includes(query);
        li.style.display = match ? 'list-item' : 'none';
      });
    });
  })
  .catch(err => console.error("Erreur JSON :", err));
