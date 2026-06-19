// main.js - Event attachments and loader
elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (elements.input.value.trim()) {
        fetchGithubProfile(elements.input.value.trim());
    }
});

window.addEventListener('load', () => {
    fetchGithubProfile('octocat');
});
