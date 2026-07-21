/** © 2026 Fernando Rodrigues de Jácomo — Projeto Comunitário de Milreu. */
import {contrast} from '../scripts/contrast-utils.mjs';
const pairs=[['paper/ink','#FFFCF7','#1E1A17',4.5],['red/white','#A83227','#FFFFFF',4.5],['red deep/white','#7E251C','#FFFFFF',4.5],['black/white','#1E1A17','#FFFFFF',4.5],['patina/paper','#5E7267','#FFFCF7',4.5],['sepia/paper','#8A6A4A','#FFFCF7',4.5]];
let min=Infinity;for(const [name,a,b,req] of pairs){const c=contrast(a,b);min=Math.min(min,c);if(c<req)throw new Error(`${name}: ${c.toFixed(2)} < ${req}`);console.log(`${name}: ${c.toFixed(2)}:1`)}console.log(`contrast.test: ok; mínimo ${min.toFixed(2)}:1`);
