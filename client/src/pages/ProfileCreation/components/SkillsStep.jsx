import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Code, Cpu, Layers, Wrench, Users, Check, AlertCircle } from 'lucide-react';
import styles from '../ProfileCreationPage.module.css';

const SkillsStep = ({
    getValues,
    setValue
}) => {
    const [focusedInputs, setFocusedInputs] = useState({});
    const [inputValues, setInputValues] = useState({});

    // Skill management functions
    const addSkill = (category, skillName) => {
        const currentSkills = getValues(`skills.${category}`) || [];
        if (skillName.trim() && !currentSkills.includes(skillName.trim())) {
            setValue(`skills.${category}`, [...currentSkills, skillName.trim()]);
            setInputValues(prev => ({ ...prev, [category]: '' }));
        }
    };

    const removeSkill = (category, index) => {
        const currentSkills = getValues(`skills.${category}`) || [];
        setValue(`skills.${category}`, currentSkills.filter((_, i) => i !== index));
    };

    const handleInputChange = (category, value) => {
        setInputValues(prev => ({ ...prev, [category]: value }));
    };

    const handleInputFocus = (category) => {
        setFocusedInputs(prev => ({ ...prev, [category]: true }));
    };

    const handleInputBlur = (category) => {
        setFocusedInputs(prev => ({ ...prev, [category]: false }));
    };

    const handleKeyPress = (e, category) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill(category, e.target.value);
        }
    };

    const handleAddClick = (category) => {
        const value = inputValues[category] || '';
        addSkill(category, value);
    };

    // Category configuration with icons and descriptions
    const skillCategories = [
        {
            key: 'languages',
            title: 'Programming Languages',
            icon: Code,
            description: 'Languages you code in',
            placeholder: 'e.g., JavaScript, Python, Java',
            color: '#3B82F6'
        },
        {
            key: 'technologies',
            title: 'Technologies',
            icon: Cpu,
            description: 'Core technologies you work with',
            placeholder: 'e.g., React, Node.js, MongoDB',
            color: '#10B981'
        },
        {
            key: 'frameworks',
            title: 'Frameworks & Libraries',
            icon: Layers,
            description: 'Frameworks and libraries you use',
            placeholder: 'e.g., Express, Django, Spring',
            color: '#8B5CF6'
        },
        {
            key: 'tools',
            title: 'Tools & Platforms',
            icon: Wrench,
            description: 'Development tools and platforms',
            placeholder: 'e.g., Git, Docker, AWS',
            color: '#F59E0B'
        },
        {
            key: 'softSkills',
            title: 'Soft Skills',
            icon: Users,
            description: 'Interpersonal and communication skills',
            placeholder: 'e.g., Leadership, Communication',
            color: '#EF4444'
        }
    ];

    // Calculate total skills count
    const totalSkills = skillCategories.reduce((total, category) => {
        return total + (getValues(`skills.${category.key}`) || []).length;
    }, 0);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.enhancedStepContent}
        >
            {/* Enhanced Header */}
            <div className={styles.enhancedSectionHeader}>
                <div className={styles.headerIcon} style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                    <Code size={24} />
                </div>
                <div className={styles.headerText}>
                    <h3 className={styles.enhancedSectionTitle}>Skills & Expertise</h3>
                    <p className={styles.enhancedSectionSubtitle}>
                        Showcase your technical and soft skills. Add at least one skill to continue.
                    </p>
                </div>
            </div>

            {/* Skills Summary */}
            <div className={styles.skillsSummary}>
                <div className={styles.summaryCard}>
                    <div className={styles.summaryIcon}>
                        <Check size={20} />
                    </div>
                    <div className={styles.summaryContent}>
                        <span className={styles.summaryNumber}>{totalSkills}</span>
                        <span className={styles.summaryLabel}>Skills Added</span>
                    </div>
                </div>
                {totalSkills === 0 && (
                    <div className={styles.summaryWarning}>
                        <AlertCircle size={16} />
                        <span>At least one skill is required</span>
                    </div>
                )}
            </div>

            {/* Skills Categories */}
            <div className={styles.skillsContainer}>
                {skillCategories.map((category, index) => {
                    const IconComponent = category.icon;
                    const skills = getValues(`skills.${category.key}`) || [];
                    const isFocused = focusedInputs[category.key];
                    const hasValue = inputValues[category.key];

                    return (
                        <motion.div
                            key={category.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={styles.enhancedSkillCategory}
                        >
                            {/* Category Header */}
                            <div className={styles.categoryHeader}>
                                <div className={styles.categoryIcon} style={{ backgroundColor: category.color }}>
                                    <IconComponent size={18} />
                                </div>
                                <div className={styles.categoryInfo}>
                                    <h4 className={styles.categoryTitle}>{category.title}</h4>
                                    <p className={styles.categoryDescription}>{category.description}</p>
                                </div>
                                <div className={styles.skillCount}>
                                    <span className={styles.countNumber}>{skills.length}</span>
                                </div>
                            </div>

                            {/* Input Section */}
                            <div className={styles.enhancedSkillInputContainer}>
                                <div className={`${styles.inputWrapper} ${isFocused ? styles.focused : ''} ${hasValue ? styles.hasValue : ''}`}>
                                    <input
                                        type="text"
                                        placeholder={category.placeholder}
                                        value={inputValues[category.key] || ''}
                                        onChange={(e) => handleInputChange(category.key, e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, category.key)}
                                        onFocus={() => handleInputFocus(category.key)}
                                        onBlur={() => handleInputBlur(category.key)}
                                        className={styles.enhancedSkillInput}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleAddClick(category.key)}
                                        className={styles.enhancedAddButton}
                                        disabled={!inputValues[category.key]?.trim()}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Skills List */}
                            {skills.length > 0 && (
                                <div className={styles.enhancedSkillsList}>
                                    {skills.map((skill, skillIndex) => (
                                        <motion.div
                                            key={skillIndex}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className={styles.enhancedSkillItem}
                                        >
                                            <div className={styles.skillContent}>
                                                <div className={styles.skillIcon}>
                                                    <IconComponent size={14} />
                                                </div>
                                                <span className={styles.skillName}>{skill}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(category.key, skillIndex)}
                                                className={styles.enhancedRemoveButton}
                                            >
                                                <X size={12} />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {skills.length === 0 && (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>
                                        <IconComponent size={24} />
                                    </div>
                                    <p className={styles.emptyText}>No {category.title.toLowerCase()} added yet</p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Tips Section */}
            <div className={styles.skillsTips}>
                <div className={styles.tipsHeader}>
                    <AlertCircle size={16} />
                    <span>Tips for adding skills</span>
                </div>
                <ul className={styles.tipsList}>
                    <li>Be specific with your skill names (e.g., "React" instead of "Frontend")</li>
                    <li>Include both technical and soft skills</li>
                    <li>Add skills you're confident working with</li>
                    <li>You can always add more skills later</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default SkillsStep;
