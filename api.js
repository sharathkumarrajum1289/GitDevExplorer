// api.js - GitHub API queries
function parseHeaders(headers) {
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    if (limit && remaining) {
        elements.apiRem.textContent = remaining;
        elements.apiLimit.textContent = limit;
        elements.apiDot.className = 'indicator-dot ' + (remaining > 30 ? 'status-good' : remaining > 10 ? 'status-warn' : 'status-danger');
    }
}

async function fetchGithubProfile(username) {
    elements.loading.classList.remove('hidden-element');
    elements.dashboard.classList.add('hidden-element');
    elements.error.classList.add('hidden-element');
    elements.btn.disabled = true;

    try {
        const profileRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
        parseHeaders(profileRes.headers);
        if (!profileRes.ok) throw new Error(profileRes.status === 404 ? 'NOT_FOUND' : 'API_ERROR');
        userData = await profileRes.json();

        const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);
        parseHeaders(reposRes.headers);
        userRepos = reposRes.ok ? await reposRes.json() : [];

        compileLangs();
        render();
        elements.dashboard.classList.remove('hidden-element');
    } catch (err) {
        elements.error.classList.remove('hidden-element');
        elements.error.innerHTML = `<div class="error-text-content">
            <strong>${err.message === 'NOT_FOUND' ? 'Profile Not Found' : 'Error'}</strong>
            <p>${err.message === 'NOT_FOUND' ? 'No user matches that spelling.' : 'Failed to reach GitHub API.'}</p>
        </div>`;
    } finally {
        elements.loading.classList.add('hidden-element');
        elements.btn.disabled = false;
    }
}

function compileLangs() {
    calculatedLangs = {};
    userRepos.forEach(repo => {
        if (repo.language) calculatedLangs[repo.language] = (calculatedLangs[repo.language] || 0) + 1;
    });
}
