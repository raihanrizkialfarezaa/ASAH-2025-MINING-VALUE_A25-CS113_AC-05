import React, { useEffect, useState } from 'react';
import { weatherService } from '../../services';
import { miningSiteService } from '../../services/locationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const WeatherList = () => {
  const [weathers, setWeathers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [selectedWeather, setSelectedWeather] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [miningSites, setMiningSites] = useState([]);
  const [formData, setFormData] = useState({
    miningSiteId: '',
    condition: 'CERAH',
    temperature: '',
    humidity: '',
    windSpeed: '',
    windDirection: '',
    rainfall: '',
    visibility: 'GOOD',
    waveHeight: '',
    seaCondition: '',
    remarks: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await weatherService.getAll({ page: pagination.page, limit: pagination.limit });
        setWeathers(res.data || []);
        setPagination((prev) => ({ ...prev, totalPages: res.meta?.totalPages || 1 }));
      } catch (error) {
        console.error('Failed to fetch weather logs:', error);
        setWeathers([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    const loadSites = async () => {
      try {
        const res = await miningSiteService.getAll();
        setMiningSites(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Failed to fetch mining sites:', error);
      }
    };
    loadSites();
  }, []);

  const fetchWeathers = async () => {
    setLoading(true);
    try {
      const res = await weatherService.getAll({ page: pagination.page, limit: pagination.limit });
      setWeathers(res.data || []);
      setPagination((prev) => ({ ...prev, totalPages: res.meta?.totalPages || 1 }));
    } catch (error) {
      console.error('Failed to fetch weather logs:', error);
      setWeathers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      miningSiteId: '',
      condition: 'CERAH',
      temperature: '',
      humidity: '',
      windSpeed: '',
      windDirection: '',
      rainfall: '',
      visibility: 'GOOD',
      waveHeight: '',
      seaCondition: '',
      remarks: '',
    });
    setShowModal(true);
  };

  const handleEdit = (weather) => {
    setModalMode('edit');
    setSelectedWeather(weather);
    setFormData({
      miningSiteId: weather.miningSiteId || '',
      condition: weather.condition,
      temperature: weather.temperature || '',
      humidity: weather.humidity || '',
      windSpeed: weather.windSpeed || '',
      windDirection: weather.windDirection || '',
      rainfall: weather.rainfall || '',
      visibility: weather.visibility,
      waveHeight: weather.waveHeight || '',
      seaCondition: weather.seaCondition || '',
      remarks: weather.remarks || '',
    });
    setShowModal(true);
  };

  const handleView = (weather) => {
    setSelectedWeather(weather);
    setModalMode('view');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        condition: formData.condition,
        visibility: formData.visibility,
      };

      if (formData.miningSiteId) payload.miningSiteId = formData.miningSiteId;
      if (formData.temperature) payload.temperature = parseFloat(formData.temperature);
      if (formData.humidity) payload.humidity = parseFloat(formData.humidity);
      if (formData.windSpeed) payload.windSpeed = parseFloat(formData.windSpeed);
      if (formData.windDirection) payload.windDirection = formData.windDirection.trim();
      if (formData.rainfall) payload.rainfall = parseFloat(formData.rainfall);
      if (formData.waveHeight) payload.waveHeight = parseFloat(formData.waveHeight);
      if (formData.seaCondition) payload.seaCondition = formData.seaCondition.trim();
      if (formData.remarks) payload.remarks = formData.remarks.trim();

      if (modalMode === 'create') {
        await weatherService.create(payload);
      } else {
        await weatherService.update(selectedWeather.id, payload);
      }

      setShowModal(false);
      fetchWeathers();
    } catch (error) {
      console.error('Failed to save weather:', error);
      if (error.response?.data?.message) {
        window.alert(error.response.data.message);
      } else {
        window.alert('Failed to save weather log. Please check your input.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this weather log?')) {
      try {
        await weatherService.delete(id);
        fetchWeathers();
      } catch (error) {
        console.error('Failed to delete weather:', error);
        if (error.response?.data?.message) {
          window.alert(error.response.data.message);
        }
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Weather Monitoring</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Weather Log</span>
        </button>
      </div>

      <div className="card table-container">
        <table className="data-table">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Timestamp</th>
              <th className="table-header">Mining Site</th>
              <th className="table-header">Condition</th>
              <th className="table-header">Temperature (°C)</th>
              <th className="table-header">Rainfall (mm)</th>
              <th className="table-header">Risk Level</th>
              <th className="table-header">Operational</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {weathers.map((weather) => (
              <tr key={weather.id}>
                <td className="table-cell">{new Date(weather.timestamp).toLocaleString()}</td>
                <td className="table-cell">{weather.miningSite?.name || '-'}</td>
                <td className="table-cell">{weather.condition}</td>
                <td className="table-cell">{weather.temperature || '-'}</td>
                <td className="table-cell">{weather.rainfall || '-'}</td>
                <td className="table-cell">
                  <StatusBadge status={weather.riskLevel} />
                </td>
                <td className="table-cell">
                  <span className={`badge ${weather.isOperational ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{weather.isOperational ? 'Yes' : 'No'}</span>
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button onClick={() => handleView(weather)} className="text-blue-600 hover:text-blue-800">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleEdit(weather)} className="text-green-600 hover:text-green-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(weather.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'create' ? 'Add Weather Log' : modalMode === 'edit' ? 'Edit Weather Log' : 'Weather Details'} size="lg">
        {modalMode === 'view' && selectedWeather ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Timestamp</label>
                <p className="text-lg">{new Date(selectedWeather.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Mining Site</label>
                <p className="text-lg">{selectedWeather.miningSite?.name || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Condition</label>
                <p className="text-lg">{selectedWeather.condition}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Visibility</label>
                <p className="text-lg">{selectedWeather.visibility}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Temperature</label>
                <p className="text-lg">{selectedWeather.temperature || '-'} °C</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Humidity</label>
                <p className="text-lg">{selectedWeather.humidity || '-'} %</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Wind Speed</label>
                <p className="text-lg">{selectedWeather.windSpeed || '-'} km/h</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Wind Direction</label>
                <p className="text-lg">{selectedWeather.windDirection || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Rainfall</label>
                <p className="text-lg">{selectedWeather.rainfall || '-'} mm</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Risk Level</label>
                <div className="mt-1">
                  <StatusBadge status={selectedWeather.riskLevel} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Operational</label>
                <p className="text-lg">{selectedWeather.isOperational ? 'Yes' : 'No'}</p>
              </div>
              {selectedWeather.remarks && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Remarks</label>
                  <p className="text-lg">{selectedWeather.remarks}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mining Site</label>
                <select value={formData.miningSiteId} onChange={(e) => setFormData({ ...formData, miningSiteId: e.target.value })} className="input-field">
                  <option value="">Select Mining Site</option>
                  {miningSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.code} - {site.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                <select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="input-field" required>
                  <option value="CERAH">Cerah</option>
                  <option value="BERAWAN">Berawan</option>
                  <option value="MENDUNG">Mendung</option>
                  <option value="HUJAN_RINGAN">Hujan Ringan</option>
                  <option value="HUJAN_SEDANG">Hujan Sedang</option>
                  <option value="HUJAN_LEBAT">Hujan Lebat</option>
                  <option value="BADAI">Badai</option>
                  <option value="KABUT">Kabut</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°C)</label>
                <input type="number" step="0.1" value={formData.temperature} onChange={(e) => setFormData({ ...formData, temperature: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Humidity (%)</label>
                <input type="number" step="0.1" value={formData.humidity} onChange={(e) => setFormData({ ...formData, humidity: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wind Speed (km/h)</label>
                <input type="number" step="0.1" value={formData.windSpeed} onChange={(e) => setFormData({ ...formData, windSpeed: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wind Direction</label>
                <input type="text" value={formData.windDirection} onChange={(e) => setFormData({ ...formData, windDirection: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rainfall (mm)</label>
                <input type="number" step="0.1" value={formData.rainfall} onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility *</label>
                <select value={formData.visibility} onChange={(e) => setFormData({ ...formData, visibility: e.target.value })} className="input-field" required>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="POOR">Poor</option>
                  <option value="VERY_POOR">Very Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wave Height (m)</label>
                <input type="number" step="0.1" value={formData.waveHeight} onChange={(e) => setFormData({ ...formData, waveHeight: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sea Condition</label>
                <input type="text" value={formData.seaCondition} onChange={(e) => setFormData({ ...formData, seaCondition: e.target.value })} className="input-field" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                <textarea value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} className="input-field" rows="2" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {modalMode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default WeatherList;
