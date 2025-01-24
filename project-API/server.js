const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let users = []; // In-memory data storage (replace with DB in production)
let nextId = 1;

/**
 * GET /api/users - Retrieve all users
 */
app.get('/api/users', (req, res) => {
    res.status(200).json({ success: true, data: users });
});

/**
 * POST /api/users - Create a new user
 */
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const newUser = { id: nextId++, name, email };
    users.push(newUser);

    res.status(201).json({ success: true, data: newUser });
});

/**
 * PUT /api/users/:id - Update an existing user
 */
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (!name && !email) {
        return res.status(400).json({ success: false, error: 'At least one field (name or email) must be provided' });
    }

    if (name) user.name = name;
    if (email) user.email = email;

    res.status(200).json({ success: true, data: user });
});

/**
 * DELETE /api/users/:id - Delete a user
 */
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
        return res.status(404).json({ success: false, error: 'User not found' });
    }

    users.splice(userIndex, 1);

    res.status(200).json({ success: true, message: 'User deleted successfully' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
