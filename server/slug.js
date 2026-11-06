const { Op } = require("sequelize");

function slugify(text) {
  const slug = String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "page";
}

async function uniqueSlug(Model, title, ignoreId) {
  const base = slugify(title);
  let slug = base;
  let n = 2;

  while (true) {
    const where = { slug: slug };
    if (ignoreId) {
      where.id = { [Op.ne]: ignoreId };
    }
    const found = await Model.findOne({ where: where, attributes: ["id"] });
    if (!found) return slug;
    slug = base + "-" + n;
    n += 1;
  }
}

module.exports = { slugify, uniqueSlug };
