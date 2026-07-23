/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from "node:test";import assert from "node:assert/strict";import {existsSync,readFileSync} from "node:fs";
const manifest=JSON.parse(readFileSync("public/data/media-manifest.json","utf8"));
test("31 imagens únicas",()=>assert.equal(manifest.items.length,31));
test("quatro variantes",()=>{for(const x of manifest.items)assert.deepEqual(Object.keys(x.variants).sort(),["card","detail","immersive","thumbnail"])});
test("assets existem",()=>{for(const x of manifest.items){assert.ok(existsSync(x.originalPath));for(const v of Object.values(x.variants))assert.ok(existsSync(v.path))}});
test("sem GPS EXIF",()=>{assert.equal(manifest.items.filter(x=>x.gpsExifDetected).length,0)});
test("duplicado resolvido",()=>assert.equal(existsSync("public/media/museum/originals/MM202612.jpeg"),false));
