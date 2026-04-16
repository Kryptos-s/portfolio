/*
====================================
db.js - Database Interface (SQLite)
Handles connection and data storage.
====================================
*/

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Default DB path lives under server/. If DATABASE_PATH is set and resolves
// inside the project, use it; otherwise fall back to the hard-coded default.
const DEFAULT_DB = path.join(__dirname, 'portfolio.db');
const PROJECT_ROOT = path.resolve(__dirname, '..');

function resolveDbFile() {
    const raw = process.env.DATABASE_PATH;
    if (!raw) return DEFAULT_DB;
    // Resolve relative to project root so both "./server/foo.db" and absolute paths work.
    const resolved = path.isAbsolute(raw) ? raw : path.resolve(PROJECT_ROOT, raw);
    // Reject anything that escapes the project directory.
    if (!resolved.startsWith(PROJECT_ROOT + path.sep) && resolved !== PROJECT_ROOT) {
        console.warn('DATABASE_PATH escapes project root; falling back to default.');
        return DEFAULT_DB;
    }
    return resolved;
}

const DB_FILE = resolveDbFile();

// Single long-lived connection. sqlite3 serializes writes internally,
// and WAL mode lets readers proceed alongside a writer.
let db = null;

function getDb() {
    if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
    return db;
}

/**
 * Initializes the database connection and schema.
 * Returns a Promise that resolves once tables exist and WAL is enabled.
 */
function initDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(DB_FILE, (err) => {
            if (err) return reject(err);
            console.log('Connected to SQLite database:', DB_FILE);
        });

        db.serialize(() => {
            db.run('PRAGMA journal_mode = WAL');
            db.run('PRAGMA busy_timeout = 5000');

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
            `, (err) => {
                if (err) return reject(err);
            });

            db.run(`
                CREATE TABLE IF NOT EXISTS visitor_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    ip TEXT,
                    user_agent TEXT,
                    referrer TEXT,
                    platform TEXT,
                    screen TEXT,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function closeDatabase() {
    return new Promise((resolve) => {
        if (!db) return resolve();
        db.close((err) => {
            if (err) console.error('Error closing DB:', err.message);
            db = null;
            resolve();
        });
    });
}

/**
 * Inserts a new contact form submission.
 */
function insertMessage(data) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO messages (name, email, phone, subject, message, ip)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [data.name, data.email, data.phone, data.subject, data.message, data.ip];
        getDb().run(sql, params, function (err) {
            if (err) reject(err); else resolve(this.lastID);
        });
    });
}

/**
 * Inserts a visitor log row. Only whitelisted fields are stored.
 */
function logVisitor(data) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO visitor_logs (ip, user_agent, referrer, platform, screen)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [
            data.ip || null,
            data.userAgent || null,
            data.referrer || null,
            data.platform || null,
            data.screen || null
        ];
        getDb().run(sql, params, function (err) {
            if (err) reject(err); else resolve(this.lastID);
        });
    });
}

module.exports = { initDatabase, closeDatabase, insertMessage, logVisitor };
