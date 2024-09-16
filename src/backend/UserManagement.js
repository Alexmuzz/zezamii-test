const express = require('express');
const app = express();
const port = 3030;

app.use(express.json())

let users = []
let nextId = 1

// Middleware to log HTTP method and URL path
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
});

// Create a user
app.post('/users', (req, res) => {
    const { name, email } = req.body

    if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
        return res.status(400).json({ error: 'Invalid input' })
    }

    const user = { id: nextId++, name, email }

    users.push(user)
    res.status(201).json(user)
});

// Read all users
app.get('/users', (req, res) => {
    res.json(users)
});

// Read a single user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id, 10))

    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
    const { name, email } = req.body
    const user = users.find(u => u.id === parseInt(req.params.id, 10))

    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    if (!name || !email || typeof name !== 'string' || typeof email !== 'string') {
        return res.status(400).json({ error: 'Invalid input' })
    }

    user.name = name
    user.email = email
    res.json(user)
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id, 10))

    if (index === -1) {
        return res.status(404).json({ error: 'User not found' })
    }

    users.splice(index, 1)
    res.status(204).end()
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});


/*
    Testing in Postman

  1. Create a User (POST request)
     URL: http://localhost:3030/users
     Method: POST
     Body (JSON):
     {
       "name": "Alex",
       "email": "Alex@example.com"
     }

  2. Read All Users (GET request)
     URL: http://localhost:3030/users
     Method: GET

  3. Read a Single User by ID (GET request)
     URL: http://localhost:3030/users/:id
     Method: GET

  4. Update a User by ID (PUT request)
     URL: http://localhost:3030/users/:id
     Method: PUT
     Body (JSON):
     {
       "name": "Muzz",
       "email": "Muzz@example.com"
     }

  5. Delete a User by ID (DELETE request)
     URL: http://localhost:3030/users/:id
     Method: DELETE
*/

