import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Briefcase, Building, Calendar, MapPin, Check, AlertCircle, Star, Award, Code, FileText } from 'lucide-react';
import styles from '../ProfileCreationPage.module.css';

const ExperienceStep = ({
    register,
    getValues,
    setValue
}) => {
    const [focusedInputs, setFocusedInputs] = useState({});
    const [skillInputs, setSkillInputs] = useState({});

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

    const addExperienceSkill = (expIndex, skillName) => {
        const currentExperience = getValues('experience') || [];
        const updatedExperience = [...currentExperience];
        const currentSkills = updatedExperience[expIndex].skills || [];
        if (skillName.trim() && !currentSkills.includes(skillName.trim())) {
            updatedExperience[expIndex] = {
                ...updatedExperience[expIndex],
                skills: [...currentSkills, skillName.trim()]
            };
            setValue('experience', updatedExperience);
            setSkillInputs(prev => ({ ...prev, [expIndex]: '' }));
        }
    };

    const removeExperienceSkill = (expIndex, skillIndex) => {
        const currentExperience = getValues('experience') || [];
        const updatedExperience = [...currentExperience];
        updatedExperience[expIndex] = {
            ...updatedExperience[expIndex],
            skills: updatedExperience[expIndex].skills.filter((_, i) => i !== skillIndex)
        };
        setValue('experience', updatedExperience);
    };

    const handleInputFocus = (fieldId) => {
        setFocusedInputs(prev => ({ ...prev, [fieldId]: true }));
    };

    const handleInputBlur = (fieldId) => {
        setFocusedInputs(prev => ({ ...prev, [fieldId]: false }));
    };

    const handleSkillInputChange = (expIndex, value) => {
        setSkillInputs(prev => ({ ...prev, [expIndex]: value }));
    };

    const handleSkillKeyPress = (e, expIndex) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addExperienceSkill(expIndex, e.target.value);
        }
    };

    const handleAddSkillClick = (expIndex) => {
        const value = skillInputs[expIndex] || '';
        addExperienceSkill(expIndex, value);
    };

    // Calculate total experience count
    const totalExperience = (getValues('experience') || []).length;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.enhancedStepContent}
        >
            {/* Enhanced Header */}
            <div className={styles.enhancedSectionHeader}>
                <div className={styles.headerIcon} style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                    <Briefcase size={24} />
                </div>
                <div className={styles.headerText}>
                    <h3 className={styles.enhancedSectionTitle}>Work Experience</h3>
                    <p className={styles.enhancedSectionSubtitle}>
                        Showcase your professional journey and career achievements. This section is optional but highly recommended.
                    </p>
                </div>
            </div>

            {/* Experience Summary */}
            <div className={styles.experienceSummary}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <Briefcase size={20} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryNumber}>{totalExperience}</span>
                        <span className={styles.summaryLabel}>Experiences Added</span>
                    </div>
                </div>
                {totalExperience === 0 && (
                    <div className={styles.summaryInfo}>
                        <AlertCircle size={16} />
                        <span>Work experience is optional but recommended</span>
                    </div>
                )}
            </div>

            {/* Experience Container */}
            <div className={styles.enhancedExperienceContainer}>
                {(getValues('experience') || []).map((exp, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={styles.enhancedExperienceCard}
                    >
                        {/* Experience Header */}
                        <div className={styles.enhancedExperienceHeader}>
                            <div className={styles.experienceHeaderContent}>
                                <div className={styles.experienceIcon}>
                                    <Briefcase size={20} />
                                </div>
                                <div className={styles.experienceHeaderInfo}>
                                    <h4 className={styles.experienceTitle}>Experience {index + 1}</h4>
                                    <p className={styles.experienceSubtitle}>Add details about your work experience</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className={styles.enhancedRemoveButton}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Basic Information */}
                        <div className={styles.experienceSection}>
                            <div className={styles.sectionTitle}>
                                <Building size={18} />
                                <span>Company & Position</span>
                            </div>

                            <div className={styles.enhancedFormGrid}>
                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <Building size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>Company Name</span>
                                            <span className={styles.requiredStar}>*</span>
                                        </div>
                                        <span className={styles.fieldDescription}>The name of the company you worked for</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`experience.${index}.companyName`, {
                                                required: 'Company name is required'
                                            })}
                                            className={styles.enhancedFormInput}
                                            placeholder="e.g., Google, Microsoft, Startup Inc."
                                            onFocus={() => handleInputFocus(`exp-${index}-company`)}
                                            onBlur={() => handleInputBlur(`exp-${index}-company`)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <Briefcase size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>Position/Title</span>
                                            <span className={styles.requiredStar}>*</span>
                                        </div>
                                        <span className={styles.fieldDescription}>Your job title or position</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`experience.${index}.position`, {
                                                required: 'Position is required'
                                            })}
                                            className={styles.enhancedFormInput}
                                            placeholder="e.g., Software Engineer, Product Manager"
                                            onFocus={() => handleInputFocus(`exp-${index}-position`)}
                                            onBlur={() => handleInputBlur(`exp-${index}-position`)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Employment Period */}
                        <div className={styles.experienceSection}>
                            <div className={styles.sectionTitle}>
                                <Calendar size={18} />
                                <span>Employment Period</span>
                            </div>

                            <div className={styles.enhancedFormGrid}>
                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <Calendar size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>Start Date</span>
                                            <span className={styles.requiredStar}>*</span>
                                        </div>
                                        <span className={styles.fieldDescription}>When did you start this position?</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`experience.${index}.startDate`, {
                                                required: 'Start date is required'
                                            })}
                                            type="date"
                                            className={styles.enhancedFormInput}
                                            onFocus={() => handleInputFocus(`exp-${index}-startDate`)}
                                            onBlur={() => handleInputBlur(`exp-${index}-startDate`)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <Calendar size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>End Date</span>
                                        </div>
                                        <span className={styles.fieldDescription}>When did you leave this position? (Leave empty if current)</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`experience.${index}.endDate`)}
                                            type="date"
                                            className={styles.enhancedFormInput}
                                            onFocus={() => handleInputFocus(`exp-${index}-endDate`)}
                                            onBlur={() => handleInputBlur(`exp-${index}-endDate`)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.enhancedFormField}>
                                <label className={styles.enhancedCheckboxLabel}>
                                    <input
                                        {...register(`experience.${index}.current`)}
                                        type="checkbox"
                                        className={styles.enhancedCheckbox}
                                    />
                                    <div className={styles.checkboxContent}>
                                        <div className={styles.checkboxIcon}>
                                            <Check size={16} />
                                        </div>
                                        <div className={styles.checkboxText}>
                                            <span className={styles.checkboxTitle}>Currently working here</span>
                                            <span className={styles.checkboxDescription}>Check if this is your current position</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div className={styles.experienceSection}>
                            <div className={styles.sectionTitle}>
                                <FileText size={18} />
                                <span>Role & Responsibilities</span>
                            </div>

                            <div className={styles.enhancedFormField}>
                                <label className={styles.enhancedFormLabel}>
                                    <div className={styles.labelContent}>
                                        <FileText size={16} className={styles.labelIcon} />
                                        <span className={styles.labelText}>Job Description</span>
                                    </div>
                                    <span className={styles.fieldDescription}>Describe your role, responsibilities, and key duties</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <textarea
                                        {...register(`experience.${index}.description`)}
                                        className={styles.enhancedFormInput}
                                        placeholder="Describe your role, key responsibilities, and what you accomplished in this position..."
                                        rows={4}
                                        onFocus={() => handleInputFocus(`exp-${index}-description`)}
                                        onBlur={() => handleInputBlur(`exp-${index}-description`)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Key Achievements */}
                        <div className={styles.experienceSection}>
                            <div className={styles.sectionTitle}>
                                <Award size={18} />
                                <span>Key Achievements</span>
                            </div>

                            <div className={styles.enhancedFormField}>
                                <label className={styles.enhancedFormLabel}>
                                    <div className={styles.labelContent}>
                                        <Award size={16} className={styles.labelIcon} />
                                        <span className={styles.labelText}>Notable Achievements</span>
                                    </div>
                                    <span className={styles.fieldDescription}>Highlight your key accomplishments and impact</span>
                                </label>
                                <div className={styles.inputWrapper}>
                                    <textarea
                                        {...register(`experience.${index}.achievements`)}
                                        className={styles.enhancedFormInput}
                                        placeholder="List your key achievements, projects completed, metrics improved, or impact made (one per line)..."
                                        rows={4}
                                        onFocus={() => handleInputFocus(`exp-${index}-achievements`)}
                                        onBlur={() => handleInputBlur(`exp-${index}-achievements`)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skills Used */}
                        <div className={styles.experienceSection}>
                            <div className={styles.sectionTitle}>
                                <Code size={18} />
                                <span>Technologies & Skills</span>
                            </div>

                            <div className={styles.enhancedFormField}>
                                <label className={styles.enhancedFormLabel}>
                                    <div className={styles.labelContent}>
                                        <Code size={16} className={styles.labelIcon} />
                                        <span className={styles.labelText}>Skills & Technologies Used</span>
                                    </div>
                                    <span className={styles.fieldDescription}>What technologies, tools, and skills did you use in this role?</span>
                                </label>

                                <div className={styles.enhancedSkillInputContainer}>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            value={skillInputs[index] || ''}
                                            onChange={(e) => handleSkillInputChange(index, e.target.value)}
                                            onKeyPress={(e) => handleSkillKeyPress(e, index)}
                                            className={styles.enhancedSkillInput}
                                            placeholder="e.g., React, Python, AWS, Agile"
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

                                {(exp.skills || []).length > 0 && (
                                    <div className={styles.enhancedSkillsList}>
                                        {(exp.skills || []).map((skill, skillIndex) => (
                                            <motion.div
                                                key={skillIndex}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={styles.enhancedSkillItem}
                                            >
                                                <div className={styles.skillContent}>
                                                    <div className={styles.skillIcon}>
                                                        <Code size={14} />
                                                    </div>
                                                    <span className={styles.skillName}>{skill}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExperienceSkill(index, skillIndex)}
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

                {/* Add Experience Button */}
                <motion.button
                    type="button"
                    onClick={addExperience}
                    className={styles.enhancedAddExperienceButton}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className={styles.addButtonIcon}>
                        <Briefcase size={20} />
                    </div>
                    <div className={styles.addButtonContent}>
                        <span className={styles.addButtonTitle}>Add New Experience</span>
                        <span className={styles.addButtonSubtitle}>Showcase your professional journey</span>
                    </div>
                </motion.button>
            </div>

            {/* Tips Section */}
            <div className={styles.experienceTips}>
                <div className={styles.tipsHeader}>
                    <AlertCircle size={16} />
                    <span>Tips for great experience entries</span>
                </div>
                <ul className={styles.tipsList}>
                    <li>Start with your most recent or relevant experience</li>
                    <li>Use action verbs to describe your responsibilities and achievements</li>
                    <li>Include quantifiable results and metrics when possible</li>
                    <li>Highlight technologies, tools, and methodologies you used</li>
                    <li>Focus on achievements that demonstrate your impact and growth</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default ExperienceStep;
