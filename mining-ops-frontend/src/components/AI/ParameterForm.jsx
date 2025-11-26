import React, { useState, useEffect } from 'react';
import excavatorService from '../../services/excavatorService';
import vesselService from '../../services/vesselService';

const ParameterForm = ({ onSubmit, realtimeData, loading }) => {
  const [formData, setFormData] = useState({
    weatherCondition: 'Cerah',
    roadCondition: 'GOOD',
    shift: 'SHIFT_1',
    targetRoadId: '',
    targetExcavatorId: '',
    targetScheduleId: '',
    truckOptions: [5, 10, 15],
    excavatorOptions: [1, 2],
  });

  const [excavators, setExcavators] = useState([]);
  const [roadSegments, setRoadSegments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    loadFormOptions();
  }, []);

  useEffect(() => {
    if (realtimeData) {
      // Auto-populate from realtime data
      if (realtimeData.resources) {
        setExcavators(realtimeData.resources.excavators || []);
        setRoadSegments(realtimeData.resources.roadSegments || []);
      }
      if (realtimeData.upcomingSchedules) {
        setSchedules(realtimeData.upcomingSchedules);
      }
      if (realtimeData.weather) {
        setFormData((prev) => ({
          ...prev,
          weatherCondition: realtimeData.weather.condition || 'Cerah',
        }));
      }
    }
  }, [realtimeData]);

  const loadFormOptions = async () => {
    try {
      const [excavatorRes, scheduleRes] = await Promise.all([excavatorService.getAll({ status: 'OPERATIONAL' }), vesselService.getAllSchedules({ status: 'SCHEDULED' })]);

      if (excavatorRes.data?.data) {
        setExcavators(excavatorRes.data.data);
      }
      if (scheduleRes.data?.data) {
        setSchedules(scheduleRes.data.data);
      }
    } catch (error) {
      console.error('Failed to load form options:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (field, value) => {
    const numbers = value
      .split(',')
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));
    setFormData((prev) => ({
      ...prev,
      [field]: numbers,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.targetRoadId || !formData.targetExcavatorId) {
      alert('Please select Road Segment and Excavator');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weather Condition</label>
          <select name="weatherCondition" value={formData.weatherCondition} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Cerah">Cerah</option>
            <option value="Hujan Ringan">Hujan Ringan</option>
            <option value="Hujan Lebat">Hujan Lebat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Road Condition</label>
          <select name="roadCondition" value={formData.roadCondition} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
            <option value="LICIN">Licin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
          <select name="shift" value={formData.shift} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="SHIFT_1">Shift 1</option>
            <option value="SHIFT_2">Shift 2</option>
            <option value="SHIFT_3">Shift 3</option>
          </select>
        </div>
      </div>

      {/* Resource Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Road Segment <span className="text-red-500">*</span>
          </label>
          <select name="targetRoadId" value={formData.targetRoadId} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Road Segment</option>
            {roadSegments.map((road) => (
              <option key={road.id} value={road.id}>
                {road.code} - {road.name} ({road.distance}km)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excavator <span className="text-red-500">*</span>
          </label>
          <select name="targetExcavatorId" value={formData.targetExcavatorId} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Excavator</option>
            {excavators.map((exc) => (
              <option key={exc.id} value={exc.id}>
                {exc.code} - {exc.model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Optional: Sailing Schedule */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Sailing Schedule (Optional)</label>
        <select name="targetScheduleId" value={formData.targetScheduleId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">No specific schedule</option>
          {schedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>
              {schedule.vessel?.name} - {new Date(schedule.etsLoading).toLocaleDateString()} ({schedule.plannedQuantity}T)
            </option>
          ))}
        </select>
      </div>

      {/* Decision Variables */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Decision Variables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Truck Options (comma-separated)</label>
            <input
              type="text"
              value={formData.truckOptions.join(', ')}
              onChange={(e) => handleArrayChange('truckOptions', e.target.value)}
              placeholder="5, 10, 15"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Example: 5, 10, 15 (will test 3 scenarios)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excavator Options (comma-separated)</label>
            <input
              type="text"
              value={formData.excavatorOptions.join(', ')}
              onChange={(e) => handleArrayChange('excavatorOptions', e.target.value)}
              placeholder="1, 2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Example: 1, 2 (will test 2 scenarios)</p>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="border-t pt-4">
        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {showAdvanced ? '▼' : '▶'} Advanced Options (Financial Parameters)
        </button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
            <p className="col-span-2 text-sm text-gray-600">Leave empty to use default values from system</p>
            {/* Add financial parameter inputs if needed */}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed">
          {loading ? 'Simulating...' : 'Get Recommendations'}
        </button>
      </div>
    </form>
  );
};

export default ParameterForm;
