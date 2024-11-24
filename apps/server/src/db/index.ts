import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

/**
 * Cache database connection to single instance
 */
const globalDb = globalThis as unknown as {
  conn: Pool | undefined;
};

export const conn: Pool =
  globalDb.conn ??
  new Pool({
    connectionString: "",
  });

if (process.env.NODE_ENV !== "development") globalDb.conn = conn;

/**
 * export database instance
 */
export const db = drizzle(conn, {
  schema,
  logger: true,
});
