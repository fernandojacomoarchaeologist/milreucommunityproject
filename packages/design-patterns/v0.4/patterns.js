/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

window.MilreuPatterns=(()=>{
 function enhance(root=document){MilreuComponents?.enhance(root);root.querySelectorAll('[data-immersive-open]').forEach(button=>button.addEventListener('click',()=>{const target=document.getElementById(button.dataset.immersiveOpen);target?.setAttribute('data-active','true');target?.focus();}));root.querySelectorAll('[data-immersive-close]').forEach(button=>button.addEventListener('click',()=>button.closest('[data-active]')?.removeAttribute('data-active')));}
 return {enhance};
})();
