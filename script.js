/****************************
 *    SYSTEME DE COMPTES    *
 ****************************/
const ACCOUNTS = {
  "alex":      { pass: "alex123", nom: "Alex", classe: "Cycle 4" },
  "dominique": { pass: "dom123", nom: "Dominique", classe: "Cycle 2" },
  "camille":   { pass: "cam123", nom: "Camille", classe: "Cycle 3" },
  "caroline":  { pass: "caro123", nom: "Caroline", classe: "Cycle 2" },
  "carole":    { pass: "caro1", nom: "Carole", classe: "Cycle 1" },

  "elvis":     { pass: "elvis123", nom: "Elvis", classe: "Cycle 3" },
  "khamoun":   { pass: "khamoun123", nom: "Khamoun", classe: "Cycle 4" },
  "loun":      { pass: "loun123", nom: "Loun", classe: "Cycle 2" },
  "joy":       { pass: "joy123", nom: "Joy", classe: "Cycle 1" },
  "khamchan":  { pass: "khamchan123", nom: "Khamchan", classe: "Cycle 3" }
};

/****************************
 *   INITIALISATION STORAGE *
 ****************************/
let books = JSON.parse(localStorage.getItem("books") || "[]");
let loans = JSON.parse(localStorage.getItem("loans") || "[]");
let currentUser = null;

/****************************
 *       LOGIN SYSTEM       *
 ****************************/
document.getElementById("btnLogin").onclick = () => {
  const id = loginId.value.trim().toLowerCase();
  const pw = loginPass.value.trim();

  if (!ACCOUNTS[id] || ACCOUNTS[id].pass !== pw) {
    loginError.textContent = "❌ Identifiant ou mot de passe incorrect";
    return;
  }

  currentUser = { id, ...ACCOUNTS[id] };
  loginSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  welcome.textContent = "Bienvenue " + currentUser.nom;
  connectedInfo.textContent = "Compte : " + id;

  loginId.value = "";
  loginPass.value = "";
};

/****************************
 *       DECONNEXION        *
 ****************************/
btnLogout.onclick = () => {
  currentUser = null;
  appSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
};

/****************************
 *     AJOUT D’UN LIVRE     *
 ****************************/
btnAdd.onclick = () => {
  const titre = document.getElementById("titre").value.trim();
  const auteur = document.getElementById("auteur").value.trim();
  const langue = document.getElementById("langue").value;

  if (!titre) return alert("Le titre est obligatoire");

  books.push({
    id: Date.now(),
    titre,
    auteur,
    langue,
  });

  localStorage.setItem("books", JSON.stringify(books));
  afficherLivres();

  titre.value = "";
  auteur.value = "";
};

/****************************
 *        EMPRUNTER         *
 ****************************/
function emprunterLivre(id) {
  const eleve = prompt("Nom de l'élève ?");
  if (!eleve) return;

  const classe = prompt("Classe de l'élève ?");
  if (!classe) return;

  loans.push({
    idLivre: id,
    eleve,
    classe,
    date: new Date().toLocaleDateString("fr-FR")
  });

  localStorage.setItem("loans", JSON.stringify(loans));
  afficherLivres();
}

/****************************
 *        RENDRE LIVRE      *
 ****************************/
function rendreLivre(id) {
  loans = loans.filter(l => l.idLivre !== id);
  localStorage.setItem("loans", JSON.stringify(loans));
  afficherLivres();
}

/****************************
 *   AFFICHAGE DES LIVRES   *
 ****************************/
function afficherLivres() {
  booksList.innerHTML = "";

  books.forEach(book => {
    const li = document.createElement("li");
    li.className = "book-item";

    const emprunt = loans.find(l => l.idLivre === book.id);

    li.innerHTML = `
      <div class="book-left">
        <strong>${book.titre}</strong>
        <span class="meta">${book.auteur || ""}</span>
        <span class="badge lang-${book.langue}">${book.langue}</span>
        ${
          emprunt
            ? `<span class="meta">📘 Emprunté par ${emprunt.eleve} (${emprunt.classe}) – ${emprunt.date}</span>`
            : ""
        }
      </div>

      <div class="actions">
        ${
          emprunt
            ? `<button class="action-btn" onclick="rendreLivre(${book.id})">Rendre</button>`
            : `<button class="action-btn warn" onclick="emprunterLivre(${book.id})">Emprunter</button>`
        }
      </div>
    `;

    booksList.appendChild(li);
  });
}

afficherLivres();

/****************************
 *  TABLEAU DES EMPRUNTS    *
 ****************************/
btnStats.onclick = () => {
  if (loans.length === 0) return alert("Aucun emprunt.");

  let msg = "📚 LISTE DES LIVRES EMPRUNTÉS\n\n";

  loans.forEach(l => {
    const b = books.find(x => x.id === l.idLivre);
    if (!b) return;

    msg += `• ${b.titre}\n  → ${l.eleve} (${l.classe}) – ${l.date}\n\n`;
  });

  alert(msg);
};

