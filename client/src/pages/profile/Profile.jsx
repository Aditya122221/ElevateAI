import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Linkedin, Github, Globe, Edit, Plus, Save, X, Calendar, MapPin, ExternalLink, Award, Briefcase } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllProfileData, saveBasicDetails, updateBasicDetails, saveSkills, updateSkills, saveProjects, updateProjects, saveCertifications, updateCertifications, saveExperience, updateExperience, saveJobRoles, updateJobRoles } from '../../services/profileService';
import toast from 'react-hot-toast';

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

// ProfilePage.module.css (simulated as JavaScript object)
const styles = {
  profileContainer: 'min-h-screen bg-gray-50 p-6',
  header: 'text-center mb-8',
  title: 'text-4xl font-bold text-gray-800 mb-2',
  subtitle: 'text-lg text-gray-600',
  sectionsGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto',
  sectionCard: 'bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300',
  sectionHeader: 'flex justify-between items-center mb-6 pb-4 border-b border-gray-200',
  sectionTitle: 'text-2xl font-semibold text-gray-800 flex items-center gap-3',
  buttonGroup: 'flex gap-2',
  button: 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-sm',
  primaryButton: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md',
  secondaryButton: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
  successButton: 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md',
  dangerButton: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md',
  warningButton: 'bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-md',
  form: 'space-y-6',
  formRow: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  formGroup: 'space-y-2',
  label: 'block text-sm font-semibold text-gray-700',
  input: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200',
  textarea: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200',
  select: 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200',
  profilePicture: 'w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-xl',
  profileInfo: 'text-center space-y-3',
  profileName: 'text-3xl font-bold text-gray-800',
  profileBio: 'text-gray-600 max-w-md mx-auto leading-relaxed',
  contactInfo: 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-6',
  contactItem: 'flex items-center gap-3 text-gray-600 p-3 bg-gray-50 rounded-lg',
  contactLink: 'text-blue-600 hover:text-blue-800 transition-colors duration-200',
  skillsGrid: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  skillCategory: 'space-y-3',
  skillCategoryTitle: 'font-bold text-gray-800 text-lg border-b border-gray-200 pb-2',
  skillsList: 'flex flex-wrap gap-2',
  skillTag: 'px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium hover:from-blue-200 hover:to-blue-300 transition-all duration-200',
  experienceList: 'space-y-6',
  experienceItem: 'border-l-4 border-blue-500 pl-6 py-4 bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg',
  experienceHeader: 'flex justify-between items-start mb-3',
  experienceTitle: 'font-bold text-xl text-gray-800',
  experienceCompany: 'text-blue-600 font-semibold text-lg',
  experienceDuration: 'text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full',
  experienceDescription: 'text-gray-600 mb-3 leading-relaxed',
  projectGrid: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  projectCard: 'border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50',
  projectImage: 'w-full h-48 object-cover rounded-lg mb-4 shadow-md',
  projectTitle: 'font-bold text-xl text-gray-800 mb-2',
  projectDescription: 'text-gray-600 text-sm mb-4 leading-relaxed',
  projectLinks: 'flex gap-3 mb-3',
  projectLink: 'text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 font-medium transition-colors duration-200',
  projectDuration: 'text-xs text-gray-500 mb-3 bg-gray-100 px-2 py-1 rounded-full inline-block',
  certificateGrid: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  certificateCard: 'border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-yellow-50',
  certificateTitle: 'font-bold text-xl text-gray-800 mb-2',
  certificatePlatform: 'text-blue-600 font-semibold text-lg mb-3',
  certificateDuration: 'text-xs text-gray-500 mb-3 bg-gray-100 px-2 py-1 rounded-full inline-block',
  jobRolesList: 'space-y-4',
  jobRoleItem: 'border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-gray-50',
  jobRoleTitle: 'font-semibold text-lg text-gray-800',
  modalOverlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
  modal: 'bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto shadow-2xl',
  modalHeader: 'flex justify-between items-center mb-6 pb-4 border-b border-gray-200',
  modalTitle: 'text-2xl font-bold text-gray-800',
  closeButton: 'p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200',
  emptyState: 'text-center py-12 text-gray-500',
  emptyStateIcon: 'w-16 h-16 mx-auto mb-4 text-gray-300',
  emptyStateText: 'text-lg font-medium mb-2',
  emptyStateSubtext: 'text-sm',
  divider: 'border-b border-gray-200 my-4',
  badge: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
  badgeBlue: 'bg-blue-100 text-blue-800',
  badgeGreen: 'bg-green-100 text-green-800',
  badgeYellow: 'bg-yellow-100 text-yellow-800',
  badgeRed: 'bg-red-100 text-red-800',
  cardActions: 'flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100'
};

