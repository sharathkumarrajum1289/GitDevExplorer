// api.js - GitHub REST Api Integrations
function updateRateLimits(headers) {
    const limit = headers.get('X-RateLimit-Limit');
    const remaining = headers.get('X-RateLimit-Remaining');
    if (limit && remaining) {
        elements.apiRem.textContent = remaining;
        elements.apiLimit.textContent = limit;
        elements.apiDot.className = 'status-dot ' + (remaining > 30 ? 'status-good' : remaining > 10 ? 'status-warning' : 'status-critical');
    }
}

async function searchUser(username) {
    elements.loading.classList.remove('element-hidden');
    elements.dashboard.classList.add('element-hidden');
    elements.error.classList.add('element-hidden');
    elements.btn.disabled = true;

    try {
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        updateRateLimits(userRes.headers);
        if (!userRes.ok) throw new Error(userRes.status === 404 ? 'NOT_FOUND' : 'API_ERROR');
        state.user = await userRes.json();

        const repoRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        updateRateLimits(repoRes.headers);
        state.repos = repoRes.ok ? await repoRes.json() : [];

        calculateLangs();
        renderProfile();
        elements.dashboard.classList.remove('element-hidden');
    } catch (err) {
        elements.error.classList.remove('element-hidden');
        elements.error.innerHTML = `<h4>${err.message === 'NOT_FOUND' ? 'User Not Found' : 'Error'}</h4>
            <p>${err.message === 'NOT_FOUND' ? 'Developer profile does not exist.' : 'Failed to query GitHub API.'}</p>`;
    } finally {
        elements.loading.classList.add('element-hidden');
        elements.btn.disabled = false;
    }
}

function calculateLangs() {
    state.langs = {};
    state.repos.forEach(r => {
        if (r.language) state.langs[r.language] = (state.langs[r.language] || 0) + 1;
    });
}
