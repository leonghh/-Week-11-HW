var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

var savedNote = [];

app.post("/api/notes", function (req, res) {

  var newNote = req.body;
  id = savedNote.length + 1;
  newNote.id = id.toString();

  for (var i = 0; i < savedNote.length; i++) {

    if (id != savedNote[i].id) {
      console.log("ID can be added according to savedNote.length");
    } else {
      console.log("ID already exists. Use the next available ID.");
      id++;
      newNote.id = id.toString();
    } 
  }

  savedNote.push(newNote);
  res.json(newNote);


  fs.writeFile("./db/db.json", JSON.stringify(savedNote), function (err) {
    if (err) throw err;
    console.log("Data has been saved to database");
  })
});

app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf-8", function (err, data) {
    if (err) throw err;
    res.send(JSON.parse(data));
  })
})

app.get("/api/notes/:character", function (req, res) {
  var chosenNote = req.params.character;

  for (var i = 0; i < savedNote.length; i++) {

    if (chosenNote === savedNote[i].id) {
      return res.json(savedNote[i]);
    }
  }
  return res.json(false);
});

app.delete("/api/notes/:character", function (req, res) {
  var chosenNote = req.params.character;
  console.log(chosenNote + " chosen to delete")

  for (var i = 0; i < savedNote.length; i++) {
    if (chosenNote === savedNote[i].id) {
      savedNote.splice(i, 1);

      fs.writeFile("./db/db.json", JSON.stringify(savedNote), function (err) {
        if (err) throw err;
        console.log("Data has been saved to database");
      })
      return res.json(savedNote);
    }
  }
  return res.json(false);
})

app.use(function (req, res, next) {
  res.status(404).send("<h2>The page you're looking for is unavailable. Please check if the address is correct and try again. Good luck!</h2>");
})

app.listen(PORT, function() {
  console.log("App listening on http://localhost:" + PORT);
});
