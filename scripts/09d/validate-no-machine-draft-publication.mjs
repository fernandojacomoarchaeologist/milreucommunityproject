/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09D — impede que rascunhos assistidos por máquina (machine-draft) sejam
 * publicados e que qualquer conteúdo publicado dispense revisão humana. Verifica
 * também os contratos: machine-draft nunca publica, publicação sempre explícita.
 */
import { loadRegistry, read } from "./lib.mjs";

const fail = (m) => { throw new Error(`09D publicação assistida: ${m}`); };

const workflow = read("contracts/09d/translation-workflow-model.json");
if (workflow.machineDraftCanPublish !== false) fail("contrato: machine-draft não pode publicar.");
if (workflow.humanReviewRequired !== true) fail("contrato: revisão humana é obrigatória.");
if (workflow.publicationExplicit !== true) fail("contrato: publicação deve ser explícita.");

const registry = loadRegistry();
for (const unit of registry.content) {
  for (const tr of unit.translations) {
    if (tr.status === "machine-draft" && tr.publishedAt) fail(`machine-draft publicado: ${unit.contentId}/${tr.locale}.`);
    if (tr.status === "published" && tr.machineAssisted && !tr.reviewer) {
      fail(`publicado com assistência de máquina e sem revisão humana: ${unit.contentId}/${tr.locale}.`);
    }
  }
}

console.log("Pacote 09D: nenhum machine-draft publicado; toda a publicação assistida exige revisão humana.");
