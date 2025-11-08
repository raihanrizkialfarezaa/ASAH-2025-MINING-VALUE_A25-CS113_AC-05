import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ type = 'info', message, onClose }) => {
  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.textColor} p-4 rounded-lg shadow-lg flex items-center space-x-3`}>
      <Icon className={config.iconColor} size={20} />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70">
          <XCircle size={16} />
        </button>
      )}
    </div>
  );
};

export default Toast;
