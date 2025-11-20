/* ============================================================
   Bibliothèque EFLP — Version complète avec :
   - Livres
   - Emprunts
   - Liste des livres empruntés
   - Export / Import JSON fonctionnel
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------- Comptes enseignants -------------------- */
  const ACCOUNTS = {
    "alex":      { pass: "alex123", nom: "Alex",      classe: "Cycle 4" },
    "dominique": { pass: "dom123",  nom: "Dominique", classe: "Cycle 2" },
    "camille":   { pass: "cam123",  nom: "Camille",   classe: "Cycle 3" },
    "caroline":  { pass: "caro123", nom: "Caroline",  classe: "Cycle 2" },
    "carole":    { pass: "caro1",   nom: "Carole",    classe: "Cycle 1" },
    "elvis":     { pass: "elvis123",nom: "Elvis",     classe: "Cycle 3" },
    "khamoun":   { pass: "khamoun123",nom:"Khamoun",  classe:"Cycle 4" },
    "loun":      { pass: "loun123", nom:"Loun",       classe:"Cycle 2" },
    "joy":       { pass: "joy123",  nom:"Joy",        classe:"Cycle 1" },
    "khamchan":  { pass: "khamchan123",nom:"Khamchan",classe:"Cycle 3" }
  };


  /* -------------------- Stockage local -------------------- */
  if (!localStorage.getItem("books")) localStorage.setItem("books", "[]");
  if (!localStorage.getItem("loans")) localStorage.setItem("loans", "[]");

  let books = JSON.parse(localStorage.getItem("books"));
  let loans = JSON.parse(localStorage.getItem("loans"));

  function save() {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("loans", JSON.stringify(loans));
  }


  /* -------------------- Login -------------------- */
  const loginSection = document.getElementById("loginSection");
  const appSection   = document.getElementById("appSection");
  const loginId      = document.getElementById("loginId");
  const loginPass    = document.getElementById("loginPass");
  const btnLogin     = document.getElementById("btnLogin");
  const loginError   = document.getElementById("loginError");

  const welcome      = document.getElementById("welcome");
  const connectedInfo= document.getElementById("connectedInfo");
  const btnLogout    = document.getElementById("btnLogout");

  function currentUser() {
    return JSON.parse(localStorage.getItem("eflp_user") || "null");
  }
  function setUser(u) {
    localStorage.setItem("eflp_user", JSON.stringify(u));
  }
  function logout() {
    localStorage.removeItem("eflp_user");
    location.reload();
  }

  btnLogout.addEventListener("click", logout);

  btnLogin.addEventListener("click", () => {
    const id = loginId.value.trim().toLowerCase();
    const pw = loginPass.value.trim();

    if (!ACCOUNTS[id] || ACCOUNTS[id].pass !== pw) {
      loginError.textContent = "Identifiant ou mot de passe incorrect.";
      return;
    }

    setUser({ id, nom: ACCOUNTS[id].nom, classe: ACCOUNTS[id].classe });
    showApp();
  });

  function showApp() {
    const u = currentUser();
    if (!u) return;

    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");

    welcome.textContent = "Bienvenue " + u.nom;
    connectedInfo.textContent = "Connecté — " + u.classe;

    afficherLivres();
    afficherEmprunts();
  }

  if (currentUser()) showApp();


  /* -------------------- Ajouter un livre -------------------- */
  const titreEl = document.getElementById("titre");
  const auteurEl = document.getElementById("auteur");
  const langueEl = document.getElementById("langue");
  const btnAdd = document.getElementById("btnAdd");

  btnAdd.addEventListener("click", () => {
    const titre = titreEl.value.trim();
    const auteur = auteurEl.value.trim();
    const langue = langueEl.value;

    if (!titre || !auteur) {
      alert("Remplis titre et auteur.");
      return;
    }

    const u = currentUser();

    books.unshift({
      id: crypto.randomUUID(),
      titre,
      auteur,
      langue,
      addedBy: u.id,
      addedClass: u.classe
    });

    save();
    titreEl.value = "";
    auteurEl.value = "";
    afficherLivres();
  });


  /* -------------------- Afficher les livres -------------------- */
  const booksList = document.getElementById("booksList");
  const searchEl  = document.getElementById("search");

  searchEl.addEventListener("input", afficherLivres);

  function afficherLivres() {
    const q = searchEl.value.trim().toLowerCase();
    booksList.innerHTML = "";

    const filtered = books.filter(b =>
      b.titre.toLowerCase().includes(q) ||
      b.auteur.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      booksList.innerHTML = "<p class='muted'>Aucun livre trouvé.</p>";
      return;
    }

    filtered.forEach(b => {
      const li = document.createElement("li");
      li.className = "book-item lang-" + b.langue.replace(/\s/g, "");

      const emprunt = loans.find(l => l.bookId === b.id);

      li.innerHTML = `
        <div class="book-left">
          <strong>${b.titre}</strong>
          <span class="meta">${b.auteur}</span>
          <span class="meta">Langue : ${b.langue}</span>
          ${emprunt ? `<span class="badge">Emprunté : ${emprunt.eleve} (${emprunt.classe})</span>` :
            `<span class="badge">Disponible</span>`}
        </div>

        <div class="actions">
          <button class="action-btn" onclick="borrowBook('${b.id}')">
            ${emprunt ? "Retourner" : "Emprunter"}
          </button>
          <button class="action-btn danger" onclick="deleteBook('${b.id}')">Supprimer</button>
        </div>
      `;

      booksList.appendChild(li);
    });
  }


  /* -------------------- Emprunter / Retourner -------------------- */

  window.borrowBook = function(bookId) {
    const emprunt = loans.find(l => l.bookId === bookId);

    if (emprunt) {
      if (confirm("Retourner ce livre ?")) {
        loans = loans.filter(l => l.bookId !== bookId);
        save();
        afficherLivres();
        afficherEmprunts();
      }
      return;
    }

    const classe = prompt("Classe de l’élève ?");
    const nom = prompt("Nom de l’élève ?");

    if (!classe || !nom) return;

    loans.unshift({
      id: crypto.randomUUID(),
      bookId,
      eleve: nom.trim(),
      classe: classe.trim(),
      date: new Date().toISOString()
    });

    save();
    afficherLivres();
    afficherEmprunts();
  };


  window.deleteBook = function(bookId) {
    if (!confirm("Supprimer ce livre ?")) return;
    books = books.filter(b => b.id !== bookId);
    loans = loans.filter(l => l.bookId !== bookId);
    save();
    afficherLivres();
    afficherEmprunts();
  };


  /* -------------------- Tableau des livres empruntés -------------------- */
  const loansTable = document.getElementById("loansTable");

  function afficherEmprunts() {
    loansTable.innerHTML = "";

    if (loans.length === 0) {
      loansTable.innerHTML = "<p class='muted'>Aucun emprunt.</p>";
      return;
    }

    loans.forEach(l => {
      const book = books.find(b => b.id === l.bookId);

      const div = document.createElement("div");
      div.className = "loan-item";

      div.innerHTML = `
        <strong>${book?.titre || "Livre supprimé"}</strong>
        <br>
        Élève : ${l.eleve} (${l.classe})
        <br>
        Date : ${new Date(l.date).toLocaleDateString()}
      `;

      loansTable.appendChild(div);
    });
  }


  /* -------------------- EXPORT -------------------- */
  const btnExport = document.getElementById("btnExport");

  btnExport.addEventListener("click", () => {
    const data = { books, loans };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "bibliotheque_eflp.json";
    a.click();
    URL.revokeObjectURL(url);
  });


  /* -------------------- IMPORT -------------------- */
  const fileImport = document.getElementById("fileImport");

  fileImport.addEventListener("change", e => {
    const f = e.target.files[0];
    if (!f) return;

    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);

        if (!parsed.books || !parsed.loans)
          throw new Error("Format invalide : il faut { books:[], loans:[] }");

        books = parsed.books;
        loans = parsed.loans;

        save();
        afficherLivres();
        afficherEmprunts();

        alert("Import réussi !");
      } catch (err) {
        alert("Erreur : " + err.message);
      }
    };

    reader.readAsText(f);
  });

});

