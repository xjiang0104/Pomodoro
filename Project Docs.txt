1. Project Overview
The goal of this project is to develop a Pomodoro Technique Chrome Extension that allows users to manage projects, create tasks, and track focus sessions using a built-in Pomodoro timer. The primary objective is to build a demo-ready version within 5 days for local demonstration. Deployment and advanced features will be deferred to later stages.

2. Objectives
Implement a minimal but functional demo of a Pomodoro-based task manager.
Focus on core CRUD features and Pomodoro timer integration.
Prioritize user experience with a clean UI (using Chakra UI).
Keep backend simple using Node.js + Express + lowdb (JSON file storage).

3. Scope
In-Scope (for demo)
Projects
  Create project
  Delete project
Tasks
  Create task within a project
  Delete task
  Mark task as completed
Pomodoro Timer
  Start / Complete / Reset functionality
  Track elapsed time
  On completion → record one Pomodoro for the active task
  Display Mode： time bar mode and a full screen mode
  Display visual completion effect (confetti/toast)
  Local persistence using lowdb
UI
  Left panel: Project navigation
  Main panel: Task list for the selected project
  Bottom bar: Pomodoro timer

Out-of-Scope (future work)
  Authentication (Sign In / Sign Up)
  Detailed statistics (Estimated Time, Weekly reports, Graphs)
  Cloud database integration (MongoDB + Mongoose)
  Chrome Web Store deployment
  Notifications and reminders

4. Technology Stack
Frontend: React + Parcel+ Chakra UI
Backend: Node.js + Express
Database: lowdb (JSON file-based)
Others: TypeScript, REST API for frontend-backend communication

6. Milestones & Timeline (4 Days)
Day 1
Backend setup (Express + lowdb). API for Projects (CRUD). Frontend project setup (React + Chakra). Implement Project List UI.
Day 2
Implement Task API (CRUD). Frontend: Task List UI. Add / Delete tasks per project. Add Task completion status. Refine layout (Projects left, Tasks center)
Day 3
Build Pomodoro Timer component. Link timer with tasks (🍅 count). Add completion effects (toast/confetti).
Day 4
UI polishing (dark/hacker theme). Error handling & empty state UI. Final demo flow: Project → Task → Timer → Completion.

6. Risks & Mitigation
Time constraint (5 days): Keep MVP scope limited to CRUD + timer.
New technology learning curve: Use Chakra UI prebuilt components to speed up development.
Extension packaging: Postpone Chrome deployment to avoid blocking demo.

8. Deliverables
Functional demo running locally:
npm run dev (server)
npm run dev (frontend)

Source code structured with clear separation (server + web).
Documentation: Setup guide + Demo script.
Demo script: Walkthrough of project creation, task management, starting a Pomodoro, and visual completion effect.

