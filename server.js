const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create tables if they don't exist
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'user'
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS Appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                clientName TEXT NOT NULL,
                service TEXT NOT NULL,
                appointmentDate TEXT NOT NULL,
                status TEXT DEFAULT 'pending'
            )`);
            db.run(`CREATE TABLE IF NOT EXISTS Inventory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                itemName TEXT UNIQUE NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL
            )`);
            console.log('Tables checked/created.');

            // Insert a default admin user if not exists (for testing)
            const adminUsername = 'admin';
            const adminPassword = 'adminpassword'; // This will be hashed
            bcrypt.hash(adminPassword, 10, (err, hash) => {
                if (err) {
                    console.error('Error hashing admin password:', err);
                    return;
                }
                db.get(`SELECT id FROM Users WHERE username = ?`, [adminUsername], (err, row) => {
                    if (err) {
                        console.error('Error checking for admin user:', err.message);
                        return;
                    }
                    if (!row) {
                        db.run(`INSERT INTO Users (username, password, role) VALUES (?, ?, ?)`, 
                            [adminUsername, hash, 'admin'], (err) => {
                                if (err) {
                                    console.error('Error inserting default admin user:', err.message);
                                } else {
                                    console.log('Default admin user inserted.');
                                }
                            });
                    } else {
                        console.log('Admin user already exists.');
                    }
                });
            });
        });
    }
});

app.use(express.static(path.join(__dirname)));
app.use(express.json()); // For parsing application/json

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT id, username, password, role FROM Users WHERE username = ?`, [username], async (err, user) => {
        if (err) {
            console.error('Login error:', err.message);
            return res.status(500).send('Server error.');
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        res.status(200).json({ message: 'Login successful', role: user.role });
    });
});

// Middleware to check if user is authenticated and is admin (simplified for now)
function isAuthenticatedAdmin(req, res, next) {
    // In a real application, this would involve session management or JWT verification
    // For now, we'll rely on the frontend to redirect if not logged in as admin.
    next();
}

// Add new appointment (Admin only)
app.post('/api/appointments', isAuthenticatedAdmin, (req, res) => {
    const { clientName, service, appointmentDate, status } = req.body;
    db.run(`INSERT INTO Appointments (clientName, service, appointmentDate, status) VALUES (?, ?, ?, ?)`, 
        [clientName, service, appointmentDate, status], function(err) {
            if (err) {
                console.error('Error adding appointment:', err.message);
                return res.status(500).send('Server error adding appointment.');
            }
            res.status(201).json({ message: 'Appointment added successfully', id: this.lastID });
        });
});

// Add new inventory item (Admin only)
app.post('/api/inventory', isAuthenticatedAdmin, (req, res) => {
    const { itemName, quantity, price } = req.body;
    db.run(`INSERT INTO Inventory (itemName, quantity, price) VALUES (?, ?, ?)`, 
        [itemName, quantity, price], function(err) {
            if (err) {
                console.error('Error adding inventory item:', err.message);
                return res.status(500).send('Server error adding inventory item.');
            }
            res.status(201).json({ message: 'Inventory item added successfully', id: this.lastID });
        });
});

// Get all appointments (Admin only)
app.get('/api/appointments', isAuthenticatedAdmin, (req, res) => {
    db.all('SELECT * FROM Appointments', [], (err, rows) => {
        if (err) {
            console.error('Error fetching appointments:', err.message);
            return res.status(500).send('Server error fetching appointments.');
        }
        res.status(200).json(rows);
    });
});

// Get all inventory items (Admin only)
app.get('/api/inventory', isAuthenticatedAdmin, (req, res) => {
    db.all('SELECT * FROM Inventory', [], (err, rows) => {
        if (err) {
            console.error('Error fetching inventory:', err.message);
            return res.status(500).send('Server error fetching inventory.');
        }
        res.status(200).json(rows);
    });
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});