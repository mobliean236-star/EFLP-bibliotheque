document.addEventListener("DOMContentLoaded", () => {

  /* --------------- CONFIG: PROFESSEURS --------------- */
  const comptes = {
    "alex": { mdp: "alex123", nom: "Alex", classe: "Cycle 4" },
    "dominique": { mdp: "dom123", nom: "Dominique", classe: "Cycle 2" },
    "camille": { mdp: "cam123", nom: "Camille", classe: "Cycle 3" },
    "caroline": { mdp: "caro123", nom: "Caroline", classe: "Cycle 2" },
    "carole": { mdp: "caro1", nom: "Carole", classe: "Cycle 1" }
  };

  /* --------------- STORAGE UTIL --------------- */
  const STORAGE_KEY = "eflp_biblio_v1";
  function loadData() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"books":[],"users":[]}'); }
  function saveData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

  if (!localStorage.getItem(STORAGE_KEY)) saveData({ books: [], users: Object.keys(comptes) });

  /* --------------- ELEMENTS DOM --------------- */
  const loginSection = document.getElementById("loginSection");
  const appSection = document.getElementById("appSection");
  const loginId = document.getElementById("loginId");
  const loginPass = document.getElementById("loginPass");
  const btnLogin = document.getElementById("btnLogin");
  const btnDemo = document.getElementById("btnDemo");
  const btnLogout = document.getElementById("btnLogout");
  const welcome = document.getElementById("welcome");
  const connectedInfo = document.getElementById("connectedInfo");
  const loginError = document.getElementById("loginError");

  const titreEl = document.getElementById("titre");
  const auteurEl = document.getElementById("auteur");
  const langueEl = document.getElementById("langue");
  const classeAddEl = document.getElementById("classeAdd");
  const btnAdd = document.getElementById("btnAdd");
  const booksList = document.getElementById("booksList");
  const searchEl = document.getElementById("search");
  const btnStats = document.getElementById("btnStats");
  const statsBox = document.getElementById("statsBox");
  const btnExport = document.getElementById("btnExport");
  const fileImport = document.getElementById("fileImport");
  const btnQR = document.getElementById("btnQR");
  const qrUrl = document.getElementById("qrUrl");
  const qrcodeBox = document.getElementById("qrcode");

  /* --------------- AUTH --------------- */
  function currentUser() { return JSON.parse(localStorage.getItem("eflp_current_user") || "null"); }
  function setCurrentUser(u) { localStorage.setItem("eflp_current_user", JSON.stringify(u)); }
  function clearCurrentUser() { localStorage.removeItem("eflp_current_user"); }

  btnLogin.addEventListener("click", () => {
    const id = (loginId.value || "").toLowerCase();
    const pw = loginPass.value || "";
    if (comptes[id] && comptes[id].mdp === pw) {
      setCurrentUser({ id, nom: comptes[id].nom, classe: comptes[id].classe });
      showApp();
    } else {
      loginError.textContent = "Identifiant ou mot de passe incorrect.";
      setTimeout(()=> loginError.textContent = "", 3500);
    }
  });

  btnDemo.addEventListener("click", ()=> {
    setCurrentUser({ id: "alex", nom: "Alex", classe: "Cycle 4" });
    showApp();
  });

  btnLogout.addEventListener("click", ()=> {
    clearCurrentUser();
    location.reload();
  });

  /* --------------- AFFICHAGE / INIT --------------- */
  function showApp() {
    const user = currentUser();
    if (!user) return;
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    welcome.textContent = `Bienvenue ${user.nom}`;
    connectedInfo.textContent = `Vous êtes connecté(e) — ${user.classe}`;
    renderBooks();
  }

  if (currentUser()) showApp();

  /* --------------- GESTION LIVRES --------------- */
  function idNow(){ return Date.now() + "-" + Math.floor(Math.random()*1000); }

  btnAdd.addEventListener("click", addBook);

  function addBook() {
    const titre = (titreEl.value || "").trim();
    const auteur = (auteurEl.value || "").trim();
    const langue = langueEl.value || "Français";
    const classeAjout = classeAddEl?.value || currentUser()?.classe || "Cycle 1";
    const user = currentUser();
    if (!user) { alert("Connectez-vous d'abord."); return; }
    if (!titre || !auteur) { alert("Remplis titre et auteur."); return; }

    const data = loadData();
    const book = {
      id: idNow(),
      titre, auteur, langue,
      addedBy: user.id,
      addedClass: classeAjout,
      status: "available",
      borrowerClass: null,
      borrowerName: null,
      borrowDate: null
    };
    data.books.push(book);
    saveData(data);
    titreEl.value = ""; auteurEl.value = ""; langueEl.value = "Français";
    renderBooks();
  }

  /* --------------- RENDER LIVRES + RECHERCHE --------------- */
  searchEl.addEventListener("input", renderBooks);

  function renderBooks() {
    const data = loadData();
    const q = (searchEl.value || "").toLowerCase();
    const user = currentUser();
    booksList.innerHTML = "";
    statsBox.classList.add("hidden");

    const filtered = data.books.filter(b => {
      if (!q) return true;
      return (b.titre || "").toLowerCase().includes(q) || (b.auteur||"").toLowerCase().includes(q);
    });

    filtered.forEach((b) => {
      const li = document.createElement("li");
      li.className = "book-item lang-" + b.langue.replace(/\s+/g,'');

      const left = document.createElement("div");
      left.className = "book-left";
      const title = document.createElement("div");
      title.innerHTML = `<span style="font-weight:700">${escapeHtml(b.titre)}</span> — <span class="meta">${escapeHtml(b.auteur)}</span>`;
      const meta = document.createElement("div");
      const st = (b.status === "available") ? `<span class="badge lang-${b.langue.replace(/\s+/g,'')}">Disponible</span>` :
        `<span class="badge lang-${b.langue.replace(/\s+/g,'')}">Emprunté par ${escapeHtml(b.borrowerClass)}</span>`;
      meta.innerHTML = `${st} <span class="meta">Langue: ${b.langue} • Ajouté: ${b.addedClass}</span>`;
      left.appendChild(title);
      left.appendChild(meta);

      const actions = document.createElement("div");
      actions.className = "actions";

      const borrowBtn = document.createElement("button");
      borrowBtn.className = "action-btn";
      borrowBtn.textContent = (b.status === "available") ? "Emprunter" : "Retourner";
      borrowBtn.addEventListener("click", () => {
        if (b.status === "available") promptBorrow(b.id);
        else returnBook(b.id);
      });

      const infoBtn = document.createElement("button");
      infoBtn.className = "action-btn warn";
      infoBtn.textContent = "Détails";
      infoBtn.addEventListener("click", () => showDetails(b.id));

      const delBtn = document.createElement("button");
      delBtn.className = "action-btn danger";
      delBtn.textContent = "Supprimer";
      delBtn.addEventListener("click", () => {
        if (confirm("Supprimer ce livre ?")) deleteBook(b.id);
      });

      actions.appendChild(borrowBtn);
      actions.appendChild(infoBtn);
      actions.appendChild(delBtn);

      li.appendChild(left);
      li.appendChild(actions);
      booksList.appendChild(li);
    });
  }

  /* --------------- ACTIONS LIVRES --------------- */
  function promptBorrow(bookId) {
    const data = loadData();
    const book = data.books.find(b => b.id === bookId);
    if (!book) return alert("Livre introuvable.");
    const borrowerClass = prompt("Quelle classe emprunte ? (ex: Cycle 2 ou CE1)", currentUser()?.classe || "");
    if (!borrowerClass) return;
    const borrowerName = prompt("Nom de l'élève (optionnel)", "");
    book.status = "borrowed";
    book.borrowerClass = borrowerClass;
    book.borrowerName = borrowerName || null;
    book.borrowDate = new Date().toISOString();
    saveData(data);
    renderBooks();
  }

  function returnBook(bookId) {
    const data = loadData();
    const book = data.books.find(b => b.id === bookId);
    if (!book) return;
    book.status = "available";
    book.borrowerClass = null;
    book.borrowerName = null;
    book.borrowDate = null;
    saveData(data);
    renderBooks();
  }

  function showDetails(bookId) {
    const data = loadData();
    const b = data.books.find(x => x.id === bookId);
    if (!b) return alert("Introuvable");
    const details = `
Titre: ${b.titre}
Auteur: ${b.auteur}
Langue: ${b.langue}
Ajouté par: ${b.addedBy} (classe ${b.addedClass})
Statut: ${b.status}
${b.status === "borrowed" ? `Emprunté par: ${b.borrowerClass} ${b.borrowerName ? " — élève: " + b.borrowerName : ""}\nDate: ${b.borrowDate}` : ""}
`;
    alert(details);
  }

  function deleteBook(bookId) {
    const data = loadData();
    data.books = data.books.filter(b => b.id !== bookId);
    saveData(data);
    renderBooks();
  }

  /* --------------- STATS --------------- */
  btnStats.addEventListener("click", () => {
    const data = loadData();
    const total = data.books.length;
    const byLang = {};
    let borrowed = 0;
    data.books.forEach(b => {
      byLang[b.langue] = (byLang[b.langue]||0) + 1;
      if (b.status === "borrowed") borrowed++;
    });
    statsBox.classList.remove("hidden");
    statsBox.innerHTML = `<strong>Statistiques</strong><br>
Total livres: ${total} • Empruntés: ${borrowed}<br>
Langues: ${Object.entries(byLang).map(([k,v])=>`${k}: ${v}`).join(" • ")}`;
  });

  /* --------------- EXPORT / IMPORT --------------- */
  btnExport.addEventListener("click", () => {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eflp_bibliotheque_export.json";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  });

  fileImport.addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed.books) throw new Error("Fichier JSON invalide");
        saveData(parsed);
        alert("Import réussi !");
        renderBooks();
      } catch(err) {
        alert("Erreur import: " + err.message);
      }
    };
    reader.readAsText(f);
  });

  /* --------------- QR --------------- */
  btnQR.addEventListener("click", () => {
    const url = (qrUrl.value || "").trim();
    qrcodeBox.innerHTML = "";
    if (!url) { alert("Entre une URL pour générer le QR"); return; }
    new QRCode(qrcodeBox, { text: url, width: 140, height: 140 });
  });

  /* --------------- HELPERS --------------- */
  function escapeHtml(s){ return String(s||"").replace(/[&<>"]/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' })[c]); }

  /* initial render */
  renderBooks();

});


 
