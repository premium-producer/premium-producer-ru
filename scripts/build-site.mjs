import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const pagesDir = path.join(root, "src/pages");
const assetsDir = path.join(root, "src/assets");
const publicDir = path.join(root, "public");
const productsDir = path.join(root, "src/products");
const staticDir = path.join(root, "src/static");
const productPlaceholder = "<!-- Product cards are generated from src/products/*/product.json during npm run build. -->";
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);

await rm(distDir, { force: true, recursive: true });
await mkdir(distDir, { recursive: true });

const products = await readProducts(productsDir);

await copyIfExists(staticDir, distDir);
await copyIfExists(publicDir, path.join(distDir, "public"));
await copyIfExists(assetsDir, path.join(distDir, "assets"));
await copyProductAssets(products, path.join(distDir, "products"));
await buildPages(pagesDir, distDir, products);

async function copyIfExists(from, to) {
  try {
    await cp(from, to, { recursive: true });
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

async function buildPages(from, to, products) {
  const entries = await readdir(from, { withFileTypes: true });

  await mkdir(to, { recursive: true });

  for (const entry of entries) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await buildPages(source, target, products);
      continue;
    }

    if (entry.name.endsWith(".html")) {
      const relativePagePath = path.relative(pagesDir, source);
      const depth = relativePagePath.split(path.sep).length - 1;
      const assetPrefix = depth === 0 ? "." : "..";
      const html = await readFile(source, "utf8");
      await writeFile(target, renderProductGrid(html, products, assetPrefix));
      continue;
    }

    await cp(source, target);
  }
}

async function readProducts(from) {
  let entries = [];

  try {
    entries = await readdir(from, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const products = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    if (!entry.isDirectory()) {
      continue;
    }

    const slug = entry.name;
    const productDir = path.join(from, slug);
    const productFile = path.join(productDir, "product.json");

    try {
      const product = JSON.parse(await readFile(productFile, "utf8"));
      const assets = await readProductAssets(path.join(productDir, "assets"));
      const visualAsset = product.visual?.asset;

      products.push({
        ...product,
        visual: {
          ...(product.visual || {}),
          asset: visualAsset || assets[0],
        },
        detailAssets: createDetailAssets(visualAsset || assets[0], assets),
        slug,
        sourceDir: productDir,
      });
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw new Error(`Invalid product data in ${productFile}: ${error.message}`);
      }
    }
  }

  return products.sort((a, b) => {
    const orderDelta = Number(a.order || 0) - Number(b.order || 0);
    return orderDelta || String(a.code).localeCompare(String(b.code));
  });
}

async function readProductAssets(from, relativeFrom = "") {
  let entries = [];

  try {
    entries = await readdir(from, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...await readProductAssets(path.join(from, entry.name), path.join(relativeFrom, entry.name)));
      continue;
    }

    if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(path.join("assets", relativeFrom, entry.name).replaceAll(path.sep, "/"));
    }
  }

  return files
    .sort((a, b) => a.localeCompare(b));
}

function createDetailAssets(primaryAsset, assets) {
  return [primaryAsset, ...assets]
    .filter(Boolean)
    .filter((asset, index, list) => list.indexOf(asset) === index);
}

async function copyProductAssets(products, to) {
  for (const product of products) {
    const sourceAssets = path.join(product.sourceDir, "assets");
    const targetAssets = path.join(to, product.slug, "assets");
    await copyIfExists(sourceAssets, targetAssets);
  }
}

function renderProductGrid(html, products, assetPrefix) {
  if (!html.includes(productPlaceholder)) {
    return html;
  }

  const cards = products.map((product) => renderProductCard(product, assetPrefix)).join("\n\n        ");
  return html.replace(productPlaceholder, cards);
}

function renderProductCard(product, assetPrefix) {
  const anchor = product.anchor ? ` id="${escapeAttribute(product.anchor)}"` : "";
  const visual = product.visual || {};
  const visualClass = visual.type === "image"
    ? ["visual-project", visual.className].filter(Boolean).join(" ")
    : visual.className;
  const visualBody = visual.type === "image"
    ? `<img src="${assetPrefix}/products/${escapeAttribute(product.slug)}/${escapeAttribute(visual.asset)}" alt="" loading="eager" />`
    : "<span></span>";

  return `<article class="work-card"${anchor} data-product-slug="${escapeAttribute(product.slug)}" data-detail-assets="${escapeAttribute(JSON.stringify(product.detailAssets || []))}" data-detail-visual-class="${escapeAttribute(visualClass || "")}">
          <a class="work-visual ${escapeAttribute(visualClass)}" href="mailto:hello@premium-producer.ru" aria-label="Project ${escapeAttribute(product.code)}">
            ${visualBody}
          </a>
          <p class="work-code">${escapeHtml(product.code)}</p>
          <h2>${escapeHtml(product.title)}</h2>
        </article>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
