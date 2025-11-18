// ------------ IMPORT FIREBASE MODULES -------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc, onSnapshot } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ------------ CONFIGURATION FIREBASE -------------
const firebaseConfig = {
  apiKey: "AIzaSyBfKq__Jyfqhky8wUg8Gut6TqfgnmVp1yM",
  authDomain: "bibliotheque-eflp.firebaseapp.com",
  projectId: "bibliotheque-eflp",
  storageBucket: "bibliotheque-eflp.firebasestorage.app",
  messagingSenderId: "759572551810",
  appId: "1:759572551810:web:4c96b1b907bf31a2807c9b",
  measurementId: "G-JS7G5MNL2Q"
};

// ------------ INITIALISATION FIREBASE -------------
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("🔥 Firebase connecté !");

// -----------------------------------------------------
//   AJOUTER UN LIVRE
// -----------------------------------------------------

async function ajouterLivre() {
  const titre = document.getElementById("titre").value;
  const auteur = document.getElementById("auteur").value;
  const langue = document.getElementById("langue").value;
  const cycle = document.getElementById("cycle").value;

  if (!titre || !auteur) {
    alert("Merci d’entrer un titre et un auteur.");
    return;
  }

  await addDoc(collection(db, "books"), {
    titre,
    auteur,
    langue,
    cycle,
    emprunte: false
  });

  alert("📘 Livre ajouté !");
  document.getElementById("titre").value = "";
  document.getElementById("auteur").value = "";
}

// -----------------------------------------------------
//   AFFICHER LES LIVRES EN DIRECT
// -----------------------------------------------------

const liste = document.getElementById("liste-livres");

onSnapshot(collection(db, "books"), (snapshot) => {
  liste.innerHTML = ""; // reset

  snapshot.forEach((docu) => {
    const livre = docu.data();

    const html = `
      <div class="carte-livre">
        <h3>${livre.titre}</h3>
        <p>Auteur : ${livre.auteur}</p>
        <p>Langue : ${livre.langue}</p>
        <p>Cycle : ${livre.cycle}</p>
        <p>Status : ${livre.emprunte ? "📕 Emprunté" : "📗 Disponible"}</p>
        <button onclick="toggleEmprunt('${docu.id}', ${livre.emprunte})">
          ${livre.emprunte ? "Retourner" : "Emprunter"}
        </button>
      </div>
    `;

    liste.innerHTML += html;
  });
});

// -----------------------------------------------------
//   EMPRUNTER / RETOURNER UN LIVRE
// -----------------------------------------------------

async function toggleEmprunt(id, etatActuel) {
  await updateDoc(doc(db, "books", id), {
    emprunte: !etatActuel
  });
}

// Rendre la fonction disponible globalement
window.toggleEmprunt = toggleEmprunt;
window.ajouterLivre = ajouterLivre;

