// Charger les livres existants
let livres = JSON.parse(localStorage.getItem("livres")) || [];

// --- AJOUTER UN LIVRE ---
function ajouterLivre() {
    const titre = document.getElementById("titre").value.trim();
    const auteur = document.getElementById("auteur").value.trim();
    const langue = document.getElementById("langue").value;
    const cycle = document.getElementById("cycle").value;

    if (!titre || !auteur) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    const livre = {
        id: Date.now(),
        titre,
        auteur,
        langue,
        cycle
    };

    livres.push(livre);
    localStorage.setItem("livres", JSON.stringify(livres));

    afficherLivres();

    document.getElementById("titre").value = "";
    document.getElementById("auteur").value = "";
}

// --- AFFICHER LES LIVRES ---
function afficherLivres() {
    const div = document.getElementById("liste-livres");
    div.innerHTML = "";

    livres.forEach(livre => {
        const el = document.createElement("div");
        el.classList.add("livre");

        el.innerHTML = `
            <h3>${livre.titre}</h3>
            <p><b>Auteur :</b> ${livre.auteur}</p>
            <p><b>Langue :</b> ${livre.langue}</p>
            <p><b>Cycle :</b> ${livre.cycle}</p>
            <button onclick="supprimerLivre(${livre.id})">🗑 Supprimer</button>
        `;

        div.appendChild(el);
    });
}

// --- SUPPRIMER UN LIVRE ---
function supprimerLivre(id) {
    livres = livres.filter(l => l.id !== id);
    localStorage.setItem("livres", JSON.stringify(livres));
    afficherLivres();
}

// Afficher au chargement
afficherLivres();


