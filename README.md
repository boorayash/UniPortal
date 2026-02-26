# 🎓 UniPortal — University Assignment Management System

A full-stack web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) that digitizes the university assignment workflow — from student uploads, to professor reviews, to admin oversight.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [User Roles & Workflows](#user-roles--workflows)
  - [Admin](#-admin)
  - [Student](#-student)
  - [Professor](#-professor)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Folder Structure](#folder-structure)
- [Security Measures](#security-measures)
- [Deployment](#deployment)

---

## About the Project

UniPortal replaces the traditional paper-based assignment submission and review process with a centralized digital platform. It supports **three distinct user roles** — Admin, Student, and Professor — each with their own dashboard, workflows, and permissions.

The system handles the entire lifecycle of an assignment:

1. **Student** creates and uploads an assignment (PDF) to cloud storage.
2. **Student** submits the assignment to a selected **Professor** for review.
3. **Professor** previews the file, adds remarks, and either **approves** or **rejects** the assignment with feedback.
4. If **rejected**, the student can edit their description and **resubmit** for another round of review.
5. All actions are logged in an **Activity Feed** visible to Admins.

---

## Key Features

### Authentication & Security
- 🔐 **Secure Login** — Passwords hashed with `bcryptjs`, tokens stored in `httpOnly` cookies (not localStorage)
- 🛡️ **Server-Verified Route Guards** — Frontend `ProtectedRoute` verifies authentication via a backend `/auth/verify` endpoint on every page load
- ⏱️ **Rate Limiting** — Brute-force protection on the login endpoint (5 attempts per 15 min)
- 🔑 **Password Reset** — Token-based flow with hashed tokens, 1-hour expiry, and real SMTP email delivery via Nodemailer
- ✅ **Admin Approval Gate** — New signups must be approved by an admin before gaining access

### Assignment Management
- 📤 **Single & Bulk Upload** — Upload one or multiple PDF assignments at once
- ☁️ **Cloud Storage** — All files stored on Cloudinary with `raw` resource type for secure PDF serving
- 👀 **Inline Preview** — Professors can preview submitted PDFs directly in the browser via iframe
- 📝 **Review History** — Full audit trail of every approval, rejection, and resubmission with timestamps
- 🔄 **Resubmission Flow** — Rejected assignments can be edited and resubmitted to a new professor
- ✍️ **Digital Signatures** — Professors sign approvals with their name, recorded in the review history

### Admin Panel
- 📊 **Dashboard** — Real-time stats for departments, students, professors, and HODs
- 🏢 **Department CRUD** — Create, read, update, and delete academic departments
- 👥 **User Management** — Paginated, searchable user list with role/department filters and edit capabilities
- 📋 **Activity Feed** — Live feed of all system actions (submissions, approvals, rejections, etc.)
- ✅ **Approval Queue** — Approve or reject pending user registrations

### UI/UX
- 🎨 **Premium Glassmorphism UI** — Dark theme with frosted glass effects and gradient accents
- 🎭 **3D Tilt Cards** — Interactive login/auth cards with mouse-tracking tilt animation via Framer Motion
- ✨ **Particle Background** — Animated 3D particle field on the login page using React Three Fiber
- ⏳ **Loading States** — All upload/submit buttons show progress indicators to prevent double submissions

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 7 | Build tool & dev server |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Utility-first styling |
| Framer Motion | Animations & transitions |
| React Three Fiber | 3D particle backgrounds |
| Lucide React | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | HTTP framework |
| MongoDB + Mongoose | Database & ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| Cloudinary + Multer | File upload & cloud storage |
| Nodemailer | SMTP email delivery |
| express-rate-limit | Brute-force protection |
| cookie-parser | httpOnly cookie handling |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Frontend (Vite + React)             │
│                                                          │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐              │
│  │  Admin   │  │ Student  │  │ Professor  │              │
│  │Dashboard │  │Dashboard │  │ Dashboard  │              │
│  └────┬─────┘  └────┬─────┘  └─────┬──────┘              │
│       │              │              │                     │
│       └──────────────┼──────────────┘                     │
│                      │                                    │
│              ProtectedRoute (cookie-verified)             │
│                      │                                    │
│              config/api.js (VITE_API_URL)                 │
└──────────────────────┼────────────────────────────────────┘
                       │ HTTPS (credentials: include)
┌──────────────────────┼────────────────────────────────────┐
│                  Backend (Express 5)                       │
│                      │                                    │
│  ┌───────────────────┼───────────────────────────┐        │
│  │              Middleware Layer                   │        │
│  │  ┌──────────┐ ┌──────────┐ ┌───────────────┐  │        │
│  │  │  CORS    │ │  Auth    │ │  Rate Limiter │  │        │
│  │  └──────────┘ └──────────┘ └───────────────┘  │        │
│  └───────────────────┼───────────────────────────┘        │
│                      │                                    │
│  ┌───────────────────┼───────────────────────────┐        │
│  │            Controller Layer                    │        │
│  │  auth │ admin │ student │ professor │ user     │        │
│  └───────────────────┼───────────────────────────┘        │
│                      │                                    │
│  ┌───────────────────┼───────────────────────────┐        │
│  │          MongoDB (Mongoose ODM)                │        │
│  │  User │ Admin │ Assignment │ Department │ Activity│     │
│  └───────────────────────────────────────────────┘        │
│                                                          │
│  ┌────────────────┐  ┌──────────────┐                    │
│  │   Cloudinary   │  │  Nodemailer  │                    │
│  │  (File Storage)│  │ (SMTP Email) │                    │
│  └────────────────┘  └──────────────┘                    │
└──────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account ([free tier](https://cloudinary.com/))
- **Gmail account** with [App Password](https://myaccount.google.com/apppasswords) for SMTP (optional)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/UniPortal.git
cd UniPortal

# 2. Install backend dependencies
cd Backend
npm install

# 3. Install frontend dependencies
cd ../Frontend
npm install
```

### Environment Variables

#### Backend (`Backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/uniportal
JWT_SECRET=your-secret-key-here
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development

# Admin seed account
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Password Reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
```

#### Frontend (`Frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

### Running Locally

```bash
# Terminal 1 — Start backend
cd Backend
npm run dev        # Starts with nodemon on port 5000

# Terminal 2 — Start frontend
cd Frontend
npm run dev        # Starts Vite dev server on port 5173
```

Open your browser and navigate to `http://localhost:5173`.

---

## User Roles & Workflows

### 👨‍💼 Admin
| Action | Description |
|---|---|
| View Dashboard | See counts of departments, students, professors, HODs and recent activity |
| Manage Departments | Create, edit, delete academic departments (CSE, ECE, etc.) |
| Manage Users | Search, filter, edit, and delete users across all roles |
| Approve Registrations | Review and approve/reject new user signups |
| Activity Feed | Monitor all assignment submissions, approvals, and rejections in real-time |

### 🎓 Student
| Action | Description |
|---|---|
| View Dashboard | See stats (draft, submitted, approved, rejected) and recent submissions |
| Upload Assignment | Submit a single PDF with title, description, and category |
| Bulk Upload | Upload multiple PDFs at once with a shared category |
| Submit for Review | Select a professor and submit a draft assignment for evaluation |
| View History | Expand any assignment row to see its full review timeline |
| Edit & Resubmit | If rejected, update the description and resubmit to a different professor |

### 👨‍🏫 Professor
| Action | Description |
|---|---|
| View Dashboard | See pending reviews, approved count, rejected count, and total reviewed |
| Review Assignment | Preview the submitted PDF, enter remarks, and sign digitally |
| Approve | Approve the assignment with remarks and a digital signature |
| Reject | Reject with mandatory feedback (minimum 10 characters), allowing resubmission |
| Assignment List | View all assigned submissions with status filters and sort options |

---

## API Endpoints

### Authentication (`/auth`)
| Method | Route | Description |
|---|---|---|
| POST | `/auth/login` | Log in with email and password |
| POST | `/auth/signup` | Register a new user account |
| POST | `/auth/logout` | Clear auth cookie and log out |
| GET | `/auth/verify` | Verify session via httpOnly cookie |
| POST | `/auth/forgot-password` | Request a password reset email |
| PATCH | `/auth/reset-password/:token` | Reset password using the emailed token |
| GET | `/auth/departments` | Get department list for signup dropdown |

### Admin (`/admin`)
| Method | Route | Description |
|---|---|---|
| GET | `/admin/dashboard` | Dashboard statistics |
| GET | `/admin/activity` | Recent activity feed |
| GET | `/admin/pending-users` | Users awaiting approval |
| POST | `/admin/approve-user/:id` | Approve a user registration |
| POST | `/admin/reject-user/:id` | Reject a user registration |
| GET | `/admin/departments` | List all departments |
| POST | `/admin/departments` | Create a department |
| PUT | `/admin/departments/:id` | Update a department |
| DELETE | `/admin/departments/:id` | Delete a department |
| GET | `/admin/users` | Paginated, filterable user list |
| POST | `/admin/users` | Create a new user |
| PUT | `/admin/users/:id` | Update a user |
| DELETE | `/admin/users/:id` | Delete a user |

### Student (`/student`)
| Method | Route | Description |
|---|---|---|
| GET | `/student/dashboard` | Student dashboard stats + recent submissions |
| GET | `/student/assignments` | All assignments for the logged-in student |
| POST | `/student/assignments/upload` | Upload a single assignment (PDF) |
| POST | `/student/assignments/bulk-upload` | Upload multiple assignments |
| POST | `/student/assignments/:id/submit` | Submit an assignment for professor review |
| PUT | `/student/assignments/:id/resubmit` | Resubmit a rejected assignment |
| GET | `/student/professors` | Get available professors for submission |

### Professor (`/professor`)
| Method | Route | Description |
|---|---|---|
| GET | `/professor/dashboard` | Professor dashboard stats + pending queue |
| GET | `/professor/assignments` | All assignments assigned to this professor |
| GET | `/professor/assignments/:id/review` | Get full assignment details for review |
| POST | `/professor/assignments/:id/approve` | Approve an assignment |
| POST | `/professor/assignments/:id/reject` | Reject an assignment with feedback |

---

## Database Schema

```
┌──────────────┐     ┌───────────────────┐     ┌──────────────┐
│     User     │     │    Assignment      │     │  Department  │
├──────────────┤     ├───────────────────┤     ├──────────────┤
│ name         │◄────│ assignedTo (ref)  │     │ name         │
│ email        │     │ reviewer (ref)    │     │ code         │
│ password     │     │ givenBy (ref)     │     │ type (UG/PG) │
│ department   │────►│ department (ref)  │◄────│ createdAt    │
│ role         │     │ title             │     └──────────────┘
│ approved     │     │ description       │
│ resetToken   │     │ category          │     ┌──────────────┐
│ resetExpires │     │ filePath          │     │   Activity   │
└──────────────┘     │ fileSize          │     ├──────────────┤
                     │ status            │     │ type         │
┌──────────────┐     │ reviewHistory[]   │     │ message      │
│    Admin     │     │ submittedAt       │     │ actor (ref)  │
├──────────────┤     │ resubmittedAt     │     │ meta {}      │
│ email        │     │ remarks           │     │ timestamps   │
│ password     │     │ approvedBy (ref)  │     └──────────────┘
└──────────────┘     │ timestamps        │
                     └───────────────────┘
```

**Assignment Status Flow:**
```
draft → submitted → approved ✅
                  → rejected → resubmitted → approved ✅
                                            → rejected ❌
```

---

## Folder Structure

```
UniPortal/
├── Backend/
│   ├── controllers/         # Business logic (auth, admin, student, professor, user, error)
│   ├── middleware/           # Auth guard, file upload (Cloudinary), rate limiter
│   ├── model/schema/         # Mongoose schemas (User, Admin, Assignment, Department, Activity)
│   ├── routes/               # Express route definitions
│   ├── utils/                # Utilities (AppError class, email service)
│   ├── server.js             # App entry point
│   ├── .env.example          # Environment variable template
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── admin/            # Admin dashboard, departments, users, approvals
│   │   ├── authorization/    # Login, signup, forgot/reset password
│   │   ├── components/       # Shared (ProtectedRoute, LogoutButton, AuthUserBadge)
│   │   ├── config/           # Centralized API URL config
│   │   ├── professors/       # Professor dashboard, assignments, review page
│   │   ├── students/         # Student dashboard, assignments, upload/submit popups
│   │   ├── App.jsx           # Root component with route definitions
│   │   └── main.jsx          # React entry point
│   ├── .env.example          # Frontend environment template
│   └── package.json
│
└── README.md
```

---

## Security Measures

| Layer | Implementation |
|---|---|
| **Password Storage** | Hashed with `bcryptjs` (10 salt rounds) — plain-text passwords never stored |
| **Authentication** | JWT tokens stored in `httpOnly`, `secure`, `sameSite` cookies — immune to XSS |
| **Route Protection** | Frontend `ProtectedRoute` calls `/auth/verify` on every page load — server verifies the cookie, not localStorage |
| **Authorization** | Backend middleware checks `req.user.role` before granting access to any endpoint |
| **Brute-Force** | `express-rate-limit` on `/auth/login` — 5 attempts per 15 minutes per IP |
| **File Uploads** | PDF-only filter, 10MB size limit, Cloudinary `raw` resource type, sanitized public IDs |
| **Password Reset** | Cryptographically random tokens, SHA-256 hashed for storage, 1-hour expiry |
| **Error Handling** | Centralized handler with environment-aware responses — stack traces hidden in production |
| **CORS** | Strict origin policy — only the configured `CLIENT_ORIGIN` is allowed |

---

## Deployment

When deploying to production:

1. **Backend** — Deploy to [Render](https://render.com), [Railway](https://railway.app), or any Node.js host.
   - Set all `Backend/.env` variables in your hosting platform's environment settings.
   - Change `CLIENT_ORIGIN` to your deployed frontend URL.
   - Set `NODE_ENV=production`.

2. **Frontend** — Deploy to [Vercel](https://vercel.com), [Netlify](https://netlify.app), or similar.
   - Set `VITE_API_URL` to your deployed backend URL.
   - Run `npm run build` for the production bundle.

3. **Database** — Use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available).

---
