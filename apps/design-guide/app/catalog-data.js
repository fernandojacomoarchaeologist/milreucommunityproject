/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

window.MILREU_CATALOG = {
  "version": "0.3.0",
  "status": "internal-preview",
  "groups": [
    {
      "id": "introduction",
      "labelKey": "groupIntroduction"
    },
    {
      "id": "foundations",
      "labelKey": "groupFoundations"
    },
    {
      "id": "identity",
      "labelKey": "groupIdentity"
    },
    {
      "id": "components",
      "labelKey": "groupComponents"
    },
    {
      "id": "patterns",
      "labelKey": "groupPatterns"
    },
    {
      "id": "experiences",
      "labelKey": "groupExperiences"
    },
    {
      "id": "governance",
      "labelKey": "groupGovernance"
    }
  ],
  "pages": [
    {
      "id": "introduction/overview",
      "group": "introduction",
      "slug": "overview",
      "title": "Visão geral",
      "summary": "O Sistema de Design organiza a identidade, as decisões e os componentes que ligam o Projeto Comunitário de Milreu, o Museu de Memórias e as futuras experiências digitais e físicas.",
      "status": "validated",
      "tags": [
        "introdução",
        "sistema",
        "milreu"
      ],
      "preview": "overview",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "purpose",
          "title": "Finalidade",
          "body": [
            "Criar uma linguagem comum para o Portal, o Museu, a impressão, a base de conhecimento e a futura aplicação móvel.",
            "O guia não é apenas uma galeria visual: cada decisão deve possuir origem, estado, regras de utilização e histórico."
          ]
        },
        {
          "id": "principles",
          "title": "Princípios operacionais",
          "list": [
            "A comunidade ocupa a superfície; a instituição fornece moldura e rigor.",
            "A fonte visual primária é interpretada, não copiada.",
            "Leitura e acessibilidade corrigem limitações do suporte impresso.",
            "Tokens são a fonte técnica de verdade.",
            "Elementos em construção exibem maturidade explícita."
          ]
        },
        {
          "id": "scope",
          "title": "O que está coberto nesta versão",
          "body": [
            "A versão 0.3.0 documenta fundações e a estrutura do catálogo. Componentes e padrões especializados serão consolidados no Pacote 05D."
          ]
        }
      ]
    },
    {
      "id": "introduction/principles",
      "group": "introduction",
      "slug": "principles",
      "title": "Princípios",
      "summary": "Regras de alto nível que orientam as decisões visuais, editoriais, técnicas e comunitárias.",
      "status": "validated",
      "tags": [
        "princípios",
        "comunidade",
        "instituição"
      ],
      "preview": "rules",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "community-first",
          "title": "Comunidade primeiro",
          "body": [
            "Fotografias, memórias e relações devem aparecer antes da explicação institucional. A interface não deve substituir a voz comunitária por uma narrativa académica dominante."
          ]
        },
        {
          "id": "evidence",
          "title": "Decisões rastreáveis",
          "body": [
            "Toda adaptação derivada do livro, dos dados do museu ou de uma necessidade de acessibilidade deve apontar para a sua fonte e para a decisão correspondente."
          ]
        },
        {
          "id": "living-system",
          "title": "Sistema vivo",
          "body": [
            "O sistema evolui por releases. Uma proposta não deve ser apresentada como solução aprovada apenas por estar visível no catálogo."
          ]
        }
      ]
    },
    {
      "id": "foundations/colors",
      "group": "foundations",
      "slug": "colors",
      "title": "Cores",
      "summary": "Paleta de produção com vermelho como assinatura, preto para destaques e superfícies claras para leitura extensa.",
      "status": "validated",
      "tags": [
        "cor",
        "vermelho",
        "preto",
        "contraste"
      ],
      "preview": "colors",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "roles",
          "title": "Papéis semânticos",
          "body": [
            "O vermelho marca entradas, aberturas, transições e fechos. O preto aquecido serve para preenchimentos de destaque, código e momentos de contraste. Branco documental, canvas quente e linho suportam leitura prolongada."
          ]
        },
        {
          "id": "usage",
          "title": "Utilização",
          "rules": {
            "do": [
              "Aplicar vermelho em áreas breves e deliberadas.",
              "Usar superfícies claras em textos extensos.",
              "Validar contraste de texto e estados."
            ],
            "avoid": [
              "Transformar o vermelho em fundo contínuo do portal.",
              "Usar cor como único indicador de certeza.",
              "Extrair cores finais diretamente do scan do livro."
            ]
          }
        },
        {
          "id": "tokens",
          "title": "Tokens principais",
          "tokens": [
            [
              "--ml-surface-signature",
              "#A83227",
              "Assinatura e abertura"
            ],
            [
              "--ml-surface-inverse",
              "#1E1A17",
              "Destaque e preenchimento"
            ],
            [
              "--ml-surface-reading",
              "#FFFFFF",
              "Leitura"
            ],
            [
              "--ml-surface-canvas",
              "#FFFCF7",
              "Fundo geral"
            ],
            [
              "--ml-surface-muted",
              "#F7F1E7",
              "Agrupamento e apoio"
            ]
          ]
        }
      ]
    },
    {
      "id": "foundations/typography",
      "group": "foundations",
      "slug": "typography",
      "title": "Tipografia",
      "summary": "Três famílias por função: Fraunces para expressão, Spectral para leitura editorial e Archivo para interface.",
      "status": "validated",
      "tags": [
        "tipografia",
        "fraunces",
        "spectral",
        "archivo"
      ],
      "preview": "typography",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "roles",
          "title": "Funções",
          "body": [
            "Fraunces cria aberturas e títulos com presença editorial. Spectral sustenta narrativas e textos longos. Archivo organiza navegação, filtros, metadados e tabelas."
          ]
        },
        {
          "id": "readability",
          "title": "Leitura digital",
          "list": [
            "Corpo principal mínimo de 18 px.",
            "Entrelinha recomendada de 1,65.",
            "Medida de leitura de 68ch.",
            "Evitar colunas estreitas e blocos densos herdados do livro."
          ]
        },
        {
          "id": "loading",
          "title": "Carregamento",
          "body": [
            "Nenhum ficheiro de fonte é distribuído nos pacotes. A implementação deve usar fontes licenciadas por serviço permitido ou fallbacks documentados."
          ]
        }
      ]
    },
    {
      "id": "foundations/spacing",
      "group": "foundations",
      "slug": "spacing",
      "title": "Espaçamento",
      "summary": "Escala comum para compor leitura, componentes, navegação e experiências imersivas.",
      "status": "validated",
      "tags": [
        "espaçamento",
        "escala",
        "layout"
      ],
      "preview": "spacing",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "scale",
          "title": "Escala",
          "body": [
            "A escala base cresce a partir de 0,25rem e privilegia combinações previsíveis. Espaçamentos maiores são reservados a mudanças editoriais e aberturas."
          ]
        },
        {
          "id": "rules",
          "title": "Regras",
          "list": [
            "Use tokens; não introduza valores arbitrários sem decisão.",
            "A proximidade deve refletir relação semântica.",
            "Mudanças de secção exigem mais espaço do que mudanças internas."
          ]
        }
      ]
    },
    {
      "id": "foundations/grid",
      "group": "foundations",
      "slug": "grid",
      "title": "Grelha e breakpoints",
      "summary": "Grelhas responsivas de 4, 8 e 12 colunas adaptadas a conteúdo editorial e experiências visuais.",
      "status": "validated",
      "tags": [
        "grelha",
        "breakpoints",
        "responsivo"
      ],
      "preview": "grid",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "systems",
          "title": "Sistemas",
          "body": [
            "Quatro colunas organizam telemóveis, oito colunas suportam tablets e doze colunas estruturam ecrãs amplos. A medida de leitura não deve crescer indefinidamente com o viewport."
          ]
        },
        {
          "id": "museum",
          "title": "Exceção imersiva",
          "body": [
            "O Museu pode ocupar o ecrã integralmente, mas legendas e detalhes continuam submetidos a medidas de leitura e zonas seguras."
          ]
        }
      ]
    },
    {
      "id": "foundations/shape",
      "group": "foundations",
      "slug": "shape",
      "title": "Forma, borda e elevação",
      "summary": "Formas discretas e funcionais que evitam uma aparência genérica de aplicação comercial.",
      "status": "in-review",
      "tags": [
        "forma",
        "borda",
        "raio",
        "elevação"
      ],
      "preview": "shape",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "direction",
          "title": "Direção",
          "body": [
            "Raios pequenos e médios sustentam controlos e agrupamentos. Grandes arredondamentos devem ser raros. A elevação é usada apenas para camadas reais, como diálogos, menus e imagens em detalhe."
          ]
        },
        {
          "id": "borders",
          "title": "Bordas",
          "body": [
            "Filetes finos remetem à organização editorial do livro, mas devem manter contraste e consistência em ecrã."
          ]
        }
      ]
    },
    {
      "id": "foundations/motion",
      "group": "foundations",
      "slug": "motion",
      "title": "Movimento",
      "summary": "Transições contidas que ajudam a perceber mudança de estado sem transformar a memória em espetáculo.",
      "status": "in-review",
      "tags": [
        "movimento",
        "animação",
        "reduced motion"
      ],
      "preview": "motion",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "durations",
          "title": "Durações",
          "body": [
            "Interações utilitárias usam durações rápidas. Transições editoriais podem ser ligeiramente mais longas. O modo imersivo admite movimento mais amplo quando este apoia a orientação."
          ]
        },
        {
          "id": "accessibility",
          "title": "Redução de movimento",
          "body": [
            "A preferência `prefers-reduced-motion` deve neutralizar transições e animações não essenciais."
          ]
        }
      ]
    },
    {
      "id": "foundations/photography",
      "group": "foundations",
      "slug": "photography",
      "title": "Fotografia",
      "summary": "Tratamento editorial que preserva o documento, distingue intervenções e mantém a fotografia como superfície comunitária.",
      "status": "in-review",
      "tags": [
        "fotografia",
        "imagem",
        "restauro",
        "derivados"
      ],
      "preview": "photography",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "principles",
          "title": "Princípios",
          "list": [
            "Não recortar conteúdo historicamente relevante sem registo.",
            "Separar original, derivado de publicação e intervenção digital.",
            "Não usar filtros decorativos que alterem o sentido documental.",
            "Indicar reconstruções, colorizações e melhorias significativas."
          ]
        },
        {
          "id": "composition",
          "title": "Composição",
          "body": [
            "Grandes imagens podem funcionar como aberturas, seguindo a força editorial observada no livro, mas a interface deve disponibilizar legenda, proveniência e direitos de forma acessível."
          ]
        }
      ]
    },
    {
      "id": "foundations/textures",
      "group": "foundations",
      "slug": "textures",
      "title": "Texturas",
      "summary": "Texturas abstratas e discretas inspiradas em plantas, mosaicos e superfícies materiais, sem reproduzir imagens protegidas.",
      "status": "draft",
      "tags": [
        "textura",
        "mosaico",
        "planta"
      ],
      "preview": "texture",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "usage",
          "title": "Uso restrito",
          "body": [
            "Texturas podem apoiar aberturas, divisores e materiais físicos. Não devem competir com fotografias ou reduzir o contraste de leitura."
          ]
        },
        {
          "id": "source",
          "title": "Origem",
          "body": [
            "A linguagem pode remeter a linhas de planta e ritmos de mosaico, mas não deve copiar uma página ou desenho específico do livro sem autorização."
          ]
        }
      ]
    },
    {
      "id": "foundations/maps-data",
      "group": "foundations",
      "slug": "maps-data",
      "title": "Mapas e dados",
      "summary": "Paleta funcional separada da identidade institucional, preparada para plantas, mapas e resultados públicos.",
      "status": "in-review",
      "tags": [
        "mapa",
        "dados",
        "paleta",
        "planta"
      ],
      "preview": "maps",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "separation",
          "title": "Separação semântica",
          "body": [
            "Cores de mapa e dados codificam categorias. Não devem reutilizar automaticamente o vermelho institucional ou os níveis de certeza."
          ]
        },
        {
          "id": "requirements",
          "title": "Requisitos",
          "list": [
            "Legenda sempre disponível.",
            "Padrões ou rótulos complementam a cor.",
            "Localizações sensíveis usam precisão reduzida.",
            "Mapas devem funcionar por teclado quando interativos."
          ]
        }
      ]
    },
    {
      "id": "foundations/accessibility",
      "group": "foundations",
      "slug": "accessibility",
      "title": "Acessibilidade",
      "summary": "Baseline de leitura, contraste, teclado, foco, movimento e linguagem para todo o ecossistema.",
      "status": "validated",
      "tags": [
        "acessibilidade",
        "wcag",
        "teclado",
        "contraste"
      ],
      "preview": "accessibility",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "baseline",
          "title": "Baseline",
          "list": [
            "Contraste AA nas combinações de produção.",
            "Foco visível em elementos interativos.",
            "Operação completa por teclado.",
            "Estrutura semântica de títulos.",
            "Alternativas textuais para imagens.",
            "Redução de movimento.",
            "Idiomas identificados corretamente."
          ]
        },
        {
          "id": "book-corrections",
          "title": "Correções do suporte impresso",
          "body": [
            "O site não deve reproduzir corpo pequeno, legendas comprimidas, colunas densas ou dependência de páginas duplas observadas na fonte primária."
          ]
        }
      ]
    },
    {
      "id": "identity/primary-source",
      "group": "identity",
      "slug": "primary-source",
      "title": "Fonte visual primária",
      "summary": "O livro Milreu: Ruínas orienta a gramática editorial, mas não é um template nem uma biblioteca de ativos públicos.",
      "status": "validated",
      "tags": [
        "hauschild",
        "teichner",
        "livro",
        "fonte"
      ],
      "preview": "rules",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "authority",
          "title": "Autoridade",
          "body": [
            "A fonte sustenta decisões sobre ritmo, relação entre fotografia e texto, plantas, objetos recortados e aberturas cromáticas."
          ]
        },
        {
          "id": "limits",
          "title": "Limites",
          "list": [
            "Não copiar páginas literalmente.",
            "Não usar o scan como paleta calibrada.",
            "Não identificar fontes por mera semelhança.",
            "Não publicar imagens do PDF sem validação de direitos."
          ]
        }
      ]
    },
    {
      "id": "identity/two-voices",
      "group": "identity",
      "slug": "two-voices",
      "title": "Duas vozes",
      "summary": "A comunidade ocupa a superfície; a instituição oferece contexto, proveniência, direitos e rigor.",
      "status": "validated",
      "tags": [
        "duas vozes",
        "comunidade",
        "instituição"
      ],
      "preview": "voices",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "community",
          "title": "Voz comunitária",
          "body": [
            "Memórias, fotografias, testemunhos e relações aparecem em primeiro plano. O texto deve manter proximidade e reconhecer incertezas."
          ]
        },
        {
          "id": "institution",
          "title": "Voz institucional",
          "body": [
            "Fontes, métodos, certeza, direitos, glossário e contexto arqueológico aparecem como moldura consultável, não como substituição da experiência comunitária."
          ]
        }
      ]
    },
    {
      "id": "identity/signature",
      "group": "identity",
      "slug": "signature",
      "title": "Assinatura visual",
      "summary": "Vermelho, preto aquecido, linhas de planta e composição editorial formam a assinatura sem dominar a leitura.",
      "status": "in-review",
      "tags": [
        "assinatura",
        "vermelho",
        "abertura"
      ],
      "preview": "signature",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "red",
          "title": "Vermelho",
          "body": [
            "Usar em entrada, abertura, transição e fecho. A assinatura deve ser reconhecível mesmo quando ocupa uma área pequena."
          ]
        },
        {
          "id": "black",
          "title": "Preto",
          "body": [
            "Usar como preenchimento de destaque, fundo de código, painéis de contraste e momentos imersivos. Evitar sucessões extensas de superfícies escuras no Portal."
          ]
        },
        {
          "id": "pending",
          "title": "Elementos pendentes",
          "body": [
            "Logótipo e marca final permanecem em aberto. O símbolo abstrato usado no catálogo é apenas um marcador funcional da aplicação."
          ]
        }
      ]
    },
    {
      "id": "components/overview",
      "group": "components",
      "slug": "overview",
      "title": "Componentes",
      "summary": "Inventário e maturidade dos elementos reutilizáveis. A implementação especializada será concluída no Pacote 05D.",
      "status": "draft",
      "tags": [
        "componentes",
        "inventário",
        "05d"
      ],
      "preview": "components",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "current",
          "title": "Disponível nesta etapa",
          "body": [
            "O catálogo demonstra elementos utilitários do próprio guia: navegação, pesquisa, badges, tabelas, exemplos e blocos de código."
          ]
        },
        {
          "id": "next",
          "title": "Próxima etapa",
          "list": [
            "Cartão de memória.",
            "Visualizador fotográfico.",
            "Indicador de certeza.",
            "Proveniência e fonte.",
            "Direitos e contestação.",
            "Seletor de idioma.",
            "Marcador cronológico.",
            "Referência arqueológica.",
            "Tabela de dados públicos.",
            "Visualizador bibliográfico."
          ]
        }
      ]
    },
    {
      "id": "patterns/overview",
      "group": "patterns",
      "slug": "overview",
      "title": "Padrões",
      "summary": "Composições completas que ligam componentes, conteúdo, dados e regras de publicação.",
      "status": "proposed",
      "tags": [
        "padrões",
        "página",
        "fluxo"
      ],
      "preview": "components",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "planned",
          "title": "Padrões previstos",
          "list": [
            "Página de memória.",
            "Galeria do Museu.",
            "Modo imersivo.",
            "Linha temporal.",
            "Mapa de narrativas.",
            "Página de iniciativa.",
            "Biblioteca e visualizador documental.",
            "Consulta de inquéritos.",
            "Formulário de participação.",
            "Correção, contestação e remoção.",
            "Painel e totem físico."
          ]
        },
        {
          "id": "rule",
          "title": "Regra de criação",
          "body": [
            "Nenhum padrão deve ser construído fora de uma spec aprovada e sem identificar a iniciativa, a fonte dos dados, os idiomas, os direitos e os estados vazios."
          ]
        }
      ]
    },
    {
      "id": "experiences/portal",
      "group": "experiences",
      "slug": "portal",
      "title": "Modo Portal",
      "summary": "Experiência estruturada para projeto, métodos, dados, arqueologia, biblioteca e participação.",
      "status": "draft",
      "tags": [
        "portal",
        "navegação",
        "consulta"
      ],
      "preview": "experiences",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "character",
          "title": "Carácter",
          "body": [
            "Navegação previsível, leitura extensa, URLs estáveis, pesquisa e maior densidade informacional. O vermelho atua como assinatura, não como superfície dominante."
          ]
        },
        {
          "id": "navigation",
          "title": "Navegação",
          "body": [
            "Menus superiores ou laterais podem coexistir conforme a escala, desde que não invadam o modo imersivo do Museu."
          ]
        }
      ]
    },
    {
      "id": "experiences/museum",
      "group": "experiences",
      "slug": "museum",
      "title": "Modo Museu",
      "summary": "Experiência de exploração visual em que fotografias e relações ocupam o ecrã e os detalhes aparecem por camadas.",
      "status": "draft",
      "tags": [
        "museu",
        "imersivo",
        "fotografia"
      ],
      "preview": "experiences",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "character",
          "title": "Carácter",
          "body": [
            "A navegação institucional reduz presença. A fotografia ganha escala, mas continua acompanhada por legenda, contexto, proveniência, certeza e direitos acessíveis."
          ]
        },
        {
          "id": "controls",
          "title": "Controlo",
          "list": [
            "Teclado e gestos equivalentes.",
            "Saída clara para o Portal.",
            "Estado de posição na coleção.",
            "Modo de detalhe sem bloquear a imagem.",
            "Respeito por redução de movimento."
          ]
        }
      ]
    },
    {
      "id": "experiences/print",
      "group": "experiences",
      "slug": "print",
      "title": "Impressão",
      "summary": "Fundação para painéis e totens com equivalência semântica, mas não literal, entre físico e digital.",
      "status": "draft",
      "tags": [
        "impressão",
        "painéis",
        "totens"
      ],
      "preview": "experiences",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "principles",
          "title": "Princípios",
          "body": [
            "O suporte físico utiliza a mesma identidade, níveis de certeza e proveniência. Escala tipográfica, distância de leitura, material, sangria e QR exigem regras próprias."
          ]
        },
        {
          "id": "status",
          "title": "Estado",
          "body": [
            "Templates finais e preflight serão tratados após os componentes do Pacote 05D e a revisão do conteúdo selecionado."
          ]
        }
      ]
    },
    {
      "id": "experiences/flutter",
      "group": "experiences",
      "slug": "flutter",
      "title": "Flutter",
      "summary": "Projeção futura dos tokens e padrões para uma aplicação móvel que consome a mesma API e os mesmos conteúdos.",
      "status": "proposed",
      "tags": [
        "flutter",
        "app",
        "mobile"
      ],
      "preview": "experiences",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "scope",
          "title": "Escopo inicial",
          "list": [
            "Explorar memórias.",
            "Modo imersivo.",
            "Linha temporal.",
            "Mapa.",
            "Favoritos locais.",
            "Idiomas.",
            "Acesso por QR."
          ]
        },
        {
          "id": "dependency",
          "title": "Dependências",
          "body": [
            "A aplicação só deve avançar após estabilização dos schemas, API, direitos, autenticação, componentes e fluxo editorial."
          ]
        }
      ]
    },
    {
      "id": "governance/maturity",
      "group": "governance",
      "slug": "maturity",
      "title": "Maturidade",
      "summary": "Estados que distinguem proposta, rascunho, revisão, validação, aprovação e depreciação.",
      "status": "validated",
      "tags": [
        "maturidade",
        "estado",
        "governação"
      ],
      "preview": "maturity",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "model",
          "title": "Modelo",
          "body": [
            "A presença de um elemento no catálogo não significa aprovação. O estado informa o grau de decisão e os riscos de utilização."
          ]
        },
        {
          "id": "transitions",
          "title": "Transições",
          "body": [
            "Mudanças de estado exigem evidência, revisão e release. Apenas Fernando Rodrigues de Jácomo ou um processo expressamente delegado pode aprovar a identidade final."
          ]
        }
      ]
    },
    {
      "id": "governance/contributing",
      "group": "governance",
      "slug": "contributing",
      "title": "Como contribuir",
      "summary": "Processo para propor ou alterar fundações, componentes, padrões e conteúdo do guia.",
      "status": "in-review",
      "tags": [
        "contribuir",
        "governação",
        "mudança"
      ],
      "preview": "rules",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "proposal",
          "title": "Proposta",
          "list": [
            "Identificar o problema.",
            "Indicar iniciativa e utilizadores.",
            "Apontar fonte e decisão existente.",
            "Criar ou atualizar spec.",
            "Demonstrar estados e acessibilidade.",
            "Registar impacto em web, impressão e Flutter."
          ]
        },
        {
          "id": "review",
          "title": "Revisão",
          "body": [
            "Mudanças em tokens exigem a skill de alteração de tokens do Pacote 05B. Mudanças no catálogo devem atualizar dados, documentação, testes e release."
          ]
        }
      ]
    },
    {
      "id": "governance/releases",
      "group": "governance",
      "slug": "releases",
      "title": "Releases",
      "summary": "Histórico do ciclo do Sistema de Design e critérios para as próximas versões.",
      "status": "validated",
      "tags": [
        "releases",
        "changelog",
        "versão"
      ],
      "preview": "release",
      "source": "Pacotes 05A e 05B",
      "platform": "Web · documentação",
      "sections": [
        {
          "id": "versions",
          "title": "Ciclo atual",
          "list": [
            "0.1.0 — fundação documental e guia preliminar.",
            "0.2.0 — fundações visuais de produção.",
            "0.3.0 — catálogo visual interativo.",
            "0.4.0 — componentes e padrões museológicos.",
            "1.0.0 — apenas após validação visual, acessibilidade e impressão."
          ]
        },
        {
          "id": "policy",
          "title": "Política",
          "body": [
            "Cada release deve declarar adições, alterações, depreciações, migração, validações e decisões em aberto."
          ]
        }
      ]
    }
  ]
};
