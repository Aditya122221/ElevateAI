# ElevateAI Django API Documentation

## Complete API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register/` | Register new user (sends verification email) | No |
| POST | `/api/auth/login/` | Login user | No |
| GET | `/api/auth/me/` | Get current user info | Yes |
| POST | `/api/auth/verify-email/` | Verify email and create account | No |
| POST | `/api/auth/resend-verification/` | Resend verification email | No |
| POST | `/api/auth/forgot-password/` | Request password reset | No |
| POST | `/api/auth/reset-password/<token>/` | Reset password with token | No |
| POST | `/api/auth/logout/` | Logout user | Yes |

### Profile Management Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET/POST/PUT | `/api/profile/basic-details/` | Handle basic details | Yes |
| DELETE | `/api/profile/basic-details/profile-picture/` | Delete profile picture | Yes |
| GET/POST/PUT | `/api/profile/skills/` | Handle skills | Yes |
| GET/POST/PUT | `/api/profile/projects/` | Handle projects | Yes |
| GET/POST/PUT | `/api/profile/certifications/` | Handle certifications | Yes |
| GET/POST/PUT | `/api/profile/experience/` | Handle experience | Yes |
| GET/POST/PUT | `/api/profile/job-roles/` | Handle job roles | Yes |
| POST | `/api/profile/complete/` | Complete profile | Yes |
| GET/POST | `/api/profile/progress/` | Get/save profile progress | Yes |
| POST | `/api/profile/save-progress/` | Save profile progress checkpoint | Yes |

### Image Upload Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/profile/upload-profile-picture/` | Upload profile picture | Yes |
| POST | `/api/profile/upload-project-image/` | Upload project image | Yes |

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/ai/analyze-profile/` | Analyze profile and get recommendations | Yes |
| POST | `/api/ai/generate-test-questions/` | Generate test questions | Yes |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health/` | Health check endpoint | No |

## Request/Response Examples

### 1. User Registration

**Request:**
```bash
POST /api/auth/register/
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Registration successful! Please check your email to verify your account.",
  "email": "john@example.com",
  "requiresVerification": true
}
```

### 2. User Login

**Request:**
```bash
POST /api/auth/login/
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isProfileComplete": false
  }
}
```

### 3. Save Basic Details

**Request:**
```bash
POST /api/profile/basic-details/
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "linkedin": "https://linkedin.com/in/johndoe",
  "github": "https://github.com/johndoe",
  "bio": "Software Developer"
}
```

**Response:**
```json
{
  "message": "Basic details saved successfully",
  "data": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "bio": "Software Developer",
    "profile_picture": "",
    "portfolio": ""
  }
}
```

### 4. Save Skills

**Request:**
```bash
POST /api/profile/skills/
Authorization: Bearer <token>
Content-Type: application/json

{
  "languages": ["JavaScript", "Python", "Java"],
  "technologies": ["React", "Node.js", "Django"],
  "frameworks": ["Express", "FastAPI"],
  "tools": ["Git", "Docker", "AWS"],
  "soft_skills": ["Leadership", "Communication", "Problem Solving"]
}
```

**Response:**
```json
{
  "message": "Skills saved successfully",
  "data": {
    "languages": ["JavaScript", "Python", "Java"],
    "technologies": ["React", "Node.js", "Django"],
    "frameworks": ["Express", "FastAPI"],
    "tools": ["Git", "Docker", "AWS"],
    "soft_skills": ["Leadership", "Communication", "Problem Solving"]
  }
}
```

### 5. Save Projects

**Request:**
```bash
POST /api/profile/projects/
Authorization: Bearer <token>
Content-Type: application/json

{
  "projects": [
    {
      "name": "E-commerce Website",
      "details": ["Built with React and Node.js", "Integrated payment gateway"],
      "github_link": "https://github.com/johndoe/ecommerce",
      "live_url": "https://ecommerce-demo.com",
      "start_date": "2023-01-01",
      "end_date": "2023-03-01",
      "skills_used": ["React", "Node.js", "MongoDB"],
      "image": ""
    }
  ]
}
```

**Response:**
```json
{
  "message": "Projects saved successfully",
  "data": {
    "projects": [
      {
        "name": "E-commerce Website",
        "details": ["Built with React and Node.js", "Integrated payment gateway"],
        "github_link": "https://github.com/johndoe/ecommerce",
        "live_url": "https://ecommerce-demo.com",
        "start_date": "2023-01-01",
        "end_date": "2023-03-01",
        "skills_used": ["React", "Node.js", "MongoDB"],
        "image": ""
      }
    ]
  }
}
```

### 6. Get Profile Progress

**Request:**
```bash
GET /api/profile/progress/
Authorization: Bearer <token>
```

**Response:**
```json
{
  "hasProfile": true,
  "completionStatus": {
    "basicDetails": true,
    "skills": true,
    "projects": false,
    "certificates": false,
    "experience": false,
    "jobRoles": false
  },
  "lastCompletedStep": 2,
  "completionPercentage": 33.33,
  "profileData": {
    "basicDetails": { ... },
    "skills": { ... },
    "projects": null,
    "certifications": null,
    "experience": null,
    "jobRoles": null
  }
}
```

### 7. AI Profile Analysis

**Request:**
```bash
POST /api/ai/analyze-profile/
Authorization: Bearer <token>
Content-Type: application/json

{}
```

**Response:**
```json
{
  "message": "Profile analysis completed successfully",
  "recommendations": {
    "suggestedSkills": [
      "Advanced JavaScript/TypeScript",
      "Cloud Computing (AWS/Azure)",
      "Database Design & Optimization"
    ],
    "suggestedCertifications": [
      "AWS Certified Developer",
      "Google Cloud Professional"
    ],
    "careerPath": [
      "Junior Developer",
      "Mid-level Developer",
      "Senior Developer"
    ],
    "skillGaps": [
      "Advanced system design",
      "Cloud platform expertise"
    ],
    "analysis": "Based on your profile, focus on advancing your technical skills..."
  },
  "aiServiceAvailable": false
}
```

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "field": "email",
      "message": "Enter a valid email address."
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Token is not valid"
}
```

### 404 Not Found
```json
{
  "message": "No profile picture found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error while saving basic details"
}
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## File Uploads

For image uploads, use `multipart/form-data`:

```bash
POST /api/profile/upload-profile-picture/
Authorization: Bearer <token>
Content-Type: multipart/form-data

profilePicture: <file>
```

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production use.

## Database

The API uses SQLite by default. For production, consider using PostgreSQL or MySQL.

## Environment Variables

Required environment variables:
- `SECRET_KEY`: Django secret key
- `SMTP_USER`: Email service username
- `SMTP_PASS`: Email service password
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
