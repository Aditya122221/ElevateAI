import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Award, Calendar, Building, Check, AlertCircle, Star, ExternalLink } from 'lucide-react';
import styles from '../ProfileCreationPage.module.css';

const CertificationsStep = ({
    register,
    getValues,
    setValue
}) => {
    const [focusedInputs, setFocusedInputs] = useState({});
    const [skillInputs, setSkillInputs] = useState({});

    // Certification management functions
    const addCertification = () => {
        const currentCertifications = getValues('certifications') || [];
        setValue('certifications', [...currentCertifications, {
            name: '',
            platform: '',
            skills: [],
            startDate: '',
            endDate: ''
        }]);
    };

    const removeCertification = (index) => {
        const currentCertifications = getValues('certifications') || [];
        setValue('certifications', currentCertifications.filter((_, i) => i !== index));
    };

    const addCertificationSkill = (certIndex, skillName) => {
        const currentCertifications = getValues('certifications') || [];
        const updatedCertifications = [...currentCertifications];
        const currentSkills = updatedCertifications[certIndex].skills || [];
        if (skillName.trim() && !currentSkills.includes(skillName.trim())) {
            updatedCertifications[certIndex] = {
                ...updatedCertifications[certIndex],
                skills: [...currentSkills, skillName.trim()]
            };
            setValue('certifications', updatedCertifications);
            setSkillInputs(prev => ({ ...prev, [certIndex]: '' }));
        }
    };

    const removeCertificationSkill = (certIndex, skillIndex) => {
        const currentCertifications = getValues('certifications') || [];
        const updatedCertifications = [...currentCertifications];
        updatedCertifications[certIndex] = {
            ...updatedCertifications[certIndex],
            skills: updatedCertifications[certIndex].skills.filter((_, i) => i !== skillIndex)
        };
        setValue('certifications', updatedCertifications);
    };

    const handleInputFocus = (fieldId) => {
        setFocusedInputs(prev => ({ ...prev, [fieldId]: true }));
    };

    const handleInputBlur = (fieldId) => {
        setFocusedInputs(prev => ({ ...prev, [fieldId]: false }));
    };

    const handleSkillInputChange = (certIndex, value) => {
        setSkillInputs(prev => ({ ...prev, [certIndex]: value }));
    };

    const handleSkillKeyPress = (e, certIndex) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCertificationSkill(certIndex, e.target.value);
        }
    };

    const handleAddSkillClick = (certIndex) => {
        const value = skillInputs[certIndex] || '';
        addCertificationSkill(certIndex, value);
    };

    // Calculate total certifications count
    const totalCertifications = (getValues('certifications') || []).length;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.enhancedStepContent}
        >
            {/* Enhanced Header */}
            <div className={styles.enhancedSectionHeader}>
                <div className={styles.headerIcon} style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                    <Award size={24} />
                </div>
                <div className={styles.headerText}>
                    <h3 className={styles.enhancedSectionTitle}>Certifications & Achievements</h3>
                    <p className={styles.enhancedSectionSubtitle}>
                        Showcase your professional certifications and achievements. This section is optional but adds credibility.
                    </p>
                </div>
            </div>

            {/* Certifications Summary */}
            <div className={styles.certificationsSummary}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <Award size={20} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryNumber}>{totalCertifications}</span>
                        <span className={styles.summaryLabel}>Certifications Added</span>
                    </div>
                </div>
                {totalCertifications === 0 && (
                    <div className={styles.summaryInfo}>
                        <AlertCircle size={16} />
                        <span>Certifications are optional but recommended</span>
                    </div>
                )}
            </div>

            {/* Certifications Container */}
            <div className={styles.enhancedCertificationsContainer}>
                {(getValues('certifications') || []).map((certification, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={styles.enhancedCertificationCard}
                    >
                        {/* Certification Header */}
                        <div className={styles.enhancedCertificationHeader}>
                            <div className={styles.certificationHeaderContent}>
                                <div className={styles.certificationIcon}>
                                    <Award size={20} />
                                </div>
                                <div className={styles.certificationHeaderInfo}>
                                    <h4 className={styles.certificationTitle}>Certification {index + 1}</h4>
                                    <p className={styles.certificationSubtitle}>Add details about your certification</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeCertification(index)}
                                className={styles.enhancedRemoveButton}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Basic Information */}
                        <div className={styles.certificationSection}>
                            <div className={styles.sectionTitle}>
                                <Award size={18} />
                                <span>Certification Details</span>
                            </div>

                            <div className={styles.enhancedFormGrid}>
                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <Star size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>Certification Name</span>
                                            <span className={styles.requiredStar}>*</span>
                                        </div>
                                        <span className={styles.fieldDescription}>The full name of your certification</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`certifications.${index}.name`, {
                                                required: 'Certification name is required'
                                            })}
                                            className={styles.enhancedFormInput}
                                            placeholder="e.g., AWS Certified Solutions Architect"
                                            onFocus={() => handleInputFocus(`cert-${index}-name`)}
                                            onBlur={() => handleInputBlur(`cert-${index}-name`)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <Building size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>Platform/Issuer</span>
                                            <span className={styles.requiredStar}>*</span>
                                        </div>
                                        <span className={styles.fieldDescription}>Who issued this certification?</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`certifications.${index}.platform`, {
                                                required: 'Platform/Issuer is required'
                                            })}
                                            className={styles.enhancedFormInput}
                                            placeholder="e.g., Amazon Web Services, Google, Microsoft"
                                            onFocus={() => handleInputFocus(`cert-${index}-platform`)}
                                            onBlur={() => handleInputBlur(`cert-${index}-platform`)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <Calendar size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>Start Date</span>
                                            <span className={styles.requiredStar}>*</span>
                                        </div>
                                        <span className={styles.fieldDescription}>When did you start this certification?</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`certifications.${index}.startDate`, {
                                                required: 'Start date is required'
                                            })}
                                            type="month"
                                            className={styles.enhancedFormInput}
                                            onFocus={() => handleInputFocus(`cert-${index}-startDate`)}
                                            onBlur={() => handleInputBlur(`cert-${index}-startDate`)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <Calendar size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>End Date</span>
                                        </div>
                                        <span className={styles.fieldDescription}>When did you complete this certification? (Optional)</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`certifications.${index}.endDate`)}
                                            type="month"
                                            className={styles.enhancedFormInput}
                                            onFocus={() => handleInputFocus(`cert-${index}-endDate`)}
                                            onBlur={() => handleInputBlur(`cert-${index}-endDate`)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Skills Covered */}
                        <div className={styles.certificationSection}>
                            <div className={styles.sectionTitle}>
                                <Check size={18} />
                                <span>Skills & Competencies</span>
                            </div>

                            <div className={styles.enhancedFormField}>
                                <label className={styles.enhancedFormLabel}>
                                    <div className={styles.labelContent}>
                                        <Check size={16} className={styles.labelIcon} />
                                        <span className={styles.labelText}>Skills Covered</span>
                                    </div>
                                    <span className={styles.fieldDescription}>What skills or technologies does this certification cover?</span>
                                </label>

                                <div className={styles.enhancedSkillInputContainer}>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            value={skillInputs[index] || ''}
                                            onChange={(e) => handleSkillInputChange(index, e.target.value)}
                                            onKeyPress={(e) => handleSkillKeyPress(e, index)}
                                            className={styles.enhancedSkillInput}
                                            placeholder="e.g., Cloud Computing, Machine Learning, Data Analysis"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddSkillClick(index)}
                                            className={styles.enhancedAddButton}
                                            disabled={!skillInputs[index]?.trim()}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                {(certification.skills || []).length > 0 && (
                                    <div className={styles.enhancedSkillsList}>
                                        {(certification.skills || []).map((skill, skillIndex) => (
                                            <motion.div
                                                key={skillIndex}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={styles.enhancedSkillItem}
                                            >
                                                <div className={styles.skillContent}>
                                                    <div className={styles.skillIcon}>
                                                        <Check size={14} />
                                                    </div>
                                                    <span className={styles.skillName}>{skill}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCertificationSkill(index, skillIndex)}
                                                    className={styles.enhancedRemoveButton}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Add Certification Button */}
                <motion.button
                    type="button"
                    onClick={addCertification}
                    className={styles.enhancedAddCertificationButton}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className={styles.addButtonIcon}>
                        <Award size={20} />
                    </div>
                    <div className={styles.addButtonContent}>
                        <span className={styles.addButtonTitle}>Add New Certification</span>
                        <span className={styles.addButtonSubtitle}>Showcase your professional achievements</span>
                    </div>
                </motion.button>
            </div>

            {/* Tips Section */}
            <div className={styles.certificationsTips}>
                <div className={styles.tipsHeader}>
                    <AlertCircle size={16} />
                    <span>Tips for great certifications</span>
                </div>
                <ul className={styles.tipsList}>
                    <li>Include industry-recognized certifications from reputable organizations</li>
                    <li>Add both technical and professional certifications</li>
                    <li>Include completion dates and expiration dates if applicable</li>
                    <li>List the key skills and technologies covered by each certification</li>
                    <li>Focus on certifications that are relevant to your career goals</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default CertificationsStep;
