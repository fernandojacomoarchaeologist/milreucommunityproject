---
copyright: "© 2026 Fernando Rodrigues de Jácomo"
project: "Projeto Comunitário de Milreu"
package: "06"
rights: "Consultar RIGHTS.md no repositório principal"
---

# Matriz página × componente

| Rota | Produto | Componentes |
|---|---|---|
| `/` | portal | ProjectHeader, HeroOpening, InitiativeCard, MemoryPreview, StandardFooter |
| `/projeto` | portal | ProjectHeader, EditorialSection, Timeline, SourceReference, StandardFooter |
| `/iniciativas` | portal | ProjectHeader, FilterBar, InitiativeCard, EmptyState, StandardFooter |
| `/iniciativas/:slug` | portal | ProjectHeader, EditorialSection, StatusBadge, RelatedRecords, StandardFooter |
| `/museu` | portal | ProjectHeader, MuseumOpening, MemoryPreview, TimelinePreview, RightsNotice, StandardFooter |
| `/conhecimento` | portal | ProjectHeader, SearchField, KnowledgeTypeCard, SourceReference, StandardFooter |
| `/dados` | portal | ProjectHeader, DatasetCard, PublicDataTable, DownloadAction, StandardFooter |
| `/biblioteca` | portal | ProjectHeader, FilterBar, BibliographicReference, DocumentViewerLink, StandardFooter |
| `/participar` | portal | ProjectHeader, EditorialSection, RightsNotice, ContactAction, StandardFooter |
| `/sobre` | portal | ProjectHeader, EditorialSection, PartnerList, CopyrightNotice, StandardFooter |
| `/museu/explorar` | museu | MuseumHeader, FilterBar, MemoryCard, EmptyState, MuseumFooter |
| `/museu/memorias/:id` | museu | MuseumHeader, PhotoViewer, CommunityNarrative, InstitutionalContext, ProvenanceNote, RightsNotice, RelatedRecords, MuseumFooter |
| `/museu/imersivo/:id` | museu | ImmersiveViewer, PreviousNext, ExitImmersive, LanguageToggle |
| `/museu/linha-do-tempo` | museu | MuseumHeader, Timeline, FilterBar, MemoryPreview, MuseumFooter |
| `/museu/colecoes` | museu | MuseumHeader, CollectionCard, MemoryPreview, EmptyState, MuseumFooter |
| `/pesquisa` | portal | ProjectHeader, SearchField, SearchResult, FilterBar, EmptyState, StandardFooter |
| `/404` | portal | ProjectHeader, EmptyState, PrimaryAction, StandardFooter |
| `/museu/memorias/:id/indisponivel` | museu | MuseumHeader, UnavailableState, PrimaryAction, MuseumFooter |
