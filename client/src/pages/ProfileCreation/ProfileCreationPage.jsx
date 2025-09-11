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

// Import step components
import BasicDetailsStep from './components/BasicDetailsStep';
import SkillsStep from './components/SkillsStep';
import ProjectsStep from './components/ProjectsStep';
import CertificationsStep from './components/CertificationsStep';
import ExperienceStep from './components/ExperienceStep';
import JobRolesStep from './components/JobRolesStep';

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
            certifications: [],
            experience: [],
            desiredJobRoles: []
        }
    });

    const steps = [
        { number: 1, title: 'Basic Details', icon: User, required: true },
        { number: 2, title: 'Skills', icon: Code, required: true },
        { number: 3, title: 'Projects', icon: FolderOpen, required: false },
        { number: 4, title: 'Certifications', icon: Award, required: false },
        { number: 5, title: 'Experience', icon: Briefcase, required: false },
        { number: 6, title: 'Job Roles', icon: Users, required: true }
    ];



    // Load existing profile data from separate sections
    useEffect(() => {
        const loadAllSections = async () => {
            try {
                // Only load if user is authenticated
                if (!user) {
                    console.log('No user found, skipping profile data load');
                    setIsLoadingProgress(false);
                    return;
                }

                console.log('Loading profile data for user:', user);
                setIsLoadingProgress(true);

                // Fetch all sections in parallel
                const [basicDetailsRes, skillsRes, projectsRes, certificationsRes, experienceRes, jobRolesRes] = await Promise.allSettled([
                    axios.get('/api/profile/basic-details'),
                    axios.get('/api/profile/skills'),
                    axios.get('/api/profile/projects'),
                    axios.get('/api/profile/certifications'),
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
                    projects: projectsRes.status === 'fulfilled' && projectsRes.value.data.data ?
                        (projectsRes.value.data.data.projects || []).map(project => ({
                            ...project,
                            startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                            endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''
                        })) : [],
                    certifications: certificationsRes.status === 'fulfilled' && certificationsRes.value.data.data ?
                        (certificationsRes.value.data.data.certifications || []).map(cert => ({
                            ...cert,
                            startDate: cert.startDate ? new Date(cert.startDate).toISOString().split('T')[0] : '',
                            endDate: cert.endDate ? new Date(cert.endDate).toISOString().split('T')[0] : ''
                        })) : [],
                    experience: experienceRes.status === 'fulfilled' && experienceRes.value.data.data ?
                        (experienceRes.value.data.data.experiences || []).map(exp => ({
                            ...exp,
                            startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''
                        })) : [],
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
                if (startStep === 4 && formData.certifications.length > 0) {
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
                case 4: // Certifications
                    endpoint = '/api/profile/certifications';
                    dataToSave = { certifications: formData.certifications };
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
                case 4: // Certifications
                    endpoint = '/api/profile/certifications';
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
                        const projects = sectionData.projects || [];
                        // Format dates for projects
                        const formattedProjects = projects.map(project => ({
                            ...project,
                            startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                            endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ''
                        }));
                        setValue('projects', formattedProjects);
                        break;
                    case 4: // Certifications
                        const certifications = sectionData.certifications || [];
                        // Format dates for certifications
                        const formattedCertifications = certifications.map(cert => ({
                            ...cert,
                            startDate: cert.startDate ? new Date(cert.startDate).toISOString().split('T')[0] : '',
                            endDate: cert.endDate ? new Date(cert.endDate).toISOString().split('T')[0] : ''
                        }));
                        setValue('certifications', formattedCertifications);
                        break;
                    case 5: // Experience
                        const experiences = sectionData.experiences || [];
                        // Format dates for experience
                        const formattedExperiences = experiences.map(exp => ({
                            ...exp,
                            startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                            endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''
                        }));
                        setValue('experience', formattedExperiences);
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

    // Check if a specific section is completed
    const isSectionCompleted = (stepNumber) => {
        try {
            switch (stepNumber) {
                case 1: // Basic Details
                    const basicDetails = getValues('basicDetails') || {};
                    return Boolean(
                        basicDetails.firstName?.trim() &&
                        basicDetails.lastName?.trim() &&
                        basicDetails.email?.trim() &&
                        basicDetails.phone?.trim() &&
                        basicDetails.linkedin?.trim() &&
                        basicDetails.github?.trim()
                    );
                case 2: // Skills
                    const skills = getValues('skills') || {};
                    return Boolean(
                        Object.values(skills).some(skillArray =>
                            Array.isArray(skillArray) && skillArray.length > 0
                        )
                    );
                case 3: // Projects - optional, always considered completed
                    return true;
                case 4: // Certifications - optional, always considered completed
                    return true;
                case 5: // Experience - optional, always considered completed
                    return true;
                case 6: // Job Roles
                    const jobRoles = getValues('desiredJobRoles') || [];
                    return Boolean(Array.isArray(jobRoles) && jobRoles.length > 0);
                default:
                    return true;
            }
        } catch (error) {
            return false;
        }
    };

    // Check if all required sections are completed
    const areAllRequiredSectionsCompleted = () => {
        const requiredSteps = steps.filter(step => step.required);
        return requiredSteps.every(step => isSectionCompleted(step.number));
    };

    const canProceed = () => {
        try {
            // For the current step, check if it's valid
            switch (currentStep) {
                case 1:
                    return isSectionCompleted(1);
                case 2:
                    return isSectionCompleted(2);
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
                case 4:
                    // Certifications validation - if certifications exist, they must have required fields
                    const certifications = getValues('certifications') || [];
                    if (certifications.length === 0) return true; // No certifications is allowed

                    return certifications.every(cert => {
                        const hasName = cert.name?.trim();
                        const hasPlatform = cert.platform?.trim();
                        const hasStartDate = cert.startDate?.trim();

                        return hasName && hasPlatform && hasStartDate;
                    });
                case 5:
                    // Experience validation - if experience exists, they must have required fields
                    const experience = getValues('experience') || [];
                    if (experience.length === 0) return true; // No experience is allowed

                    return experience.every(exp => {
                        const hasPosition = exp.position?.trim();
                        const hasCompanyName = exp.companyName?.trim();
                        const hasStartDate = exp.startDate?.trim();

                        return hasPosition && hasCompanyName && hasStartDate;
                    });
                case 6:
                    return isSectionCompleted(6);
                default:
                    return true;
            }
        } catch (error) {
            return false;
        }
    };

    const renderStepContent = () => {
        const commonProps = {
            register,
            errors,
            watch,
            setValue,
            getValues,
            handleImageUpload
        };

        switch (currentStep) {
            case 1:
                return <BasicDetailsStep {...commonProps} />;
            case 2:
                return <SkillsStep {...commonProps} />;
            case 3:
                return <ProjectsStep {...commonProps} />;
            case 4:
                return <CertificationsStep {...commonProps} />;
            case 5:
                return <ExperienceStep {...commonProps} />;
            case 6:
                return <JobRolesStep {...commonProps} />;
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
                                'Certifications': 'certifications',
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


                    {/* Required Sections Status */}
                    {!areAllRequiredSectionsCompleted() && (
                        <div className={styles.requiredSectionsStatus}>
                            <h4>Required Sections Status:</h4>
                            <div className={styles.sectionStatusList}>
                                {steps.filter(step => step.required).map(step => (
                                    <div key={step.number} className={styles.sectionStatusItem}>
                                        <span className={`${styles.sectionStatusIcon} ${isSectionCompleted(step.number) ? styles.completed : styles.incomplete}`}>
                                            {isSectionCompleted(step.number) ? <CheckCircle size={16} /> : '○'}
                                        </span>
                                        <span className={styles.sectionStatusText}>
                                            {step.title} {isSectionCompleted(step.number) ? '✓' : '✗'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className={styles.completionNote}>
                                Complete all required sections to finish your profile.
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
                                            disabled={isLoading || !canProceed() || !areAllRequiredSectionsCompleted()}
                                            className={`${styles.navButton} ${styles.submitButton} ${isLoading ? styles.loading : ''} ${!areAllRequiredSectionsCompleted() ? styles.disabled : ''}`}
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
