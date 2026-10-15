# Privacidade do formulário «Quero expor» — proposta para validação

> © 2026 Fernando Rodrigues de Jácomo. Produzido no âmbito do Projecto Comunitário de Milreu.

**Estado:** `PROPOSTA — REQUER VALIDAÇÃO HUMANA E DO ENCARREGADO DE PROTECÇÃO DE DADOS`. **Não é política definitiva** e não deve ser publicada como tal.
**Pedido:** responsável do projecto, 2026-10-15 (Item 2, pacote B).
**Regra seguida:** partir dos textos já aprovados (inquéritos 2025/2026 e mapeamento RGPD) e não inventar uma política nova.

## 1. Fontes consultadas (histórico aprovado)

| Fonte | Data | O que estabelece |
|---|---|---|
| «Política de Privacidade do Inquérito» (UAlg) | 2025-09 | Responsável: **Universidade do Algarve** (Campus da Penha, Faro). Estudo «Milreu Community Project», responsável pelo estudo Fernando Rodrigues de Jácomo (doutoramento UAlg). Base: **consentimento**. Contactos: investigador **a78190@ualg.pt**; **Encarregado da Protecção de Dados da UAlg: rgpd@ualg.pt**. Direitos (acesso, rectificação, oposição, limitação, apagamento, retirar consentimento) e reclamação à **CNPD** (www.cnpd.pt). Remete para a Política de Protecção de Dados em www.ualg.pt |
| Inquérito 2025 (SurveyMonkey 419871841) | 2025 | Participação voluntária; **não recolhe nome, e-mail nem telefone**; dados anónimos |
| Inquérito 2026 (SurveyMonkey 526396753) | 2026-03 | Mesmo modelo: UAlg, rgpd@ualg.pt, CNPD, política do SurveyMonkey; **sem nome, e-mail nem telefone** |
| «Mapeamento de Dados RGPD (completo)» | 2025-09 | Por actividade: base jurídica, destinatário, transferências, prazos. Contactos de voluntariado (telefone, e-mail): consentimento informado; destinatário o investigador; conservação **até 5 anos após o fim do projecto (2033)**. IP dos inquéritos: interesse legítimo (art. 6.º, n.º 1, al. f)). O «Quero expor» **não consta** |
| Site publicado (`#/direitos`) | 2026-10 | Licenças, direitos de terceiros e estatísticas de visita (Umami). **Não tem informação sobre o formulário** |
| Formulário publicado (`#/expor`) | 2026-10 | Caixa: «**Li a informação de privacidade** e autorizo…», mas **essa informação não existe no site**. |

## 2. Diferença essencial: inquéritos ≠ «Quero expor»

| | Inquéritos 2025/2026 | «Quero expor» |
|---|---|---|
| Identificação | sem nome, e-mail ou telefone (anónimos, salvo IP técnico da plataforma) | **identifica a pessoa**: nome, e-mail, telefone opcional, organização |
| Finalidade | investigação (percepções) | analisar e responder a uma **proposta de acolhimento** da exposição e acompanhar a organização |
| Plataforma | SurveyMonkey | site estático → função Supabase → serviço de envio (Resend) → caixas de correio da equipa |
| Base jurídica | consentimento (investigação) | **a confirmar** (ver §4) |

A política dos inquéritos **não se aplica directamente** ao formulário. Serve de modelo de estrutura e de contactos.

## 3. Inventário do tratamento (factos verificados no código e na configuração)

| Elemento | Situação verificada |
|---|---|
| **Dados recolhidos** | nome; e-mail; telefone (opcional); organização (opcional); tipo de espaço; nome do espaço; localidade; datas pretendidas; descrição; condições ou necessidades; aceitação da declaração; idioma do formulário (12 campos) |
| **Finalidade** | avaliar e responder à proposta de acolhimento da exposição «Entre Ruínas e Memórias» e acompanhar a eventual organização |
| **Onde passam** | (1) GitHub Pages serve a página e não recebe os dados; (2) função `exhibition-proposal-intake` (Supabase) recebe e **não grava em base de dados**; (3) **Resend** envia o e-mail; (4) caixas dos destinatários configurados |
| **Destinatários** | os endereços do secret `EXPOR_NOTIFY_RECIPIENTS` (dois contactos do responsável do projecto, um institucional da UAlg e um pessoal) |
| **Alternativa por e-mail** (quando o envio falha) | o visitante envia do **seu próprio** correio para a78190@ualg.pt, por decisão sua |
| **Estatística (Umami)** | não recebe dados do formulário (só a página vista e o evento de funil, sem conteúdo) |
| **Conservação** | **não definida**. Os e-mails ficam nas caixas de correio sem prazo |
| **Transferências internacionais** | **a confirmar**: região do projecto Supabase; Resend (empresa dos EUA); fornecedor de correio de um dos destinatários fora da UE |

