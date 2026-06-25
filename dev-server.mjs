import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
const rootDir = resolve(siteDir, "..");
const port = Number(process.env.PORT || 5174);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf"
};

function resolvePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const relative = decoded === "/" ? "/ai-portfolio-website/index.html" : decoded;
  const filePath = normalize(join(rootDir, relative));

  if (!filePath.startsWith(rootDir)) return null;
  return filePath;
}

function sendFile(req, res, filePath) {
  const stat = statSync(filePath);
  const range = req.headers.range;
  const contentType = mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";

  res.setHeader("Accept-Ranges", "bytes");
  res.setHeader("Content-Type", contentType);

  if (range) {
    const match = range.match(/bytes=(\d*)-(\d*)/);
    if (!match) {
      res.writeHead(416);
      res.end();
      return;
    }

    const start = match[1] ? Number(match[1]) : 0;
    const end = match[2] ? Number(match[2]) : stat.size - 1;

    if (start >= stat.size || end >= stat.size || start > end) {
      res.writeHead(416, { "Content-Range": `bytes */${stat.size}` });
      res.end();
      return;
    }

    res.writeHead(206, {
      "Content-Length": end - start + 1,
      "Content-Range": `bytes ${start}-${end}/${stat.size}`
    });
    createReadStream(filePath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, { "Content-Length": stat.size });
  createReadStream(filePath).pipe(res);
}

createServer((req, res) => {
  const filePath = resolvePath(req.url || "/");

  if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  sendFile(req, res, filePath);
}).listen(port, "127.0.0.1", () => {
  console.log(`Portfolio preview: http://127.0.0.1:${port}/ai-portfolio-website/index.html`);
});
