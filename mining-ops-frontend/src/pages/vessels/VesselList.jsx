import React, { useEffect, useState, useCallback } from 'react';
import { vesselService } from '../../services/equipmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const VesselList = () => {
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('view');
  const [formData, setFormData] = useState({ code: '', name: '', vesselType: 'BARGE', capacity: '', owner: '', isOwned: false, gt: '', dwt: '', loa: '' });

  const fetchVessels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vesselService.getAll({ page: pagination.page, limit: pagination.limit });
      setVessels(res.data || []);
      setPagination((p) => ({ ...p, totalPages: res.meta?.totalPages || 1 }));
    } catch (err) {
      setVessels([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchVessels();
  }, [fetchVessels]);

  const handleCreate = () => {
    setMode('create');
    setFormData({ code: '', name: '', vesselType: 'BARGE', capacity: '', owner: '', isOwned: false, gt: '', dwt: '', loa: '' });
    setShowModal(true);
  };
  const handleEdit = (v) => {
    setMode('edit');
    setSelected(v);
    setFormData({ code: v.code, name: v.name, vesselType: v.vesselType, capacity: v.capacity, owner: v.owner || '', isOwned: v.isOwned || false, gt: v.gt || '', dwt: v.dwt || '', loa: v.loa || '' });
    setShowModal(true);
  };
  const handleView = (v) => {
    setSelected(v);
    setMode('view');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {};
      if (formData.code) payload.code = formData.code.toString().trim();
      if (formData.name) payload.name = formData.name.toString().trim();
      if (formData.vesselType) payload.vesselType = formData.vesselType;
      if (formData.owner) payload.owner = formData.owner.toString().trim();
      const capacity = formData.capacity !== '' ? Number(formData.capacity) : undefined;
      if (capacity !== undefined && !Number.isNaN(capacity)) payload.capacity = capacity;
      const gt = formData.gt !== '' ? Number(formData.gt) : undefined;
      if (gt !== undefined && !Number.isNaN(gt)) payload.gt = gt;
      const dwt = formData.dwt !== '' ? Number(formData.dwt) : undefined;
      if (dwt !== undefined && !Number.isNaN(dwt)) payload.dwt = dwt;
      const loa = formData.loa !== '' ? Number(formData.loa) : undefined;
      if (loa !== undefined && !Number.isNaN(loa)) payload.loa = loa;
      payload.isOwned = !!formData.isOwned;

      if (mode === 'create') {
        if (!payload.code || !payload.name || payload.capacity === undefined) {
          window.alert('Code, name and capacity are required');
          return;
        }
        await vesselService.create(payload);
      } else {
        await vesselService.update(selected.id, payload);
      }

      setShowModal(false);
      fetchVessels();
    } catch (err) {
      if (err.response?.data?.message) window.alert(err.response.data.message);
      else window.alert('Failed to save vessel');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vessel?')) return;
    try {
      await vesselService.delete(id);
      fetchVessels();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vessels</h1>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Vessel</span>
        </button>
      </div>

      <div className="card table-container">
        <table className="data-table">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Code</th>
              <th className="table-header">Name</th>
              <th className="table-header">Type</th>
              <th className="table-header">Capacity</th>
              <th className="table-header">Owner</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vessels.map((v) => (
              <tr key={v.id}>
                <td className="table-cell font-medium">{v.code}</td>
                <td className="table-cell">{v.name}</td>
                <td className="table-cell">{v.vesselType}</td>
                <td className="table-cell">{v.capacity}</td>
                <td className="table-cell">{v.owner || '-'}</td>
                <td className="table-cell">
                  <StatusBadge status={v.status} />
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button onClick={() => handleView(v)} className="text-blue-600 hover:text-blue-800">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleEdit(v)} className="text-green-600 hover:text-green-800">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} onPageChange={(page) => setPagination((p) => ({ ...p, page }))} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={mode === 'create' ? 'Add Vessel' : mode === 'edit' ? 'Edit Vessel' : 'Vessel Details'} size="lg">
        {mode === 'view' && selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Code</label>
                <p className="text-lg">{selected.code}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-lg">{selected.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-lg">{selected.vesselType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Capacity</label>
                <p className="text-lg">{selected.capacity} ton</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select value={formData.vesselType} onChange={(e) => setFormData({ ...formData, vesselType: e.target.value })} className="input-field">
                  <option value="MOTHER_VESSEL">MOTHER_VESSEL</option>
                  <option value="BARGE">BARGE</option>
                  <option value="TUG_BOAT">TUG_BOAT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
                <input type="text" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacity (ton) *</label>
                <input type="number" step="0.1" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owned?</label>
                <input type="checkbox" checked={formData.isOwned} onChange={(e) => setFormData({ ...formData, isOwned: e.target.checked })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GT</label>
                <input type="number" step="0.1" value={formData.gt} onChange={(e) => setFormData({ ...formData, gt: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">DWT</label>
                <input type="number" step="0.1" value={formData.dwt} onChange={(e) => setFormData({ ...formData, dwt: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LOA (m)</label>
                <input type="number" step="0.1" value={formData.loa} onChange={(e) => setFormData({ ...formData, loa: e.target.value })} className="input-field" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {mode === 'create' ? 'Create' : 'Update'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default VesselList;
