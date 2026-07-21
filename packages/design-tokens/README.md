---
title: "Design tokens — utilização"
version: "0.1.0"
status: "active"
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
rights: "Consultar RIGHTS.md na raiz do repositório"
---
# Design tokens

## Fonte de verdade

`tokens.json` é a representação estruturada principal. `tokens.css` é a implementação Web manual desta versão. Alterações devem manter os dois ficheiros sincronizados.

## Camadas

1. **Primitivos:** cores e valores fundamentais.
2. **Semânticos:** função do valor no produto.
3. **Componentes:** valores específicos apenas quando necessários.
4. **Plataformas:** projeções para JavaScript e Flutter.

## Regras

- componentes novos devem consumir tokens semânticos;
- não inserir hexadecimais diretamente fora deste pacote;
- tijolo apenas nos usos autorizados;
- mudanças exigem release;
- projeções de plataforma não substituem a fonte estruturada;
- não incluir ficheiros de fontes no repositório.

## Atualização dos tokens — Pacote 05B (v0.2)

### Estratégia

1. manter os tokens v0.1 durante a comparação;
2. integrar v0.2 em pasta versionada (`v0.2/`);
3. executar testes;
4. listar aliases necessários para componentes existentes;
5. promover v0.2 como fonte principal apenas após revisão;
6. preservar um release ou tag para retorno.

### Mudanças relevantes

- vermelho deixa de ser apenas moldura de tijolo e passa a assinatura explícita;
- superfícies claras são refinadas em branco documental, canvas e linho;
- preto é aquecido;
- tipografia passa a ter papéis formais;
- escala, grelha, movimento e dados passam a ser tokens;
- pátina, sépia e hipótese preservam os estados de certeza;
- mapas e dados ganham namespace separado.

Não remover aliases legados até o Pacote 05D indicar os componentes migrados.
