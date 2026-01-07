/*
====================================
routes.js - Application Routes
====================================
*/

const express = require('express');
const router = express.Router();
const path = require('path');
const { insertMessage, logVisitor } = require('./db');
const { contactValidationRules, validate } = require('./validators');
const rateLimit = require('express-rate-limit');

// Rate limiting for the contact form
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: 'Too many messages sent from this IP.'
});

// --- API ROUTES ---

// 1. GitHub Proxy
router.get('/api/github-repos', async (req, res) => {
    try {
        const response = await fetch(`https://api.github.com/users/${process.env.GITHUB_USERNAME}/repos?sort=updated&per_page=10`, {
            headers: {
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'User-Agent': 'Kryptos-Terminal-Portfolio'
            }
        });
        
        if (!response.ok) throw new Error('GitHub API connection failed');
        
        const data = await response.json();
        const filteredData = data.map(repo => ({
            name: repo.name,
            description: repo.description,
            language: repo.language,
            stars: repo.stargazers_count,
            url: repo.html_url,
            updated: repo.updated_at
        }));

        res.json(filteredData);
    } catch (error) {
        console.error("GitHub Proxy Error:", error);
        res.status(500).json({ error: "System link to GitHub offline." });
    }
});

// 2. Contact Form
router.post('/api/contact', contactLimiter, contactValidationRules(), validate, async (req, res) => {
    try {
        const messageData = { ...req.body, ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress };
        const messageId = await insertMessage(messageData);
        return res.json({ success: true, message: 'Message successfully stored.', messageId });
    } catch (error) {
        console.error("Contact Form Error:", error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// 3. System Logger (New Telemetry Route)
router.post('/api/log-visit', async (req, res) => {
    try {
        // Get Real IP (supports Nginx proxy if you use it later)
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        const logData = {
            ip: ip,
            userAgent: req.headers['user-agent'],
            referrer: req.headers['referer'] || 'Direct/Bookmark',
            ...req.body // Spread the GPU/CPU data from the client
        };

        await logVisitor(logData);
        res.json({ success: true, status: 'logged' });
    } catch (error) {
        console.error("Logging Error:", error);
        res.status(500).json({ error: "Log failed" });
    }
});

// --- PAGE ROUTES ---

// Root
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Whitelist Page Handler
router.get('/:page', (req, res) => {
    const allowedPages = [
        'gallery.html', 
        'projects.html',
        'about.html', 
        'lab.html', 
        'uses.html', 
        'contact.html'
    ];
    
    if (allowedPages.includes(req.params.page)) {
        res.sendFile(path.join(__dirname, '..', 'public', req.params.page));
    } else {
        res.status(404).send('404: Page not found');
    }
});

module.exports = router;