import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cpSync, existsSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
const sourceAssets = fileURLToPath(new URL("./assets", import.meta.url));
const buildAssets = fileURLToPath(new URL("./dist/assets", import.meta.url));

function getGitHubPagesBase() {
  const repository = process.env.GITHUB_REPOSITORY;
  if (!repository) return "/";

  const [owner, repo] = repository.split("/");
  if (!owner || !repo) return "/";

  return repo.toLowerCase() === `${owner.toLowerCase()}.github.io` ? "/" : `/${repo}/`;
}

function copyStaticAssets() {
  return {
    name: "copy-static-assets",
    closeBundle() {
      if (existsSync(sourceAssets)) {
        cpSync(sourceAssets, buildAssets, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  root: appRoot,
  base: process.env.GITHUB_ACTIONS ? getGitHubPagesBase() : "/",
  plugins: [react(), copyStaticAssets()],
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
