/* ========= SCRIPT: Bibliothèque EFLP (Option A — 1 classe par livre) =========
   - Placez index.html, style.css, script.js ensemble.
   - Ouvre index.html localement ou sur GitHub Pages.
   ============================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Configuration des comptes (modifier si besoin) ---------- */
  const ACCOUNTS = {
    "alex": { pass: "alex123", nom: "Alex", classe: "Cycle 4" },
    "dominique": { pass: "dom123", nom: "Dominique", classe: "Cycle 2" },
    "camille": { pass: "cam123", nom: "Camille", classe: "Cycle 3" },
    "caroline": { pass: "caro123", nom: "Caroline", classe: "Cycle 2" },
    "carole": { pass: "caro1", nom: "Carole", classe: "Cycle 1" }
  };

  /* ---------- Storage key ---------- */
  const KEY = "eflp_biblio_v2";

  /* ---------- DOM elements ---------- */
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

  const titreEl = document.getElementById("titre");
  const auteurEl = document.getElementById("auteur");
  const langueEl = document.getElementById("langue");
  const classeAddEl = document.getElementById("classeAdd");
  const btnAdd = document.getElementById("btnAdd");
  const btnClearForm = document.getElementById("btnClearForm");

  const searchEl = document.getElementById("search");
  const btnStats = document.getElementById("btnStats");
  const statsBox = document.getElementById("statsBox");

  const btnExport = document.getElementById("btnExport");
  const fileImport = document.getElementById("fileImport");

  const btnQR = document.getElementById("btnQR");
  const qrUrl = document.getElementById("qrUrl");
  const qrcodeBox = document.getElementById("qrcode");

  const booksList = document.getElementById("booksList");

  /* ---------- Data load/save ---------- */
  function loadData() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { books: [] };
    } catch (e) {
      return { books: [] };
    }
  }
  function saveData(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }
  // init if not present
  if (!localStorage.getItem(KEY)) saveData({ books: [] });

  /* ---------- Current user ---------- */
  function currentUser() {
    return JSON.parse(localStorage.getItem("eflp_current_user") || "null");
  }
  function setCurrentUser(u) {
    localStorage.setItem("eflp_current_user", JSON.stringify(u));
  }
  function clearCurrentUser() {
    localStorage.removeItem("eflp_current_user");
  }

  /* ---------- Auth handlers ---------- */
  btnLogin.addEventListener("click", () => {
    const id = (loginId.value || "").trim().toLowerCase();
    const pw = (loginPass.value || "").trim();
    if (!id || !pw) { showLoginError("Remplis identifiant et mot de passe."); return; }
    const acct = ACCOUNTS[id];
    if (!acct || acct.pass !== pw) { showLoginError("Identifiant ou mot de passe incorrect."); return; }
    setCurrentUser({ id, nom: acct.nom, classe: acct.classe });
    showApp();
  });

  btnDemo.addEventListener("click", () => {
    setCurrentUser({ id: "demo", nom: "Mode démo", classe: "Cycle 1" });
    showApp();
  });

  btnLogout.addEventListener("click", () => {
    clearCurrentUser();
    location.reload();
  });

  function showLoginError(msg) {
    loginError.textContent = msg;
    setTimeout(()=> loginError.textContent = "", 3000);
  }

  /* ---------- Show app if logged ---------- */
  function showApp() {
    const u = currentUser();
    if (!u) return;
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    welcome.textContent = `Bienvenue ${u.nom}`;
    connectedInfo.textContent = `Connecté(e) — ${u.classe}`;
    renderBooks();
  }
  if (currentUser()) showApp();

  /* ---------- Helpers ---------- */
  function idNow(){ return Date.now().toString(36) + "-" + Math.floor(Math.random()*1000); }
  function escapeHtml(s){ return String(s||"").replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

  /* ---------- Add / Clear form ---------- */
  btnAdd.addEventListener("click", () => {
    const titre = (titreEl.value || "").trim();
    const auteur = (auteurEl.value || "").trim();
    const langue = (langueEl.value || "Français");
    const addedClass = (classeAddEl.value || currentUser()?.classe || "Cycle 1");
    const user = currentUser();
    if (!user) { alert("Connectez-vous d'abord."); return; }
    if (!titre || !auteur) { alert("Remplis titre et auteur."); return; }

    const data = loadData();
    const book = {
      id: idNow(),
      titre, auteur, langue,
      addedBy: user.id,
      addedClass,
      status: "available",    // "available" or "borrowed"
      borrowerClass: null,
      borrowerName: null,
      borrowDate: null
    };
    data.books.unshift(book); // newest first
    saveData(data);
    titreEl.value = ""; auteurEl.value = "";
    renderBooks();
  });

  btnClearForm?.addEventListener("click", ()=> {
    titreEl.value = ""; auteurEl.value = ""; langueEl.value = "Français";
  });

  /* ---------- Render books (with search) ---------- */
  searchEl?.addEventListener("input", renderBooks);

  function renderBooks() {
    const data = loadData();
    const q = (searchEl?.value || "").trim().toLowerCase();
    booksList.innerHTML = "";
    statsBox.classList.add("hidden");

    const filtered = data.books.filter(b => {
      if (!q) return true;
      return (b.titre||"").toLowerCase().includes(q) || (b.auteur||"").toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      booksList.innerHTML = "<p class='muted'>Aucun livre trouvé.</p>";
      return;
    }

    filtered.forEach(b => {
      const li = document.createElement("li");
      li.className = "book-item lang-" + (b.langue||"").replace(/\s+/g,"");
      // left
      const left = document.createElement("div");
      left.className = "book-left";
      const title = document.createElement("div");
      title.innerHTML = `<strong>${escapeHtml(b.titre)}</strong> — <span class="meta">${escapeHtml(b.auteur)}</span>`;
      const statusHtml = (b.status === "available")
        ? `<span class="badge lang-${b.langue.replace(/\s+/g,'')}">Disponible</span>`
        : `<span class="badge lang-${b.langue.replace(/\s+/g,'')}">Emprunté par ${escapeHtml(b.borrowerClass)}</span>`;
      const meta = document.createElement("div");
      meta.innerHTML = `${statusHtml} <span class="meta">Langue: ${escapeHtml(b.langue)} • Ajouté: ${escapeHtml(b.addedClass)}</span>`;
      left.appendChild(title); left.appendChild(meta);

      // actions
      const actions = document.createElement("div");
      actions.className = "actions";

      const borrowBtn = document.createElement("button");
      borrowBtn.className = "action-btn";
      borrowBtn.textContent = (b.status === "available") ? "Emprunter" : "Retourner";
      borrowBtn.addEventListener("click", () => {
        if (b.status === "available") promptBorrow(b.id);
        else returnBook(b.id);
      });

      const detailsBtn = document.createElement("button");
      detailsBtn.className = "action-btn warn";
      detailsBtn.textContent = "Détails";
      detailsBtn.addEventListener("click", () => showDetails(b.id));

      const qrBtn = document.createElement("button");
      qrBtn.className = "action-btn";
      qrBtn.textContent = "QR";
      qrBtn.addEventListener("click", ()=> generateQRForBook(b));

      const delBtn = document.createElement("button");
      delBtn.className = "action-btn danger";
      delBtn.textContent = "Supprimer";
      delBtn.addEventListener("click", ()=> {
        if (confirm("Supprimer ce livre ?")) deleteBook(b.id);
      });

      actions.appendChild(borrowBtn);
      actions.appendChild(detailsBtn);
      actions.appendChild(qrBtn);
      actions.appendChild(delBtn);

      li.appendChild(left); li.appendChild(actions);
      booksList.appendChild(li);
    });
  }

  /* ---------- Borrow / Return / Details / Delete ---------- */
  function promptBorrow(bookId) {
    const data = loadData();
    const book = data.books.find(x => x.id === bookId);
    if (!book) return alert("Livre introuvable.");
    // ask which class borrows
    const defaultClass = currentUser()?.classe || book.addedClass || "Cycle 1";
    const borrowerClass = prompt("Quelle classe emprunte ce livre ? (ex: Cycle 2, CE1)", defaultClass);
    if (!borrowerClass) return;
    const borrowerName = prompt("Nom de l'élève (optionnel)", "");
    book.status = "borrowed";
    book.borrowerClass = borrowerClass.trim();
    book.borrowerName = borrowerName ? borrowerName.trim() : null;
    book.borrowDate = (new Date()).toISOString();
    saveData(data);
    renderBooks();
  }

  function returnBook(bookId) {
    const data = loadData();
    const book = data.books.find(x => x.id === bookId);
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
    const details = [
      `Titre: ${b.titre}`,
      `Auteur: ${b.auteur}`,
      `Langue: ${b.langue}`,
      `Ajouté par: ${b.addedBy || "—" } (classe ${b.addedClass || "—"})`,
      `Statut: ${b.status}`,
      b.status === "borrowed" ? `Emprunté par: ${b.borrowerClass}${b.borrowerName? " — élève: "+b.borrowerName : ""}\nDate: ${b.borrowDate}` : ""
    ].filter(Boolean).join("\n");
    alert(details);
  }

  function deleteBook(bookId) {
    const data = loadData();
    data.books = data.books.filter(b => b.id !== bookId);
    saveData(data);
    renderBooks();
  }

  /* ---------- QR per book ---------- */
  function generateQRForBook(book) {
    qrcodeBox.innerHTML = "";
    const url = qrUrl.value.trim();
    if (!url) {
      alert("Entre d'abord une URL dans le champ QR (ex: ton site GitHub Pages), ou colle l'URL de la fiche.");
      return;
    }
    // we append book id as fragment so link can reference it if wanted
    const fullUrl = url + (url.includes("#") ? "" : "#") + "book-" + book.id;
    new QRCode(qrcodeBox, { text: fullUrl, width: 160, height: 160 });
  }

  /* ---------- Stats ---------- */
  btnStats.addEventListener("click", () => {
    const data = loadData();
    const total = data.books.length;
    let borrowed = 0;
    const byLang = {};
    const byClass = {};
    data.books.forEach(b => {
      byLang[b.langue] = (byLang[b.langue]||0) + 1;
      if (b.status === "borrowed") borrowed++;
      const c = b.addedClass || "—";
      byClass[c] = (byClass[c]||0) + 1;
    });
    statsBox.classList.remove("hidden");
    statsBox.innerHTML = `<strong>Statistiques</strong><br>
      Total livres: ${total} • Empruntés: ${borrowed}<br>
      Langues: ${Object.entries(byLang).map(([k,v])=>`${k}: ${v}`).join(" • ")}<br>
      Par classe: ${Object.entries(byClass).map(([k,v])=>`${k}: ${v}`).join(" • ")}`;
  });

  /* ---------- Export / Import ---------- */
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

  fileImport?.addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!Array.isArray(parsed.books)) throw new Error("Fichier JSON invalide (attendu { books: [...] })");
        saveData(parsed);
        alert("Import réussi !");
        renderBooks();
      } catch(err) {
        alert("Erreur import: " + (err.message || err));
      }
    };
    reader.readAsText(f);
  });

  /* ---------- Helpers ---------- */
  function saveData(d) { saveDataLocal(d); } // wrapper not used
  function saveDataLocal(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
  function loadDataLocal() { return JSON.parse(localStorage.getItem(KEY) || '{"books":[]}'); }

  // but use named loadData/saveData defined earlier
  // initial render
  renderBooks();

});

 
