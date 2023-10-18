const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Users',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed: ' + err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Create a User
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const insertQuery = 'INSERT INTO users (name, email) VALUES (?, ?)';
  db.query(insertQuery, [name, email], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'User created', id: result.insertId });
    }
  });
});

// Read all Users
app.get('/users', (req, res) => {
  const selectQuery = 'SELECT * FROM users';
  db.query(selectQuery, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Read a User by ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const selectQuery = 'SELECT * FROM users WHERE id = ?';
  db.query(selectQuery, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      if (rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(rows[0]);
      }
    }
  });
});

// Update a User by ID
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  const updateQuery = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  db.query(updateQuery, [name, email, userId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'User updated' });
    }
  });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
