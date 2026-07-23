/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { readFileSync } from "node:fs";
const config = JSON.parse(readFileSync("public/data/channels/channel-config.json","utf8"));
const qr = JSON.parse(readFileSync("public/data/channels/qr-targets.json","utf8"));
console.log(JSON.stringify({
  publicBaseUrl:config.publicBaseUrl,
  status:qr.status,
  targets:qr.targets.length,
  generated:config.qr.finalCodesGenerated
},null,2));
if (!process.env.MILREU_PUBLIC_BASE_URL) {
  console.log("QR final pendente: definir MILREU_PUBLIC_BASE_URL após escolher o domínio público.");
}
