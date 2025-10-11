from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.conf import settings
import jwt
import hashlib
from datetime import datetime, timedelta

from .models import (
    User, EmailVerification, BasicDetails, Skills, Project, Projects,
    Certification, Certifications, Experience, Experiences, JobRoles
)
from .serializers import (
    UserSerializer, BasicDetailsSerializer, SkillsSerializer, ProjectsSerializer,
    CertificationsSerializer, ExperiencesSerializer, JobRolesSerializer,
    RegisterSerializer, LoginSerializer, VerifyEmailSerializer,
    ResendVerificationSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
)
from .services.email_service import EmailService
from .services.cloudinary_service import CloudinaryService


def generate_jwt_token(user_id):
    """Generate JWT token for user"""
    payload = {
        'id': user_id,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm='HS256')


def get_user_from_token(request):
    """Extract user from JWT token"""
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=['HS256'])
        user_id = payload['id']
        return User.objects.get(id=user_id)
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist):
        return None


# ==================== AUTHENTICATION VIEWS ====================

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """Register user (send verification email)"""
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    email = data['email']
    
    # Check if there's already a pending verification for this email
    existing_verification = EmailVerification.objects.filter(
        email=email, is_verified=False
    ).first()
    if existing_verification:
        return Response({
            'message': 'A verification email has already been sent to this address. Please check your email or wait before requesting another.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create verification record
    user_data = {
        'name': data['name'],
        'password': data['password']
    }
    verification = EmailVerification.create_verification(email, user_data)
    
    # Send verification email
    email_service = EmailService()
    email_service.send_verification_email(email, data['name'], verification.token)
    
    return Response({
        'message': 'Registration successful! Please check your email to verify your account.',
        'email': email,
        'requiresVerification': True
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """Login user"""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    email = data['email']
    password = data['password']
    
    # Check if user exists
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check password
    if not user.check_password(password):
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Generate token
    token = generate_jwt_token(user.id)
    
    return Response({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'isProfileComplete': user.isProfileComplete
        }
    })


@api_view(['GET'])
def get_current_user(request):
    """Get current user"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = UserSerializer(user)
    return Response({'user': serializer.data})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verify_email(request):
    """Verify email and create user account"""
    serializer = VerifyEmailSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    token = serializer.validated_data['token']
    
    try:
        # Verify token and get user data
        verification = EmailVerification.verify_token(token)
        email = verification.email
        user_data = verification.user_data
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({'message': 'Email already verified and account exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user account
        user = User.objects.create_user(
            username=user_data['name'],
            email=email,
            password=user_data['password'],
            name=user_data['name']
        )
        
        # Generate token
        auth_token = generate_jwt_token(user.id)
        
        return Response({
            'message': 'Email verified successfully! Your account has been created.',
            'token': auth_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'isProfileComplete': user.isProfileComplete
            }
        }, status=status.HTTP_201_CREATED)
        
    except ValueError as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def resend_verification(request):
    """Resend verification email"""
    serializer = ResendVerificationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    
    # Check if user already exists
    if User.objects.filter(email=email).exists():
        return Response({'message': 'Email already verified and account exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if there's a pending verification
    existing_verification = EmailVerification.objects.filter(
        email=email, is_verified=False
    ).first()
    if not existing_verification:
        return Response({'message': 'No pending verification found for this email'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Send verification email again
    email_service = EmailService()
    email_service.send_verification_email(email, existing_verification.user_data['name'], existing_verification.token)
    
    return Response({'message': 'Verification email sent successfully! Please check your email.'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def forgot_password(request):
    """Request password reset"""
    serializer = ForgotPasswordSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'message': 'User with that email does not exist.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Generate password reset token
    reset_token = user.generate_password_reset_token()
    
    # Send reset email
    reset_url = f"{settings.CLIENT_URL}/reset-password/{reset_token}"
    email_service = EmailService()
    email_service.send_password_reset_email(user.email, user.get_full_name(), reset_url)
    
    return Response({'message': 'Password reset link sent to your email.'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def reset_password(request, token):
    """Reset user password"""
    serializer = ResetPasswordSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    password = serializer.validated_data['password']
    
    # Hash the token to compare with the stored hashed token
    hashed_token = hashlib.sha256(token.encode()).hexdigest()
    
    try:
        user = User.objects.get(
            password_reset_token=hashed_token,
            password_reset_expires__gt=timezone.now()
        )
    except User.DoesNotExist:
        return Response({'message': 'Invalid or expired password reset token.'}, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(password)
    user.password_reset_token = None
    user.password_reset_expires = None
    user.save()
    
    return Response({'message': 'Password has been reset successfully.'})


@api_view(['POST'])
def logout(request):
    """Logout user (client-side token removal)"""
    return Response({'message': 'Logout successful'})


# ==================== PROFILE VIEWS ====================

@api_view(['GET', 'POST', 'PUT'])
@permission_classes([permissions.AllowAny])
def basic_details_handler(request):
    """Handle basic details GET, POST, and PUT requests"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == 'GET':
        try:
            basic_details = BasicDetails.objects.get(user=user)
            serializer = BasicDetailsSerializer(basic_details)
            return Response({'data': serializer.data})
        except BasicDetails.DoesNotExist:
            return Response({'data': None})
    
    elif request.method in ['POST', 'PUT']:
        serializer = BasicDetailsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        data['user'] = user
        
        # Handle profile picture upload to Cloudinary
        if data.get('profile_picture') and data['profile_picture'].startswith('data:image/'):
            try:
                # Get existing basic details to check for old profile picture
                existing_basic_details = BasicDetails.objects.filter(user=user).first()
                
                # Delete old profile picture from Cloudinary if it exists
                if existing_basic_details and existing_basic_details.profile_picture and 'cloudinary.com' in existing_basic_details.profile_picture:
                    cloudinary_service = CloudinaryService()
                    cloudinary_service.delete_image(existing_basic_details.profile_picture)
                
                # Upload new profile picture to Cloudinary
                cloudinary_service = CloudinaryService()
                cloudinary_result = cloudinary_service.upload_base64_image(
                    data['profile_picture'], 'Elevate AI/profile-pictures'
                )
                data['profile_picture'] = cloudinary_result['secure_url']
            except Exception as e:
                return Response({'message': 'Error uploading profile picture to cloud storage'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        basic_details, created = BasicDetails.objects.update_or_create(
            user=user, defaults=data
        )
        
        return Response({
            'message': 'Basic details saved successfully',
            'data': BasicDetailsSerializer(basic_details).data
        })


@api_view(['DELETE'])
def delete_profile_picture(request):
    """Delete profile picture"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        basic_details = BasicDetails.objects.get(user=user)
        if not basic_details.profile_picture:
            return Response({'message': 'No profile picture found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Delete from Cloudinary if it's a Cloudinary URL
        if 'cloudinary.com' in basic_details.profile_picture:
            try:
                cloudinary_service = CloudinaryService()
                cloudinary_service.delete_image(basic_details.profile_picture)
            except Exception as e:
                # Continue with database update even if Cloudinary deletion fails
                pass
        
        # Update database to remove profile picture
        basic_details.profile_picture = ''
        basic_details.save()
        
        return Response({
            'message': 'Profile picture deleted successfully',
            'data': BasicDetailsSerializer(basic_details).data
        })
    except BasicDetails.DoesNotExist:
        return Response({'message': 'No profile picture found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([permissions.AllowAny])
def skills_handler(request):
    """Handle skills GET, POST, and PUT requests"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == 'GET':
        try:
            skills = Skills.objects.get(user=user)
            serializer = SkillsSerializer(skills)
            return Response({'data': serializer.data})
        except Skills.DoesNotExist:
            return Response({'data': None})
    
    elif request.method in ['POST', 'PUT']:
        serializer = SkillsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        data['user'] = user
        
        skills, created = Skills.objects.update_or_create(user=user, defaults=data)
        
        return Response({
            'message': 'Skills saved successfully',
            'data': SkillsSerializer(skills).data
        })


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([permissions.AllowAny])
def projects_handler(request):
    """Handle projects GET, POST, and PUT requests"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == 'GET':
        try:
            projects = Projects.objects.get(user=user)
            serializer = ProjectsSerializer(projects)
            return Response({'data': serializer.data})
        except Projects.DoesNotExist:
            return Response({'data': None})
    
    elif request.method in ['POST', 'PUT']:
        serializer = ProjectsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        data['user'] = user
        
        projects, created = Projects.objects.update_or_create(user=user, defaults=data)
        
        return Response({
            'message': 'Projects saved successfully',
            'data': ProjectsSerializer(projects).data
        })


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([permissions.AllowAny])
def certifications_handler(request):
    """Handle certifications GET, POST, and PUT requests"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == 'GET':
        try:
            certifications = Certifications.objects.get(user=user)
            serializer = CertificationsSerializer(certifications)
            return Response({'data': serializer.data})
        except Certifications.DoesNotExist:
            return Response({'data': None})
    
    elif request.method in ['POST', 'PUT']:
        serializer = CertificationsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        data['user'] = user
        
        certifications, created = Certifications.objects.update_or_create(user=user, defaults=data)
        
        return Response({
            'message': 'Certifications saved successfully',
            'data': CertificationsSerializer(certifications).data
        })


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([permissions.AllowAny])
def experience_handler(request):
    """Handle experience GET, POST, and PUT requests"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == 'GET':
        try:
            experience = Experiences.objects.get(user=user)
            serializer = ExperiencesSerializer(experience)
            return Response({'data': serializer.data})
        except Experiences.DoesNotExist:
            return Response({'data': None})
    
    elif request.method in ['POST', 'PUT']:
        serializer = ExperiencesSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        data['user'] = user
        
        experience, created = Experiences.objects.update_or_create(user=user, defaults=data)
        
        return Response({
            'message': 'Experience saved successfully',
            'data': ExperiencesSerializer(experience).data
        })


@api_view(['GET', 'POST', 'PUT'])
@permission_classes([permissions.AllowAny])
def job_roles_handler(request):
    """Handle job roles GET, POST, and PUT requests"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == 'GET':
        try:
            job_roles = JobRoles.objects.get(user=user)
            serializer = JobRolesSerializer(job_roles)
            return Response({'data': serializer.data})
        except JobRoles.DoesNotExist:
            return Response({'data': None})
    
    elif request.method in ['POST', 'PUT']:
        serializer = JobRolesSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        data['user'] = user
        
        job_roles, created = JobRoles.objects.update_or_create(user=user, defaults=data)
        
        return Response({
            'message': 'Job roles saved successfully',
            'data': JobRolesSerializer(job_roles).data
        })


@api_view(['POST'])
def complete_profile(request):
    """Complete profile by combining all sections"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Get all sections data
    basic_details = BasicDetails.objects.filter(user=user).first()
    skills = Skills.objects.filter(user=user).first()
    projects = Projects.objects.filter(user=user).first()
    certifications = Certifications.objects.filter(user=user).first()
    experience = Experiences.objects.filter(user=user).first()
    job_roles = JobRoles.objects.filter(user=user).first()
    
    # Only validate the absolutely required sections
    if not basic_details:
        return Response({
            'message': 'Basic details are required to complete profile',
            'missingSection': 'basicDetails'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not skills:
        return Response({
            'message': 'Skills are required to complete profile',
            'missingSection': 'skills'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not job_roles or not job_roles.desired_job_roles:
        return Response({
            'message': 'At least one job role is required to complete profile',
            'missingSection': 'jobRoles'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Update user's profile completion status
    user.is_profile_complete = True
    user.save()
    
    return Response({
        'message': 'Profile completed successfully',
        'sections': {
            'basicDetails': bool(basic_details),
            'skills': bool(skills),
            'projects': bool(projects),
            'certifications': bool(certifications),
            'experience': bool(experience),
            'jobRoles': bool(job_roles)
        }
    })


@api_view(['GET', 'POST'])
def profile_progress_handler(request):
    """Handle profile progress GET and POST requests"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    if request.method == 'GET':
        # Get all sections data
        basic_details = BasicDetails.objects.filter(user=user).first()
        skills = Skills.objects.filter(user=user).first()
        projects = Projects.objects.filter(user=user).first()
        certifications = Certifications.objects.filter(user=user).first()
        experience = Experiences.objects.filter(user=user).first()
        job_roles = JobRoles.objects.filter(user=user).first()
        
        has_profile = any([basic_details, skills, projects, certifications, experience, job_roles])
        
        completion_status = {
            'basicDetails': bool(basic_details),
            'skills': bool(skills),
            'projects': bool(projects),
            'certificates': bool(certifications),
            'experience': bool(experience),
            'jobRoles': bool(job_roles)
        }
        
        # Calculate completion percentage
        completed_sections = sum(completion_status.values())
        total_sections = len(completion_status)
        completion_percentage = (completed_sections / total_sections) * 100
        
        # Find last completed step
        last_completed_step = 0
        if basic_details:
            last_completed_step = 1
        if skills:
            last_completed_step = 2
        if projects:
            last_completed_step = 3
        if certifications:
            last_completed_step = 4
        if experience:
            last_completed_step = 5
        if job_roles:
            last_completed_step = 6
        
        response_data = {
            'hasProfile': has_profile,
            'completionStatus': completion_status,
            'lastCompletedStep': last_completed_step,
            'completionPercentage': completion_percentage
        }
        
        if has_profile:
            response_data['profileData'] = {
                'basicDetails': BasicDetailsSerializer(basic_details).data if basic_details else None,
                'skills': SkillsSerializer(skills).data if skills else None,
                'projects': ProjectsSerializer(projects).data if projects else None,
                'certifications': CertificationsSerializer(certifications).data if certifications else None,
                'experience': ExperiencesSerializer(experience).data if experience else None,
                'jobRoles': JobRolesSerializer(job_roles).data if job_roles else None
            }
        
        return Response(response_data)
    
    elif request.method == 'POST':
        # Save profile progress (checkpoint)
        try:
            # This endpoint is for saving progress checkpoints
            # In Django, we don't need a separate Profile model since we use individual section models
            # Just return the current progress status
            basic_details = BasicDetails.objects.filter(user=user).first()
            skills = Skills.objects.filter(user=user).first()
            projects = Projects.objects.filter(user=user).first()
            certifications = Certifications.objects.filter(user=user).first()
            experience = Experiences.objects.filter(user=user).first()
            job_roles = JobRoles.objects.filter(user=user).first()
            
            completion_status = {
                'basicDetails': bool(basic_details),
                'skills': bool(skills),
                'projects': bool(projects),
                'certificates': bool(certifications),
                'experience': bool(experience),
                'jobRoles': bool(job_roles)
            }
            
            # Calculate completion percentage
            completed_sections = sum(completion_status.values())
            total_sections = len(completion_status)
            completion_percentage = (completed_sections / total_sections) * 100
            
            # Find last completed step
            last_completed_step = 0
            if basic_details:
                last_completed_step = 1
            if skills:
                last_completed_step = 2
            if projects:
                last_completed_step = 3
            if certifications:
                last_completed_step = 4
            if experience:
                last_completed_step = 5
            if job_roles:
                last_completed_step = 6
            
            return Response({
                'message': 'Profile progress saved successfully',
                'profile': {
                    'completionStatus': completion_status,
                    'lastCompletedStep': last_completed_step,
                    'completionPercentage': completion_percentage
                }
            })
        except Exception as error:
            return Response({'message': 'Server error while saving profile progress'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== IMAGE UPLOAD VIEWS ====================

@api_view(['POST'])
def upload_profile_picture(request):
    """Upload profile picture"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        if 'profilePicture' not in request.FILES:
            return Response({'message': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        file = request.FILES['profilePicture']
        cloudinary_service = CloudinaryService()
        result = cloudinary_service.upload_profile_picture(file)
        
        return Response({
            'message': 'Profile picture uploaded successfully',
            'imageUrl': result['secure_url']
        })
    except Exception as error:
        return Response({'message': 'Server error while uploading profile picture'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def upload_project_image(request):
    """Upload project image"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    try:
        if 'projectImage' not in request.FILES:
            return Response({'message': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        file = request.FILES['projectImage']
        cloudinary_service = CloudinaryService()
        result = cloudinary_service.upload_project_image(file)
        
        return Response({
            'message': 'Project image uploaded successfully',
            'imageUrl': result['secure_url']
        })
    except Exception as error:
        return Response({'message': 'Server error while uploading project image'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== AI VIEWS ====================

@api_view(['POST'])
def analyze_profile(request):
    """Analyze user profile and generate recommendations"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Get all sections data
    basic_details = BasicDetails.objects.filter(user=user).first()
    skills = Skills.objects.filter(user=user).first()
    projects = Projects.objects.filter(user=user).first()
    experience = Experiences.objects.filter(user=user).first()
    job_roles = JobRoles.objects.filter(user=user).first()
    
    # Check if required sections exist
    if not basic_details or not skills or not job_roles:
        return Response({'message': 'Profile not found. Please complete your profile first.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Create a comprehensive prompt for AI analysis
    prompt = f"""
    Analyze the following user profile and provide personalized career recommendations:

    Personal Information:
    - Name: {basic_details.first_name} {basic_details.last_name}
    - Email: {basic_details.email}
    - LinkedIn: {basic_details.linkedin}
    - GitHub: {basic_details.github}
    - Bio: {basic_details.bio or 'Not specified'}

    Desired Job Roles:
    - {', '.join(job_roles.desired_job_roles)}

    Technical Skills:
    - Programming Languages: {', '.join(skills.languages) if skills.languages else 'None specified'}
    - Technologies: {', '.join(skills.technologies) if skills.technologies else 'None specified'}
    - Frameworks: {', '.join(skills.frameworks) if skills.frameworks else 'None specified'}
    - Tools: {', '.join(skills.tools) if skills.tools else 'None specified'}
    - Soft Skills: {', '.join(skills.soft_skills) if skills.soft_skills else 'None specified'}

    Projects:
    {''.join([f'''
    - {project.name}
      Details: {', '.join(project.details)}
      Technologies: {', '.join(project.skills_used) if project.skills_used else 'None specified'}
      Duration: {project.start_date} to {project.end_date or 'Present'}
    ''' for project in projects.projects.all()]) if projects and projects.projects.exists() else 'No projects specified'}

    Experience:
    {''.join([f'''
    - {exp.position} at {exp.company_name}
      Duration: {exp.start_date} to {exp.end_date or 'Present'}
      Skills: {', '.join(exp.skills) if exp.skills else 'None specified'}
      Achievements: {', '.join(exp.achievements) if exp.achievements else 'None specified'}
    ''' for exp in experience.experiences.all()]) if experience and experience.experiences.exists() else 'No experience specified'}

    Based on this profile, please provide:
    1. 5-7 specific technical skills they should develop to advance in their desired role
    2. 3-5 relevant certifications that would boost their career
    3. A suggested career progression path with 3-4 steps
    4. Any gaps in their current skill set that need attention

    Format your response as a JSON object with the following structure:
    {{
      "suggestedSkills": ["skill1", "skill2", "skill3"],
      "suggestedCertifications": ["cert1", "cert2", "cert3"],
      "careerPath": ["step1", "step2", "step3"],
      "skillGaps": ["gap1", "gap2", "gap3"],
      "analysis": "Brief analysis of their profile and recommendations"
    }}
    """
    
    # For now, return fallback recommendations
    # In a real implementation, you would call an AI service here
    recommendations = {
        "suggestedSkills": [
            "Advanced JavaScript/TypeScript",
            "Cloud Computing (AWS/Azure)",
            "Database Design & Optimization",
            "System Architecture",
            "DevOps & CI/CD"
        ],
        "suggestedCertifications": [
            "AWS Certified Developer",
            "Google Cloud Professional",
            "Microsoft Azure Fundamentals"
        ],
        "careerPath": [
            "Junior Developer",
            "Mid-level Developer",
            "Senior Developer",
            "Tech Lead/Architect"
        ],
        "skillGaps": [
            "Advanced system design",
            "Cloud platform expertise",
            "Leadership skills"
        ],
        "analysis": "Based on your profile, focus on advancing your technical skills and gaining cloud computing experience to progress in your career."
    }
    
    return Response({
        'message': 'Profile analysis completed successfully',
        'recommendations': recommendations,
        'aiServiceAvailable': False  # Set to True when AI service is integrated
    })


@api_view(['POST'])
def generate_test_questions(request):
    """Generate AI-powered test questions"""
    user = get_user_from_token(request)
    if not user:
        return Response({'message': 'Token is not valid'}, status=status.HTTP_401_UNAUTHORIZED)
    
    topic = request.data.get('topic')
    difficulty = request.data.get('difficulty', 'intermediate')
    count = request.data.get('count', 5)
    
    if not topic:
        return Response({'message': 'Topic is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # For now, return fallback questions
    # In a real implementation, you would call an AI service here
    fallback_questions = [
        {
            "question": f"What is the primary purpose of {topic}?",
            "options": {
                "A": "Option A",
                "B": "Option B",
                "C": "Option C",
                "D": "Option D"
            },
            "correctAnswer": "A",
            "explanation": "This is a fallback question generated when AI service is unavailable."
        }
    ]
    
    return Response({
        'message': 'Test questions generated (fallback mode)',
        'questions': fallback_questions,
        'aiServiceAvailable': False  # Set to True when AI service is integrated
    })


# ==================== HEALTH CHECK ====================

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({'message': 'ElevateAI Server is running!', 'status': 'healthy'})
