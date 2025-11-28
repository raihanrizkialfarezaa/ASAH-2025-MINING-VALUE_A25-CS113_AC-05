import api from '../config/api';

class RoadSegmentService {
  async getAll(params = {}) {
    try {
      const response = await api.get('/locations/road-segments', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to get road segments:', error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const response = await api.get(`/locations/road-segments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get road segment:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const response = await api.post('/locations/road-segments', data);
      return response.data;
    } catch (error) {
      console.error('Failed to create road segment:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const response = await api.put(`/locations/road-segments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update road segment:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`/locations/road-segments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete road segment:', error);
      throw error;
    }
  }
}

const roadSegmentService = new RoadSegmentService();
export default roadSegmentService;
