from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    User, EmailVerification, BasicDetails, Skills, Project, Projects,
    Certification, Certifications, Experience, Experiences, JobRoles
)


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """Custom User admin with additional fields"""
    list_display = ('email', 'name', 'isProfileComplete', 'role', 'is_active', 'date_joined')
    list_filter = ('isProfileComplete', 'role', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('email', 'name', 'username')
    ordering = ('-date_joined',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('ElevateAI Fields', {
            'fields': ('name', 'isProfileComplete', 'role', 'passwordResetToken', 'passwordResetExpires')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('ElevateAI Fields', {
            'fields': ('name', 'isProfileComplete', 'role')
        }),
    )


@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    """Email verification admin"""
    list_display = ('email', 'is_verified', 'expires_at', 'created_at')
    list_filter = ('is_verified', 'created_at', 'expires_at')
    search_fields = ('email',)
    readonly_fields = ('token', 'expires_at', 'created_at')
    ordering = ('-created_at',)


@admin.register(BasicDetails)
class BasicDetailsAdmin(admin.ModelAdmin):
    """Basic details admin"""
    list_display = ('user', 'firstName', 'lastName', 'email', 'phone')
    list_filter = ('created_at',)
    search_fields = ('firstName', 'lastName', 'email', 'phone')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)


@admin.register(Skills)
class SkillsAdmin(admin.ModelAdmin):
    """Skills admin"""
    list_display = ('user', 'languages_count', 'technologies_count', 'frameworks_count')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'user__name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def languages_count(self, obj):
        return len(obj.languages) if obj.languages else 0
    languages_count.short_description = 'Languages Count'
    
    def technologies_count(self, obj):
        return len(obj.technologies) if obj.technologies else 0
    technologies_count.short_description = 'Technologies Count'
    
    def frameworks_count(self, obj):
        return len(obj.frameworks) if obj.frameworks else 0
    frameworks_count.short_description = 'Frameworks Count'


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    """Individual project admin"""
    list_display = ('name', 'startDate', 'endDate', 'githubLink', 'liveUrl')
    list_filter = ('startDate', 'endDate')
    search_fields = ('name',)
    ordering = ('-startDate',)


@admin.register(Projects)
class ProjectsAdmin(admin.ModelAdmin):
    """User projects collection admin"""
    list_display = ('user', 'projects_count', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'user__name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def projects_count(self, obj):
        return obj.projects.count()
    projects_count.short_description = 'Projects Count'


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    """Individual certification admin"""
    list_display = ('name', 'platform', 'startDate', 'endDate')
    list_filter = ('platform', 'startDate', 'endDate')
    search_fields = ('name', 'platform')
    ordering = ('-startDate',)


@admin.register(Certifications)
class CertificationsAdmin(admin.ModelAdmin):
    """User certifications collection admin"""
    list_display = ('user', 'certifications_count', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'user__name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def certifications_count(self, obj):
        return obj.certifications.count()
    certifications_count.short_description = 'Certifications Count'


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    """Individual experience admin"""
    list_display = ('companyName', 'position', 'startDate', 'endDate', 'isCurrent')
    list_filter = ('isCurrent', 'startDate', 'endDate')
    search_fields = ('companyName', 'position')
    ordering = ('-startDate',)


@admin.register(Experiences)
class ExperiencesAdmin(admin.ModelAdmin):
    """User experiences collection admin"""
    list_display = ('user', 'experiences_count', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'user__name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def experiences_count(self, obj):
        return obj.experiences.count()
    experiences_count.short_description = 'Experiences Count'


@admin.register(JobRoles)
class JobRolesAdmin(admin.ModelAdmin):
    """Job roles admin"""
    list_display = ('user', 'desired_job_roles_count', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'user__name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    
    def desired_job_roles_count(self, obj):
        return len(obj.desiredJobRoles) if obj.desiredJobRoles else 0
    desired_job_roles_count.short_description = 'Desired Job Roles Count'
