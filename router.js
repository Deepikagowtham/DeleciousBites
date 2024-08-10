const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DeliciousBites',
    password: '20-Nov-04',
    port: 5432,
});

// Use session middleware
router.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Serve static files for login and signup
router.use(express.static(path.join(__dirname, 'public')));

// Create users table if it doesn't exist
pool.connect((err) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    )`, (err, result) => {
        if (err) {
            return console.error("Error creating table 'users':", err);
        }
        console.log("Table 'users' created successfully");
    });
});

// Serve home page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

// Serve other pages
router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
});

router.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

router.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));
});

router.get('/rev', (req, res) => {
    res.sendFile(path.join(__dirname, 'rev.html'));
});

// Serve login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve signup page
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

// Signup route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        res.json({ success: true });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'An error occurred during signup.' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'No user found with this email.' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.user = user; // Save user info in session
            res.json({ success: true });
            console.log('User login in successfully ');
        } else {
            res.status(401).json({ success: false, message: 'Incorrect password.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login.' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ success: false, message: 'An error occurred during logout.' });
        }
        res.redirect('/home');
    });
});

// Reservation route
router.post('/reserve', async (req, res) => {
    const { name, email, person_count, date_time, special_requests } = req.body;
    const bookingDateTime = new Date(date_time);
    const currentDateTime = new Date();

    if (bookingDateTime < currentDateTime) {
        return res.status(400).json({ success: false, message: 'Booking date and time cannot be in the past.' });
    }

    try {
        await pool.query("INSERT INTO reservations (name, email, person_count, date_time, special_requests) VALUES ($1, $2, $3, $4, $5)", [name, email, person_count, date_time, special_requests]);
        res.json({ success: true, message: 'Your reservation has been made!' });
    } catch (err) {
        console.error('Error inserting data:', err.stack);
        res.status(500).json({ success: false, message: 'Failed to make reservation' });
    }
});

module.exports = router;
