import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllProfileData } from '../../services/profileService';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Profile.css';

// Import separated components
import ProfileNavigation from './components/ProfileNavigation';
import BasicDetailsSection from './components/BasicDetailsSection';
import SkillsSection from './components/SkillsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import CertificatesSection from './components/CertificatesSection';
import JobRolesSection from './components/JobRolesSection';

// Main ProfilePage component
const ProfilePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('basic-details');
    const [profileData, setProfileData] = useState({
        basicDetails: null,
        skills: null,
        projects: null,
        certifications: null,
        experience: null,
        jobRoles: null
    });
    const { user } = useAuth();

    useEffect(() => {
        const loadProfileData = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const data = await getAllProfileData();
                setProfileData(data);
            } catch (error) {
                console.error('Error loading profile data:', error);
                toast.error('Failed to load profile data');
            } finally {
                setIsLoading(false);
            }
        };
        loadProfileData();
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="text-gray-600 mt-4">Loading your profile...</p>
                </div>
            </div>
        );
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'basic-details':
                return (
                    <BasicDetailsSection
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />
                );
            case 'skills':
                return (
                    <SkillsSection
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />
                );
            case 'experience':
                return (
                    <ExperienceSection
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />
                );
            case 'projects':
                return (
                    <ProjectsSection
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />
                );
            case 'certificates':
                return (
                    <CertificatesSection
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />
                );
            case 'job-roles':
                return (
                    <JobRolesSection
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />
                );
            default:
                return (
                    <BasicDetailsSection
                        profileData={profileData}
                        setProfileData={setProfileData}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Your Professional Profile
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Manage and showcase your professional information, skills, experience, and career goals in one place.
                    </p>
                </div>

                {/* Main Content Layout */}
                <div className="profile-layout">
                    {/* Sidebar Navigation */}
                    <div className="sidebar-navigation">
                        <ProfileNavigation
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                        />
                    </div>

                    {/* Main Content Area - Full Width */}
                    <div className="main-content">
                        <div className="content-transition">
                            {renderActiveSection()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
