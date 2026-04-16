/*
====================================
server.js - Express App Entry Point
====================================
*/

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables once, before anything else reads them.
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { initDatabase, closeDatabase } = require('./db');

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const app = express();

// We're behind Cloudflare Tunnel / one reverse proxy.
// Setting a numeric hop count stops rate-limit from trusting arbitrary XFF.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// --- Security Middleware (Helmet) ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'"],
            styleSrc: ["'self'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:'],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            objectSrc: ["'none'"]
        }
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// --- Body parsing with explicit size caps ---
app.use(bodyParser.json({ limit: '20kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20kb' }));

// Handle malformed JSON cleanly instead of leaking body-parser's default HTML.
app.use((err, req, res, next) => {
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({ success: false, message: 'Invalid JSON.' });
    }
    if (err && err.type === 'entity.too.large') {
        return res.status(413).json({ success: false, message: 'Payload too large.' });
    }
    next(err);
});

// --- Static files ---
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Routes ---
const apiRoutes = require('./routes');
app.use('/', apiRoutes);

// --- Start server after DB is ready ---
initDatabase()
    .then(() => {
        const server = app.listen(PORT, '127.0.0.1', () => {
            console.log(`Server running in ${NODE_ENV} mode on http://127.0.0.1:${PORT}`);
            console.log(`Serving static files from: ${path.join(__dirname, '..', 'public')}`);
        });
        server.requestTimeout = 30_000;
        server.headersTimeout = 35_000;

        const shutdown = (signal) => {
            console.log(`${signal} received, shutting down.`);
            server.close(async () => {
                await closeDatabase();
                process.exit(0);
            });
            // Force-exit if close hangs.
            setTimeout(() => process.exit(1), 10_000).unref();
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err.message);
        process.exit(1);
    });
