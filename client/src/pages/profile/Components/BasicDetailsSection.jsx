import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Linkedin,
    Github,
    Globe,
    Camera,
    Save,
    X,
    Edit
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from '../CSS/BasicDetailsSection.module.css';

const BasicDetailsSection = ({ data, isEditing, onDataUpdate, onEditToggle }) => {
    const [formData, setFormData] = useState({
        firstName: data?.firstName || '',
        lastName: data?.lastName || '',
        email: data?.email || '',
        phone: data?.phone || '',
        linkedin: data?.linkedin || '',
        github: data?.github || '',
        twitter: data?.twitter || '',
        website: data?.website || '',
        portfolio: data?.portfolio || '',
        bio: data?.bio || '',
        profilePicture: data?.profilePicture || ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('profilePicture', file);

            const response = await axios.post('/api/profile/upload-profile-picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setFormData(prev => ({
                ...prev,
                profilePicture: response.data.imageUrl
            }));

            toast.success('Profile picture updated successfully!');
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload profile picture');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await axios.post('/api/profile/basic-details', formData);
            onDataUpdate(formData);
            onEditToggle();
            toast.success('Basic details updated successfully!');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save basic details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: data?.firstName || '',
            lastName: data?.lastName || '',
            email: data?.email || '',
            phone: data?.phone || '',
            linkedin: data?.linkedin || '',
            github: data?.github || '',
            twitter: data?.twitter || '',
            website: data?.website || '',
            portfolio: data?.portfolio || '',
            bio: data?.bio || '',
            profilePicture: data?.profilePicture || ''
        });
        onEditToggle();
    };

    if (!data && !isEditing) {
        return (
            <div className={styles.emptyState}>
                <User size={48} className={styles.emptyIcon} />
                <h3>No Basic Details</h3>
                <p>Add your basic information to get started</p>
                <button onClick={onEditToggle} className={styles.addButton}>
                    <Edit size={16} />
                    Add Basic Details
                </button>
            </div>
        );
    }

    return (
        <div className={styles.basicDetailsSection}>
            {isEditing ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.editForm}
                >
                    <div className={styles.formHeader}>
                        <h3>Edit Basic Details</h3>
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
                        {/* Profile Picture */}
                        <div className={styles.profilePictureSection}>
                            <div className={styles.profilePictureContainer}>
                                <img
                                    src={formData.profilePicture || '/default-avatar.png'}
                                    alt="Profile"
                                    className={styles.profilePicture}
                                />
                                <label className={styles.uploadButton}>
                                    <Camera size={16} />
                                    Change Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className={styles.fileInput}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Phone *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className={styles.sectionTitle}>Social Links</div>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <Linkedin size={16} />
                                    LinkedIn *
                                </label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <Github size={16} />
                                    GitHub *
                                </label>
                                <input
                                    type="url"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="https://github.com/yourusername"
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <Globe size={16} />
                                    Twitter
                                </label>
                                <input
                                    type="url"
                                    name="twitter"
                                    value={formData.twitter}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="https://twitter.com/yourusername"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <Globe size={16} />
                                    Website
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    <Globe size={16} />
                                    Portfolio
                                </label>
                                <input
                                    type="url"
                                    name="portfolio"
                                    value={formData.portfolio}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder="https://yourportfolio.com"
                                />
                            </div>
                        </div>

                        {/* Bio */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Professional Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                className={styles.textarea}
                                placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                                rows={4}
                            />
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.viewMode}
                >
                    <div className={styles.profileHeader}>
                        <div className={styles.profilePictureContainer}>
                            <img
                                src={data?.profilePicture || '/default-avatar.png'}
                                alt="Profile"
                                className={styles.profilePicture}
                            />
                        </div>
                        <div className={styles.profileInfo}>
                            <h3 className={styles.profileName}>
                                {data?.firstName} {data?.lastName}
                            </h3>
                            <p className={styles.profileEmail}>{data?.email}</p>
                            <p className={styles.profilePhone}>{data?.phone}</p>
                        </div>
                    </div>

                    {data?.bio && (
                        <div className={styles.bioSection}>
                            <h4>About</h4>
                            <p className={styles.bio}>{data.bio}</p>
                        </div>
                    )}

                    <div className={styles.socialLinks}>
                        <h4>Social Links</h4>
                        <div className={styles.linksGrid}>
                            {data?.linkedin && (
                                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Linkedin size={16} />
                                    LinkedIn
                                </a>
                            )}
                            {data?.github && (
                                <a href={data.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Github size={16} />
                                    GitHub
                                </a>
                            )}
                            {data?.twitter && (
                                <a href={data.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Globe size={16} />
                                    Twitter
                                </a>
                            )}
                            {data?.website && (
                                <a href={data.website} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Globe size={16} />
                                    Website
                                </a>
                            )}
                            {data?.portfolio && (
                                <a href={data.portfolio} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Globe size={16} />
                                    Portfolio
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default BasicDetailsSection;

