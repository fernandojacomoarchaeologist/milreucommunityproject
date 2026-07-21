/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Direitos: consultar RIGHTS.md.
 */

window.MILREU_COMPONENTS = {
  "_copyright": "© 2026 Fernando Rodrigues de Jácomo",
  "_project": "Projeto Comunitário de Milreu",
  "_rights": "Consultar RIGHTS.md",
  "version": "0.4.0",
  "status": "internal-preview",
  "components": [
    {
      "id": "action-button",
      "title": "Botão de ação",
      "category": "Ações",
      "status": "validated",
      "problem": "Executar uma ação explícita sem competir com o conteúdo editorial.",
      "usage": "Ações primárias, secundárias e discretas no Portal, Museu e formulários.",
      "variants": [
        "primary",
        "secondary",
        "quiet",
        "danger"
      ],
      "states": [
        "default",
        "hover",
        "focus",
        "disabled",
        "loading"
      ],
      "anatomy": [
        "rótulo",
        "ícone opcional",
        "área mínima de toque"
      ],
      "accessibility": [
        "Rótulo textual obrigatório.",
        "Área mínima de 44 × 44 px.",
        "Não usar apenas cor para indicar perigo ou estado."
      ],
      "tokens": [
        "--ml-surface-signature",
        "--ml-surface-inverse",
        "--ml-focus-ring"
      ],
      "demo": "action-buttons",
      "platforms": [
        "Web",
        "Flutter projection"
      ]
    },
    {
      "id": "language-selector",
      "title": "Seletor de idioma",
      "category": "Navegação",
      "status": "validated",
      "problem": "Permitir alternar entre pt-PT, inglês, espanhol e francês sem perder o contexto.",
      "usage": "Cabeçalhos, modo imersivo e páginas com conteúdo traduzido.",
      "variants": [
        "compact",
        "expanded"
      ],
      "states": [
        "available",
        "partial-translation",
        "unavailable"
      ],
      "anatomy": [
        "idioma atual",
        "lista de idiomas",
        "estado de tradução"
      ],
      "accessibility": [
        "Usar nomes ou códigos compreensíveis.",
        "Anunciar quando a tradução não estiver disponível.",
        "Preservar foco e rota."
      ],
      "tokens": [
        "--ml-font-interface",
        "--ml-border-default",
        "--ml-focus-ring"
      ],
      "demo": "language-selector",
      "platforms": [
        "Web",
        "Flutter projection"
      ]
    },
    {
      "id": "confidence-indicator",
      "title": "Indicador de certeza",
      "category": "Evidência",
      "status": "validated",
      "problem": "Tornar visível o nível de certeza sem reduzir a informação a uma cor.",
      "usage": "Datas, identificações, proveniência, relações e interpretações.",
      "variants": [
        "confirmed",
        "probable",
        "hypothesis"
      ],
      "states": [
        "default",
        "with-explanation"
      ],
      "anatomy": [
        "símbolo",
        "rótulo",
        "explicação opcional"
      ],
      "accessibility": [
        "O texto do nível é obrigatório.",
        "A cor é redundante, nunca exclusiva.",
        "A explicação deve ser acessível por teclado."
      ],
      "tokens": [
        "--ml-certainty-confirmed",
        "--ml-certainty-probable",
        "--ml-certainty-hypothesis"
      ],
      "demo": "confidence-indicator",
      "platforms": [
        "Web",
        "Print",
        "Flutter projection"
      ]
    },
    {
      "id": "publication-status",
      "title": "Estado editorial",
      "category": "Governação",
      "status": "validated",
      "problem": "Distinguir conteúdos demonstrativos, preliminares, revistos e publicados.",
      "usage": "Administração, catálogo, dados e pré-visualizações internas.",
      "variants": [
        "demo",
        "preliminary",
        "in-review",
        "published",
        "contested",
        "withdrawn"
      ],
      "states": [
        "default"
      ],
      "anatomy": [
        "rótulo",
        "estado semântico"
      ],
      "accessibility": [
        "Não apresentar conteúdo preliminar como publicado.",
        "Usar texto explícito."
      ],
      "tokens": [
        "--ml-font-interface",
        "--ml-surface-muted",
        "--ml-border-default"
      ],
      "demo": "publication-status",
      "platforms": [
        "Web",
        "Admin"
      ]
    },
    {
      "id": "memory-card",
      "title": "Cartão de memória",
      "category": "Museu",
      "status": "in-review",
      "problem": "Apresentar uma memória de forma rápida, visual e rastreável.",
      "usage": "Galerias, relações, pesquisa e destaques do Museu.",
      "variants": [
        "portrait",
        "landscape",
        "compact"
      ],
      "states": [
        "default",
        "hover",
        "selected",
        "restricted"
      ],
      "anatomy": [
        "imagem",
        "ID",
        "título",
        "data",
        "certeza",
        "relações"
      ],
      "accessibility": [
        "Texto alternativo contextual.",
        "Título deve ser ligação real.",
        "Não esconder estado de direitos ou restrição."
      ],
      "tokens": [
        "--ml-surface-reading",
        "--ml-border-subtle",
        "--ml-font-display"
      ],
      "demo": "memory-card",
      "platforms": [
        "Web",
        "Flutter projection"
      ]
    },
    {
      "id": "figure-viewer",
      "title": "Visualizador de fotografia",
      "category": "Museu",
      "status": "in-review",
      "problem": "Ampliar uma imagem mantendo legenda, direitos e navegação acessíveis.",
      "usage": "Detalhe de memória e modo imersivo.",
      "variants": [
        "inline",
        "immersive",
        "comparison"
      ],
      "states": [
        "loading",
        "ready",
        "error",
        "restricted"
      ],
      "anatomy": [
        "imagem",
        "controlos",
        "legenda",
        "contador",
        "fechar"
      ],
      "accessibility": [
        "Fecho por teclado e botão visível.",
        "Foco preso no modo modal.",
        "Zoom não deve bloquear leitura."
      ],
      "tokens": [
        "--ml-surface-inverse",
        "--ml-text-inverse",
        "--ml-duration-immersive"
      ],
      "demo": "figure-viewer",
      "platforms": [
        "Web",
        "Flutter projection"
      ]
    },
    {
      "id": "caption-block",
      "title": "Bloco de legenda",
      "category": "Conteúdo",
      "status": "validated",
      "problem": "Ligar imagem, autoria, data, origem e estado sem tornar a legenda ilegível.",
      "usage": "Fotografias, desenhos, plantas, documentos e impressão.",
      "variants": [
        "standard",
        "compact",
        "inverse"
      ],
      "states": [
        "complete",
        "pending-metadata"
      ],
      "anatomy": [
        "número opcional",
        "descrição",
        "crédito",
        "origem"
      ],
      "accessibility": [
        "Corpo mínimo legível.",
        "Crédito separado da descrição.",
        "Não sobrepor texto extenso diretamente à imagem."
      ],
      "tokens": [
        "--ml-font-interface",
        "--ml-text-secondary",
        "--ml-border-subtle"
      ],
      "demo": "caption-block",
      "platforms": [
        "Web",
        "Print",
        "Flutter projection"
      ]
    },
    {
      "id": "community-narrative",
      "title": "Narrativa comunitária",
      "category": "Duas vozes",
      "status": "in-review",
      "problem": "Dar primazia à voz comunitária sem confundi-la com descrição objetiva ou contexto institucional.",
      "usage": "Detalhe da memória, exposições e contributos revistos.",
      "variants": [
        "quotation",
        "story",
        "oral-history"
      ],
      "states": [
        "reviewed",
        "translation-pending"
      ],
      "anatomy": [
        "voz",
        "narrativa",
        "relação com a memória",
        "atribuição controlada"
      ],
      "accessibility": [
        "Não depender apenas de aspas decorativas.",
        "Indicar idioma original e tradução.",
        "Preservar o sentido e a autoria."
      ],
      "tokens": [
        "--ml-font-editorial",
        "--ml-surface-reading",
        "--ml-color-sepia-500"
      ],
      "demo": "community-narrative",
      "platforms": [
        "Web",
        "Print",
        "Flutter projection"
      ]
    },
    {
      "id": "institutional-context",
      "title": "Contexto institucional",
      "category": "Duas vozes",
      "status": "in-review",
      "problem": "Acrescentar contexto científico e institucional sem substituir a narrativa comunitária.",
      "usage": "Detalhe de memória, estudos e notas de enquadramento.",
      "variants": [
        "frame",
        "note",
        "expanded"
      ],
      "states": [
        "collapsed",
        "expanded"
      ],
      "anatomy": [
        "rótulo",
        "texto",
        "fontes relacionadas"
      ],
      "accessibility": [
        "Deve surgir após a voz comunitária.",
        "Expansão acessível por teclado."
      ],
      "tokens": [
        "--ml-surface-muted",
        "--ml-surface-signature",
        "--ml-font-interface"
      ],
      "demo": "institutional-context",
      "platforms": [
        "Web",
        "Print"
      ]
    },
    {
      "id": "provenance-note",
      "title": "Nota de proveniência",
      "category": "Evidência",
      "status": "validated",
      "problem": "Explicar de onde vem o registo e como chegou ao projeto.",
      "usage": "Memórias, documentos, fotografias, artefactos e bibliografia.",
      "variants": [
        "summary",
        "timeline",
        "full"
      ],
      "states": [
        "complete",
        "partial",
        "disputed"
      ],
      "anatomy": [
        "origem",
        "cadeia de custódia",
        "evento de incorporação",
        "fontes"
      ],
      "accessibility": [
        "Usar linguagem clara.",
        "Não ocultar lacunas.",
        "Associar o estado de certeza."
      ],
      "tokens": [
        "--ml-color-patina-500",
        "--ml-surface-muted",
        "--ml-font-interface"
      ],
      "demo": "provenance-note",
      "platforms": [
        "Web",
        "Print"
      ]
    },
    {
      "id": "rights-notice",
      "title": "Aviso de direitos",
      "category": "Direitos",
      "status": "validated",
      "problem": "Comunicar condições, zonas cinzentas e possibilidade de contestação.",
      "usage": "Memórias, documentos, contribuições e rodapés.",
      "variants": [
        "informational",
        "pending",
        "restricted",
        "withdrawn"
      ],
      "states": [
        "default",
        "actionable"
      ],
      "anatomy": [
        "estado",
        "mensagem",
        "ação de contacto"
      ],
      "accessibility": [
        "Mensagem direta e não jurídica em excesso.",
        "A ação deve ser identificável.",
        "Não induzir que o projeto detém todos os direitos."
      ],
      "tokens": [
        "--ml-color-red-100",
        "--ml-surface-signature",
        "--ml-text-primary"
      ],
      "demo": "rights-notice",
      "platforms": [
        "Web",
        "Print"
      ]
    },
    {
      "id": "correction-link",
      "title": "Pedido de correção ou remoção",
      "category": "Direitos",
      "status": "validated",
      "problem": "Oferecer um canal claro para correção, identificação, direitos ou remoção.",
      "usage": "Detalhe de memória, fotografia e documento.",
      "variants": [
        "link",
        "button",
        "inline-panel"
      ],
      "states": [
        "available",
        "submitted",
        "unavailable"
      ],
      "anatomy": [
        "ação",
        "explicação breve",
        "destino"
      ],
      "accessibility": [
        "Não esconder no rodapé.",
        "Explicar o que acontece após o pedido."
      ],
      "tokens": [
        "--ml-color-red-700",
        "--ml-focus-ring",
        "--ml-font-interface"
      ],
      "demo": "correction-link",
      "platforms": [
        "Web",
        "Flutter projection"
      ]
    },
    {
      "id": "relationship-chip",
      "title": "Relação entre registos",
      "category": "Descoberta",
      "status": "in-review",
      "problem": "Permitir navegar entre memórias, pessoas, lugares, estudos e artefactos relacionados.",
      "usage": "Detalhes, resultados de pesquisa e mapas.",
      "variants": [
        "memory",
        "person",
        "place",
        "study",
        "artefact"
      ],
      "states": [
        "default",
        "selected"
      ],
      "anatomy": [
        "tipo",
        "rótulo",
        "direção da relação"
      ],
      "accessibility": [
        "O tipo da relação deve ser textual.",
        "Não usar chip para ações destrutivas."
      ],
      "tokens": [
        "--ml-surface-muted",
        "--ml-border-default",
        "--ml-font-interface"
      ],
      "demo": "relationship-chip",
      "platforms": [
        "Web",
        "Flutter projection"
      ]
    },
    {
      "id": "timeline-marker",
      "title": "Marcador cronológico",
      "category": "Navegação",
      "status": "in-review",
      "problem": "Representar datas exatas, intervalos e incerteza numa linha temporal.",
      "usage": "Linha temporal do Museu e histórico de registos.",
      "variants": [
        "exact",
        "range",
        "approximate",
        "unknown"
      ],
      "states": [
        "default",
        "active"
      ],
      "anatomy": [
        "data",
        "marcador",
        "certeza",
        "ligação"
      ],
      "accessibility": [
        "Ordem cronológica no DOM.",
        "Data legível fora do gráfico.",
        "Incerteza descrita textualmente."
      ],
      "tokens": [
        "--ml-surface-signature",
        "--ml-certainty-probable",
        "--ml-font-interface"
      ],
      "demo": "timeline-marker",
      "platforms": [
        "Web",
        "Flutter projection"
      ]
    },
    {
      "id": "map-marker",
      "title": "Marcador de narrativa no mapa",
      "category": "Mapas",
      "status": "proposed",
      "problem": "Relacionar uma narrativa com um lugar sem expor localizações sensíveis.",
      "usage": "Mapa vivo de narrativas e percurso interpretativo.",
      "variants": [
        "exact-public",
        "approximate",
        "site-zone",
        "private-hidden"
      ],
      "states": [
        "default",
        "selected",
        "clustered"
      ],
      "anatomy": [
        "símbolo",
        "tipo",
        "grau de precisão",
        "resumo"
      ],
      "accessibility": [
        "Fornecer lista alternativa ao mapa.",
        "Não publicar moradas ou coordenadas sensíveis.",
        "Marcadores precisam de rótulo."
      ],
      "tokens": [
        "--ml-surface-signature",
        "--ml-color-sepia-500",
        "--ml-focus-ring"
      ],
      "demo": "map-marker",
      "platforms": [
        "Web",
        "Flutter projection"
      ]
    },
    {
      "id": "source-reference",
      "title": "Referência de fonte",
      "category": "Evidência",
      "status": "validated",
      "problem": "Mostrar a fonte que suporta um dado, uma interpretação ou uma imagem.",
      "usage": "Memórias, estudos, resultados, biblioteca e notas.",
      "variants": [
        "bibliographic",
        "archival",
        "oral",
        "web",
        "project-document"
      ],
      "states": [
        "verified",
        "pending-page",
        "unavailable"
      ],
      "anatomy": [
        "tipo",
        "citação",
        "páginas",
        "estado de verificação"
      ],
      "accessibility": [
        "Ligação com nome compreensível.",
        "Páginas não podem ser inventadas.",
        "Indicar quando o ficheiro não é público."
      ],
      "tokens": [
        "--ml-font-interface",
        "--ml-text-secondary",
        "--ml-border-subtle"
      ],
      "demo": "source-reference",
      "platforms": [
        "Web",
        "Print"
      ]
    },
    {
      "id": "filter-bar",
      "title": "Barra de filtros",
      "category": "Descoberta",
      "status": "in-review",
      "problem": "Refinar coleções sem esconder o estado ativo dos filtros.",
      "usage": "Galeria, biblioteca, dados e estudos.",
      "variants": [
        "inline",
        "drawer",
        "compact"
      ],
      "states": [
        "default",
        "filtered",
        "empty"
      ],
      "anatomy": [
        "pesquisa",
        "grupos",
        "filtros ativos",
        "limpar"
      ],
      "accessibility": [
        "Todos os controlos têm rótulo.",
        "Contagem de resultados anunciada.",
        "Filtros ativos visíveis."
      ],
      "tokens": [
        "--ml-surface-reading",
        "--ml-border-default",
        "--ml-focus-ring"
      ],
      "demo": "filter-bar",
      "platforms": [
        "Web",
        "Flutter projection"
      ]
    },
    {
      "id": "document-frame",
      "title": "Visualizador documental",
      "category": "Biblioteca",
      "status": "in-review",
      "problem": "Consultar documentos autorizados preservando referência, páginas e acesso alternativo.",
      "usage": "Biblioteca e base de conhecimento.",
      "variants": [
        "pdf",
        "image",
        "metadata-only"
      ],
      "states": [
        "loading",
        "ready",
        "restricted",
        "unavailable"
      ],
      "anatomy": [
        "documento",
        "paginação",
        "metadados",
        "download ou acesso"
      ],
      "accessibility": [
        "Fornecer metadados e ligação alternativa.",
        "Não depender apenas do canvas ou PDF embebido.",
        "Respeitar a política de acesso."
      ],
      "tokens": [
        "--ml-surface-reading",
        "--ml-surface-inverse",
        "--ml-font-interface"
      ],
      "demo": "document-frame",
      "platforms": [
        "Web"
      ]
    },
    {
      "id": "data-table",
      "title": "Tabela de dados públicos",
      "category": "Dados",
      "status": "in-review",
      "problem": "Apresentar dados agregados e anonimizados de forma consultável.",
      "usage": "Inquéritos, participação e resultados públicos.",
      "variants": [
        "standard",
        "compact",
        "sortable"
      ],
      "states": [
        "loading",
        "ready",
        "empty",
        "error"
      ],
      "anatomy": [
        "título",
        "cabeçalhos",
        "linhas",
        "fonte",
        "versão"
      ],
      "accessibility": [
        "Cabeçalhos associados às células.",
        "Ordenação anunciada.",
        "Fornecer versão descarregável."
      ],
      "tokens": [
        "--ml-font-interface",
        "--ml-border-subtle",
        "--ml-focus-ring"
      ],
      "demo": "data-table",
      "platforms": [
        "Web"
      ]
    },
    {
      "id": "empty-state",
      "title": "Estado vazio",
      "category": "Feedback",
      "status": "validated",
      "problem": "Explicar ausência de conteúdo sem sugerir falha ou inventar dados.",
      "usage": "Pesquisa, filtros, coleções e resultados ainda em construção.",
      "variants": [
        "no-results",
        "not-published",
        "restricted",
        "error"
      ],
      "states": [
        "default"
      ],
      "anatomy": [
        "título",
        "explicação",
        "ação opcional"
      ],
      "accessibility": [
        "Mensagem específica.",
        "Não usar ilustração como única explicação."
      ],
      "tokens": [
        "--ml-surface-muted",
        "--ml-text-secondary",
        "--ml-font-interface"
      ],
      "demo": "empty-state",
      "platforms": [
        "Web",
        "Flutter projection"
      ]
    },
    {
      "id": "project-footer",
      "title": "Rodapé e assinatura do projeto",
      "category": "Identidade",
      "status": "validated",
      "problem": "Aplicar autoria, âmbito e avisos sem atribuir indevidamente direitos sobre terceiros.",
      "usage": "Portal, Museu, guia e materiais digitais.",
      "variants": [
        "standard",
        "compact",
        "inverse"
      ],
      "states": [
        "default"
      ],
      "anatomy": [
        "copyright",
        "projeto",
        "direitos",
        "contacto"
      ],
      "accessibility": [
        "Texto legível.",
        "Ligações claras.",
        "Não esconder direitos em texto microscópico."
      ],
      "tokens": [
        "--ml-surface-inverse",
        "--ml-text-inverse",
        "--ml-font-interface"
      ],
      "demo": "project-footer",
      "platforms": [
        "Web",
        "Print"
      ]
    }
  ]
};
window.MILREU_PATTERNS = {
  "_copyright": "© 2026 Fernando Rodrigues de Jácomo",
  "_project": "Projeto Comunitário de Milreu",
  "_rights": "Consultar RIGHTS.md",
  "version": "0.4.0",
  "status": "internal-preview",
  "patterns": [
    {
      "id": "museum-gallery",
      "title": "Galeria do Museu",
      "status": "in-review",
      "purpose": "Explorar memórias por fotografia, tema, tempo e relações.",
      "components": [
        "memory-card",
        "filter-bar",
        "empty-state",
        "publication-status"
      ],
      "flow": [
        "Abrir coleção",
        "Aplicar filtros",
        "Abrir uma memória",
        "Retomar posição anterior"
      ],
      "risks": [
        "Excesso de metadados nos cartões.",
        "Publicação acidental de registos preliminares."
      ],
      "demo": "pattern-gallery"
    },
    {
      "id": "memory-detail",
      "title": "Detalhe de memória",
      "status": "in-review",
      "purpose": "Apresentar uma memória completa respeitando as duas vozes, proveniência, certeza e direitos.",
      "components": [
        "figure-viewer",
        "caption-block",
        "community-narrative",
        "institutional-context",
        "confidence-indicator",
        "provenance-note",
        "rights-notice",
        "relationship-chip"
      ],
      "flow": [
        "Fotografia e narrativa",
        "Descrição e contexto",
        "Proveniência e fontes",
        "Relações",
        "Direitos e correção"
      ],
      "risks": [
        "Instituição dominar a narrativa.",
        "Metadados críticos ficarem escondidos."
      ],
      "demo": "pattern-memory-detail"
    },
    {
      "id": "immersive-view",
      "title": "Visualização imersiva",
      "status": "in-review",
      "purpose": "Permitir contemplação em ecrã inteiro sem remover contexto e controlo.",
      "components": [
        "figure-viewer",
        "caption-block",
        "language-selector",
        "confidence-indicator"
      ],
      "flow": [
        "Entrar no modo imersivo",
        "Navegar",
        "Abrir detalhes",
        "Sair e devolver foco"
      ],
      "risks": [
        "Foco perdido.",
        "Legenda ilegível sobre imagem."
      ],
      "demo": "pattern-immersive"
    },
    {
      "id": "timeline",
      "title": "Linha temporal",
      "status": "draft",
      "purpose": "Navegar por datas, intervalos e incertezas.",
      "components": [
        "timeline-marker",
        "confidence-indicator",
        "memory-card"
      ],
      "flow": [
        "Selecionar período",
        "Ler eventos",
        "Abrir memória"
      ],
      "risks": [
        "Falsa precisão.",
        "Ordem visual diferente da ordem acessível."
      ],
      "demo": "pattern-timeline"
    },
    {
      "id": "narrative-map",
      "title": "Mapa de narrativas",
      "status": "proposed",
      "purpose": "Relacionar memórias com lugares públicos ou zonas aproximadas.",
      "components": [
        "map-marker",
        "filter-bar",
        "memory-card",
        "rights-notice"
      ],
      "flow": [
        "Ver mapa e lista",
        "Filtrar",
        "Selecionar narrativa",
        "Abrir detalhe"
      ],
      "risks": [
        "Exposição de localização sensível.",
        "Mapa sem alternativa textual."
      ],
      "demo": "pattern-map"
    },
    {
      "id": "project-page",
      "title": "Página do Projeto Comunitário",
      "status": "draft",
      "purpose": "Apresentar o programa guarda-chuva e conduzir às iniciativas.",
      "components": [
        "action-button",
        "language-selector",
        "project-footer"
      ],
      "flow": [
        "Compreender o projeto",
        "Explorar iniciativas",
        "Aceder ao Museu ou dados"
      ],
      "risks": [
        "Reduzir o projeto ao Museu.",
        "Menu institucional invadir a experiência imersiva."
      ],
      "demo": "pattern-project"
    },
    {
      "id": "initiative-page",
      "title": "Página de iniciativa",
      "status": "draft",
      "purpose": "Explicar escopo, método, estado, dados e resultados de uma iniciativa.",
      "components": [
        "publication-status",
        "source-reference",
        "rights-notice",
        "action-button"
      ],
      "flow": [
        "Definição",
        "Método",
        "Estado",
        "Resultados e participação"
      ],
      "risks": [
        "Misturar dados preliminares e publicados."
      ],
      "demo": "pattern-initiative"
    },
    {
      "id": "public-data-browser",
      "title": "Consulta de dados públicos",
      "status": "draft",
      "purpose": "Consultar releases anonimizadas com método e dicionário.",
      "components": [
        "filter-bar",
        "data-table",
        "source-reference",
        "publication-status"
      ],
      "flow": [
        "Escolher conjunto",
        "Ler metodologia",
        "Filtrar tabela",
        "Descarregar release"
      ],
      "risks": [
        "Expor dados pessoais.",
        "Visualização sem versão do dataset."
      ],
      "demo": "pattern-data"
    },
    {
      "id": "bibliography-viewer",
      "title": "Biblioteca e visualizador",
      "status": "draft",
      "purpose": "Localizar referências, páginas relevantes e documentos autorizados.",
      "components": [
        "filter-bar",
        "document-frame",
        "source-reference",
        "empty-state"
      ],
      "flow": [
        "Pesquisar referência",
        "Abrir metadados",
        "Consultar documento quando permitido",
        "Registar páginas"
      ],
      "risks": [
        "Publicar PDF protegido.",
        "Inventar páginas ou acesso."
      ],
      "demo": "pattern-library"
    },
    {
      "id": "participation-form",
      "title": "Contributo comunitário",
      "status": "draft",
      "purpose": "Receber narrativas e materiais como submissões ainda não publicadas.",
      "components": [
        "action-button",
        "rights-notice",
        "language-selector",
        "publication-status"
      ],
      "flow": [
        "Informação e consentimento",
        "Submissão",
        "Confirmação",
        "Revisão posterior"
      ],
      "risks": [
        "Confundir submissão com publicação.",
        "Consentimento insuficiente."
      ],
      "demo": "pattern-participation"
    },
    {
      "id": "rights-review",
      "title": "Correção, direitos e remoção",
      "status": "in-review",
      "purpose": "Receber e acompanhar pedidos relacionados com identificação, autoria, correção ou retirada.",
      "components": [
        "correction-link",
        "rights-notice",
        "publication-status",
        "action-button"
      ],
      "flow": [
        "Abrir pedido",
        "Selecionar motivo",
        "Fornecer referência",
        "Receber confirmação"
      ],
      "risks": [
        "Canal pouco visível.",
        "Prometer decisão automática."
      ],
      "demo": "pattern-rights"
    },
    {
      "id": "physical-panel",
      "title": "Painel e totem físico",
      "status": "draft",
      "purpose": "Aplicar identidade, escala, QR, certeza e direitos em suporte físico.",
      "components": [
        "caption-block",
        "confidence-indicator",
        "source-reference",
        "project-footer"
      ],
      "flow": [
        "Selecionar template",
        "Validar conteúdo",
        "Gerar prova",
        "Preflight e impressão"
      ],
      "risks": [
        "Texto pequeno.",
        "QR sem destino permanente.",
        "Imagem não autorizada."
      ],
      "demo": "pattern-panel"
    },
    {
      "id": "flutter-projection",
      "title": "Projeção para Flutter",
      "status": "proposed",
      "purpose": "Mapear componentes estáveis para a futura aplicação móvel.",
      "components": [
        "memory-card",
        "figure-viewer",
        "language-selector",
        "timeline-marker",
        "project-footer"
      ],
      "flow": [
        "Consumir API comum",
        "Mapear tokens",
        "Implementar acessibilidade",
        "Validar paridade"
      ],
      "risks": [
        "Criar segunda fonte de verdade.",
        "Iniciar antes da API e schemas estabilizados."
      ],
      "demo": "pattern-flutter"
    }
  ]
};
