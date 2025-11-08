import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusColor = () => {
    const statusColors = {
      ACTIVE: 'bg-green-100 text-green-800',
      IDLE: 'bg-gray-100 text-gray-800',
      HAULING: 'bg-blue-100 text-blue-800',
      LOADING: 'bg-yellow-100 text-yellow-800',
      DUMPING: 'bg-orange-100 text-orange-800',
      MAINTENANCE: 'bg-purple-100 text-purple-800',
      BREAKDOWN: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-green-100 text-green-800',
      DELAYED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      IN_QUEUE: 'bg-yellow-100 text-yellow-800',
      STANDBY: 'bg-blue-100 text-blue-800',
      SCHEDULED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  return <span className={`badge ${getStatusColor()}`}>{status}</span>;
};

export default StatusBadge;
