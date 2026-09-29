# GigMate Frontend - Volunteer Management System

Modern, responsive web application for GigMate built with React, Vite, and Tailwind CSS. Seamlessly integrates with the Spring Boot backend REST APIs.

## 🚀 Technology Stack

- **Framework**: React 19 (SPA with React Router v7)
- **Tooling**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT Bearer Interceptors & Auto-Logout
- **Deployment**: Multi-stage Dockerfile & Nginx reverse proxy

## 📁 Directory Structure

```
gigmate-frontend/
├── public/                 # Static assets
├── src/
│   ├── api/                # API client & backend service integration
│   │   ├── axiosClient.js      # Axios instance, Bearer token injection, 401 handling
│   │   ├── authService.js      # /api/auth endpoints (login, register)
│   │   ├── dashboardService.js # /api/dashboard endpoints (free-days, gigs, ATS)
│   │   └── reportingService.js # /api/reporting endpoints (history, PDF certificates)
│   ├── components/         # Modular reusable UI components
│   │   ├── common/
│   │   │   ├── Navbar.jsx          # Top navigation with user badge and logout
│   │   │   ├── Sidebar.jsx         # Role-based collapsible drawer
│   │   │   ├── StatCard.jsx        # KPI metric cards
│   │   │   ├── StatusBadge.jsx     # Badges for gig and application statuses
│   │   │   ├── Modal.jsx           # Accessible modal dialog
│   │   │   ├── LoadingSpinner.jsx  # Spinners and skeleton states
│   │   │   └── EmptyState.jsx      # Empty state graphics
│   │   └── routes/
│   │       ├── ProtectedRoute.jsx  # Role-based route guard
│   │       └── RoleRedirect.jsx    # Automatic role landing redirect
│   ├── context/            # React contexts
│   │   ├── AuthContext.jsx         # Authentication and session state
│   │   └── ToastContext.jsx        # Notification feedback banner
│   ├── layouts/
│   │   ├── MainLayout.jsx          # Application layout (Navbar + Sidebar + Content)
│   │   └── AuthLayout.jsx          # Centered card layout for Auth pages
│   ├── pages/
│   │   ├── LandingPage.jsx         # Public landing page with features showcase
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx       # Login form with sample credentials autofill
│   │   │   └── RegisterPage.jsx    # Registration with student/organizer tabs
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx     # KPI metrics & recent activity
│   │   │   ├── AvailabilityCalendar.jsx # Free-day selector & list
│   │   │   ├── GigExplorer.jsx          # Matching engine by date & category
│   │   │   ├── StudentApplications.jsx  # Application tracking table
│   │   │   ├── CertificatesPage.jsx     # Completed gigs & PDF download
│   │   │   └── StudentProfilePage.jsx   # College, interests, verification
│   │   ├── recruiter/
│   │   │   ├── RecruiterDashboard.jsx   # Campaign metrics & applicant counter
│   │   │   ├── PostGigPage.jsx          # Form to publish volunteer opportunities
│   │   │   ├── ManageGigsPage.jsx       # List of recruiter's campaigns
│   │   │   └── GigApplicationsPage.jsx  # ATS candidate review (Approve/Hire/Complete)
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx       # System health & API catalog
│   │   └── NotFoundPage.jsx             # 404 & 403 error views
│   ├── App.jsx             # Main router
│   ├── main.jsx            # Entry point
│   └── index.css           # Tailwind base styles
├── Dockerfile              # Multi-stage production container
├── nginx.conf              # Nginx server configuration with /api reverse proxy
├── package.json
└── vite.config.js          # Vite config on port 3000 with /api proxy
```

## 🔌 Integrated Backend REST APIs

| Module | Method | Endpoint Path | Authority | Purpose |
|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Public | Register new Student or Recruiter account |
| **Auth** | `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| **Student** | `POST` | `/api/dashboard/student/free-days` | `ROLE_STUDENT` | Add/toggle available free date |
| **Student** | `GET` | `/api/dashboard/student/free-days` | `ROLE_STUDENT` | Retrieve student's registered free days |
| **Student** | `GET` | `/api/dashboard/student/gigs/match` | `ROLE_STUDENT` | Match gigs by date & category |
| **Student** | `POST` | `/api/dashboard/student/gigs/{gigId}/apply` | `ROLE_STUDENT` | Submit volunteer application |
| **Student** | `GET` | `/api/dashboard/student/applications` | `ROLE_STUDENT` | List student's submitted applications |
| **Recruiter** | `POST` | `/api/dashboard/recruiter/gigs` | `ROLE_RECRUITER` | Publish volunteer campaign |
| **Recruiter** | `GET` | `/api/dashboard/recruiter/gigs` | `ROLE_RECRUITER` | List recruiter's published gigs |
| **Recruiter** | `GET` | `/api/dashboard/recruiter/gigs/{gigId}/applications` | `ROLE_RECRUITER` | Applicant Tracking System (ATS) stream |
| **Recruiter** | `PUT` | `/api/dashboard/recruiter/applications/{id}/status` | `ROLE_RECRUITER` | Update status (`APPROVED`, `HIRED`, `COMPLETED`, `REJECTED`) |
| **Reporting** | `GET` | `/api/reporting/student/summary` | `ROLE_STUDENT` | Fetch completed gig history |
| **Reporting** | `GET` | `/api/reporting/certificate/{applicationId}` | `ROLE_STUDENT` | Stream cryptographic iTextPDF certificate |

## 🛠️ How to Run the Frontend

### Method 1: Local Development

1. Ensure the Spring Boot backend is running on `http://localhost:8080`.
2. Navigate into the frontend folder:
   ```bash
   cd gigmate-frontend
   ```
3. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser at `http://localhost:3000`.

### Method 2: Docker Compose

From the root project directory:
```bash
docker compose up --build
```
This starts:
- MySQL container on port `3306`
- Spring Boot backend container on port `8080`
- Nginx frontend container on port `3000` (serving this built React frontend with API reverse proxy)
