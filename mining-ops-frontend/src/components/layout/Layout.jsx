import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Truck, Construction, Users, MapPin, Package, Wrench, CloudRain, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { authService } from '../../services/authService';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/trucks', icon: Truck, label: 'Trucks' },
    { path: '/excavators', icon: Construction, label: 'Excavators' },
    { path: '/operators', icon: Users, label: 'Operators' },
    { path: '/hauling', icon: Package, label: 'Hauling' },
    { path: '/locations', icon: MapPin, label: 'Locations' },
    { path: '/maintenance', icon: Wrench, label: 'Maintenance' },
    { path: '/weather', icon: CloudRain, label: 'Weather' },
    { path: '/production', icon: BarChart3, label: 'Production' },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({ path: '/users', icon: Settings, label: 'Users' });
  }

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`bg-mining-coal text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold">Mining Ops</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-700 rounded">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <Link key={item.path} to={item.path} className={`flex items-center space-x-3 px-3 py-2 rounded transition-colors ${isActive ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700">
          {sidebarOpen && user && (
            <div className="mb-3">
              <p className="text-sm font-medium">{user.fullName}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          )}
          <button onClick={handleLogout} className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-700 w-full">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
