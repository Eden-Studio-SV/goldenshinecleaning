import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/unit/**/*.test.ts", "test/integration/**/*.test.ts"],
    fileParallelism: false,
    coverage: { provider: "v8", include: ["src/**/*.ts"], reporter: ["text", "json-summary"] },
  },
});
