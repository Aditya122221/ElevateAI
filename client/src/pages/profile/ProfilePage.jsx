import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Briefcase,
    Target,
    Award,
    Edit,
    Save,
    X,
    Plus,
    MapPin,
    Calendar,
    Star,
    CheckCircle,
    Clock,
    DollarSign,
    Globe,
    BookOpen,
    Lightbulb
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('/api/profile');
            setProfile(response.data.profile);
            setFormData(response.data.profile);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await axios.put('/api/profile', formData);
            setProfile(formData);
            setEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const handleCancel = () => {
        setFormData(profile);
        setEditing(false);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNestedInputChange = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'career', label: 'Career', icon: Briefcase },
        { id: 'skills', label: 'Skills', icon: Award },
        { id: 'goals', label: 'Goals', icon: Target }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Profile not found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please complete your profile first.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileContainer}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.profileHeader}
                >
                    <h1 className={styles.profileTitle}>
                        My Profile
                    </h1>
                    <p className={styles.profileSubtitle}>
                        Manage your personal information and career details
                    </p>
                </motion.div>

                <div className="flex gap-2 mt-4 md:mt-0 justify-center">
                    {editing ? (
                        <>
                            <button
                                onClick={handleSave}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                            <button
                                onClick={handleCancel}
                                className="btn btn-outline flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="card p-6 sticky top-8">
                            {/* Profile Summary */}
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {profile.careerInfo?.desiredRole}
                                </p>
                                {profile.personalInfo?.location && (
                                    <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4" />
                                        {profile.personalInfo.location.city}, {profile.personalInfo.location.country}
                                    </div>
                                )}
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                                                ? 'bg-primary text-white'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="card p-6">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Personal Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="form-label">First Name</label>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={formData.personalInfo?.firstName || ''}
                                                    onChange={(e) => handleNestedInputChange('personalInfo', 'firstName', e.target.value)}
                                                    className="form-input"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white">
                                                    {profile.personalInfo?.firstName || 'Not specified'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Last Name</label>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={formData.personalInfo?.lastName || ''}
                                                    onChange={(e) => handleNestedInputChange('personalInfo', 'lastName', e.target.value)}
                                                    className="form-input"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white">
                                                    {profile.personalInfo?.lastName || 'Not specified'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Age</label>
                                            {editing ? (
                                                <input
                                                    type="number"
                                                    value={formData.personalInfo?.age || ''}
                                                    onChange={(e) => handleNestedInputChange('personalInfo', 'age', e.target.value)}
                                                    className="form-input"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white">
                                                    {profile.personalInfo?.age || 'Not specified'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Country</label>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={formData.personalInfo?.location?.country || ''}
                                                    onChange={(e) => handleNestedInputChange('personalInfo', 'location', {
                                                        ...formData.personalInfo?.location,
                                                        country: e.target.value
                                                    })}
                                                    className="form-input"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white">
                                                    {profile.personalInfo?.location?.country || 'Not specified'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">City</label>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={formData.personalInfo?.location?.city || ''}
                                                    onChange={(e) => handleNestedInputChange('personalInfo', 'location', {
                                                        ...formData.personalInfo?.location,
                                                        city: e.target.value
                                                    })}
                                                    className="form-input"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white">
                                                    {profile.personalInfo?.location?.city || 'Not specified'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Bio</label>
                                        {editing ? (
                                            <textarea
                                                value={formData.personalInfo?.bio || ''}
                                                onChange={(e) => handleNestedInputChange('personalInfo', 'bio', e.target.value)}
                                                className="form-input form-textarea"
                                                rows={4}
                                                placeholder="Tell us about yourself..."
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white">
                                                {profile.personalInfo?.bio || 'No bio provided'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Career Tab */}
                            {activeTab === 'career' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Career Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="form-label">Current Role</label>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={formData.careerInfo?.currentRole || ''}
                                                    onChange={(e) => handleNestedInputChange('careerInfo', 'currentRole', e.target.value)}
                                                    className="form-input"
                                                    placeholder="e.g., Software Developer"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white">
                                                    {profile.careerInfo?.currentRole || 'Not specified'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Desired Role</label>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={formData.careerInfo?.desiredRole || ''}
                                                    onChange={(e) => handleNestedInputChange('careerInfo', 'desiredRole', e.target.value)}
                                                    className="form-input"
                                                    placeholder="e.g., Senior Software Engineer"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white">
                                                    {profile.careerInfo?.desiredRole || 'Not specified'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Experience Level</label>
                                            {editing ? (
                                                <select
                                                    value={formData.careerInfo?.experienceLevel || ''}
                                                    onChange={(e) => handleNestedInputChange('careerInfo', 'experienceLevel', e.target.value)}
                                                    className="form-input form-select"
                                                >
                                                    <option value="">Select experience level</option>
                                                    <option value="entry">Entry Level (0-2 years)</option>
                                                    <option value="junior">Junior (2-4 years)</option>
                                                    <option value="mid">Mid Level (4-7 years)</option>
                                                    <option value="senior">Senior (7-10 years)</option>
                                                    <option value="lead">Lead (10+ years)</option>
                                                    <option value="executive">Executive</option>
                                                </select>
                                            ) : (
                                                <p className="text-gray-900 dark:text-white">
                                                    {profile.careerInfo?.experienceLevel || 'Not specified'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Industry</label>
                                            {editing ? (
                                                <input
                                                    type="text"
                                                    value={formData.careerInfo?.industry || ''}
                                                    onChange={(e) => handleNestedInputChange('careerInfo', 'industry', e.target.value)}
                                                    className="form-input"
                                                    placeholder="e.g., Technology"
                                                />
                                            ) : (
                                                <p className="text-gray-900 dark:text-white">
                                                    {profile.careerInfo?.industry || 'Not specified'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Salary Expectations */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Salary Expectations
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="form-group">
                                                <label className="form-label">Minimum</label>
                                                {editing ? (
                                                    <input
                                                        type="number"
                                                        value={formData.careerInfo?.salaryExpectation?.min || ''}
                                                        onChange={(e) => handleNestedInputChange('careerInfo', 'salaryExpectation', {
                                                            ...formData.careerInfo?.salaryExpectation,
                                                            min: e.target.value
                                                        })}
                                                        className="form-input"
                                                        placeholder="50000"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900 dark:text-white">
                                                        {profile.careerInfo?.salaryExpectation?.min || 'Not specified'}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Maximum</label>
                                                {editing ? (
                                                    <input
                                                        type="number"
                                                        value={formData.careerInfo?.salaryExpectation?.max || ''}
                                                        onChange={(e) => handleNestedInputChange('careerInfo', 'salaryExpectation', {
                                                            ...formData.careerInfo?.salaryExpectation,
                                                            max: e.target.value
                                                        })}
                                                        className="form-input"
                                                        placeholder="100000"
                                                    />
                                                ) : (
                                                    <p className="text-gray-900 dark:text-white">
                                                        {profile.careerInfo?.salaryExpectation?.max || 'Not specified'}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Currency</label>
                                                {editing ? (
                                                    <select
                                                        value={formData.careerInfo?.salaryExpectation?.currency || 'USD'}
                                                        onChange={(e) => handleNestedInputChange('careerInfo', 'salaryExpectation', {
                                                            ...formData.careerInfo?.salaryExpectation,
                                                            currency: e.target.value
                                                        })}
                                                        className="form-input form-select"
                                                    >
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                        <option value="GBP">GBP</option>
                                                        <option value="CAD">CAD</option>
                                                    </select>
                                                ) : (
                                                    <p className="text-gray-900 dark:text-white">
                                                        {profile.careerInfo?.salaryExpectation?.currency || 'USD'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Skills Tab */}
                            {activeTab === 'skills' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Skills & Interests
                                    </h2>

                                    {/* Technical Skills */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Technical Skills
                                        </h3>
                                        {profile.skills?.technical && profile.skills.technical.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profile.skills.technical.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                                    >
                                                        {skill.name} ({skill.level})
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400">No technical skills added yet</p>
                                        )}
                                    </div>

                                    {/* Soft Skills */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Soft Skills
                                        </h3>
                                        {profile.skills?.soft && profile.skills.soft.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profile.skills.soft.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                                                    >
                                                        {skill.name} ({skill.level})
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400">No soft skills added yet</p>
                                        )}
                                    </div>

                                    {/* Interests */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Interests
                                        </h3>
                                        {profile.interests && profile.interests.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profile.interests.map((interest, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                                                    >
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400">No interests added yet</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Goals Tab */}
                            {activeTab === 'goals' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Goals & Aspirations
                                    </h2>

                                    {/* Short-term Goals */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Short-term Goals (next 6 months)
                                        </h3>
                                        {profile.goals?.shortTerm && profile.goals.shortTerm.length > 0 ? (
                                            <ul className="space-y-2">
                                                {profile.goals.shortTerm.map((goal, index) => (
                                                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                                                        <Target className="w-4 h-4 text-primary mr-2" />
                                                        {goal}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400">No short-term goals set yet</p>
                                        )}
                                    </div>

                                    {/* Long-term Goals */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                            Long-term Goals (next 2-3 years)
                                        </h3>
                                        {profile.goals?.longTerm && profile.goals.longTerm.length > 0 ? (
                                            <ul className="space-y-2">
                                                {profile.goals.longTerm.map((goal, index) => (
                                                    <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                                                        <Lightbulb className="w-4 h-4 text-secondary mr-2" />
                                                        {goal}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-600 dark:text-gray-400">No long-term goals set yet</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div >
        </div >
    );
};

export default ProfilePage;
