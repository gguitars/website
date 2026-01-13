const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/gallery": "gallery" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // Localization Filter: Usage {{ item.data | localeField('title', locale) }}
  eleventyConfig.addFilter("localeField", function (data, field, locale) {
    if (!data) return "";
    // Return localized field if it exists, otherwise fallback to base field or empty
    const key = `${field}_${locale}`;
    if (data[key] !== undefined) return data[key];
    return data[field] || "";
  });

  // Define collections
  eleventyConfig.addCollection("guitars", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/guitars/*.md").map(item => {
      const folderName = item.fileSlug;
      const assetsModelDir = path.join(process.cwd(), "src/assets/guitars", folderName);

      // Prioritize images defined in frontmatter (for CMS management)
      // Otherwise fall back to automatic folder-based detection
      let images = item.data.images || [];

      // Normalize to strings if they are objects from the CMS (field: image)
      images = images.map(img => typeof img === 'string' ? img : img.image);

      if (images.length === 0 && fs.existsSync(assetsModelDir)) {
        images = fs.readdirSync(assetsModelDir)
          .filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f))
          .map(f => `/assets/guitars/${folderName}/${f}`);
      }

      item.data.slug = folderName;
      item.data.images = images;
      return item;
    }).sort((a, b) => (a.data.order || 50) - (b.data.order || 50));
  });

  eleventyConfig.addCollection("artists", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/artists/*.md");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
