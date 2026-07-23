---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "07A"
rights: "Consultar RIGHTS.md; imagens e conteúdos mantêm créditos e condições das respetivas fontes."
---

# Relatório de validação

- Validação estrutural: sucesso
- Testes Node: 14/14 aprovados
- Sintaxe JavaScript: validada
- Build: gerado e testado com sucesso
- Smoke HTTP sobre o build: concluído
- Diretório `dist/`: omitido do ZIP para não duplicar todos os assets; é recriado por `npm run build`
- Registos: 31
- Imagens únicas: 31
- Registos visíveis: 30
- Registos bloqueados: 1 (`MM202617`)
- Derivados WebP: 124
- Duplicado `MM202612.jpeg`: removido
- Hero legado com extensão incorreta: excluído
- GPS EXIF: nenhum detetado
- Supabase remoto: não utilizado
- PDF do livro: não incluído

## Comandos executados

```bash
npm run validate
npm test
npm run build
npm run smoke
```

Todos concluídos com sucesso.
