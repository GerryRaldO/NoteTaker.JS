const express = require('express');
const fs = require('fs');
const path = require('path');
var uniqid = require('uniqid');
const noteData = require('./db/db.json');
const { readAndAppend, readFromFile } = require('./helpers/fsUtils');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


//added get path to main page
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});


//added get path to notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});


//allows to get the data from the notes
app.get('/api/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);


app.post('/api/notes', (req, res) => {
    console.log(req.body, 'BODY');
    const { title, text,} = req.body;

    try{
        const newNote = {
            title,
            text,
            id: uniqid(),
        }
        
        readAndAppend(newNote, './db/db.json');
        
        
        const response = {
            status: 'success',
            body: newNote,
        };
        console.log(response);
        res.status(201).json(response);
    } catch(err) {
        console.log('ERROR', err)
    }

});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});