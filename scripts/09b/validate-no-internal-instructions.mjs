/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09B — garante que instruções internas, placeholders e códigos de pacote
 * não aparecem na SUPERFÍCIE PÚBLICA (Portal/Museu, i18n de UI, conteúdo público).
 * Vistas autenticadas de gestão (collaborative-*) estão fora deste âmbito público.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`09B instruções internas: ${m}`); };

// Ficheiros/áreas PÚBLICAS a verificar (exclui vistas autenticadas collaborative-*).
const publicViewFiles = readdirSync("src/views")
  .filter((f) => f.endsWith(".js") && !f.startsWith("collaborative"))
  .map((f) => join("src/views", f));
const targets = ["src/lib/i18n.js", "src/components/layout.js", "public/data/portal-content.json", "public/data/home-carousel.json", "index.html", ...publicViewFiles];

// Padrões de fuga inequívocos em TEXTO visível.
const leakPatterns = [
  { re: /Vers[aã]o\s*0[0-9][A-Z]?/i, label: "código de versão/pacote (ex.: 'Versão 08A')" },
  { re: /\bPacote\s*0[0-9][A-Z]?\b/i, label: "referência a 'Pacote 0X'" },
  { re: /\bTODO\b|\bFIXME\b/, label: "TODO/FIXME" },
  { re: /lorem ipsum/i, label: "lorem ipsum" },
  { re: /\[placeholder\]|texto placeholder|placeholder text/i, label: "placeholder textual exposto" },
  { re: /instru[çc][aã]o para o Claude|prompt do Claude/i, label: "instrução de implementação exposta" },
];

const findings = [];
for (const file of targets) {
  let content;
  try { content = text(file); } catch { continue; }
  for (const { re, label } of leakPatterns) {
    if (re.test(content)) {
      const line = content.split(/\n/).find((l) => re.test(l))?.trim().slice(0, 120);
      findings.push({ file, label, sample: line });
    }
  }
}

if (findings.length) {
  for (const f of findings) console.error(`FUGA: ${f.file} — ${f.label} :: ${f.sample}`);
  fail(`${findings.length} instrução(ões) interna(s)/placeholder na superfície pública.`);
}

console.log(`Pacote 09B: sem instruções internas nem placeholders na superfície pública (${targets.length} ficheiros verificados).`);
