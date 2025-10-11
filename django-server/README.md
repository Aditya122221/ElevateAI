# ElevateAI Django Backend

This is the Django backend server for the ElevateAI application, providing the same API as the Node.js server.

## Features

- User authentication with JWT tokens
- Email verification system
- Password reset functionality
- Profile management (basic details, skills, projects, certifications, experience, job roles)
- Image upload to Cloudinary
- AI-powered profile analysis
- Test question generation

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register user (sends verification email)
- `POST /api/auth/login/` - Login user
- `GET /api/auth/me/` - Get current user
- `POST /api/auth/verify-email/` - Verify email and create account
- `POST /api/auth/resend-verification/` - Resend verification email
- `POST /api/auth/forgot-password/` - Request password reset
- `POST /api/auth/reset-password/<token>/` - Reset password
- `POST /api/auth/logout/` - Logout user

### Profile Management
- `POST/PUT /api/profile/basic-details/` - Save/update basic details
- `GET /api/profile/basic-details/` - Get basic details
- `DELETE /api/profile/basic-details/profile-picture/` - Delete profile picture
- `POST/PUT /api/profile/skills/` - Save/update skills
- `GET /api/profile/skills/` - Get skills
- `POST/PUT /api/profile/projects/` - Save/update projects
- `GET /api/profile/projects/` - Get projects
- `POST/PUT /api/profile/certifications/` - Save/update certifications
- `GET /api/profile/certifications/` - Get certifications
- `POST/PUT /api/profile/experience/` - Save/update experience
- `GET /api/profile/experience/` - Get experience
- `POST/PUT /api/profile/job-roles/` - Save/update job roles
- `GET /api/profile/job-roles/` - Get job roles
- `POST /api/profile/complete/` - Complete profile
- `GET /api/profile/progress/` - Get profile progress

### AI Features
- `POST /api/ai/analyze-profile/` - Analyze profile and get recommendations
- `POST /api/ai/generate-test-questions/` - Generate test questions

### Health Check
- `GET /api/health/` - Health check endpoint

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   Create a `.env` file with the following variables:
   ```
   SECRET_KEY=your-secret-key
   DEBUG=True
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   FROM_EMAIL=noreply@elevateai.com
   CLIENT_URL=http://localhost:5173
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

3. **Database Migration**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

4. **Create Superuser (Optional)**
   ```bash
   python manage.py createsuperuser
   ```

5. **Run Server**
   ```bash
   python manage.py runserver
   ```

The server will run on `http://localhost:8000` by default.

## API Usage

All API endpoints expect JSON data and return JSON responses. Include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your-jwt-token>
```

## CORS Configuration

The server is configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

## Database

The application uses SQLite by default. For production, consider using PostgreSQL or MySQL.

## Email Configuration

The application uses SMTP for sending emails. Configure your email settings in the environment variables.

## Cloudinary Integration

Configure Cloudinary settings for image uploads. The application supports:
- Profile picture uploads
- Project image uploads
- Certificate image uploads

## Development

- The server runs in debug mode by default
- Database migrations are handled automatically
- CORS is configured for development
- Logging is set up for debugging
