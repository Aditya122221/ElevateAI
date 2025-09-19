import React, { useState } from 'react';
import { Plus, Edit, Save, X, Code, Wrench, Palette, Users, Brain } from 'lucide-react';
import { saveSkills, updateSkills } from '../../../services/profileService';
import toast from 'react-hot-toast';
import styles from './SkillsSection.module.css';

const SkillsSection = ({ profileData, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    languages: '',
    technologies: '',
    frameworks: '',
    tools: '',
    softSkills: ''
  });

  const skills = profileData.skills || {};
  const safeSkills = {
    languages: Array.isArray(skills.languages) ? skills.languages : [],
    technologies: Array.isArray(skills.technologies) ? skills.technologies : [],
    frameworks: Array.isArray(skills.frameworks) ? skills.frameworks : [],
    tools: Array.isArray(skills.tools) ? skills.tools : [],
    softSkills: Array.isArray(skills.softSkills) ? skills.softSkills : []
  };

  const skillCategories = [
    {
      key: 'languages',
      label: 'Programming Languages',
      icon: Code,
      color: 'blue',
      placeholder: 'JavaScript, Python, Java, C++...'
    },
    {
      key: 'technologies',
      label: 'Technologies',
      icon: Wrench,
      color: 'green',
      placeholder: 'React, Node.js, MongoDB, AWS...'
    },
    {
      key: 'frameworks',
      label: 'Frameworks & Libraries',
      icon: Palette,
      color: 'purple',
      placeholder: 'Express, Django, Spring Boot...'
    },
    {
      key: 'tools',
      label: 'Tools & Platforms',
      icon: Wrench,
      color: 'orange',
      placeholder: 'Git, Docker, Jenkins, Figma...'
    },
    {
      key: 'softSkills',
      label: 'Soft Skills',
      icon: Users,
      color: 'pink',
      placeholder: 'Leadership, Communication, Problem Solving...'
    }
  ];

  const handleEdit = () => {
    setFormData({
      languages: safeSkills.languages.join(', '),
      technologies: safeSkills.technologies.join(', '),
      frameworks: safeSkills.frameworks.join(', '),
      tools: safeSkills.tools.join(', '),
      softSkills: safeSkills.softSkills.join(', ')
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedSkills = {
        languages: formData.languages.split(',').map(s => s.trim()).filter(s => s),
        technologies: formData.technologies.split(',').map(s => s.trim()).filter(s => s),
        frameworks: formData.frameworks.split(',').map(s => s.trim()).filter(s => s),
        tools: formData.tools.split(',').map(s => s.trim()).filter(s => s),
        softSkills: formData.softSkills.split(',').map(s => s.trim()).filter(s => s)
      };

      if (skills._id) {
        await updateSkills(updatedSkills);
      } else {
        await saveSkills(updatedSkills);
      }

      setProfileData(prev => ({
        ...prev,
        skills: updatedSkills
      }));

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
    setFormData({
      languages: '',
      technologies: '',
      frameworks: '',
      tools: '',
      softSkills: ''
    });
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className={styles.skillsSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Skills & Expertise</h3>
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
        <div className={styles.editForm}>
          {skillCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.key} className={styles.skillCategory}>
                <label className={styles.categoryLabel}>
                  <IconComponent className="w-5 h-5" />
                  {category.label}
                </label>
                <input
                  type="text"
                  value={formData[category.key]}
                  onChange={(e) => handleInputChange(category.key, e.target.value)}
                  className={`${styles.input} ${styles[`input${category.color.charAt(0).toUpperCase() + category.color.slice(1)}`]}`}
                  placeholder={category.placeholder}
                />
              </div>
            );
          })}

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
        </div>
      ) : (
        <div className={styles.skillsDisplay}>
          {skillCategories.map((category) => {
            const IconComponent = category.icon;
            const skillList = safeSkills[category.key];
            
            return (
              <div key={category.key} className={styles.skillCategory}>
                <div className={styles.categoryHeader}>
                  <IconComponent className={`w-5 h-5 ${styles[`icon${category.color.charAt(0).toUpperCase() + category.color.slice(1)}`]}`} />
                  <h4 className={styles.categoryTitle}>{category.label}</h4>
                </div>
                <div className={styles.skillTags}>
                  {skillList.length === 0 ? (
                    <span className={styles.emptyState}>No skills added yet</span>
                  ) : (
                    skillList.map((skill, index) => (
                      <span
                        key={index}
                        className={`${styles.skillTag} ${styles[`tag${category.color.charAt(0).toUpperCase() + category.color.slice(1)}`]}`}
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillsSection;
