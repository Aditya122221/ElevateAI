import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    Upload,
    User,
    Mail,
    Phone,
    Linkedin,
    Github,
    Twitter,
    Globe,
    FileText,
    Check,
    X,
    Star,
    Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import styles from '../ProfileCreationPage.module.css';

const BasicDetailsStep = ({
    register,
    errors,
    watch,
    setValue,
    handleImageUpload
}) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [focusedField, setFocusedField] = useState('');

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Upload to server
            try {
                const imageUrl = await handleImageUpload(file, 'profilePicture');
                setValue('basicDetails.profilePicture', imageUrl);
                toast.success('Profile picture uploaded successfully!');
            } catch (error) {
                toast.error('Failed to upload image');
                setImagePreview(null);
            }
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.enhancedStepContent}
        >
            {/* Header Section */}
            <div className={styles.enhancedSectionHeader}>
                <div className={styles.headerIcon}>
                    <Sparkles size={24} />
                </div>
                <div className={styles.headerText}>
                    <h3 className={styles.enhancedSectionTitle}>Basic Information</h3>
                    <p className={styles.enhancedSectionSubtitle}>
                        Tell us about yourself - this information helps us create your professional profile
                    </p>
                </div>
            </div>

            {/* Profile Picture Section */}
            <div className={styles.profilePictureSection}>
                <label className={styles.profilePictureLabel}>
                    <div className={styles.profilePictureContainer}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.hiddenFileInput}
                        />

                        {imagePreview || watch('basicDetails.profilePicture') ? (
                            <div className={styles.profileImagePreview}>
                                <img
                                    src={imagePreview || watch('basicDetails.profilePicture')}
                                    alt="Profile preview"
                                />
                                <div className={styles.imageOverlay}>
                                    <Camera size={20} />
                                    <span>Change Photo</span>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.profilePicturePlaceholder}>
                                <div className={styles.uploadIcon}>
                                    <Upload size={32} />
                                </div>
                                <div className={styles.uploadText}>
                                    <h4>Upload Profile Picture</h4>
                                    <p>Click to browse or drag and drop</p>
                                    <span className={styles.fileHint}>PNG, JPG up to 5MB</span>
                                </div>
                            </div>
                        )}
                    </div>
                </label>
            </div>

            {/* Personal Information */}
            <div className={styles.formSection}>
                <div className={styles.sectionTitle}>
                    <User size={20} />
                    <span>Personal Information</span>
                </div>

                <div className={styles.enhancedFormGrid}>
                    <div className={styles.enhancedFormField}>
                        <label className={styles.enhancedFormLabel}>
                            <div className={styles.labelContent}>
                                <User size={16} className={styles.labelIcon} />
                                <span className={styles.labelText}>First Name</span>
                                <span className={styles.requiredStar}>*</span>
                            </div>
                            <span className={styles.fieldDescription}>Your given name</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register('basicDetails.firstName', { required: 'First name is required' })}
                                type="text"
                                className={styles.enhancedFormInput}
                                placeholder="Enter your first name"
                                onFocus={() => setFocusedField('firstName')}
                                onBlur={() => setFocusedField('')}
                            />
                            {watch('basicDetails.firstName') && !errors.basicDetails?.firstName && (
                                <div className={styles.validationIcon}>
                                    <Check size={16} />
                                </div>
                            )}
                            {errors.basicDetails?.firstName && (
                                <div className={styles.errorIcon}>
                                    <X size={16} />
                                </div>
                            )}
                        </div>
                        {errors.basicDetails?.firstName && (
                            <div className={styles.enhancedErrorText}>
                                <X size={14} />
                                <span>{errors.basicDetails.firstName.message}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.enhancedFormField}>
                        <label className={styles.enhancedFormLabel}>
                            <div className={styles.labelContent}>
                                <User size={16} className={styles.labelIcon} />
                                <span className={styles.labelText}>Last Name</span>
                                <span className={styles.requiredStar}>*</span>
                            </div>
                            <span className={styles.fieldDescription}>Your family name</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register('basicDetails.lastName', { required: 'Last name is required' })}
                                type="text"
                                className={styles.enhancedFormInput}
                                placeholder="Enter your last name"
                                onFocus={() => setFocusedField('lastName')}
                                onBlur={() => setFocusedField('')}
                            />
                            {watch('basicDetails.lastName') && !errors.basicDetails?.lastName && (
                                <div className={styles.validationIcon}>
                                    <Check size={16} />
                                </div>
                            )}
                            {errors.basicDetails?.lastName && (
                                <div className={styles.errorIcon}>
                                    <X size={16} />
                                </div>
                            )}
                        </div>
                        {errors.basicDetails?.lastName && (
                            <div className={styles.enhancedErrorText}>
                                <X size={14} />
                                <span>{errors.basicDetails.lastName.message}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.enhancedFormField}>
                    <label className={styles.enhancedFormLabel}>
                        <div className={styles.labelContent}>
                            <Mail size={16} className={styles.labelIcon} />
                            <span className={styles.labelText}>Email Address</span>
                            <span className={styles.requiredStar}>*</span>
                        </div>
                        <span className={styles.fieldDescription}>We'll use this for important updates</span>
                    </label>
                    <div className={styles.inputWrapper}>
                        <input
                            {...register('basicDetails.email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            type="email"
                            className={styles.enhancedFormInput}
                            placeholder="your.email@example.com"
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField('')}
                        />
                        {watch('basicDetails.email') && !errors.basicDetails?.email && (
                            <div className={styles.validationIcon}>
                                <Check size={16} />
                            </div>
                        )}
                        {errors.basicDetails?.email && (
                            <div className={styles.errorIcon}>
                                <X size={16} />
                            </div>
                        )}
                    </div>
                    {errors.basicDetails?.email && (
                        <div className={styles.enhancedErrorText}>
                            <X size={14} />
                            <span>{errors.basicDetails.email.message}</span>
                        </div>
                    )}
                </div>

                <div className={styles.enhancedFormField}>
                    <label className={styles.enhancedFormLabel}>
                        <div className={styles.labelContent}>
                            <Phone size={16} className={styles.labelIcon} />
                            <span className={styles.labelText}>Phone Number</span>
                            <span className={styles.requiredStar}>*</span>
                        </div>
                        <span className={styles.fieldDescription}>Your contact number</span>
                    </label>
                    <div className={styles.inputWrapper}>
                        <input
                            {...register('basicDetails.phone', { required: 'Phone number is required' })}
                            type="tel"
                            className={styles.enhancedFormInput}
                            placeholder="+1 (555) 123-4567"
                            onFocus={() => setFocusedField('phone')}
                            onBlur={() => setFocusedField('')}
                        />
                        {watch('basicDetails.phone') && !errors.basicDetails?.phone && (
                            <div className={styles.validationIcon}>
                                <Check size={16} />
                            </div>
                        )}
                        {errors.basicDetails?.phone && (
                            <div className={styles.errorIcon}>
                                <X size={16} />
                            </div>
                        )}
                    </div>
                    {errors.basicDetails?.phone && (
                        <div className={styles.enhancedErrorText}>
                            <X size={14} />
                            <span>{errors.basicDetails.phone.message}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Professional Links */}
            <div className={styles.formSection}>
                <div className={styles.sectionTitle}>
                    <Globe size={20} />
                    <span>Professional Links</span>
                </div>

                <div className={styles.enhancedFormGrid}>
                    <div className={styles.enhancedFormField}>
                        <label className={styles.enhancedFormLabel}>
                            <div className={styles.labelContent}>
                                <Linkedin size={16} className={styles.labelIcon} />
                                <span className={styles.labelText}>LinkedIn Profile</span>
                                <span className={styles.requiredStar}>*</span>
                            </div>
                            <span className={styles.fieldDescription}>Your professional network</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register('basicDetails.linkedin', {
                                    required: 'LinkedIn profile is required',
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: 'Please enter a valid URL starting with http:// or https://'
                                    }
                                })}
                                type="url"
                                className={styles.enhancedFormInput}
                                placeholder="https://linkedin.com/in/yourprofile"
                                onFocus={() => setFocusedField('linkedin')}
                                onBlur={() => setFocusedField('')}
                            />
                            {watch('basicDetails.linkedin') && !errors.basicDetails?.linkedin && (
                                <div className={styles.validationIcon}>
                                    <Check size={16} />
                                </div>
                            )}
                            {errors.basicDetails?.linkedin && (
                                <div className={styles.errorIcon}>
                                    <X size={16} />
                                </div>
                            )}
                        </div>
                        {errors.basicDetails?.linkedin && (
                            <div className={styles.enhancedErrorText}>
                                <X size={14} />
                                <span>{errors.basicDetails.linkedin.message}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.enhancedFormField}>
                        <label className={styles.enhancedFormLabel}>
                            <div className={styles.labelContent}>
                                <Github size={16} className={styles.labelIcon} />
                                <span className={styles.labelText}>GitHub Profile</span>
                                <span className={styles.requiredStar}>*</span>
                            </div>
                            <span className={styles.fieldDescription}>Showcase your code</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register('basicDetails.github', {
                                    required: 'GitHub profile is required',
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: 'Please enter a valid URL starting with http:// or https://'
                                    }
                                })}
                                type="url"
                                className={styles.enhancedFormInput}
                                placeholder="https://github.com/yourusername"
                                onFocus={() => setFocusedField('github')}
                                onBlur={() => setFocusedField('')}
                            />
                            {watch('basicDetails.github') && !errors.basicDetails?.github && (
                                <div className={styles.validationIcon}>
                                    <Check size={16} />
                                </div>
                            )}
                            {errors.basicDetails?.github && (
                                <div className={styles.errorIcon}>
                                    <X size={16} />
                                </div>
                            )}
                        </div>
                        {errors.basicDetails?.github && (
                            <div className={styles.enhancedErrorText}>
                                <X size={14} />
                                <span>{errors.basicDetails.github.message}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.enhancedFormGrid}>
                    <div className={styles.enhancedFormField}>
                        <label className={styles.enhancedFormLabel}>
                            <div className={styles.labelContent}>
                                <Twitter size={16} className={styles.labelIcon} />
                                <span className={styles.labelText}>Twitter</span>
                            </div>
                            <span className={styles.fieldDescription}>Optional - your thoughts and updates</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register('basicDetails.twitter', {
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: 'Please enter a valid URL starting with http:// or https://'
                                    }
                                })}
                                type="url"
                                className={styles.enhancedFormInput}
                                placeholder="https://twitter.com/yourusername"
                                onFocus={() => setFocusedField('twitter')}
                                onBlur={() => setFocusedField('')}
                            />
                            {watch('basicDetails.twitter') && !errors.basicDetails?.twitter && (
                                <div className={styles.validationIcon}>
                                    <Check size={16} />
                                </div>
                            )}
                            {errors.basicDetails?.twitter && (
                                <div className={styles.errorIcon}>
                                    <X size={16} />
                                </div>
                            )}
                        </div>
                        {errors.basicDetails?.twitter && (
                            <div className={styles.enhancedErrorText}>
                                <X size={14} />
                                <span>{errors.basicDetails.twitter.message}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.enhancedFormField}>
                        <label className={styles.enhancedFormLabel}>
                            <div className={styles.labelContent}>
                                <Globe size={16} className={styles.labelIcon} />
                                <span className={styles.labelText}>Website</span>
                            </div>
                            <span className={styles.fieldDescription}>Optional - your personal domain</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register('basicDetails.website', {
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: 'Please enter a valid URL starting with http:// or https://'
                                    }
                                })}
                                type="url"
                                className={styles.enhancedFormInput}
                                placeholder="https://yourwebsite.com"
                                onFocus={() => setFocusedField('website')}
                                onBlur={() => setFocusedField('')}
                            />
                            {watch('basicDetails.website') && !errors.basicDetails?.website && (
                                <div className={styles.validationIcon}>
                                    <Check size={16} />
                                </div>
                            )}
                            {errors.basicDetails?.website && (
                                <div className={styles.errorIcon}>
                                    <X size={16} />
                                </div>
                            )}
                        </div>
                        {errors.basicDetails?.website && (
                            <div className={styles.enhancedErrorText}>
                                <X size={14} />
                                <span>{errors.basicDetails.website.message}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.enhancedFormField}>
                    <label className={styles.enhancedFormLabel}>
                        <div className={styles.labelContent}>
                            <Star size={16} className={styles.labelIcon} />
                            <span className={styles.labelText}>Portfolio</span>
                        </div>
                        <span className={styles.fieldDescription}>Optional - showcase your best work</span>
                    </label>
                    <div className={styles.inputWrapper}>
                        <input
                            {...register('basicDetails.portfolio', {
                                pattern: {
                                    value: /^https?:\/\/.+/,
                                    message: 'Please enter a valid URL starting with http:// or https://'
                                }
                            })}
                            type="url"
                            className={styles.enhancedFormInput}
                            placeholder="https://yourportfolio.com"
                            onFocus={() => setFocusedField('portfolio')}
                            onBlur={() => setFocusedField('')}
                        />
                        {watch('basicDetails.portfolio') && !errors.basicDetails?.portfolio && (
                            <div className={styles.validationIcon}>
                                <Check size={16} />
                            </div>
                        )}
                        {errors.basicDetails?.portfolio && (
                            <div className={styles.errorIcon}>
                                <X size={16} />
                            </div>
                        )}
                    </div>
                    {errors.basicDetails?.portfolio && (
                        <div className={styles.enhancedErrorText}>
                            <X size={14} />
                            <span>{errors.basicDetails.portfolio.message}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bio Section */}
            <div className={styles.formSection}>
                <div className={styles.sectionTitle}>
                    <FileText size={20} />
                    <span>About You</span>
                </div>

                <div className={styles.enhancedFormField}>
                    <label className={styles.enhancedFormLabel}>
                        <div className={styles.labelContent}>
                            <FileText size={16} className={styles.labelIcon} />
                            <span className={styles.labelText}>Bio</span>
                        </div>
                        <span className={styles.fieldDescription}>A brief introduction about yourself</span>
                    </label>
                    <div className={styles.inputWrapper}>
                        <textarea
                            {...register('basicDetails.bio')}
                            className={styles.enhancedFormInput}
                            placeholder="Tell us about yourself, your passions, and what drives you professionally..."
                            rows={4}
                            onFocus={() => setFocusedField('bio')}
                            onBlur={() => setFocusedField('')}
                        />
                        {watch('basicDetails.bio') && !errors.basicDetails?.bio && (
                            <div className={styles.validationIcon}>
                                <Check size={16} />
                            </div>
                        )}
                        {errors.basicDetails?.bio && (
                            <div className={styles.errorIcon}>
                                <X size={16} />
                            </div>
                        )}
                    </div>
                    {errors.basicDetails?.bio && (
                        <div className={styles.enhancedErrorText}>
                            <X size={14} />
                            <span>{errors.basicDetails.bio.message}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default BasicDetailsStep;
