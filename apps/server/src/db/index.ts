import dotenv from "dotenv";
dotenv.config();
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
  new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

if (process.env.NODE_ENV !== "production") globalDb.conn = conn;

// Test database connection
(async () => {
  try {
    console.log(`db url: `, process.env.DATABASE_URL);
    const client = await conn.connect();
    console.log("Database connected successfully");
    client.release(); // Release the client back to the pool
  } catch (error: any) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit the process if the connection fails
  }
})();

export const db = drizzle(conn, {
  schema,
  logger: true,
});
