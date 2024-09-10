const express = require('express')
const app = express()
const fs = require('fs');

// Use ejs files to prepare templetase
const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    // Get data from the file
    fs.readFile('./tasks', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
            // Task list data from file
        const tasks = data.split("\n") 
        res.render('index', {tasks:tasks})
    });
})


app.listen(3001, () => { 
    console.log('Example app is started at http://localhost:3001')
})