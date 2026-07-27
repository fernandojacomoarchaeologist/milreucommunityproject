/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const model=JSON.parse(readFileSync("public/data/collaborative-contribution-model.json","utf8"));
test("limite de ficheiro é 10 MB no modelo",()=>{const l=model.limits?.maxFileSizeBytes??model.maxFileSizeBytes;assert.equal(l,10485760);});
test("UI de contributos mostra 10 MB",()=>{const pub=readFileSync("src/views/contributions-public.js","utf8");const collab=readFileSync("src/views/collaborative-contributions.js","utf8");assert.ok(pub.includes("10 MB"));assert.ok(collab.includes("10 MB"));assert.ok(!pub.includes("25 MB"));});
test("cliente valida tamanho antes de submeter",()=>{const main=readFileSync("src/main.js","utf8");assert.ok(main.includes("maxFileSizeBytes")||main.includes("10485760"));assert.ok(main.includes("excede o limite de 10 MB"));});
test("nova migration aperta a constraint CHECK para 10 MB (sem editar aplicadas)",()=>{const mig=readFileSync("supabase/migrations/20260726110000_contributions_file_limit_10mb.sql","utf8");assert.ok(mig.includes("10485760"));assert.ok(mig.includes("collab_contribution_files_size_check"));assert.ok(!/\b(drop\s+table|truncate|delete\s+from)\b/i.test(mig));});
test("whitelist de tipos existente é preservada (não inventada)",()=>{const pub=readFileSync("src/views/contributions-public.js","utf8");assert.ok(pub.includes('accept=".jpg'));});
