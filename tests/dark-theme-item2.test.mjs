/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2 — modo escuro (ADR-DS-009): só tokens semânticos, contraste AA, vermelho de assinatura
 * inalterado, arranque antes do CSS, botão acessível e paridade com o pacote de tokens.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const tokens = readFileSync("src/styles/tokens.css", "utf8");
const primitive = name => tokens.match(new RegExp(`--ml-color-${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1];
const darkBlock = tokens.match(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/)[1];
const darkVar = name => darkBlock.match(new RegExp(`--ml-${name}:\\s*var\\(--ml-color-([a-z0-9-]+)\\)`))?.[1];
const lum = hex => { const c = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255).map(v => v <= .03928 ? v/12.92 : ((v+.055)/1.055)**2.4); return .2126*c[0]+.7152*c[1]+.0722*c[2]; };
const ratio = (a,b) => { const [x,y] = [lum(a),lum(b)].sort((m,n)=>n-m); return (x+.05)/(y+.05); };

test("tema escuro activa-se pelo dispositivo ou por escolha e só redefine tokens semânticos", () => {
  assert.match(tokens, /@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)/);
  assert.doesNotMatch(darkBlock, /#[0-9A-Fa-f]{3,8}/, "o bloco escuro referencia primitivos, não hexadecimais");
  assert.doesNotMatch(darkBlock, /--ml-surface-signature/, "o vermelho de assinatura não muda");
  assert.equal(readFileSync("packages/design-tokens/v0.2/tokens.css", "utf8"), tokens, "paridade com o pacote de tokens");
  assert.ok(existsSync("docs/adr/ADR-DS-009-DARK-THEME.md"));
});

test("contraste AA no tema escuro", () => {
  const surfaces = ["surface-canvas","surface-reading","surface-muted","surface-sunken","surface-tint-danger","surface-tint-success"].map(n => primitive(darkVar(n)));
  for (const [name,min] of [["text-primary",7],["text-secondary",4.5],["text-signature",4.5]]) {
    const fg = primitive(darkVar(name));
    for (const bg of surfaces) assert.ok(ratio(fg,bg) >= min, `${name} ${fg} sobre ${bg}: ${ratio(fg,bg).toFixed(2)}`);
  }
});

test("arranque sem flash, botão acessível e sem cores literais claras novas nos componentes", () => {
  const html = readFileSync("index.html", "utf8");
  assert.ok(html.indexOf("src/theme-init.js") < html.indexOf("src/styles/tokens.css"), "theme-init antes do CSS");
  const init = readFileSync("src/theme-init.js", "utf8");
  assert.match(init, /try \{ var v = localStorage\.getItem/);
  const layout = readFileSync("src/components/layout.js", "utf8");
  assert.match(layout, /data-theme-toggle aria-pressed=/);
  assert.match(layout, /stroke="currentColor"/);
  const components = readFileSync("src/styles/components.css", "utf8");
  assert.doesNotMatch(components, /background:#(?:fff|FFF|F7F1E7|f7f1e7)\b/);
});
