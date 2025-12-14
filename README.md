# Recruiter App - GroupNo: 15 - Frontend

## Description
Recruiter App Frontend is a React.js-based user interface for a MERN recruiter and applicant management system.
The application provides essential job listing, recruiter management, and CV submission features to demonstrate the core workflow of the system as a Minimum Viable Product (MVP).
It focuses on main navigation, form handling, and backend API integration for core operations.

## Tech Stack
- React.js
- React Router DOM
- Axios
- dotenv

## Installation

1. Unzip the project and navigate to the `client/` directory:
    ```bash
    cd client
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Add environment variables:
    - Copy `.env.example` to `.env` and set your backend API URL.
    ```
    REACT_APP_API_URL=http://localhost:5000/api
    ```
4. Run the app:
    ```bash
    npm start
    ```

## Environment Variables

Example `.env.example`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## MVP Scope & Core Flows
This MVP implements the main user flows including job listing for applicants, a recruiter/admin dashboard for managing job posts,
and a CV submission form with validation and API integration. Core CRUD operations such as listing, creating, and managing job postings are functional.
Detailed user profiles, authentication, and advanced filtering features are not fully implemented and remain as placeholders.

## Screenshots
See the `screenshots/` folder for key UI samples:

- `Recruiter_overview.png`: Recruiter dashboard displaying active roles, applicants, events, actions, and highlighted job roles.
- `applicant_dashboard.png`: Applicant dashboard showing profile status, recent opportunities, notifications, and program application.
- `landing.png`: Recruiter landing page with steps for users (create account, enter CV, find jobs, apply).
- `Applicant_CV_Page.png`: Applicant CV submission form with input validation, required field checks.
- ` Recruiter_job_posting.png`: Recruiter job posting management page for creating/editing job listings.
- `Applicant_job_listing.png`: Applicant job listing page with filtering options and sample job details.

