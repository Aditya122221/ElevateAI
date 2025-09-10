# Profile Creation Setup Guide

## Overview
The profile creation page has been completely redesigned with a comprehensive 6-step process that collects detailed user information for better AI recommendations and career guidance.

## New Features

### 1. Basic Details (Required)
- First Name, Last Name, Email, Phone Number
- LinkedIn and GitHub profiles (required)
- Profile picture upload via Cloudinary
- Optional social links (Twitter, Website, Portfolio)
- Bio section

### 2. Skills (Required)
- Languages with proficiency levels
- Technologies with skill levels
- Frameworks with skill levels
- Tools with skill levels
- Soft Skills with proficiency levels

### 3. Projects (Optional)
- Project name, description, and details
- GitHub link and live URL
- Start and end dates
- Skills used in the project
- Project image upload

### 4. Certificates (Optional)
- Certificate name and platform
- Skills covered
- Start and end dates
- Credential ID and verification URL
- Certificate image upload

### 5. Experience (Optional)
- Company name and position
- Start and end dates
- Current employment status
- Key achievements
- Skills used
- Job description

### 6. Job Roles (Required)
- Multiple role selection from predefined list
- Includes roles like Full Stack Developer, Data Scientist, etc.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install cloudinary multer multer-storage-cloudinary
```

### 2. Environment Variables
Add these to your `.env` file:
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Cloudinary Setup
1. Create a Cloudinary account at https://cloudinary.com
2. Get your cloud name, API key, and API secret from the dashboard
3. Add them to your environment variables

### 4. Database Migration
The Profile model has been updated with new fields. Existing profiles will work with the new structure due to backward compatibility.

## Key Features

### Skip Functionality
- Projects, Certificates, and Experience sections are optional
- Users can skip these sections if they don't have relevant information
- Basic Details, Skills, and Job Roles are required

### Image Upload
- Profile pictures are automatically resized and optimized
- Project and certificate images are supported
- All images are stored securely on Cloudinary

### Form Validation
- Comprehensive client-side and server-side validation
- Real-time error messages
- Required field indicators

### Responsive Design
- Mobile-friendly interface
- Adaptive layout for different screen sizes
- Touch-friendly controls

## API Endpoints

### Profile Creation
- `POST /api/profile` - Create or update profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile` - Delete profile

### Image Upload
- `POST /api/profile/upload-profile-picture` - Upload profile picture
- `POST /api/profile/upload-project-image` - Upload project image
- `POST /api/profile/upload-certificate-image` - Upload certificate image

## Usage

1. Users will be redirected to the profile creation page after signup
2. They must complete the required sections (Basic Details, Skills, Job Roles)
3. Optional sections can be skipped or completed later
4. The form validates data in real-time
5. Upon completion, users are redirected to the dashboard

## Technical Details

### Frontend
- Built with React and Framer Motion for animations
- Uses react-hook-form for form management
- CSS Modules for styling
- Responsive design with mobile-first approach

### Backend
- Express.js with MongoDB
- Cloudinary integration for image handling
- Comprehensive validation with express-validator
- Secure file upload handling

### Database Schema
The Profile model includes:
- `basicDetails` - Personal information
- `skills` - Technical and soft skills
- `projects` - Project portfolio
- `certificates` - Professional certifications
- `experience` - Work experience
- `desiredJobRoles` - Career preferences

## Testing
To test the complete flow:
1. Start the server: `npm run dev`
2. Start the client: `npm run dev`
3. Sign up for a new account
4. Complete the profile creation process
5. Verify data is saved correctly in the database


Create a profile page with section user details, skills, projects, certificates, experience, goals. userdetails have filed name, email, phone, linkedin, github, portfolio. all details are updatable except email and phone number. skill include programming languages, technologies, frmeworks, tools and platforms, softskills. all are editable and can add new skills too. projects section has details project name, techstack used, start date, end date, details in points, github link and live url link. editable as well as new addition. certification section has details certificate name, platforms, tech stack used, start date, end date all editable as well as new certificate add option. experience section details include company name, role, tech stack used, details in points, startdate, enddate all editable as well as new data addition. goals section include the role on which the user want to get the job. editable as well as new addition
use jsx and module.css to build not tsx and tailwind