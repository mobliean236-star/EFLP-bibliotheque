// === Connexion professeurs ===
const profs = [
  { id: "alex", mdp: "alex123" },
  { id: "caroline", mdp: "caroline123" },
  { id: "dominique", mdp: "dominique123" },
  { id: "joy", mdp: "joy123" },
  { id: "carole", mdp: "carole123" },
  { id: "elvis", mdp: "elvis123" },
  { id: "loun", mdp: "loun123" },
  { id: "khamoun", mdp: "khamoun123" },
  { id: "khamchan", mdp: "khamchan123" }
];

// Page de connexion
if (document.getElementById('loginForm')) {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const prof = profs.find(p => p.id === username && p.mdp === password);
    if (prof) {
      localStorage.setItem('profConnecte', username);
      window.location.href = "emprunts.html";
    } else {
      document.getElementById('errorMsg').textContent = "Identifiant ou mot de passe incorrect";
    }
  });
}

// Page tableau emprunts
if (document.getElementById('tableau-emprunts')) {
  const profConnecte = localStorage.getItem('profConnecte');
  if (!profConnecte) {
    window.location.href = "index.html";
  } else {
    fetch('livres.json')
      .then(response => response.json())
      .then(data => {
        const tbody = document.querySelector('#tableau-emprunts tbody');
        data.forEach(livre => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${livre.nomEleve}</td>
            <td>${livre.classe}</td>
            <td>${livre.nomLivre} (${livre.dateEmprunt})</td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch(err => console.error(err));
  }
}

