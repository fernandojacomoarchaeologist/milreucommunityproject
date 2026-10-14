# Handoff — Item 17 · Modelagem e impressão 3D (Cabeça feminina de Milreu)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> Método comum: [`00_INDEX_E_METODO.md`](00_INDEX_E_METODO.md). Estado vivo: `docs/project/ESTADO_ITENS_1-5_2026-10-01.md`.

**O que é.** Primeiro experimento de impressão 3D do projecto (Circuito Educativo), na **Flashforge Adventurer 5M** do responsável: réplica **interpretativa, assistida por IA**, da Cabeça feminina MNA 994.6.3 (villa de Milreu). Tudo gratuito; ficheiros podem ser públicos.

## 1. Local dos arquivos
`docs/impressao-3d/cabecinha-milreu/` — `README.md` (proveniência + declaração IA), `fonte/` (5 fotografias + `CREDITOS.txt`), `modelo/` (STL de teste 80 mm + GLB original TRELLIS), `previews/`, `source/` (scripts Blender/cliente). Blender 5.2.2 LTS em `~/Applications/Blender.app`.

## 2. Pontos mais importantes
- **Divulgação de IA obrigatória** em peça, ficheiro e qualquer exibição (regra `digital-intervention-disclosure`).
- Medida real **29 × 19,1 × 22,7 cm** (ficha MNA) — o valor «20 cm» de um texto colado estava errado.
- **Licenças:** usar só modelos MIT (TRELLIS / TRELLIS.2 / TripoSG). **Hunyuan3D proibido** (licença exclui a UE). Fotografias só CC0/CC BY, com créditos; CC BY-SA evitada.
- Espaços gratuitos do Hugging Face exigem sessão iniciada (quota ZeroGPU); o responsável gera no browser, Claude processa o GLB.

## 3. Como se estruturou
Fotografias Commons → recorte → TRELLIS «Multiple Images» (`stochastic`) → Blender: escala, remesh voxel 0,15 mm, base plana (corte 5 %), verificação manifold → STL.

## 4. Como se trabalhou ponto a ponto
Ver README §Geração e §Preparação. Vistas de controlo com `render_views.py` antes de qualquer aceitação.

## 5. O que NÃO fazer
- Não apresentar o modelo como réplica fiel/digitalização.
- Não esculpir a trança da nuca «por inferência» sem decisão humana declarada.
- Não usar textos não verificados (poema/citação de Saramago colados) como fonte.
- Não usar a imagem de 4 faces dos Downloads (autoria desconhecida).

## 6. Resultado esperado
STL de teste (80 mm) impresso e avaliado; depois versão grande (escala a decidir).

## 7. Documentos necessários
Fotografias de origem e créditos (`fonte/`), ficha MNA.

## 8. Pendências observadas
- Filamento (PLA mate, tom pedra) por chegar; instalar Orca-Flashforge e configurar a impressora.
- Contacto com o MNA sobre uso educativo da réplica (decisão do responsável).

## 9. Dossiê do modo de trabalhar
Método comum. Licença de cada ferramenta verificada **antes** de usar.

## 10. Onde está cada informação
README do modelo (proveniência, dimensões, impressão) · este handoff · ESTADO (registo incremental).

## 11. Registo incremental (append-only)
- 2026-10-14 · NOVO · Item 17 aberto; objecto e via B (IA) decididos pelo responsável. · responsável
- 2026-10-14 · REMOVIDO · Saídas Hunyuan3D apagadas (licença exclui UE). · esta sessão
- 2026-10-14 · DECISÃO · Medida real 29 cm (ficha MNA), confirmada pelo responsável. · responsável
- 2026-10-14 · NOVO · TRELLIS multi-imagem v1 (`stochastic`) aceite para teste; v2 (`multidiffusion`) rejeitada (caracóis inventados na nuca). STL 80 mm gerado (0 não-manifold). · esta sessão
- 2026-10-14 · NOVO · v3 TRELLIS com imagens 1–5 (`stochastic`) adoptada: nuca com a trança enrolada. STL de teste 80 mm regenerado a partir da v3. · responsável
- 2026-10-14 · DECISÃO · Escala real **29 cm em 2 partes coladas**. · responsável
- 2026-10-14 · NOVO · Parte 1 (rosto/pescoço, 197×206×180 mm, rodada 26°) + Parte 2 (penteado, 197×197×110 mm) + 2 pinos Ø6×19 mm; junta a 180 mm na base dos caracóis; furos Ø6,6×10 mm. Ambas cabem na 5M. 27/12 arestas não-manifold residuais (reparar no slicer). · esta sessão
