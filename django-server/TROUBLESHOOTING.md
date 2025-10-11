# Django Server Troubleshooting Guide

## Common Issues and Solutions

### 1. 500 Internal Server Error

**Problem**: Getting 500 error when making API requests

**Solutions**:

1. **Check if Django server is running**:
   ```bash
   python manage.py runserver
   ```
   Server should be available at `http://localhost:8000`

2. **Check database migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Check for import errors**:
   ```bash
   python test_server.py
   ```

4. **Check Django logs**:
   Look at the terminal where you're running `python manage.py runserver` for error details.

### 2. CORS Issues

**Problem**: Frontend can't connect to backend

**Solutions**:

1. **Update Vite config** (already done):
   ```javascript
   // client/vite.config.js
   proxy: {
     '/api': {
       target: 'http://localhost:8000',  // Changed from 5000 to 8000
       changeOrigin: true,
       secure: false,
     },
   }
   ```

2. **Restart Vite dev server**:
   ```bash
   cd client
   npm run dev
   ```

### 3. Database Issues

**Problem**: Database not found or migration errors

**Solutions**:

1. **Delete existing database and recreate**:
   ```bash
   rm db.sqlite3
   python manage.py migrate
   ```

2. **Create superuser**:
   ```bash
   python manage.py createsuperuser
   ```

### 4. Import Errors

**Problem**: ModuleNotFoundError or ImportError

**Solutions**:

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Check Python path**:
   Make sure you're in the `django-server` directory

### 5. JWT Token Issues

**Problem**: Authentication not working

**Solutions**:

1. **Check JWT secret**:
   Make sure `SECRET_KEY` is set in your environment

2. **Test token generation**:
   ```python
   python -c "
   import os
   import django
   os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ElevateAI.settings')
   django.setup()
   from ElevateAI.views import generate_jwt_token
   print('JWT token test:', generate_jwt_token(1))
   "
   ```

## Quick Setup Commands

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Create and apply migrations
python manage.py makemigrations
python manage.py migrate

# 3. Create superuser (optional)
python manage.py createsuperuser

# 4. Run server
python manage.py runserver

# 5. Test server
curl http://localhost:8000/api/health/
```

## Environment Variables

Create a `.env` file with:

```env
SECRET_KEY=your-secret-key-here
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

## Testing the API

1. **Health check**:
   ```bash
   curl http://localhost:8000/api/health/
   ```

2. **Register user**:
   ```bash
   curl -X POST http://localhost:8000/api/auth/register/ \
     -H "Content-Type: application/json" \
     -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
   ```

## Common Error Messages

- **"ModuleNotFoundError"**: Install dependencies with `pip install -r requirements.txt`
- **"Database is locked"**: Stop the server and restart
- **"No such table"**: Run `python manage.py migrate`
- **"CORS error"**: Check Vite proxy configuration
- **"500 Internal Server Error"**: Check Django server logs for details
