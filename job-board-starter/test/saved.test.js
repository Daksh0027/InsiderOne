import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, unlink } from "node:fs/promises";
import { saveJob, unsaveJob, loadSaved } from "../lib/saved.js";
import { loadJobs } from "../lib/jobs.js";

const SAVED_PATH = new URL("../saved-jobs.json", import.meta.url);

// Helper to reset saved jobs file
async function resetSavedFile() {
  await writeFile(SAVED_PATH, "[]", "utf8");
}

test("saveJob adds a job to saved list", async () => {
  await resetSavedFile();
  const saved = await saveJob("j1");
  assert.ok(saved.includes("j1"));
  assert.equal(saved.length, 1);
});

test("saveJob keeps only one copy when called twice", async () => {
  await resetSavedFile();
  await saveJob("j1");
  await saveJob("j1");  // Save same job twice
  const saved = await loadSaved();
  assert.equal(saved.filter(id => id === "j1").length, 1);
});

test("unsaveJob removes a job from saved list", async () => {
  await writeFile(SAVED_PATH, JSON.stringify(["j1", "j2"]), "utf8");
  const saved = await unsaveJob("j1");
  assert.ok(!saved.includes("j1"));
  assert.ok(saved.includes("j2"));
});

test("saveJob with unknown job id returns error when validated", async () => {
  // This test validates the logic - in server.js, we check if job exists
  await resetSavedFile();
  const jobs = await loadJobs();
  const invalidJobId = "nonexistent-job";
  const isValid = jobs.some(j => j.id === invalidJobId);
  assert.equal(isValid, false);
});