const fs = require("fs");
const path = require("path");

const BASE_URL = "https://packages.mythicos.hastag.fr";

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            results.push({
                path: fullPath.replace(/\\/g, "/"),
                size: stat.size
            });
        }
    });

    return results;
}

function generate() {
    const files = [];

    // Fichiers racine
    ["index.html", "mythicos.gpg"].forEach(f => {
        if (fs.existsSync(f)) {
            files.push({
                path: f,
                size: fs.statSync(f).size
            });
        }
    });

    // Dossiers APT
    files.push(...walk("dists"));
    files.push(...walk("pool"));

    // --- Génération sitemap.xml ---
    const sitemapEntries = files.map(f => `
    <url>
        <loc>${BASE_URL}/${f.path}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`).join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

    fs.writeFileSync("sitemap.xml", sitemap);
    console.log("✔ sitemap.xml généré");

    // --- Génération index.json ---
    const index = {
        generated: new Date().toISOString(),
        files: files.map(f => ({
            path: f.path,
            url: `${BASE_URL}/${f.path}`,
            size: f.size
        }))
    };

    fs.writeFileSync("index.json", JSON.stringify(index, null, 2));
    console.log("✔ index.json généré");
}

generate();
