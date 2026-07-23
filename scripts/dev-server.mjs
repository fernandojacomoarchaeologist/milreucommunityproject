/**
 * © 2026 Fernando Rodrigues de Jácomo.
 * Produzido no âmbito do Projeto Comunitário de Milreu.
 * Consultar RIGHTS.md.
 */
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";

const args = process.argv.slice(2);
const rootArg = args.includes("--root") ? args[args.indexOf("--root") + 1] : ".";
const portArg = args.includes("--port") ? Number(args[args.indexOf("--port") + 1]) : 4173;
const root = resolve(rootArg);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

function safePath(pathname) {
  const relative = pathname.replace(/^\/+/, "");
  const candidate = resolve(join(root, relative));
  if (candidate !== root && !candidate.startsWith(root + sep)) {
    throw new Error("Caminho inválido");
  }
  return candidate;
}

const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let file = safePath(pathname);
    let info;
    try { info = await stat(file); } catch { info = null; }
    if (info?.isDirectory()) file = join(file, "index.html");
    if (!info && !extname(file)) file = join(root, "index.html");
    const data = await readFile(file);
    res.writeHead(200, {
      "Content-Type": mime[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(portArg, "127.0.0.1", () => {
  console.log(`Milreu 07D.1: http://127.0.0.1:${portArg}`);
});
