/*
====================================
db.js - Database Interface (SQLite)
Handles connection and data storage.
====================================
*/

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
// Load environment variables to find the DB path
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Resolve the absolute path to the database file
const DB_FILE = path.resolve(__dirname, process.env.DATABASE_PATH.replace('./server/', ''));

/**
 * Initializes the database structure.
 * Creates 'messages' and 'visitor_logs' tables if they do not exist.
 */
function initDatabase() {
    const db = new sqlite3.Database(DB_FILE, (err) => {
        if (err) {
            console.error('Database connection failed:', err.message);
        } else {
            console.log('Connected to SQLite database.');
        }
    });

    db.serialize(() => {
        // 1. Contact Messages Table
        db.run(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                ip TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        
       /**ehrm */
    });

    db.close();
}

/**
 * Inserts a new contact form submission.
 */
function insertMessage(data) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_FILE);
        const sql = `
            INSERT INTO messages (name, email, phone, subject, message, ip) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [data.name, data.email, data.phone, data.subject, data.message, data.ip];

        db.run(sql, params, function(err) {
            db.close();
            if (err) reject(err); else resolve(this.lastID);
        });
    });
}

module.exports = { initDatabase, insertMessage};