import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "db.json");

const defaultData = { projects: [], tasks: [] };

await fs.access(DB_PATH).catch(async () => {
  await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
});

const adapter = new JSONFile(DB_PATH);
export const db = new Low(adapter, defaultData);

export async function initDB() {
  await db.read();
  if (!db.data) {
    db.data = defaultData;
    await db.write();
  }
}
