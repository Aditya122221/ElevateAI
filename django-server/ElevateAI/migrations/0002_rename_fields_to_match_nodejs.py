# Generated manually to rename fields to match Node.js models

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ElevateAI', '0001_initial'),
    ]

    operations = [
        # User model changes
        migrations.AddField(
            model_name='user',
            name='name',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.RenameField(
            model_name='user',
            old_name='is_profile_complete',
            new_name='isProfileComplete',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='password_reset_token',
            new_name='passwordResetToken',
        ),
        migrations.RenameField(
            model_name='user',
            old_name='password_reset_expires',
            new_name='passwordResetExpires',
        ),
        
        # BasicDetails model changes
        migrations.RenameField(
            model_name='basicdetails',
            old_name='first_name',
            new_name='firstName',
        ),
        migrations.RenameField(
            model_name='basicdetails',
            old_name='last_name',
            new_name='lastName',
        ),
        migrations.RenameField(
            model_name='basicdetails',
            old_name='profile_picture',
            new_name='profilePicture',
        ),
        migrations.AlterField(
            model_name='basicdetails',
            name='linkedin',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='basicdetails',
            name='github',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='basicdetails',
            name='portfolio',
            field=models.CharField(blank=True, default='', max_length=500),
        ),
        
        # Skills model changes
        migrations.RenameField(
            model_name='skills',
            old_name='soft_skills',
            new_name='softSkills',
        ),
        
        # Project model changes
        migrations.RenameField(
            model_name='project',
            old_name='github_link',
            new_name='githubLink',
        ),
        migrations.RenameField(
            model_name='project',
            old_name='live_url',
            new_name='liveUrl',
        ),
        migrations.RenameField(
            model_name='project',
            old_name='start_date',
            new_name='startDate',
        ),
        migrations.RenameField(
            model_name='project',
            old_name='end_date',
            new_name='endDate',
        ),
        migrations.RenameField(
            model_name='project',
            old_name='skills_used',
            new_name='skillsUsed',
        ),
        migrations.AlterField(
            model_name='project',
            name='image',
            field=models.CharField(blank=True, default='', max_length=500),
        ),
        
        # Certification model changes
        migrations.RenameField(
            model_name='certification',
            old_name='start_date',
            new_name='startDate',
        ),
        migrations.RenameField(
            model_name='certification',
            old_name='end_date',
            new_name='endDate',
        ),
        
        # Experience model changes
        migrations.RenameField(
            model_name='experience',
            old_name='company_name',
            new_name='companyName',
        ),
        migrations.RenameField(
            model_name='experience',
            old_name='start_date',
            new_name='startDate',
        ),
        migrations.RenameField(
            model_name='experience',
            old_name='end_date',
            new_name='endDate',
        ),
        migrations.RenameField(
            model_name='experience',
            old_name='is_current',
            new_name='isCurrent',
        ),
        
        # JobRoles model changes
        migrations.RenameField(
            model_name='jobroles',
            old_name='desired_job_roles',
            new_name='desiredJobRoles',
        ),
    ]
