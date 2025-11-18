const books = [
    { title: "Livre 1", author: "Auteur 1" },
    { title: "Livre 2", author: "Auteur 2" }
];

function displayBooks() {
    const container = document.getElementById("books");
    container.innerHTML = "";

    books.forEach(b => {
        const div = document.createElement("div");
        div.textContent = b.title + " - " + b.author;
        container.appendChild(div);
    });
}

displayBooks();
apiKey: "AIzaSyBfKq__Jyfqhky8wUg8Gut6TqfgnmVp1yM",
  authDomain: "bibliotheque-eflp.firebaseapp.com",
  projectId: "bibliotheque-eflp",
  storageBucket: "bibliotheque-eflp.firebasestorage.app",
  messagingSenderId: "759572551810",
  appId: "1:759572551810:web:4c96b1b907bf31a2807c9b",
  measurementId: "G-JS7G5MNL2Q"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Test : récupérer les livres existants
db.collection("books").get().then(snapshot => {
  snapshot.forEach(doc => {
    console.log(doc.id, doc.data());
  });
});
