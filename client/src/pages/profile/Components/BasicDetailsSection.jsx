import React, { useState, useRef } from 'react';
import { User, Mail, Phone, Linkedin, Github, Edit, Save, X, Camera, Upload } from 'lucide-react';
import { saveBasicDetails, updateBasicDetails, deleteProfilePicture } from '../../../services/profileService';
import toast from 'react-hot-toast';
import styles from './BasicDetailsSection.module.css';

const BasicDetailsSection = ({ profileData, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    linkedin: '',
    github: '',
    profilePicture: ''
  });

  const safeBasicDetails = profileData.basicDetails || {};

  const handleEdit = () => {
    setFormData({
      firstName: safeBasicDetails.firstName || '',
      lastName: safeBasicDetails.lastName || '',
      email: safeBasicDetails.email || '',
      phone: safeBasicDetails.phone || '',
      bio: safeBasicDetails.bio || '',
      linkedin: safeBasicDetails.linkedin || '',
      github: safeBasicDetails.github || '',
      profilePicture: safeBasicDetails.profilePicture || ''
    });
    setPreviewImage(null);
    setIsEditing(true);
  };

  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setIsUploadingImage(true);
      
      try {
        // Compress the image before converting to base64
        const compressedImage = await compressImage(file, 800, 0.8);
        
        setPreviewImage(compressedImage);
        setFormData(prev => ({
          ...prev,
          profilePicture: compressedImage
        }));
        
        toast.success('Image uploaded and compressed successfully!');
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Error processing image. Please try again.');
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({
      ...prev,
      profilePicture: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const deleteProfileImage = async () => {
    if (window.confirm('Are you sure you want to remove your profile image?')) {
      try {
        // Use the dedicated delete endpoint
        const response = await deleteProfilePicture();
        
        setProfileData(prev => ({
          ...prev,
          basicDetails: response.data
        }));
        
        toast.success('Profile image removed successfully!');
      } catch (error) {
        console.error('Error removing profile image:', error);
        
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Failed to remove profile image');
        }
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = { ...safeBasicDetails, ...formData };
      
      if (safeBasicDetails._id) {
        await updateBasicDetails(updatedData);
      } else {
        await saveBasicDetails(updatedData);
      }
      
      setProfileData(prev => ({
        ...prev,
        basicDetails: updatedData
      }));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // Handle specific error types
      if (error.response?.status === 413) {
        toast.error('Image too large. Please choose a smaller image.');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to save profile');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      linkedin: '',
      github: '',
      profilePicture: ''
    });
  };

  return (
    <div className={styles.basicDetailsSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Basic Details</h3>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className={`${styles.button} ${styles.editButton}`}
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form className={styles.form}>
          {/* Profile Image Upload Section */}
          <div className={styles.imageUploadSection}>
            <div className={styles.imageUploadContainer}>
              <div 
                className={styles.imageUploadArea}
                onClick={handleImageClick}
              >
                {previewImage || formData.profilePicture ? (
                  <div className={styles.imagePreview}>
                    <img 
                      src={previewImage || formData.profilePicture} 
                      alt="Profile Preview" 
                      className={styles.previewImage}
                    />
                    <div className={styles.imageOverlay}>
                      <Camera className="w-6 h-6" />
                      <span>Change Photo</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <Camera className="w-12 h-12" />
                    <p>Click to upload profile photo</p>
                    <span>JPG, PNG up to 5MB</span>
                  </div>
                )}
                {isUploadingImage && (
                  <div className={styles.uploadingOverlay}>
                    <div className={styles.spinner}></div>
                    <span>Uploading...</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={styles.hiddenFileInput}
              />
              {(previewImage || formData.profilePicture) && (
                <button
                  type="button"
                  onClick={removeImage}
                  className={styles.removeImageButton}
                >
                  <X className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className={styles.textarea}
              rows="3"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>LinkedIn</label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className={styles.input}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>GitHub</label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className={styles.input}
                placeholder="https://github.com/username"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleCancel}
              className={`${styles.button} ${styles.cancelButton}`}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`${styles.button} ${styles.saveButton}`}
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.profileDisplay}>
          <div className={styles.profileImageContainer}>
            <img
              src={safeBasicDetails.profilePicture || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjcwIiByPSIzMCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNTAgMTQwQzUwIDEyNS42NDMgNjEuNjQzIDEyMCA3NSAxMjBIMTI1QzEzOC4zNTcgMTIwIDE1MCAxMjUuNjQzIDE1MCAxNDBWMjAwSDUwVjE0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'}
              alt="Profile"
              className={styles.profilePicture}
              onError={(e) => { e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjcwIiByPSIzMCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNTAgMTQwQzUwIDEyNS42NDMgNjEuNjQzIDEyMCA3NSAxMjBIMTI1QzEzOC4zNTcgMTIwIDE1MCAxMjUuNjQzIDE1MCAxNDBWMjAwSDUwVjE0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+' }}
            />
            {safeBasicDetails.profilePicture && (
              <button
                onClick={deleteProfileImage}
                className={styles.deleteImageButton}
                title="Remove profile image"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h3 className={styles.profileName}>
              {safeBasicDetails.firstName || 'First'} {safeBasicDetails.lastName || 'Last'}
            </h3>
            <p className={styles.profileBio}>
              {safeBasicDetails.bio || 'No bio available. Click Edit to add your professional bio.'}
            </p>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.contactInfo}>
            {safeBasicDetails.email && (
              <div className={styles.contactItem}>
                <Mail className="w-4 h-4" />
                <span>{safeBasicDetails.email}</span>
              </div>
            )}
            {safeBasicDetails.phone && (
              <div className={styles.contactItem}>
                <Phone className="w-4 h-4" />
                <span>{safeBasicDetails.phone}</span>
              </div>
            )}
          </div>

          {(safeBasicDetails.linkedin || safeBasicDetails.github) && (
            <div className={styles.socialSection}>
              <h4 className={styles.sectionLabel}>Social Profiles</h4>
              <div className={styles.socialLinks}>
                {safeBasicDetails.linkedin && (
                  <a
                    href={safeBasicDetails.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {safeBasicDetails.github && (
                  <a
                    href={safeBasicDetails.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                    title="GitHub Profile"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BasicDetailsSection;
