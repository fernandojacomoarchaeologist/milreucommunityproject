/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const dataset=JSON.parse(readFileSync("public/data/structured/museum-dataset.jsonld","utf8"));
test("dataset JSON-LD",()=>{assert.equal(dataset["@context"],"https://schema.org");assert.equal(dataset["@type"],"Dataset");assert.equal(dataset.hasPart.length,30)});
test("sem licença inventada",()=>{for(const item of dataset.hasPart){assert.equal(item["@type"],"Photograph");assert.ok(!("license" in item));assert.ok(!("license" in item.image))}});
