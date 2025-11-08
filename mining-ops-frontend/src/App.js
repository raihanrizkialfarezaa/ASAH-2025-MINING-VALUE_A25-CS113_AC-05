import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './services/authService';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TruckList from './pages/trucks/TruckList';
import ExcavatorList from './pages/excavators/ExcavatorList';
import OperatorList from './pages/operators/OperatorList';
import HaulingList from './pages/hauling/HaulingList';
import LocationManagement from './pages/locations/LocationManagement';
import MaintenanceList from './pages/maintenance/MaintenanceList';
import WeatherList from './pages/weather/WeatherList';
import ProductionList from './pages/production/ProductionList';
import UserList from './pages/users/UserList';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/trucks" element={<TruckList />} />
                  <Route path="/excavators" element={<ExcavatorList />} />
                  <Route path="/operators" element={<OperatorList />} />
                  <Route path="/hauling" element={<HaulingList />} />
                  <Route path="/locations" element={<LocationManagement />} />
                  <Route path="/maintenance" element={<MaintenanceList />} />
                  <Route path="/weather" element={<WeatherList />} />
                  <Route path="/production" element={<ProductionList />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
