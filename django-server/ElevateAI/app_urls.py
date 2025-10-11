from django.urls import path
from . import views

urlpatterns = [
    # Health check
    path('health/', views.health_check, name='health_check'),
    
    # Authentication routes
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/me/', views.get_current_user, name='get_current_user'),
    path('auth/verify-email/', views.verify_email, name='verify_email'),
    path('auth/resend-verification/', views.resend_verification, name='resend_verification'),
    path('auth/forgot-password/', views.forgot_password, name='forgot_password'),
    path('auth/reset-password/<str:token>/', views.reset_password, name='reset_password'),
    path('auth/logout/', views.logout, name='logout'),
    
    # Profile routes - Basic Details
    path('profile/basic-details/', views.basic_details_handler, name='basic_details_handler'),
    path('profile/basic-details/profile-picture/', views.delete_profile_picture, name='delete_profile_picture'),
    
    # Profile routes - Skills
    path('profile/skills/', views.skills_handler, name='skills_handler'),
    
    # Profile routes - Projects
    path('profile/projects/', views.projects_handler, name='projects_handler'),
    
    # Profile routes - Certifications
    path('profile/certifications/', views.certifications_handler, name='certifications_handler'),
    
    # Profile routes - Experience
    path('profile/experience/', views.experience_handler, name='experience_handler'),
    
    # Profile routes - Job Roles
    path('profile/job-roles/', views.job_roles_handler, name='job_roles_handler'),
    
    path('profile/complete/', views.complete_profile, name='complete_profile'),
    path('profile/progress/', views.profile_progress_handler, name='profile_progress_handler'),
    path('profile/save-progress/', views.profile_progress_handler, name='save_progress'),
    
    # Image upload routes
    path('profile/upload-profile-picture/', views.upload_profile_picture, name='upload_profile_picture'),
    path('profile/upload-project-image/', views.upload_project_image, name='upload_project_image'),
    
    # AI routes
    path('ai/analyze-profile/', views.analyze_profile, name='analyze_profile'),
    path('ai/generate-test-questions/', views.generate_test_questions, name='generate_test_questions'),
]
