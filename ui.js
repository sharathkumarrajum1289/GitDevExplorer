// ui.js - Dashboard Views renderer
function render() {
    elements.avatar.src = userData.avatar_url;
    elements.name.textContent = userData.name || userData.login;
    elements.username.textContent = `@${userData.login}`;
    elements.bio.textContent = userData.bio || 'Biography empty.';
    elements.link.href = userData.html_url;

    document.getElementById('loc-row').style.display = userData.location ? 'flex' : 'none';
    elements.location.textContent = userData.location || '';

    document.getElementById('web-row').style.display = userData.blog ? 'flex' : 'none';
    elements.blog.href = userData.blog && (userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`);
    elements.blog.textContent = userData.blog || '';

    elements.joined.textContent = new Date(userData.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    elements.reposCount.textContent = userData.public_repos;
    elements.followers.textContent = userData.followers;
    elements.following.textContent = userData.following;

    // Languages
    elements.langsList.innerHTML = '';
    const sorted = Object.entries(calculatedLangs).sort((a,b) => b[1] - a[1]).slice(0, 5);
    const sum = Object.values(calculatedLangs).reduce((a,b) => a+b, 0);
    sorted.forEach(([name, count]) => {
        const pct = Math.round((count / sum) * 100);
        const col = colors[name] || '#94a3b8';
        elements.langsList.innerHTML += `
            <li class="language-stat-item">
                <div class="lang-meta">
                    <span class="lang-label"><span class="lang-dot" style="background-color:${col}"></span>${name}</span>
                    <span class="lang-percentage">${pct}%</span>
                </div>
                <div class="progress-bar-bg"><div class="progress-bar-fill" style="background-color:${col};width:${pct}%"></div></div>
            </li>`;
    });

    // Repos
    elements.reposGrid.innerHTML = '';
    const topRepos = [...userRepos].sort((a,b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
    elements.featuredCount.textContent = `Showing top ${topRepos.length} repos`;
    topRepos.forEach(repo => {
        const col = colors[repo.language] || '#94a3b8';
        elements.reposGrid.innerHTML += `
            <a href="${repo.html_url}" target="_blank" class="repo-card">
                <div>
                    <div class="repo-name">
                        <svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8z"/></svg>
                        <span>${repo.name}</span>
                    </div>
                    <p class="repo-desc">${repo.description || 'No description provided.'}</p>
                </div>
                <div class="repo-footer">
                    <span class="meta-indicator"><span class="lang-dot" style="background-color:${col}"></span>${repo.language || 'HTML'}</span>
                    <span class="meta-indicator">★ ${repo.stargazers_count}</span>
                    <span class="meta-indicator">⑂ ${repo.forks_count}</span>
                </div>
            </a>`;
    });
}
