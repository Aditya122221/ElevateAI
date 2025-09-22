import React, { useState } from 'react';
import { Plus, Edit, Save, X, Briefcase, Calendar, MapPin } from 'lucide-react';
import { updateExperience } from '../../../services/profileService';
import toast from 'react-hot-toast';
import styles from './ExperienceSection.module.css';

// Utility function to format dates from Date object to MM-YYYY
const formatDate = (dateValue) => {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${year}`;
};

const ExperienceSection = ({ profileData, setProfileData }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        position: '',
        companyName: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        skills: '',
        achievements: ''
    });

    const experiences = profileData.experience?.experiences || [];
    const safeExperiences = Array.isArray(experiences) ? experiences : [];

    const resetForm = () => {
        setFormData({
            position: '',
            companyName: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            description: '',
            skills: '',
            achievements: ''
        });
        setEditingIndex(null);
    };

    const handleAdd = async () => {
        const newExperience = {
            id: Date.now(),
            ...formData,
            startDate: new Date(formData.startDate + '-01'), // Convert YYYY-MM to Date
            endDate: formData.endDate ? new Date(formData.endDate + '-01') : null,
            skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
            achievements: formData.achievements ? formData.achievements.split(',').map(s => s.trim()).filter(s => s) : []
        };

        const updatedExperiences = [newExperience, ...safeExperiences];

        // Update local state
        setProfileData(prev => ({
            ...prev,
            experience: {
                ...prev.experience,
                experiences: updatedExperiences
            }
        }));

        // Save to backend
        try {
            await updateExperience({ experiences: updatedExperiences });
            toast.success('Experience added successfully!');
        } catch (error) {
            console.error('Error saving experience:', error);
            toast.error('Failed to save experience');
        }

        resetForm();
        setShowAddModal(false);
    };

    const handleEdit = (index) => {
        const exp = safeExperiences[index];
        setFormData({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate).toISOString().slice(0, 7) : '', // Convert Date to YYYY-MM
            endDate: exp.endDate ? new Date(exp.endDate).toISOString().slice(0, 7) : '',
            skills: (exp.skills || []).join(', '),
            achievements: (exp.achievements || []).join(', ')
        });
        setEditingIndex(index);
        setShowAddModal(true);
    };

    const handleUpdate = async () => {
        const updatedExperience = {
            ...safeExperiences[editingIndex],
            ...formData,
            startDate: new Date(formData.startDate + '-01'), // Convert YYYY-MM to Date
            endDate: formData.endDate ? new Date(formData.endDate + '-01') : null,
            skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : [],
            achievements: formData.achievements ? formData.achievements.split(',').map(s => s.trim()).filter(s => s) : []
        };
        const newExperiences = [...safeExperiences];
        newExperiences[editingIndex] = updatedExperience;

        // Update local state
        setProfileData(prev => ({
            ...prev,
            experience: {
                ...prev.experience,
                experiences: newExperiences
            }
        }));

        // Save to backend
        try {
            await updateExperience({ experiences: newExperiences });
            toast.success('Experience updated successfully!');
        } catch (error) {
            console.error('Error updating experience:', error);
            toast.error('Failed to update experience');
        }

        resetForm();
        setShowAddModal(false);
    };

    const handleDelete = async (index) => {
        const newExperiences = safeExperiences.filter((_, i) => i !== index);

        // Update local state
        setProfileData(prev => ({
            ...prev,
            experience: {
                ...prev.experience,
                experiences: newExperiences
            }
        }));

        // Save to backend
        try {
            await updateExperience({ experiences: newExperiences });
            toast.success('Experience deleted successfully!');
        } catch (error) {
            console.error('Error deleting experience:', error);
            toast.error('Failed to delete experience');
        }
    };

    const handleCancel = () => {
        resetForm();
        setShowAddModal(false);
    };

    return (
        <div className={styles.experienceSection}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Work Experience</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className={`${styles.button} ${styles.addButton}`}
                >
                    <Plus className="w-4 h-4" />
                    Add Experience
                </button>
            </div>

            {safeExperiences.length === 0 ? (
                <div className={styles.emptyState}>
                    <Briefcase className="w-12 h-12 text-gray-400" />
                    <p className={styles.emptyStateText}>No work experience added yet</p>
                    <p className={styles.emptyStateSubtext}>Add your first work experience to get started</p>
                </div>
            ) : (
                <div className={styles.experienceList}>
                    {safeExperiences.map((exp, index) => (
                        <div key={exp.id || index} className={styles.experienceItem}>
                            <div className={styles.experienceHeader}>
                                <div>
                                    <h4 className={styles.experienceTitle}>{exp.position}</h4>
                                    <p className={styles.experienceCompany}>{exp.companyName}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={styles.experienceDuration}>
                                        {formatDate(exp.startDate)} - {exp.isCurrent || !exp.endDate ? 'Present' : formatDate(exp.endDate)}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(index)}
                                            className={`${styles.button} ${styles.warningButton} text-xs px-3 py-1`}
                                        >
                                            <Edit className="w-3 h-3" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(index)}
                                            className={`${styles.button} ${styles.dangerButton} text-xs px-3 py-1`}
                                        >
                                            <X className="w-3 h-3" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {exp.description && (
                                <p className={styles.experienceDescription}>{exp.description}</p>
                            )}

                            {exp.skills && Array.isArray(exp.skills) && exp.skills.length > 0 && (
                                <div className={styles.skillsList}>
                                    <strong>Skills:</strong>
                                    {exp.skills.map((skill, skillIndex) => (
                                        <span key={skillIndex} className={styles.skillTag}>{skill}</span>
                                    ))}
                                </div>
                            )}

                            {exp.achievements && Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                                <div className={styles.achievementsList}>
                                    <strong>Achievements:</strong>
                                    <ul className={styles.achievementsUl}>
                                        {exp.achievements.map((achievement, achievementIndex) => (
                                            <li key={achievementIndex} className={styles.achievementItem}>{achievement}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {editingIndex !== null ? 'Edit Experience' : 'Add New Experience'}
                            </h3>
                            <button
                                onClick={handleCancel}
                                className={styles.closeButton}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Position *</label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Company *</label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Start Date *</label>
                                    <input
                                        type="month"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>End Date</label>
                                    <input
                                        type="month"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className={styles.input}
                                        disabled={formData.isCurrent}
                                        placeholder={formData.isCurrent ? "Current position" : "Leave empty if current position"}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={formData.isCurrent}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                isCurrent: e.target.checked,
                                                endDate: e.target.checked ? '' : formData.endDate
                                            });
                                        }}
                                        className={styles.checkbox}
                                    />
                                    <span>This is my current position</span>
                                </label>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Skills Used</label>
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    className={styles.input}
                                    placeholder="Enter skills separated by commas"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Key Achievements</label>
                                <input
                                    type="text"
                                    value={formData.achievements}
                                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                                    className={styles.input}
                                    placeholder="Enter achievements separated by commas"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Job Description</label>
                                <textarea
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={styles.textarea}
                                    placeholder="Describe your role, responsibilities, and achievements..."
                                />
                            </div>

                            <button
                                type="button"
                                onClick={editingIndex !== null ? handleUpdate : handleAdd}
                                disabled={isSaving}
                                className={`${styles.button} ${styles.successButton} w-full`}
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : (editingIndex !== null ? 'Update Experience' : 'Add Experience')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperienceSection;
