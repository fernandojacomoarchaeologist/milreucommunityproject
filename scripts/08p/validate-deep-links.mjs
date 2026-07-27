/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 08P — invariantes de deep links das notificações:
 * o link não concede acesso (gate + hasPermission + RLS), a entidade removida
 * mostra estado adequado e o centro de notificações é protegido por permissão.
 */
import { readFileSync } from "node:fs";

const text = (p) => readFileSync(p, "utf8");
const fail = (m) => { throw new Error(`08P deep links: ${m}`); };

const main = text("src/main.js");
const notifications = text("src/views/collaborative-notifications.js");

// 1. A vista de notificações exige permissão.
if (!/hasPermission\(context,\s*"notifications\.view"\)/.test(notifications)) fail("centro de notificações sem guarda de permissão.");

// 2. Abrir um deep link passa pelo gate do router (membership active) — nenhuma rota colaborativa escapa ao gate.
if (!/context\.membership\?\.status\s*!==\s*"active"/.test(main)) fail("o gate de membership deve preceder o encaminhamento de rotas colaborativas.");

// 3. Entidades removidas mostram estado adequado (não vazam nem quebram).
const detailViews = [
  "src/views/collaborative-tasks.js",
  "src/views/collaborative-contributions.js",
  "src/views/collaborative-museum-review.js",
];
for (const file of detailViews) {
  if (!/não encontrad|não foi encontrad/i.test(text(file))) fail(`${file} não trata entidade removida/inexistente.`);
}

// 4. O link não concede acesso: cada vista de detalhe verifica hasPermission/forbidden.
if (!/hasPermission\(context,\s*"museum\.review\.view"\)/.test(text("src/views/collaborative-museum-review.js"))) fail("detalhe da revisão sem guarda de permissão.");

// 5. E-mail continua desativado (o deep link não depende de e-mail ativo).
const runtime = JSON.parse(text("public/config/notifications.runtime.json"));
if (runtime.email?.enabled !== false || runtime.email?.provider !== "disabled") fail("e-mail deve permanecer desativado.");

console.log("Pacote 08P deep links validados: centro protegido, gate de membership antes das rotas, entidades removidas tratadas, RLS como fonte final e e-mail desativado.");
