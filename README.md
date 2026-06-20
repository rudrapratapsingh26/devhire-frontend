# DevHire Frontend

AI-powered hiring platform frontend built with React, Tailwind CSS, and Vite.

---

## Tech Stack

- **Framework** — React 19 + Vite
- **Styling** — Tailwind CSS v4
- **Routing** — React Router DOM v7
- **HTTP Client** — Axios with JWT interceptors
- **Icons** — Lucide React
- **Auth** — JWT (email/password) + Google OAuth

---

## Project Structure

```
src/
├── components/
│   ├── auth/           # Input, Button, AuthLayout, GoogleButton, RoleToggle, Divider
│   ├── candidate/      # JobCard, ApplyModal
│   └── common/         # ProtectedRoute
├── context/
│   └── AuthContext.jsx # Global auth state (login, signup, logout, session)
├── layouts/
│   ├── CandidateLayout.jsx
│   ├── CompanyLayout.jsx
│   └── AdminLayout.jsx
├── pages/
│   ├── auth/           # Login, Signup, ForgotPassword, CheckEmail, ResetPassword
│   ├── candidate/      # JobFeed, JobDetail, MyApplications, SavedJobs, Profile, AITools
│   ├── company/        # CompanyDashboard, PostJob, ActiveJobs, EditJob, Applicants, CompanySettings
│   ├── admin/          # AdminDashboard, AdminCompanies, AdminCandidates, AdminJobs
│   └── Landing.jsx
├── utils/
│   └── axios.js        # Axios instance with auth interceptors
├── App.jsx             # All routes with role-based protected routes
└── index.css           # Tailwind v4 theme tokens
```

---

## Pages

### Public
| Route | Page |
|-------|------|
| `/` | Landing page |
| `/login` | Login |
| `/signup` | Signup (Candidate or Company) |
| `/forgot-password` | Forgot Password |
| `/check-email` | Check Email confirmation |
| `/reset-password` | Reset Password |

### Candidate (protected)
| Route | Page |
|-------|------|
| `/candidate/jobs` | Job Feed with search + filters |
| `/candidate/jobs/:id` | Job Detail + Apply Modal |
| `/candidate/applications` | My Applications with AI scores |
| `/candidate/saved` | Saved/Bookmarked Jobs |
| `/candidate/profile` | Candidate Profile + Resume upload |
| `/candidate/ai-tools` | AI Cover Letter Generator + Resume Scorer |

### Company (protected)
| Route | Page |
|-------|------|
| `/company/dashboard` | Company Dashboard overview |
| `/company/jobs` | Active Jobs list |
| `/company/jobs/new` | Post New Job with AI generation |
| `/company/jobs/:id/edit` | Edit Job |
| `/company/applicants` | Applicants ranked by AI score |
| `/company/settings` | Company profile settings |

### Admin (protected)
| Route | Page |
|-------|------|
| `/admin/dashboard` | Admin Dashboard + pending approvals |
| `/admin/companies` | All companies with approve/reject |
| `/admin/candidates` | All candidates |
| `/admin/jobs` | All jobs on platform |

---

## Getting Started

### Prerequisites
- Node.js 18+
- DevHire backend running (see backend repo)

### Installation

```bash
git clone https://github.com/rudrapratapsingh26/devhire-frontend.git
cd devhire-frontend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

For production:
```env
VITE_API_URL=https://your-backend.onrender.com/api/v1
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## How to Test

### Step 1 — Start the backend
```bash
# In your backend repo
npm run dev
```
Confirm at `http://localhost:8000/health` → should return `{ status: "ok" }`.

### Step 2 — Test Auth Flow

**Register as Candidate:**
1. Go to `/signup`, fill details, select Candidate, click Create Account
2. Login at `/login` → should redirect to `/candidate/jobs`

**Forgot Password:**
1. Click "Forgot password?" → enter email → check inbox → click reset link
2. Enter new password → redirected to login

### Step 3 — Test Candidate Flow

1. Login as candidate
2. **Job Feed** — search jobs, use filters
3. **Bookmark** — click bookmark icon on any card
4. **Apply** — click Apply Now on a job → upload PDF resume → submit
5. **My Applications** — check `/candidate/applications` for AI score
6. **Saved Jobs** — check `/candidate/saved`
7. **AI Tools** — generate a cover letter at `/candidate/ai-tools`

### Step 4 — Test Company Flow

1. Register as Company → login → go to `/company/dashboard`
2. **Post Job** — go to `/company/jobs/new`, use AI generation buttons
3. **View Applicants** — go to `/company/applicants`, change statuses

> Note: Company needs admin approval before posting jobs

### Step 5 — Test Admin Flow

Set a user as admin in your database:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```
Login → go to `/admin/dashboard` → approve/reject pending companies.

### Step 6 — Test Protected Routes

1. Log out
2. Visit `/candidate/jobs` directly → should redirect to `/login`
3. Login as candidate, visit `/admin/dashboard` → should redirect to `/candidate/jobs`

---

## Known Limitations

- AI Tools endpoints (`/candidate/generate-cover-letter`, `/candidate/score-resume`) need to be added to the backend
- Company Analytics and Admin Reports pages are coming in v2

---

## Deployment

### Frontend — Vercel
```bash
npm i -g vercel
vercel
```
Set `VITE_API_URL` in Vercel dashboard environment variables.

### Backend — Render
See [DevHire Backend](https://github.com/rudrapratapsingh26/devhire-backend) README.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#09090b` | Page background |
| `--color-surface` | `#18181b` | Cards, sidebar |
| `--color-border` | `#27272a` | Borders |
| `--color-accent` | `#7c3aed` | Primary violet |
| `--color-accent-hover` | `#6d28d9` | Hover state |

---

Built by [@rudrapratap2610](https://x.com/rudrapratap2610)