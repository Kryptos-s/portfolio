/*
====================================
github.js - Client Side Only
====================================
*/

async function fetchGithubRepos() {
    console.log("GitHub Script: Started."); // Debug Step 1
    
    const grid = document.getElementById('project-gallery-grid');
    if (!grid) {
        console.error("GitHub Script: Error - Could not find element #project-gallery-grid");
        return;
    }

    try {
        console.log("GitHub Script: Fetching from /api/github-repos..."); // Debug Step 2
        
        // Fetch from OUR local server
        const response = await fetch('/api/github-repos'); 
        
        if (!response.ok) {
            throw new Error(`Proxy error: ${response.status}`);
        }

        const repos = await response.json();
        console.log("GitHub Script: Data received:", repos); // Debug Step 3

        // Clear "Loading..." text
        grid.innerHTML = ''; 

        if (repos.length === 0) {
             grid.innerHTML = '<p class="terminal-box">No repositories found.</p>';
             return;
        }

        repos.forEach(repo => {
            const date = new Date(repo.updated).toLocaleDateString();
            const language = repo.language || "Plain";
            const stars = repo.stars || 0;
            const description = repo.description || "// No description provided.";

            const repoCard = `
                <div class="terminal-box section-fade-in" style="opacity: 1;"> <h3>$ git remote -v | grep ${repo.name}</h3>
                    <p class="repo-summary">${description}</p>
                    <div class="repo-stats">
                        <span class="tech-tag">${language}</span>
                        <span class="tech-tag">★ ${stars}</span>
                        <span class="tech-tag">UPDT: ${date}</span>
                    </div>
                    <div style="margin-top:15px;">
                        <a href="${repo.url}" target="_blank" class="button secondary">VIEW SOURCE</a>
                    </div>
                </div>
            `;
            grid.innerHTML += repoCard;
        });
        
        console.log("GitHub Script: DOM updated."); // Debug Step 4

    } catch (error) {
        console.error("GitHub Script Error:", error);
        grid.innerHTML = `<div class="terminal-box"><p class="error" style="color:red">// ERROR: ${error.message}</p></div>`;
    }
}

// Run immediately
document.addEventListener('DOMContentLoaded', fetchGithubRepos);