# SENG 429 - Recruitment Management System (Backend MVP)

## Project Description

This is the backend API for a Recruitment Management System built with Node.js, Express.js, and MongoDB. The system allows applicants to submit CVs and apply for jobs, recruiters to post job openings and review applications, and admins to manage users and content.

**Current MVP Implementation:**
- Full CRUD operations for Jobs, CVs, and Users
- MongoDB database integration with 7 data models
- File upload support for CVs and certificates
- User authentication (register/login)
- Admin user management
- Job application system

---

## Installation Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) installed and running locally
- npm or yarn package manager

### Setup Steps

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB connection string if needed
```

---

## Run Instructions

### Start MongoDB
Make sure MongoDB is running on your system:

```bash
# Windows (if installed as service)
# MongoDB should start automatically

# Or manually start:
mongod
```

### Start the Server

```bash
# Development mode (with auto-reload if configured)
npm run dev

# Or standard mode
npm start
```

The server will start on `http://localhost:3000`

---

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. **Jobs Endpoints** (Main Entity)

#### Create a Job
```http
POST /api/jobs
Content-Type: application/json

{
  "title": "Software Engineer",
  "description": "Join our team...",
  "location": "Istanbul",
  "jobType": "full_time",
  "deadline": "2024-12-31",
  "postedBy": "userId123"
}

Response: 201 Created
{
  "success": true,
  "message": "Job created successfully",
  "job": { ...jobData }
}
```

#### Get All Jobs
```http
GET /api/jobs

Response: 200 OK
{
  "success": true,
  "jobs": [
    {
      "id": "...",
      "title": "Software Engineer",
      "location": "Istanbul",
      "jobType": "full_time",
      ...
    }
  ]
}
```

#### Get Job by ID
```http
GET /api/jobs/:id

Response: 200 OK
{
  "success": true,
  "job": { ...jobData }
}
```

#### Update Job
```http
PUT /api/jobs/:id
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "location": "Remote"
}

Response: 200 OK
{
  "success": true,
  "message": "Job updated successfully"
}
```

#### Delete Job
```http
DELETE /api/jobs/:id

Response: 200 OK
{
  "success": true,
  "message": "Job deleted successfully"
}
```

### 2. **CV/Resume Endpoints**

#### Submit CV
```http
POST /api/cv/submit
Content-Type: multipart/form-data

FormData:
- userId: "123"
- fullName: "John Doe"
- birthDate: "1990-01-01"
- certificates: "AWS Certified"
- certificateFiles: [file1, file2]

Response: 201 Created
{
  "success": true,
  "message": "CV submitted successfully"
}
```

#### Get CV by User ID
```http
GET /api/cv/user/:userId

Response: 200 OK
{
  "success": true,
  "data": { ...cvData }
}
```

#### Delete CV
```http
DELETE /api/cv/user/:userId

Response: 200 OK
{
  "success": true,
  "message": "CV deleted successfully"
}
```

### 3. **Authentication Endpoints**

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "applicant"
}

Response: 201 Created
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "applicant"
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "user": { ...userData }
}
```

### 4. **Admin Endpoints**

#### Get All Users (Admin)
```http
GET /api/admin/users

Response: 200 OK
{
  "success": true,
  "users": [ ...users ]
}
```

#### Get All CVs (Admin)
```http
GET /api/admin/cvs

Response: 200 OK
{
  "success": true,
  "cvs": [ ...cvs ]
}
```

---

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/recruitment_db
NODE_ENV=development
JWT_SECRET=your_secret_key_here
```

See `.env.example` for reference.

---

## Database Models

### Implemented Models (7 total):

1. **User** - Authentication and user accounts
   - Fields: email, passwordHash, role, banned, createdAt

2. **Job** - Job postings (Main Entity)
   - Fields: title, description, location, jobType, deadline, recruiterId, isActive

3. **Application** - Job applications
   - Fields: jobId, userId, status, notes, appliedAt

4. **CV** - Applicant resumes
   - Fields: applicantId, fullName, birthDate, education, experience, certificates

5. **Applicant** - Applicant profiles
   - Fields: userId, firstName, lastName, phone, city, profilePicture

6. **Recruiter** - Recruiter profiles
   - Fields: userId, companyName, contactName, phone

7. **Notification** - System notifications
   - Fields: userId, type, message, read, createdAt

---

## Error Handling

The API implements standard HTTP error codes:

- **400 Bad Request** - Invalid input or validation errors
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Unexpected server errors

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Current Scope & Implementation Status

### ✅ Completed for MVP:
- Full CRUD for Jobs entity
- Full CRUD for CV entity
- User authentication (register/login)
- MongoDB integration with 7 models
- File upload functionality (multipart/form-data)
- Admin user management endpoints
- Job application system
- Error handling (400, 404, 500)
- CORS configuration
- Environment variable configuration

### 🚀 Planned for Final Submission:
- JWT token-based authentication
- Role-based access control middleware
- Advanced filtering and sorting for jobs
- Search functionality
- Statistics and analytics endpoints
- Email notifications
- Rate limiting
- Request validation middleware
- Unit and integration tests
- API documentation (Swagger/OpenAPI)

---

## Testing the API

### Using cURL:

```bash
# Health check
curl http://localhost:3000/health

# Get all jobs
curl http://localhost:3000/api/jobs

# Create a job
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Developer","location":"Istanbul","jobType":"full_time","postedBy":"123"}'
```

### Using Postman:
1. Import the base URL: `http://localhost:3000/api`
2. Create requests for each endpoint listed above
3. For file uploads, use form-data in the Body tab

---

## Project Structure

```
server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── upload.js          # Multer file upload config
├── model/
│   ├── User.js
│   ├── Job.js             # Main entity
│   ├── Application.js
│   ├── CV.js
│   ├── Applicant.js
│   ├── Recruiter.js
│   └── Notification.js
├── routes/
│   ├── authentication.js  # Auth routes
│   ├── jobs.js            # Job CRUD routes
│   ├── cvs.js             # CV routes
│   ├── admin.js           # Admin routes
│   ├── applicant.js       # Applicant profile routes
│   └── events.js          # Events routes
├── uploads/               # Uploaded files storage
│   ├── cvs/
│   └── profiles/
├── .env                   # Environment variables (not in repo)
├── .env.example           # Environment template
├── package.json
├── server.js              # Main application file
└── README.md
```

---

## Default Admin Account

The system creates a default admin account on first run:

```
Email: admin@recruiter.com
Password: admin123
```

**⚠️ Change this password in production!**

---

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)
- **Multer** - File upload middleware
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

---

## Contributors

Group: [Your Group Number]
- [Your Name] - [Your Student ID]
- [Team Member 2]
- [Team Member 3]

---

## License

This project is for educational purposes as part of SENG 429 coursework.

