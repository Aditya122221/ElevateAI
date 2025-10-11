from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (
    User, EmailVerification, BasicDetails, Skills, Project, Projects,
    Certification, Certifications, Experience, Experiences, JobRoles
)


class UserSerializer(serializers.ModelSerializer):
    """User serializer"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isProfileComplete', 'role']
        read_only_fields = ['id', 'isProfileComplete', 'role']


class EmailVerificationSerializer(serializers.ModelSerializer):
    """Email verification serializer"""
    class Meta:
        model = EmailVerification
        fields = ['email', 'token', 'expires_at', 'is_verified', 'user_data']
        read_only_fields = ['token', 'expires_at', 'is_verified']


class BasicDetailsSerializer(serializers.ModelSerializer):
    """Basic details serializer"""
    class Meta:
        model = BasicDetails
        fields = [
            'firstName', 'lastName', 'email', 'phone', 'linkedin', 'github',
            'profilePicture', 'portfolio', 'bio'
        ]


class SkillsSerializer(serializers.ModelSerializer):
    """Skills serializer"""
    class Meta:
        model = Skills
        fields = ['languages', 'technologies', 'frameworks', 'tools', 'softSkills']


class ProjectSerializer(serializers.ModelSerializer):
    """Individual project serializer"""
    class Meta:
        model = Project
        fields = [
            'name', 'details', 'githubLink', 'liveUrl', 'startDate',
            'endDate', 'skillsUsed', 'image'
        ]


class ProjectsSerializer(serializers.ModelSerializer):
    """Projects collection serializer"""
    projects = ProjectSerializer(many=True, required=False)
    
    class Meta:
        model = Projects
        fields = ['projects']
    
    def create(self, validated_data):
        projects_data = validated_data.pop('projects', [])
        projects_obj = Projects.objects.create(**validated_data)
        for project_data in projects_data:
            project = Project.objects.create(**project_data)
            projects_obj.projects.add(project)
        return projects_obj
    
    def update(self, instance, validated_data):
        projects_data = validated_data.pop('projects', [])
        instance.projects.clear()
        for project_data in projects_data:
            project = Project.objects.create(**project_data)
            instance.projects.add(project)
        return instance


class CertificationSerializer(serializers.ModelSerializer):
    """Individual certification serializer"""
    class Meta:
        model = Certification
        fields = ['name', 'platform', 'skills', 'startDate', 'endDate']


class CertificationsSerializer(serializers.ModelSerializer):
    """Certifications collection serializer"""
    certifications = CertificationSerializer(many=True, required=False)
    
    class Meta:
        model = Certifications
        fields = ['certifications']
    
    def create(self, validated_data):
        certifications_data = validated_data.pop('certifications', [])
        certifications_obj = Certifications.objects.create(**validated_data)
        for certification_data in certifications_data:
            certification = Certification.objects.create(**certification_data)
            certifications_obj.certifications.add(certification)
        return certifications_obj
    
    def update(self, instance, validated_data):
        certifications_data = validated_data.pop('certifications', [])
        instance.certifications.clear()
        for certification_data in certifications_data:
            certification = Certification.objects.create(**certification_data)
            instance.certifications.add(certification)
        return instance


class ExperienceSerializer(serializers.ModelSerializer):
    """Individual experience serializer"""
    class Meta:
        model = Experience
        fields = [
            'companyName', 'position', 'startDate', 'endDate', 'isCurrent',
            'skills', 'achievements', 'description'
        ]


class ExperiencesSerializer(serializers.ModelSerializer):
    """Experiences collection serializer"""
    experiences = ExperienceSerializer(many=True, required=False)
    
    class Meta:
        model = Experiences
        fields = ['experiences']
    
    def create(self, validated_data):
        experiences_data = validated_data.pop('experiences', [])
        experiences_obj = Experiences.objects.create(**validated_data)
        for experience_data in experiences_data:
            experience = Experience.objects.create(**experience_data)
            experiences_obj.experiences.add(experience)
        return experiences_obj
    
    def update(self, instance, validated_data):
        experiences_data = validated_data.pop('experiences', [])
        instance.experiences.clear()
        for experience_data in experiences_data:
            experience = Experience.objects.create(**experience_data)
            instance.experiences.add(experience)
        return instance


class JobRolesSerializer(serializers.ModelSerializer):
    """Job roles serializer"""
    class Meta:
        model = JobRoles
        fields = ['desiredJobRoles']


class RegisterSerializer(serializers.Serializer):
    """User registration serializer"""
    name = serializers.CharField(max_length=50, min_length=2)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6)
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User already exists with this email")
        return value


class LoginSerializer(serializers.Serializer):
    """User login serializer"""
    email = serializers.EmailField()
    password = serializers.CharField()


class VerifyEmailSerializer(serializers.Serializer):
    """Email verification serializer"""
    token = serializers.CharField()


class ResendVerificationSerializer(serializers.Serializer):
    """Resend verification serializer"""
    email = serializers.EmailField()


class ForgotPasswordSerializer(serializers.Serializer):
    """Forgot password serializer"""
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    """Reset password serializer"""
    password = serializers.CharField(min_length=6)
