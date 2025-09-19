import React from 'react';
import { User, Code, Briefcase, FolderOpen, Award, Target } from 'lucide-react';
import styles from './ProfileNavigation.module.css';

const ProfileNavigation = ({ activeSection, setActiveSection }) => {
    const sections = [
        {
            id: 'basic-details',
            label: 'Basic Details',
            icon: User,
            description: 'Personal information and contact details'
        },
        {
            id: 'skills',
            label: 'Skills',
            icon: Code,
            description: 'Technical and soft skills'
        },
        {
            id: 'experience',
            label: 'Experience',
            icon: Briefcase,
            description: 'Work experience and career history'
        },
        {
            id: 'projects',
            label: 'Projects',
            icon: FolderOpen,
            description: 'Portfolio projects and work samples'
        },
        {
            id: 'certificates',
            label: 'Certificates',
            icon: Award,
            description: 'Certifications and achievements'
        },
        {
            id: 'job-roles',
            label: 'Job Roles',
            icon: Target,
            description: 'Desired positions and career goals'
        }
    ];

    return (
        <div className={styles.navigation}>
            <div className={styles.navigationHeader}>
                <h2 className={styles.navigationTitle}>Profile Sections</h2>
                <p className={styles.navigationSubtitle}>Manage different aspects of your professional profile</p>
            </div>

            <div className={styles.sectionsGrid}>
                {sections.map((section) => {
                    const IconComponent = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`${styles.sectionButton} ${isActive ? styles.activeSection : ''}`}
                        >
                            <div className={styles.sectionIcon}>
                                <IconComponent className="w-6 h-6" />
                            </div>
                            <div className={styles.sectionContent}>
                                <h3 className={styles.sectionLabel}>{section.label}</h3>
                                <p className={styles.sectionDescription}>{section.description}</p>
                            </div>
                            {isActive && (
                                <div className={styles.activeIndicator}>
                                    <div className={styles.activeDot}></div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfileNavigation;
