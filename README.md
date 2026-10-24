# HCM Lite — Frontend

A modern Human Capital Management (HCM) frontend application designed to manage employees, attendance, leave requests, payroll, announcements, notifications, and HR operations through a user-friendly dashboard.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Modules](#application-modules)
- [Authentication and Authorization](#authentication-and-authorization)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
- [Available Scripts](#available-scripts)
- [Development Guidelines](#development-guidelines)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)

## Overview

HCM Lite is a frontend application for a Human Capital Management system. It provides an interface for employees, HR personnel, and administrators to access and manage HR-related operations.

The frontend communicates with a backend REST API to retrieve, create, update, and delete application data.

### User Roles

- **Admin:** Access to administrative features and company-wide information.
- **HR:** Access to employee management, attendance, leave management, and payroll operations.
- **Employee:** Access to personal information, attendance, leave requests, payslips, and notifications.

Actual access depends on the permissions implemented by the backend.

## Features

### 1. Authentication

- User login and logout.
- Authentication state management.
- Protected application routes.
- Role-based page access.
- Session handling based on the backend authentication mechanism.
- User-friendly authentication error messages.

### 2. Dashboard

- Role-specific dashboard views.
- Summary cards for relevant HR information.
- Attendance and leave summaries.
- Employee and payroll statistics where permitted.
- Quick navigation to frequently used modules.

### 3. Employee Management

- View employee records.
- Display employee profile information.
- Add and update employee details, where permitted.
- Search, filter, and paginate employee records.
- View employee employment information.

### 4. Attendance Management

- Employee check-in and check-out.
- View personal attendance history.
- Monthly attendance calendar.
- Attendance board for authorized HR users.
- Attendance correction requests.
- Review and process correction requests according to permissions.

### 5. Leave Management

- View available leave types and balances.
- Submit leave requests.
- View leave request history and status.
- Approve or reject requests for authorized users.
- Display leave information and relevant dates.

### 6. Payroll Management

- View salary information according to user permissions.
- Display payroll summaries.
- Generate draft payroll through the backend, where authorized.
- View payroll runs and payslips.
- Display gross salary, deductions, tax, and net salary when returned by the API.
- Show payroll status and relevant validation errors.

### 7. Company Settings

- View and manage company information where permitted.
- Display company configuration.
- Manage applicable holiday and weekend settings if supported by the backend.

### 8. Announcements

- View company announcements.
- Display announcement titles, messages, and dates.
- Create and delete announcements for authorized roles.

### 9. Notifications

- Display user notifications.
- Navigate to relevant application pages from notification links when supported.
- Show appropriate empty and loading states.

### 10. Audit and Activity

- Display audit logs for authorized users.
- Show available activity information returned by the backend.
- Support pagination and filtering where implemented.

### 11. Reusable User Interface

- Reusable buttons, inputs, cards, tables, and modals.
- Form validation and helpful feedback.
- Loading indicators and empty states.
- Responsive layouts for desktop, tablet, and mobile screens.
- Consistent spacing, typography, and visual styling.

## Technology Stack

The following is a suggested stack. Keep only the technologies actually installed and used in your project.

| Technology | Purpose |
|---|---|
| React.js | Building reusable UI components |
| JavaScript or TypeScript | Application logic and type safety |
| React Router | Client-side navigation |
| Axios or Fetch API | Backend HTTP requests |
| CSS / CSS Modules | Component styling and layouts |
| Context API or Redux Toolkit | Shared application state, if used |
| Vite | Development server and production builds, if configured |
| npm | Package and dependency management |

## Project Structure

Suggested frontend folder structure:

```text
frontend/
├── public/
│   ├── favicon.ico
│   └── assets/
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loader.jsx
│   │   │   └── Pagination.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── DashboardLayout.jsx
│   │   │
│   │   └── guards/
│   │       ├── ProtectedRoute.jsx
│   │       └── RoleGuard.jsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── HRDashboard.jsx
│   │   │   └── EmployeeDashboard.jsx
│   │   │
│   │   ├── employees/
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── EmployeeDetails.jsx
│   │   │   └── EmployeeForm.jsx
│   │   │
│   │   ├── attendance/
│   │   │   ├── AttendanceBoard.jsx
│   │   │   ├── MyAttendance.jsx
│   │   │   └── AttendanceCorrections.jsx
│   │   │
│   │   ├── leaves/
│   │   │   ├── LeaveRequests.jsx
│   │   │   ├── LeaveBalances.jsx
│   │   │   └── LeaveApprovals.jsx
│   │   │
│   │   ├── payroll/
│   │   │   ├── PayrollRuns.jsx
│   │   │   ├── Payslips.jsx
│   │   │   └── SalaryDetails.jsx
│   │   │
│   │   ├── announcements/
│   │   │   └── Announcements.jsx
│   │   │
│   │   ├── notifications/
│   │   │   └── Notifications.jsx
│   │   │
│   │   ├── settings/
│   │   │   └── CompanySettings.jsx
│   │   │
│   │   └── NotFound.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── employeeService.js
│   │   ├── attendanceService.js
│   │   ├── leaveService.js
│   │   └── payrollService.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── usePagination.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── store/
│   │   └── index.js
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/
│   │   ├── formatDate.js
│   │   ├── formatCurrency.js
│   │   └── constants.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   └── variables.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md
```

**Folder responsibilities:**

- `assets/`: Images, icons, fonts, and static resources.
- `components/`: Reusable UI elements and shared layouts.
- `pages/`: Full pages grouped by application module.
- `services/`: API requests and backend communication.
- `hooks/`: Reusable React hooks.
- `context/` or `store/`: Shared application state, depending on the chosen approach.
- `routes/`: Application route definitions.
- `utils/`: Formatting helpers and shared utility functions.
- `styles/`: Global styles, CSS variables, and shared design rules.

This is a recommended structure, not a claim that every listed file already exists.

## Application Modules

| Module | Main responsibility |
|---|---|
| Authentication | Login, logout, and authentication state |
| Dashboard | Role-specific summaries and statistics |
| Employees | Employee records and profiles |
| Attendance | Check-in, check-out, calendars, and corrections |
| Leaves | Leave requests, balances, and approvals |
| Payroll | Payroll runs, salary details, and payslips |
| Company | Company configuration and holidays |
| Announcements | Company-wide messages |
| Notifications | User alerts and navigation |
| Audit | Activity logs for authorized users |

## Authentication and Authorization

The frontend should separate authentication from authorization.

### Authentication

Authentication determines whether the user is logged in. After a successful login, the frontend should process the authentication response according to the backend's token or session strategy.

### Authorization

Authorization determines which pages and actions the current user can access.

Example role-based navigation:

- Admin: administrative dashboard and permitted management modules.
- HR: employee, attendance, leave, and payroll features granted by the backend.
- Employee: personal attendance, leave requests, payslips, and notifications.

**Important:** Frontend route guards improve the user experience but do not provide security on their own. The backend must independently verify authentication and permissions for protected API requests.

## API Integration

The frontend communicates with the backend through HTTP requests.

### API Base URL

Configure the backend URL using an environment variable rather than hardcoding it throughout the application.

Example using Vite:

```env
VITE_API_URL=http://localhost:5000/api
```

Example Axios configuration:

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

Adjust the base URL and request paths to match the actual backend configuration.

### Service Layer

API calls should be organized by feature. For example, an employee service can contain functions for listing, retrieving, creating, and updating employee records.

This approach keeps HTTP request logic separate from UI components and makes the application easier to maintain.

### API Error Handling

The frontend should handle common API outcomes:

- `400 Bad Request`: Display validation errors.
- `401 Unauthorized`: Handle expired or missing authentication.
- `403 Forbidden`: Inform the user that access is denied.
- `404 Not Found`: Display an appropriate message.
- `500 Internal Server Error`: Show a general server error message.
- Network errors: Inform the user that the server may be unavailable.

The frontend should display safe, user-friendly messages rather than exposing stack traces or internal server details.

## Environment Variables

Create a `.env` file in the frontend root directory.

Example for a Vite application:

```env
VITE_API_URL=http://localhost:5000/api
```

Create a `.env.example` file for other developers:

```env
VITE_API_URL=http://localhost:5000/api
```

Do not commit real secrets or private credentials. Frontend environment variables are included in the client-side application bundle and must never contain private API keys, database credentials, JWT secrets, or other server-only secrets.

Restart the development server after changing environment variables.

## Installation and Setup

### Prerequisites

- Node.js installed.
- npm installed.
- Backend API configured and running.
- Git installed, if cloning the repository.

### 1. Clone the Repository

```bash
git clone <repository-url>
```

Replace `<repository-url>` with the actual repository URL.

### 2. Open the Frontend Directory

```bash
cd frontend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create the `.env` file and configure the correct backend API URL.

### 5. Start the Development Server

```bash
npm run dev
```

If the project uses Vite, the terminal will show the local development URL.

### 6. Build for Production

```bash
npm run build
```

### 7. Preview the Production Build

```bash
npm run preview
```

The available commands depend on the scripts defined in `package.json`.

## Available Scripts

Typical Vite scripts:

| Command | Description |
|---|---|
| `npm run dev` | Starts the local development server |
| `npm run build` | Creates an optimized production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs linting if configured |
| `npm test` | Runs tests if a test script is configured |

Only use scripts that are actually present in the project's `package.json`.

## Development Guidelines

### Component Design

- Build small, reusable components.
- Keep components focused on a single responsibility.
- Separate reusable UI elements from page-specific logic.
- Use consistent naming conventions.
- Avoid duplicating shared UI or request logic.

### Forms and Validation

- Validate required fields and input formats.
- Display field-specific validation messages.
- Disable submit buttons when appropriate during submission.
- Handle backend validation responses.
- Avoid submitting duplicate requests accidentally.

### Loading and Empty States

Pages that load remote data should provide:

- Loading indicators.
- Empty states when no records exist.
- Error messages when requests fail.
- Retry actions where appropriate.
- Pagination controls for large datasets.

### Responsive Design

- Support desktop, tablet, and mobile screens.
- Keep tables usable on narrow screens.
- Ensure navigation remains accessible.
- Use consistent spacing and typography.
- Provide clear focus states and accessible form labels.

### Code Quality

- Use meaningful variable and component names.
- Keep API calls in service modules.
- Remove unused imports and variables.
- Avoid hardcoded API URLs.
- Use environment variables for environment-specific configuration.
- Keep dependencies up to date and review changes before upgrading.

## Error Handling

The frontend should handle errors consistently across the application.

Recommended practices:

- Display understandable error messages.
- Preserve form input when a request fails, where appropriate.
- Show field-level errors for invalid input.
- Handle unauthorized and forbidden responses.
- Avoid displaying sensitive server information.
- Log diagnostic information during development without exposing sensitive data to end users.

## Security Considerations

- Enforce permissions on the backend for every protected operation.
- Never store server secrets in frontend code.
- Use HTTPS in production.
- Follow the backend's authentication and session strategy.
- Avoid exposing sensitive employee, salary, or payroll information to unauthorized users.
- Validate user input on both frontend and backend.
- Do not rely on hidden buttons or protected routes as the only access control.
- Follow secure token and cookie handling practices appropriate to the application's architecture.

## Future Improvements

Potential improvements include:

- Automated component and integration tests.
- Improved accessibility.
- Advanced employee search and filtering.
- Enhanced dashboard visualizations.
- Better pagination and data caching.
- More comprehensive form validation.
- Production error monitoring.
- CI/CD automation.
- Performance optimization and code splitting.

## Contributing

1. Create a feature branch.
2. Make focused changes.
3. Test the affected pages and API integrations.
4. Check for linting or build errors.
5. Submit a pull request with a clear description of the changes.

## License

Add the appropriate license information before distributing this project publicly.

---

**HCM Lite Frontend** — A user interface for streamlined employee and HR operations.
