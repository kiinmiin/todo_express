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
            const tasks = JSON.parse(data)
            resolve(tasks) 
        });
    })
}

const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        // Get data from file
        fs.writeFile(filename, data, 'utf-8', err => {
            if (err) {
                console.error(err);
                return;
            }
            resolve(true) 
        });
    })
} 

app.get('/', (req, res) => {
    // Task list data from file
    readFile('./tasks.json')
    .then(tasks => {
        res.render('index', {
            tasks: tasks,
            error: null
        })
    })
}) 

// For parsing application
app.use(express.urlencoded({ extended: true}));

app.post('/', (req, res) => {
    // Control data from form
    let error = null
    if (req.body.task.trim().length == 0) {
        error = 'Please insert correct task data'
        readFile('./tasks.json')
        .then(tasks => {
            res.render('index', {
                tasks: tasks,
                error: error
            })
        })
    } else {
        // Tasks list data from file
        readFile('./tasks.json')
            .then(tasks => {
                // Adding a new task
                // Creating new id
                let index
                if (tasks.length === 0)
                {
                    index = 0
                } else {
                    index = tasks[tasks.length-1].id +1; 
                }
                // Create task object
                const newTask = {
                    "id" : index,
                    "task" : req.body.task
                }
                // Add form sent task to array
                tasks.push(newTask)
                data = JSON.stringify(tasks, null, 2)
                writeFile('tasks.json', data)
                    // Redirect to / to see result
                    res.redirect('/') 
            }) 
        }
    })

app.get('/delete-task/:taskId', (req, res) => {
    let deletedTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks => {
        tasks.forEach((task, index) => {
            if (task.id === deletedTaskId) {
                tasks.splice(index, 1)
            } 
        })
        data = JSON.stringify(tasks, null, 2)
        fs.writeFile('./tasks.json', data, 'utf-8', err => {
            if (err) {
                console.error(err);
                return;
            }
            // Redirect to / to see result
            res.redirect('/') 
        })
    }) 
})

app.get('/delete-all-tasks', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'tasks.json');
        
        // Read the tasks from file
        let tasks = await readFile(filePath);
        
        // Clear the array (delete all tasks)
        tasks = [];
        
        // Write an empty array to the file
        fs.writeFile(filePath, JSON.stringify(tasks, null, 2), 'utf-8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
            // Redirect to / to see result
            res.redirect('/');
        });
    } catch (err) {
        console.error(err);
        return;
    }
}); 

app.listen(3001, () => { 
    console.log('Example app is started at http://localhost:3001')
})