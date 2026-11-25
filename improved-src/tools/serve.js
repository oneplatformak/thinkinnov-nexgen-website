#!/usr/bin/env node
/**
 * Local preview server that behaves like the production Apache configuration
 * in docs/.htaccess for the things that affect testing: gzip compression,
 * the cache lifetimes, the security headers including the
 * Content-Security-Policy, the custom 404 page and the blocked inc/ folder.
 * It does not run PHP.
 *
 * Usage: node improved-src/tools/serve.js [port]   (default 8812)
 */
const fs = require("fs");
const http = require("http");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.join(__dirname, "..", "..", "docs");
const PORT = Number(process.argv[2] || 8812);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "application/javascript; charset=utf-8",
  ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml",
  ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2",
};
const CSP = fs.readFileSync(path.join(ROOT, ".htaccess"), "utf8").match(/Content-Security-Policy "([^"]+)"/)[1];

function cacheFor(ext) {
  if ([".css", ".js", ".woff2"].includes(ext)) return "public, max-age=31536000, immutable";
  if ([".webp", ".jpg", ".png", ".svg", ".ico"].includes(ext)) return "public, max-age=2592000";
  return "no-cache";
}

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split("?")[0]);
    if (rel.endsWith("/")) rel += "index.html";
    let file = path.join(ROOT, rel);
    let status = 200;
    const blocked = rel.startsWith("/inc/") || /(^|\/)\./.test(rel) || rel.endsWith(".php");
    if (blocked || !file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      status = blocked ? 403 : 404;
      file = path.join(ROOT, "404.html");
    }
    const ext = path.extname(file);
    const headers = {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": cacheFor(ext),
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "SAMEORIGIN",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
      "Content-Security-Policy": CSP,
    };
    let body = fs.readFileSync(file);
    if (/text|javascript|json|xml|svg/.test(headers["Content-Type"]) && /\bgzip\b/.test(req.headers["accept-encoding"] || "")) {
      body = zlib.gzipSync(body);
      headers["Content-Encoding"] = "gzip";
      headers.Vary = "Accept-Encoding";
    }
    res.writeHead(status, headers);
    res.end(req.method === "HEAD" ? undefined : body);
  })
  .listen(PORT, "127.0.0.1", () => console.log(`Serving docs/ on http://127.0.0.1:${PORT}/ with the production headers`));
