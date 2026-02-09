# HSE App — Health, Safety & Environment Metrics Platform

## Overview

HSE App is a full-stack web application built to track and manage Health, Safety & Environment (HSE) metrics across different projects. HSE coordinators log in, select a project, and either submit new leading indicator reports (audits, safety walks, training hours, etc.) or view aggregated lagging indicator data (injuries, fatalities, lost time incidents) per contractor.

The application is split into two independent parts:

- **Backend** — A Node.js / Express REST API connected to a PostgreSQL database via Prisma ORM.
- **Frontend** — A React single-page application built with Vite and styled with Tailwind CSS.

---

## Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | React 18, Vite, Tailwind CSS, React Router    |
| Backend    | Node.js, Express                              |
| ORM        | Prisma (with `@prisma/adapter-pg` for native PostgreSQL driver) |
| Database   | PostgreSQL                                    |
| Language   | JavaScript (ES Modules throughout)            |

---

## Project Structure

```
hse-app/
├── Backend/
│   ├── index.js                  # Express server entry point, defines routes
│   ├── lagging_indicators_api.js # Static/seed data for lagging indicators (mock external API)
│   ├── package.json
│   ├── controllers/              # Route handlers (thin layer)
│   │   ├── apiController.js      # Serves lagging indicator seed data
│   │   ├── loginController.js    # Username-based authentication
│   │   ├── projectController.js  # Project listing & project data retrieval
│   │   └── reportController.js   # HSE report creation
│   ├── lib/
│   │   ├── prisma.js             # Prisma client instantiation (PostgreSQL adapter)
│   │   └── callAPI.js            # Functions to import seed data into the database
│   ├── prisma/
│   │   ├── schema.prisma         # Database schema definition
│   │   ├── seed.js               # Database seeding script
│   │   └── migrations/           # Prisma migration files
│   └── repositories/             # Data access layer (Prisma queries)
│       ├── loginRepository.js    # Account lookup
│       ├── projectRepository.js  # Project & lagging indicator queries
│       └── reportRepository.js   # HSE report insert
│
└── Frontend/
    ├── index.html                # HTML entry point
    ├── vite.config.js            # Vite configuration (React + Tailwind plugins)
    ├── package.json
    └── src/
        ├── App.jsx               # React Router setup (defines page routes)
        ├── main.jsx              # React DOM render entry point
        ├── components/
        │   ├── MetricForm.jsx    # Form component for submitting leading indicators
        │   └── Navbar.jsx        # Top navigation bar (username display, logout)
        ├── constants/
        │   ├── editableMetricsDefinitions.js   # Leading indicator field definitions
        │   └── externalMetricsDefinitions.js   # Lagging indicator field definitions
        └── pages/
            ├── Login.jsx         # Login page (username-based)
            ├── Projects.jsx      # Project selection page
            └── ProjectMetrics.jsx# Main dashboard: metric input & lagging data view
```

---

## Database Schema

The PostgreSQL database is managed by Prisma and contains five tables:

### `Project`
Stores project records (e.g. ship-building project codes like `N80002`).

### `Contractors`
Stores contractor/subcontractor names (e.g. "Almaco", "Subcontractor_1").

### `HSE_Report` (Leading Indicators)
Each row is a submitted HSE report tied to a project and contractor. Fields:
- `HSEAudits`, `safetyWalks`, `toolboxTalks` — safety activity counts
- `workingHours`, `trainingHours` — time-based metrics
- `jobSafetyAnalysis` — number of JSAs performed
- `timeStamp` — reporting date

### `Lagging_Indicators`
Injury and incident records per project/contractor. Fields:
- `LWC` — Lost Workday Cases
- `FA` — First Aid cases
- `MTI` — Medical Treatment Injuries
- `RTW` — Restricted Work / Return To Work
- `Fatality`, `PPD` (Permanent Partial Disability), `PTD` (Permanent Total Disability)
- `timeStamp`

### `Accounts`
Simple username-only accounts for coordinator login (no passwords).

All indicator tables reference `Project` and `Contractors` via foreign keys (`projectId`, `contractorId`).

---

## Backend Architecture

The backend follows a **Controller → Repository** pattern:

1. **`index.js`** — Sets up Express with CORS and JSON body parsing. Defines four route groups:
   - `GET /api/nc_tool` — Returns static lagging indicator seed data (simulates an external NC Tool API).
   - `GET /projects` — Lists all projects (id + name).
   - `GET /projects/data?projectId=X` — Returns aggregated lagging indicators per contractor for a project.
   - `POST /report` — Creates a new HSE leading indicator report.
   - `POST /login` — Validates a username against the `Accounts` table.

2. **Controllers** (`controllers/`) — Thin handler functions that parse request data and delegate to repositories.

