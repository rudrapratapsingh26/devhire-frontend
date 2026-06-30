# DevHire — Frontend

Frontend for DevHire — an AI-powered hiring platform connecting candidates and companies, with an admin layer overseeing the platform.

Built with React + Vite + Tailwind CSS v4, talking to the DevHire backend over a JWT-authenticated REST API.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Routing & Protected Routes](#routing--protected-routes)
- [Authentication Flow](#authentication-flow)
- [API Integration](#api-integration)
- [Pages Reference](#pages-reference)
- [Environment Variables](#environment-variables)
- [Setup](#setup)
- [Styling](#styling)
- [Known Issues Fixed](#known-issues-fixed-build-log)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Build tool | Vite |
| Framework | React |
| Styling | Tailwind CSS v4 (`@theme` tokens, no `tailwind.config.js` theme block) |
| Routing | React Router |
| HTTP client | Axios, with a shared instance + Bearer token interceptor |
| Icons | Lucide React |
| Rich text | TinyMCE (used in earlier project, carried into shared component patterns where relevant) |

---

## Project Structure

```
devhire-frontend/
├── src/
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── CheckEmail.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── GoogleSuccess.jsx
│   │   ├── candidate/
│   │   │   ├── JobFeed.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   ├── MyApplications.jsx
│   │   │   ├── SavedJobs.jsx
│   │   │   ├── AITools.jsx
│   │   │   └── Profile.jsx
│   │   ├── company/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── ActiveJobs.jsx
│   │   │   ├── EditJob.jsx
│   │   │   ├── Applicants.jsx
│   │   │   └── Settings.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Companies.jsx
│   │       ├── Candidates.jsx
│   │       └── Jobs.jsx
│   ├── components/
│   │   └── candidate/
│   │       └── ApplyModal.jsx       # Resume upload + apply flow, used from JobDetail
│   ├── layouts/
│   │   ├── CandidateLayout.jsx       # Sidebar nav + shell for candidate pages
│   │   ├── CompanyLayout.jsx
│   │   └── AdminLayout.jsx
│   ├── context/
│   │   └── AuthContext.jsx           # JWT + Google OAuth + session persistence
│   ├── utils/
│   │   └── axios.js                  # Axios instance, Bearer token interceptor
│   ├── App.jsx                       # Route tree + ProtectedRoute wrappers
│   └── index.css                     # Tailwind v4 theme tokens
└── package.json
```

---

## Routing & Protected Routes

Routes are role-scoped under `/candidate/*`, `/company/*`, and `/admin/*`. A `ProtectedRoute` wrapper checks `AuthContext` for a valid session and the user's `role`, redirecting to `/login` if unauthenticated or to the correct dashboard if the role doesn't match the route's namespace.

Key candidate routes:
- `/candidate/jobs` — job feed
- `/candidate/jobs/:id` — job detail + apply
- `/candidate/applications` — application tracker
- `/candidate/saved` — bookmarked jobs
- `/candidate/ai-tools` — resume scorer + cover letter generator
- `/candidate/profile` — profile editor

Company and admin routes follow the same `/company/*` and `/admin/*` pattern, mapped to the pages listed in [Project Structure](#project-structure).

---

## Authentication Flow

- `AuthContext` holds the current user and access token, persisting the session (e.g. on refresh) and exposing login/logout helpers.
- On login or Google OAuth success, the access token is stored and attached to all subsequent requests via the Axios interceptor in `src/utils/axios.js`:
  ```js
  config.headers.Authorization = `Bearer ${accessToken}`;
  ```
- **Google OAuth**: the backend redirects to `/auth/google/success?accessToken=...&user=...`. The `GoogleSuccess` page reads these query params, populates `AuthContext`, and redirects into the app. The Google sign-in button must **not** live inside a `<form>` — doing so triggers an unwanted form submit/page reload on click.
- Requests are made with `withCredentials: true` (paired with an explicit CORS origin on the backend, not a wildcard).

---

## API Integration

All requests go through a single Axios instance:

```js
// src/utils/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = /* read from AuthContext / storage */;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

> Vite exposes env vars via `import.meta.env`, **not** `process.env` — a common source of `undefined` base URLs if copied from a CRA-style project.

Every backend response is wrapped as `{ success, statusCode, data, message }`. When destructuring on the frontend, the payload is at `res.data.data` directly (e.g. a job is `res.data.data`, a list of applications is `res.data.data`, **not** `res.data.data.job` or `res.data.data.applications`) — match this against the actual controller's `ApiResponse` call rather than assuming a nested key.

---

## Pages Reference

**Candidate**
- `JobFeed` — paginated job list with search/filters, save/bookmark toggle per card
- `JobDetail` — full job view, bookmark toggle, apply flow (opens `ApplyModal`), shows "already applied" state
- `MyApplications` — table of applications with status pills (`APPLIED` / `REVIEWING` / `ACCEPTED` / `REJECTED`), AI score badges, search + status filter
- `SavedJobs` — bookmarked jobs list
- `AITools` — two tabs: AI Cover Letter and Resume Scorer (PDF upload + optional job description → score, strengths, weaknesses, summary)
- `Profile` — view/edit headline, location, bio, skills, experience, education, resume

**Company**
- `Dashboard` — overview stats
- `PostJob` / `EditJob` — job create/edit forms
- `ActiveJobs` — company's posted jobs
- `Applicants` — applicants per job, sorted by AI score, with status update controls
- `Settings` — company profile + logo

**Admin**
- `Dashboard` — platform-wide stats
- `Companies` — approve/reject company registrations
- `Candidates` — view registered candidates
- `Jobs` — oversight of all jobs on the platform

---

## Environment Variables

```env
VITE_API_URL=http://localhost:8000/api/v1
```

In production (Vercel), set this to the deployed Render backend URL, e.g. `https://devhire-backend.onrender.com/api/v1`.

---

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173` by default.

---

## Styling

Tailwind CSS v4. Theme tokens (colors, spacing, etc.) are defined directly in `index.css` using `@theme`, rather than a `tailwind.config.js` theme object:

```css
@import "tailwindcss";

@theme {
  --color-accent: #7c3aed;
  --color-surface: #18181b;
  --color-border: #27272a;
  /* ... */
}
```

Custom classes like `bg-surface`, `border-border`, `text-accent` used throughout the components come from these tokens.

---

## Known Issues Fixed (build log)

- **`process.env` used instead of `import.meta.env`** — Vite doesn't polyfill `process.env`; any reference to it for client env vars silently resolves to `undefined`.
- **Google sign-in button nested inside a `<form>`** — caused an unintended form submission / full page reload on click. Moved outside the form or given `type="button"`.
- **API response destructuring mismatch** — several pages (`JobDetail`, `MyApplications`) assumed a nested payload key (`res.data.data.job`, `res.data.data.applications`) that didn't match the backend's actual `ApiResponse` shape, silently rendering empty/blank states instead of erroring loudly. Fixed by reading `res.data.data` directly per endpoint.
- **`company.companyName` referenced instead of `company.name`** in card/table renders, left over from an earlier schema naming assumption.
- **Status filter case mismatch** — application status filters compared against `"Applied"` / `"Reviewing"` (title case) while the backend's actual enum values are uppercase (`"APPLIED"`, `"REVIEWING"`, etc.), so filters silently matched nothing.

---

## Deployment

Deployed on **Vercel**. Set `VITE_API_URL` in the project's environment variables to the deployed backend URL, then redeploy. CORS on the backend must allow this exact Vercel origin with `credentials: true`.
