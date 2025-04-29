import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@components/common/Card/Card';
import Button from '@components/common/Button/Button';
import { mockFarmers, mockContracts, mockDeliveries } from './mockData';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

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
 * FarmerDetail Component
 * Displays detailed information about a specific farmer
 * @returns {JSX.Element} FarmerDetail component
 */
const FarmerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch farmer data
  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with actual API calls
        // const response = await FarmerAPI.getFarmerById(id);
        // setFarmer(response.data);
        
        // For demo purposes, use mock data
        setTimeout(() => {
          const foundFarmer = mockFarmers.find(f => f.id === id);
          if (!foundFarmer) {
            toast.error('Farmer not found');
            navigate('/farmers');
            return;
          }
          
          setFarmer(foundFarmer);
          setContracts(mockContracts.filter(c => c.farmer.id === id));
          setDeliveries(mockDeliveries.filter(d => d.farmerId === id));
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching farmer details:', error);
        toast.error('Failed to load farmer details');
        setIsLoading(false);
      }
    };

    fetchFarmerData();
  }, [id, navigate]);

  // Handle farmer support status change
  const handleSupportStatusChange = async (needsSupport) => {
    try {
      // This would be replaced with actual API call
      // await FarmerAPI.updateSupportStatus(id, needsSupport, reason);
      
      // For demo purposes
      setFarmer({ ...farmer, needsSupport });
      toast.success(`Farmer support status ${needsSupport ? 'enabled' : 'resolved'}`);
    } catch (error) {
      console.error('Error updating support status:', error);
      toast.error('Failed to update support status');
    }
  };

  // Format date for display
  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Loading farmer details...</span>
      </div>
    );
  }

  // Render not found state
  if (!farmer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Farmer Not Found</h2>
        <p className="mt-2 text-gray-500">The requested farmer could not be found.</p>
        <div className="mt-6">
          <Link to="/farmers">
            <Button variant="primary">Back to Farmers List</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Prepare chart data for performance tab
  const qualityDistributionData = {
    labels: ['A+', 'A', 'B', 'C', 'Rejected'],
    datasets: [
      {
        data: [
          deliveries.filter(d => d.qualityGrade === 'A_PLUS').length,
          deliveries.filter(d => d.qualityGrade === 'A').length,
          deliveries.filter(d => d.qualityGrade === 'B').length,
          deliveries.filter(d => d.qualityGrade === 'C').length,
          deliveries.filter(d => d.qualityGrade === 'REJECTED').length,
        ],
        backgroundColor: [
          '#10b981', // green
          '#3b82f6', // blue
          '#f59e0b', // amber
          '#ef4444', // red
          '#6b7280', // gray
        ],
        borderWidth: 1,
      },
    ],
  };

  const contractCompletionData = {
    labels: contracts.map(c => c.contractNumber),
    datasets: [
      {
        label: 'Completion Percentage',
        data: contracts.map(c => c.deliveryCompletionPercentage),
        backgroundColor: contracts.map(c => c.behindSchedule ? '#ef4444' : '#10b981'),
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-primary-200 flex items-center justify-center text-primary-600 text-2xl font-bold">
                  {farmer.name.charAt(0)}
                </div>
                {farmer.needsSupport && (
                  <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-red-500 ring-2 ring-white"></span>
                )}
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{farmer.name}</h1>
              <p className="text-sm font-medium text-gray-600">
                {farmer.region}, {farmer.province}
              </p>
              <div className="mt-1 flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  farmer.needsSupport ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {farmer.needsSupport ? 'Needs Support' : 'Good Standing'}
                </span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {farmer.landOwnershipType}
                </span>
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {farmer.complianceLevel} Compliance
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-0 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
            <Link to={`/farmers/edit/${farmer.id}`}>
              <Button variant="outline-primary">
                Edit Farmer
              </Button>
            </Link>
            {farmer.needsSupport ? (
              <Button 
                variant="success"
                onClick={() => handleSupportStatusChange(false)}
              >
                Resolve Support
              </Button>
            ) : (
              <Button 
                variant="danger"
                onClick={() => handleSupportStatusChange(true)}
              >
                Flag for Support
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`${
              activeTab === 'contracts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Contracts
            {contracts.length > 0 && (
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                {contracts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`${
              activeTab === 'deliveries'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Deliveries
            {deliveries.length > 0 && (
              <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100">
                {deliveries.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`${
              activeTab === 'performance'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Performance
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Information */}
          <Card title="Personal Information" className="md:col-span-2">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{farmer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-sm text-gray-900">{farmer.age}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="mt-1 text-sm text-gray-900">{farmer.gender}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{farmer.contactNumber || 'Not provided'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Region</dt>
                <dd className="mt-1 text-sm text-gray-900">{farmer.region}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Province</dt>
                <dd className="mt-1 text-sm text-gray-900">{farmer.province}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ward</dt>
                <dd className="mt-1 text-sm text-gray-900">{farmer.ward}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">AEO</dt>
                <dd className="mt-1 text-sm text-gray-900">{farmer.aeoName || 'Not assigned'}</dd>
              </div>
            </dl>
          </Card>

          {/* Farm Information */}
          <Card title="Farm Information" className="md:col-span-1">
            <dl className="grid grid-cols-1 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Farm Size</dt>
                <dd className="mt-1 text-sm text-gray-900">{farmer.farmSizeHectares} hectares</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Land Ownership</dt>
                <dd className="mt-1 text-sm text-gray-900">{farmer.landOwnershipType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Compliance Level</dt>
                <dd className="mt-1 text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    farmer.complianceLevel === 'HIGH' ? 'bg-green-100 text-green-800' :
                    farmer.complianceLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {farmer.complianceLevel}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Support Status</dt>
                <dd className="mt-1 text-sm">
                  {farmer.needsSupport ? (
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Needs Support
                      </span>
                      {farmer.supportReason && (
                        <p className="mt-1 text-xs text-red-600">{farmer.supportReason}</p>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Good Standing
                    </span>
                  )}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Farming Practices */}
          <Card title="Farming Practices" className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Agronomic Practices</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="h-4 w-4 text-primary-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Crop Rotation
                  </li>
                  <li className="flex items-center">
                    <span className="h-4 w-4 text-primary-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    Intercropping
                  </li>
                  <li className="flex items-center">
                    {farmer.usesPfumvudza ? (
                      <span className="h-4 w-4 text-primary-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="h-4 w-4 text-gray-400 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    Pfumvudza
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Soil Management</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center">
                    {farmer.usesFertilizer ? (
                      <span className="h-4 w-4 text-primary-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="h-4 w-4 text-gray-400 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    Uses Fertilizer
                    {farmer.fertilizerType && <span className="ml-1 text-xs text-gray-500">({farmer.fertilizerType})</span>}
                  </li>
                  <li className="flex items-center">
                    {farmer.manureAvailability ? (
                      <span className="h-4 w-4 text-primary-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="h-4 w-4 text-gray-400 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    Manure Availability
                  </li>
                  <li className="flex items-center">
                    {farmer.soilTestingDone ? (
                      <span className="h-4 w-4 text-primary-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="h-4 w-4 text-gray-400 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    Soil Testing Done
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Other Practices</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center">
                    {farmer.usesAgroforestry ? (
                      <span className="h-4 w-4 text-primary-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="h-4 w-4 text-gray-400 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    Uses Agroforestry
                  </li>
                  <li className="flex items-center">
                    {farmer.keepsFarmRecords ? (
                      <span className="h-4 w-4 text-primary-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="h-4 w-4 text-gray-400 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    Keeps Farm Records
                  </li>
                  <li className="flex items-center">
                    {farmer.hasCropInsurance ? (
                      <span className="h-4 w-4 text-primary-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    ) : (
                      <span className="h-4 w-4 text-gray-400 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                    Has Crop Insurance
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Contracts tab */}
      {activeTab === 'contracts' && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-900">Contracts</h3>
            <Link to={`/contracts/create?farmerId=${farmer.id}`}>
              <Button variant="primary" size="sm">
                Create New Contract
              </Button>
            </Link>
          </div>

          {contracts.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts</h3>
                <p className="mt-1 text-sm text-gray-500">
                  This farmer doesn't have any contracts yet.
                </p>
                <div className="mt-6">
                  <Link to={`/contracts/create?farmerId=${farmer.id}`}>
                    <Button variant="primary">
                      Create Contract
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {contracts.map((contract) => (
                <Card key={contract.id}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        <Link to={`/contracts/${contract.id}`} className="text-primary-600 hover:text-primary-900">
                          Contract #{contract.contractNumber}
                        </Link>
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {contract.type}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contract.repaymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          contract.repaymentStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                          contract.repaymentStatus === 'DEFAULTED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contract.repaymentStatus.replace(/_/g, ' ')}
                        </span>
                        {contract.behindSchedule && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Behind Schedule
                          </span>
                        )}
                        {!contract.active && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inactive
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <div className="flex items-center justify-between md:flex-col md:items-end">
                        <div className="text-sm text-gray-500">Delivery Progress</div>
                        <div className="flex items-center">
                          <div className="ml-2 flex items-baseline">
                            <span className="text-2xl font-semibold text-gray-900">
                              {Math.round(contract.deliveryCompletionPercentage)}%
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              ({contract.totalDeliveredKg.toFixed(2)} / {contract.expectedDeliveryKg.toFixed(2)} kg)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            contract.behindSchedule ? 'bg-red-600' : 'bg-green-600'
                          }`}
                          style={{ width: `${Math.min(100, contract.deliveryCompletionPercentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                    <Link to={`/contracts/${contract.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/contracts/edit/${contract.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/deliveries/create/${contract.id}`}>
                      <Button variant="outline-primary" size="sm">
                        Record Delivery
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Deliveries tab */}
      {activeTab === 'deliveries' && (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-900">Deliveries</h3>
            <div className="space-x-2">
              {contracts.length > 0 ? (
                <Link to={`/deliveries/create?farmerId=${farmer.id}`}>
                  <Button variant="primary" size="sm">
                    Record Delivery
                  </Button>
                </Link>
              ) : (
                <Button variant="primary" size="sm" disabled title="Create a contract first">
                  Record Delivery
                </Button>
              )}
            </div>
          </div>

          {deliveries.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No deliveries</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {contracts.length > 0 
                    ? "This farmer hasn't made any deliveries yet."
                    : "Create a contract first, then record deliveries."
                  }
                </p>
                <div className="mt-6">
                  {contracts.length > 0 ? (
                    <Link to={`/deliveries/create?farmerId=${farmer.id}`}>
                      <Button variant="primary">
                        Record Delivery
                      </Button>
                    </Link>
                  ) : (
                    <Link to={`/contracts/create?farmerId=${farmer.id}`}>
                      <Button variant="primary">
                        Create Contract
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contract
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity (kg)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quality
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount Paid
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deliveries.map((delivery) => (
                      <tr key={delivery.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(delivery.deliveryDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <Link to={`/contracts/${delivery.contractId}`} className="text-primary-600 hover:text-primary-900">
                            {delivery.contractNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {delivery.quantityKg.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            delivery.qualityGrade === 'A_PLUS' ? 'bg-green-100 text-green-800' :
                            delivery.qualityGrade === 'A' ? 'bg-blue-100 text-blue-800' :
                            delivery.qualityGrade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                            delivery.qualityGrade === 'C' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {delivery.qualityGrade.replace('_', '+')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {delivery.totalAmountPaid ? `$${delivery.totalAmountPaid.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Link to={`/deliveries/${delivery.id}`} className="text-primary-600 hover:text-primary-900 mr-3">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Performance tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">Performance Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Summary Card */}
            <Card title="Delivery Summary">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Deliveries</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">{deliveries.length}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Volume</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {deliveries.reduce((sum, d) => sum + d.quantityKg, 0).toFixed(2)} kg
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Avg. Quality Grade</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {deliveries.length > 0 
                      ? ['A_PLUS', 'A', 'B', 'C', 'REJECTED']
                          .sort((a, b) => {
                            const countA = deliveries.filter(d => d.qualityGrade === a).length;
                            const countB = deliveries.filter(d => d.qualityGrade === b).length;
                            return countB - countA;
                          })[0].replace('_', '+')
                      : 'N/A'
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Compliance Level</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                      farmer.complianceLevel === 'HIGH' ? 'bg-green-100 text-green-800' :
                      farmer.complianceLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {farmer.complianceLevel}
                    </span>
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Quality Distribution */}
            {deliveries.length > 0 ? (
              <Card title="Quality Grade Distribution">
                <div className="h-64">
                  <Pie 
                    data={qualityDistributionData}
                    options={chartOptions}
                  />
                </div>
              </Card>
            ) : (
              <Card title="Quality Grade Distribution">
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No delivery data available
                </div>
              </Card>
            )}

            {/* Contract Completion */}
            {contracts.length > 0 ? (
              <Card title="Contract Completion Rates" className="md:col-span-2">
                <div className="h-64">
                  <Bar
                    data={contractCompletionData}
                    options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          title: {
                            display: true,
                            text: 'Completion %'
                          }
                        },
                        x: {
                          title: {
                            display: true,
                            text: 'Contract'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </Card>
            ) : (
              <Card title="Contract Completion Rates" className="md:col-span-2">
                <div className="flex items-center justify-center h-64 text-gray-500">
                  No contract data available
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDetail;