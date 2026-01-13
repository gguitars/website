const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

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
        pages: getPages()
    };
};
