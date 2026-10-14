# Cabeça feminina de Milreu (MNA 994.6.3) — modelo 3D interpretativo para impressão

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> A atribuição acima cobre o tratamento e os scripts; **não** transfere direitos das fotografias de origem (ver créditos).

**Item 17 · Circuito Educativo · Estado: `preliminar` / experimento de impressão.**

## ⚠️ Declaração de intervenção por IA (obrigatória em qualquer uso)

Este modelo **não é uma digitalização da peça**. Foi gerado por inteligência artificial (TRELLIS, imagem→3D) a partir de fotografias publicadas, e **as zonas não visíveis ou pouco visíveis foram inventadas/suavizadas pela IA**. Não equivale ao original nem serve como documento arqueológico.

Texto a acompanhar a peça impressa e os ficheiros:

> «Modelo interpretativo assistido por IA, gerado a partir de fotografias da Cabeça feminina (MNA 994.6.3, villa romana de Milreu). Não reproduz fielmente o original. Original: Museu Nacional de Arqueologia.»

Versões geradas (2026-10-14):
- **v1** (4 imagens, `stochastic`): nuca lisa, sem a trança — superada (`trellis_saida_original.glb`).
- **v2** (`multidiffusion`): **rejeitada** — caracóis inexistentes na nuca (`previews/rejeitado_multidiffusion_4vistas.png`).
- **v3** (5 imagens, `stochastic`) — **versão adoptada** (`trellis_saida_v3_5imagens.glb`, ~34 mil faces): a nuca mostra o volume da trança enrolada em laço.

Divergências conhecidas da v3 face às fotografias:
- **Rosto e caracóis suavizados**; feições pouco nítidas; incisões em espinha da trança ausentes.
- Forma da trança aproximada pela IA, não medida.

## A peça

Ficha do inventário (consulta 2026-10-14, raiz.museusemonumentos.pt, `DetalhesObra?id=110198`): **Cabeça feminina**, n.º inv. **994.6.3**, Museu Nacional de Arqueologia; **29 × 19,1 × 22,7 cm**; proveniente da villa romana de Milreu, antiga colecção de Estácio da Veiga.

## Fontes (Wikimedia Commons, `Category:Cabeça feminina (MNA 994.6.3)`)

| Ficheiro em `fonte/` | Vista | Autor | Licença |
|---|---|---|---|
| `1_frente_MikeSteele_CC-BY-2.0.jpg` | frente | Mike Steele | CC BY 2.0 |
| `2_tres-quartos-dir_MNA_CC0.jpg` | ¾ direita | Museu Nacional de Arqueologia | CC0 |
| `3_tres-quartos-esq_Felicisimo_CC-BY-2.0.jpg` | ¾ esquerda | Ángel M. Felicísimo | CC BY 2.0 |
| `4_tras_MNA_CC0.jpg` | trás | Museu Nacional de Arqueologia | CC0 |
| `5_frente-alt_Sailko_CC-BY-3.0.jpg` | frente (alt.) | Sailko | CC BY 3.0 |

Imagens recortadas à cabeça e reduzidas a 1024 px (alteração declarada). Excluída por licença: Carole Raddato (CC BY-SA 2.0). **Hunyuan3D** foi testado e **abandonado**: a licença Tencent exclui a União Europeia.

## Geração

- Ferramenta: espaço público `trellis-community/TRELLIS` (Hugging Face), modelo **TRELLIS** (Microsoft, **MIT**), separador «Multiple Images», algoritmo `stochastic`, executado pelo responsável com conta própria em 2026-10-14.
- Imagens usadas na v3: **1 a 5** (confirmado pelo responsável).
- Saída adoptada: `modelo/trellis_saida_v3_5imagens.glb` (sha256 `8146947f…5159`).

## Preparação para impressão (Blender 5.2.2 LTS, `source/prep_print.py`)

Escala para altura alvo → remesh por voxel 0,15 mm (malha estanque) → corte plano da base a 5 % (remove a haste do suporte do museu copiada pela IA) → redução → verificação (0 arestas não-manifold) → STL em mm.

| Ficheiro | Escala | Dimensões na mesa | Notas |
|---|---|---|---|
| `modelo/cabecinha_milreu_IA_interpretativo_teste_80mm.stl` | ≈ 1:3,6 (teste) | 52 × 59 × 76 mm | v3; sha256 `51d61efc…` |
| `modelo/cabecinha_milreu_IA_29cm_parte1_rosto_pescoco.stl` | **1:1 (29 cm)** | 197 × 206 × 180 mm | pescoço na mesa, rodada 26° em Z para caber; sha256 `8c9db3d7…` |
| `modelo/cabecinha_milreu_IA_29cm_parte2_penteado.stl` | **1:1** | 197 × 197 × 110 mm | face de junta na mesa; sha256 `6db7c8f0…` |
| `modelo/pinos_alinhamento_2x_D6x19mm.stl` | — | 2 × Ø6 × 19 mm | pinos de encaixe; sha256 `dae87134…` |

**Escala real (decisão do responsável, 2026-10-14):** 290 mm de altura (ficha MNA) em **2 partes coladas**. Junta horizontal a 180 mm, na base dos caracóis (evita cortar o rosto). Em cada face de junta, 2 furos Ø6,6 × 10 mm para os pinos Ø6 × 19 mm (folga 0,3 mm). Ambas as partes cabem na Adventurer 5M (220 × 220 × 220 mm). Gerado com `source/prep_split.py` + `source/fit_bed.py` + `source/pin.py`. Após exportação restam 27 e 12 arestas não-manifold (imprecisão numérica em malhas de ~200 mil faces) — a confirmar/reparar no slicer.

**Montagem:** testar o encaixe a seco com os pinos; colar com cola de cianoacrilato (ou epóxi) nas faces de junta e nos pinos; alinhar e pressionar. Disfarce da junta (massa + lixa + pintura) só se decidido — é intervenção adicional a declarar.

## Impressão (recomendação, não testada)

Adventurer 5M · **PLA mate 1,75 mm, tom pedra**, as duas partes da **mesma bobina/lote** · camada 0,16–0,2 mm (escala real) / 0,12 mm (teste) · 3 perímetros · enchimento 8–12 % (gyroid) · suportes em árvore só sob queixo/orelhas/nariz · pinos a 100 % de enchimento. Estimativa grosseira para 29 cm: **0,7–1 kg** de filamento e várias dezenas de horas — valor real a obter no slicer (Orca-Flashforge, gratuito).

## Scripts (`source/`)

`prep_print.py` (teste numa peça), `prep_split.py` (escala real + divisão + furos), `fit_bed.py` (rotação para caber na mesa), `pin.py` (pinos), `render_views.py` + `montage.py` (vistas de controlo), `decimate.py` (redução), `trellis_client.py` (cliente do espaço TRELLIS; anónimo falha por quota ZeroGPU).
