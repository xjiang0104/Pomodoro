/*
    Task Routes
    - GET /tasks            // get all tasks, or ?projectId=xxx
    - POST /tasks           // create new task { projectId, title, estimate? }
    - PATCH /tasks/:id      // update task { done?, title?, pomodoros? }
    - DELETE /tasks/:id     // delete a task
*/
import { Router } from "express";
import { db } from "../db.js";
import crypto from "node:crypto";

const r = Router();

// List ?projectId=xxx
r.get("/", async (req, res) => {
  await db.read();
  const { projectId } = req.query;
  const list = projectId
    ? db.data.tasks.filter((t) => t.projectId === projectId)
    : db.data.tasks;
  res.json(list);
});

// Create { projectId, title, estimate? }
r.post("/", async (req, res) => {
  const projectId = (req.body?.projectId ?? "").trim();
  const title = (req.body?.title ?? "").trim();
  if (!projectId) return res.status(400).json({ error: "projectId required" });
  if (!title) return res.status(400).json({ error: "title required" });

  // NEW: default estimate = 1, clamp to 1..12
  let estimate = Number.parseInt(req.body?.estimate, 10);
  if (!Number.isFinite(estimate) || estimate < 1) estimate = 1;
  if (estimate > 12) estimate = 12;

  const t = {
    id: crypto.randomUUID(),
    projectId,
    title,
    done: false,
    pomodoros: 0, // completed tomatoes
    estimate, // planned tomatoes
    createdAt: Date.now(),
  };

  await db.read();
  db.data.tasks.push(t);
  await db.write();
  res.status(201).json(t);
});

// Patch /:id { done?, title?, pomodoros? }
r.patch("/:id", async (req, res) => {
  const { id } = req.params;
  await db.read();
  const t = db.data.tasks.find((x) => x.id === id);
  if (!t) return res.sendStatus(404);
  if (typeof req.body.done === "boolean") t.done = req.body.done;
  if (typeof req.body.title === "string")
    t.title = req.body.title.trim() || t.title;
  if (typeof req.body.pomodoros === "number") t.pomodoros = req.body.pomodoros;
  await db.write();
  res.json(t);
});

// Delete /:id
r.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.read();
  db.data.tasks = db.data.tasks.filter((t) => t.id !== id);
  await db.write();
  res.sendStatus(204);
});

export default r;
