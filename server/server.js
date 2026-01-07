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

// --- NEW: Import the Database Initializer ---
const { initDatabase } = require('./db'); 

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'production';
const app = express();

// --- Import Routes ---
const apiRoutes = require('./routes');

// --- Security Middleware (Helmet) ---
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"], 
            connectSrc: ["'self'"], 
            styleSrc: ["'self'", "'unsafe-inline'"], 
            scriptSrc: ["'self'", "'unsafe-inline'"], 
            imgSrc: ["'self'", "data:"], 
            frameAncestors: ["'none'"] 
        }
    }
}));

// --- Middleware ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- STATIC FILES ---
app.use(express.static(path.join(__dirname, '..', 'public')));

// --- Routes ---
app.use('/', apiRoutes);

// --- Start Server ---
// --- NEW: Initialize DB before starting ---
initDatabase(); 

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running in ${NODE_ENV} mode on http://127.0.0.1:${PORT}`);
    console.log(`Serving static files from: ${path.join(__dirname, '..', 'public')}`);
});