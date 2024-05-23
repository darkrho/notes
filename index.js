require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const Note = require("./models/note");

// middleware
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("-------");
  next();
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("dist"));

/* generate id */
const generateId = () =>
  notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

/* home page */
app.get("/", (request, response) => {
  response.send("<h1>Hello world!</h1>");
});
/* all notes */
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

/* one note */
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

/* delete one note */
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

/* add a note  */
app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
