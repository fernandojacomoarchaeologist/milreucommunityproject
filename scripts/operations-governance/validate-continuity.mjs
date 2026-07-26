/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";
const model=JSON.parse(readFileSync("public/data/operations-governance-model.json","utf8"));
const rd=JSON.parse(readFileSync("public/data/operations-readiness.json","utf8"));
if(!Array.isArray(model.continuityStatuses)||!model.continuityStatuses.includes("at-risk"))throw new Error("08M continuidade: estados incompletos.");
if(rd.continuity!=="blocked")throw new Error("08M continuidade: deve iniciar bloqueada sem responsáveis reais.");
if(rd.assignedCriticalResponsibilities!==0)throw new Error("08M continuidade: responsabilidades críticas não podem ser inventadas.");
console.log("Continuidade 08M validada: bloqueada, sem responsáveis nem risco de pessoa única inventados.");
