/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
export function luminance(hex){const h=hex.replace('#','');const rgb=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4));return 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2]}
export function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)}
