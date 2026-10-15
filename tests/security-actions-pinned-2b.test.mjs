/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Item 2B — cadeia de fornecimento: todas as Actions fixadas por SHA completa, com a versão em comentário.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = `${dir}/${name}`;
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.ya?ml$/.test(name)) files.push(path);
  }
})(".github/workflows");

test("todas as Actions usam SHA completa (40 hex) com a versão em comentário", () => {
  let count = 0;
  for (const file of files) {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const match = line.match(/^\s*(?:-\s*)?uses:\s*([^\s#]+)(.*)$/);
      if (!match || match[1].startsWith("./")) continue;
      count++;
      assert.match(match[1], /^[\w.-]+\/[\w./-]+@[0-9a-f]{40}$/, `${file}: ${match[1]}`);
      assert.match(match[2], /#\s*v\d+(\.\d+){0,2}/, `${file}: falta a versão em comentário em ${match[1]}`);
    }
  }
  assert.ok(count > 100, `só ${count} referências encontradas`);
});

test("Dependabot mantém as Actions actualizadas", () => {
  assert.match(readFileSync(".github/dependabot.yml", "utf8"), /package-ecosystem: github-actions/);
});
