/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const model=JSON.parse(readFileSync("public/data/accessibility-audit-model-08j.json","utf8"));
const lines=[
"---","copyright: \"© 2026 Fernando Rodrigues de Jácomo\"","project: \"Projeto Comunitário de Milreu\"","package: \"08J\"","rights: \"Consultar RIGHTS.md no repositório principal\"","---","",
"# Checklist humano de acessibilidade — 08J","",
`**Referencial:** ${model.standard} ${model.target}.`,"",
"> A automação é uma linha de base. Este checklist exige execução e evidência humanas antes da aprovação de produção.","",
"## Viewports","",...model.viewports.map(item=>`- [ ] ${item.width} × ${item.height} — sem scroll horizontal, perda de conteúdo ou sobreposição.`),"",
"## Teclado e foco","",
"- [ ] Percorrer todas as superfícies públicas apenas com teclado.",
"- [ ] Percorrer os 22 módulos com um perfil master e um voluntário.",
"- [ ] Confirmar foco visível, ordem lógica e ausência de armadilhas.",
"- [ ] Confirmar funcionamento do skip link.",
"- [ ] Confirmar saída do modo imersivo com Escape e botões visíveis.","",
"## Leitor de ecrã","",
"- [ ] Home, Museu, detalhe e modo imersivo.",
"- [ ] Login, onboarding, dashboard, tarefas e notificações.",
"- [ ] Formulários, erros, estados, tabelas e diálogos.",
"- [ ] Anotar leitor, sistema operativo, navegador e pessoa responsável.","",
"## Perceção e reflow","",
"- [ ] Contraste de texto, controlos e estados.",
"- [ ] Zoom a 200% e reflow equivalente a 320 CSS px.",
"- [ ] Movimento reduzido.",
"- [ ] Alvos de interação e espaçamento.","",
"## Evidência","",
"- [ ] Data e versão/commit.",
"- [ ] Perfil testado.",
"- [ ] Capturas ou gravação quando necessário.",
"- [ ] Problemas classificados por severidade.",
"- [ ] Reteste após correção.","",
"## Aprovação","",
"- [ ] Revisão humana concluída.",
"- [ ] Sem bloqueios críticos ou altos abertos.",
"- [ ] Aprovação registada por pessoa identificada.",
];
mkdirSync("reports",{recursive:true});
writeFileSync("reports/ACCESSIBILITY_HUMAN_CHECKLIST_08J.md",lines.join("\n")+"\n");
console.log("Checklist humano de acessibilidade gerado.");
