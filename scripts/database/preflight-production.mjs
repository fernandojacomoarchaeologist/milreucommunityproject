/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { execFileSync } from "node:child_process";
import { assertProductionWriteGate } from "../lib/guards.mjs";

assertProductionWriteGate();

const branch = process.env.GITHUB_REF_NAME || "";
if (branch && branch !== "main") {
  throw new Error(`Branch produtiva inválida: ${branch}`);
}

try {
  const status = execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" });
  if (status.trim()) throw new Error("Working tree não está limpo.");
} catch (error) {
  if (process.env.GITHUB_ACTIONS === "true") throw error;
}

console.log("Preflight produtivo concluído. Nenhuma migration foi aplicada por este script.");
