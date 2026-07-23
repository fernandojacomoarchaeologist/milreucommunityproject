---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07C"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Pacote 07C — Museu Digital Incremental

**Versão:** 0.10.0  
**Tipo:** cumulativo e executável sobre o 07B.

Este pacote aprofunda o Museu sem interromper o Portal e transforma o modo de ecrã inteiro numa experiência museológica mais completa.

## Executar

```bash
npm install
npm run dev
```

Validação:

```bash
npm run museum:index
npm run museum:audit
npm run validate
npm test
npm run build
npm run preview
```

## Entregas do Museu

- página inicial do Museu ampliada;
- pesquisa sobre conteúdo, tags, lugares, créditos e contexto;
- filtros por período, tipo, data e intervenção digital;
- ordenação;
- grelha e lista;
- cinco coleções derivadas para navegação;
- páginas de coleção;
- cronologia com registos datados e não datados;
- detalhe documental;
- fontes, acesso, crédito e proveniência;
- indicação de intervenções digitais;
- relações explícitas;
- sugestões derivadas de palavras-chave, claramente identificadas;
- direitos e ligação para correção ou retirada;
- modo imersivo avançado;
- filmstrip;
- painel de informação;
- navegação anterior e seguinte;
- Escape, setas, I e F;
- Fullscreen API do navegador;
- comportamento responsivo.

## Dados

- 31 registos preservados;
- 30 visíveis;
- `MM202617` bloqueado;
- 124 derivados WebP;
- índice público com 30 registos;
- relatório de auditoria;
- relações não recíprocas registadas, mas não corrigidas automaticamente;
- traduções mantidas conforme os estados existentes.

## Coleções

As coleções são percursos de navegação calculados por tipos, tags ou intervenções declaradas. Elas não criam novas relações históricas.

## Próximo pacote

07D — estrutura multicanal, pré-visualização de totem/painel, exportações e release de encerramento do MVP.
