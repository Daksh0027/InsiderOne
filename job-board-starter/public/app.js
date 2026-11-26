const jobsList = document.getElementById("jobs");
const savedList = document.getElementById("saved");
const search = document.getElementById("search");

async function loadSavedJobs() {
  const res = await fetch("/api/saved");
  return await res.json();
}

async function loadAllJobs(query = "") {
  const res = await fetch(`/api/jobs?q=${encodeURIComponent(query)}`);
  return await res.json();
}

async function showSaved(jobs) {
  savedList.innerHTML = "";
  if (jobs.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No jobs saved yet.";
    li.className = "empty";
    savedList.append(li);
    return;
  }
  for (const job of jobs) {
    const li = document.createElement("li");

    const jobText = document.createElement("span");
    jobText.className = "job-text";
    jobText.textContent = `${job.title} at ${job.company}, ${job.location}. Rs ${job.stipend.toLocaleString("en-IN")} a month.`;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "×";
    removeBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await fetch(`/api/saved/${job.id}`, { method: "DELETE" });
      refresh();
    });

    li.append(jobText, removeBtn);
    savedList.append(li);
  }
}

async function showJobs(jobs) {
  jobsList.innerHTML = "";
  if (jobs.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No jobs found.";
    li.className = "empty";
    jobsList.append(li);
    return;
  }
  for (const job of jobs) {
    const li = document.createElement("li");

    const jobText = document.createElement("span");
    jobText.className = "job-text";
    jobText.textContent = `${job.title} at ${job.company}, ${job.location}. Rs ${job.stipend.toLocaleString("en-IN")} a month.`;

    const saveBtn = document.createElement("button");
    saveBtn.className = "save-btn";
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await fetch("/api/saved", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
      });
      refresh();
    });

    li.append(jobText, saveBtn);
    jobsList.append(li);
  }
}

async function refresh() {
  const [saved, jobs] = await Promise.all([loadSavedJobs(), loadAllJobs(search.value)]);
  showSaved(saved);
  showJobs(jobs);
}

search.addEventListener("input", () => refresh());
refresh();