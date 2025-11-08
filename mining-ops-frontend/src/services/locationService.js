import apiClient from './apiClient';

export const miningSiteService = {
  getAll: async (params) => {
    const response = await apiClient.get('/mining-sites', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/mining-sites/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/mining-sites', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/mining-sites/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/mining-sites/${id}`);
    return response.data;
  },
};

export const loadingPointService = {
  getAll: async (params) => {
    const response = await apiClient.get('/locations/loading-points', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/locations/loading-points/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/locations/loading-points', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/locations/loading-points/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/locations/loading-points/${id}`);
    return response.data;
  },
};

export const dumpingPointService = {
  getAll: async (params) => {
    const response = await apiClient.get('/locations/dumping-points', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/locations/dumping-points/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/locations/dumping-points', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/locations/dumping-points/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/locations/dumping-points/${id}`);
    return response.data;
  },
};

export const roadSegmentService = {
  getAll: async (params) => {
    const response = await apiClient.get('/locations/road-segments', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/locations/road-segments/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/locations/road-segments', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/locations/road-segments/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/locations/road-segments/${id}`);
    return response.data;
  },
};
