const express = require('express')
const app = express()
const fs = require('fs');

// Use ejs files to prepare templetase
const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        // Get data from the file
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            // Task list data from the file
            const tasks = data.split("\n")
            resolve(tasks) 
        });
    })
} 

app.get('/', (req, res) => {
    // Task list data from file
    readFile('./tasks')
    .then(tasks => {
        console.log(tasks)
        res.render('index', {tasks: tasks})
    })
}) 

// For parsing application
app.use(express.urlencoded({ extended: true}));

app.post('/', (req, res) => {
    // Tasks list data from file
    readFile('./tasks')
        .then(tasks => {
            // Add form sent task to tasks array
            tasks.push(req.body.task)
            const data = tasks.join("\n")
            fs.writeFile('./tasks', data, err => {
                if (err) {
                    console.error(err);
                    return;
                }
                // Redirect to / to see result
                res.redirect('/') 
            })
    })
})

app.listen(3001, () => { 
    console.log('Example app is started at http://localhost:3001')
})