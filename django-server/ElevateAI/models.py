from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
import uuid
import hashlib
import secrets
from datetime import datetime, timedelta


class User(AbstractUser):
    """Custom User model extending Django's AbstractUser"""
    name = models.CharField(max_length=50, blank=True)  # Add name field to match Node.js
    email = models.EmailField(unique=True)
    isProfileComplete = models.BooleanField(default=False)  # Match Node.js naming
    passwordResetToken = models.CharField(max_length=255, blank=True, null=True)  # Match Node.js naming
    passwordResetExpires = models.DateTimeField(blank=True, null=True)  # Match Node.js naming
    role = models.CharField(max_length=10, choices=[('user', 'User'), ('admin', 'Admin')], default='user')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def generate_password_reset_token(self):
        """Generate password reset token"""
        reset_token = secrets.token_urlsafe(32)
        self.passwordResetToken = hashlib.sha256(reset_token.encode()).hexdigest()
        self.passwordResetExpires = datetime.now() + timedelta(hours=1)
        self.save()
        return reset_token


class EmailVerification(models.Model):
    """Email verification model for user registration"""
    email = models.EmailField(unique=True)
    token = models.CharField(max_length=255, unique=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)
    user_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['expires_at']),
        ]
    
    @staticmethod
    def generate_token():
        """Generate verification token"""
        return secrets.token_urlsafe(32)
    
    @classmethod
    def create_verification(cls, email, user_data):
        """Create verification record"""
        # Remove any existing verification for this email
        cls.objects.filter(email=email).delete()
        
        token = cls.generate_token()
        verification = cls.objects.create(
            email=email,
            token=token,
            expires_at=datetime.now() + timedelta(hours=24),
            user_data=user_data
        )
        return verification
    
    @classmethod
    def verify_token(cls, token):
        """Verify token and get user data"""
        try:
            verification = cls.objects.get(
                token=token,
                expires_at__gt=datetime.now(),
                is_verified=False
            )
            verification.is_verified = True
            verification.save()
            return verification
        except cls.DoesNotExist:
            raise ValueError('Invalid or expired verification token')


class BasicDetails(models.Model):
    """Basic user details model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='basic_details')
    firstName = models.CharField(max_length=50)  # Match Node.js naming
    lastName = models.CharField(max_length=50)  # Match Node.js naming
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    linkedin = models.CharField(max_length=500)  # Change to CharField to match Node.js
    github = models.CharField(max_length=500)  # Change to CharField to match Node.js
    profilePicture = models.CharField(max_length=500, blank=True, default='')  # Match Node.js naming
    portfolio = models.CharField(max_length=500, blank=True, default='')  # Change to CharField
    bio = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Skills(models.Model):
    """User skills model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='skills')
    languages = models.JSONField(default=list, blank=True)
    technologies = models.JSONField(default=list, blank=True)
    frameworks = models.JSONField(default=list, blank=True)
    tools = models.JSONField(default=list, blank=True)
    softSkills = models.JSONField(default=list, blank=True)  # Match Node.js naming
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Project(models.Model):
    """Individual project model"""
    name = models.CharField(max_length=200)
    details = models.JSONField(default=list)
    githubLink = models.CharField(max_length=500, blank=True, default='')  # Match Node.js naming
    liveUrl = models.CharField(max_length=500, blank=True, default='')  # Match Node.js naming
    startDate = models.DateField()  # Match Node.js naming
    endDate = models.DateField(blank=True, null=True)  # Match Node.js naming
    skillsUsed = models.JSONField(default=list, blank=True)  # Match Node.js naming
    image = models.CharField(max_length=500, blank=True, default='')  # Change to CharField


class Projects(models.Model):
    """User projects collection model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='projects')
    projects = models.ManyToManyField(Project, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Certification(models.Model):
    """Individual certification model"""
    name = models.CharField(max_length=200)
    platform = models.CharField(max_length=100)
    skills = models.JSONField(default=list, blank=True)
    startDate = models.DateField()  # Match Node.js naming
    endDate = models.DateField(blank=True, null=True)  # Match Node.js naming


class Certifications(models.Model):
    """User certifications collection model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='certifications')
    certifications = models.ManyToManyField(Certification, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Experience(models.Model):
    """Individual experience model"""
    companyName = models.CharField(max_length=200)  # Match Node.js naming
    position = models.CharField(max_length=200)
    startDate = models.DateField()  # Match Node.js naming
    endDate = models.DateField(blank=True, null=True)  # Match Node.js naming
    isCurrent = models.BooleanField(default=False)  # Match Node.js naming
    skills = models.JSONField(default=list, blank=True)
    achievements = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True, default='')


class Experiences(models.Model):
    """User experiences collection model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='experiences')
    experiences = models.ManyToManyField(Experience, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class JobRoles(models.Model):
    """User job roles model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='job_roles')
    desiredJobRoles = models.JSONField(default=list)  # Match Node.js naming
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
