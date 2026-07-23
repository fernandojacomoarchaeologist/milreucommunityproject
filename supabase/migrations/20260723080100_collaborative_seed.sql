-- Seed de funções, permissões e módulos da Área Colaborativa.

insert into public.collab_roles(code,name,description) values
('master','Master do sistema','Acesso integral e gestão do sistema.'),
('coordinator','Coordenador','Coordenação de membros, conteúdos, tarefas e atividades.'),
('volunteer','Voluntário','Participação em tarefas, contributos e atividades.'),
('reviewer','Revisor','Revisão editorial, histórica, documental ou museológica.'),
('researcher','Investigador','Investigação, documentação e análise.'),
('translator','Tradutor','Tradução e revisão linguística.'),
('partner','Parceiro','Consulta e colaboração institucional.'),
('observer','Observador','Consulta sem responsabilidades operacionais.')
on conflict (code) do update set name=excluded.name,description=excluded.description;

insert into public.collab_permissions(code,name,description) values
('area.view','Consultar área colaborativa','Aceder ao espaço interno.'),
('profile.self.manage','Gerir o próprio perfil','Atualizar os próprios dados básicos.'),
('access.request','Pedir acesso','Submeter ou atualizar pedido de acesso.'),
('tasks.view','Consultar tarefas','Ver tarefas disponíveis e atribuídas.'),
('tasks.accept','Aceitar tarefas','Aceitar e atualizar tarefas próprias.'),
('tasks.manage','Gerir tarefas','Criar, atribuir e encerrar tarefas.'),
('contributions.view-own','Consultar contributos próprios','Ver contributos submetidos pelo membro.'),
('contributions.submit','Submeter contributos','Enviar memórias, fotografias, correções ou referências.'),
('contributions.moderate','Moderar contributos','Analisar e encaminhar contributos.'),
('agenda.view','Consultar agenda','Ver eventos, reuniões e exposições.'),
('exhibitions.manage','Gerir exposições','Gerir locais, períodos e estado das exposições.'),
('library.view','Consultar biblioteca','Ver documentação interna.'),
('library.manage','Gerir biblioteca','Publicar e organizar materiais internos.'),
('training.view','Consultar formação','Aceder a percursos formativos.'),
('training.manage','Gerir formação','Criar e organizar conteúdos de formação.'),
('museum.review','Rever Museu','Rever registos e propor alterações.'),
('museum.approve','Aprovar Museu','Aprovar decisões editoriais.'),
('memberships.view','Consultar membros','Ver perfis e pedidos de acesso.'),
('memberships.manage','Gerir membros','Aprovar, suspender e arquivar membros.'),
('roles.manage','Gerir funções','Atribuir e remover funções e permissões.'),
('audit.view','Consultar auditoria','Consultar histórico de ações.')
on conflict (code) do update set name=excluded.name,description=excluded.description;

insert into public.collab_role_permissions(role_code,permission_code)
select 'master',code from public.collab_permissions
on conflict do nothing;

insert into public.collab_role_permissions(role_code,permission_code) values
('coordinator','area.view'),('coordinator','profile.self.manage'),
('coordinator','tasks.view'),('coordinator','tasks.accept'),('coordinator','tasks.manage'),
('coordinator','contributions.view-own'),('coordinator','contributions.submit'),('coordinator','contributions.moderate'),
('coordinator','agenda.view'),('coordinator','exhibitions.manage'),
('coordinator','library.view'),('coordinator','library.manage'),
('coordinator','training.view'),('coordinator','training.manage'),
('coordinator','museum.review'),('coordinator','museum.approve'),
('coordinator','memberships.view'),('coordinator','memberships.manage'),('coordinator','audit.view'),

('volunteer','area.view'),('volunteer','profile.self.manage'),
('volunteer','tasks.view'),('volunteer','tasks.accept'),
('volunteer','contributions.view-own'),('volunteer','contributions.submit'),
('volunteer','agenda.view'),('volunteer','library.view'),('volunteer','training.view'),

('reviewer','area.view'),('reviewer','profile.self.manage'),
('reviewer','contributions.view-own'),('reviewer','agenda.view'),
('reviewer','library.view'),('reviewer','training.view'),('reviewer','museum.review'),

('researcher','area.view'),('researcher','profile.self.manage'),
('researcher','tasks.view'),('researcher','contributions.view-own'),
('researcher','contributions.submit'),('researcher','agenda.view'),
('researcher','library.view'),('researcher','training.view'),('researcher','museum.review'),

('translator','area.view'),('translator','profile.self.manage'),
('translator','tasks.view'),('translator','tasks.accept'),('translator','agenda.view'),
('translator','library.view'),('translator','training.view'),('translator','museum.review'),

('partner','area.view'),('partner','profile.self.manage'),('partner','agenda.view'),('partner','library.view'),
('observer','area.view'),('observer','profile.self.manage'),('observer','agenda.view'),('observer','library.view')
on conflict do nothing;

insert into public.collab_modules(code,name,route,description,status,required_permission,sort_order) values
('dashboard','Início','/area-colaborativa','Resumo do vínculo, próximos passos e módulos disponíveis.','active','area.view',10),
('profile','O meu perfil','/area-colaborativa/perfil','Nome, e-mail, perfil principal e preferências básicas.','active','profile.self.manage',20),
('tasks','As minhas tarefas','/area-colaborativa/tarefas','Tarefas de voluntariado, investigação, digitalização e apoio.','skeleton','tasks.view',30),
('contributions','Contributos','/area-colaborativa/contributos','Fotografias, memórias, correções, referências e documentos submetidos.','skeleton','contributions.view-own',40),
('agenda','Agenda e exposições','/area-colaborativa/agenda','Calendário de atividades e percurso da exposição física itinerante.','skeleton','agenda.view',50),
('library','Biblioteca','/area-colaborativa/biblioteca','Guias, procedimentos, consentimentos e documentação interna.','skeleton','library.view',60),
('training','Formação','/area-colaborativa/formacao','Percursos de formação para voluntários e colaboradores.','skeleton','training.view',70),
('museum-review','Revisão do Museu','/area-colaborativa/revisao-museu','Futura revisão editorial e curatorial das 31 memórias.','skeleton','museum.review',80),
('profile-management','Gestão de perfis','/area-colaborativa/gestao/perfis','Pedidos de acesso, perfis, estados e funções.','foundation','memberships.manage',90),
('exhibition-management','Gestão de exposições','/area-colaborativa/gestao/exposicoes','Locais, períodos e estado da exposição itinerante.','skeleton','exhibitions.manage',100)
on conflict (code) do update set
name=excluded.name,route=excluded.route,description=excluded.description,
status=excluded.status,required_permission=excluded.required_permission,sort_order=excluded.sort_order;
