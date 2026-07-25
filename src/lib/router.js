/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
export function getRoute() {
  const raw = location.hash.slice(1) || "/";
  const path = raw.split("?")[0].replace(/\/+$/, "") || "/";
  const query = Object.fromEntries(new URLSearchParams(raw.includes("?") ? raw.split("?")[1] : ""));

  if (path === "/") return { name:"home" };
  if (path === "/projeto") return { name:"project" };
  if (path === "/metodologia") return { name:"methodology" };
  if (path === "/iniciativas") return { name:"initiatives" };
  const initiative = path.match(/^\/iniciativas\/([a-z0-9-]+)$/);
  if (initiative) return { name:"initiative", slug:initiative[1] };
  if (path === "/conhecimento") return { name:"knowledge" };
  if (path === "/participar") return { name:"participate" };
  if (path === "/participar/contribuir") return { name:"public-contribution-new" };
  if (path === "/participar/contribuir/acompanhar") return { name:"public-contribution-track" };
  if (path === "/participar/retirada") return { name:"public-contribution-withdrawal" };
  if (path === "/sobre") return { name:"about" };
  if (path === "/exposicoes") return { name:"public-exhibitions" };


  if (path === "/entrar") return { name:"collab-login" };
  if (path === "/auth/callback") return { name:"collab-callback" };
  if (path === "/area-colaborativa") return { name:"collab-dashboard" };
  if (path === "/area-colaborativa/perfil") return { name:"collab-profile" };
  if (path === "/area-colaborativa/tarefas") return { name:"collab-tasks", query };
  const collabTask = path.match(/^\/area-colaborativa\/tarefas\/([^/]+)$/);
  if (collabTask) return { name:"collab-task-detail", taskId:decodeURIComponent(collabTask[1]) };
  if (path === "/area-colaborativa/disponibilidade") return { name:"collab-availability" };
  if (path === "/area-colaborativa/contributos") return { name:"collab-contributions" };
  if (path === "/area-colaborativa/contributos/novo") return { name:"collab-contribution-new" };
  const collabContribution = path.match(/^\/area-colaborativa\/contributos\/([^/]+)$/);
  if (collabContribution) return { name:"collab-contribution-detail", contributionId:decodeURIComponent(collabContribution[1]) };
  if (path === "/area-colaborativa/agenda") return { name:"collab-agenda", query };
  if (path === "/area-colaborativa/biblioteca") return { name:"collab-library", query };
  const collabLibraryResource = path.match(/^\/area-colaborativa\/biblioteca\/([^/]+)$/);
  if (collabLibraryResource) return { name:"collab-library-resource", resourceCode:decodeURIComponent(collabLibraryResource[1]) };
  if (path === "/area-colaborativa/formacao") return { name:"collab-training" };
  const collabTrainingTrail = path.match(/^\/area-colaborativa\/formacao\/([^/]+)$/);
  if (collabTrainingTrail) return { name:"collab-training-trail", trailCode:decodeURIComponent(collabTrainingTrail[1]) };
  if (path === "/area-colaborativa/revisao-museu") return { name:"collab-museum-review", query };
  const collabMuseumReviewPreview = path.match(/^\/area-colaborativa\/revisao-museu\/([^/]+)\/preview$/);
  if (collabMuseumReviewPreview) return { name:"collab-museum-review-preview", memoryId:decodeURIComponent(collabMuseumReviewPreview[1]) };
  const collabMuseumReviewDetail = path.match(/^\/area-colaborativa\/revisao-museu\/([^/]+)$/);
  if (collabMuseumReviewDetail) return { name:"collab-museum-review-detail", memoryId:decodeURIComponent(collabMuseumReviewDetail[1]) };
  if (path === "/area-colaborativa/gestao/revisao-museu") return { name:"collab-museum-review-management", query };
  if (path === "/area-colaborativa/gestao/revisao-museu/releases") return { name:"collab-museum-review-releases" };
  const collabMuseumReviewManagementPreview = path.match(/^\/area-colaborativa\/gestao\/revisao-museu\/([^/]+)\/preview$/);
  if (collabMuseumReviewManagementPreview) return { name:"collab-museum-review-management-preview", memoryId:decodeURIComponent(collabMuseumReviewManagementPreview[1]) };
  const collabMuseumReviewManagementDetail = path.match(/^\/area-colaborativa\/gestao\/revisao-museu\/([^/]+)$/);
  if (collabMuseumReviewManagementDetail) return { name:"collab-museum-review-management-detail", memoryId:decodeURIComponent(collabMuseumReviewManagementDetail[1]) };
  if (path === "/area-colaborativa/gestao/contributos") return { name:"collab-contribution-moderation", query };
  const collabContributionModeration = path.match(/^\/area-colaborativa\/gestao\/contributos\/([^/]+)$/);
  if (collabContributionModeration) return { name:"collab-contribution-moderation-detail", contributionId:decodeURIComponent(collabContributionModeration[1]) };
  if (path === "/area-colaborativa/gestao/perfis") return { name:"collab-profile-management" };
  const collabMember = path.match(/^\/area-colaborativa\/gestao\/perfis\/([^/]+)$/);
  if (collabMember) return { name:"collab-member-detail", userId:decodeURIComponent(collabMember[1]) };
  if (path === "/area-colaborativa/gestao/convites") return { name:"collab-invitations" };
  if (path === "/area-colaborativa/gestao/tarefas") return { name:"collab-task-management" };
  if (path === "/area-colaborativa/gestao/tarefas/nova") return { name:"collab-task-new" };
  const collabTaskEdit = path.match(/^\/area-colaborativa\/gestao\/tarefas\/([^/]+)\/editar$/);
  if (collabTaskEdit) return { name:"collab-task-edit", taskId:decodeURIComponent(collabTaskEdit[1]) };
  const collabTaskManage = path.match(/^\/area-colaborativa\/gestao\/tarefas\/([^/]+)$/);
  if (collabTaskManage) return { name:"collab-task-manage-detail", taskId:decodeURIComponent(collabTaskManage[1]) };
  if (path === "/area-colaborativa/gestao/agenda/novo") return { name:"collab-agenda-event-new", query };
  const collabAgendaEvent = path.match(/^\/area-colaborativa\/gestao\/agenda\/([^/]+)$/);
  if (collabAgendaEvent) return { name:"collab-agenda-event-edit", eventId:decodeURIComponent(collabAgendaEvent[1]), query };

  if (path === "/area-colaborativa/gestao/locais") return { name:"collab-venue-management" };
  if (path === "/area-colaborativa/gestao/locais/novo") return { name:"collab-venue-new" };
  const collabVenue = path.match(/^\/area-colaborativa\/gestao\/locais\/([^/]+)$/);
  if (collabVenue) return { name:"collab-venue-edit", venueId:decodeURIComponent(collabVenue[1]) };

  if (path === "/area-colaborativa/gestao/exposicoes") return { name:"collab-exhibition-management" };
  if (path === "/area-colaborativa/gestao/exposicoes/nova") return { name:"collab-exhibition-new" };
  const collabScheduleDetail = path.match(/^\/area-colaborativa\/gestao\/exposicoes\/agendamentos\/([^/]+)$/);
  if (collabScheduleDetail) return { name:"collab-schedule-detail", scheduleId:decodeURIComponent(collabScheduleDetail[1]) };
  const collabExhibitionEdit = path.match(/^\/area-colaborativa\/gestao\/exposicoes\/([^/]+)\/editar$/);
  if (collabExhibitionEdit) return { name:"collab-exhibition-edit", exhibitionId:decodeURIComponent(collabExhibitionEdit[1]) };
  const collabExhibitionSchedule = path.match(/^\/area-colaborativa\/gestao\/exposicoes\/([^/]+)\/agendar$/);
  if (collabExhibitionSchedule) return { name:"collab-schedule-new", exhibitionId:decodeURIComponent(collabExhibitionSchedule[1]), query };
  const collabExhibition = path.match(/^\/area-colaborativa\/gestao\/exposicoes\/([^/]+)$/);
  if (collabExhibition) return { name:"collab-exhibition-detail", exhibitionId:decodeURIComponent(collabExhibition[1]) };

  if (path === "/laboratorio/canais") return { name:"channel-lab" };
  const totemPreview = path.match(/^\/laboratorio\/totem\/(MM\d{6})$/);
  if (totemPreview) return { name:"totem-preview", id:totemPreview[1] };
  const panelPreview = path.match(/^\/laboratorio\/painel\/(MM\d{6})$/);
  if (panelPreview) return { name:"panel-preview", id:panelPreview[1] };

  if (path === "/museu") return { name:"museum-home" };
  if (path === "/museu/explorar") return { name:"gallery" };
  if (path === "/museu/linha-do-tempo") return { name:"timeline" };
  if (path === "/museu/colecoes") return { name:"collections" };
  const collection = path.match(/^\/museu\/colecoes\/([a-z0-9-]+)$/);
  if (collection) return { name:"collection", slug:collection[1] };
  const detail = path.match(/^\/museu\/memorias\/(MM\d{6})$/);
  if (detail) return { name:"memory", id:detail[1] };
  const immersive = path.match(/^\/museu\/imersivo\/(MM\d{6})$/);
  if (immersive) return { name:"immersive", id:immersive[1] };

  return { name:"not-found", path };
}

export function go(path) {
  location.hash = path;
}
