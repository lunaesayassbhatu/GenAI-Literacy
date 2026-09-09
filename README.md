
<div align="center">

# 🧠 GenAI Literacy App
### Arizona State University

*A web-based educational application for GenAI literacy research*

---

![TypeScript](https://img.shields.io/badge/TypeScript-98%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

</div>

---

## 📌 What is this?

This app was built as part of a research project at the **Learning Engineering Institute (LEI) at Arizona State University**. The project brought together an interdisciplinary team — spanning learning science, educational technology, and software engineering — to address a concrete problem: people hold a lot of **misconceptions about Generative AI**, and those misconceptions affect how they use, trust, and critically evaluate AI tools.

The goal of this app is to close that gap through targeted, evidence-informed interactive learning — not just explaining how GenAI works, but actively surfacing and correcting the specific misunderstandings learners bring in. It is a full-stack web application with a React/TypeScript frontend, a Supabase backend for persistent user data, and continuous deployment via Vercel.

### Features
- **Learning Modules** — structured interactive lessons on GenAI concepts
- **Mini-games** — in-module games to reinforce concepts
- **XP & Leveling System** — players earn XP for completing modules and games; progress persists across devices
- **Day Streaks** — tracks consecutive daily check-ins to encourage return visits
- **Badges** — per-game and milestone badges awarded automatically
- **High Score Tracking** — per-game leaderboard history stored in Supabase
- **Multi-profile Support** — full data isolation between user accounts; cross-device sync via Supabase

### Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Backend / Database | Supabase (PostgreSQL + Auth + RLS) |
| Hosting | Vercel (auto-deploys from `main`) |
| State | localStorage (hydrated from Supabase on login) |

> **🔒 Private Repo** - You must be added as a collaborator before you can access this repository. Contact [Asmi Kachare](mailto:asmikachare@gmail.com) to request access.

---

## 🚀 Deployment

The app is live at **[gen-ai-literacy-asu.vercel.app](https://gen-ai-literacy-asu.vercel.app)** and auto-deploys on every push to `main`. Supabase environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are configured in the Vercel project settings.

For local development, create a `.env.local` file at the project root:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ▶️ Running the App

You have two ways to run this project.

### Option A - Run on Your Mac (Recommended)

This is the most stable setup for this repo.

#### Step 1 - Open Terminal and go to the project folder

```bash
cd "/Users/<your-username>/Desktop/Web-Based Educational Game (Asmi's Copy)"
```

#### Step 2 - Install dependencies

```bash
npm install
```

#### Step 3 - Start the dev server

```bash
npm run dev
```

Then open the URL printed in terminal (usually `http://localhost:5173`).

---

### Option B - GitHub Codespaces (Browser Only)

Codespaces runs on Linux. It works fine, but dependency folders can differ from macOS.

#### First Time in Codespaces

Step 1 - Open the repo

👉 https://github.com/asmikachare/GenAI-Literacy-App-ASU

Step 2 - Launch Codespace

1. Click the green **`<> Code`** button
2. Open the **`Codespaces`** tab
3. Click **`Create codespace on main`**

Step 3 - Go to the project folder in Codespaces terminal

```bash
cd "/workspaces/GenAI-Literacy-App-ASU/Desktop/Web-Based Educational Game (Asmi's Copy)"
```

Step 4 - Install and run

```bash
npm install
npm run dev
```

Open port `5173` from the **Ports** tab.

#### Next Time in Codespaces (View Latest Version)

If the Codespace already exists, reopen it from the **Codespaces** tab and run:

```bash
cd "/workspaces/GenAI-Literacy-App-ASU/Desktop/Web-Based Educational Game (Asmi's Copy)"
git pull --rebase origin main
npm install
npm run dev
```

#### Next Time in Codespaces (If You Made Changes and Want to Save Them)

Run this sequence:

```bash
cd "/workspaces/GenAI-Literacy-App-ASU/Desktop/Web-Based Educational Game (Asmi's Copy)"
git status
git add src README.md package.json
git commit -m "Describe your change"
git pull --rebase origin main
git push origin main
npm run dev
```

If `git pull --rebase` stops because you still have unstaged edits:

```bash
git stash -u
git pull --rebase origin main
git stash pop
```

---

## ⚠️ Git Rules for This Repo

This repo currently includes dependency/build artifacts, so be careful when switching between Mac and Codespaces.

### Always check before commit

```bash
git status
```

### Do not commit platform-specific dependency churn

Avoid committing `node_modules` changes generated by a different OS.

If Codespaces shows lots of Linux/macOS dependency diffs, reset them:

```bash
git restore --worktree --staged node_modules package-lock.json
git clean -fd node_modules
```

### Commit only project files you intended

Typical safe paths:
- `src/`
- `package.json`
- `README.md`
- config files (`vite.config.ts`, etc.)

### Sync before push

```bash
git pull --rebase origin main
git push origin main
```

---

## 🛠️ Troubleshooting

<details>
<summary><b>❌ npm error: ENOENT - cannot find package.json</b></summary>

You are in the wrong folder.

Mac:
```bash
cd "/Users/<your-username>/Desktop/Web-Based Educational Game (Asmi's Copy)"
```

Codespaces:
```bash
cd "/workspaces/GenAI-Literacy-App-ASU/Desktop/Web-Based Educational Game (Asmi's Copy)"
```

</details>

<details>
<summary><b>❌ git push rejected (fetch first)</b></summary>

Remote has new commits you do not have locally.

```bash
git pull --rebase origin main
git push origin main
```

</details>

<details>
<summary><b>🌐 Port 5173 not visible in Codespaces</b></summary>

Make sure `npm run dev` is still running. Restart if needed:

```bash
npm run dev
```

</details>

---

## 👩‍💻 Team

| Name | Role |
|---|---|
| Maria Goldshtein | Team Lead / Advisor / Mentor / Researcher |
| Halle Goral | Researcher / UX Researcher |
| Joanne Lin | UI/UX Developer / Researcher |
| Asmi Kachare | Software Developer |

*Learning Engineering Institute — Arizona State University*
  
