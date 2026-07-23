/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md no repositório principal.
 */
import { writeFile } from "node:fs/promises";

const timestamp = new Date().toISOString();
const content = `# Índice de capturas

Gerado em: ${timestamp}

| Ecrã | Desktop | Tablet | Mobile | Estado |
|---|---|---|---|---|
| Design Guide — início | pending | pending | pending | not-reviewed |
| Fundações | pending | pending | pending | not-reviewed |
| Componentes críticos | pending | pending | pending | not-reviewed |
| Padrões críticos | pending | pending | pending | not-reviewed |
`;

await writeFile("docs/design/visual-reviews/SCREENSHOT_INDEX.md", content);
console.log("Índice do Gate A atualizado.");
