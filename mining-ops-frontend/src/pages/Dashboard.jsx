import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services';
import { miningSiteService, loadingPointService, dumpingPointService, roadSegmentService } from '../services/locationService';
import { truckService, excavatorService, operatorService } from '../services/equipmentService';
import { productionService, weatherService } from '../services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Truck,
  Construction,
  Package,
  TrendingUp,
  AlertTriangle,
  Map as MapIcon,
  DollarSign,
  Users,
  Database,
  Activity,
  Clock,
  Wrench,
  CloudRain,
  Calendar,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Gauge,
  Target,
  Timer,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Fuel,
  Navigation,
} from 'lucide-react';
import MiningMap from '../components/MiningMap';

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapData, setMapData] = useState({
    sites: [],
    loadingPoints: [],
    dumpingPoints: [],
    roads: [],
  });
  const [operationalData, setOperationalData] = useState({
    trucks: [],
    excavators: [],
    operators: [],
    productions: [],
  });
  const [equipmentUtilization, setEquipmentUtilization] = useState(null);
  const [delayAnalysis, setDelayAnalysis] = useState(null);
  const [maintenanceOverview, setMaintenanceOverview] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [showDataPreview, setShowDataPreview] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overviewRes, sitesRes, loadingRes, dumpingRes, roadsRes, trucksRes, excRes, opRes, prodRes, equipmentUtilRes, delayRes, maintenanceRes, weatherRes] = await Promise.all([
        dashboardService.getOverview(),
        miningSiteService.getAll(),
        loadingPointService.getAll(),
        dumpingPointService.getAll(),
        roadSegmentService.getAll(),
        truckService.getAll({ limit: 20 }),
        excavatorService.getAll({ limit: 20 }),
        operatorService.getAll({ limit: 20 }),
        productionService.getAll({ limit: 20 }),
        dashboardService.getEquipmentUtilization().catch(() => ({ data: { trucks: [], excavators: [] } })),
        dashboardService.getDelayAnalysis().catch(() => ({ data: { byCategory: {}, totalDelays: 0 } })),
        dashboardService.getMaintenanceOverview().catch(() => ({ data: { upcoming: 0, overdue: 0, completed: 0 } })),
        weatherService.getLatest().catch(() => ({ data: null })),
      ]);

      setOverview(overviewRes.data);
      setMapData({
        sites: Array.isArray(sitesRes.data) ? sitesRes.data : [],
        loadingPoints: Array.isArray(loadingRes.data) ? loadingRes.data : [],
        dumpingPoints: Array.isArray(dumpingRes.data) ? dumpingRes.data : [],
        roads: Array.isArray(roadsRes.data) ? roadsRes.data : [],
      });
      setOperationalData({
        trucks: Array.isArray(trucksRes.data) ? trucksRes.data : [],
        excavators: Array.isArray(excRes.data) ? excRes.data : [],
        operators: Array.isArray(opRes.data) ? opRes.data : [],
        productions: Array.isArray(prodRes.data) ? prodRes.data : [],
      });
      setEquipmentUtilization(equipmentUtilRes.data);
      setDelayAnalysis(delayRes.data);
      setMaintenanceOverview(maintenanceRes.data);
      setWeatherData(weatherRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const stats = [
    {
      icon: Truck,
      label: 'Active Trucks',
      value: overview?.fleetStatus?.trucksOperating || 0,
      total: operationalData.trucks.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      trend: '+5%',
      trendUp: true,
    },
    {
      icon: Construction,
      label: 'Active Excavators',
      value: overview?.fleetStatus?.excavatorsOperating || 0,
      total: operationalData.excavators.length,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      trend: '+2%',
      trendUp: true,
    },
    {
      icon: Package,
      label: 'Active Hauling',
      value: overview?.activeHauling || 0,
      subtext: 'trips in progress',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      trend: '+12%',
      trendUp: true,
    },
    {
      icon: TrendingUp,
      label: "Today's Production",
      value: `${(overview?.todayProduction || 0).toFixed(1)}`,
      unit: 'ton',
      subtext: `Target: ${(overview?.production?.todayTarget || 0).toFixed(0)} ton`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      trend: `${(overview?.production?.todayAchievement || 0).toFixed(1)}%`,
      trendUp: (overview?.production?.todayAchievement || 0) >= 100,
    },
  ];

  const detailedStats = [
    {
      icon: Activity,
      label: 'Fleet Efficiency',
      value: '87.5%',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Average fleet utilization',
    },
    {
      icon: Timer,
      label: 'Avg Cycle Time',
      value: '45.2',
      unit: 'min',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Per hauling cycle',
    },
    {
      icon: Fuel,
      label: 'Fuel Consumed',
      value: (overview?.production?.todayFuel || 0).toFixed(0),
      unit: 'L',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Today total',
    },
    {
      icon: Users,
      label: 'Active Operators',
      value: operationalData.operators.filter((o) => o.status === 'ACTIVE').length,
      total: operationalData.operators.length,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'On duty',
    },
    {
      icon: Wrench,
      label: 'Maintenance Due',
      value: maintenanceOverview?.upcoming || 0,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      description: 'Next 7 days',
    },
    {
      icon: Shield,
      label: 'Safety Incidents',
      value: overview?.safety?.recentIncidents || 0,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Last 7 days',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operational Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time mining operations monitoring & analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live</span>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
            <div className="text-xs text-gray-500">Last Update</div>
            <div className="text-sm font-semibold text-gray-900">{new Date().toLocaleTimeString('id-ID')}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`card border-l-4 ${stat.borderColor} hover:shadow-lg transition-shadow`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    {stat.unit && <span className="text-lg text-gray-500">{stat.unit}</span>}
                    {stat.total && <span className="text-sm text-gray-400">/ {stat.total}</span>}
                  </div>
                  {stat.subtext && <p className="text-xs text-gray-500 mt-1">{stat.subtext}</p>}
                  {stat.trend && (
                    <div className="flex items-center space-x-1 mt-2">
                      {stat.trendUp ? <ArrowUp size={14} className="text-green-600" /> : <ArrowDown size={14} className="text-red-600" />}
                      <span className={`text-xs font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>{stat.trend}</span>
                      <span className="text-xs text-gray-500">vs yesterday</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <Icon className={stat.color} size={28} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {detailedStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card hover:shadow-md transition-shadow">
              <div className={`p-2 rounded-lg ${stat.bgColor} w-fit mb-2`}>
                <Icon className={stat.color} size={20} />
              </div>
              <p className="text-xs text-gray-600 mb-1">{stat.label}</p>
              <div className="flex items-baseline space-x-1">
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                {stat.unit && <span className="text-sm text-gray-500">{stat.unit}</span>}
                {stat.total && <span className="text-xs text-gray-400">/ {stat.total}</span>}
              </div>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {weatherData && (
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <CloudRain className="text-blue-600" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Weather Conditions</h3>
                <p className="text-sm text-gray-600">Last updated: {new Date(weatherData.recordDate).toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Condition</p>
                <p className="text-lg font-bold text-gray-900">{weatherData.condition || 'N/A'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Temperature</p>
                <p className="text-lg font-bold text-gray-900">{weatherData.temperature || 'N/A'}°C</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Rainfall</p>
                <p className="text-lg font-bold text-gray-900">{weatherData.rainfall || 0} mm</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-1">Operational</p>
                {weatherData.isOperational ? <CheckCircle className="text-green-600 mx-auto" size={24} /> : <XCircle className="text-red-600 mx-auto" size={24} />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Geospatial Visualization (Map) */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <MapIcon className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Live Mining Operations Map</h2>
          <span className="ml-auto text-xs text-gray-500">
            {mapData.sites.length} Sites | {mapData.loadingPoints.length} Loading | {mapData.dumpingPoints.length} Dumping
          </span>
        </div>
        <MiningMap sites={mapData.sites} loadingPoints={mapData.loadingPoints} dumpingPoints={mapData.dumpingPoints} roads={mapData.roads} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="text-blue-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Fleet Status Overview</h2>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Truck className="text-blue-600" size={18} />
                  <span className="font-semibold text-gray-700">Trucks</span>
                </div>
                <span className="text-sm text-gray-500">{operationalData.trucks.length} Total</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">Operating</p>
                  <p className="text-2xl font-bold text-green-600">{overview?.fleetStatus?.trucksOperating || 0}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-xs text-gray-600 mb-1">Idle</p>
                  <p className="text-2xl font-bold text-yellow-600">{operationalData.trucks.filter((t) => t.status === 'IDLE').length}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-xs text-gray-600 mb-1">Breakdown</p>
                  <p className="text-2xl font-bold text-red-600">{operationalData.trucks.filter((t) => t.status === 'BREAKDOWN' || t.status === 'MAINTENANCE').length}</p>
                </div>
              </div>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <Construction className="text-green-600" size={18} />
                  <span className="font-semibold text-gray-700">Excavators</span>
                </div>
                <span className="text-sm text-gray-500">{operationalData.excavators.length} Total</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-gray-600 mb-1">Active</p>
                  <p className="text-2xl font-bold text-green-600">{overview?.fleetStatus?.excavatorsOperating || 0}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-xs text-gray-600 mb-1">Standby</p>
                  <p className="text-2xl font-bold text-yellow-600">{operationalData.excavators.filter((e) => e.status === 'STANDBY').length}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <p className="text-xs text-gray-600 mb-1">Breakdown</p>
                  <p className="text-2xl font-bold text-red-600">{operationalData.excavators.filter((e) => e.status === 'BREAKDOWN' || e.status === 'MAINTENANCE').length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Target className="text-orange-600" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Production Performance</h2>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Today's Achievement</p>
                  <p className="text-4xl font-bold text-orange-600">{(overview?.production?.todayAchievement || 0).toFixed(1)}%</p>
                </div>
                <div className={`p-2 rounded-lg ${(overview?.production?.todayAchievement || 0) >= 100 ? 'bg-green-100' : 'bg-orange-100'}`}>
                  {(overview?.production?.todayAchievement || 0) >= 100 ? <CheckCircle className="text-green-600" size={24} /> : <AlertCircle className="text-orange-600" size={24} />}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all ${(overview?.production?.todayAchievement || 0) >= 100 ? 'bg-green-600' : 'bg-orange-600'}`}
                  style={{ width: `${Math.min(overview?.production?.todayAchievement || 0, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600 mb-1">Target Today</p>
                <p className="text-xl font-bold text-blue-600">{(overview?.production?.todayTarget || 0).toFixed(0)}</p>
                <p className="text-xs text-gray-500">tons</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-xs text-gray-600 mb-1">Actual Today</p>
                <p className="text-xl font-bold text-green-600">{(overview?.production?.todayActual || 0).toFixed(0)}</p>
                <p className="text-xs text-gray-500">tons</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="text-xs text-gray-600 mb-1">Active Trips</p>
                <p className="text-xl font-bold text-purple-600">{overview?.activeHauling || 0}</p>
                <p className="text-xs text-gray-500">in progress</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-xs text-gray-600 mb-1">Completed</p>
                <p className="text-xl font-bold text-amber-600">{operationalData.productions.filter((p) => p.actualProduction >= p.targetProduction).length}</p>
                <p className="text-xs text-gray-500">targets met</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {overview?.alerts && overview.alerts.length > 0 && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-red-900">Critical Alerts</h2>
            <span className="ml-auto bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{overview.alerts.length}</span>
          </div>
          <div className="space-y-2">
            {overview.alerts.map((alert, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-red-600 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-800">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleString('id-ID')}</p>
                  </div>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wrench className="text-yellow-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Maintenance Status</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <Calendar className="text-yellow-600" size={18} />
                <span className="text-sm font-medium text-gray-700">Upcoming</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{maintenanceOverview?.upcoming || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-red-600" size={18} />
                <span className="text-sm font-medium text-gray-700">Overdue</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{maintenanceOverview?.overdue || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-green-600" size={18} />
                <span className="text-sm font-medium text-gray-700">Completed (30d)</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{maintenanceOverview?.completed || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="text-green-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Financial Overview</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <p className="text-xs text-gray-600 mb-1">Fuel Cost (Today)</p>
              <p className="text-xl font-bold text-green-600">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(overview?.financials?.estimatedFuelCost || 0)}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
              <p className="text-xs text-gray-600 mb-1">Operator Cost (Daily)</p>
              <p className="text-xl font-bold text-blue-600">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(overview?.financials?.estimatedOperatorCost || 0)}</p>
            </div>
            <div className="pt-2 border-t-2 border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-800">Total Daily Cost</span>
                <span className="text-xl font-bold text-red-600">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format((overview?.financials?.estimatedFuelCost || 0) + (overview?.financials?.estimatedOperatorCost || 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="text-purple-600" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Operators Summary</h2>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-gray-700">Active</span>
              <span className="text-2xl font-bold text-green-600">{operationalData.operators.filter((o) => o.status === 'ACTIVE').length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-sm font-medium text-gray-700">Off Duty</span>
              <span className="text-2xl font-bold text-yellow-600">{operationalData.operators.filter((o) => o.status === 'OFF_DUTY').length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-gray-700">Total Operators</span>
              <span className="text-2xl font-bold text-blue-600">{operationalData.operators.length}</span>
            </div>
          </div>
        </div>
      </div>

      {equipmentUtilization && (equipmentUtilization.trucks?.length > 0 || equipmentUtilization.excavators?.length > 0) && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Gauge className="text-indigo-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Equipment Utilization</h2>
            </div>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View Details</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {equipmentUtilization.trucks?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <Truck className="text-blue-600" size={18} />
                  <span>Top Trucks by Trips</span>
                </h3>
                <div className="space-y-2">
                  {equipmentUtilization.trucks.slice(0, 5).map((truck, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900">{truck.code || truck.name}</span>
                        <span className="text-sm font-bold text-blue-600">{truck.trips} trips</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Timer size={14} />
                        <span>Avg Cycle: {(truck.avgCycleTime || 0).toFixed(1)} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {equipmentUtilization.excavators?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <Construction className="text-green-600" size={18} />
                  <span>Top Excavators by Loads</span>
                </h3>
                <div className="space-y-2">
                  {equipmentUtilization.excavators.slice(0, 5).map((excavator, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-gray-900">{excavator.code || excavator.name}</span>
                        <span className="text-sm font-bold text-green-600">{excavator.loads} loads</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <Timer size={14} />
                        <span>Avg Loading: {(excavator.avgLoadingTime || 0).toFixed(1)} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {delayAnalysis && delayAnalysis.byCategory && Object.keys(delayAnalysis.byCategory).length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">Delay Analysis</h2>
            </div>
            <div className="bg-red-50 px-3 py-1 rounded-lg border border-red-200">
              <span className="text-sm font-semibold text-red-700">Total: {(delayAnalysis.totalDelays || 0).toFixed(0)} min</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(delayAnalysis.byCategory).map(([category, data], idx) => (
              <div key={idx} className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 capitalize">{category.toLowerCase().replace('_', ' ')}</h3>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">{data.count}x</span>
                </div>
                <p className="text-2xl font-bold text-red-600 mb-2">{(data.totalDuration || 0).toFixed(0)} min</p>
                {data.reasons && data.reasons.length > 0 && (
                  <div className="space-y-1 mt-3">
                    {data.reasons.slice(0, 2).map((reason, ridx) => (
                      <div key={ridx} className="text-xs text-gray-600 flex justify-between">
                        <span className="truncate">{reason.reason}</span>
                        <span className="font-semibold ml-2">{reason.duration}m</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showDataPreview && (
        <div className="space-y-6">
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Database className="text-blue-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Operational Data Real-Time</h2>
                  <p className="text-sm text-gray-600">Comprehensive view of all operational entities</p>
                </div>
              </div>
              <button onClick={() => setShowDataPreview(false)} className="bg-white hover:bg-gray-100 px-4 py-2 rounded-lg border shadow-sm text-gray-700 font-medium transition-colors">
                Hide Details
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="text-blue-600" size={22} />
                    <h3 className="text-lg font-bold text-gray-900">Trucks</h3>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">{operationalData.trucks.length} units</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Kode</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Model</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Kapasitas</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {operationalData.trucks.slice(0, 8).map((truck) => (
                        <tr key={truck.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 font-semibold text-gray-900">{truck.code}</td>
                          <td className="px-3 py-3 text-gray-700">{truck.model || '-'}</td>
                          <td className="px-3 py-3 font-medium text-gray-900">{truck.capacity}t</td>
                          <td className="px-3 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                truck.status === 'HAULING'
                                  ? 'bg-blue-100 text-blue-800'
                                  : truck.status === 'LOADING'
                                  ? 'bg-purple-100 text-purple-800'
                                  : truck.status === 'DUMPING'
                                  ? 'bg-orange-100 text-orange-800'
                                  : truck.status === 'IDLE'
                                  ? 'bg-gray-100 text-gray-800'
                                  : truck.status === 'BREAKDOWN' || truck.status === 'MAINTENANCE'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {truck.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {operationalData.trucks.length > 8 && <div className="text-center py-3 text-sm text-gray-500">+{operationalData.trucks.length - 8} more trucks</div>}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Construction className="text-green-600" size={22} />
                    <h3 className="text-lg font-bold text-gray-900">Excavators</h3>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">{operationalData.excavators.length} units</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Kode</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Model</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Rate</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {operationalData.excavators.slice(0, 8).map((exc) => (
                        <tr key={exc.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 font-semibold text-gray-900">{exc.code}</td>
                          <td className="px-3 py-3 text-gray-700">{exc.model || '-'}</td>
                          <td className="px-3 py-3 font-medium text-gray-900">{exc.productionRate}t/m</td>
                          <td className="px-3 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                exc.status === 'ACTIVE' || exc.status === 'LOADING'
                                  ? 'bg-green-100 text-green-800'
                                  : exc.status === 'STANDBY'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : exc.status === 'BREAKDOWN' || exc.status === 'MAINTENANCE'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {exc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {operationalData.excavators.length > 8 && <div className="text-center py-3 text-sm text-gray-500">+{operationalData.excavators.length - 8} more excavators</div>}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="text-purple-600" size={22} />
                    <h3 className="text-lg font-bold text-gray-900">Operators</h3>
                  </div>
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">{operationalData.operators.length} operators</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">No. Pegawai</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nama</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Shift</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {operationalData.operators.slice(0, 8).map((op) => (
                        <tr key={op.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 font-semibold text-gray-900">{op.employeeNumber}</td>
                          <td className="px-3 py-3 text-gray-700">{op.user?.name || op.user?.fullName || '-'}</td>
                          <td className="px-3 py-3">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{op.shift}</span>
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${op.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : op.status === 'OFF_DUTY' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}
                            >
                              {op.status || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {operationalData.operators.length > 8 && <div className="text-center py-3 text-sm text-gray-500">+{operationalData.operators.length - 8} more operators</div>}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="text-orange-600" size={22} />
                    <h3 className="text-lg font-bold text-gray-900">Production Targets</h3>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">{operationalData.productions.length} records</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tanggal</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Site</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Target</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">Actual</th>
                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {operationalData.productions.slice(0, 8).map((prod) => {
                        const achievement = prod.targetProduction > 0 ? (prod.actualProduction / prod.targetProduction) * 100 : 0;
                        return (
                          <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-gray-700">{new Date(prod.recordDate).toLocaleDateString('id-ID')}</td>
                            <td className="px-3 py-3 font-medium text-gray-900">{prod.miningSite?.code || '-'}</td>
                            <td className="px-3 py-3 text-gray-700">{prod.targetProduction?.toFixed(0)}t</td>
                            <td className="px-3 py-3 font-semibold text-gray-900">{prod.actualProduction?.toFixed(0)}t</td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${achievement >= 100 ? 'bg-green-100 text-green-800' : achievement >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                {achievement.toFixed(0)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {operationalData.productions.length > 8 && <div className="text-center py-3 text-sm text-gray-500">+{operationalData.productions.length - 8} more records</div>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <MapIcon className="text-blue-600" size={18} />
                  <span className="text-sm font-semibold text-gray-700">Mining Sites</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">{mapData.sites.length}</p>
                <p className="text-xs text-gray-500 mt-1">Active locations</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Navigation className="text-green-600" size={18} />
                  <span className="text-sm font-semibold text-gray-700">Loading Points</span>
                </div>
                <p className="text-3xl font-bold text-green-600">{mapData.loadingPoints.length}</p>
                <p className="text-xs text-gray-500 mt-1">Operational points</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Package className="text-orange-600" size={18} />
                  <span className="text-sm font-semibold text-gray-700">Dumping Points</span>
                </div>
                <p className="text-3xl font-bold text-orange-600">{mapData.dumpingPoints.length}</p>
                <p className="text-xs text-gray-500 mt-1">Discharge locations</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="text-purple-600" size={18} />
                  <span className="text-sm font-semibold text-gray-700">Road Segments</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">{mapData.roads.length}</p>
                <p className="text-xs text-gray-500 mt-1">Active routes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showDataPreview && (
        <div className="card bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200 text-center hover:shadow-lg transition-shadow">
          <button onClick={() => setShowDataPreview(true)} className="btn-primary mx-auto flex items-center space-x-3 px-6 py-3 text-base">
            <Database size={22} />
            <span>Show Detailed Operational Data</span>
            <ChevronRight size={18} />
          </button>
          <p className="text-sm text-gray-600 mt-3">View comprehensive tables for trucks, excavators, operators, and production records</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
