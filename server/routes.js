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

const IS_PROD = process.env.NODE_ENV === 'production';

// Log error details in dev, just the message in prod.
function logError(label, err) {
    if (IS_PROD) console.error(label, err && err.message ? err.message : err);
    else console.error(label, err);
}

// Reject cross-site POSTs: the Origin header (or Referer fallback) must match
// the host serving the request. Cheap CSRF mitigation for a no-cookie site.
function sameOriginOnly(req, res, next) {
    if (req.method !== 'POST') return next();
    const origin = req.get('origin') || req.get('referer') || '';
    if (!origin) return res.status(403).json({ success: false, message: 'Origin required.' });
    try {
        const url = new URL(origin);
        if (url.host !== req.get('host')) {
            return res.status(403).json({ success: false, message: 'Cross-site request blocked.' });
        }
    } catch {
        return res.status(403).json({ success: false, message: 'Invalid origin.' });
    }
    return next();
}

// Contact form: 5 / 15 min
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many messages sent from this IP.',
    standardHeaders: true,
    legacyHeaders: false
});

// Every other API route: 60 / 15 min
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false
});

// --- API ROUTES ---

// 1. GitHub Proxy — cached in-memory for 5 min, serves stale on upstream failure
const GITHUB_TTL_MS = 5 * 60 * 1000;
let githubCache = { data: null, fetchedAt: 0 };
let githubInflight = null;

async function fetchGithubRepos() {
    const username = process.env.GITHUB_USERNAME;
    if (!username) throw new Error('GitHub integration not configured.');

    const headers = { 'User-Agent': 'Kryptos-Terminal-Portfolio' };
    if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`,
        { headers, signal: AbortSignal.timeout(8000) }
    );
    if (!response.ok) throw new Error(`GitHub API status ${response.status}`);

    const data = await response.json();
    return data.map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
        updated: repo.updated_at
    }));
}

router.get('/api/github-repos', apiLimiter, async (req, res) => {
    const now = Date.now();
    const fresh = githubCache.data && (now - githubCache.fetchedAt) < GITHUB_TTL_MS;

    if (fresh) {
        res.set('Cache-Control', `public, max-age=${Math.floor(GITHUB_TTL_MS / 1000)}`);
        return res.json(githubCache.data);
    }

    // Coalesce concurrent refreshes to one upstream call.
    if (!githubInflight) {
        githubInflight = fetchGithubRepos()
            .then(data => {
                githubCache = { data, fetchedAt: Date.now() };
                return data;
            })
            .finally(() => { githubInflight = null; });
    }

    try {
        const data = await githubInflight;
        res.set('Cache-Control', `public, max-age=${Math.floor(GITHUB_TTL_MS / 1000)}`);
        res.json(data);
    } catch (error) {
        logError('GitHub Proxy Error:', error);
        // Serve stale if we have it; otherwise error.
        if (githubCache.data) {
            res.set('Cache-Control', 'public, max-age=30');
            res.set('X-Cache-Status', 'stale');
            return res.json(githubCache.data);
        }
        res.status(502).json({ error: 'System link to GitHub offline.' });
    }
});

// 2. Contact Form
router.post('/api/contact', sameOriginOnly, contactLimiter, contactValidationRules(), validate, async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        const messageData = { name, email, phone, subject, message, ip: req.ip };
        const messageId = await insertMessage(messageData);
        return res.json({ success: true, message: 'Message successfully stored.', messageId });
    } catch (error) {
        logError('Contact Form Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// 3. Visitor telemetry. Server-computed fields take precedence over client-supplied ones.
router.post('/api/log-visit', sameOriginOnly, apiLimiter, async (req, res) => {
    try {
        const body = req.body || {};
        const logData = {
            platform: typeof body.platform === 'string' ? body.platform.slice(0, 128) : null,
            screen: typeof body.screen === 'string' ? body.screen.slice(0, 64) : null,
            ip: req.ip,
            userAgent: (req.get('user-agent') || '').slice(0, 512),
            referrer: (req.get('referer') || 'Direct/Bookmark').slice(0, 512)
        };
        await logVisitor(logData);
        res.json({ success: true, status: 'logged' });
    } catch (error) {
        logError('Logging Error:', error);
        res.status(500).json({ error: 'Log failed' });
    }
});

// --- PAGE ROUTES ---

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

router.get('/:page', (req, res) => {
    const pageMap = {
        'gallery': 'gallery.html',
        'projects': 'projects.html',
        'about': 'about.html',
        'lab': 'lab.html',
        'uses': 'uses.html',
        'contact': 'contact.html'
    };
    const fileName = pageMap[req.params.page];
    if (fileName) {
        res.sendFile(path.join(__dirname, '..', 'public', fileName));
    } else {
        res.status(404).send('404: Page not found');
    }
});

module.exports = router;
