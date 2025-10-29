import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        // 🔧 Fix "refractor/lib/core" and "refractor/lib/all" resolution
        find: "refractor/lib/core",
        replacement: path.resolve("node_modules/refractor/lib/core.js"),
      },
      {
        find: "refractor/lib/all",
        replacement: path.resolve("node_modules/refractor/lib/all.js"),
      },
      {
        // ✨ THIS IS THE NEW ALIAS TO FIX THE BUILD ERRORS
        find: "refractor/lang",
        replacement: path.resolve("node_modules/refractor/lang"),
      },
    ],
  },
  optimizeDeps: {
    include: ["react-syntax-highlighter", "refractor"],
  },
  preview: {
    port: 5173,
  },
  server: {
    open: true,
  },
});