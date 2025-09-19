import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Code,
    FolderOpen,
    Award,
    Briefcase,
    Users,
    Settings,
    Save,
    Edit,
    Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './CSS/ProfilePage.module.css';

// Import section components
import BasicDetailsSection from './Components/BasicDetailsSection';
import SkillsSection from './Components/SkillsSection';
import ProjectsSection from './Components/ProjectsSection';
import CertificationsSection from './Components/CertificationsSection';
import ExperienceSection from './Components/ExperienceSection';
import JobRolesSection from './Components/JobRolesSection';

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('basic-details');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        basicDetails: null,
        skills: null,
        projects: null,
        certifications: null,
        experience: null,
        jobRoles: null
    });
    const { user } = useAuth();

    const sections = [
        { id: 'basic-details', title: 'Basic Details', icon: User, required: true },
        { id: 'skills', title: 'Skills', icon: Code, required: true },
        { id: 'projects', title: 'Projects', icon: FolderOpen, required: false },
        { id: 'certifications', title: 'Certifications', icon: Award, required: false },
        { id: 'experience', title: 'Experience', icon: Briefcase, required: false },
        { id: 'job-roles', title: 'Job Roles', icon: Users, required: true }
    ];

    // Load all profile data
    useEffect(() => {
        const loadProfileData = async () => {
            if (!user) return;

            setIsLoading(true);
            try {
                const [basicDetailsRes, skillsRes, projectsRes, certificationsRes, experienceRes, jobRolesRes] = await Promise.allSettled([
                    axios.get('/api/profile/basic-details'),
                    axios.get('/api/profile/skills'),
                    axios.get('/api/profile/projects'),
                    axios.get('/api/profile/certifications'),
                    axios.get('/api/profile/experience'),
                    axios.get('/api/profile/job-roles')
                ]);

                setProfileData({
                    basicDetails: basicDetailsRes.status === 'fulfilled' ? basicDetailsRes.value.data.data : null,
                    skills: skillsRes.status === 'fulfilled' ? skillsRes.value.data.data : null,
                    projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data.data : null,
                    certifications: certificationsRes.status === 'fulfilled' ? certificationsRes.value.data.data : null,
                    experience: experienceRes.status === 'fulfilled' ? experienceRes.value.data.data : null,
                    jobRoles: jobRolesRes.status === 'fulfilled' ? jobRolesRes.value.data.data : null
                });
            } catch (error) {
                console.error('Error loading profile data:', error);
                toast.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };

        loadProfileData();
    }, [user]);

    const handleSectionChange = (sectionId) => {
        setActiveSection(sectionId);
        setIsEditing(false);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleDataUpdate = (sectionId, newData) => {
        setProfileData(prev => ({
            ...prev,
            [sectionId]: newData
        }));
    };

    const renderActiveSection = () => {
        const commonProps = {
            data: profileData[activeSection.replace('-', '')],
            isEditing,
            onDataUpdate: (newData) => handleDataUpdate(activeSection.replace('-', ''), newData),
            onEditToggle: handleEditToggle
        };

        switch (activeSection) {
            case 'basic-details':
                return <BasicDetailsSection {...commonProps} />;
            case 'skills':
                return <SkillsSection {...commonProps} />;
            case 'projects':
                return <ProjectsSection {...commonProps} />;
            case 'certifications':
                return <CertificationsSection {...commonProps} />;
            case 'experience':
                return <ExperienceSection {...commonProps} />;
            case 'job-roles':
                return <JobRolesSection {...commonProps} />;
            default:
                return <BasicDetailsSection {...commonProps} />;
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <LoadingSpinner size="lg" />
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>Professional Profile</h1>
                    <p className={styles.subtitle}>Manage your complete professional information</p>
                </div>

                <div className={styles.layout}>
                    {/* Sidebar Navigation */}
                    <div className={styles.sidebar}>
                        <div className={styles.sectionList}>
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;
                                const hasData = profileData[section.id.replace('-', '')] !== null;

                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => handleSectionChange(section.id)}
                                        className={`${styles.sectionButton} ${isActive ? styles.active : ''}`}
                                    >
                                        <div className={styles.sectionIcon}>
                                            <Icon size={20} />
                                            {hasData && <div className={styles.completedDot} />}
                                        </div>
                                        <div className={styles.sectionInfo}>
                                            <span className={styles.sectionTitle}>{section.title}</span>
                                            {section.required && <span className={styles.requiredBadge}>Required</span>}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className={styles.mainContent}>
                        <div className={styles.contentHeader}>
                            <div className={styles.contentTitle}>
                                <h2>{sections.find(s => s.id === activeSection)?.title}</h2>
                                <p>Manage your {sections.find(s => s.id === activeSection)?.title.toLowerCase()}</p>
                            </div>
                            <div className={styles.contentActions}>
                                <button
                                    onClick={handleEditToggle}
                                    className={`${styles.actionButton} ${isEditing ? styles.cancelButton : styles.editButton}`}
                                >
                                    {isEditing ? (
                                        <>
                                            <Eye size={16} />
                                            View
                                        </>
                                    ) : (
                                        <>
                                            <Edit size={16} />
                                            Edit
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className={styles.sectionContent}>
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderActiveSection()}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

