import React, { useState } from 'react';
import { Plus, Edit, Save, X, Briefcase, Calendar, MapPin } from 'lucide-react';
import { updateExperience } from '../../../services/profileService';
import toast from 'react-hot-toast';
import styles from './ExperienceSection.module.css';

// Utility function to format dates from YYYY-MM to MM-YYYY
const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    return `${month}-${year}`;
};

// Utility function to convert MM-YYYY to YYYY-MM for form inputs
const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const [month, year] = dateString.split('-');
    return `${year}-${month}`;
};

const ExperienceSection = ({ profileData, setProfileData }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
        skills: ''
    });

    const experiences = profileData.experience?.experiences || [];
    const safeExperiences = Array.isArray(experiences) ? experiences : [];

    const resetForm = () => {
        setFormData({
            position: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            description: '',
            skills: ''
        });
        setEditingIndex(null);
    };

    const handleAdd = async () => {
        const newExperience = {
            id: Date.now(),
            ...formData,
            startDate: formatDate(formData.startDate),
            endDate: formData.endDate ? formatDate(formData.endDate) : '',
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
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
            startDate: formatDateForInput(exp.startDate),
            endDate: formatDateForInput(exp.endDate),
            skills: (exp.skills || []).join(', ')
        });
        setEditingIndex(index);
        setShowAddModal(true);
    };

    const handleUpdate = async () => {
        const updatedExperience = {
            ...safeExperiences[editingIndex],
            ...formData,
            startDate: formatDate(formData.startDate),
            endDate: formData.endDate ? formatDate(formData.endDate) : '',
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
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
                                    <p className={styles.experienceCompany}>{exp.company}</p>
                                    {exp.location && (
                                        <p className={styles.experienceLocation}>
                                            <MapPin className="w-4 h-4" />
                                            {exp.location}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={styles.experienceDuration}>
                                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
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
                            <p className={styles.experienceDescription}>{exp.description}</p>
                            <div className={styles.skillsList}>
                                {(exp.skills || []).map((skill, skillIndex) => (
                                    <span key={skillIndex} className={styles.skillTag}>{skill}</span>
                                ))}
                            </div>
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
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className={styles.input}
                                    placeholder="City, Country"
                                />
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
                                        placeholder="Leave empty if current position"
                                    />
                                </div>
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
