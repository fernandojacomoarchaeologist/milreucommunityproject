/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 10C — deriva o snapshot público do modelo de conhecimento a partir de eventuais
 * dados editoriais repo-internos (ausentes no 10C por decisão → snapshot VAZIO) e valida/
 * exporta o crosswalk CIDOC (interoperabilidade parcial, não certificada). Não lê documentos,
 * não gera afirmações, não faz OCR/embeddings/RAG. A aplicação a fontes reais é o 10C.1.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { derivePublicKnowledge } from "../../src/proteus/knowledge-model.mjs";
import { exportCidocMappings } from "../../src/proteus/cidoc-mapping.mjs";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const EDITORIAL = "data/proteus/knowledge-assertions.json"; // repo-interno; ausente no 10C.

const editorial = existsSync(EDITORIAL) ? read(EDITORIAL) : { assertions: [], entities: [], relations: [] };
const derived = derivePublicKnowledge(editorial);

const current = read("public/data/proteus-knowledge-public.json");
const snapshot = {
  ...current,
  generatedAt: new Date().toISOString().slice(0, 10),
  assertions: derived.assertions,
  entities: derived.entities,
  relations: derived.relations,
};
writeFileSync("public/data/proteus-knowledge-public.json", JSON.stringify(snapshot, null, 2) + "\n");

// Exportação CIDOC validada (lança se algum mapeamento for inválido).
const crosswalk = read("data/proteus/cidoc-mappings.json");
const exported = exportCidocMappings(crosswalk.mappings);
if (!existsSync("reports")) mkdirSync("reports");
writeFileSync("reports/cidoc-crosswalk-10c.json", JSON.stringify(exported, null, 2) + "\n");

console.log(`Pacote 10C: snapshot público derivado — ${snapshot.assertions.length} afirmações, ${snapshot.entities.length} entidades, ${snapshot.relations.length} relações (vazio e honesto no 10C). Crosswalk CIDOC exportado e validado — ${exported.mappings.length} mapeamentos 'draft' (conformância parcial, não certificada).`);
