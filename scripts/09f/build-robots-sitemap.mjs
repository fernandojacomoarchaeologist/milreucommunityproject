/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 *
 * Pacote 09F — robots.txt e sitemap.xml POR AMBIENTE. robots não é controlo de privacidade.
 * Enquanto a indexação não for permitida por ambiente aprovado (preview/sem origem), o
 * robots.txt bloqueia tudo (Disallow: /) e NÃO se emite sitemap (URLs absolutas exigem
 * origem aprovada). Com origem aprovada e indexação permitida, o sitemap deriva do
 * inventário (apenas index, público, publicado, self-canonical) + páginas estáticas de
 * memórias públicas elegíveis; lastmod vem de alteração editorial verificável, não do build.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const read = (p) => JSON.parse(readFileSync(p, "utf8"));

export function buildRobotsAndSitemap(outputRoot = "dist") {
  const seo = read("public/config/seo.runtime.json");
  const origin = (process.env.MILREU_PUBLIC_BASE_URL || seo.publicOrigin || "").replace(/\/+$/, "") || null;
  const indexingAllowed = seo.indexingAllowed === true && Boolean(origin);
  mkdirSync(outputRoot, { recursive: true });

  // robots.txt
  let robots;
  if (indexingAllowed) {
    robots = [
      "# Projeto Comunitário de Milreu — produção aprovada",
      "User-agent: *",
      "Allow: /",
      "Disallow: /area-colaborativa",
      "Disallow: /entrar",
      "Disallow: /auth/",
      "Disallow: /participar/contribuir",
      "Disallow: /participar/retirada",
      "Disallow: /laboratorio",
      `Sitemap: ${origin}/sitemap.xml`,
      "",
    ].join("\n");
  } else {
    robots = [
      "# Projeto Comunitário de Milreu — pré-visualização não indexável (sem domínio aprovado)",
      "User-agent: *",
      "Disallow: /",
      "",
    ].join("\n");
  }
  writeFileSync(join(outputRoot, "robots.txt"), robots);

  // sitemap.xml — só com origem aprovada e indexação permitida.
  let sitemapCount = 0;
  if (indexingAllowed) {
    const inv = read("reports/seo-route-inventory-09f.json");
    const urls = [];
    for (const r of inv.routes) {
      if (r.inSitemap && r.canonical) urls.push({ loc: r.canonical, lastmod: null });
    }
    // Páginas estáticas de memórias públicas elegíveis (MM202617 excluída pelo builder estático).
    const memories = read("public/data/memories.json").records
      .filter((m) => m.publication.siteVisible && m.publication.publicReleaseEligible !== false);
    for (const m of memories) {
      urls.push({ loc: `${origin}/museu/memorias/${m.id}/`, lastmod: m.revision?.updatedAt || null });
    }
    sitemapCount = urls.length;
    const body = urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${String(u.lastmod).slice(0, 10)}</lastmod>` : ""}</url>`).join("\n");
    writeFileSync(join(outputRoot, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
  }

  return { indexingAllowed, origin, sitemapCount, robotsMode: indexingAllowed ? "allow-public" : "disallow-all" };
}

// Execução direta (fora do build) para inspeção.
if (import.meta.url === `file://${process.argv[1]}`) {
  const out = buildRobotsAndSitemap("dist");
  console.log(`Pacote 09F: robots/sitemap — modo=${out.robotsMode}, origem=${out.origin || "pendente"}, urls no sitemap=${out.sitemapCount}.`);
}
