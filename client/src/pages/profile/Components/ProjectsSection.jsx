import React, { useState } from 'react';
import { Plus, Edit, Save, X, ExternalLink, Github, Calendar, Upload, Image as ImageIcon } from 'lucide-react';
import { updateProjects, uploadProjectImage } from '../../../services/profileService';
import toast from 'react-hot-toast';
import styles from './ProjectsSection.module.css';

// Utility function to format dates from Date object to MM-YYYY
const formatDate = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}-${year}`;
};

// Utility function to convert Date object to YYYY-MM for form inputs
const formatDateForInput = (date) => {
    if (!date) return '';
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
};

const ProjectsSection = ({ profileData, setProfileData }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        githubLink: '',
        liveUrl: '',
        startDate: '',
        endDate: '',
        skills: '',
        image: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const projects = profileData.projects?.projects || [];
    const safeProjects = Array.isArray(projects) ? projects : [];

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            githubLink: '',
            liveUrl: '',
            startDate: '',
            endDate: '',
            skills: '',
            image: ''
        });
        setImagePreview(null);
        setEditingIndex(null);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file');
            return;
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size must be less than 10MB');
            return;
        }

        setIsUploadingImage(true);
        setImagePreview(URL.createObjectURL(file));

        try {
            const formData = new FormData();
            formData.append('projectImage', file);

            const response = await uploadProjectImage(formData);
            setFormData(prev => ({ ...prev, image: response.imageUrl }));
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
            setImagePreview(null);
        } finally {
            setIsUploadingImage(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: '' }));
        setImagePreview(null);
    };

    const handleAdd = async () => {
        const newProject = {
            id: Date.now(),
            name: formData.name,
            details: [formData.description], // Convert description to details array
            githubLink: formData.githubLink,
            liveUrl: formData.liveUrl,
            startDate: new Date(formData.startDate + '-01'), // Convert to Date object
            endDate: formData.endDate ? new Date(formData.endDate + '-01') : null,
            skillsUsed: formData.skills.split(',').map(s => s.trim()).filter(s => s), // Map skills to skillsUsed
            image: formData.image
        };

        const updatedProjects = [newProject, ...safeProjects];

        // Update local state
        setProfileData(prev => ({
            ...prev,
            projects: {
                ...prev.projects,
                projects: updatedProjects
            }
        }));

        // Save to backend
        try {
            await updateProjects({ projects: updatedProjects });
            toast.success('Project added successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Failed to save project');
        }

        resetForm();
        setShowAddModal(false);
    };

    const handleEdit = (index) => {
        const project = safeProjects[index];
        setFormData({
            name: project.name,
            description: project.details ? project.details[0] : '', // Convert details array to description string
            githubLink: project.githubLink || '',
            liveUrl: project.liveUrl || '',
            startDate: project.startDate ? formatDateForInput(project.startDate) : '',
            endDate: project.endDate ? formatDateForInput(project.endDate) : '',
            skills: (project.skillsUsed || []).join(', '), // Convert skillsUsed array to comma-separated string
            image: project.image || ''
        });
        setImagePreview(project.image || null);
        setEditingIndex(index);
        setShowAddModal(true);
    };

    const handleUpdate = async () => {
        const updatedProject = {
            ...safeProjects[editingIndex],
            name: formData.name,
            details: [formData.description], // Convert description to details array
            githubLink: formData.githubLink,
            liveUrl: formData.liveUrl,
            startDate: new Date(formData.startDate + '-01'), // Convert to Date object
            endDate: formData.endDate ? new Date(formData.endDate + '-01') : null,
            skillsUsed: formData.skills.split(',').map(s => s.trim()).filter(s => s), // Map skills to skillsUsed
            image: formData.image
        };
        const newProjects = [...safeProjects];
        newProjects[editingIndex] = updatedProject;

        // Update local state
        setProfileData(prev => ({
            ...prev,
            projects: {
                ...prev.projects,
                projects: newProjects
            }
        }));

        // Save to backend
        try {
            await updateProjects({ projects: newProjects });
            toast.success('Project updated successfully!');
        } catch (error) {
            console.error('Error updating project:', error);
            toast.error('Failed to update project');
        }

        resetForm();
        setShowAddModal(false);
    };

    const handleDelete = async (index) => {
        const newProjects = safeProjects.filter((_, i) => i !== index);

        // Update local state
        setProfileData(prev => ({
            ...prev,
            projects: {
                ...prev.projects,
                projects: newProjects
            }
        }));

        // Save to backend
        try {
            await updateProjects({ projects: newProjects });
            toast.success('Project deleted successfully!');
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        }
    };

    const handleCancel = () => {
        resetForm();
        setShowAddModal(false);
    };

    return (
        <div className={styles.projectsSection}>
            <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Projects</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className={`${styles.button} ${styles.addButton}`}
                >
                    <Plus className="w-4 h-4" />
                    Add Project
                </button>
            </div>

            {safeProjects.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>💻</div>
                    <p className={styles.emptyStateText}>No projects added yet</p>
                    <p className={styles.emptyStateSubtext}>Add your first project to showcase your work</p>
                </div>
            ) : (
                <div className={styles.projectGrid}>
                    {safeProjects.map((project, index) => (
                        <div key={project.id || index} className={styles.projectCard}>
                            <img
                                src={project.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyNSIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxODAiIHk9IjEwNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM2QjcyODAiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJTNi40OCAyMiAxMiAyMlMyMiAxNy41MiAyMiAxMlMxNy41MiAyIDEyIDJaTTEzIDE3SDExVjE1SDEzVjE3Wk0xMyAxM0gxMVY3SDEzVjEzWiIvPgo8L3N2Zz4KPC9zdmc+'}
                                alt={project.name}
                                className={styles.projectImage}
                                onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjEyNSIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSIxODAiIHk9IjEwNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM2QjcyODAiPgo8cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJTNi40OCAyMiAxMiAyMlMyMiAxNy41MiAyMiAxMlMxNy41MiAyIDEyIDJaTTEzIDE3SDExVjE1SDEzVjE3Wk0xMyAxM0gxMVY3SDEzVjEzWiIvPgo8L3N2Zz4KPC9zdmc+' }}
                            />

                            <div className={styles.projectContent}>
                                <h4 className={styles.projectTitle}>{project.name}</h4>
                                <p className={styles.projectDescription}>{project.details ? project.details[0] : ''}</p>

                                <div className={styles.projectLinks}>
                                    {project.githubLink && (
                                        <a
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.projectLink}
                                        >
                                            <Github className="w-4 h-4" />
                                            GitHub
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.projectLink}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Live Demo
                                        </a>
                                    )}
                                </div>

                                <div className={styles.projectDuration}>
                                    {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                                </div>

                                <div className={styles.skillsList}>
                                    {(project.skillsUsed || []).map((skill, skillIndex) => (
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
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {editingIndex !== null ? 'Edit Project' : 'Add New Project'}
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
                                <label className={styles.label}>Project Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Description *</label>
                                <textarea
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={styles.textarea}
                                    placeholder="Describe your project..."
                                    required
                                />
                            </div>


                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>GitHub Repository</label>
                                    <input
                                        type="url"
                                        value={formData.githubLink}
                                        onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                                        className={styles.input}
                                        placeholder="https://github.com/username/repo"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Live Demo URL</label>
                                    <input
                                        type="url"
                                        value={formData.liveUrl}
                                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                        className={styles.input}
                                        placeholder="https://your-project.com"
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Start Date</label>
                                    <input
                                        type="month"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>End Date</label>
                                    <input
                                        type="month"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className={styles.input}
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

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Project Image</label>

                                {/* Image Preview */}
                                {(imagePreview || formData.image) && (
                                    <div className={styles.imagePreviewContainer}>
                                        <img
                                            src={imagePreview || formData.image}
                                            alt="Project preview"
                                            className={styles.imagePreview}
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className={styles.removeImageButton}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className={styles.uploadContainer}>
                                    <input
                                        type="file"
                                        id="project-image-upload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className={styles.fileInput}
                                        disabled={isUploadingImage}
                                    />
                                    <label
                                        htmlFor="project-image-upload"
                                        className={`${styles.uploadButton} ${isUploadingImage ? styles.uploading : ''}`}
                                    >
                                        {isUploadingImage ? (
                                            <>
                                                <div className={styles.spinner}></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                {imagePreview || formData.image ? 'Change Image' : 'Upload Image'}
                                            </>
                                        )}
                                    </label>
                                    <p className={styles.uploadHint}>
                                        Recommended: 800x600px, max 10MB. Supports JPG, PNG, GIF, WebP
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={editingIndex !== null ? handleUpdate : handleAdd}
                                disabled={isSaving}
                                className={`${styles.button} ${styles.successButton} w-full`}
                            >
                                <Save className="w-4 h-4" />
                                {isSaving ? 'Saving...' : (editingIndex !== null ? 'Update Project' : 'Add Project')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsSection;
