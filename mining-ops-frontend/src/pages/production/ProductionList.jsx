import React, { useEffect, useState } from 'react';
import { productionService } from '../../services';
import { miningSiteService } from '../../services/locationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const ProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [statistics, setStatistics] = useState(null);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [miningSites, setMiningSites] = useState([]);
  const [formData, setFormData] = useState({
    recordDate: new Date().toISOString().split('T')[0],
    shift: 'PAGI',
    miningSiteId: '',
    targetProduction: '',
    actualProduction: '',
    avgCalori: '',
    avgAshContent: '',
    avgSulfur: '',
    avgMoisture: '',
    totalTrips: '',
    totalDistance: '',
    totalFuel: '',
    avgCycleTime: '',
    trucksOperating: '',
    trucksBreakdown: '',
    excavatorsOperating: '',
    excavatorsBreakdown: '',
    utilizationRate: '',
    downtimeHours: '',
    remarks: '',
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await productionService.getAll({ page: pagination.page, limit: pagination.limit });
        setProductions(res.data || []);
        setPagination((prev) => ({ ...prev, totalPages: res.meta?.totalPages || 1 }));
      } catch (error) {
        console.error('Failed to fetch production records:', error);
        setProductions([]);
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

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const res = await productionService.getStatistics();
        setStatistics(res.data || null);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        setStatistics(null);
      }
    };
    loadStatistics();
  }, []);

  const fetchProductions = async () => {
    setLoading(true);
    try {
      const res = await productionService.getAll({ page: pagination.page, limit: pagination.limit });
      setProductions(res.data || []);
      setPagination((prev) => ({ ...prev, totalPages: res.meta?.totalPages || 1 }));
    } catch (error) {
      console.error('Failed to fetch production records:', error);
      setProductions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      recordDate: new Date().toISOString().split('T')[0],
      shift: 'PAGI',
      miningSiteId: '',
      targetProduction: '',
      actualProduction: '',
      avgCalori: '',
      avgAshContent: '',
      avgSulfur: '',
      avgMoisture: '',
      totalTrips: '',
      totalDistance: '',
      totalFuel: '',
      avgCycleTime: '',
      trucksOperating: '',
      trucksBreakdown: '',
      excavatorsOperating: '',
      excavatorsBreakdown: '',
      utilizationRate: '',
      downtimeHours: '',
      remarks: '',
    });
    setShowModal(true);
  };

  const handleEdit = (production) => {
    setModalMode('edit');
    setSelectedProduction(production);
    setFormData({
      recordDate: new Date(production.recordDate).toISOString().split('T')[0],
      shift: production.shift,
      miningSiteId: production.miningSiteId || '',
      targetProduction: production.targetProduction || '',
      actualProduction: production.actualProduction || '',
      avgCalori: production.avgCalori || '',
      avgAshContent: production.avgAshContent || '',
      avgSulfur: production.avgSulfur || '',
      avgMoisture: production.avgMoisture || '',
      totalTrips: production.totalTrips || '',
      totalDistance: production.totalDistance || '',
      totalFuel: production.totalFuel || '',
      avgCycleTime: production.avgCycleTime || '',
      trucksOperating: production.trucksOperating || '',
      trucksBreakdown: production.trucksBreakdown || '',
      excavatorsOperating: production.excavatorsOperating || '',
      excavatorsBreakdown: production.excavatorsBreakdown || '',
      utilizationRate: production.utilizationRate || '',
      downtimeHours: production.downtimeHours || '',
      remarks: production.remarks || '',
    });
    setShowModal(true);
  };

  const handleView = (production) => {
    setSelectedProduction(production);
    setModalMode('view');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        recordDate: new Date(formData.recordDate).toISOString(),
        shift: formData.shift,
        miningSiteId: formData.miningSiteId,
        targetProduction: parseFloat(formData.targetProduction),
        actualProduction: parseFloat(formData.actualProduction),
      };

      if (formData.avgCalori) payload.avgCalori = parseFloat(formData.avgCalori);
      if (formData.avgAshContent) payload.avgAshContent = parseFloat(formData.avgAshContent);
      if (formData.avgSulfur) payload.avgSulfur = parseFloat(formData.avgSulfur);
      if (formData.avgMoisture) payload.avgMoisture = parseFloat(formData.avgMoisture);
      if (formData.totalTrips) payload.totalTrips = parseInt(formData.totalTrips);
      if (formData.totalDistance) payload.totalDistance = parseFloat(formData.totalDistance);
      if (formData.totalFuel) payload.totalFuel = parseFloat(formData.totalFuel);
      if (formData.avgCycleTime) payload.avgCycleTime = parseFloat(formData.avgCycleTime);
      if (formData.trucksOperating) payload.trucksOperating = parseInt(formData.trucksOperating);
      if (formData.trucksBreakdown) payload.trucksBreakdown = parseInt(formData.trucksBreakdown);
      if (formData.excavatorsOperating) payload.excavatorsOperating = parseInt(formData.excavatorsOperating);
      if (formData.excavatorsBreakdown) payload.excavatorsBreakdown = parseInt(formData.excavatorsBreakdown);
      if (formData.utilizationRate) payload.utilizationRate = parseFloat(formData.utilizationRate);
      if (formData.downtimeHours) payload.downtimeHours = parseFloat(formData.downtimeHours);
      if (formData.remarks) payload.remarks = formData.remarks.trim();

      if (modalMode === 'create') {
        await productionService.create(payload);
      } else {
        await productionService.update(selectedProduction.id, payload);
      }

      setShowModal(false);
      fetchProductions();
    } catch (error) {
      console.error('Failed to save production record:', error);
      if (error.response?.data?.message) {
        window.alert(error.response.data.message);
      } else {
        window.alert('Failed to save production record. Please check your input.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this production record?')) {
      try {
        await productionService.delete(id);
        fetchProductions();
      } catch (error) {
        console.error('Failed to delete production record:', error);
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
        <h1 className="text-3xl font-bold">Production Records</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Production Record</span>
        </button>
      </div>

      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Production</p>
            <p className="text-2xl font-bold">{statistics.totalProduction?.toFixed(0) || 0} ton</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Average Achievement</p>
            <p className="text-2xl font-bold">{statistics.avgAchievement?.toFixed(1) || 0}%</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Total Trips</p>
            <p className="text-2xl font-bold">{statistics.totalTrips || 0}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Avg Cycle Time</p>
            <p className="text-2xl font-bold">{statistics.avgCycleTime?.toFixed(1) || 0} min</p>
          </div>
        </div>
      )}

      <div className="card table-container">
        <table className="data-table">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Date</th>
              <th className="table-header">Shift</th>
              <th className="table-header">Mining Site</th>
              <th className="table-header">Target (ton)</th>
              <th className="table-header">Actual (ton)</th>
              <th className="table-header">Achievement (%)</th>
              <th className="table-header">Total Trips</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productions.map((production) => (
              <tr key={production.id}>
                <td className="table-cell">{new Date(production.recordDate).toLocaleDateString()}</td>
                <td className="table-cell">{production.shift}</td>
                <td className="table-cell">{production.miningSite?.name || '-'}</td>
                <td className="table-cell">{production.targetProduction.toFixed(0)}</td>
                <td className="table-cell">{production.actualProduction.toFixed(0)}</td>
                <td className="table-cell">
                  <span className={`font-semibold ${production.achievement >= 100 ? 'text-green-600' : 'text-orange-600'}`}>{production.achievement.toFixed(1)}%</span>
                </td>
                <td className="table-cell">{production.totalTrips}</td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button onClick={() => handleView(production)} className="text-blue-600 hover:text-blue-800">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleEdit(production)} className="text-green-600 hover:text-green-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(production.id)} className="text-red-600 hover:text-red-800">
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={modalMode === 'create' ? 'Add Production Record' : modalMode === 'edit' ? 'Edit Production Record' : 'Production Details'} size="2xl">
        {modalMode === 'view' && selectedProduction ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Record Date</label>
                <p className="text-lg">{new Date(selectedProduction.recordDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Shift</label>
                <p className="text-lg">{selectedProduction.shift}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-600">Mining Site</label>
                <p className="text-lg">{selectedProduction.miningSite?.name || '-'}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Production Data</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Target Production</label>
                  <p className="text-lg">{selectedProduction.targetProduction.toFixed(0)} ton</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Actual Production</label>
                  <p className="text-lg">{selectedProduction.actualProduction.toFixed(0)} ton</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Achievement</label>
                  <p className={`text-lg font-semibold ${selectedProduction.achievement >= 100 ? 'text-green-600' : 'text-orange-600'}`}>{selectedProduction.achievement.toFixed(1)}%</p>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Coal Quality</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Avg Calori</label>
                  <p className="text-lg">{selectedProduction.avgCalori || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Avg Ash Content</label>
                  <p className="text-lg">{selectedProduction.avgAshContent || '-'}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Avg Sulfur</label>
                  <p className="text-lg">{selectedProduction.avgSulfur || '-'}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Avg Moisture</label>
                  <p className="text-lg">{selectedProduction.avgMoisture || '-'}%</p>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Operations</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Trips</label>
                  <p className="text-lg">{selectedProduction.totalTrips}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Distance</label>
                  <p className="text-lg">{selectedProduction.totalDistance} km</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Fuel</label>
                  <p className="text-lg">{selectedProduction.totalFuel} L</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Avg Cycle Time</label>
                  <p className="text-lg">{selectedProduction.avgCycleTime || '-'} min</p>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Equipment</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Trucks Operating</label>
                  <p className="text-lg">{selectedProduction.trucksOperating}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Trucks Breakdown</label>
                  <p className="text-lg">{selectedProduction.trucksBreakdown}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Excavators Operating</label>
                  <p className="text-lg">{selectedProduction.excavatorsOperating}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Excavators Breakdown</label>
                  <p className="text-lg">{selectedProduction.excavatorsBreakdown}</p>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Efficiency</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Utilization Rate</label>
                  <p className="text-lg">{selectedProduction.utilizationRate || '-'}%</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Downtime Hours</label>
                  <p className="text-lg">{selectedProduction.downtimeHours} hrs</p>
                </div>
              </div>
            </div>
            {selectedProduction.remarks && (
              <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-600">Remarks</label>
                <p className="text-lg">{selectedProduction.remarks}</p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Record Date *</label>
                <input type="date" value={formData.recordDate} onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })} className="input-field" required />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Mining Site *</label>
                <select value={formData.miningSiteId} onChange={(e) => setFormData({ ...formData, miningSiteId: e.target.value })} className="input-field" required>
                  <option value="">Select Mining Site</option>
                  {miningSites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.code} - {site.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Production Data</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Production (ton) *</label>
                  <input type="number" step="0.01" value={formData.targetProduction} onChange={(e) => setFormData({ ...formData, targetProduction: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Actual Production (ton) *</label>
                  <input type="number" step="0.01" value={formData.actualProduction} onChange={(e) => setFormData({ ...formData, actualProduction: e.target.value })} className="input-field" required />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Coal Quality (Optional)</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avg Calori</label>
                  <input type="number" step="0.01" value={formData.avgCalori} onChange={(e) => setFormData({ ...formData, avgCalori: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avg Ash Content (%)</label>
                  <input type="number" step="0.01" value={formData.avgAshContent} onChange={(e) => setFormData({ ...formData, avgAshContent: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avg Sulfur (%)</label>
                  <input type="number" step="0.01" value={formData.avgSulfur} onChange={(e) => setFormData({ ...formData, avgSulfur: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avg Moisture (%)</label>
                  <input type="number" step="0.01" value={formData.avgMoisture} onChange={(e) => setFormData({ ...formData, avgMoisture: e.target.value })} className="input-field" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Operations (Optional)</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Trips</label>
                  <input type="number" value={formData.totalTrips} onChange={(e) => setFormData({ ...formData, totalTrips: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Distance (km)</label>
                  <input type="number" step="0.01" value={formData.totalDistance} onChange={(e) => setFormData({ ...formData, totalDistance: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Fuel (L)</label>
                  <input type="number" step="0.01" value={formData.totalFuel} onChange={(e) => setFormData({ ...formData, totalFuel: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Avg Cycle Time (min)</label>
                  <input type="number" step="0.01" value={formData.avgCycleTime} onChange={(e) => setFormData({ ...formData, avgCycleTime: e.target.value })} className="input-field" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Equipment (Optional)</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trucks Operating</label>
                  <input type="number" value={formData.trucksOperating} onChange={(e) => setFormData({ ...formData, trucksOperating: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trucks Breakdown</label>
                  <input type="number" value={formData.trucksBreakdown} onChange={(e) => setFormData({ ...formData, trucksBreakdown: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excavators Operating</label>
                  <input type="number" value={formData.excavatorsOperating} onChange={(e) => setFormData({ ...formData, excavatorsOperating: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excavators Breakdown</label>
                  <input type="number" value={formData.excavatorsBreakdown} onChange={(e) => setFormData({ ...formData, excavatorsBreakdown: e.target.value })} className="input-field" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Efficiency (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Utilization Rate (%)</label>
                  <input type="number" step="0.01" value={formData.utilizationRate} onChange={(e) => setFormData({ ...formData, utilizationRate: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Downtime Hours</label>
                  <input type="number" step="0.01" value={formData.downtimeHours} onChange={(e) => setFormData({ ...formData, downtimeHours: e.target.value })} className="input-field" />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
              <textarea value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} className="input-field" rows="2" />
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

export default ProductionList;
