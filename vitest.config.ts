import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests-e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@components": path.resolve(__dirname, "./components"),
      "@features": path.resolve(__dirname, "./features"),
      "@lib": path.resolve(__dirname, "./lib"),
      "@hooks": path.resolve(__dirname, "./hooks"),
      "@services": path.resolve(__dirname, "./services"),
      "@providers": path.resolve(__dirname, "./providers"),
      "@app-types": path.resolve(__dirname, "./types"),
      "@constants": path.resolve(__dirname, "./constants"),
      "@utils": path.resolve(__dirname, "./utils"),
      "@styles": path.resolve(__dirname, "./styles"),
    },
  },
});
