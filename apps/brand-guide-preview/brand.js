/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */

const paths=['menu','search','download','share','language','accessibility','info','memory','community','photograph','timeline','map','site','structure','artefact','excavation','reference','dataset','rights','provenance','confidence','exhibition','knowledge'];const functional=new Set(['menu','search','download','share','language','accessibility','info']);const grid=document.querySelector('#iconGrid');for(const name of paths){const cat=functional.has(name)?'functional':'domain';const card=document.createElement('div');card.className='icon-card';card.innerHTML=`<img src="../../assets/icons/${cat}/${name}.svg" alt=""><small>${name}</small>`;grid.append(card);}