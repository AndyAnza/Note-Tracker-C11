//added dependecies
const fs = require("fs"); //Importing fs module to read and write files
const express = require("express"); //importing Express framework
const path = require("path"); //importing path module to work with file and directory paths
const uuid = require("./helpers/uuid"); //uuid generates unique IDs for notes
const db = require("./db/db.json"); //importing a JSON file that stores notes data

const app = express(); //create app
const PORT = process.env.PORT || 3000; //setting the port for the server to listen on

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//html routes
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

//GET and POST requests for the notes API
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const notes = {
      title,
      text,
      id: uuid(),
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        parsedNotes.push(notes);

        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (err) =>
            err ? res.json(err) : res.json("Successfully updated notes! ✅")
        );
      }
    });
  }
});

//deletes the note with the specified ID from the db.json file
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }

    const parsedNotes = JSON.parse(data);
    const updatedNotes = parsedNotes.filter((note) => note.id !== noteId);

    fs.writeFile(
      "./db/db.json",
      JSON.stringify(updatedNotes, null, 3),
      (writeErr) =>
        writeErr
          ? res.json(writeErr)
          : res.json(`Successfully deleted note with id ${noteId}! 🚮`)
    );
  });
});

//starts the server and listens on the specified port
app.listen(PORT, () =>
  console.log(`Listening on port http://localhost:${PORT} ✅`)
);
