// Applique le thème sauvegardé ou le thème système
function applyTheme(initial = false) {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let theme = saved || (prefersDark ? "dark" : "light");

    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

    const btn = document.getElementById("themeToggle");
    if (btn) {
        btn.textContent = theme === "dark" ? "☀️ Mode clair" : "🌙 Mode sombre";
    }

    if (!initial) {
        localStorage.setItem("theme", theme);
    }
}

function toggleTheme() {
    const current = document.body.classList.contains("dark") ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme();
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    applyTheme(true);

    const btn = document.getElementById("themeToggle");
    if (btn) {
        btn.addEventListener("click", toggleTheme);
    }

    // Titre dynamique
    const titles = [
        "MythicOS APT Repository",
        "Dépôt officiel MythicOS",
        "Mises à jour sécurisées"
    ];
    let i = 0;
    setInterval(() => {
        document.title = titles[i % titles.length];
        i++;
    }, 2500);
});
