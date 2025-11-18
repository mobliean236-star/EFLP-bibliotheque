console.log("Le script fonctionne !");

// --- Professeurs / identifiants ---
const USERS = {
  alex:    { pass: "alex123", classe: "Cycle 4" },
  dominique: { pass: "dom123", classe: "Cycle 2" },
  camille: { pass: "cam123", classe: "Cycle 3" },
  caroline: { pass: "caro123", classe: "Cycle 2" },
  carole: { pass: "carole123", classe: "Cycle 1" }
};

// --- Eléments HTML ---
const loginSection = document.getElementById("loginSection");
const appSection = document.getElementById("appSection");
const loginId = document.getElementById("loginId");
const loginPass = document.getElementById("loginPass");
const btnLogin = document.getElementById("btnLogin");
const btnDemo = document.getElementById("btnDemo");
const loginError = document.getElementById("loginError");
const welcome = document.getElementById("welcome");
const connectedInfo = document.getElementById("connectedInfo");
const btnLogout = document.getElementById("btnLogout");

const titre = document.getElementById("titre");
const auteur = document.getElementById("auteur");
const langue = document.getElementById("langue");
const classeAdd = document.getElementById("classeAdd");
const btnAdd = document.getElementById("btnAdd");

const listeLivresDiv = document.getElementById("listeLivres");

// --- Base locale (stockée sur l’ordinateur) ---
let livres = JSON.parse(localStorage.getItem("livresEFLP") || "[]");
let userConnected = null;

// ----------------------
// CONNEXION
// ----------------------
btnLogin.addEventListener("click", () => {
  const id = loginId.value.trim().toLowerCase();
  const pass = loginPass.value.trim();

  if (!USERS[id] || USERS[id].pass !== pass) {
    loginError.textContent = "Identifiant ou mot de passe incorrect";
    return;
  }

  userConnected = USERS[id];
  showApp();
});

btnDemo.addEventListener("click", () => {
  userConnected = { classe: "Démo" };
  showApp();
});

function showApp() {
  loginSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  welcome.textContent = "Bienvenue";
  connectedInfo.textContent = "Classe : " + userConnected.classe;
  afficherLivres();
}

btnLogout.addEventListener("click", () => {
  userConnected = null;
  appSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

// ----------------------
// AJOUTER LIVRE
// ----------------------
btnAdd.addEventListener("click", () => {
  if (!titre.value.trim() || !auteur.value.trim()) return;

  const livre = {
    titre: titre.value,
    auteur: auteur.value,
    langue: langue.value,
    classe: classeAdd.value,
    statut: "Disponible"
  };

  livres.push(livre);
  sauvegarder();
  afficherLivres();

  titre.value = "";
  auteur.value = "";
});

// ----------------------
// AFFICHER LIVRES
// ----------------------
function afficherLivres() {
  listeLivresDiv.innerHTML = "";

  livres.forEach((livre, index) => {
    const card = document.createElement("div");
    card.className = "livre";

    card.innerHTML = `
      <strong>${livre.titre}</strong> — ${livre.auteur}<br>
      Langue : ${livre.langue}<br>
      Classe d'origine : ${livre.classe}<br>
      Statut : <span class="statut">${livre.statut}</span><br>
      <button class="del" data-id="${index}">Supprimer</button>
    `;

    listeLivresDiv.appendChild(card);
  });

  document.querySelectorAll(".del").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      livres.splice(id, 1);
      sauvegarder();
      afficherLivres();
    });
  });
}

// ----------------------
// SAUVEGARDE
// ----------------------
function sauvegarder() {
  localStorage.setItem("livresEFLP", JSON.stringify(livres));
}

 
