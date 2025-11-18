// ----------------------
// PROFESSEURS AUTORISÉS
// ----------------------

const comptes = {
    "alex": { mdp: "cycle4", nom: "Alex (Cycle 4)" },
    "dominique": { mdp: "cycle2", nom: "Dominique (Cycle 2)" },
    "camille": { mdp: "cycle3", nom: "Camille (Cycle 3)" },
    "caroline": { mdp: "cycle2", nom: "Caroline (Cycle 2)" },
    "carole": { mdp: "cycle1", nom: "Carole (Cycle 1)" }
};

let livres = JSON.parse(localStorage.getItem("bibliotheque")) || [];

// ------------------------------------------------
// CONNEXION
// ------------------------------------------------
function login() {
    const id = document.getElementById("loginId").value.toLowerCase();
    const password = document.getElementById("loginPassword").value;

    if (comptes[id] && comptes[id].mdp === password) {
        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("appPage").classList.remove("hidden");
        document.getElementById("welcome").textContent =
            "Bienvenue " + comptes[id].nom + " 👋";
        afficherLivres();
    } else {
        document.getElementById("loginError").textContent =
            "Identifiant ou mot de passe incorrect.";
    }
}

// ------------------------------------------------
// AJOUTER UN LIVRE
// ------------------------------------------------
function ajouterLivre() {
    const titre = document.getElementById("titre").value;
    const auteur = document.getElementById("auteur").value;
    const langue = document.getElementById("langue").value;

    if (!titre || !auteur || !langue) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const livre = { id: Date.now(), titre, auteur, langue };
    livres.push(livre);

    localStorage.setItem("bibliotheque", JSON.stringify(livres));
    afficherLivres();

    document.getElementById("titre").value = "";
    document.getElementById("auteur").value = "";
    document.getElementById("langue").value = "";
}

// ------------------------------------------------
// AFFICHER LES LIVRES
// ------------------------------------------------
function afficherLivres() {
    const liste = document.getElementById("listeLivres");
    liste.innerHTML = "";

    livres.forEach(livre => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${livre.titre} - ${livre.auteur} (${livre.langue})
            <button onclick="supprimerLivre(${livre.id})">Supprimer</button>
        `;
        liste.appendChild(li);
    });
}

// ------------------------------------------------
// SUPPRIMER UN LIVRE
// ------------------------------------------------
function supprimerLivre(id) {
    livres = livres.filter(l => l.id !== id);
    localStorage.setItem("bibliotheque", JSON.stringify(livres));
    afficherLivres();
}
