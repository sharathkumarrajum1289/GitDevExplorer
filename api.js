// api.js - GitHub API queries

// Declare global data states explicitly to prevent strict-mode crashes
let userData = {};
let userRepos = [];
let calculatedLangs = {};

function parseHeaders(headers) {
    // Defensive check: verify headers exist before reading them
    if (!headers || typeof headers.get !== 'function') return;

    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    
    if (limit && remaining && elements.apiRem && elements.apiLimit && elements.apiDot) {
        elements.apiRem.textContent = remaining;
        elements.apiLimit.textContent = limit;
        
        const remNum = parseInt(remaining, 10);
        elements.apiDot.className = 'indicator-dot ' + 
            (remNum > 30 ? 'status-good' : remNum > 10 ? 'status-warn' : 'status-danger');
    }
}

async function fetchGithubProfile(username) {
    // UI Visual states handling safely
    if (elements.loading) elements.loading.classList.remove('hidden-element');
    if (elements.dashboard) elements.dashboard.classList.add('hidden-element');
    if (elements.error) elements.error.classList.add('hidden-element');
    if (elements.btn) elements.btn.disabled = true;

    try {
        // Fetch User Profile Data
        const profileRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
        parseHeaders(profileRes.headers);
        
        if (!profileRes.ok) {
            if (profileRes.status === 404) throw new Error('NOT_FOUND');
            if (profileRes.status === 403) throw new Error('RATE_LIMITED');
            throw new Error('API_ERROR');
        }
        userData = await profileRes.json();

        // Fetch User Repositories Data
        const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);
        parseHeaders(reposRes.headers);
        userRepos = reposRes.ok ? await reposRes.json() : [];

        // Compile logic and update views
        compileLangs();
        
        if (typeof render === 'function') {
            render();
        }
        
        if (elements.dashboard) elements.dashboard.classList.remove('hidden-element');
    } catch (err) {
        if (elements.error) {
            elements.error.classList.remove('hidden-element');
            
            let title = 'Error';
            let message = 'Failed to reach GitHub API.';
            
            if (err.message === 'NOT_FOUND') {
                title = 'Profile Not Found';
                message = 'No user matches that spelling.';
            } else if (err.message === 'RATE_LIMITED') {
                title = 'Rate Limit Exceeded';
                message = 'GitHub API limit reached for your IP. Please try again in an hour.';
            }

            elements.error.innerHTML = `
                <div class="error-text-content">
                    <strong>${title}</strong>
                    <p>${message}</p>
                </div>`;
        }
    } finally {
        // Always reset UI elements back to operational state
        if (elements.loading) elements.loading.classList.add('hidden-element');
        if (elements.btn) elements.btn.disabled = false;
    }
}

function compileLangs() {
    calculatedLangs = {};
    if (!Array.isArray(userRepos)) return;
    
    userRepos.forEach(repo => {
        if (repo && repo.language) {
            calculatedLangs[repo.language] = (calculatedLangs[repo.language] || 0) + 1;
        }
    });
}
