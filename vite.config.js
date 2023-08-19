/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {},
  },
  test: {
    include: ["test/*.test.{ts,js}"],
  },
});
