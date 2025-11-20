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

// --- PAGE DE CONNEXION ---
if (document.getElementById("loginForm")) {

  document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const prof = profs.find(p => p.id === username && p.mdp === password);

    if (prof) {
      // Sauvegarde la connexion
      localStorage.setItem("profConnecte", username);
      window.location.href = "emprunts.html";
    } else {
      const msg = document.getElementById("errorMsg");
      msg.textContent = "❌ Identifiant ou mot de passe incorrect";
    }
  });
}

