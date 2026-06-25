import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

function getGitHubPagesBase() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) return "/";

  const [owner, repo] = repository.split("/");
  if (!owner || !repo) return "/";

  return repo.toLowerCase() === `${owner.toLowerCase()}.github.io` ? "/" : `/${repo}/`;
}

export default defineConfig({
  root: appRoot,
  base: process.env.GITHUB_ACTIONS ? getGitHubPagesBase() : "/",
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5174,
    strictPort: false,
    fs: {
      allow: [fileURLToPath(new URL("..", import.meta.url))],
    },
  },
  build: {
    outDir: `${appRoot}/dist`,
    emptyOutDir: true,
    rollupOptions: {
      input: `${appRoot}/index.html`,
    },
  },
});
