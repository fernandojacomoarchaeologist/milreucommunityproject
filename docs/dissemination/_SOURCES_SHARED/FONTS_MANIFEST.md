# FONTS_MANIFEST — fontes de editoração das peças de disseminação

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu. Consultar `RIGHTS.md`.
> **Política:** os **ficheiros de fonte NÃO são versionados** no repositório (por decisão do projecto e por respeito às licenças). Este manifesto documenta as fontes necessárias para regenerar as peças; quem reproduzir precisa de as ter instaladas em `~/Library/Fonts/` (macOS) ou equivalente.

As peças usam **três famílias** do Design System (tokens v0.2). Os geradores carregam-nas de `~/Library/Fonts/` pelos nomes de ficheiro abaixo.

| Família | Ficheiros esperados | Função (Design System) | Licença conhecida | Origem/referência | Incorporação no PDF | Substituição |
|---|---|---|---|---|---|---|
| **Fraunces** | `Fraunces.ttf`, `Fraunces-Italic.ttf` | Display / títulos | **OFL** (SIL Open Font License) | Google Fonts / github.com/undercasetype/Fraunces | **PENDENTE** (PDFs saem sem fontes incorporadas) | Fallback do gerador: `Iowan Old Style`, Georgia, serif — **apenas** para visualização; **proibido** como substituição final |
| **Spectral** | `Spectral-Regular.ttf`, `Spectral-Medium.ttf`, `Spectral-Italic.ttf` | Leitura / corpo | **OFL** | Google Fonts / Production Type | **PENDENTE** | Fallback: `Iowan Old Style`, Georgia, serif — só visualização; proibido no final |
| **Archivo** | `Archivo.ttf` | Interface / metadados / identificador 2026 | **OFL** | Google Fonts / github.com/Omnibus-Type/Archivo | **PENDENTE** | Fallback: `Helvetica Neue`, Arial, sans-serif — só visualização; proibido no final |

## Notas
- O **identificador «MUSEUS SEM FRONTEIRAS · INICIATIVAS 2026»** usa **Archivo** maiúsculas (não itálico).
- **Incorporação de fontes** nos PDFs de produção é uma **pendência de prepress transversal** — fazer na gráfica/prepress, a par da conversão CMYK com o perfil ICC da gráfica.
- **Só incluir binários de fonte** no repositório se a licença **e** a política do projecto o permitirem explicitamente (decisão humana). Até lá, este manifesto é a fonte-de-verdade.
- Reprodução byte-idêntica dos previews/PNG exige **exactamente** os mesmos ficheiros de fonte (mesma versão) instalados.
