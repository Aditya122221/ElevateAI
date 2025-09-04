import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
    User,
    Briefcase,
    Target,
    GraduationCap,
    Award,
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Plus,
    X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './ProfileCreationPage.module.css';

const ProfileCreationPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [interests, setInterests] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [newInterest, setNewInterest] = useState('');
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue
    } = useForm({
        defaultValues: {
            personalInfo: {
                firstName: '',
                lastName: '',
                age: '',
                location: {
                    country: '',
                    city: ''
                },
                bio: ''
            },
            careerInfo: {
                currentRole: '',
                desiredRole: '',
                experienceLevel: '',
                industry: '',
                salaryExpectation: {
                    min: '',
                    max: '',
                    currency: 'USD'
                }
            },
            goals: {
                shortTerm: [],
                longTerm: []
            }
        }
    });

    const steps = [
        { number: 1, title: 'Personal Info', icon: User },
        { number: 2, title: 'Career Info', icon: Briefcase },
        { number: 3, title: 'Skills & Interests', icon: Award },
        { number: 4, title: 'Goals', icon: Target }
    ];

    const experienceLevels = [
        { value: 'entry', label: 'Entry Level (0-2 years)' },
        { value: 'junior', label: 'Junior (2-4 years)' },
        { value: 'mid', label: 'Mid Level (4-7 years)' },
        { value: 'senior', label: 'Senior (7-10 years)' },
        { value: 'lead', label: 'Lead (10+ years)' },
        { value: 'executive', label: 'Executive' }
    ];

    const industries = [
        'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
        'Retail', 'Consulting', 'Media', 'Government', 'Non-profit', 'Other'
    ];

    const addSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim())) {
            setSkills([...skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const addInterest = () => {
        if (newInterest.trim() && !interests.includes(newInterest.trim())) {
            setInterests([...interests, newInterest.trim()]);
            setNewInterest('');
        }
    };

    const removeInterest = (interestToRemove) => {
        setInterests(interests.filter(interest => interest !== interestToRemove));
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const profileData = {
                ...data,
                skills: {
                    technical: skills.map(skill => ({ name: skill, level: 'intermediate' })),
                    soft: [],
                    languages: []
                },
                interests,
                goals: {
                    shortTerm: data.goals.shortTerm || [],
                    longTerm: data.goals.longTerm || []
                }
            };

            await axios.post('/api/profile', profileData);
            updateUser({ ...user, isProfileComplete: true });
            toast.success('Profile created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to create profile. Please try again.');
            console.error('Profile creation error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">First Name *</label>
                                <input
                                    {...register('personalInfo.firstName', { required: 'First name is required' })}
                                    type="text"
                                    className={`form-input ${errors.personalInfo?.firstName ? 'border-red-500' : ''}`}
                                    placeholder="Enter your first name"
                                />
                                {errors.personalInfo?.firstName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.personalInfo.firstName.message}</p>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name *</label>
                                <input
                                    {...register('personalInfo.lastName', { required: 'Last name is required' })}
                                    type="text"
                                    className={`form-input ${errors.personalInfo?.lastName ? 'border-red-500' : ''}`}
                                    placeholder="Enter your last name"
                                />
                                {errors.personalInfo?.lastName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.personalInfo.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Age</label>
                            <input
                                {...register('personalInfo.age', {
                                    min: { value: 16, message: 'Age must be at least 16' },
                                    max: { value: 100, message: 'Age must be less than 100' }
                                })}
                                type="number"
                                className={`form-input ${errors.personalInfo?.age ? 'border-red-500' : ''}`}
                                placeholder="Enter your age"
                            />
                            {errors.personalInfo?.age && (
                                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.age.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="form-label">Country</label>
                                <input
                                    {...register('personalInfo.location.country')}
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your country"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                    {...register('personalInfo.location.city')}
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your city"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Bio</label>
                            <textarea
                                {...register('personalInfo.bio')}
                                className="form-input form-textarea"
                                placeholder="Tell us about yourself..."
                                rows={4}
                            />
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="form-group">
                            <label className="form-label">Current Role</label>
                            <input
                                {...register('careerInfo.currentRole')}
                                type="text"
                                className="form-input"
                                placeholder="e.g., Software Developer, Marketing Manager"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Desired Role *</label>
                            <input
                                {...register('careerInfo.desiredRole', { required: 'Desired role is required' })}
                                type="text"
                                className={`form-input ${errors.careerInfo?.desiredRole ? 'border-red-500' : ''}`}
                                placeholder="e.g., Senior Software Engineer, Product Manager"
                            />
                            {errors.careerInfo?.desiredRole && (
                                <p className="mt-1 text-sm text-red-600">{errors.careerInfo.desiredRole.message}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Experience Level *</label>
                            <select
                                {...register('careerInfo.experienceLevel', { required: 'Experience level is required' })}
                                className={`form-input form-select ${errors.careerInfo?.experienceLevel ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select your experience level</option>
                                {experienceLevels.map(level => (
                                    <option key={level.value} value={level.value}>
                                        {level.label}
                                    </option>
                                ))}
                            </select>
                            {errors.careerInfo?.experienceLevel && (
                                <p className="mt-1 text-sm text-red-600">{errors.careerInfo.experienceLevel.message}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Industry</label>
                            <select
                                {...register('careerInfo.industry')}
                                className="form-input form-select"
                            >
                                <option value="">Select your industry</option>
                                {industries.map(industry => (
                                    <option key={industry} value={industry}>
                                        {industry}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-group">
                                <label className="form-label">Min Salary</label>
                                <input
                                    {...register('careerInfo.salaryExpectation.min')}
                                    type="number"
                                    className="form-input"
                                    placeholder="50000"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max Salary</label>
                                <input
                                    {...register('careerInfo.salaryExpectation.max')}
                                    type="number"
                                    className="form-input"
                                    placeholder="100000"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Currency</label>
                                <select
                                    {...register('careerInfo.salaryExpectation.currency')}
                                    className="form-input form-select"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="CAD">CAD</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="form-group">
                            <label className="form-label">Technical Skills</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    className="form-input flex-1"
                                    placeholder="e.g., JavaScript, Python, React"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="btn btn-outline"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="hover:text-red-500"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Interests</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={newInterest}
                                    onChange={(e) => setNewInterest(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                                    className="form-input flex-1"
                                    placeholder="e.g., Machine Learning, UI/UX Design, Data Science"
                                />
                                <button
                                    type="button"
                                    onClick={addInterest}
                                    className="btn btn-outline"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {interests.map((interest, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm"
                                    >
                                        {interest}
                                        <button
                                            type="button"
                                            onClick={() => removeInterest(interest)}
                                            className="hover:text-red-500"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="form-group">
                            <label className="form-label">Short-term Goals (next 6 months)</label>
                            <textarea
                                {...register('goals.shortTerm')}
                                className="form-input form-textarea"
                                placeholder="e.g., Learn React, Get AWS certification, Improve communication skills"
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Long-term Goals (next 2-3 years)</label>
                            <textarea
                                {...register('goals.longTerm')}
                                className="form-input form-textarea"
                                placeholder="e.g., Become a senior developer, Start my own company, Lead a team"
                                rows={3}
                            />
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={styles.profileCreationPage}>
            <div className={styles.profileContainer}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* Header */}
                    <div className={styles.profileHeader}>
                        <h1 className={styles.profileTitle}>
                            Complete Your Profile
                        </h1>
                        <p className={styles.profileSubtitle}>
                            Help us personalize your experience and provide better recommendations
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.number;
                            const isCompleted = currentStep > step.number;

                            return (
                                <div key={step.number} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${isCompleted
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : isActive
                                                    ? 'bg-primary border-primary text-white'
                                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
                                                }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle size={20} />
                                            ) : (
                                                <Icon size={20} />
                                            )}
                                        </div>
                                        <span className={`mt-2 text-sm font-medium ${isActive ? 'text-primary' : 'text-gray-500'
                                            }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Form */}
                    <div className="card p-8">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {renderStepContent()}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className="btn btn-outline flex items-center gap-2"
                                >
                                    <ArrowLeft size={16} />
                                    Previous
                                </button>

                                {currentStep < steps.length ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="btn btn-primary flex items-center gap-2"
                                    >
                                        Next
                                        <ArrowRight size={16} />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn btn-primary flex items-center gap-2"
                                    >
                                        {isLoading ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            <>
                                                Complete Profile
                                                <CheckCircle size={16} />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileCreationPage;
