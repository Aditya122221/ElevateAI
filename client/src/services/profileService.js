import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ==================== BASIC DETAILS ====================

export const getBasicDetails = async () => {
    try {
        const response = await api.get('/profile/basic-details');
        return response.data;
    } catch (error) {
        console.error('Error fetching basic details:', error);
        throw error;
    }
};

export const saveBasicDetails = async (data) => {
    try {
        const response = await api.post('/profile/basic-details', data);
        return response.data;
    } catch (error) {
        console.error('Error saving basic details:', error);
        throw error;
    }
};

export const updateBasicDetails = async (data) => {
    try {
        const response = await api.put('/profile/basic-details', data);
        return response.data;
    } catch (error) {
        console.error('Error updating basic details:', error);
        throw error;
    }
};

export const deleteProfilePicture = async () => {
    try {
        const response = await api.delete('/profile/basic-details/profile-picture');
        return response.data;
    } catch (error) {
        console.error('Error deleting profile picture:', error);
        throw error;
    }
};

// ==================== SKILLS ====================

export const getSkills = async () => {
    try {
        const response = await api.get('/profile/skills');
        return response.data;
    } catch (error) {
        console.error('Error fetching skills:', error);
        throw error;
    }
};

export const saveSkills = async (data) => {
    try {
        const response = await api.post('/profile/skills', data);
        return response.data;
    } catch (error) {
        console.error('Error saving skills:', error);
        throw error;
    }
};

export const updateSkills = async (data) => {
    try {
        const response = await api.put('/profile/skills', data);
        return response.data;
    } catch (error) {
        console.error('Error updating skills:', error);
        throw error;
    }
};

// ==================== PROJECTS ====================

export const getProjects = async () => {
    try {
        const response = await api.get('/profile/projects');
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const saveProjects = async (data) => {
    try {
        const response = await api.post('/profile/projects', data);
        return response.data;
    } catch (error) {
        console.error('Error saving projects:', error);
        throw error;
    }
};

export const updateProjects = async (data) => {
    try {
        const response = await api.put('/profile/projects', data);
        return response.data;
    } catch (error) {
        console.error('Error updating projects:', error);
        throw error;
    }
};

// ==================== CERTIFICATIONS ====================

export const getCertifications = async () => {
    try {
        const response = await api.get('/profile/certifications');
        return response.data;
    } catch (error) {
        console.error('Error fetching certifications:', error);
        throw error;
    }
};

export const saveCertifications = async (data) => {
    try {
        const response = await api.post('/profile/certifications', data);
        return response.data;
    } catch (error) {
        console.error('Error saving certifications:', error);
        throw error;
    }
};

export const updateCertifications = async (data) => {
    try {
        const response = await api.put('/profile/certifications', data);
        return response.data;
    } catch (error) {
        console.error('Error updating certifications:', error);
        throw error;
    }
};

// ==================== EXPERIENCE ====================

export const getExperience = async () => {
    try {
        const response = await api.get('/profile/experience');
        return response.data;
    } catch (error) {
        console.error('Error fetching experience:', error);
        throw error;
    }
};

export const saveExperience = async (data) => {
    try {
        const response = await api.post('/profile/experience', data);
        return response.data;
    } catch (error) {
        console.error('Error saving experience:', error);
        throw error;
    }
};

export const updateExperience = async (data) => {
    try {
        const response = await api.put('/profile/experience', data);
        return response.data;
    } catch (error) {
        console.error('Error updating experience:', error);
        throw error;
    }
};

// ==================== JOB ROLES ====================

export const getJobRoles = async () => {
    try {
        const response = await api.get('/profile/job-roles');
        return response.data;
    } catch (error) {
        console.error('Error fetching job roles:', error);
        throw error;
    }
};

export const saveJobRoles = async (data) => {
    try {
        const response = await api.post('/profile/job-roles', data);
        return response.data;
    } catch (error) {
        console.error('Error saving job roles:', error);
        throw error;
    }
};

export const updateJobRoles = async (data) => {
    try {
        const response = await api.put('/profile/job-roles', data);
        return response.data;
    } catch (error) {
        console.error('Error updating job roles:', error);
        throw error;
    }
};

// ==================== PROFILE COMPLETION ====================

export const completeProfile = async () => {
    try {
        const response = await api.post('/profile/complete');
        return response.data;
    } catch (error) {
        console.error('Error completing profile:', error);
        throw error;
    }
};

// ==================== IMAGE UPLOADS ====================

export const uploadProfilePicture = async (file) => {
    try {
        const formData = new FormData();
        formData.append('profilePicture', file);

        const response = await api.post('/profile/upload-profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        throw error;
    }
};

export const uploadProjectImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('projectImage', file);

        const response = await api.post('/profile/upload-project-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading project image:', error);
        throw error;
    }
};

// ==================== UTILITY FUNCTIONS ====================

export const getAllProfileData = async () => {
    try {
        const [basicDetails, skills, projects, certifications, experience, jobRoles] = await Promise.allSettled([
            getBasicDetails(),
            getSkills(),
            getProjects(),
            getCertifications(),
            getExperience(),
            getJobRoles()
        ]);

        return {
            basicDetails: basicDetails.status === 'fulfilled' ? basicDetails.value.data : null,
            skills: skills.status === 'fulfilled' ? skills.value.data : null,
            projects: projects.status === 'fulfilled' ? projects.value.data : null,
            certifications: certifications.status === 'fulfilled' ? certifications.value.data : null,
            experience: experience.status === 'fulfilled' ? experience.value.data : null,
            jobRoles: jobRoles.status === 'fulfilled' ? jobRoles.value.data : null,
        };
    } catch (error) {
        console.error('Error fetching all profile data:', error);
        throw error;
    }
};
