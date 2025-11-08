import React, { useEffect, useState } from 'react';
import { haulingService } from '../../services/haulingService';
import { truckService, excavatorService, operatorService } from '../../services';
import { loadingPointService, dumpingPointService, roadSegmentService } from '../../services/locationService';
import { HAULING_STATUS } from '../../config/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

const HaulingList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [trucks, setTrucks] = useState([]);
  const [excavators, setExcavators] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState([]);
  const [dumpingPoints, setDumpingPoints] = useState([]);
  const [roadSegments, setRoadSegments] = useState([]);
  const [formData, setFormData] = useState({
    activityNumber: '',
    truckId: '',
    excavatorId: '',
    operatorId: '',
    loadingPointId: '',
    dumpingPointId: '',
    roadSegmentId: '',
    shift: 'PAGI',
    loadingStartTime: '',
    loadWeight: '',
    targetWeight: '',
    distance: '',
    status: 'LOADING',
    remarks: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await haulingService.getAll({ page: pagination.page, limit: pagination.limit });
        setActivities(res.data || []);
        setPagination((prev) => ({ ...prev, totalPages: res.meta?.totalPages || 1 }));
      } catch (error) {
        console.error('Failed to fetch hauling activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const [trucksRes, excavatorsRes, operatorsRes, loadingRes, dumpingRes, roadsRes] = await Promise.all([
          truckService.getAll(),
          excavatorService.getAll(),
          operatorService.getAll(),
          loadingPointService.getAll(),
          dumpingPointService.getAll(),
          roadSegmentService.getAll(),
        ]);
        setTrucks(Array.isArray(trucksRes.data) ? trucksRes.data : []);
        setExcavators(Array.isArray(excavatorsRes.data) ? excavatorsRes.data : []);
        setOperators(Array.isArray(operatorsRes.data) ? operatorsRes.data : []);
        setLoadingPoints(Array.isArray(loadingRes.data) ? loadingRes.data : []);
        setDumpingPoints(Array.isArray(dumpingRes.data) ? dumpingRes.data : []);
        setRoadSegments(Array.isArray(roadsRes.data) ? roadsRes.data : []);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      }
    };
    loadResources();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const res = await haulingService.getAll({ page: pagination.page, limit: pagination.limit });
      setActivities(res.data || []);
      setPagination((prev) => ({ ...prev, totalPages: res.meta?.totalPages || 1 }));
    } catch (error) {
      console.error('Failed to fetch hauling activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      activityNumber: '',
      truckId: '',
      excavatorId: '',
      operatorId: '',
      loadingPointId: '',
      dumpingPointId: '',
      roadSegmentId: '',
      shift: 'PAGI',
      loadingStartTime: '',
      loadWeight: '',
      targetWeight: '',
      distance: '',
      status: 'LOADING',
      remarks: '',
    });
    setShowModal(true);
  };

  const handleEdit = (activity) => {
    setModalMode('edit');
    setSelectedActivity(activity);
    setFormData({
      activityNumber: activity.activityNumber || '',
      truckId: activity.truckId || '',
      excavatorId: activity.excavatorId || '',
      operatorId: activity.operatorId || '',
      loadingPointId: activity.loadingPointId || '',
      dumpingPointId: activity.dumpingPointId || '',
      roadSegmentId: activity.roadSegmentId || '',
      shift: activity.shift || 'PAGI',
      loadingStartTime: activity.loadingStartTime ? new Date(activity.loadingStartTime).toISOString().slice(0, 16) : '',
      loadWeight: activity.loadWeight || '',
      targetWeight: activity.targetWeight || '',
      distance: activity.distance || '',
      status: activity.status || 'LOADING',
      remarks: activity.remarks || '',
    });
    setShowModal(true);
  };

  const handleView = (activity) => {
    setSelectedActivity(activity);
    setModalMode('view');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        activityNumber: formData.activityNumber.trim(),
        truckId: formData.truckId,
        excavatorId: formData.excavatorId,
        operatorId: formData.operatorId,
        loadingPointId: formData.loadingPointId,
        dumpingPointId: formData.dumpingPointId,
        shift: formData.shift,
        loadingStartTime: new Date(formData.loadingStartTime).toISOString(),
        loadWeight: parseFloat(formData.loadWeight),
        targetWeight: parseFloat(formData.targetWeight),
        distance: parseFloat(formData.distance),
        status: formData.status,
      };

      if (formData.roadSegmentId) payload.roadSegmentId = formData.roadSegmentId;
      if (formData.remarks) payload.remarks = formData.remarks.trim();

      if (modalMode === 'create') {
        await haulingService.create(payload);
      } else {
        await haulingService.update(selectedActivity.id, payload);
      }

      setShowModal(false);
      fetchActivities();
    } catch (error) {
      console.error('Failed to save hauling activity:', error);
      if (error.response?.data?.message) {
        window.alert(error.response.data.message);
      } else {
        window.alert('Failed to save hauling activity. Please check your input.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this hauling activity?')) {
      try {
        await haulingService.cancel(id, 'Cancelled by user');
        fetchActivities();
      } catch (error) {
        console.error('Failed to cancel hauling activity:', error);
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
        <h1 className="text-3xl font-bold">Hauling Activities</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Hauling Activity</span>
        </button>
      </div>

      <div className="card table-container">
        <table className="data-table">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Activity Number</th>
              <th className="table-header">Truck</th>
              <th className="table-header">Excavator</th>
              <th className="table-header">Load Weight (ton)</th>
              <th className="table-header">Distance (km)</th>
              <th className="table-header">Shift</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="table-cell font-medium">{activity.activityNumber}</td>
                <td className="table-cell">{activity.truck?.code || '-'}</td>
                <td className="table-cell">{activity.excavator?.code || '-'}</td>
                <td className="table-cell">{activity.loadWeight}</td>
                <td className="table-cell">{activity.distance}</td>
                <td className="table-cell">{activity.shift}</td>
                <td className="table-cell">
                  <StatusBadge status={activity.status} />
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button onClick={() => handleView(activity)} className="text-blue-600 hover:text-blue-800">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleEdit(activity)} className="text-green-600 hover:text-green-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(activity.id)} className="text-red-600 hover:text-red-800">
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'create' ? 'Add Hauling Activity' : modalMode === 'edit' ? 'Edit Hauling Activity' : 'Hauling Activity Details'} size="xl">
        {modalMode === 'view' && selectedActivity ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Activity Number</label>
                <p className="text-lg">{selectedActivity.activityNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Truck</label>
                <p className="text-lg">{selectedActivity.truck?.code || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Excavator</label>
                <p className="text-lg">{selectedActivity.excavator?.code || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Operator</label>
                <p className="text-lg">{selectedActivity.operator?.user?.fullName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Load Weight</label>
                <p className="text-lg">{selectedActivity.loadWeight} ton</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Distance</label>
                <p className="text-lg">{selectedActivity.distance} km</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Shift</label>
                <p className="text-lg">{selectedActivity.shift}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <StatusBadge status={selectedActivity.status} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Cycle Time</label>
                <p className="text-lg">{selectedActivity.totalCycleTime} min</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Loading Duration</label>
                <p className="text-lg">{selectedActivity.loadingDuration} min</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Hauling Duration</label>
                <p className="text-lg">{selectedActivity.haulingDuration} min</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Dumping Duration</label>
                <p className="text-lg">{selectedActivity.dumpingDuration} min</p>
              </div>
              {selectedActivity.remarks && (
                <div className="col-span-3">
                  <label className="text-sm font-medium text-gray-600">Remarks</label>
                  <p className="text-lg">{selectedActivity.remarks}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Activity Number *</label>
                <input type="text" value={formData.activityNumber} onChange={(e) => setFormData({ ...formData, activityNumber: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift *</label>
                <select value={formData.shift} onChange={(e) => setFormData({ ...formData, shift: e.target.value })} className="input-field" required>
                  <option value="PAGI">Pagi</option>
                  <option value="SIANG">Siang</option>
                  <option value="MALAM">Malam</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Truck *</label>
                <select value={formData.truckId} onChange={(e) => setFormData({ ...formData, truckId: e.target.value })} className="input-field" required>
                  <option value="">Select Truck</option>
                  {trucks.map((truck) => (
                    <option key={truck.id} value={truck.id}>
                      {truck.code} - {truck.brand}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excavator *</label>
                <select value={formData.excavatorId} onChange={(e) => setFormData({ ...formData, excavatorId: e.target.value })} className="input-field" required>
                  <option value="">Select Excavator</option>
                  {excavators.map((excavator) => (
                    <option key={excavator.id} value={excavator.id}>
                      {excavator.code} - {excavator.brand}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operator *</label>
                <select value={formData.operatorId} onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })} className="input-field" required>
                  <option value="">Select Operator</option>
                  {operators.map((operator) => (
                    <option key={operator.id} value={operator.id}>
                      {operator.employeeNumber} - {operator.user?.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loading Point *</label>
                <select value={formData.loadingPointId} onChange={(e) => setFormData({ ...formData, loadingPointId: e.target.value })} className="input-field" required>
                  <option value="">Select Loading Point</option>
                  {loadingPoints.map((point) => (
                    <option key={point.id} value={point.id}>
                      {point.code} - {point.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dumping Point *</label>
                <select value={formData.dumpingPointId} onChange={(e) => setFormData({ ...formData, dumpingPointId: e.target.value })} className="input-field" required>
                  <option value="">Select Dumping Point</option>
                  {dumpingPoints.map((point) => (
                    <option key={point.id} value={point.id}>
                      {point.code} - {point.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Road Segment</label>
                <select value={formData.roadSegmentId} onChange={(e) => setFormData({ ...formData, roadSegmentId: e.target.value })} className="input-field">
                  <option value="">Select Road Segment</option>
                  {roadSegments.map((segment) => (
                    <option key={segment.id} value={segment.id}>
                      {segment.code} - {segment.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loading Start Time *</label>
                <input type="datetime-local" value={formData.loadingStartTime} onChange={(e) => setFormData({ ...formData, loadingStartTime: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Load Weight (ton) *</label>
                <input type="number" step="0.01" value={formData.loadWeight} onChange={(e) => setFormData({ ...formData, loadWeight: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight (ton) *</label>
                <input type="number" step="0.01" value={formData.targetWeight} onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km) *</label>
                <input type="number" step="0.01" value={formData.distance} onChange={(e) => setFormData({ ...formData, distance: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input-field" required>
                  <option value="LOADING">Loading</option>
                  <option value="HAULING">Hauling</option>
                  <option value="DUMPING">Dumping</option>
                  <option value="RETURNING">Returning</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
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

export default HaulingList;
