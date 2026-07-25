/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import { writeFile,mkdir } from "node:fs/promises";

const payload={
  from:{name:"Projeto Comunitário de Milreu",email:"noreply@example.invalid"},
  to:[{email:"test@example.invalid",name:"Membro de teste"}],
  subject:"Notificação de teste — Projeto Comunitário de Milreu",
  text:"Esta mensagem valida apenas o contrato do webhook. Nenhum e-mail real deve ser enviado.",
  html:"<!doctype html><html lang=\"pt-PT\"><body><h1>Notificação de teste</h1><p>Contrato 08H.</p></body></html>",
  metadata:{outboxId:"00000000-0000-0000-0000-000000000000",eventType:"task.assigned",attemptNumber:1}
};
await mkdir("releases/notifications",{recursive:true});
await writeFile("releases/notifications/webhook-test-payload.json",JSON.stringify(payload,null,2)+"\n");
console.log("Payload de teste gerado com endereços reservados .invalid.");