// Profile.jsx Component
const Profile = ({ profileData, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save basic details
      if (profileData.basicDetails) {
        await updateBasicDetails(profileData.basicDetails);
      }

      // Save skills
      if (profileData.skills) {
        await updateSkills(profileData.skills);
      }

      // Save projects
      if (profileData.projects) {
        await updateProjects(profileData.projects);
      }

      // Save certifications
      if (profileData.certifications) {
        await updateCertifications(profileData.certifications);
      }

      // Save experience
      if (profileData.experience) {
        await updateExperience(profileData.experience);
      }

      // Save job roles
      if (profileData.jobRoles) {
        await updateJobRoles(profileData.jobRoles);
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload data to reset any unsaved changes
    window.location.reload();
  };


  const basicDetails = profileData.basicDetails || {};

  // Ensure all basic details have safe defaults
  const safeBasicDetails = {
    firstName: basicDetails.firstName || '',
    lastName: basicDetails.lastName || '',
    email: basicDetails.email || user?.email || '',
    phone: basicDetails.phone || '',
    linkedin: basicDetails.linkedin || '',
    github: basicDetails.github || '',
    portfolio: basicDetails.portfolio || '',
    profilePicture: basicDetails.profilePicture || '',
    bio: basicDetails.bio || ''
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <User className="w-7 h-7 text-blue-600" />
          Profile Information
        </h2>
        <div className={styles.buttonGroup}>
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isSaving}
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`${styles.button} ${styles.successButton}`}
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              <Edit className="w-4 h-4" />
              Update Profile
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First Name *</label>
              <input
                type="text"
                value={safeBasicDetails.firstName}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  basicDetails: {
                    ...prev.basicDetails,
                    firstName: e.target.value
                  }
                }))}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Last Name *</label>
              <input
                type="text"
                value={safeBasicDetails.lastName}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  basicDetails: {
                    ...prev.basicDetails,
                    lastName: e.target.value
                  }
                }))}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address *</label>
              <input
                type="email"
                value={safeBasicDetails.email}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  basicDetails: {
                    ...prev.basicDetails,
                    email: e.target.value
                  }
                }))}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                value={safeBasicDetails.phone}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  basicDetails: {
                    ...prev.basicDetails,
                    phone: e.target.value
                  }
                }))}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>LinkedIn Profile</label>
              <input
                type="url"
                value={safeBasicDetails.linkedin}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  basicDetails: {
                    ...prev.basicDetails,
                    linkedin: e.target.value
                  }
                }))}
                className={styles.input}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>GitHub Profile</label>
              <input
                type="url"
                value={safeBasicDetails.github}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  basicDetails: {
                    ...prev.basicDetails,
                    github: e.target.value
                  }
                }))}
                className={styles.input}
                placeholder="https://github.com/yourusername"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Portfolio Website</label>
              <input
                type="url"
                value={safeBasicDetails.portfolio}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  basicDetails: {
                    ...prev.basicDetails,
                    portfolio: e.target.value
                  }
                }))}
                className={styles.input}
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Profile Picture URL</label>
              <input
                type="url"
                value={safeBasicDetails.profilePicture}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  basicDetails: {
                    ...prev.basicDetails,
                    profilePicture: e.target.value
                  }
                }))}
                className={styles.input}
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Professional Bio</label>
            <textarea
              rows="4"
              value={safeBasicDetails.bio}
              onChange={(e) => setProfileData(prev => ({
                ...prev,
                basicDetails: {
                  ...prev.basicDetails,
                  bio: e.target.value
                }
              }))}
              className={styles.textarea}
              placeholder="Tell us about yourself, your experience, and what you're passionate about..."
            />
          </div>
        </form>
      ) : (
        <div>
          <img
            src={safeBasicDetails.profilePicture || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjcwIiByPSIzMCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNTAgMTQwQzUwIDEyNS42NDMgNjEuNjQzIDEyMCA3NSAxMjBIMTI1QzEzOC4zNTcgMTIwIDE1MCAxMjUuNjQzIDE1MCAxNDBWMjAwSDUwVjE0MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'}
            alt="Profile"
            className={styles.profilePicture}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=Profile' }}
          />
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
            <div className={styles.contactItem}>
              <Mail className="w-5 h-5 text-blue-600" />
              <span>{safeBasicDetails.email || 'No email provided'}</span>
            </div>
            <div className={styles.contactItem}>
              <Phone className="w-5 h-5 text-green-600" />
              <span>{safeBasicDetails.phone || 'No phone provided'}</span>
            </div>
            {safeBasicDetails.linkedin && (
              <div className={styles.contactItem}>
                <Linkedin className="w-5 h-5 text-blue-700" />
                <a href={safeBasicDetails.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  LinkedIn Profile
                </a>
              </div>
            )}
            {safeBasicDetails.github && (
              <div className={styles.contactItem}>
                <Github className="w-5 h-5 text-gray-800" />
                <a href={safeBasicDetails.github} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  GitHub Profile
                </a>
              </div>
            )}
            {safeBasicDetails.portfolio && (
              <div className={styles.contactItem}>
                <Globe className="w-5 h-5 text-purple-600" />
                <a href={safeBasicDetails.portfolio} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  Portfolio Website
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Skills.jsx Component
const Skills = ({ profileData, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const skills = profileData.skills || {};

  // Ensure all skill categories are arrays
  const safeSkills = {
    languages: Array.isArray(skills.languages) ? skills.languages : [],
    technologies: Array.isArray(skills.technologies) ? skills.technologies : [],
    frameworks: Array.isArray(skills.frameworks) ? skills.frameworks : [],
    tools: Array.isArray(skills.tools) ? skills.tools : [],
    softSkills: Array.isArray(skills.softSkills) ? skills.softSkills : []
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSkills(safeSkills);
      toast.success('Skills updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving skills:', error);
      toast.error('Failed to save skills');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    window.location.reload();
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Award className="w-7 h-7 text-purple-600" />
          Skills & Expertise
        </h2>
        <div className={styles.buttonGroup}>
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className={`${styles.button} ${styles.secondaryButton}`}
                disabled={isSaving}
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`${styles.button} ${styles.successButton}`}
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              <Edit className="w-4 h-4" />
              Update Skills
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form className={styles.form}>
          {Object.entries(safeSkills).map(([category, skillList]) => (
            <div key={category} className={styles.formGroup}>
              <label className={styles.label}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                value={skillList.join(', ')}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  skills: {
                    ...prev.skills,
                    [category]: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }
                }))}
                className={styles.input}
                placeholder="Enter skills separated by commas"
              />
            </div>
          ))}
        </form>
      ) : (
        <div className={styles.skillsGrid}>
          {Object.entries(safeSkills).map(([category, skillList]) => (
            <div key={category} className={styles.skillCategory}>
              <h4 className={styles.skillCategoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
              </h4>
              <div className={styles.skillsList}>
                {skillList.length > 0 ? (
                  skillList.map((skill, index) => (
                    <span key={index} className={styles.skillTag}>{skill}</span>
                  ))
                ) : (
                  <span className="text-gray-500 italic">No skills added yet</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Experience.jsx Component
const Experience = ({ profileData, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const experiences = profileData.experience?.experiences || [];

  // Ensure experiences is always an array
  const safeExperiences = Array.isArray(experiences) ? experiences : [];

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    skills: '',
    description: ''
  });

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      skills: '',
      description: ''
    });
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
    setEditingIndex(null);
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

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Briefcase className="w-7 h-7 text-green-600" />
          Work Experience
        </h2>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setShowAddModal(true)}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>
      </div>

      {safeExperiences.length === 0 ? (
        <div className={styles.emptyState}>
          <Briefcase className={styles.emptyStateIcon} />
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
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingIndex !== null ? 'Edit Experience' : 'Add New Experience'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  resetForm();
                }}
                className={styles.closeButton}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Company Name *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={styles.input}
                    required
                  />
                </div>
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
                className={`${styles.button} ${styles.successButton} w-full`}
              >
                {editingIndex !== null ? 'Update Experience' : 'Add Experience'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Projects.jsx Component
const Projects = ({ profileData, setProfileData }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const projects = profileData.projects?.projects || [];

  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];

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
  };

  const handleAdd = async () => {
    const newProject = {
      id: Date.now(),
      ...formData,
      startDate: formatDate(formData.startDate),
      endDate: formData.endDate ? formatDate(formData.endDate) : '',
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
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
      ...project,
      startDate: formatDateForInput(project.startDate),
      endDate: formatDateForInput(project.endDate),
      skills: (project.skills || []).join(', ')
    });
    setEditingIndex(index);
    setShowAddModal(true);
  };

  const handleUpdate = async () => {
    const updatedProject = {
      ...safeProjects[editingIndex],
      ...formData,
      startDate: formatDate(formData.startDate),
      endDate: formData.endDate ? formatDate(formData.endDate) : '',
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
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
    setEditingIndex(null);
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

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Globe className="w-7 h-7 text-indigo-600" />
          Projects Portfolio
        </h2>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setShowAddModal(true)}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
      </div>

      {safeProjects.length === 0 ? (
        <div className={styles.emptyState}>
          <Globe className={styles.emptyStateIcon} />
          <p className={styles.emptyStateText}>No projects added yet</p>
          <p className={styles.emptyStateSubtext}>Add your first project to showcase your work</p>
        </div>
      ) : (
        <div className={styles.projectGrid}>
          {safeProjects.map((project, index) => (
            <div key={project.id || index} className={styles.projectCard}>
              <img
                src={project.image}
                alt={project.name}
                className={styles.projectImage}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Project+Image' }}
              />
              <h4 className={styles.projectTitle}>{project.name}</h4>
              <p className={styles.projectDescription}>{project.description}</p>

              <div className={styles.projectLinks}>
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                    <Github className="w-4 h-4" />
                    Source Code
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
              </div>

              <div className={styles.projectDuration}>
                {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
              </div>

              <div className={styles.skillsList}>
                {(project.skills || []).map((skill, skillIndex) => (
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
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingIndex !== null ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  resetForm();
                }}
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
                <label className={styles.label}>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={styles.textarea}
                  placeholder="Describe your project, its features, and what problems it solves..."
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
                <label className={styles.label}>Technologies Used</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className={styles.input}
                  placeholder="Enter technologies separated by commas"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Project Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={styles.input}
                  placeholder="https://example.com/project-screenshot.jpg"
                />
              </div>
              <button
                type="button"
                onClick={editingIndex !== null ? handleUpdate : handleAdd}
                className={`${styles.button} ${styles.successButton} w-full`}
              >
                {editingIndex !== null ? 'Update Project' : 'Add Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Certificates.jsx Component
const Certificates = ({ profileData, setProfileData }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const certificates = profileData.certifications?.certifications || [];

  // Ensure certificates is always an array
  const safeCertificates = Array.isArray(certificates) ? certificates : [];

  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    skills: '',
    startDate: '',
    endDate: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      platform: '',
      skills: '',
      startDate: '',
      endDate: ''
    });
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
    setEditingIndex(null);
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

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Award className="w-7 h-7 text-yellow-600" />
          Certifications & Licenses
        </h2>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setShowAddModal(true)}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            <Plus className="w-4 h-4" />
            Add Certificate
          </button>
        </div>
      </div>

      {safeCertificates.length === 0 ? (
        <div className={styles.emptyState}>
          <Award className={styles.emptyStateIcon} />
          <p className={styles.emptyStateText}>No certificates added yet</p>
          <p className={styles.emptyStateSubtext}>Add your certifications to showcase your expertise</p>
        </div>
      ) : (
        <div className={styles.certificateGrid}>
          {safeCertificates.map((cert, index) => (
            <div key={cert.id || index} className={styles.certificateCard}>
              <h4 className={styles.certificateTitle}>{cert.name}</h4>
              <p className={styles.certificatePlatform}>{cert.platform}</p>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingIndex !== null ? 'Edit Certificate' : 'Add New Certificate'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  resetForm();
                }}
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
                  placeholder="e.g., AWS Solutions Architect Professional"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Issuing Platform/Organization *</label>
                <input
                  type="text"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className={styles.input}
                  placeholder="e.g., Amazon Web Services, Google, Microsoft"
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
                className={`${styles.button} ${styles.successButton} w-full`}
              >
                {editingIndex !== null ? 'Update Certificate' : 'Add Certificate'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// JobRoles.jsx Component
const JobRoles = ({ profileData, setProfileData }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const jobRoles = profileData.jobRoles?.desiredJobRoles || [];

  // Ensure jobRoles is always an array
  const safeJobRoles = Array.isArray(jobRoles) ? jobRoles : [];

  const [formData, setFormData] = useState({
    role: ''
  });

  const resetForm = () => {
    setFormData({ role: '' });
  };

  const handleAdd = async () => {
    if (formData.role.trim()) {
      const newJobRoles = [formData.role.trim(), ...safeJobRoles];

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
        toast.success('Job role added successfully!');
      } catch (error) {
        console.error('Error saving job role:', error);
        toast.error('Failed to save job role');
      }

      resetForm();
      setShowAddModal(false);
    }
  };

  const handleEdit = (index) => {
    setFormData({ role: safeJobRoles[index] });
    setEditingIndex(index);
    setShowAddModal(true);
  };

  const handleUpdate = async () => {
    if (formData.role.trim()) {
      const newJobRoles = [...safeJobRoles];
      newJobRoles[editingIndex] = formData.role.trim();

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
      setEditingIndex(null);
    }
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

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <Briefcase className="w-7 h-7 text-red-600" />
          Target Job Roles
        </h2>
        <div className={styles.buttonGroup}>
          <button
            onClick={() => setShowAddModal(true)}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            <Plus className="w-4 h-4" />
            Add Role
          </button>
        </div>
      </div>

      {safeJobRoles.length === 0 ? (
        <div className={styles.emptyState}>
          <Briefcase className={styles.emptyStateIcon} />
          <p className={styles.emptyStateText}>No job roles specified</p>
          <p className={styles.emptyStateSubtext}>Add job roles you're interested in applying for</p>
        </div>
      ) : (
        <div className={styles.jobRolesList}>
          {safeJobRoles.map((role, index) => (
            <div key={index} className={styles.jobRoleItem}>
              <div className="flex items-center gap-3">
                <span className={`${styles.badge} ${styles.badgeBlue}`}>#{index + 1}</span>
                <span className={styles.jobRoleTitle}>{role}</span>
              </div>
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
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingIndex !== null ? 'Edit Job Role' : 'Add New Job Role'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingIndex(null);
                  resetForm();
                }}
                className={styles.closeButton}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Job Role Title *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={styles.input}
                  placeholder="e.g., Senior React Developer, DevOps Engineer, Product Manager"
                  required
                />
              </div>
              <button
                type="button"
                onClick={editingIndex !== null ? handleUpdate : handleAdd}
                className={`${styles.button} ${styles.successButton} w-full`}
              >
                {editingIndex !== null ? 'Update Role' : 'Add Role'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Main ProfilePage.jsx Component
const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    basicDetails: null,
    skills: null,
    projects: null,
    certifications: null,
    experience: null,
    jobRoles: null
  });
  const { user } = useAuth();

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const data = await getAllProfileData();
        setProfileData(data);
      } catch (error) {
        console.error('Error loading profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  if (isLoading) {
    return (
      <div className={styles.profileContainer}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Professional Profile Dashboard</h1>
        <p className={styles.subtitle}>Manage your complete professional information in one place</p>
      </div>

      <div className={styles.sectionsGrid}>
        <Profile profileData={profileData} setProfileData={setProfileData} />
        <Skills profileData={profileData} setProfileData={setProfileData} />
        <Experience profileData={profileData} setProfileData={setProfileData} />
        <Projects profileData={profileData} setProfileData={setProfileData} />
        <Certificates profileData={profileData} setProfileData={setProfileData} />
        <JobRoles profileData={profileData} setProfileData={setProfileData} />
      </div>
    </div>
  );
};

export default ProfilePage;