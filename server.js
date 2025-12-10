require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- FIX: SERVE STATIC FILES EXPLICITLY ---
// This forces Node to look in the exact folder where server.js is located
app.use(express.static(__dirname)); 
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- DATABASE CONNECTION ---
// REPLACE 'YOUR_PASSWORD' WITH YOUR ACTUAL PASSWORD
// --- DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        return;
    }
    console.log('✅ Connected to MySQL Database');
});

// --- API ROUTES ---

// 0. Authentication - Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
    }

    const sql = "SELECT id, username, phone, wallet_balance, is_admin FROM users WHERE username = ? AND password = ?";

    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = results[0];
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
                wallet_balance: user.wallet_balance,
                is_admin: user.is_admin
            }
        });
    });
});

// Get user wallet balance
app.get('/api/users/:username/wallet', (req, res) => {
    const { username } = req.params;

    const sql = "SELECT wallet_balance FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ error: "User not found" });

        res.json({ wallet_balance: results[0].wallet_balance });
    });
});

// Update user wallet balance
app.put('/api/users/:username/wallet', (req, res) => {
    const { username } = req.params;
    const { amount } = req.body;

    const sql = "UPDATE users SET wallet_balance = ? WHERE username = ?";
    db.query(sql, [amount, username], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Wallet updated", balance: amount });
    });
});

// 1. Get Menu (Forgiving Join)
app.get('/api/menu', (req, res) => {
    const { search } = req.query;
    let sql = `
        SELECT m.*, c.name as category_name, COALESCE(i.stock_qty, 0) as stock_qty 
        FROM menu_items m
        LEFT JOIN categories c ON m.category_id = c.id
        LEFT JOIN inventory i ON m.id = i.item_id
        WHERE m.id IS NOT NULL
    `;
    const params = [];

    if (search) {
        sql += " AND m.name LIKE ?";
        params.push(`%${search}%`);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 2. Place Order
app.post('/api/orders', (req, res) => {
    const { userName, total, items, guestInfo } = req.body;

    // Handle guest orders
    if (userName === 'guest' || !userName) {
        // For guest users, use a default guest user or create orders without user_id
        const sql = "INSERT INTO orders (user_id, total_amount, status, user_name) VALUES (NULL, ?, 'new', ?)";
        const guestName = guestInfo ? guestInfo.name : 'Guest User';

        db.query(sql, [total, guestName], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Order failed" });
            }
            res.json({ message: "Order Placed", orderId: result.insertId });
        });
    } else {
        // For logged-in users
        const sql = "INSERT INTO orders (user_id, total_amount, status) VALUES ((SELECT id FROM users WHERE username = ? LIMIT 1), ?, 'new')";

        db.query(sql, [userName, total], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Order failed. Does user exist?" });
            }
            res.json({ message: "Order Placed", orderId: result.insertId });
        });
    }
});

// 3. Get Revenue Statistics (BEFORE /api/orders)
app.get('/api/revenue', (req, res) => {
    const queries = {
        today: `
            SELECT COALESCE(SUM(total_amount), 0) as revenue, COUNT(*) as count
            FROM orders
            WHERE DATE(created_at) = CURDATE() AND status = 'completed'
        `,
        week: `
            SELECT COALESCE(SUM(total_amount), 0) as revenue
            FROM orders
            WHERE YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1) AND status = 'completed'
        `,
        month: `
            SELECT COALESCE(SUM(total_amount), 0) as revenue
            FROM orders
            WHERE YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE()) AND status = 'completed'
        `
    };

    const results = {};

    db.query(queries.today, (err, todayData) => {
        if (err) return res.status(500).json(err);
        results.today = todayData[0].revenue;
        results.todayCount = todayData[0].count;

        db.query(queries.week, (err, weekData) => {
            if (err) return res.status(500).json(err);
            results.week = weekData[0].revenue;

            db.query(queries.month, (err, monthData) => {
                if (err) return res.status(500).json(err);
                results.month = monthData[0].revenue;

                res.json(results);
            });
        });
    });
});

// 4. Get All Orders with Pagination and Search (BEFORE /api/orders)
app.get('/api/orders/all', (req, res) => {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let sql = `
        SELECT o.id, o.total_amount, o.status, o.created_at,
               COALESCE(u.username, o.user_name, 'Guest') as user_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE 1=1
    `;

    const params = [];

    if (search) {
        sql += ` AND (o.id LIKE ? OR COALESCE(u.username, o.user_name, 'Guest') LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count - build separate count query
    const countSql = `
        SELECT COUNT(*) as total
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE 1=1
    ` + (search ? ` AND (o.id LIKE ? OR COALESCE(u.username, o.user_name, 'Guest') LIKE ?)` : '');

    db.query(countSql, search ? params : [], (err, countResult) => {
        if (err) return res.status(500).json(err);
        const total = countResult[0].total;

        // Get paginated results
        sql += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        db.query(sql, params, (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({
                orders: results,
                total: total,
                page: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit))
            });
        });
    });
});

// 5. Get Orders (for live order display)
app.get('/api/orders', (req, res) => {
    const sql = `
        SELECT o.id, o.total_amount, o.status, o.created_at,
               COALESCE(u.username, o.user_name, 'Guest') as user_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC`;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 6. Update Status
app.put('/api/orders/:id', (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Status Updated" });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});