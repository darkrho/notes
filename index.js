const express = require("express");
const cors = require("cors");
const app = express();

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

// data
let notes = [
  { id: 1, content: "HTML is easy", important: true },
  { id: 2, content: "Browser can execute only JavaScript", important: false },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

/* generate id */
const generateId = () =>
  notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

/* home page */
app.get("/", (request, response) => {
  response.send("<h1>Hello world!</h1>");
});
/* all notes */
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

/* one note */
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(400).end();
  }
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
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }
  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  };
  notes.concat(note);
  response.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
