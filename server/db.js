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

        // 2. System Logs Table (The "Spy" Table)
        db.run(`
            CREATE TABLE IF NOT EXISTS visitor_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip TEXT,
                user_agent TEXT,
                screen_res TEXT,
                gpu_renderer TEXT,
                cpu_threads INTEGER,
                timezone TEXT,
                language TEXT,
                referrer TEXT,
                platform TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
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

/**
 * Logs visitor hardware and network telemetry.
 */
function logVisitor(data) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_FILE);
        const sql = `
            INSERT INTO visitor_logs (
                ip, user_agent, screen_res, gpu_renderer, 
                cpu_threads, timezone, language, referrer, platform
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            data.ip,
            data.userAgent,
            data.screenRes,
            data.gpu,
            data.cpu,
            data.timezone,
            data.language,
            data.referrer,
            data.platform
        ];

        db.run(sql, params, function(err) {
            db.close();
            if (err) reject(err); else resolve(this.lastID);
        });
    });
}

module.exports = { initDatabase, insertMessage, logVisitor };