import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./apps/server",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "",
  },
  verbose: true,
  strict: true,
});
