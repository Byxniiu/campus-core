import client from './client';

export const studyMaterialAPI = {
  create: (formData) =>
    client.post('/study-materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Get all materials with filters
  getAll: (params) => client.get('/study-materials', { params }),

  // Get single material
  getOne: (id) => client.get(`/study-materials/${id}`),

  // Update material
  update: (id, data) => client.put(`/study-materials/${id}`, data),

  // Delete material
  delete: (id) => client.delete(`/study-materials/${id}`),

  // Get my uploads
  getMyUploads: () => client.get('/study-materials/my-uploads'),

  // Get materials by subject
  getBySubject: (subject, params) => client.get(`/study-materials/subject/${subject}`, { params }),

  // Get download file (Returns blob for secure download via application)
  download: (id, fileIndex = 0) =>
    client.get(`/study-materials/${id}/download/${fileIndex}`, {
      responseType: 'blob',
    }),

  // Get download URL (Note: This might need to handle the blob or redirect)
  getDownloadUrl: (id, fileIndex = 0) => {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    return `${baseURL}/study-materials/${id}/download/${fileIndex}`;
  },
};
