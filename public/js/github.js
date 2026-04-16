/*
====================================
github.js - Client Side Only
Builds repo cards with textContent to avoid XSS from upstream repo data.
====================================
*/

function safeUrl(url) {
    try {
        const u = new URL(url, window.location.origin);
        if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
    } catch (_) {}
    return '#';
}

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
}

function buildRepoCard(repo) {
    const date = new Date(repo.updated).toLocaleDateString();
    const language = repo.language || 'Plain';
    const stars = repo.stars || 0;
    const description = repo.description || '// No description provided.';

    const card = el('div', 'terminal-box section-fade-in is-visible');

    const h3 = el('h3', null, `$ git remote -v | grep ${repo.name}`);
    const p = el('p', 'repo-summary', description);

    const stats = el('div', 'repo-stats');
    stats.appendChild(el('span', 'tech-tag', language));
    stats.appendChild(el('span', 'tech-tag', `\u2605 ${stars}`));
    stats.appendChild(el('span', 'tech-tag', `UPDT: ${date}`));

    const actions = el('div', 'repo-actions');
    const link = el('a', 'button secondary', 'VIEW SOURCE');
    link.href = safeUrl(repo.url);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    actions.appendChild(link);

    card.append(h3, p, stats, actions);
    return card;
}

async function fetchGithubRepos() {
    const grid = document.getElementById('project-gallery-grid');
    if (!grid) return;

    try {
        const response = await fetch('/api/github-repos');
        if (!response.ok) throw new Error(`Proxy error: ${response.status}`);

        const repos = await response.json();
        grid.textContent = '';

        if (!Array.isArray(repos) || repos.length === 0) {
            const empty = el('p', 'terminal-box', 'No repositories found.');
            grid.appendChild(empty);
            return;
        }

        const frag = document.createDocumentFragment();
        repos.forEach(repo => frag.appendChild(buildRepoCard(repo)));
        grid.appendChild(frag);
    } catch (error) {
        grid.textContent = '';
        const box = el('div', 'terminal-box');
        const p = el('p', 'error', `// ERROR: ${error.message}`);
        box.appendChild(p);
        grid.appendChild(box);
    }
}

document.addEventListener('DOMContentLoaded', fetchGithubRepos);
