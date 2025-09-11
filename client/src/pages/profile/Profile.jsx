import React, { useState } from 'react';
import { User, Mail, Phone, Linkedin, Github, Globe, Edit, Plus, Save, X, Calendar, MapPin, ExternalLink, Award, Briefcase } from 'lucide-react';

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
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    bio: 'Passionate Full-stack developer with 5+ years of experience building scalable web applications. I love creating elegant solutions to complex problems and am always eager to learn new technologies.'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend/database
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
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
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`${styles.button} ${styles.successButton}`}
              >
                <Save className="w-4 h-4" />
                Save Changes
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
                value={profile.firstName}
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Last Name *</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
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
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>LinkedIn Profile</label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                className={styles.input}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>GitHub Profile</label>
              <input
                type="url"
                value={profile.github}
                onChange={(e) => setProfile({...profile, github: e.target.value})}
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
                value={profile.portfolio}
                onChange={(e) => setProfile({...profile, portfolio: e.target.value})}
                className={styles.input}
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Profile Picture URL</label>
              <input
                type="url"
                value={profile.profilePicture}
                onChange={(e) => setProfile({...profile, profilePicture: e.target.value})}
                className={styles.input}
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Professional Bio</label>
            <textarea
              rows="4"
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              className={styles.textarea}
              placeholder="Tell us about yourself, your experience, and what you're passionate about..."
            />
          </div>
        </form>
      ) : (
        <div>
          <img 
            src={profile.profilePicture} 
            alt="Profile" 
            className={styles.profilePicture}
            onError={(e) => {e.target.src = 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=Profile'}}
          />
          <div className={styles.profileInfo}>
            <h3 className={styles.profileName}>{profile.firstName} {profile.lastName}</h3>
            <p className={styles.profileBio}>{profile.bio}</p>
          </div>
          
          <div className={styles.divider}></div>
          
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Mail className="w-5 h-5 text-blue-600" />
              <span>{profile.email}</span>
            </div>
            <div className={styles.contactItem}>
              <Phone className="w-5 h-5 text-green-600" />
              <span>{profile.phone}</span>
            </div>
            <div className={styles.contactItem}>
              <Linkedin className="w-5 h-5 text-blue-700" />
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                LinkedIn Profile
              </a>
            </div>
            <div className={styles.contactItem}>
              <Github className="w-5 h-5 text-gray-800" />
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                GitHub Profile
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Skills.jsx Component
const Skills = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState({
    languages: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go'],
    technologies: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Redis', 'GraphQL'],
    frameworks: ['Next.js', 'Express.js', 'Django', 'Spring Boot', 'FastAPI', 'Vue.js'],
    tools: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
    softSkills: ['Leadership', 'Communication', 'Problem Solving', 'Team Collaboration', 'Project Management', 'Mentoring']
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className={`${styles.button} ${styles.successButton}`}
              >
                <Save className="w-4 h-4" />
                Save Changes
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
          {Object.entries(skills).map(([category, skillList]) => (
            <div key={category} className={styles.formGroup}>
              <label className={styles.label}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                value={skillList.join(', ')}
                onChange={(e) => setSkills({
                  ...skills, 
                  [category]: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
                className={styles.input}
                placeholder="Enter skills separated by commas"
              />
            </div>
          ))}
        </form>
      ) : (
        <div className={styles.skillsGrid}>
          {Object.entries(skills).map(([category, skillList]) => (
            <div key={category} className={styles.skillCategory}>
              <h4 className={styles.skillCategoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
              </h4>
              <div className={styles.skillsList}>
                {skillList.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Experience.jsx Component
const Experience = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      company: 'Tech Solutions Inc.',
      position: 'Senior Full Stack Developer',
      startDate: '2022-01',
      endDate: '2024-12',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      description: 'Led development of customer-facing web applications serving 100k+ users. Implemented microservices architecture and reduced page load times by 40%. Mentored junior developers and established coding standards.'
    },
    {
      id: 2,
      company: 'StartupXYZ',
      position: 'Frontend Developer',
      startDate: '2020-06',
      endDate: '2021-12',
      skills: ['React', 'TypeScript', 'GraphQL', 'Jest'],
      description: 'Built responsive web applications from scratch. Collaborated with UX/UI designers to implement pixel-perfect designs. Increased user engagement by 25% through performance optimizations.'
    }
  ]);

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

  const handleAdd = () => {
    const newExperience = {
      id: Date.now(),
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };
    setExperiences([newExperience, ...experiences]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEdit = (index) => {
    const exp = experiences[index];
    setFormData({
      ...exp,
      skills: exp.skills.join(', ')
    });
    setEditingIndex(index);
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    const updatedExperience = {
      ...experiences[editingIndex],
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };
    const newExperiences = [...experiences];
    newExperiences[editingIndex] = updatedExperience;
    setExperiences(newExperiences);
    resetForm();
    setShowAddModal(false);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
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

      {experiences.length === 0 ? (
        <div className={styles.emptyState}>
          <Briefcase className={styles.emptyStateIcon} />
          <p className={styles.emptyStateText}>No work experience added yet</p>
          <p className={styles.emptyStateSubtext}>Add your first work experience to get started</p>
        </div>
      ) : (
        <div className={styles.experienceList}>
          {experiences.map((exp, index) => (
            <div key={exp.id} className={styles.experienceItem}>
              <div className={styles.experienceHeader}>
                <div>
                  <h4 className={styles.experienceTitle}>{exp.position}</h4>
                  <p className={styles.experienceCompany}>{exp.company}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={styles.experienceDuration}>
                    {exp.startDate} - {exp.endDate}
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
                {exp.skills.map((skill, skillIndex) => (
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
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Position *</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>End Date</label>
                  <input
                    type="month"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className={styles.input}
                  placeholder="Enter skills separated by commas"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Job Description</label>
                <textarea
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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
const Projects = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard. Built with modern technologies for scalability and performance.',
      githubLink: 'https://github.com/johndoe/ecommerce-platform',
      liveUrl: 'https://mystore-demo.com',
      startDate: '2023-06',
      endDate: '2023-12',
      skills: ['React', 'Node.js', 'Stripe', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      name: 'Task Management App',
      description: 'Collaborative task management application with real-time updates, team collaboration features, and advanced filtering options.',
      githubLink: 'https://github.com/johndoe/task-manager',
      liveUrl: 'https://taskmaster-app.com',
      startDate: '2023-01',
      endDate: '2023-05',
      skills: ['Vue.js', 'Firebase', 'TypeScript', 'Vuetify'],
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop'
    }
  ]);

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

  const handleAdd = () => {
    const newProject = {
      id: Date.now(),
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };
    setProjects([newProject, ...projects]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEdit = (index) => {
    const project = projects[index];
    setFormData({
      ...project,
      skills: project.skills.join(', ')
    });
    setEditingIndex(index);
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    const updatedProject = {
      ...projects[editingIndex],
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };
    const newProjects = [...projects];
    newProjects[editingIndex] = updatedProject;
    setProjects(newProjects);
    resetForm();
    setShowAddModal(false);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
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

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <Globe className={styles.emptyStateIcon} />
          <p className={styles.emptyStateText}>No projects added yet</p>
          <p className={styles.emptyStateSubtext}>Add your first project to showcase your work</p>
        </div>
      ) : (
        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <div key={project.id} className={styles.projectCard}>
              <img 
                src={project.image} 
                alt={project.name} 
                className={styles.projectImage}
                onError={(e) => {e.target.src = 'https://via.placeholder.com/400x250/4F46E5/FFFFFF?text=Project+Image'}}
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
                {project.startDate} - {project.endDate}
              </div>
              
              <div className={styles.skillsList}>
                {project.skills.map((skill, skillIndex) => (
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
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
                    className={styles.input}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>End Date</label>
                  <input
                    type="month"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Technologies Used</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className={styles.input}
                  placeholder="Enter technologies separated by commas"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Project Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
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
const Certificates = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      name: 'AWS Solutions Architect Professional',
      platform: 'Amazon Web Services',
      skills: ['AWS', 'Cloud Architecture', 'DevOps'],
      startDate: '2023-03',
      endDate: '2026-03'
    },
    {
      id: 2,
      name: 'Google Cloud Professional Developer',
      platform: 'Google Cloud',
      skills: ['GCP', 'Kubernetes', 'Cloud Functions'],
      startDate: '2023-01',
      endDate: '2025-01'
    },
    {
      id: 3,
      name: 'Meta React Developer Professional Certificate',
      platform: 'Meta (via Coursera)',
      skills: ['React', 'JavaScript', 'Frontend Development'],
      startDate: '2022-08',
      endDate: 'Lifetime'
    }
  ]);

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

  const handleAdd = () => {
    const newCertificate = {
      id: Date.now(),
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };
    setCertificates([newCertificate, ...certificates]);
    resetForm();
    setShowAddModal(false);
  };

  const handleEdit = (index) => {
    const certificate = certificates[index];
    setFormData({
      ...certificate,
      skills: certificate.skills.join(', ')
    });
    setEditingIndex(index);
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    const updatedCertificate = {
      ...certificates[editingIndex],
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
    };
    const newCertificates = [...certificates];
    newCertificates[editingIndex] = updatedCertificate;
    setCertificates(newCertificates);
    resetForm();
    setShowAddModal(false);
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
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

      {certificates.length === 0 ? (
        <div className={styles.emptyState}>
          <Award className={styles.emptyStateIcon} />
          <p className={styles.emptyStateText}>No certificates added yet</p>
          <p className={styles.emptyStateSubtext}>Add your certifications to showcase your expertise</p>
        </div>
      ) : (
        <div className={styles.certificateGrid}>
          {certificates.map((cert, index) => (
            <div key={cert.id} className={styles.certificateCard}>
              <h4 className={styles.certificateTitle}>{cert.name}</h4>
              <p className={styles.certificatePlatform}>{cert.platform}</p>
              <div className={styles.certificateDuration}>
                Issued: {cert.startDate} | Expires: {cert.endDate}
              </div>
              
              <div className={styles.skillsList}>
                {cert.skills.map((skill, skillIndex) => (
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
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
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
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Expiration Date</label>
                  <input
                    type="month"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
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
const JobRoles = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [jobRoles, setJobRoles] = useState([
    'Senior Full Stack Developer',
    'Frontend Team Lead',
    'Software Architect',
    'Technical Product Manager',
    'DevOps Engineer'
  ]);

  const [formData, setFormData] = useState({
    role: ''
  });

  const resetForm = () => {
    setFormData({ role: '' });
  };

  const handleAdd = () => {
    if (formData.role.trim()) {
      setJobRoles([formData.role.trim(), ...jobRoles]);
      resetForm();
      setShowAddModal(false);
    }
  };

  const handleEdit = (index) => {
    setFormData({ role: jobRoles[index] });
    setEditingIndex(index);
    setShowAddModal(true);
  };

  const handleUpdate = () => {
    if (formData.role.trim()) {
      const newJobRoles = [...jobRoles];
      newJobRoles[editingIndex] = formData.role.trim();
      setJobRoles(newJobRoles);
      resetForm();
      setShowAddModal(false);
      setEditingIndex(null);
    }
  };

  const handleDelete = (index) => {
    setJobRoles(jobRoles.filter((_, i) => i !== index));
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

      {jobRoles.length === 0 ? (
        <div className={styles.emptyState}>
          <Briefcase className={styles.emptyStateIcon} />
          <p className={styles.emptyStateText}>No job roles specified</p>
          <p className={styles.emptyStateSubtext}>Add job roles you're interested in applying for</p>
        </div>
      ) : (
        <div className={styles.jobRolesList}>
          {jobRoles.map((role, index) => (
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
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
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
  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Professional Profile Dashboard</h1>
        <p className={styles.subtitle}>Manage your complete professional information in one place</p>
      </div>
      
      <div className={styles.sectionsGrid}>
        <Profile />
        <Skills />
        <Experience />
        <Projects />
        <Certificates />
        <JobRoles />
      </div>
    </div>
  );
};

export default ProfilePage;