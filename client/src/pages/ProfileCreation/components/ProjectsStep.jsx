import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, FolderOpen, Github, ExternalLink, Calendar, Code, Check, AlertCircle, Image, FileText } from 'lucide-react';
import styles from '../ProfileCreationPage.module.css';

const ProjectsStep = ({
    register,
    getValues,
    setValue
}) => {
    const [focusedInputs, setFocusedInputs] = useState({});
    const [skillInputs, setSkillInputs] = useState({});

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
            setSkillInputs(prev => ({ ...prev, [projectIndex]: '' }));
        }
    };

    const handleInputFocus = (fieldId) => {
        setFocusedInputs(prev => ({ ...prev, [fieldId]: true }));
    };

    const handleInputBlur = (fieldId) => {
        setFocusedInputs(prev => ({ ...prev, [fieldId]: false }));
    };

    const handleSkillInputChange = (projectIndex, value) => {
        setSkillInputs(prev => ({ ...prev, [projectIndex]: value }));
    };

    const handleSkillKeyPress = (e, projectIndex) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addProjectSkill(projectIndex, e.target.value);
        }
    };

    const handleAddSkillClick = (projectIndex) => {
        const value = skillInputs[projectIndex] || '';
        addProjectSkill(projectIndex, value);
    };

    // Calculate total projects count
    const totalProjects = (getValues('projects') || []).length;

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

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.enhancedStepContent}
        >
            {/* Enhanced Header */}
            <div className={styles.enhancedSectionHeader}>
                <div className={styles.headerIcon} style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
                    <FolderOpen size={24} />
                </div>
                <div className={styles.headerText}>
                    <h3 className={styles.enhancedSectionTitle}>Projects & Portfolio</h3>
                    <p className={styles.enhancedSectionSubtitle}>
                        Showcase your work and projects. This section is optional but helps demonstrate your skills.
                    </p>
                </div>
            </div>

            {/* Projects Summary */}
            <div className={styles.projectsSummary}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <FolderOpen size={20} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryNumber}>{totalProjects}</span>
                        <span className={styles.summaryLabel}>Projects Added</span>
                    </div>
                </div>
                {totalProjects === 0 && (
                    <div className={styles.summaryInfo}>
                        <AlertCircle size={16} />
                        <span>Projects are optional but recommended</span>
                    </div>
                )}
            </div>

            {/* Projects Container */}
            <div className={styles.enhancedProjectsContainer}>
                {(getValues('projects') || []).map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={styles.enhancedProjectCard}
                    >
                        {/* Project Header */}
                        <div className={styles.enhancedProjectHeader}>
                            <div className={styles.projectHeaderContent}>
                                <div className={styles.projectIcon}>
                                    <FolderOpen size={20} />
                                </div>
                                <div className={styles.projectHeaderInfo}>
                                    <h4 className={styles.projectTitle}>Project {index + 1}</h4>
                                    <p className={styles.projectSubtitle}>Add details about your project</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeProject(index)}
                                className={styles.enhancedRemoveButton}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Basic Information */}
                        <div className={styles.projectSection}>
                            <div className={styles.sectionTitle}>
                                <FileText size={18} />
                                <span>Basic Information</span>
                            </div>

                            <div className={styles.enhancedFormGrid}>
                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <FolderOpen size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>Project Name</span>
                                            <span className={styles.requiredStar}>*</span>
                                        </div>
                                        <span className={styles.fieldDescription}>Give your project a clear, descriptive name</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`projects.${index}.name`, {
                                                required: 'Project name is required'
                                            })}
                                            className={styles.enhancedFormInput}
                                            placeholder="e.g., E-commerce Website, Mobile App"
                                            onFocus={() => handleInputFocus(`project-${index}-name`)}
                                            onBlur={() => handleInputBlur(`project-${index}-name`)}
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
                                        <span className={styles.fieldDescription}>When did you start this project?</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`projects.${index}.startDate`, {
                                                required: 'Start date is required'
                                            })}
                                            type="month"
                                            className={styles.enhancedFormInput}
                                            onFocus={() => handleInputFocus(`project-${index}-startDate`)}
                                            onBlur={() => handleInputBlur(`project-${index}-startDate`)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <Calendar size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>End Date</span>
                                        </div>
                                        <span className={styles.fieldDescription}>When did you complete this project? (Optional)</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`projects.${index}.endDate`)}
                                            type="month"
                                            className={styles.enhancedFormInput}
                                            onFocus={() => handleInputFocus(`project-${index}-endDate`)}
                                            onBlur={() => handleInputBlur(`project-${index}-endDate`)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className={styles.projectSection}>
                            <div className={styles.sectionTitle}>
                                <ExternalLink size={18} />
                                <span>Project Links</span>
                            </div>

                            <div className={styles.enhancedFormGrid}>
                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <Github size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>GitHub Repository</span>
                                        </div>
                                        <span className={styles.fieldDescription}>Link to your source code</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`projects.${index}.githubLink`, {
                                                pattern: {
                                                    value: /^https?:\/\/.+/,
                                                    message: 'Please enter a valid URL'
                                                }
                                            })}
                                            type="url"
                                            className={styles.enhancedFormInput}
                                            placeholder="https://github.com/username/project"
                                            onFocus={() => handleInputFocus(`project-${index}-github`)}
                                            onBlur={() => handleInputBlur(`project-${index}-github`)}
                                        />
                                    </div>
                                </div>

                                <div className={styles.enhancedFormField}>
                                    <label className={styles.enhancedFormLabel}>
                                        <div className={styles.labelContent}>
                                            <ExternalLink size={16} className={styles.labelIcon} />
                                            <span className={styles.labelText}>Live Demo</span>
                                        </div>
                                        <span className={styles.fieldDescription}>Link to your live project</span>
                                    </label>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            {...register(`projects.${index}.liveUrl`, {
                                                pattern: {
                                                    value: /^https?:\/\/.+/,
                                                    message: 'Please enter a valid URL'
                                                }
                                            })}
                                            type="url"
                                            className={styles.enhancedFormInput}
                                            placeholder="https://your-project.com"
                                            onFocus={() => handleInputFocus(`project-${index}-live`)}
                                            onBlur={() => handleInputBlur(`project-${index}-live`)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Project Details */}
                        <div className={styles.projectSection}>
                            <div className={styles.sectionTitle}>
                                <FileText size={18} />
                                <span>Project Details</span>
                            </div>

                            <div className={styles.enhancedFormField}>
                                <label className={styles.enhancedFormLabel}>
                                    <div className={styles.labelContent}>
                                        <FileText size={16} className={styles.labelIcon} />
                                        <span className={styles.labelText}>Key Features & Achievements</span>
                                        <span className={styles.requiredStar}>*</span>
                                    </div>
                                    <span className={styles.fieldDescription}>Describe what your project does and what you accomplished</span>
                                </label>

                                <div className={styles.enhancedDetailsContainer}>
                                    {(getValues(`projects.${index}.details`) || ['']).map((detail, detailIndex) => (
                                        <motion.div
                                            key={detailIndex}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={styles.enhancedDetailItem}
                                        >
                                            <div className={styles.detailNumber}>{detailIndex + 1}</div>
                                            <input
                                                type="text"
                                                value={detail}
                                                onChange={(e) => updateProjectDetail(index, detailIndex, e.target.value)}
                                                className={styles.enhancedDetailInput}
                                                placeholder="Describe a key feature or achievement..."
                                                required={detailIndex === 0}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeProjectDetail(index, detailIndex)}
                                                className={styles.enhancedRemoveDetailButton}
                                                disabled={(getValues(`projects.${index}.details`) || []).length === 1}
                                            >
                                                <X size={14} />
                                            </button>
                                        </motion.div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addProjectDetail(index)}
                                        className={styles.enhancedAddDetailButton}
                                    >
                                        <Plus size={16} />
                                        Add Another Point
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Skills Used */}
                        <div className={styles.projectSection}>
                            <div className={styles.sectionTitle}>
                                <Code size={18} />
                                <span>Technologies Used</span>
                            </div>

                            <div className={styles.enhancedFormField}>
                                <label className={styles.enhancedFormLabel}>
                                    <div className={styles.labelContent}>
                                        <Code size={16} className={styles.labelIcon} />
                                        <span className={styles.labelText}>Skills & Technologies</span>
                                    </div>
                                    <span className={styles.fieldDescription}>Add the technologies, frameworks, and tools you used</span>
                                </label>

                                <div className={styles.enhancedSkillInputContainer}>
                                    <div className={styles.inputWrapper}>
                                        <input
                                            type="text"
                                            value={skillInputs[index] || ''}
                                            onChange={(e) => handleSkillInputChange(index, e.target.value)}
                                            onKeyPress={(e) => handleSkillKeyPress(e, index)}
                                            className={styles.enhancedSkillInput}
                                            placeholder="e.g., React, Node.js, MongoDB"
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

                                {(getValues(`projects.${index}.skillsUsed`) || []).length > 0 && (
                                    <div className={styles.enhancedSkillsList}>
                                        {(getValues(`projects.${index}.skillsUsed`) || []).map((skill, skillIndex) => (
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
                                                    onClick={() => removeProjectSkill(index, skillIndex)}
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

                {/* Add Project Button */}
                <motion.button
                    type="button"
                    onClick={addProject}
                    className={styles.enhancedAddProjectButton}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className={styles.addButtonIcon}>
                        <Plus size={20} />
                    </div>
                    <div className={styles.addButtonContent}>
                        <span className={styles.addButtonTitle}>Add New Project</span>
                        <span className={styles.addButtonSubtitle}>Showcase your work and achievements</span>
                    </div>
                </motion.button>
            </div>

            {/* Tips Section */}
            <div className={styles.projectsTips}>
                <div className={styles.tipsHeader}>
                    <AlertCircle size={16} />
                    <span>Tips for great projects</span>
                </div>
                <ul className={styles.tipsList}>
                    <li>Include projects that demonstrate your best work and skills</li>
                    <li>Provide clear descriptions of what you built and why</li>
                    <li>Add both GitHub links and live demos when possible</li>
                    <li>Highlight the technologies and tools you used</li>
                    <li>Focus on projects that solve real problems or showcase creativity</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default ProjectsStep;
