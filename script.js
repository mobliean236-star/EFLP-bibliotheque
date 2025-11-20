/* ========= SCRIPT: Bibliothèque EFLP (1 classe par livre, sans mode démo, tableau emprunts) =========
   - Placez index.html, style.css, script.js ensemble.
   - Ouvre index.html localement ou sur GitHub Pages.
================================================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Comptes enseignants ---------- */
  const ACCOUNTS = {
    "alex": { pass: "alex123", nom: "Alex", classe: "Cycle 4" },
    "dominique": { pass: "dom123", nom: "Dominique", classe: "Cycle 2" },
    "camille": { pass: "cam123", nom: "Camille", classe: "Cycle 3" },
    "caroline": { pass: "caro123", nom: "Caroline", classe: "Cycle 2" },
    "carole": { pass: "caro123", nom: "Carole", classe: "Cycle 1" }
  };

  const STORAGE_KEY = "eflp_biblio_v2";

  /* ---------- DOM ---------- */
  const loginSection = document.getElementById("loginSection");
  const appSection = document.getElementById("appSection");
  const loginId = document.getElementById("loginId");
  const loginPass = document.getElementById("loginPass");
  const btnLogin = document.getElementById("btnLogin");
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
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { books: [] }; }
    catch (e) { return { books: [] }; }
  }
  function saveData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  if (!localStorage.getItem(STORAGE_KEY)) saveData({ books: [] });

  /* ---------- Current user ---------- */
  function currentUser() { return JSON.parse(localStorage.getItem("eflp_current_user") || "null"); }
  function setCurrentUser(u) { localStorage.setItem("eflp_current_user", JSON.stringify(u)); }
  function clearCurrentUser() { localStorage.removeItem("eflp_current_user"); }

  /* ---------- Login ---------- */
  btnLogin.addEventListener("click", () => {
    const id = (loginId.value || "").trim().toLowerCase();
    const pw = (loginPass.value || "").trim();
    if (!id || !pw) { showLoginError("Remplis identifiant et mot de passe."); return; }
    const acct = ACCOUNTS[id];
    if (!acct || acct.pass !== pw) { showLoginError("Identifiant ou mot de passe incorrect."); return; }
    setCurrentUser({ id, nom: acct.nom, classe: acct.classe });
    showApp();
  });

  btnLogout.addEventListener("click", () => { clearCurrentUser(); location.reload(); });

  function showLoginError(msg) {
    loginError.textContent = msg;
    setTimeout(()=> loginError.textContent = "", 3000);
  }

  /* ---------- Affiche l'app ---------- */
  function showApp() {
    const u = currentUser();
    if (!u) return;
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    welcome.textContent = `Bienvenue ${u.nom}`;
    connectedInfo.textContent = `Connecté(e) — ${u.classe}`;
    renderBooks();
    renderBorrowedTable();
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
      status: "available",
      borrowerClass: null,
      borrowerName: null,
      borrowDate: null
    };
    data.books.unshift(book);
    saveData(data);
    titreEl.value = ""; auteurEl.value = "";
    renderBooks();
    renderBorrowedTable();
  });

  btnClearForm?.addEventListener("click", ()=> { titreEl.value = ""; auteurEl.value = ""; langueEl.value = "Français"; });

  /* ---------- Render books (avec recherche) ---------- */
  searchEl?.addEventListener("input", ()=> { renderBooks(); renderBorrowedTable(); });

  function renderBooks() {
    const data = loadData();
    const q

