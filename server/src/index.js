/*
    Entry Point
    - GET /api/health
    - /api/projects -> projects.js
    - /api/tasks    -> tasks.js
*/
import express from "express";
import cors from "cors";
import { initDB } from "./db.js";
import projects from "./routes/projects.js";
import tasks from "./routes/tasks.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/projects", projects);
app.use("/api/tasks", tasks);

await initDB();
app.listen(5174, () => console.log("[API] http://localhost:5174"));
