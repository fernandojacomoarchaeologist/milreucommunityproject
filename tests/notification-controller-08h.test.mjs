/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import test from"node:test";import assert from"node:assert/strict";import{readFileSync}from"node:fs";
const controller=readFileSync("src/collab/controller.js","utf8");
test("workspace remoto carrega inbox, preferências e operação",()=>{for(const value of["collab_notifications","collab_notification_preferences","collab_notification_channels","collab_notification_operations_08h"])assert.ok(controller.includes(value));});
test("controller possui polling controlado",()=>{assert.match(controller,/startNotificationPolling/);assert.match(controller,/stopNotificationPolling/);assert.match(controller,/Math\.max\(30/);});
test("controller cobre operação completa",()=>{for(const method of["markNotification","saveNotificationPreferences","saveNotificationTemplate","updateNotificationChannel","sendTestNotification","queueInvitationEmail","retryNotificationOutbox","cancelNotificationOutbox"])assert.ok(controller.includes(`async ${method}`));});
test("demo não ativa e-mail",()=>{assert.match(controller,/email_enabled:Boolean\(item\.defaultEmail\)&&false/);assert.match(controller,/status:"disabled",provider:"disabled"/);});
