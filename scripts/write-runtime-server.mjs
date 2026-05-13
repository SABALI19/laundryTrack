import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, "..", "dist");
const serverPath = path.join(distDir, "server.js");

const serverSource = `import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = __dirname;
const indexFile = path.join(distDir, "index.html");
const port = Number(process.env.PORT || 5173);
const host = "0.0.0.0";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

const sendFile = async (response, filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";
  const fileContents = await readFile(filePath);

  response.writeHead(200, { "Content-Type": contentType });
  response.end(fileContents);
};

const resolveFilePath = async (requestPath) => {
  const normalizedPath = requestPath === "/" ? "/index.html" : requestPath;
  const safePath = path.normalize(normalizedPath).replace(/^([.][.][/\\\\])+/, "");
  const candidatePath = path.join(distDir, safePath);
  const relativePath = path.relative(distDir, candidatePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Invalid path");
  }

  try {
    const fileStat = await stat(candidatePath);

    if (fileStat.isFile()) {
      return candidatePath;
    }
  } catch {
    return null;
  }

  return null;
};

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", "http://localhost");
    const requestedFile = await resolveFilePath(requestUrl.pathname);

    if (requestedFile) {
      await sendFile(response, requestedFile);
      return;
    }

    await sendFile(response, indexFile);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Unable to serve application.");
  }
});

server.listen(port, host, () => {
  console.log(\`Serving Washa frontend at http://\${host}:\${port}\`);
});
`;

await mkdir(distDir, { recursive: true });
await writeFile(serverPath, serverSource, "utf8");
