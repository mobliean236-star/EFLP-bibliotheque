/* ========= SCRIPT: Bibliothèque EFLP (1 classe par livre, sans mode démo) =========
   - Placez index.html, style.css, script.js ensemble.
   - Ouvre index.html localement ou sur GitHub Pages.
   ============================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Comptes enseignants ---------- */
  const ACCOUNTS = {
    "alex": { pass: "alex123", nom: "Alex", classe: "Cycle 4" },
    "dominique": { pass: "dom123", nom: "Dominique", classe: "Cycle 2" },
    "camille": { pass: "cam123", nom: "Camille", classe: "Cycle 3" },
    "caroline": { pass: "caro123", nom: "Caroline", classe: "Cycle 2" },
    "carole": { pass: "caro1", nom: "Carole", classe: "Cycle 1" }
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
    try {
      return JSON.parse(localStorage.getItem(STORAG

 
