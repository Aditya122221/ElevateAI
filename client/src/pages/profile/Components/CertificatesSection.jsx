import React, { useState } from 'react';
import { Plus, Edit, Save, X, Award, Calendar } from 'lucide-react';
import { updateCertifications } from '../../../services/profileService';
import toast from 'react-hot-toast';
import styles from './CertificatesSection.module.css';

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

const CertificatesSection = ({ profileData, setProfileData }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        platform: '',
        skills: '',
        startDate: '',
        endDate: ''
    });

    const certificates = profileData.certifications?.certifications || [];
    const safeCertificates = Array.isArray(certificates) ? certificates : [];

    const resetForm = () => {
        setFormData({
            name: '',
            platform: '',
            skills: '',
            startDate: '',
            endDate: ''
        });
        setEditingIndex(null);
    };

    const handleAdd = async () => {
        const newCertificate = {
            id: Date.now(),
            ...formData,
            startDate: formatDate(formData.startDate),
            endDate: formData.endDate ? formatDate(formData.endDate) : '',
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
        };

        const updatedCertificates = [newCertificate, ...safeCertificates];

        // Update local state
        setProfileData(prev => ({
            ...prev,
            certifications: {
                ...prev.certifications,
                certifications: updatedCertificates
            }
        }));

        // Save to backend
        try {
            await updateCertifications({ certifications: updatedCertificates });
            toast.success('Certificate added successfully!');
        } catch (error) {
            console.error('Error saving certificate:', error);
            toast.error('Failed to save certificate');
        }

        resetForm();
        setShowAddModal(false);
    };

    const handleEdit = (index) => {
        const certificate = safeCertificates[index];
        setFormData({
            ...certificate,
            startDate: formatDateForInput(certificate.startDate),
            endDate: formatDateForInput(certificate.endDate),
            skills: (certificate.skills || []).join(', ')
        });
        setEditingIndex(index);
        setShowAddModal(true);
    };

    const handleUpdate = async () => {
        const updatedCertificate = {
            ...safeCertificates[editingIndex],
            ...formData,
            startDate: formatDate(formData.startDate),
            endDate: formData.endDate ? formatDate(formData.endDate) : '',
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
        };
        const newCertificates = [...safeCertificates];
        newCertificates[editingIndex] = updatedCertificate;

        // Update local state
        setProfileData(prev => ({
            ...prev,
            certifications: {
                ...prev.certifications,
                certifications: newCertificates
            }
        }));

        // Save to backend
        try {
            await updateCertifications({ certifications: newCertificates });
            toast.success('Certificate updated successfully!');
        } catch (error) {
            console.error('Error updating certificate:', error);
            toast.error('Failed to update certificate');
        }

        resetForm();
        setShowAddModal(false);
    };

    const handleDelete = async (index) => {
        const newCertificates = safeCertificates.filter((_, i) => i !== index);

        // Update local state
        setProfileData(prev => ({
            ...prev,
            certifications: {
                ...prev.certifications,
                certifications: newCertificates
            }
        }));

        // Save to backend
        try {
            await updateCertifications({ certifications: newCertificates });
            toast.success('Certificate deleted successfully!');
        } catch (error) {
            console.error('Error deleting certificate:', error);
            toast.error('Failed to delete certificate');
        }
    };

    const handleCancel = () => {
        resetForm();
        setShowAddModal(false);
    };

    return (
        <div className={styles.certificatesSection}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Certificates & Certifications</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className={`${styles.button} ${styles.addButton}`}
                >
                    <Plus className="w-4 h-4" />
                    Add Certificate
                </button>
            </div>

            {safeCertificates.length === 0 ? (
                <div className={styles.emptyState}>
                    <Award className="w-12 h-12 text-gray-400" />
                    <p className={styles.emptyStateText}>No certificates added yet</p>
                    <p className={styles.emptyStateSubtext}>Add your first certificate to showcase your achievements</p>
                </div>
            ) : (
                <div className={styles.certificateGrid}>
                    {safeCertificates.map((cert, index) => (
                        <div key={cert.id || index} className={styles.certificateCard}>
                            <div className={styles.certificateHeader}>
                                <Award className="w-8 h-8 text-yellow-500" />
                                <div className={styles.certificateInfo}>
                                    <h4 className={styles.certificateTitle}>{cert.name}</h4>
                                    <p className={styles.certificatePlatform}>{cert.platform}</p>
                                </div>
                            </div>

                            <div className={styles.certificateDuration}>
                                Issued: {formatDate(cert.startDate)} | Expires: {cert.endDate ? formatDate(cert.endDate) : 'Lifetime'}
                            </div>

                            <div className={styles.skillsList}>
                                {(cert.skills || []).map((skill, skillIndex) => (
                                    <span key={skillIndex} className={styles.skillTag}>{skill}</span>
                                ))}
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
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {editingIndex !== null ? 'Edit Certificate' : 'Add New Certificate'}
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
                                <label className={styles.label}>Certificate Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={styles.input}
                                    placeholder="e.g., AWS Certified Solutions Architect"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Issuing Organization *</label>
                                <input
                                    type="text"
                                    value={formData.platform}
                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                    className={styles.input}
                                    placeholder="e.g., Amazon Web Services"
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Issue Date</label>
                                    <input
                                        type="month"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Expiration Date</label>
                                    <input
                                        type="month"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className={styles.input}
                                        placeholder="Enter 'Lifetime' if never expires"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Skills & Technologies</label>
                                <input
                                    type="text"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    className={styles.input}
                                    placeholder="Enter skills separated by commas"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={editingIndex !== null ? handleUpdate : handleAdd}
                                disabled={isSaving}
                                className={`${styles.button} ${styles.successButton} w-full`}
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : (editingIndex !== null ? 'Update Certificate' : 'Add Certificate')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificatesSection;
