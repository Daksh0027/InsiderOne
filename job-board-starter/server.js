// A small job board: a JSON API and one page. Run with `npm start`.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { loadJobs, searchJobs, findJob } from "./lib/jobs.js";
import { loadSaved, saveJob, unsaveJob } from "./lib/saved.js";

const PORT = Number(process.env.PORT ?? 3000);

function sendJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

export function createApp() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      if (req.method === "GET" && url.pathname === "/api/jobs") {
        const jobs = await loadJobs();
        return sendJson(res, 200, searchJobs(jobs, url.searchParams.get("q")));
      }
      if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/app.js")) {
        const file = url.pathname === "/" ? "index.html" : "app.js";
        const type = file.endsWith(".html") ? "text/html" : "text/javascript";
        const body = await readFile(new URL(`./public/${file}`, import.meta.url));
        res.writeHead(200, { "content-type": `${type}; charset=utf-8` });
        return res.end(body);
      }
      // GET saved jobs
      if(req.method === "GET" && url.pathname === "/api/saved") {
        const savedIds = await loadSaved();
        const jobs = await loadJobs();
        const savedJobs = savedIds.map((id) => findJob(jobs, id)).filter((j) => j !== null);
        return sendJson(res, 200, savedJobs);
      }
      // Save a job
      if (req.method === "POST" && url.pathname === "/api/saved") {
        let body = "";
        for await (const chunk of req) {
          body += chunk;
        }
        const data = JSON.parse(body);
        if (!data.jobId) {
          return sendJson(res, 400, { error: "jobId is required" });
        }
        const jobs = await loadJobs();
        if (!findJob(jobs, data.jobId)) {
          return sendJson(res, 400, { error: "Unknown job id" });
        }
        const saved = await saveJob(data.jobId);
        return sendJson(res, 200, { saved, count: saved.length });
      }

      // Remove a job from saved
      if (req.method === "DELETE" && url.pathname.startsWith("/api/saved/")) {
        const jobId = url.pathname.split("/").pop();
        const saved = await unsaveJob(jobId);
        return sendJson(res, 200, { saved, count: saved.length });
      }
      sendJson(res, 404, { error: "Not found" });
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { error: "Something went wrong" });
    }
  });
}

// Started directly (npm start), not imported by a test.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(PORT, () => console.log(`Job board on http://localhost:${PORT}`));
}
