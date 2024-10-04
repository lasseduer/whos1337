import { Client } from "pg";

export function getDbClient(): Client {
  return new Client({
    connectionString: process.env.POSTGRES_URL
});
}