## 4. Base jurídica e natureza da caixa de verificação (análise; decisão humana)

- **Consentimento (art. 6.º, n.º 1, al. a))**, como nos inquéritos: possível, mas exige poder retirá-lo, e o tratamento deixaria de ter base, o que é desajustado para responder a um pedido que a própria pessoa fez.
- **Diligências pré-contratuais a pedido do titular (art. 6.º, n.º 1, al. b))**: adequada se o acolhimento for um acordo (cedência ou empréstimo da exposição, acordo com a entidade anfitriã). A pessoa pede para expor; tratar os dados é necessário para responder.
- **Interesse legítimo (art. 6.º, n.º 1, al. f))**: alternativa para responder a contactos espontâneos, com ponderação documentada.

**Recomendação (a validar pelo EPD):**
- base **6.º/1/b**, ou **6.º/1/f**;
- a caixa passa a **confirmação de que a pessoa foi informada** (art. 13.º), **não** consentimento;
- daí a declaração proposta pelo responsável:

> «Declaro que tomei conhecimento da finalidade do tratamento dos meus dados pessoais para análise e acompanhamento desta proposta.»

Para ser verdadeira, **a finalidade tem de estar visível junto da caixa**. O PR que acompanha esta proposta faz isso.

## 5. Informação de privacidade proposta (camada completa — NÃO PUBLICAR até validação)

> **Como tratamos os dados desta proposta**
> - **Responsável pelo tratamento:** ⚠️ *A DECIDIR* — Universidade do Algarve (como nos inquéritos), Associação dos Amigos do Museu do Lyceu de Faro (beneficiária da iniciativa 2026) ou o responsável do projecto.
> - **Finalidade:** analisar e responder à sua proposta de acolhimento da exposição «Entre Ruínas e Memórias» e acompanhar a eventual organização.
> - **Base jurídica:** ⚠️ *A VALIDAR* (proposta: diligências pré-contratuais a seu pedido, art. 6.º, n.º 1, al. b) do RGPD).
> - **Dados:** os que indica no formulário (nome, e-mail, telefone se o indicar, organização, local, datas, descrição e necessidades).
> - **Quem acede:** a equipa do Projecto Comunitário de Milreu responsável pela exposição. Os dados não são publicados nem cedidos a terceiros para outros fins.
> - **Serviços envolvidos:** a proposta é enviada por e-mail através de um serviço de envio de correio (Resend) e de uma função de servidor (Supabase); não é guardada numa base de dados do site. ⚠️ *Confirmar regiões e transferências.*
> - **Conservação:** ⚠️ *A DEFINIR* (proposta alinhada com o mapeamento: até ao fim do acolhimento e, no máximo, até 5 anos após o fim do projecto (2033); ou prazo mais curto se não houver acolhimento).
> - **Direitos:** acesso, rectificação, apagamento, limitação, oposição e portabilidade, quando aplicável. Contacto: a78190@ualg.pt ⚠️ *e, se a UAlg for responsável, Encarregado da Protecção de Dados: rgpd@ualg.pt*. Pode apresentar reclamação à Comissão Nacional de Protecção de Dados (www.cnpd.pt).

## 6. Decisões humanas indispensáveis
1. **Responsável pelo tratamento** do formulário: UAlg, AAMLF ou o responsável do projecto. Determina o contacto do EPD e a política de referência.
2. **Base jurídica**: 6.º/1/b, 6.º/1/f ou consentimento. Validar com o EPD da UAlg (rgpd@ualg.pt) se a UAlg for responsável.
3. **Prazo de conservação** dos e-mails das propostas.
4. **Transferências internacionais**: região do projecto Supabase; acordo de tratamento (DPA) do Resend; uso de uma caixa pessoal fora da UE como destinatário (avaliar substituir por endereço institucional).
5. **Traduções** EN/ES/FR da declaração e da informação (rever; não publicar tradução automática como revista).
6. Aprovar a publicação da camada completa (§5) quando os pontos 1–4 estiverem fechados.
