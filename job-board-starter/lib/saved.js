import { readFile, writeFile } from "node:fs/promises";

const SAVED_PATH = new URL("../saved-jobs.json", import.meta.url);

export async function loadSaved() {
  try {
    const raw = await readFile(SAVED_PATH, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

export async function saveJob(jobId) {
  const saved = await loadSaved(); // load the current saved jobs
  if (!saved.includes(jobId)) { // only add if not already saved
    saved.push(jobId);
    await writeFile(SAVED_PATH, JSON.stringify(saved, null, 2), "utf8"); //convert array to a JSON string and write it to the file
  }
  return saved;
}

export async function unsaveJob(jobId) {
  const saved = await loadSaved();
  const newSaved = saved.filter((id) => id !== jobId);
  await writeFile(SAVED_PATH, JSON.stringify(newSaved, null, 2), "utf8");
  return newSaved;
}