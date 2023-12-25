import type { Config } from "drizzle-kit";
import "dotenv/config";

export default {
  schema: "./src/db/*.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env["DB_URL"] ?? "",
    authToken: process.env["DB_TOKEN"] ?? "",
  },
} satisfies Config;
