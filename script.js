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
