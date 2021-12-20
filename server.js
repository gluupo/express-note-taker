const path = require('path');
const fs = require('fs');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { json } = require('express/lib/response');
const { response } = require('express');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
})
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
})
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.post('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const newNote = req.body;
    newNote.id = uuidv4();
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 4));
    res.json(notes);
    console.log("note has been added", newNote);
})

app.delete('/api/notes/:id', (req, res) => {
    let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const id = req.params.id;
    notes = notes.filter((obj) => obj.id !== id);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 4));
    res.json(notes);
    console.log('note deleted')
})


app.listen(PORT, () =>
    console.log(`App @ http://localhost:${PORT} 🐍🖤`)
);