
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Root route for testing
app.get("/", (req, res) => {
    res.send("Book API is running!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const books = []; //  storage for books

app.get("/whoami", (req, res) => { // GET /whoami - Returns student number
  res.json({ studentNumber: "Your student number" }); // Replace with your actual student number
});

app.get("/books", (req, res) => {// GET /books - Returns a list of all books
  res.json(books);
});

app.get("/books/:id", (req, res) => {// GET /books/:id - Returns details of a specific book
  const book = books.find((b) => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }
  res.json(book);
});

app.post("/books", (req, res) => { // POST /books - Adds a new book
  const { id, title, details } = req.body;

  if (!id || !title || !Array.isArray(details)) {
    return res.status(400).json({ error: "Missing required book details" });
  }

  books.push({ id, title, details });
  res.status(201).json({ message: "Book added successfully", book: { id, title, details } });
});

app.put("/books/:id", (req, res) => { // PUT /books/:id - Updates an existing book
  const book = books.find((b) => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  const { title, details } = req.body;
  if (title) book.title = title;
  if (details) book.details = details;

  res.json({ message: "Book updated successfully", book });
});

app.delete("/books/:id", (req, res) => {// DELETE /books/:id - Deletes a book
  const index = books.findIndex((b) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(index, 1);
  res.json({ message: "Book deleted successfully" });
});

app.post("/books", (req, res) => {//add a new book//
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }
    const newBook = {
        id: books.length + 1,
        title,
        details: []
    };

    books.push(newBook);
    res.status(201).json(newBook);
});

app.delete("/books/:id", (req, res) => {// DELETE  Removes a detail from a book
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) {
        return res.status(404).json({ error: "Book not found" });
    }

    books.splice(bookIndex, 1);
    res.status(204).send(); // No content response
});

app.post("/books/:id/details", (req, res) => {// add detail to a book//
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

app.delete("/books/:id/details/:detailId", (req, res) => {// remove a detail//
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

