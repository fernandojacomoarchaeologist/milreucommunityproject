# CSP do site público (Item 2B)

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projeto Comunitário de Milreu.

O GitHub Pages não permite cabeçalhos HTTP próprios, por isso a política vai num `<meta http-equiv="Content-Security-Policy">` no `index.html`, antes de qualquer script.

## Política

| Directiva | Valor | Porquê |
|---|---|---|
| `default-src` | `'self'` | por omissão, só o próprio site |
| `script-src` | `'self' https://cloud.umami.is` | módulos do site + script da estatística (só carregado no domínio público) |
| `style-src` | `'self'` | só as folhas de estilo do site; valores dinâmicos aplicados por CSSOM (`applyDataStyles`), não por atributos `style` |
| `img-src` / `font-src` / `manifest-src` | `'self'` | tudo servido pelo site |
| `connect-src` | `'self'`, `cloud.umami.is`, `gateway.umami.is`, `gateway-eu.umami.is`, `*.supabase.co` | dados do site; envio da estatística; função do formulário «Quero expor» |
| `frame-src` / `worker-src` / `object-src` | `'none'` | não usados |
| `base-uri` / `form-action` | `'self'` | impede `<base>` e envios de formulário para fora |

O `404.html` tem política própria: `default-src 'none'`, e o único script inline (o redireccionamento para a rota `#`) é autorizado **pelo seu hash SHA-256**.

## Limitações conhecidas
- Em `<meta>` **não funcionam** `frame-ancestors` (protecção contra *clickjacking*), `report-uri`/`report-to` nem `sandbox`. Só um proxy ou CDN à frente do GitHub Pages os poderia acrescentar.
- O JSON-LD (`application/ld+json`) é um bloco de dados e não é afectado.
- **Área Colaborativa (inactiva):** em modo Supabase carrega `@supabase/supabase-js` de `https://esm.sh`. A política **não autoriza** esse domínio. Ao activar a área, decidir entre servir a biblioteca a partir do próprio site (recomendado) ou acrescentar `https://esm.sh` ao `script-src`.

## Verificação
- `tests/security-csp-2b.test.mjs` (CI):
  - política presente e restrita;
  - sem scripts nem handlers inline;
  - hash do 404 correcto;
  - nenhuma vista com `style="`.
- `scripts/security/csp-browser-check.mjs` (local, Chrome headless):
  - 22 rotas públicas + Área Colaborativa em demonstração;
  - Umami e Supabase simulados, com pedidos interceptados;
  - controlo negativo, que deve ser bloqueado.
