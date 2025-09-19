import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Code,
    Plus,
    X,
    Save,
    Edit,
    Star,
    CheckCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from '../CSS/SkillsSection.module.css';

const SkillsSection = ({ data, isEditing, onDataUpdate, onEditToggle }) => {
    const [formData, setFormData] = useState({
        languages: data?.languages || [],
        technologies: data?.technologies || [],
        frameworks: data?.frameworks || [],
        tools: data?.tools || [],
        softSkills: data?.softSkills || []
    });
    const [newSkill, setNewSkill] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('languages');
    const [isLoading, setIsLoading] = useState(false);

    const skillCategories = [
        { key: 'languages', label: 'Programming Languages', icon: Code, color: '#3B82F6' },
        { key: 'technologies', label: 'Technologies', icon: Code, color: '#10B981' },
        { key: 'frameworks', label: 'Frameworks & Libraries', icon: Code, color: '#F59E0B' },
        { key: 'tools', label: 'Tools & Platforms', icon: Code, color: '#8B5CF6' },
        { key: 'softSkills', label: 'Soft Skills', icon: Star, color: '#EC4899' }
    ];

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;

        setFormData(prev => ({
            ...prev,
            [selectedCategory]: [...prev[selectedCategory], newSkill.trim()]
        }));
        setNewSkill('');
    };

    const handleRemoveSkill = (category, index) => {
        setFormData(prev => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await axios.post('/api/profile/skills', formData);
            onDataUpdate(formData);
            onEditToggle();
            toast.success('Skills updated successfully!');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save skills');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            languages: data?.languages || [],
            technologies: data?.technologies || [],
            frameworks: data?.frameworks || [],
            tools: data?.tools || [],
            softSkills: data?.softSkills || []
        });
        onEditToggle();
    };

    const hasAnySkills = Object.values(formData).some(skills => skills.length > 0);

    if (!data && !isEditing) {
        return (
            <div className={styles.emptyState}>
                <Code size={48} className={styles.emptyIcon} />
                <h3>No Skills Added</h3>
                <p>Add your technical and soft skills to showcase your expertise</p>
                <button onClick={onEditToggle} className={styles.addButton}>
                    <Edit size={16} />
                    Add Skills
                </button>
            </div>
        );
    }

    return (
        <div className={styles.skillsSection}>
            {isEditing ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.editForm}
                >
                    <div className={styles.formHeader}>
                        <h3>Edit Skills</h3>
                        <div className={styles.formActions}>
                            <button
                                onClick={handleCancel}
                                className={styles.cancelButton}
                                disabled={isLoading}
                            >
                                <X size={16} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className={styles.saveButton}
                                disabled={isLoading}
                            >
                                <Save size={16} />
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                    <div className={styles.formContent}>
                        {/* Add New Skill */}
                        <div className={styles.addSkillSection}>
                            <h4>Add New Skill</h4>
                            <div className={styles.addSkillForm}>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className={styles.categorySelect}
                                >
                                    {skillCategories.map(category => (
                                        <option key={category.key} value={category.key}>
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Enter skill name"
                                    className={styles.skillInput}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                                />
                                <button
                                    onClick={handleAddSkill}
                                    className={styles.addButton}
                                    disabled={!newSkill.trim()}
                                >
                                    <Plus size={16} />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* Skills by Category */}
                        <div className={styles.skillsGrid}>
                            {skillCategories.map(category => {
                                const Icon = category.icon;
                                const skills = formData[category.key];

                                return (
                                    <div key={category.key} className={styles.skillCategory}>
                                        <div className={styles.categoryHeader}>
                                            <div className={styles.categoryTitle}>
                                                <Icon size={20} style={{ color: category.color }} />
                                                <h4>{category.label}</h4>
                                                <span className={styles.skillCount}>({skills.length})</span>
                                            </div>
                                        </div>

                                        <div className={styles.skillsList}>
                                            {skills.length === 0 ? (
                                                <p className={styles.noSkills}>No skills added yet</p>
                                            ) : (
                                                skills.map((skill, index) => (
                                                    <div key={index} className={styles.skillItem}>
                                                        <span className={styles.skillName}>{skill}</span>
                                                        <button
                                                            onClick={() => handleRemoveSkill(category.key, index)}
                                                            className={styles.removeButton}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.viewMode}
                >
                    <div className={styles.skillsOverview}>
                        <div className={styles.overviewHeader}>
                            <h3>Skills Overview</h3>
                            <div className={styles.totalSkills}>
                                <CheckCircle size={20} />
                                <span>{Object.values(formData).reduce((total, skills) => total + skills.length, 0)} Total Skills</span>
                            </div>
                        </div>

                        <div className={styles.skillsGrid}>
                            {skillCategories.map(category => {
                                const Icon = category.icon;
                                const skills = formData[category.key];

                                if (skills.length === 0) return null;

                                return (
                                    <div key={category.key} className={styles.skillCategory}>
                                        <div className={styles.categoryHeader}>
                                            <div className={styles.categoryTitle}>
                                                <Icon size={20} style={{ color: category.color }} />
                                                <h4>{category.label}</h4>
                                                <span className={styles.skillCount}>({skills.length})</span>
                                            </div>
                                        </div>

                                        <div className={styles.skillsList}>
                                            {skills.map((skill, index) => (
                                                <div key={index} className={styles.skillTag}>
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {!hasAnySkills && (
                            <div className={styles.noSkillsMessage}>
                                <Code size={32} />
                                <p>No skills added yet</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default SkillsSection;

