// 🔹 CONFIGURATION FIREBASE (remplace par tes infos Firebase)
const firebaseConfig = {
  apiKey: "TA_API_KEY",
  authDomain: "TON_PROJET.firebaseapp.com",
  databaseURL: "https://TON_PROJET-default-rtdb.firebaseio.com",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "TON_ID",
  appId: "TON_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔹 UTILISATEURS
const users = [
  { username: "Caroline", password: "1234" },
  { username: "Camille", password: "abcd" }
];

// 🔹 LOGIN
function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const user = users.find(u => u.username === username && u.password === password);

  if(user) {
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("tableDiv").style.display = "block";
    loadBorrowedBooks();
  } else {
    document.getElementById("loginError").innerText = "Utilisateur ou mot de passe incorrect";
  }
}

// 🔹 LOGOUT
function logout() {
  document.getElementById("loginDiv").style.display = "block";
  document.getElementById("tableDiv").style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

// 🔹 CHARGER LES EMPRUNTS
function loadBorrowedBooks() {
  const tableBody = document.querySelector("#borrowTable tbody");
  tableBody.innerHTML = "";

  db.ref("emprunts").once("value").then(snapshot => {
    snapshot.forEach(child => {
      const data = child.val();
      const row = `<tr>
        <td>${data.livre}</td>
        <td>${data.eleve}</td>
        <td>${data.date}</td>
        <td>${data.classe}</td>
      </tr>`;
      tableBody.innerHTML += row;
    });
  });
}

// 🔹 AJOUTER UN EMPRUNT
function addBorrow() {
  const livre = document.getElementById("newLivre").value;
  const eleve = document.getElementById("newEleve").value;
  const date = document.getElementById("newDate").value;
  const classe = document.getElementById("newClasse").value;

  if(!livre || !eleve || !date || !classe) {
    document.getElementById("addError").innerText = "Tous les champs sont obligatoires";
    return;
  }

  db.ref("emprunts").push({
    livre: livre,
    eleve: eleve,
    date: date,
    classe: classe
  }).then(() => {
    document.getElementById("newLivre").value = "";
    document.getElementById("newEleve").value = "";
    document.getElementById("newDate").value = "";
    document.getElementById("newClasse").value = "";
    document.getElementById("addError").innerText = "";
    loadBorrowedBooks();
  });
}

