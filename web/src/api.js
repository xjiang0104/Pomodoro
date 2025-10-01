//* API functions for frontend to call backend
const BASE = "http://localhost:5174/api";

// -------- Projects --------
export async function listProjects() {
  const r = await fetch(`${BASE}/projects`);
  if (!r.ok) throw new Error("listProjects failed");
  return r.json();
}
export async function createProject(name) {
  const r = await fetch(`${BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!r.ok) throw new Error("createProject failed");
  return r.json();
}
export async function deleteProject(id) {
  const r = await fetch(`${BASE}/projects/${id}`, { method: "DELETE" });
  if (!r.ok && r.status !== 204) throw new Error("deleteProject failed");
}

// -------- Tasks --------
export async function listTasks(projectId) {
  const q = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  const r = await fetch(`${BASE}/tasks${q}`);
  if (!r.ok) throw new Error("listTasks failed");
  return r.json();
}
export async function createTask(projectId, title, estimate) {
  const r = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, title, estimate }),
  });
  if (!r.ok) throw new Error("createTask failed");
  return r.json();
}
export async function patchTask(id, patch) {
  const r = await fetch(`${BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!r.ok) throw new Error("patchTask failed");
  return r.json();
}
export async function deleteTask(id) {
  const r = await fetch(`${BASE}/tasks/${id}`, { method: "DELETE" });
  if (!r.ok && r.status !== 204) throw new Error("deleteTask failed");
}
