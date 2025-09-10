import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Target, Briefcase, Check, AlertCircle, Star, TrendingUp } from 'lucide-react';
import styles from '../ProfileCreationPage.module.css';

const JobRolesStep = ({
    register,
    errors,
    getValues,
    setValue
}) => {
    const [focusedInput, setFocusedInput] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // Job roles management functions
    const addJobRole = (roleName) => {
        const currentRoles = getValues('desiredJobRoles') || [];
        if (roleName.trim() && !currentRoles.includes(roleName.trim())) {
            setValue('desiredJobRoles', [...currentRoles, roleName.trim()]);
            setInputValue('');
        }
    };

    const removeJobRole = (index) => {
        const currentRoles = getValues('desiredJobRoles') || [];
        setValue('desiredJobRoles', currentRoles.filter((_, i) => i !== index));
    };

    const handleInputChange = (value) => {
        setInputValue(value);
    };

    const handleInputFocus = () => {
        setFocusedInput(true);
    };

    const handleInputBlur = () => {
        setFocusedInput(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addJobRole(e.target.value);
        }
    };

    const handleAddClick = () => {
        addJobRole(inputValue);
    };

    // Calculate total job roles count
    const totalJobRoles = (getValues('desiredJobRoles') || []).length;

    // Popular job roles suggestions
    const popularRoles = [
        'Software Engineer',
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Data Scientist',
        'Product Manager',
        'UX/UI Designer',
        'DevOps Engineer',
        'Mobile Developer',
        'Machine Learning Engineer',
        'Cloud Architect',
        'Technical Lead',
        'QA Engineer',
        'Cybersecurity Analyst',
        'Business Analyst'
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.enhancedStepContent}
        >
            {/* Enhanced Header */}
            <div className={styles.enhancedSectionHeader}>
                <div className={styles.headerIcon} style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}>
                    <Target size={24} />
                </div>
                <div className={styles.headerText}>
                    <h3 className={styles.enhancedSectionTitle}>Desired Job Roles</h3>
                    <p className={styles.enhancedSectionSubtitle}>
                        Specify the job roles you're interested in pursuing. Add at least one role to continue.
                    </p>
                </div>
            </div>

            {/* Job Roles Summary */}
            <div className={styles.jobRolesSummary}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <Target size={20} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryNumber}>{totalJobRoles}</span>
                        <span className={styles.summaryLabel}>Job Roles Added</span>
                    </div>
                </div>
                {totalJobRoles === 0 && (
                    <div className={styles.summaryWarning}>
                        <AlertCircle size={16} />
                        <span>At least one job role is required</span>
                    </div>
                )}
            </div>

            {/* Job Roles Input Section */}
            <div className={styles.jobRolesInputSection}>
                <div className={styles.sectionTitle}>
                    <Briefcase size={18} />
                    <span>Add Your Desired Roles</span>
                </div>

                <div className={styles.enhancedFormField}>
                    <label className={styles.enhancedFormLabel}>
                        <div className={styles.labelContent}>
                            <Target size={16} className={styles.labelIcon} />
                            <span className={styles.labelText}>Job Role</span>
                            <span className={styles.requiredStar}>*</span>
                        </div>
                        <span className={styles.fieldDescription}>Enter the job titles or roles you're interested in</span>
                    </label>

                    <div className={styles.enhancedSkillInputContainer}>
                        <div className={`${styles.inputWrapper} ${focusedInput ? styles.focused : ''} ${inputValue ? styles.hasValue : ''}`}>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onKeyPress={handleKeyPress}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                className={styles.enhancedSkillInput}
                                placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                            />
                            <button
                                type="button"
                                onClick={handleAddClick}
                                className={styles.enhancedAddButton}
                                disabled={!inputValue?.trim()}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current Job Roles */}
            {(getValues('desiredJobRoles') || []).length > 0 && (
                <div className={styles.currentJobRolesSection}>
                    <div className={styles.sectionTitle}>
                        <Check size={18} />
                        <span>Your Selected Roles</span>
                    </div>

                    <div className={styles.enhancedJobRolesList}>
                        {(getValues('desiredJobRoles') || []).map((role, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={styles.enhancedJobRoleItem}
                            >
                                <div className={styles.jobRoleContent}>
                                    <div className={styles.jobRoleIcon}>
                                        <Briefcase size={16} />
                                    </div>
                                    <span className={styles.jobRoleName}>{role}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeJobRole(index)}
                                    className={styles.enhancedRemoveButton}
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Job Roles Suggestions */}
            <div className={styles.popularRolesSection}>
                <div className={styles.sectionTitle}>
                    <TrendingUp size={18} />
                    <span>Popular Job Roles</span>
                </div>

                <div className={styles.popularRolesGrid}>
                    {popularRoles.map((role, index) => {
                        const isSelected = (getValues('desiredJobRoles') || []).includes(role);
                        return (
                            <motion.button
                                key={index}
                                type="button"
                                onClick={() => !isSelected && addJobRole(role)}
                                className={`${styles.popularRoleItem} ${isSelected ? styles.selected : ''}`}
                                disabled={isSelected}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={styles.popularRoleIcon}>
                                    <Star size={14} />
                                </div>
                                <span className={styles.popularRoleName}>{role}</span>
                                {isSelected && (
                                    <div className={styles.selectedIcon}>
                                        <Check size={12} />
                                    </div>
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Error Message */}
            {errors.desiredJobRoles && (
                <div className={styles.enhancedErrorText}>
                    <AlertCircle size={16} />
                    <span>At least one job role is required to continue</span>
                </div>
            )}

            {/* Tips Section */}
            <div className={styles.jobRolesTips}>
                <div className={styles.tipsHeader}>
                    <AlertCircle size={16} />
                    <span>Tips for selecting job roles</span>
                </div>
                <ul className={styles.tipsList}>
                    <li>Choose roles that align with your skills and career goals</li>
                    <li>Consider both your current experience and future aspirations</li>
                    <li>Include specific titles rather than broad categories</li>
                    <li>You can always update your preferences later</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default JobRolesStep;
