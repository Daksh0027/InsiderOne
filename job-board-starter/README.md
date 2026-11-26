# Job board starter

A small job board for an insiderOne work sample. It is made up: the jobs and
companies are not real.

## Run it

You need Node 20 or newer. There are no packages to install.

```
npm start      # then open http://localhost:3000
npm test       # runs the tests in test/
```

## What is here

- `server.js`: the web server. `GET /api/jobs?q=` lists jobs, `GET /` serves the page.
- `lib/jobs.js`: reading and searching the jobs. Pure functions.
- `jobs.json`: the jobs.
- `public/`: the page and its script.
- `test/`: tests, using Node's built-in test runner.

## Your task

See the work sample brief on insiderOne: add saved jobs (save, list, remove),
with tests, and add a short section to this README about what you built.

---

## What I built

Added a "Save job" feature so people can bookmark jobs they're interested in and come back to them later.

**The feature includes:**
- A **Save** button on each job in the main list — clicking it moves the job to a "Saved Jobs" section at the top of the page
- A **Saved Jobs** list that persists across page reloads (stored in a JSON file on the server)
- A red **×** button on each saved job to remove it
- Three API endpoints:
  - `POST /api/saved` — save a job (with `{ "jobId": "..." }`)
  - `GET /api/saved` — list all saved jobs with full details
  - `DELETE /api/saved/:jobId` — remove a saved job
- Error handling: saving the same job twice keeps one copy; unknown job IDs return a clear 400 error instead of crashing
- Tests for the new functionality using Node's built-in test runner

**How it works on the frontend:**
- The page loads both the saved jobs and all jobs in parallel
- Search still filters the main job list
- Clicking Save/Remove calls the API and refreshes both lists automatically
- The UI uses flexbox so Save buttons line up vertically on the right, and the red × buttons sit at the end of each saved item

## How to run it

```bash
npm start      # starts the server on http://localhost:3000
npm test       # runs all 7 tests (3 original + 4 new for saved jobs)
```

No `npm install` needed — Node 20+ has everything built in.

## One decision I made and why

**I kept saved jobs in a separate `saved-jobs.json` file instead of adding a `saved` field to each job in `jobs.json`.**

Reason: the original `jobs.json` is the "source of truth" for job listings — it's static data that shouldn't change. Mixing user-specific state (which jobs *this person* saved) into that file would conflate two different things. A separate file keeps concerns clean: `jobs.json` = job catalog, `saved-jobs.json` = user's bookmarks. It also makes it trivial to reset saved jobs without touching the job data, and the file stays small since it only stores IDs like `["j1", "j3"]`.

## What I'd do next

- Add a visual indicator on the main list showing which jobs are already saved (so you don't accidentally click Save twice)
- Persist saved jobs in `localStorage` as a backup, so the UI feels instant even before the server responds
- Add a "Saved only" filter toggle to show just your bookmarked jobs
- If this were real, I'd add user accounts so saved jobs are per-user instead of global — right now everyone shares the same saved list
