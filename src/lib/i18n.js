/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
export const languages = ["pt-PT", "en", "es", "fr"];

const ui = {
  "pt-PT": {
    collectionsLabel:"Coleções", museumAbout:"Sobre o acervo", knownDate:"Data conhecida", unknownDate:"Data incerta", digitalIntervention:"Intervenção digital", withIntervention:"Com intervenção declarada", withoutIntervention:"Sem intervenção declarada", sort:"Ordenar", catalogOrder:"Ordem do catálogo", oldestFirst:"Mais antigas primeiro", newestFirst:"Mais recentes primeiro", resetFilters:"Limpar filtros", activeFilters:"Filtros ativos", collectionDerived:"Coleção de navegação derivada", viewCollection:"Explorar coleção", collectionMembers:"memórias", documentation:"Documentação", dateAndPlace:"Data e lugar", tags:"Temas e palavras-chave", sourceList:"Fontes", digitalNotice:"Intervenções digitais declaradas", aiRetouchedBadge:"Retocada por IA", aiDisclosureTitle:"Imagem derivada com retoque por inteligência artificial", aiDisclosureText:"Este registo recebeu retoque substantivo por IA e pode conter detalhes reconstruídos ou alterados. Está visível para revisão e não deve ser confundido com a fotografia original.", reviewVisible:"Em revisão", publicReleasePending:"Não aprovada para lançamento público", relatedExplicit:"Relações registadas", suggestedExplore:"Também pode explorar", suggestedNotice:"Sugestões calculadas por palavras-chave partilhadas; não representam uma relação histórica confirmada.", immersiveInfo:"Informação", hideInfo:"Ocultar informação", browserFullscreen:"Ecrã inteiro do navegador", position:"posição", keyboardHelp:"Setas: navegar · I: informação · F: ecrã inteiro · Esc: fechar", showAll:"Mostrar tudo", undated:"Data não determinada", datePrecision:"Precisão da data", place:"Lugar", editorialState:"Estado editorial", sourceAccess:"Acesso", rightsCorrection:"Correção ou retirada", rightsCorrectionText:"A fotografia está autorizada para publicação no projeto. Para comunicar uma correção, preocupação ou pedido de retirada, consulte a área Participar.", museumStats:"O acervo nesta pré-visualização", visibleRecords:"memórias visíveis", documentedInterventions:"registos com intervenções declaradas", timelineKnown:"Com data ou intervalo", timelineUnknown:"Sem data determinada", openImmersive:"Abrir modo imersivo", projectObjective:"Objetivo do projeto", accessMuseum:"Aceder ao Museu", slideshow:"Modo slide", pauseSlideshow:"Pausar", carouselPrevious:"Destaque anterior", carouselNext:"Destaque seguinte", carouselPause:"Pausar carrossel", carouselResume:"Retomar carrossel", carouselSelect:"Selecionar destaque", viewGrid:"Grelha", viewList:"Lista", resultsUpdated:"Resultados atualizados",
    project:"Projeto", methodology:"Metodologia", initiatives:"Iniciativas", museum:"Museu",
    knowledge:"Experiência Proteus", about:"Sobre", participate:"Participar", explore:"Explorar",
    timeline:"Linha temporal", backProject:"Voltar ao Projeto", homeTitle:"Projeto Comunitário de Milreu",
    homeLead:"Memórias, conhecimento e participação em torno de Milreu.", enterMuseum:"Entrar no Museu",
    discoverProject:"Conhecer o projeto", museumTitle:"Museu de Memórias de Milreu",
    museumLead:"Uma experiência visual sobre as relações entre pessoas, comunidade, paisagem, Estoi e Milreu.",
    gallery:"Memórias", search:"Pesquisar", period:"Período", type:"Tipo", all:"Todos",
    results:"registos", community:"Narrativa comunitária", context:"Contexto", objective:"Descrição",
    provenance:"Proveniência e créditos", rights:"Direitos e publicação", relations:"Memórias relacionadas",
    fullscreen:"Ecrã inteiro", close:"Fechar", previous:"Anterior", next:"Seguinte",
    unavailable:"Este registo não está disponível no site",
    unavailableText:"A imagem permanece no repositório para auditoria, mas está bloqueada na experiência pública devido à natureza da intervenção digital.",
    returnGallery:"Regressar à galeria", fallback:"Texto apresentado em português por ausência de tradução revista.",
    preliminary:"Pré-visualização editorial", noResults:"Nenhuma memória corresponde aos filtros.",
    portalFeature:"O portal orienta", museumFeature:"O museu imerge", proteusFeature:"Proteus estrutura",
    portalFeatureText:"Um ponto de entrada para o projeto, iniciativas, conhecimento e participação.",
    museumFeatureText:"Fotografias, narrativas, contexto e relações numa exploração visual.",
    proteusFeatureText:"A mesma fonte de dados alimentará o site, os totens e futuras aplicações.",
    featured:"Algumas memórias", featuredLead:"As fotografias autorizadas permitem experimentar o Museu com o acervo real.",
    viewAll:"Ver todas as memórias", notFound:"Página não encontrada", principles:"Princípios",
    projectPath:"Percurso do projeto", currentInitiatives:"Iniciativas em desenvolvimento",
    learnMore:"Conhecer", status:"Estado", structuredKnowledge:"Experiência Proteus",
    participationWays:"Formas de participar", contactPending:"O canal público de contacto será configurado antes da publicação.",
    organisations:"Articulação institucional", protectedMuseum:"Evolução incremental do Museu",
    protectedMuseumText:"O detalhe, a galeria e o modo de ecrã inteiro permanecem funcionais enquanto o Portal evolui."
  },
  en: {
    collectionsLabel:"Collections", museumAbout:"About the collection", knownDate:"Known date", unknownDate:"Uncertain date", digitalIntervention:"Digital intervention", withIntervention:"Declared intervention", withoutIntervention:"No declared intervention", sort:"Sort", catalogOrder:"Catalogue order", oldestFirst:"Oldest first", newestFirst:"Newest first", resetFilters:"Reset filters", activeFilters:"Active filters", collectionDerived:"Derived navigation collection", viewCollection:"Explore collection", collectionMembers:"memories", documentation:"Documentation", dateAndPlace:"Date and place", tags:"Themes and keywords", sourceList:"Sources", digitalNotice:"Declared digital interventions", aiRetouchedBadge:"AI retouched", aiDisclosureTitle:"Derived image retouched with artificial intelligence", aiDisclosureText:"This record received substantive AI retouching and may contain reconstructed or altered details. It is visible for review and must not be confused with the original photograph.", reviewVisible:"Under review", publicReleasePending:"Not approved for public release", relatedExplicit:"Recorded relations", suggestedExplore:"You may also explore", suggestedNotice:"Suggestions are calculated from shared keywords and do not represent a confirmed historical relation.", immersiveInfo:"Information", hideInfo:"Hide information", browserFullscreen:"Browser fullscreen", position:"position", keyboardHelp:"Arrows: navigate · I: information · F: fullscreen · Esc: close", showAll:"Show all", undated:"Undetermined date", datePrecision:"Date precision", place:"Place", editorialState:"Editorial state", sourceAccess:"Access", rightsCorrection:"Correction or withdrawal", rightsCorrectionText:"The photograph is authorised for project publication. To report a correction, concern or withdrawal request, use the Participate area.", museumStats:"The collection in this preview", visibleRecords:"visible memories", documentedInterventions:"records with declared interventions", timelineKnown:"With date or range", timelineUnknown:"Without a determined date", openImmersive:"Open immersive mode", projectObjective:"Project objective", accessMuseum:"Open the Museum", slideshow:"Slideshow", pauseSlideshow:"Pause", carouselPrevious:"Previous highlight", carouselNext:"Next highlight", carouselPause:"Pause carousel", carouselResume:"Resume carousel", carouselSelect:"Select highlight", viewGrid:"Grid", viewList:"List", resultsUpdated:"Results updated",
    project:"Project", methodology:"Methodology", initiatives:"Initiatives", museum:"Museum",
    knowledge:"Proteus Experience", about:"About", participate:"Participate", explore:"Explore",
    timeline:"Timeline", backProject:"Back to Project", homeTitle:"Milreu Community Project",
    homeLead:"Memories, knowledge and participation around Milreu.", enterMuseum:"Enter the Museum",
    discoverProject:"Discover the project", museumTitle:"Milreu Museum of Memories",
    museumLead:"A visual experience about relationships between people, community, landscape, Estoi and Milreu.",
    gallery:"Memories", search:"Search", period:"Period", type:"Type", all:"All", results:"records",
    community:"Community narrative", context:"Context", objective:"Description", provenance:"Provenance and credits",
    rights:"Rights and publication", relations:"Related memories", fullscreen:"Fullscreen", close:"Close",
    previous:"Previous", next:"Next", unavailable:"This record is not available on the site",
    unavailableText:"The image remains in the repository for audit, but is blocked from the public experience because of the nature of the digital intervention.",
    returnGallery:"Return to gallery", fallback:"Portuguese text shown because no reviewed translation is available.",
    preliminary:"Editorial preview", noResults:"No memory matches the filters.", portalFeature:"The portal guides",
    museumFeature:"The museum immerses", proteusFeature:"Proteus structures",
    portalFeatureText:"A gateway to the project, initiatives, knowledge and participation.",
    museumFeatureText:"Photographs, narratives, context and relations in a visual exploration.",
    proteusFeatureText:"The same data source will feed the site, physical totems and future applications.",
    featured:"Selected memories", featuredLead:"Authorised photographs allow the Museum to be tested with the real collection.",
    viewAll:"View all memories", notFound:"Page not found", principles:"Principles",
    projectPath:"Project path", currentInitiatives:"Initiatives in development", learnMore:"Learn more",
    status:"Status", structuredKnowledge:"Proteus Experience", participationWays:"Ways to participate",
    contactPending:"The public contact channel will be configured before publication.",
    organisations:"Institutional coordination", protectedMuseum:"Incremental Museum evolution",
    protectedMuseumText:"Detail, gallery and fullscreen mode remain functional while the Portal evolves."
  },
  es: {
    collectionsLabel:"Colecciones", museumAbout:"Sobre la colección", knownDate:"Fecha conocida", unknownDate:"Fecha incierta", digitalIntervention:"Intervención digital", withIntervention:"Con intervención declarada", withoutIntervention:"Sin intervención declarada", sort:"Ordenar", catalogOrder:"Orden del catálogo", oldestFirst:"Más antiguas primero", newestFirst:"Más recientes primero", resetFilters:"Limpiar filtros", activeFilters:"Filtros activos", collectionDerived:"Colección de navegación derivada", viewCollection:"Explorar colección", collectionMembers:"memorias", documentation:"Documentación", dateAndPlace:"Fecha y lugar", tags:"Temas y palabras clave", sourceList:"Fuentes", digitalNotice:"Intervenciones digitales declaradas", aiRetouchedBadge:"Retocada con IA", aiDisclosureTitle:"Imagen derivada retocada con inteligencia artificial", aiDisclosureText:"Este registro recibió un retoque sustantivo con IA y puede contener detalles reconstruidos o alterados. Está visible para revisión y no debe confundirse con la fotografía original.", reviewVisible:"En revisión", publicReleasePending:"No aprobada para publicación pública", relatedExplicit:"Relaciones registradas", suggestedExplore:"También puede explorar", suggestedNotice:"Las sugerencias se calculan por palabras clave compartidas y no representan una relación histórica confirmada.", immersiveInfo:"Información", hideInfo:"Ocultar información", browserFullscreen:"Pantalla completa del navegador", position:"posición", keyboardHelp:"Flechas: navegar · I: información · F: pantalla completa · Esc: cerrar", showAll:"Mostrar todo", undated:"Fecha no determinada", datePrecision:"Precisión de la fecha", place:"Lugar", editorialState:"Estado editorial", sourceAccess:"Acceso", rightsCorrection:"Corrección o retirada", rightsCorrectionText:"La fotografía está autorizada para publicación en el proyecto. Para comunicar una corrección, preocupación o retirada, consulte Participar.", museumStats:"La colección en esta vista previa", visibleRecords:"memorias visibles", documentedInterventions:"registros con intervenciones declaradas", timelineKnown:"Con fecha o intervalo", timelineUnknown:"Sin fecha determinada", openImmersive:"Abrir modo inmersivo", projectObjective:"Objetivo del proyecto", accessMuseum:"Acceder al Museo", slideshow:"Modo presentación", pauseSlideshow:"Pausar", carouselPrevious:"Destaque anterior", carouselNext:"Destaque siguiente", carouselPause:"Pausar carrusel", carouselResume:"Reanudar carrusel", carouselSelect:"Seleccionar destaque", viewGrid:"Cuadrícula", viewList:"Lista", resultsUpdated:"Resultados actualizados",
    project:"Proyecto", methodology:"Metodología", initiatives:"Iniciativas", museum:"Museo",
    knowledge:"Experiencia Proteus", about:"Sobre el proyecto", participate:"Participar", explore:"Explorar",
    timeline:"Cronología", backProject:"Volver al Proyecto", homeTitle:"Proyecto Comunitario de Milreu",
    homeLead:"Memorias, conocimiento y participación en torno a Milreu.", enterMuseum:"Entrar en el Museo",
    discoverProject:"Conocer el proyecto", museumTitle:"Museo de Memorias de Milreu",
    museumLead:"Una experiencia visual sobre las relaciones entre personas, comunidad, paisaje, Estoi y Milreu.",
    gallery:"Memorias", search:"Buscar", period:"Periodo", type:"Tipo", all:"Todos", results:"registros",
    community:"Narrativa comunitaria", context:"Contexto", objective:"Descripción", provenance:"Procedencia y créditos",
    rights:"Derechos y publicación", relations:"Memorias relacionadas", fullscreen:"Pantalla completa", close:"Cerrar",
    previous:"Anterior", next:"Siguiente", unavailable:"Este registro no está disponible en el sitio",
    unavailableText:"La imagen permanece en el repositorio para auditoría, pero está bloqueada en la experiencia pública por la naturaleza de la intervención digital.",
    returnGallery:"Volver a la galería", fallback:"Texto en portugués por falta de traducción revisada.",
    preliminary:"Vista previa editorial", noResults:"Ninguna memoria coincide con los filtros.",
    portalFeature:"El portal orienta", museumFeature:"El museo sumerge", proteusFeature:"Proteus estructura",
    portalFeatureText:"Una entrada al proyecto, iniciativas, conocimiento y participación.",
    museumFeatureText:"Fotografías, narrativas, contexto y relaciones en una exploración visual.",
    proteusFeatureText:"La misma fuente de datos alimentará el sitio, los tótems y futuras aplicaciones.",
    featured:"Algunas memorias", featuredLead:"Las fotografías autorizadas permiten probar el Museo con la colección real.",
    viewAll:"Ver todas las memorias", notFound:"Página no encontrada", principles:"Principios",
    projectPath:"Recorrido del proyecto", currentInitiatives:"Iniciativas en desarrollo", learnMore:"Conocer",
    status:"Estado", structuredKnowledge:"Experiencia Proteus", participationWays:"Formas de participar",
    contactPending:"El canal público de contacto se configurará antes de la publicación.",
    organisations:"Articulación institucional", protectedMuseum:"Evolución incremental del Museo",
    protectedMuseumText:"El detalle, la galería y el modo de pantalla completa siguen funcionando mientras evoluciona el Portal."
  },
  fr: {
    collectionsLabel:"Collections", museumAbout:"À propos de la collection", knownDate:"Date connue", unknownDate:"Date incertaine", digitalIntervention:"Intervention numérique", withIntervention:"Intervention déclarée", withoutIntervention:"Sans intervention déclarée", sort:"Trier", catalogOrder:"Ordre du catalogue", oldestFirst:"Plus anciennes", newestFirst:"Plus récentes", resetFilters:"Réinitialiser", activeFilters:"Filtres actifs", collectionDerived:"Collection de navigation dérivée", viewCollection:"Explorer la collection", collectionMembers:"mémoires", documentation:"Documentation", dateAndPlace:"Date et lieu", tags:"Thèmes et mots-clés", sourceList:"Sources", digitalNotice:"Interventions numériques déclarées", aiRetouchedBadge:"Retouchée par IA", aiDisclosureTitle:"Image dérivée retouchée par intelligence artificielle", aiDisclosureText:"Cette notice a reçu une retouche substantielle par IA et peut contenir des détails reconstruits ou modifiés. Elle est visible pour révision et ne doit pas être confondue avec la photographie originale.", reviewVisible:"En révision", publicReleasePending:"Non approuvée pour publication publique", relatedExplicit:"Relations enregistrées", suggestedExplore:"Vous pouvez aussi explorer", suggestedNotice:"Les suggestions sont calculées à partir de mots-clés partagés et ne constituent pas une relation historique confirmée.", immersiveInfo:"Information", hideInfo:"Masquer l’information", browserFullscreen:"Plein écran du navigateur", position:"position", keyboardHelp:"Flèches : naviguer · I : information · F : plein écran · Échap : fermer", showAll:"Tout afficher", undated:"Date indéterminée", datePrecision:"Précision de la date", place:"Lieu", editorialState:"État éditorial", sourceAccess:"Accès", rightsCorrection:"Correction ou retrait", rightsCorrectionText:"La photographie est autorisée pour la publication du projet. Pour signaler une correction, une préoccupation ou un retrait, consultez Participer.", museumStats:"La collection dans cet aperçu", visibleRecords:"mémoires visibles", documentedInterventions:"notices avec interventions déclarées", timelineKnown:"Avec date ou intervalle", timelineUnknown:"Sans date déterminée", openImmersive:"Ouvrir le mode immersif", projectObjective:"Objectif du projet", accessMuseum:"Accéder au Musée", slideshow:"Diaporama", pauseSlideshow:"Pause", carouselPrevious:"Élément précédent", carouselNext:"Élément suivant", carouselPause:"Mettre le carrousel en pause", carouselResume:"Reprendre le carrousel", carouselSelect:"Sélectionner un élément", viewGrid:"Grille", viewList:"Liste", resultsUpdated:"Résultats mis à jour",
    project:"Projet", methodology:"Méthodologie", initiatives:"Initiatives", museum:"Musée",
    knowledge:"Expérience Proteus", about:"À propos", participate:"Participer", explore:"Explorer",
    timeline:"Chronologie", backProject:"Retour au Projet", homeTitle:"Projet Communautaire de Milreu",
    homeLead:"Mémoires, connaissances et participation autour de Milreu.", enterMuseum:"Entrer dans le Musée",
    discoverProject:"Découvrir le projet", museumTitle:"Musée des Mémoires de Milreu",
    museumLead:"Une expérience visuelle sur les relations entre les personnes, la communauté, le paysage, Estoi et Milreu.",
    gallery:"Mémoires", search:"Rechercher", period:"Période", type:"Type", all:"Tous", results:"notices",
    community:"Récit communautaire", context:"Contexte", objective:"Description", provenance:"Provenance et crédits",
    rights:"Droits et publication", relations:"Mémoires associées", fullscreen:"Plein écran", close:"Fermer",
    previous:"Précédente", next:"Suivante", unavailable:"Cette notice n’est pas disponible sur le site",
    unavailableText:"L’image reste dans le dépôt pour audit, mais elle est bloquée dans l’expérience publique en raison de la nature de l’intervention numérique.",
    returnGallery:"Retour à la galerie", fallback:"Texte portugais affiché faute de traduction révisée.",
    preliminary:"Aperçu éditorial", noResults:"Aucune mémoire ne correspond aux filtres.",
    portalFeature:"Le portail oriente", museumFeature:"Le musée immerge", proteusFeature:"Proteus structure",
    portalFeatureText:"Une porte d’entrée vers le projet, les initiatives, les connaissances et la participation.",
    museumFeatureText:"Photographies, récits, contexte et relations dans une exploration visuelle.",
    proteusFeatureText:"La même source de données alimentera le site, les totems et les futures applications.",
    featured:"Quelques mémoires", featuredLead:"Les photographies autorisées permettent de tester le Musée avec la collection réelle.",
    viewAll:"Voir toutes les mémoires", notFound:"Page introuvable", principles:"Principes",
    projectPath:"Parcours du projet", currentInitiatives:"Initiatives en développement", learnMore:"Découvrir",
    status:"État", structuredKnowledge:"Expérience Proteus", participationWays:"Participer",
    contactPending:"Le canal public de contact sera configuré avant la publication.",
    organisations:"Articulation institutionnelle", protectedMuseum:"Évolution progressive du Musée",
    protectedMuseumText:"Le détail, la galerie et le mode plein écran restent fonctionnels pendant l’évolution du Portail."
  }
};

export const text = (lang, key) => ui[lang]?.[key] ?? ui["pt-PT"][key] ?? key;

export function localised(value, lang) {
  if (!value || typeof value !== "object") return { value: value ?? "", fallback: false };
  const selected = value[lang];
  if (selected) return { value: selected, fallback: false };
  return { value: value["pt-PT"] ?? "", fallback: lang !== "pt-PT" };
}
