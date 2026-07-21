/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Projeto Comunitário de Milreu.
 */
const colors = [
  ['Papel de leitura','#FFFFFF'],['Canvas quente','#FFFCF7'],['Linho','#F7F1E7'],
  ['Tinta aquecida','#1E1A17'],['Vermelho assinatura','#A83227'],['Vermelho profundo','#7E251C'],
  ['Pátina','#5E7267'],['Sépia','#8A6A4A'],['Hipótese','#6F6456']
];
const spaces = [['1','4'],['2','8'],['3','12'],['4','16'],['6','24'],['8','32'],['12','48'],['16','64'],['24','96'],['32','128']];
const data = [['Água / informação','#315D6D'],['Vegetação / positivo','#2F6B4F'],['Via / atenção','#8B6A1F'],['Histórico','#74546A'],['Estrutura','#7A5B3A'],['Neutro','#8D8170']];

const swatches=document.querySelector('#swatches');
colors.forEach(([name,value])=>{const el=document.createElement('div');el.className='swatch';el.innerHTML=`<div class="swatch-color" style="background:${value}"></div><strong>${name}</strong><code>${value}</code>`;swatches.append(el)});
const spacing=document.querySelector('#spacing');
spaces.forEach(([token,px])=>{const el=document.createElement('div');el.className='space-row';el.innerHTML=`<code>space.${token}</code><div class="space-bar" style="width:min(100%,${px*4}px)"></div><span>${px}px</span>`;spacing.append(el)});
const palette=document.querySelector('#dataPalette');
data.forEach(([name,value])=>{const el=document.createElement('div');el.className='data-chip';el.style.background=value;el.textContent=name;palette.append(el)});
document.querySelector('#motionTrigger').addEventListener('click',()=>document.querySelector('#motionTarget').classList.toggle('active'));
