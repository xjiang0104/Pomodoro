/*
    Project Routes
    - GET /projects         // get all projects
    - POST /projects        // create new project { name }
    - DELETE /projects/:id  // delete a project (and its tasks) 
*/
import { Router } from "express";
import { db } from "../db.js";
import crypto from "node:crypto";

const r = Router();

r.get("/", async (_req, res) => {
  await db.read();
  res.json(db.data.projects);
});

r.post("/", async (req, res) => {
  const name = (req.body?.name ?? "").trim();
  if (!name) return res.status(400).json({ error: "name is required" });
  const p = { id: crypto.randomUUID(), name, createdAt: Date.now() };
  await db.read();
  db.data.projects.push(p);
  await db.write();
  res.status(201).json(p);
});

r.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await db.read();
  db.data.projects = db.data.projects.filter((p) => p.id !== id);
  db.data.tasks = db.data.tasks.filter((t) => t.projectId !== id);
  await db.write();
  res.sendStatus(204);
});

export default r;
