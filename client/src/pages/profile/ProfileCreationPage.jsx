import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
    User,
    Code,
    FolderOpen,
    Award,
    Briefcase,
    Users,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Plus,
    X,
    Camera,
    SkipForward
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './ProfileCreationPage.module.css';

const ProfileCreationPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [profileProgress, setProfileProgress] = useState(null);
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue,
        getValues,
        reset
    } = useForm({
        defaultValues: {
            basicDetails: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                linkedin: '',
                github: '',
                profilePicture: '',
                twitter: '',
                website: '',
                portfolio: '',
                bio: ''
            },
            skills: {
                languages: [],
                technologies: [],
                frameworks: [],
                tools: [],
                softSkills: []
            },
            projects: [],
            certificates: [],
            experience: [],
            desiredJobRoles: []
        }
    });

    const steps = [
        { number: 1, title: 'Basic Details', icon: User, required: true },
        { number: 2, title: 'Skills', icon: Code, required: true },
        { number: 3, title: 'Projects', icon: FolderOpen, required: false },
        { number: 4, title: 'Certificates', icon: Award, required: false },
        { number: 5, title: 'Experience', icon: Briefcase, required: false },
        { number: 6, title: 'Job Roles', icon: Users, required: true }
    ];



    // Load existing profile data from separate sections
    useEffect(() => {
        const loadAllSections = async () => {
            try {
                setIsLoadingProgress(true);

                // Fetch all sections in parallel
                const [basicDetailsRes, skillsRes, projectsRes, certificatesRes, experienceRes, jobRolesRes] = await Promise.allSettled([
                    axios.get('/api/profile/basic-details'),
                    axios.get('/api/profile/skills'),
                    axios.get('/api/profile/projects'),
                    axios.get('/api/profile/certificates'),
                    axios.get('/api/profile/experience'),
                    axios.get('/api/profile/job-roles')
                ]);

                // Build form data from responses
                const formData = {
                    basicDetails: basicDetailsRes.status === 'fulfilled' && basicDetailsRes.value.data.data ? basicDetailsRes.value.data.data : {
                        firstName: '',
                        lastName: '',
                        email: user?.email || '',
                        phone: '',
                        linkedin: '',
                        github: '',
                        profilePicture: '',
                        twitter: '',
                        website: '',
                        portfolio: '',
                        bio: ''
                    },
                    skills: skillsRes.status === 'fulfilled' && skillsRes.value.data.data ? skillsRes.value.data.data : {
                        languages: [],
                        technologies: [],
                        frameworks: [],
                        tools: [],
                        softSkills: []
                    },
                    projects: projectsRes.status === 'fulfilled' && projectsRes.value.data.data ? projectsRes.value.data.data.projects || [] : [],
                    certificates: certificatesRes.status === 'fulfilled' && certificatesRes.value.data.data ? certificatesRes.value.data.data.certificates || [] : [],
                    experience: experienceRes.status === 'fulfilled' && experienceRes.value.data.data ? experienceRes.value.data.data.experiences || [] : [],
                    desiredJobRoles: jobRolesRes.status === 'fulfilled' && jobRolesRes.value.data.data ? jobRolesRes.value.data.data.desiredJobRoles || [] : []
                };

                reset(formData);

                // Determine which step to start on based on completed sections
                let startStep = 1;
                if (formData.basicDetails.firstName && formData.basicDetails.lastName && formData.basicDetails.email && formData.basicDetails.phone && formData.basicDetails.linkedin && formData.basicDetails.github) {
                    startStep = 2;
                }
                if (startStep === 2 && (formData.skills.languages.length > 0 || formData.skills.technologies.length > 0 || formData.skills.frameworks.length > 0 || formData.skills.tools.length > 0 || formData.skills.softSkills.length > 0)) {
                    startStep = 3;
                }
                if (startStep === 3 && formData.projects.length > 0) {
                    startStep = 4;
                }
                if (startStep === 4 && formData.certificates.length > 0) {
                    startStep = 5;
                }
                if (startStep === 5 && formData.experience.length > 0) {
                    startStep = 6;
                }
                if (startStep === 6 && formData.desiredJobRoles.length > 0) {
                    startStep = 6; // All completed
                }

                setCurrentStep(startStep);

            } catch (error) {
                toast.error('Failed to load profile data');
                setCurrentStep(1);
            } finally {
                setIsLoadingProgress(false);
            }
        };

        if (user) {
            loadAllSections();
        }
    }, [user, reset]);


    // Watch form values to trigger re-validation
    watch();

    // Image upload handler
    const handleImageUpload = async (file, type) => {
        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append(type, file);

            const response = await axios.post(`/api/profile/upload-${type}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data.imageUrl;
        } catch (error) {
            toast.error('Failed to upload image');
            throw error;
        } finally {
            setUploadingImage(false);
        }
    };

    // Skill management functions
    const addSkill = (category, skillName) => {
        const currentSkills = getValues(`skills.${category}`) || [];
        if (skillName.trim() && !currentSkills.includes(skillName.trim())) {
            setValue(`skills.${category}`, [...currentSkills, skillName.trim()]);
        }
    };

    const removeSkill = (category, index) => {
        const currentSkills = getValues(`skills.${category}`) || [];
        setValue(`skills.${category}`, currentSkills.filter((_, i) => i !== index));
    };

    // Project management functions
    const addProject = () => {
        const currentProjects = getValues('projects') || [];
        setValue('projects', [...currentProjects, {
            name: '',
            details: [''],
            githubLink: '',
            liveUrl: '',
            startDate: '',
            endDate: '',
            skillsUsed: [],
            image: ''
        }]);
    };

    const addProjectDetail = (projectIndex) => {
        const currentProjects = getValues('projects') || [];
        const updatedProjects = [...currentProjects];
        updatedProjects[projectIndex].details.push('');
        setValue('projects', updatedProjects);
    };

    const removeProjectDetail = (projectIndex, detailIndex) => {
        const currentProjects = getValues('projects') || [];
        const updatedProjects = [...currentProjects];
        updatedProjects[projectIndex].details = updatedProjects[projectIndex].details.filter((_, i) => i !== detailIndex);
        setValue('projects', updatedProjects);
    };

    const updateProjectDetail = (projectIndex, detailIndex, value) => {
        const currentProjects = getValues('projects') || [];
        const updatedProjects = [...currentProjects];
        updatedProjects[projectIndex].details[detailIndex] = value;
        setValue('projects', updatedProjects);
    };

    const addProjectSkill = (projectIndex, skillName) => {
        const currentProjects = getValues('projects') || [];
        const updatedProjects = [...currentProjects];
        const currentSkills = updatedProjects[projectIndex].skillsUsed || [];
        if (skillName.trim() && !currentSkills.includes(skillName.trim())) {
            updatedProjects[projectIndex].skillsUsed = [...currentSkills, skillName.trim()];
            setValue('projects', updatedProjects);
        }
    };

    const removeProjectSkill = (projectIndex, skillIndex) => {
        const currentProjects = getValues('projects') || [];
        const updatedProjects = [...currentProjects];
        updatedProjects[projectIndex].skillsUsed = updatedProjects[projectIndex].skillsUsed.filter((_, i) => i !== skillIndex);
        setValue('projects', updatedProjects);
    };

    const removeProject = (index) => {
        const currentProjects = getValues('projects') || [];
        setValue('projects', currentProjects.filter((_, i) => i !== index));
    };



    // Certificate management functions
    const addCertificate = () => {
        const currentCertificates = getValues('certificates') || [];
        setValue('certificates', [...currentCertificates, {
            name: '',
            platform: '',
            skills: [],
            startDate: '',
            endDate: '',
            credentialId: '',
            verificationUrl: '',
            certificateUrl: ''
        }]);
    };

    const removeCertificate = (index) => {
        const currentCertificates = getValues('certificates') || [];
        setValue('certificates', currentCertificates.filter((_, i) => i !== index));
    };

    // Experience management functions
    const addExperience = () => {
        const currentExperience = getValues('experience') || [];
        setValue('experience', [...currentExperience, {
            companyName: '',
            position: '',
            startDate: '',
            endDate: '',
            current: false,
            skills: [],
            achievements: [''],
            description: ''
        }]);
    };

    const removeExperience = (index) => {
        const currentExperience = getValues('experience') || [];
        setValue('experience', currentExperience.filter((_, i) => i !== index));
    };

    const updateExperienceAchievement = (expIndex, achievementIndex, value) => {
        const currentExperience = getValues('experience') || [];
        const updatedExperience = [...currentExperience];
        updatedExperience[expIndex].achievements[achievementIndex] = value;
        setValue('experience', updatedExperience);
    };

    const addExperienceAchievement = (expIndex) => {
        const currentExperience = getValues('experience') || [];
        const updatedExperience = [...currentExperience];
        updatedExperience[expIndex].achievements.push('');
        setValue('experience', updatedExperience);
    };

    const removeExperienceAchievement = (expIndex, achievementIndex) => {
        const currentExperience = getValues('experience') || [];
        const updatedExperience = [...currentExperience];
        updatedExperience[expIndex].achievements = updatedExperience[expIndex].achievements.filter((_, i) => i !== achievementIndex);
        setValue('experience', updatedExperience);
    };

    // Job role management
    // Job roles management functions
    const addJobRole = (roleName) => {
        const currentRoles = getValues('desiredJobRoles') || [];
        if (roleName.trim() && !currentRoles.includes(roleName.trim())) {
            setValue('desiredJobRoles', [...currentRoles, roleName.trim()]);
        }
    };

    const removeJobRole = (index) => {
        const currentRoles = getValues('desiredJobRoles') || [];
        setValue('desiredJobRoles', currentRoles.filter((_, i) => i !== index));
    };

    // Save current section data
    const saveCurrentSection = async (step) => {
        try {
            setIsSaving(true);
            const formData = getValues();

            let endpoint = '';
            let dataToSave = {};

            switch (step) {
                case 1: // Basic Details
                    endpoint = '/api/profile/basic-details';
                    dataToSave = formData.basicDetails;
                    break;
                case 2: // Skills
                    endpoint = '/api/profile/skills';
                    dataToSave = formData.skills;
                    break;
                case 3: // Projects
                    endpoint = '/api/profile/projects';
                    dataToSave = { projects: formData.projects };
                    break;
                case 4: // Certificates
                    endpoint = '/api/profile/certificates';
                    dataToSave = { certificates: formData.certificates };
                    break;
                case 5: // Experience
                    endpoint = '/api/profile/experience';
                    dataToSave = { experiences: formData.experience };
                    break;
                case 6: // Job Roles
                    endpoint = '/api/profile/job-roles';
                    dataToSave = { desiredJobRoles: formData.desiredJobRoles };
                    break;
                default:
                    throw new Error('Invalid step number');
            }

            await axios.post(endpoint, dataToSave);
            toast.success(`Step ${step} saved successfully!`);
        } catch (error) {
            console.error(`Failed to save step ${step}:`, error);
            toast.error(`Failed to save step ${step}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Fetch current section data
    const fetchCurrentSection = async (step) => {
        try {
            let endpoint = '';

            switch (step) {
                case 1: // Basic Details
                    endpoint = '/api/profile/basic-details';
                    break;
                case 2: // Skills
                    endpoint = '/api/profile/skills';
                    break;
                case 3: // Projects
                    endpoint = '/api/profile/projects';
                    break;
                case 4: // Certificates
                    endpoint = '/api/profile/certificates';
                    break;
                case 5: // Experience
                    endpoint = '/api/profile/experience';
                    break;
                case 6: // Job Roles
                    endpoint = '/api/profile/job-roles';
                    break;
                default:
                    throw new Error('Invalid step number');
            }

            const response = await axios.get(endpoint);

            if (response.data.data) {
                const sectionData = response.data.data;

                switch (step) {
                    case 1: // Basic Details
                        setValue('basicDetails', sectionData);
                        break;
                    case 2: // Skills
                        setValue('skills', sectionData);
                        break;
                    case 3: // Projects
                        setValue('projects', sectionData.projects || []);
                        break;
                    case 4: // Certificates
                        setValue('certificates', sectionData.certificates || []);
                        break;
                    case 5: // Experience
                        setValue('experience', sectionData.experiences || []);
                        break;
                    case 6: // Job Roles
                        setValue('desiredJobRoles', sectionData.desiredJobRoles || []);
                        break;
                }
            }
        } catch (error) {
            // Don't show error toast for fetch - it's normal if no data exists yet
        }
    };

    const nextStep = async () => {
        if (currentStep < steps.length) {
            // Save current section before moving to next step
            await saveCurrentSection(currentStep);
            setCurrentStep(currentStep + 1);
            // Fetch next section data
            await fetchCurrentSection(currentStep + 1);
        }
    };

    const prevStep = async () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            // Fetch previous section data
            await fetchCurrentSection(currentStep - 1);
        }
    };

    const skipStep = async () => {
        if (currentStep < steps.length) {
            // Save current section before skipping
            await saveCurrentSection(currentStep);
            setCurrentStep(currentStep + 1);
            // Fetch next section data
            await fetchCurrentSection(currentStep + 1);
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // First, save the current step data before completing the profile
            await saveCurrentSection(currentStep);

            // Then use the completion endpoint that combines all sections
            await axios.post('/api/profile/complete');

            // Refresh user data from server
            const userResponse = await axios.get('/api/auth/me');
            updateUser(userResponse.data.user);

            toast.success('Profile completed successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Profile completion error:', error);

            // Show more specific error message if available
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to complete profile. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const canProceed = () => {
        try {
            switch (currentStep) {
                case 1:
                    const basicDetails = getValues('basicDetails') || {};
                    return Boolean(
                        basicDetails.firstName?.trim() &&
                        basicDetails.lastName?.trim() &&
                        basicDetails.email?.trim() &&
                        basicDetails.phone?.trim() &&
                        basicDetails.linkedin?.trim() &&
                        basicDetails.github?.trim()
                    );
                case 2:
                    const skills = getValues('skills') || {};
                    return Boolean(
                        Object.values(skills).some(skillArray =>
                            Array.isArray(skillArray) && skillArray.length > 0
                        )
                    );
                case 3:
                    // Projects validation - if projects exist, they must have required fields
                    const projects = getValues('projects') || [];
                    if (projects.length === 0) return true; // No projects is allowed

                    return projects.every(project => {
                        // Required fields: name, startDate, at least one detail point
                        const hasName = project.name?.trim();
                        const hasStartDate = project.startDate?.trim();
                        const hasDetails = project.details?.some(detail => detail?.trim());

                        return hasName && hasStartDate && hasDetails;
                    });
                case 6:
                    const jobRoles = getValues('desiredJobRoles') || [];
                    return Boolean(Array.isArray(jobRoles) && jobRoles.length > 0);
                default:
                    return true; // Optional steps
            }
        } catch (error) {
            return false;
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.stepContent}
                    >
                        <div className={styles.sectionHeader}>
                            <h3>Basic Information</h3>
                            <p>Tell us about yourself - this information is required</p>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>First Name *</label>
                                <input
                                    {...register('basicDetails.firstName', { required: 'First name is required' })}
                                    type="text"
                                    className={`${styles.formInput} ${errors.basicDetails?.firstName ? styles.error : ''}`}
                                    placeholder="Enter your first name"
                                />
                                {errors.basicDetails?.firstName && (
                                    <p className={styles.errorText}>{errors.basicDetails.firstName.message}</p>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Last Name *</label>
                                <input
                                    {...register('basicDetails.lastName', { required: 'Last name is required' })}
                                    type="text"
                                    className={`${styles.formInput} ${errors.basicDetails?.lastName ? styles.error : ''}`}
                                    placeholder="Enter your last name"
                                />
                                {errors.basicDetails?.lastName && (
                                    <p className={styles.errorText}>{errors.basicDetails.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Email *</label>
                            <input
                                {...register('basicDetails.email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                })}
                                type="email"
                                className={`${styles.formInput} ${errors.basicDetails?.email ? styles.error : ''}`}
                                placeholder="Enter your email"
                            />
                            {errors.basicDetails?.email && (
                                <p className={styles.errorText}>{errors.basicDetails.email.message}</p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Phone Number *</label>
                            <input
                                {...register('basicDetails.phone', { required: 'Phone number is required' })}
                                type="tel"
                                className={`${styles.formInput} ${errors.basicDetails?.phone ? styles.error : ''}`}
                                placeholder="Enter your phone number"
                            />
                            {errors.basicDetails?.phone && (
                                <p className={styles.errorText}>{errors.basicDetails.phone.message}</p>
                            )}
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>LinkedIn Profile *</label>
                                <input
                                    {...register('basicDetails.linkedin', { required: 'LinkedIn profile is required' })}
                                    type="url"
                                    className={`${styles.formInput} ${errors.basicDetails?.linkedin ? styles.error : ''}`}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                />
                                {errors.basicDetails?.linkedin && (
                                    <p className={styles.errorText}>{errors.basicDetails.linkedin.message}</p>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>GitHub Profile *</label>
                                <input
                                    {...register('basicDetails.github', { required: 'GitHub profile is required' })}
                                    type="url"
                                    className={`${styles.formInput} ${errors.basicDetails?.github ? styles.error : ''}`}
                                    placeholder="https://github.com/yourusername"
                                />
                                {errors.basicDetails?.github && (
                                    <p className={styles.errorText}>{errors.basicDetails.github.message}</p>
                                )}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Profile Picture</label>
                            <div className={styles.imageUploadContainer}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        if (e.target.files[0]) {
                                            try {
                                                const imageUrl = await handleImageUpload(e.target.files[0], 'profilePicture');
                                                setValue('basicDetails.profilePicture', imageUrl);
                                            } catch (error) {
                                                toast.error('Failed to upload image');
                                            }
                                        }
                                    }}
                                    className={styles.fileInput}
                                />
                                <div className={styles.uploadButton}>
                                    <Camera size={20} />
                                    <span>Upload Photo</span>
                                </div>
                                {watch('basicDetails.profilePicture') && (
                                    <div className={styles.imagePreview}>
                                        <img src={watch('basicDetails.profilePicture')} alt="Profile preview" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Twitter</label>
                                <input
                                    {...register('basicDetails.twitter')}
                                    type="url"
                                    className={styles.formInput}
                                    placeholder="https://twitter.com/yourusername"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Website</label>
                                <input
                                    {...register('basicDetails.website')}
                                    type="url"
                                    className={styles.formInput}
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Portfolio</label>
                            <input
                                {...register('basicDetails.portfolio')}
                                type="url"
                                className={styles.formInput}
                                placeholder="https://yourportfolio.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Bio</label>
                            <textarea
                                {...register('basicDetails.bio')}
                                className={styles.formTextarea}
                                placeholder="Tell us about yourself..."
                                rows={4}
                            />
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.stepContent}
                    >
                        <div className={styles.sectionHeader}>
                            <h3>Skills & Expertise</h3>
                            <p>Add your technical and soft skills - at least one skill is required</p>
                        </div>

                        {['languages', 'technologies', 'frameworks', 'tools', 'softSkills'].map(category => (
                            <div key={category} className={styles.skillCategory}>
                                <h4 className={styles.categoryTitle}>
                                    {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
                                </h4>

                                <div className={styles.skillInputContainer}>
                                    <input
                                        type="text"
                                        placeholder={`Add ${category.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkill(category, e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        className={styles.skillInput}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            const input = e.target.previousElementSibling;
                                            addSkill(category, input.value);
                                            input.value = '';
                                        }}
                                        className={styles.addSkillButton}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className={styles.skillsList}>
                                    {(getValues(`skills.${category}`) || []).map((skill, index) => (
                                        <div key={index} className={styles.skillItem}>
                                            <span className={styles.skillName}>{skill}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(category, index)}
                                                className={styles.removeSkillButton}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.stepContent}
                    >
                        <div className={styles.sectionHeader}>
                            <h3>Projects</h3>
                            <p>Add your projects and work - this section is optional</p>
                        </div>

                        <div className={styles.projectsContainer}>
                            {(getValues('projects') || []).map((project, index) => (
                                <div key={index} className={styles.projectCard}>
                                    <div className={styles.projectHeader}>
                                        <h4>Project {index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeProject(index)}
                                            className={styles.removeButton}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Project Name *</label>
                                            <input
                                                {...register(`projects.${index}.name`)}
                                                className={styles.formInput}
                                                placeholder="Enter project name"
                                                required
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>GitHub Link</label>
                                            <input
                                                {...register(`projects.${index}.githubLink`)}
                                                className={styles.formInput}
                                                placeholder="https://github.com/username/project"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Live URL</label>
                                            <input
                                                {...register(`projects.${index}.liveUrl`)}
                                                className={styles.formInput}
                                                placeholder="https://your-project.com"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Start Date *</label>
                                            <input
                                                {...register(`projects.${index}.startDate`)}
                                                type="date"
                                                className={styles.formInput}
                                                required
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>End Date</label>
                                            <input
                                                {...register(`projects.${index}.endDate`)}
                                                type="date"
                                                className={styles.formInput}
                                            />
                                        </div>
                                    </div>


                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Project Details (Points) *</label>
                                        <div className={styles.detailsContainer}>
                                            {(getValues(`projects.${index}.details`) || ['']).map((detail, detailIndex) => (
                                                <div key={detailIndex} className={styles.detailItem}>
                                                    <input
                                                        type="text"
                                                        value={detail}
                                                        onChange={(e) => updateProjectDetail(index, detailIndex, e.target.value)}
                                                        className={styles.detailInput}
                                                        placeholder="Enter project detail point..."
                                                        required={detailIndex === 0}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProjectDetail(index, detailIndex)}
                                                        className={styles.removeDetailButton}
                                                        disabled={(getValues(`projects.${index}.details`) || []).length === 1}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addProjectDetail(index)}
                                                className={styles.addDetailButton}
                                            >
                                                <Plus size={16} />
                                                Add Detail Point
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Skills Used</label>
                                        <div className={styles.skillInputContainer}>
                                            <input
                                                type="text"
                                                placeholder="Add skill used in this project"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addProjectSkill(index, e.target.value);
                                                        e.target.value = '';
                                                    }
                                                }}
                                                className={styles.skillInput}
                                            />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    const input = e.target.previousElementSibling;
                                                    addProjectSkill(index, input.value);
                                                    input.value = '';
                                                }}
                                                className={styles.addSkillButton}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <div className={styles.skillsList}>
                                            {(getValues(`projects.${index}.skillsUsed`) || []).map((skill, skillIndex) => (
                                                <div key={skillIndex} className={styles.skillItem}>
                                                    <span className={styles.skillName}>{skill}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeProjectSkill(index, skillIndex)}
                                                        className={styles.removeSkillButton}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addProject}
                                className={styles.addButton}
                            >
                                <Plus size={16} />
                                Add Project
                            </button>
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.stepContent}
                    >
                        <div className={styles.sectionHeader}>
                            <h3>Certificates</h3>
                            <p>Add your certifications and achievements - this section is optional</p>
                        </div>

                        <div className={styles.certificatesContainer}>
                            {(getValues('certificates') || []).map((certificate, index) => (
                                <div key={index} className={styles.certificateCard}>
                                    <div className={styles.certificateHeader}>
                                        <h4>Certificate {index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeCertificate(index)}
                                            className={styles.removeButton}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Certificate Name *</label>
                                            <input
                                                {...register(`certificates.${index}.name`)}
                                                className={styles.formInput}
                                                placeholder="Enter certificate name"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Platform/Issuer *</label>
                                            <input
                                                {...register(`certificates.${index}.platform`)}
                                                className={styles.formInput}
                                                placeholder="e.g., Coursera, Google, Microsoft"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Start Date</label>
                                            <input
                                                {...register(`certificates.${index}.startDate`)}
                                                type="date"
                                                className={styles.formInput}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>End Date</label>
                                            <input
                                                {...register(`certificates.${index}.endDate`)}
                                                type="date"
                                                className={styles.formInput}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Credential ID</label>
                                            <input
                                                {...register(`certificates.${index}.credentialId`)}
                                                className={styles.formInput}
                                                placeholder="Certificate ID or verification code"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Verification URL</label>
                                            <input
                                                {...register(`certificates.${index}.verificationUrl`)}
                                                className={styles.formInput}
                                                placeholder="https://verify.certificate.com/..."
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Skills Covered</label>
                                        <input
                                            {...register(`certificates.${index}.skills`)}
                                            className={styles.formInput}
                                            placeholder="JavaScript, React, AWS (comma separated)"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addCertificate}
                                className={styles.addButton}
                            >
                                <Plus size={16} />
                                Add Certificate
                            </button>
                        </div>
                    </motion.div>
                );

            case 5:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.stepContent}
                    >
                        <div className={styles.sectionHeader}>
                            <h3>Work Experience</h3>
                            <p>Add your professional experience - this section is optional</p>
                        </div>

                        <div className={styles.experienceContainer}>
                            {(getValues('experience') || []).map((exp, index) => (
                                <div key={index} className={styles.experienceCard}>
                                    <div className={styles.experienceHeader}>
                                        <h4>Experience {index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            className={styles.removeButton}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className={styles.formGrid}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Company Name *</label>
                                            <input
                                                {...register(`experience.${index}.companyName`)}
                                                className={styles.formInput}
                                                placeholder="Enter company name"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Position *</label>
                                            <input
                                                {...register(`experience.${index}.position`)}
                                                className={styles.formInput}
                                                placeholder="Enter your position"
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Start Date *</label>
                                            <input
                                                {...register(`experience.${index}.startDate`)}
                                                type="date"
                                                className={styles.formInput}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>End Date</label>
                                            <input
                                                {...register(`experience.${index}.endDate`)}
                                                type="date"
                                                className={styles.formInput}
                                            />
                                        </div>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>
                                            <input
                                                {...register(`experience.${index}.isCurrent`)}
                                                type="checkbox"
                                                className={styles.checkbox}
                                            />
                                            Currently working here
                                        </label>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Job Description</label>
                                        <textarea
                                            {...register(`experience.${index}.description`)}
                                            className={styles.formTextarea}
                                            placeholder="Describe your role and responsibilities..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Key Achievements</label>
                                        <textarea
                                            {...register(`experience.${index}.achievements`)}
                                            className={styles.formTextarea}
                                            placeholder="List your key achievements (one per line)..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Skills Used</label>
                                        <input
                                            {...register(`experience.${index}.skills`)}
                                            className={styles.formInput}
                                            placeholder="React, Node.js, AWS (comma separated)"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addExperience}
                                className={styles.addButton}
                            >
                                <Plus size={16} />
                                Add Experience
                            </button>
                        </div>
                    </motion.div>
                );

            case 6:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.stepContent}
                    >
                        <div className={styles.sectionHeader}>
                            <h3>Desired Job Roles</h3>
                            <p>Add the job roles you're interested in - at least one is required</p>
                        </div>

                        <div className={styles.jobRolesContainer}>
                            <div className={styles.skillInputContainer}>
                                <input
                                    type="text"
                                    placeholder="Add desired job role"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addJobRole(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    className={styles.skillInput}
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        const input = e.target.previousElementSibling;
                                        addJobRole(input.value);
                                        input.value = '';
                                    }}
                                    className={styles.addSkillButton}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div className={styles.skillsList}>
                                {(getValues('desiredJobRoles') || []).map((role, index) => (
                                    <div key={index} className={styles.skillItem}>
                                        <span className={styles.skillName}>{role}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeJobRole(index)}
                                            className={styles.removeSkillButton}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {errors.desiredJobRoles && (
                            <p className={styles.errorText}>At least one job role is required</p>
                        )}
                    </motion.div>
                );

            default:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={styles.stepContent}
                    >
                        <div className={styles.sectionHeader}>
                            <h3>{steps[currentStep - 1]?.title}</h3>
                            <p>This section is optional - you can skip it if you don't have any {steps[currentStep - 1]?.title.toLowerCase()} to add.</p>
                        </div>
                        <div className={styles.placeholderContent}>
                            <p>Content for {steps[currentStep - 1]?.title} will be implemented in the next update.</p>
                        </div>
                    </motion.div>
                );
        }
    };

    // Show loading spinner while loading profile progress
    if (isLoadingProgress) {
        return (
            <div className={styles.profileCreationPage}>
                <div className={styles.profileContainer}>
                    <div className={styles.loadingContainer}>
                        <LoadingSpinner size="lg" />
                        <p>Loading your profile progress...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profileCreationPage}>
            <div className={styles.profileContainer}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className={styles.profileHeader}>
                        <h1 className={styles.profileTitle}>
                            Complete Your Profile
                        </h1>
                        <p className={styles.profileSubtitle}>
                            Help us personalize your experience and provide better recommendations
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className={styles.progressContainer}>
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.number;

                            // Map step titles to completion status keys
                            const stepKeyMap = {
                                'Basic Details': 'basicDetails',
                                'Skills': 'skills',
                                'Projects': 'projects',
                                'Certificates': 'certificates',
                                'Experience': 'experience',
                                'Job Roles': 'jobRoles'
                            };

                            const stepKey = stepKeyMap[step.title];
                            const isCompleted = profileProgress?.completionStatus?.[stepKey] || currentStep > step.number;

                            return (
                                <div key={step.number} className={styles.progressStep}>
                                    <div className={styles.stepIconContainer}>
                                        <div
                                            className={`${styles.stepIcon} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''}`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle size={20} />
                                            ) : (
                                                <Icon size={20} />
                                            )}
                                        </div>
                                        <span className={`${styles.stepLabel} ${isActive ? styles.active : ''}`}>
                                            {step.title}
                                        </span>
                                        {step.required && <span className={styles.requiredBadge}>Required</span>}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`${styles.progressLine} ${isCompleted ? styles.completed : ''}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Summary */}
                    {profileProgress && (
                        <div className={styles.progressSummary}>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${profileProgress.completionPercentage}%` }}
                                />
                            </div>
                            <p className={styles.progressText}>
                                Profile {profileProgress.completionPercentage}% Complete
                                {profileProgress.lastCompletedStep > 0 && (
                                    <span> • Last completed: Step {profileProgress.lastCompletedStep}</span>
                                )}
                                {isSaving && <span> • Saving...</span>}
                            </p>
                        </div>
                    )}


                    {/* Form */}
                    <div className={styles.profileCard}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {renderStepContent()}


                            {/* Navigation Buttons */}
                            <div className={styles.navigationButtons}>
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`${styles.navButton} ${styles.prevButton}`}
                                >
                                    <ArrowLeft size={16} />
                                    Previous
                                </button>

                                <div className={styles.rightButtons}>
                                    {!steps[currentStep - 1].required && currentStep < steps.length && (
                                        <button
                                            type="button"
                                            onClick={skipStep}
                                            className={`${styles.navButton} ${styles.skipButton}`}
                                        >
                                            <SkipForward size={16} />
                                            Skip
                                        </button>
                                    )}

                                    {currentStep < steps.length ? (
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            disabled={!canProceed()}
                                            className={`${styles.navButton} ${styles.nextButton} ${!canProceed() ? styles.disabled : ''}`}
                                        >
                                            Next
                                            <ArrowRight size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            disabled={isLoading || !canProceed()}
                                            className={`${styles.navButton} ${styles.submitButton} ${isLoading ? styles.loading : ''}`}
                                        >
                                            {isLoading ? (
                                                <LoadingSpinner size="sm" />
                                            ) : (
                                                <>
                                                    Complete Profile
                                                    <CheckCircle size={16} />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileCreationPage;
