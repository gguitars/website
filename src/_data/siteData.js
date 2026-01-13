const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

function getGalleries() {
    const assetsDir = path.join(__dirname, "../../src/assets");

    // Workshop gallery - shuffle
    const miscDir = path.join(assetsDir, "misc");
    let workshop = [];
    if (fs.existsSync(miscDir)) {
        workshop = fs.readdirSync(miscDir)
            .filter(f => (f.startsWith("giungi") || f.startsWith("workshop")) && /\.(jpe?g|png|webp|avif)$/i.test(f))
            .map(f => `/assets/misc/${f}`);

        // Shuffle
        for (let i = workshop.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [workshop[i], workshop[j]] = [workshop[j], workshop[i]];
        }
    }

    // Hero gallery - ALL images from ALL model folders, shuffled
    const guitarsDir = path.join(assetsDir, "guitars");
    let hero = [];
    if (fs.existsSync(guitarsDir)) {
        const models = fs.readdirSync(guitarsDir).filter(d => {
            const modelPath = path.join(guitarsDir, d);
            return fs.statSync(modelPath).isDirectory() && d !== 'misc';
        });
        models.forEach(model => {
            const modelPath = path.join(guitarsDir, model);
            const imgs = fs.readdirSync(modelPath).filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f));
            imgs.forEach(img => {
                hero.push(`/assets/guitars/${model}/${img}`);
            });
        });
        // Shuffle
        for (let i = hero.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [hero[i], hero[j]] = [hero[j], hero[i]];
        }
    }

    return { hero, workshop };
}

function getPages() {
    const pagesDir = path.join(__dirname, `../content/pages`);
    if (!fs.existsSync(pagesDir)) return {};

    const files = fs.readdirSync(pagesDir).filter(f => f.endsWith(".md"));
    const pagesData = {};

    files.forEach(file => {
        const pageName = path.basename(file, ".md");
        const raw = fs.readFileSync(path.join(pagesDir, file), "utf-8");
        const { data } = matter(raw);
        pagesData[pageName] = data;
    });

    return pagesData;
}

module.exports = function () {
    return {
        pages: getPages(),
        galleries: getGalleries()
    };
};
