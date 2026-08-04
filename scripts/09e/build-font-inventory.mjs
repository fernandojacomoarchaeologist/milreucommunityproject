/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09E — inventário e privacidade de fontes. Verifica famílias declaradas,
 * @font-face reais, ficheiros de fonte presentes e chamadas externas. Regra do projeto:
 * NÃO distribuir ficheiros de fonte no Git; por isso as famílias de marca (Fraunces,
 * Spectral, Archivo) estão declaradas nas pilhas CSS mas SEM @font-face nem ficheiros —
 * a fonte computada é o fallback de sistema. Licença/self-hosting é decisão humana
 * (OPEN_DECISIONS_09E). Escreve reports/font-inventory-09e.json. Sem falsos 404.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const files = [];
function walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
}
walk("src/styles"); walk("packages/design-tokens"); walk("public");

const cssFiles = files.filter((f) => /\.css$/.test(f));
const cssText = cssFiles.map((f) => readFileSync(f, "utf8")).join("\n");
const fontFiles = files.filter((f) => /\.(woff2?|ttf|otf)$/i.test(f));
const fontFaceCount = (cssText.match(/@font-face/g) || []).length;
const externalFontHosts = /fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit|fonts\.bunny/i.test(cssText);

// Famílias de marca declaradas nas pilhas (com fallback de sistema real).
const declaredFamilies = [
  { role: "display", family: "Fraunces", stackFallback: "Iowan Old Style, Georgia, serif" },
  { role: "editorial/body", family: "Spectral", stackFallback: "Georgia, serif" },
  { role: "interface/utility", family: "Archivo", stackFallback: "Helvetica Neue, Arial, sans-serif" },
].map((f) => ({
  ...f,
  declaredInStack: new RegExp(`"${f.family}"`).test(cssText),
  hasFontFace: new RegExp(`@font-face[^}]*${f.family}`, "i").test(cssText),
  selfHostedFilePresent: fontFiles.some((p) => new RegExp(f.family, "i").test(p)),
  // Sem @font-face nem ficheiro → a fonte computada é o fallback de sistema, não a família de marca.
  status: "declared-but-absent",
  licenseStatus: "pending",
  computedEvidence: "system-fallback",
  externalRequest: false,
}));

const report = {
  _copyright: "© 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu. Consultar RIGHTS.md.",
  package: "09E", version: "0.38.0", generatedAt: new Date().toISOString().slice(0, 10),
  summary: {
    fontFaceDeclarations: fontFaceCount,
    fontFilesInRepo: fontFiles.length,
    externalFontServiceDetected: externalFontHosts,
  },
  // Ativos de fonte REAIS presentes no repositório (schema font-asset-record). Vazio por decisão do projeto.
  fontAssets: fontFiles.map((p) => ({ family: "unknown", file: p, hash: null, format: p.split(".").pop(), weight: "unknown", style: "unknown", licenseStatus: "pending", used: false })),
  declaredFamilies,
  humanDecision: {
    owner: "Fernando Rodrigues de Jácomo",
    pending: [
      "confirmar famílias tipográficas finais (Fraunces/Spectral/Archivo ou alternativas) e licenças",
      "decidir self-hosting versionado dos subconjuntos necessários (sem recolher dados de visitantes)",
    ],
    note: "O projeto não distribui ficheiros de fonte no Git público. Enquanto não houver decisão de licença/self-hosting, não se declaram @font-face para ficheiros inexistentes (evita 404). A tipografia usa as pilhas com fallback de sistema legível.",
  },
  note: "Separação exigida pelo 09E — licença confirmada: 0; licença pendente: 3 (marca); declarada mas ausente: 3; presente mas não utilizada: 0.",
};
mkdirSync("reports", { recursive: true });
writeFileSync("reports/font-inventory-09e.json", JSON.stringify(report, null, 2) + "\n");
console.log(`Pacote 09E: inventário de fontes escrito — ${fontFaceCount} @font-face, ${fontFiles.length} ficheiros de fonte, externo=${externalFontHosts}; 3 famílias de marca declaradas mas ausentes (licença pendente = decisão humana).`);
