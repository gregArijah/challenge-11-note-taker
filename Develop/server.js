const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT||3001;
const app = express();

let notes = require('./db/db.json');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//midleware for serving assets in the public folder
app.use(express.static('public'));

//GET route for home page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

//GET route for notes
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

//GEt route for retreving all notes
app.get('/api/notes', (req, res) => res.json(notes));

//POSt route for submitting new notes
app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    const note = req.body;
    notes.push(note);
    fs.writeFileSync(path.join(__dirname, '/db/db.json'),JSON.stringify(notes,null,2));
    res.json(note);
});

//DELETE route for notes
app.delete('/api/notes/:id', (req, res) => {
    notes = notes.filter(note => note.id !== req.params.id);
    fs.writeFileSync(path.join(__dirname, '/db/db.json'),JSON.stringify(notes,null,2));
    res.json(notes);
});

//wildcard route for invalid enpoints
app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
