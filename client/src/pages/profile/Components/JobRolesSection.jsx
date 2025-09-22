import React, { useState } from 'react';
import { Plus, Edit, Save, X, Briefcase } from 'lucide-react';
import { updateJobRoles } from '../../../services/profileService';
import toast from 'react-hot-toast';
import styles from './JobRolesSection.module.css';

const JobRolesSection = ({ profileData, setProfileData }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: ''
    });

    const jobRoles = profileData.jobRoles?.desiredJobRoles || [];
    const safeJobRoles = Array.isArray(jobRoles) ? jobRoles : [];

    const resetForm = () => {
        setFormData({
            title: ''
        });
        setEditingIndex(null);
    };

    const handleAdd = async () => {
        const newJobRole = {
            id: Date.now(),
            ...formData
        };

        const updatedJobRoles = [newJobRole, ...safeJobRoles];

        // Update local state
        setProfileData(prev => ({
            ...prev,
            jobRoles: {
                ...prev.jobRoles,
                desiredJobRoles: updatedJobRoles
            }
        }));

        // Save to backend
        try {
            await updateJobRoles({ desiredJobRoles: updatedJobRoles });
            toast.success('Job role added successfully!');
        } catch (error) {
            console.error('Error saving job role:', error);
            toast.error('Failed to save job role');
        }

        resetForm();
        setShowAddModal(false);
    };

    const handleEdit = (index) => {
        const jobRole = safeJobRoles[index];
        setFormData({
            title: typeof jobRole === 'string' ? jobRole : jobRole.title
        });
        setEditingIndex(index);
        setShowAddModal(true);
    };

    const handleUpdate = async () => {
        const updatedJobRole = {
            ...safeJobRoles[editingIndex],
            ...formData
        };
        const newJobRoles = [...safeJobRoles];
        newJobRoles[editingIndex] = updatedJobRole;

        // Update local state
        setProfileData(prev => ({
            ...prev,
            jobRoles: {
                ...prev.jobRoles,
                desiredJobRoles: newJobRoles
            }
        }));

        // Save to backend
        try {
            await updateJobRoles({ desiredJobRoles: newJobRoles });
            toast.success('Job role updated successfully!');
        } catch (error) {
            console.error('Error updating job role:', error);
            toast.error('Failed to update job role');
        }

        resetForm();
        setShowAddModal(false);
    };

    const handleDelete = async (index) => {
        const newJobRoles = safeJobRoles.filter((_, i) => i !== index);

        // Update local state
        setProfileData(prev => ({
            ...prev,
            jobRoles: {
                ...prev.jobRoles,
                desiredJobRoles: newJobRoles
            }
        }));

        // Save to backend
        try {
            await updateJobRoles({ desiredJobRoles: newJobRoles });
            toast.success('Job role deleted successfully!');
        } catch (error) {
            console.error('Error deleting job role:', error);
            toast.error('Failed to delete job role');
        }
    };

    const handleCancel = () => {
        resetForm();
        setShowAddModal(false);
    };

    return (
        <div className={styles.jobRolesSection}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Desired Job Roles</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className={`${styles.button} ${styles.addButton}`}
                >
                    <Plus className="w-4 h-4" />
                    Add Job Role
                </button>
            </div>

            {safeJobRoles.length === 0 ? (
                <div className={styles.emptyState}>
                    <Briefcase className="w-12 h-12 text-gray-400" />
                    <p className={styles.emptyStateText}>No desired job roles added yet</p>
                    <p className={styles.emptyStateSubtext}>Add your first desired job role to get started</p>
                </div>
            ) : (
                <div className={styles.jobRolesList}>
                    {safeJobRoles.map((jobRole, index) => (
                        <div key={jobRole.id || index} className={styles.jobRoleCard}>
                            <div className={styles.jobRoleContent}>
                                <div className={styles.jobRoleInfo}>
                                    <Briefcase className="w-5 h-5 text-blue-500" />
                                    <span className={styles.jobRoleTitle}>
                                        {typeof jobRole === 'string' ? jobRole : jobRole.title}
                                    </span>
                                </div>
                                <div className={styles.cardActions}>
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
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {editingIndex !== null ? 'Edit Job Role' : 'Add New Job Role'}
                            </h3>
                            <button
                                onClick={handleCancel}
                                className={styles.closeButton}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Job Role *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className={styles.input}
                                    placeholder="e.g., Senior Frontend Developer, Product Manager, Data Scientist"
                                    required
                                />
                            </div>

                            <button
                                type="button"
                                onClick={editingIndex !== null ? handleUpdate : handleAdd}
                                disabled={isSaving}
                                className={`${styles.button} ${styles.successButton} w-full`}
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : (editingIndex !== null ? 'Update Job Role' : 'Add Job Role')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobRolesSection;
