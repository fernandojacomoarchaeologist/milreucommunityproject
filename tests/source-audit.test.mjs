/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 */
import fs from 'node:fs';
const pages=JSON.parse(fs.readFileSync('data/design-source/page-elements.json','utf8')).pages;
if(new Set(pages.map(p=>p.page)).size!==36) throw new Error('Numeração de páginas duplicada ou incompleta');
if(pages.some(p=>!['preserve','adapt','reference-only','do-not-reproduce'].includes(p.decision))) throw new Error('Decisão de página inválida');
if(!pages.some(p=>p.tags.includes('red'))) throw new Error('Assinatura vermelha não mapeada');
if(!pages.some(p=>p.tags.includes('plan'))) throw new Error('Plantas não mapeadas');
if(!pages.some(p=>p.tags.includes('section-opening'))) throw new Error('Aberturas não mapeadas');
console.log('Testes da auditoria visual concluídos.');
