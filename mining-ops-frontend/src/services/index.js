import apiClient from './apiClient';

export const maintenanceService = {
  getAll: async (params) => {
    const response = await apiClient.get('/maintenance', { params });
    return response.data;
  },

  getUpcoming: async () => {
    const response = await apiClient.get('/maintenance/upcoming');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/maintenance/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/maintenance', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/maintenance/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/maintenance/${id}`);
    return response.data;
  },
};

export const weatherService = {
  getAll: async (params) => {
    const response = await apiClient.get('/weather', { params });
    return response.data;
  },

  getLatest: async () => {
    const response = await apiClient.get('/weather/latest');
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/weather/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/weather', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/weather/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/weather/${id}`);
    return response.data;
  },
};

export const productionService = {
  getAll: async (params) => {
    const response = await apiClient.get('/production', { params });
    return response.data;
  },

  getStatistics: async (params) => {
    const response = await apiClient.get('/production/statistics', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/production/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/production', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/production/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/production/${id}`);
    return response.data;
  },
};

export const dashboardService = {
  getOverview: async () => {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  },

  getRealtime: async () => {
    const response = await apiClient.get('/dashboard/realtime');
    return response.data;
  },

  getAnalytics: async (params) => {
    const response = await apiClient.get('/dashboard/analytics', { params });
    return response.data;
  },

  getEquipmentUtilization: async (params) => {
    const response = await apiClient.get('/dashboard/equipment-utilization', { params });
    return response.data;
  },

  getDelayAnalysis: async (params) => {
    const response = await apiClient.get('/dashboard/delay-analysis', { params });
    return response.data;
  },

  getMaintenanceOverview: async () => {
    const response = await apiClient.get('/dashboard/maintenance-overview');
    return response.data;
  },
};

export const userService = {
  getAll: async (params) => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  toggleActive: async (id) => {
    const response = await apiClient.patch(`/users/${id}/activate`);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

export const truckService = {
  getAll: async (params) => {
    const response = await apiClient.get('/trucks', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/trucks/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/trucks', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/trucks/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/trucks/${id}`);
    return response.data;
  },
};

export const excavatorService = {
  getAll: async (params) => {
    const response = await apiClient.get('/excavators', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/excavators/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/excavators', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/excavators/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/excavators/${id}`);
    return response.data;
  },
};

export const operatorService = {
  getAll: async (params) => {
    const response = await apiClient.get('/operators', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/operators/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/operators', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/operators/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/operators/${id}`);
    return response.data;
  },
};
