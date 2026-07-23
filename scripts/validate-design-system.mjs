/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Lightweight validation for Package 02.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const required = [
  "docs/design/DESIGN_SYSTEM_SCOPE.md",
  "docs/design/TWO_VOICES.md",
  "docs/design/COMPONENT_REGISTRY.md",
  "packages/design-tokens/tokens.json",
  "packages/design-tokens/tokens.css",
  "packages/ui-core/components.css",
  "apps/design-guide/index.html",
  "apps/design-guide/guide.js"
];
const errors = [];
const warnings = [];

for (const relative of required) {
  if (!fs.existsSync(path.join(root, relative))) errors.push(`Missing required file: ${relative}`);
}

const jsonPath = path.join(root, "packages/design-tokens/tokens.json");
if (fs.existsSync(jsonPath)) {
  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const requiredColours = ["paper","paperDeep","ink","inkSoft","sepia","stone","silver","patina","brick","brickDeep"];
    for (const key of requiredColours) {
      if (!data?.color?.primitive?.[key]?.$value) errors.push(`Missing colour token: ${key}`);
    }
  } catch (error) {
    errors.push(`Invalid tokens.json: ${error.message}`);
  }
}

const mdFiles = [];
function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".md")) mdFiles.push(full);
  }
}
walk(root);
for (const file of mdFiles) {
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes("© 2026 Fernando Rodrigues de Jácomo")) errors.push(`Missing copyright in ${path.relative(root,file)}`);
}

const componentCssPath = path.join(root, "packages/ui-core/components.css");
if (fs.existsSync(componentCssPath)) {
  const css = fs.readFileSync(componentCssPath, "utf8");
  const rawHex = [...css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(match => match[0]);
  if (rawHex.length) errors.push(`Raw hex values found in components.css: ${[...new Set(rawHex)].join(", ")}`);
}

const guideHtml = path.join(root, "apps/design-guide/index.html");
if (fs.existsSync(guideHtml)) {
  const html = fs.readFileSync(guideHtml, "utf8");
  if (!html.includes("Placeholder")) warnings.push("Guide may not visibly identify demonstration placeholders.");
  if (!html.includes("lang=\"pt-PT\"")) errors.push("Guide root language is not pt-PT.");
}

if (warnings.length) {
  console.warn("Design system warnings:");
  warnings.forEach(item => console.warn(`- ${item}`));
}
if (errors.length) {
  console.error("Design system validation failed:");
  errors.forEach(item => console.error(`- ${item}`));
  process.exit(1);
}
console.log(`Design system validation passed (${mdFiles.length} Markdown files checked).`);
