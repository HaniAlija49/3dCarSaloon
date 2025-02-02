import { defineConfig } from "vite";

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three")) return "three"; // Separate three.js into a chunk
            return "vendor"; // Separate vendor dependencies
          }
        },
      },
    },
  },
});
