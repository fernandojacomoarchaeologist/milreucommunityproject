/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const portal=readFileSync("src/views/portal.js","utf8"),museum=readFileSync("src/views/museum.js","utf8"),component=readFileSync("src/components/public-content-effects.js","utf8");
test("Portal possui slot orgânico",()=>assert.match(portal,/portal\.home\.after-featured/));
test("Museu possui slot orgânico",()=>assert.match(museum,/museum\.home\.after-opening/));
test("efeitos exigem aprovação, visibilidade e elegibilidade",()=>{
  assert.match(component,/approved|published/);
  assert.match(component,/publication\?\.siteVisible|publication\.siteVisible/);
  assert.match(component,/publicReleaseEligible!==false/);
});
test("efeitos usam no máximo três memórias",()=>assert.match(component,/slice\(0,3\)/));
