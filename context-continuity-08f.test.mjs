/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync,existsSync}from"node:fs";
test("ficheiros de contexto existem",()=>{for(const file of["PROJECT_CONTEXT_LEDGER.md","PACKAGE_DEPENDENCY_MAP.md","CHANGE_SURFACE_REGISTRY.md","CONTEXT_RECOVERY_PROTOCOL.md"])assert.ok(existsSync(file),file);});
test("ledger contém histórico completo",()=>{const text=readFileSync("PROJECT_CONTEXT_LEDGER.md","utf8");for(const code of["01","05F","07D.3","08A","08E","08F"])assert.ok(text.includes(code),code);});
test("protocolo define mínimo necessário",()=>{const text=readFileSync("CONTEXT_RECOVERY_PROTOCOL.md","utf8");assert.match(text,/Conjunto mínimo necessário/);assert.match(text,/ZIP do pacote cumulativo mais recente/);});
