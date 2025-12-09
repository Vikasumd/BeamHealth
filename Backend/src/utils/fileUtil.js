import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readJSON(fileName) {
  const filePath = path.join(__dirname, "../data", fileName);
  return await fs.readJSON(filePath);
}

export async function writeJSON(fileName, data) {
  const filePath = path.join(__dirname, "../data", fileName);
  return await fs.writeJSON(filePath, data, { spaces: 2 });
}
