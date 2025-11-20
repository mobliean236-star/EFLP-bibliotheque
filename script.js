document.addEventListener("DOMContentLoaded", () => {

  const ACCOUNTS = {
    "alex": { pass: "alex123", nom: "Alex" },
    "dominique": { pass: "dom123", nom: "Dominique" },
    "camille": { pass: "cam123", nom: "Camille" }
  };

  // Stockage local
  if (!localStorage.getItem("books")) localStorage.setItem("books", "[]");
  if (!localStorage.getItem("loans")) localStorage.setItem("loans", "[]");

  let books = JSON.parse(localStorage.getItem("books"));
  let loans = JSON.parse(localStorage.getItem("loans"));

  function save() {
    localStorage.setItem("books", JSON.stringify(books));
    localStorage.setItem("loans", JSON.stringify(loans));
  }

  /* -------------------- LOGIN -------------------- */
  const loginSection = document.getElementById("loginSection");
  const appSection = document.getElementById("appSection");
  const loginId = document.getElementById("loginId");
  const loginPass = document.getElementById("loginPass");
  const btnLogin = document.getElementById("btnLogin");
  const loginError = document.getElementById("loginError");

  const welcome = document.getElementById("welcome");
  const btnLogout = document.getElementById("btnLogout");

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
    setUser({ id, nom: ACCOUNTS[id].nom });
    showApp();
  });

  function showApp() {
    const u = currentUser();
    if (!u) return;
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    welcome.textContent = "Bienvenue " + u.nom;
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
    if (!titre || !auteur) { alert("Remplis titre et auteur."); return; }

    books.unshift({
      id: crypto.randomUUID(),
      titre,
      auteur,
      langue
    });
    save();
    titreEl.value = "";
    auteurEl.value = "";
    afficherLivres();
  });

  /* -------------------- Afficher livres -------------------- */
  const booksList = document.getElementById("booksList");
  const searchEl = document.getElementById("search");
  searchEl.addEventListener("input", afficherLivres);

  function afficherLivres() {
    const q = searchEl.value.trim().toLowerCase();
    booksList.innerHTML = "";
    const filtered = books.filter(b =>
      b.titre.toLowerCase().includes(q) || b.auteur.toLowerCase().includes(q)
    );
    if (!filtered.length) {
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
          ${emprunt ? `<span class="badge">Emprunté : ${emprunt.eleve}</span>` :
            `<span class="badge">Disponible</span>`}
        </div>
        <div class="actions">
          <button class="action-btn" onclick="toggleLoan('${b.id}')">
            ${emprunt ? "Retourner" : "Emprunter"}
          </button>
          <button class="action-btn danger" onclick="deleteBook('${b.id}')">Supprimer</button>
        </div>
      `;
      booksList.appendChild(li);
    });
  }

  window.deleteBook = function(id) {
    if (!confirm("Supprimer ce livre ?")) return;
    books = books.filter(b => b.id !== id);
    loans = loans.filter(l => l.bookId !== id);
    save();
    afficherLivres();
    afficherEmprunts();
  };

  /* -------------------- Emprunts -------------------- */
  const loansTable = document.getElementById("loansTable");

  window.toggleLoan = function(bookId) {
    const emprunt = loans.find(l => l.bookId === bookId);

    if (emprunt) {
      if (!confirm("Retourner ce livre ?")) return;
      loans = loans.filter(l => l.bookId !== bookId);
      save();
      afficherLivres();
      afficherEmprunts();
      return;
    }

    const eleve = prompt("Nom de l'élève :");
    if (!eleve) return;

    loans.push({
      id: crypto.randomUUID(),
      bookId,
      eleve: eleve.trim(),
      date: new Date().toISOString()
    });
    save();
    afficherLivres();
    afficherEmprunts();
  };

  function afficherEmprunts() {
    loansTable.innerHTML = "";
    if (!loans.length) {
      loansTable.innerHTML = "<p class='muted'>Aucun emprunt.</p>";
      return;
    }

    loans.forEach(l => {
      const book = books.find(b => b.id === l.bookId);
      const div = document.createElement("div");
      div.className = "loan-item";
      div.innerHTML = `
        <strong>${book?.titre || "Livre supprimé"}</strong>
        <br>Élève : ${l.eleve}
        <br>Date : ${new Date(l.date).toLocaleDateString()}
      `;
      loansTable.appendChild(div);
    });
  }

  /* -------------------- Import / Export -------------------- */
  const btnExport = document.getElementById("btnExport");
  const fileImport = document.getElementById("fileImport");

  btnExport.addEventListener("click", () => {
    const data = { books, loans };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bibliotheque.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  fileImport.addEventListener("change", e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed.books || !parsed.loans) throw new Error("Format invalide");
        books = parsed.books.map(b => ({ ...b, id: b.id || crypto.randomUUID() }));
        loans = parsed.loans.map(l => ({ ...l, id: l.id || crypto.randomUUID() }));
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

