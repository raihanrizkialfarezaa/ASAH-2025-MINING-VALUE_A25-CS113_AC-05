import api from '../config/api';

class ExcavatorService {
  async getAll(params = {}) {
    try {
      const response = await api.get('/excavators', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get excavators:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`/excavators/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get excavator:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const response = await api.post('/excavators', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create excavator:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`/excavators/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update excavator:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`/excavators/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete excavator:', error);
      throw error;
    }
  }
}

const excavatorService = new ExcavatorService();
export default excavatorService;
