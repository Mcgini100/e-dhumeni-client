import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '@components/common/Card/Card';
import Button from '@components/common/Button/Button';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import useAuth from '@hooks/useAuth';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

/**
 * Dashboard Component
 * The main dashboard with overview statistics and charts
 * @returns {JSX.Element} Dashboard component
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalFarmers: 0,
    farmersNeedingSupport: 0,
    activeContracts: 0,
    atRiskContracts: 0,
    deliveriesThisMonth: 0,
    totalRegions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with actual API calls in a real implementation
        // Mock data for demonstration
        setTimeout(() => {
          setStats({
            totalFarmers: 845,
            farmersNeedingSupport: 76,
            activeContracts: 412,
            atRiskContracts: 28,
            deliveriesThisMonth: 157,
            totalRegions: 12,
          });
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Pie chart data for farmer compliance
  const complianceData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: ['#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  // Line chart data for monthly deliveries
  const deliveryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Deliveries (tonnes)',
        data: [42, 55, 68, 81, 97, 110, 125, 130, 118, 92, 75, 58],
        fill: false,
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  };

  // Bar chart data for contract types
  const contractTypeData = {
    labels: ['Basic', 'Premium', 'Cooperative', 'Corporate', 'Government'],
    datasets: [
      {
        label: 'Number of Contracts',
        data: [120, 85, 65, 40, 30],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(14, 165, 233, 0.7)',
          'rgba(20, 184, 166, 0.7)',
          'rgba(6, 182, 212, 0.7)',
          'rgba(79, 70, 229, 0.7)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(14, 165, 233)',
          'rgb(20, 184, 166)',
          'rgb(6, 182, 212)',
          'rgb(79, 70, 229)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.fullName || 'User'}</h1>
        <p className="mt-1 text-primary-100">
          Here's what's happening with e-Dhumeni farmers and contracts today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Farmers Card */}
        <Card
          className="bg-white shadow-md"
          headerAction={
            <Link to="/farmers">
              <Button variant="link" size="sm">
                View All
              </Button>
            </Link>
          }
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Farmers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFarmers}</p>
            </div>
          </div>
          <div className="flex justify-between border-t pt-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Need Support</p>
              <p className="text-lg font-semibold text-red-600">{stats.farmersNeedingSupport}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Support Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round((stats.farmersNeedingSupport / stats.totalFarmers) * 100)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Contracts Card */}
        <Card
          className="bg-white shadow-md"
          headerAction={
            <Link to="/contracts">
              <Button variant="link" size="sm">
                View All
              </Button>
            </Link>
          }
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeContracts}</p>
            </div>
          </div>
          <div className="flex justify-between border-t pt-4">
            <div>
              <p className="text-sm font-medium text-gray-600">At Risk</p>
              <p className="text-lg font-semibold text-amber-600">{stats.atRiskContracts}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Risk Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round((stats.atRiskContracts / stats.activeContracts) * 100)}%
              </p>
            </div>
          </div>
        </Card>

        {/* Deliveries Card */}
        <Card
          className="bg-white shadow-md"
          headerAction={
            <Link to="/deliveries">
              <Button variant="link" size="sm">
                View All
              </Button>
            </Link>
          }
        >
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Deliveries This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.deliveriesThisMonth}</p>
            </div>
          </div>
          <div className="flex justify-between border-t pt-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Regions</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalRegions}</p>
            </div>
            <div>
              <Link to="/regions/map">
                <Button variant="outline-primary" size="sm">
                  View Map
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Farmer Compliance Chart */}
        <Card title="Farmer Compliance Levels" className="h-80">
          <div className="h-64">
            <Pie data={complianceData} options={chartOptions} />
          </div>
        </Card>

        {/* Monthly Deliveries Chart */}
        <Card title="Monthly Deliveries" className="h-80">
          <div className="h-64">
            <Line
              data={deliveryData}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Contract Types Chart */}
        <Card title="Contract Types Distribution" className="h-80">
          <div className="h-64">
            <Bar
              data={contractTypeData}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </Card>

        {/* Recent Activity Card */}
        <Card title="Recent Activity" className="h-80">
          <div className="overflow-y-auto h-64">
            <ul className="divide-y divide-gray-200">
              <li className="py-3">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <span className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">New Contract Created</p>
                    <p className="text-sm text-gray-500">Contract #CTR-MJ-12345 with Mutasa Farmers Coop</p>
                    <p className="text-xs text-gray-400">1 hour ago</p>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Delivery Recorded</p>
                    <p className="text-sm text-gray-500">John Muza delivered 2.5 tonnes</p>
                    <p className="text-xs text-gray-400">3 hours ago</p>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <span className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Support Alert</p>
                    <p className="text-sm text-gray-500">Mary Kadema flagged for support</p>
                    <p className="text-xs text-gray-400">5 hours ago</p>
                  </div>
                </div>
              </li>
              <li className="py-3">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <span className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Contract at Risk</p>
                    <p className="text-sm text-gray-500">Contract #CTR-BT-98765 is behind schedule</p>
                    <p className="text-xs text-gray-400">1 day ago</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link to="/farmers/create">
          <Button variant="primary">
            Add New Farmer
          </Button>
        </Link>
        <Link to="/contracts/create">
          <Button variant="primary">
            Create Contract
          </Button>
        </Link>
        <Link to="/deliveries/create">
          <Button variant="primary">
            Record Delivery
          </Button>
        </Link>
        <Link to="/alerts">
          <Button variant="outline-primary">
            View All Alerts
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;