import React, { useEffect, useState } from 'react';
import { operatorService } from '../../services/equipmentService';
import { OPERATOR_STATUS, LICENSE_TYPE, SHIFT } from '../../config/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const OperatorList = () => {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');

  useEffect(() => {
    fetchOperators();
  }, [pagination.page]);

  const fetchOperators = async () => {
    setLoading(true);
    try {
      const res = await operatorService.getAll({ page: pagination.page, limit: pagination.limit });
      setOperators(res.data || []);
      setPagination((prev) => ({ ...prev, totalPages: res.meta?.totalPages || 1 }));
    } catch (error) {
      console.error('Failed to fetch operators:', error);
      setOperators([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (operator) => {
    setSelectedOperator(operator);
    setModalMode('view');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this operator?')) {
      try {
        await operatorService.delete(id);
        fetchOperators();
      } catch (error) {
        console.error('Failed to delete operator:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Operators</h1>
      </div>

      <div className="card table-container">
        <table className="data-table">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Employee No</th>
              <th className="table-header">Name</th>
              <th className="table-header">License Type</th>
              <th className="table-header">License Number</th>
              <th className="table-header">Shift</th>
              <th className="table-header">Status</th>
              <th className="table-header">Rating</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {operators.map((operator) => (
              <tr key={operator.id}>
                <td className="table-cell font-medium">{operator.employeeNumber}</td>
                <td className="table-cell">{operator.user?.fullName || '-'}</td>
                <td className="table-cell">{operator.licenseType}</td>
                <td className="table-cell">{operator.licenseNumber || '-'}</td>
                <td className="table-cell">{operator.shift || '-'}</td>
                <td className="table-cell">
                  <StatusBadge status={operator.status} />
                </td>
                <td className="table-cell">{operator.rating?.toFixed(1) || '-'}</td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button onClick={() => handleView(operator)} className="text-blue-600 hover:text-blue-800">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => handleDelete(operator.id)} className="text-red-600 hover:text-red-800">
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Operator Details" size="lg">
        {selectedOperator && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Employee Number</label>
                <p className="text-lg">{selectedOperator.employeeNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-lg">{selectedOperator.user?.fullName || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">License Type</label>
                <p className="text-lg">{selectedOperator.licenseType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">License Number</label>
                <p className="text-lg">{selectedOperator.licenseNumber || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Shift</label>
                <p className="text-lg">{selectedOperator.shift || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <StatusBadge status={selectedOperator.status} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Rating</label>
                <p className="text-lg">{selectedOperator.rating?.toFixed(1) || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Hours</label>
                <p className="text-lg">{selectedOperator.totalHours} hours</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Join Date</label>
                <p className="text-lg">{new Date(selectedOperator.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OperatorList;
