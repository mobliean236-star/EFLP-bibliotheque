// ----- UTILISATEURS -----
const comptes = {
  "alex": "1234",
  "marie": "abcd",
  "demo": "demo"
};

// ----- VARIABLES -----
let utilisateur = null;
let livres = JSON.parse(localStorage.getItem("livresEFLP") || "[]");

// ----- AFFICHAGE -----
function save() {
  localStorage.setItem("livresEFLP", JSON.stringify(livres));
}

function renderLivres() {
  const zone = document.getElementById("listeLivres");
  zone.innerHTML = "";

  if (livres.length === 0) {
    zone.innerHTML = "<p>Aucun livre enregistré.</p>";
    return;
  }

  livres.forEach((l, i) => {
    const status = l.empruntePar
      ? `<span class="red">Emprunté par ${l.empruntePar}</span>`
      : `<span class="green">Disponible</span>`;

    zone.innerHTML += `
      <div class="book">
        <b>${l.titre}</b> — ${l.auteur} (${l.langue})  
        <br>Classe : ${l.classe}
        <br>Status : ${status}
        <br>
        <button onclick="toggle(${i})">Emprunter / Rendre</button>
        <button class="danger" onclick="suppr(${i})">Supprimer</button>
      </div>
    `;
  });
}

// ----- LOGIN -----
document.getElementById("btnLogin").onclick = () => {
  const id = loginId.value.trim();
  const pass = loginPass.value.trim();

  if (!comptes[id] || comptes[id] !== pass) {
    loginError.textContent = "Identifiant ou mot de passe incorrect.";
    return;
  }

  utilisateur = id;

  loginSection.classList.add("hidden");
  appSection.classList.remove("hidden");

  welcome.textContent = "Bienvenue " + id;
  connectedInfo.textContent = "Connecté en tant que : " + id;

  renderLivres();
};

document.getElementById("btnDemo").onclick = () => {
  utilisateur = "demo";

  loginSection.classList.add("hidden");
  appSection.classList.remove("hidden");

  welcome.textContent = "Mode Démo";
  connectedInfo.textContent = "Aucune sauvegarde";

  renderLivres();
};

document.getElementById("btnLogout").onclick = () => {
  utilisateur = null;
  loginSection.classList.remove("hidden");
  appSection.classList.add("hidden");
};

// ----- AJOUT -----
document.getElementById("btnAdd").onclick = () => {
  const book = {
    titre: titre.value,
    auteur: auteur.value,
    langue: langue.value,
    classe: classeAdd.value,
    empruntePar: null
  };

  livres.push(book);
  save();
  renderLivres();
};

// ----- SUPPRESSION -----
function suppr(i) {
  livres.splice(i, 1);
  save();
  renderLivres();
}

// ----- EMPRUNT / RETOUR -----
function toggle(i) {
  if (livres[i].empruntePar) {
    livres[i].empruntePar = null; // retour
  } else {
    livres[i].empruntePar = utilisateur; // emprunt
  }

  save();
  renderLivres();
}

 