3. **Repositories** (`repositories/`) — Data access functions using the Prisma client:
   - `projectRepository.js` — `getProjects()` fetches project names; `getProjectData()` uses Prisma `groupBy` to aggregate lagging indicators per contractor.
   - `reportRepository.js` — `newReport()` inserts a new `HSE_Report` row.
   - `loginRepository.js` — `check()` looks up a username in the `Accounts` table.

4. **Lib** (`lib/`) — Shared utilities:
   - `prisma.js` — Creates and exports a single `PrismaClient` instance using the native PostgreSQL adapter (`@prisma/adapter-pg`). Connection string comes from the `DATABASE_URL` environment variable.
   - `callAPI.js` — Seed helper functions (`apiProjects`, `apiContractors`, `apiLaggingIndicators`) that fetch from the `/api/nc_tool` endpoint and upsert/insert records into the database.

5. **Seed Script** (`prisma/seed.js`) — Seeds the database by creating a default account (`Almaco26`), then calling the `callAPI` functions to populate projects, contractors, and lagging indicators from the static data source.

---

## Frontend Architecture

The frontend is a React SPA with three pages managed by React Router:

### Pages

1. **Login (`/`)** — A simple username input form. On submit, sends `POST /login` to verify the username exists. If valid, stores the username in `localStorage` and navigates to the projects page.

2. **Projects (`/projects`)** — Fetches the project list from `GET /projects` and renders a dropdown selector. The user picks a project and clicks "Continue to Metrics" to navigate to the project detail page.

3. **ProjectMetrics (`/projects/:id`)** — The main working page with two tabs:
   - **Input Metrics** — Shows the `MetricForm` component where the coordinator submits leading indicator data (audits, safety walks, training hours, etc.). The form supports two personnel types: "Almaco" personnel (all metrics except working hours) and "Contractor" (working hours only). Successful submission shows a confirmation modal.
   - **Lagging Indicators** — Displays a read-only table of aggregated lagging indicator data per contractor, fetched from `GET /projects/data`. Includes contractor filtering and project-wide totals.

### Components

- **`Navbar`** — Displays the app title ("HSE Metrics"), the logged-in username (from `localStorage`), and a logout button that clears the session and redirects to login.
- **`MetricForm`** — A multi-step form component. The user first selects a personnel type (Almaco or Contractor), then enters metrics one at a time via a dropdown selector. Training hours support a calculated mode (people × length). Includes input validation (no negative values) and error/success feedback.

### Constants

- **`editableMetricsDefinitions.js`** — Defines the leading indicator fields available in the input form: HSE Audits, Training Hours, Job Safety Analysis, Toolbox Talks, Safety Walks, Working Hours.
- **`externalMetricsDefinitions.js`** — Defines the lagging indicator field labels used for display: First Aid Cases, MTI, RWC, LTI, PTD, PPD, Fatal Accidents, etc.

---

## Data Flow

```
User fills MetricForm → POST /report → reportController → reportRepository → Prisma → PostgreSQL
User views lagging tab → GET /projects/data → projectController → projectRepository → Prisma → PostgreSQL
```

**Leading indicators** (HSE reports) are input manually by coordinators through the form.  
**Lagging indicators** (injury/incident data) are pre-loaded into the database via the seed script (sourced from `lagging_indicators_api.js`, which simulates an external data source) and displayed in read-only aggregated views.

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database
- A `.env` file in the `Backend/` directory with:
  ```
  DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
  ```

### Backend Setup

```bash
cd Backend
npm install
npx prisma generate       # Generate Prisma client
npx prisma migrate dev    # Apply database migrations
npx prisma db seed        # Seed the database with initial data
npm run dev               # Start the Express server on port 3000
```

### Frontend Setup

```bash
cd Frontend
npm install
npx vite                  # Start the Vite dev server (default port 5173)
```

### Usage

1. Open the frontend in your browser (e.g. `http://localhost:5173`).
2. Log in with a valid username (default seeded account: `Almaco26`).
3. Select a project from the dropdown.
4. Use the **Input Metrics** tab to submit leading indicator reports.
5. Use the **Lagging Indicators** tab to view aggregated incident data per contractor.

---

## API Endpoints

| Method | Endpoint               | Description                                         |
| ------ | ---------------------- | --------------------------------------------------- |
| GET    | `/api/nc_tool`         | Returns static lagging indicator seed data           |
| GET    | `/projects`            | Lists all projects (`id`, `name`)                    |
| GET    | `/projects/data`       | Aggregated lagging indicators (query: `projectId`)   |
| POST   | `/report`              | Submit a new HSE leading indicator report             |
| POST   | `/login`               | Validate a username against the accounts table        |
