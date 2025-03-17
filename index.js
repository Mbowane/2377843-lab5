const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

const books = []; // Storage for books

// Root route
app.get("/", (req, res) => {
    res.send("Book API is running!");
});

// GET /whoami - Returns student number
app.get("/whoami", (req, res) => {
    res.json({ studentNumber: "Your student number" }); // Replace with actual student number
});

// GET /books - Returns a list of all books
app.get("/books", (req, res) => {
    res.json(books);
});

// GET /books/:id - Returns details of a specific book
app.get("/books/:id", (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
});

// POST /books - Adds a new book
app.post("/books", (req, res) => {
    const { id, title, details } = req.body;

    if (!id || !title || !Array.isArray(details)) {
        return res.status(400).json({ error: "Missing required book details" });
    }

    if (books.find(b => b.id === id)) {
        return res.status(400).json({ error: "Book with this ID already exists" });
    }

    const newBook = { id: parseInt(id), title, details };
    books.push(newBook);
    res.status(201).json({ message: "Book added successfully", book: newBook });
});

// PUT /books/:id - Updates an existing book
app.put("/books/:id", (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    const { title, details } = req.body;
    if (title) book.title = title;
    if (details) book.details = details;

    res.json({ message: "Book updated successfully", book });
});

// DELETE /books/:id - Deletes a book
app.delete("/books/:id", (req, res) => {
    const index = books.findIndex(b => b.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    books.splice(index, 1);
    res.status(204).send(); // No content response
});

// POST /books/:id/details - Adds a detail to a book
app.post("/books/:id/details", (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    const { author, genre, year } = req.body;
    if (!author || !genre || !year) {
        return res.status(400).json({ error: "Author, genre, and year are required" });
    }

    const detail = {
        id: book.details.length + 1,
        author,
        genre,
        year
    };

    book.details.push(detail);
    res.status(201).json(detail);
});

// DELETE /books/:id/details/:detailId - Removes a detail from a book
app.delete("/books/:id/details/:detailId", (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
        return res.status(404).json({ error: "Book not found" });
    }

    const detailIndex = book.details.findIndex(d => d.id === parseInt(req.params.detailId));
    if (detailIndex === -1) {
        return res.status(404).json({ error: "Detail not found" });
    }

    book.details.splice(detailIndex, 1);
    res.status(204).send(); 
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
