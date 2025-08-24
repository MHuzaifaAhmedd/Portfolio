// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  ME: `${API_BASE_URL}/api/auth/me`,
  
  // Contact endpoints
  CONTACT: `${API_BASE_URL}/api/contact`,
  
  // Admin endpoints
  ADMIN_CONTACTS: `${API_BASE_URL}/api/admin/contacts`,
  ADMIN_DASHBOARD: `${API_BASE_URL}/api/admin/dashboard`,
  ADMIN_CONTACT_STATUS: (id: string) => `${API_BASE_URL}/api/admin/contacts/${id}/status`,
  ADMIN_CONTACT_REPLY: (id: string) => `${API_BASE_URL}/api/admin/contacts/${id}/reply`,
  
  // Project endpoints
  PROJECTS: `${API_BASE_URL}/api/projects`,
  FEATURED_PROJECTS: `${API_BASE_URL}/api/projects/featured`,
  ADMIN_ALL_PROJECTS: `${API_BASE_URL}/api/projects/admin/all`,
  ADMIN_CREATE_PROJECT: `${API_BASE_URL}/api/projects/admin/create`,
  ADMIN_UPDATE_PROJECT: (id: string) => `${API_BASE_URL}/api/projects/admin/${id}`,
  ADMIN_DELETE_PROJECT: (id: string) => `${API_BASE_URL}/api/projects/admin/${id}`,
  ADMIN_PROJECT_STATUS: (id: string) => `${API_BASE_URL}/api/projects/admin/${id}/status`,
  
  // Upload endpoints
  UPLOADS: `${API_BASE_URL}/uploads`,
  PROJECT_IMAGES: `${API_BASE_URL}/uploads/projects`,
};

export const getImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  return `${API_BASE_URL}/${imagePath}`;
};

export const getProjectImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const fileName = imagePath.replace(/^.*[\\\/]/, '');
  return `${API_BASE_URL}/uploads/projects/${fileName}`;
};
