import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchFarmersNeedingSupport,
  fetchFarmersWithRepaymentIssues,
  fetchAtRiskContracts,
  fetchAlertSummary,
  runSupportAssessment
} from '../../store/slices/alertsSlice';
import { useAlert } from '../../context/AlertContext';
import { formatDate, formatPercentage, formatWeight } from '../../utils/formatters';
import Loader from '../../components/common/Loader/Loader';
import Alert from '../../components/common/Alert/Alert';
import Modal from '../../components/common/Modal/Modal';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  UserIcon,
  DocumentTextIcon,
  ChartPieIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';

const AlertDashboard = () => {
  const dispatch = useDispatch();
  const { success, error: showError } = useAlert();
  
  // Component state
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isRunningAssessment, setIsRunningAssessment] = useState(false);
  
  // Redux state
  const {
    farmersNeedingSupport,
    farmersWithRepaymentIssues,
    atRiskContracts,
    alertSummary,
    loading,
    assessmentInProgress,
    error
  } = useSelector(state => state.alerts);
  
  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(fetchFarmersNeedingSupport()),
          dispatch(fetchFarmersWithRepaymentIssues()),
          dispatch(fetchAtRiskContracts()),
          dispatch(fetchAlertSummary())
        ]);
      } catch (err) {
        showError('Failed to load alert data');
      }
    };
    
    loadData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [dispatch, showError]);
  
  // Run support assessment
  const handleRunAssessment = async () => {
    try {
      setIsRunningAssessment(true);
      await dispatch(runSupportAssessment()).unwrap();
      success('Support assessment completed');
      
      // Refresh data
      await Promise.all([
        dispatch(fetchFarmersNeedingSupport()),
        dispatch(fetchAlertSummary())
      ]);
    } catch (err) {
      showError(err.message || 'Failed to run support assessment');
    } finally {
      setIsRunningAssessment(false);
    }
  };
  
  // Mark farmer for support
  const handleMarkForSupport = (farmer) => {
    setSelectedFarmer(farmer);
    setIsSupportModalOpen(true);
  };
  
  // Resolve farmer support
  const handleResolveSupport = (farmer) => {
    setSelectedFarmer(farmer);
    setResolutionNotes('');
    setIsResolutionModalOpen(true);
  };
  
  // Submit support resolution
  const handleSubmitResolution = async () => {
    if (!resolutionNotes.trim()) return;
    
    try {
      // TODO: Implement the API call to resolve the support
      // await dispatch(resolveFarmerSupport({
      //   id: selectedFarmer.id,
      //   resolutionNotes
      // })).unwrap();
      
      success(`Support resolved for ${selectedFarmer.name}`);
      setIsResolutionModalOpen(false);
      
      // Refresh data
      await Promise.all([
        dispatch(fetchFarmersNeedingSupport()),
        dispatch(fetchAlertSummary())
      ]);
    } catch (err) {
      showError(err.message || 'Failed to resolve support');
    }
  };
  
  // Get alert summary stats
  const renderSummaryStats = () => {
    if (!alertSummary) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/20 rounded-md p-3">
                <HandRaisedIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                    Farmers Needing Support
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {alertSummary.totalFarmersNeedingSupport}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatPercentage(alertSummary.percentageNeedingSupport)} of all farmers
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900/20 rounded-md p-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                    At-Risk Contracts
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {alertSummary.totalAtRiskContracts}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Delivery behind schedule
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/20 rounded-md p-3">
                <ChartPieIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">
                    Support Reasons
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {Object.keys(alertSummary.supportByReason || {}).length}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Different support categories
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (loading && !alertSummary) {
    return <Loader text="Loading alerts dashboard..." />;
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
            Alerts Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor farmers needing support and at-risk contracts
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleRunAssessment}
            disabled={isRunningAssessment || assessmentInProgress}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 text-gray-500 dark:text-gray-400 ${isRunningAssessment || assessmentInProgress ? 'animate-spin' : ''}`} />
            Run Support Assessment
          </button>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          title="Error loading alerts"
          message={error.message || 'An error occurred while loading alert data'}
          className="mb-4"
        />
      )}
      
      {/* Summary Stats */}
      {renderSummaryStats()}
      
      {/* Top Support Reasons */}
      {alertSummary && alertSummary.supportByReason && Object.keys(alertSummary.supportByReason).length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Top Support Reasons
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Most common reasons farmers need support
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(alertSummary.supportByReason)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([reason, count]) => (
                  <div key={reason} className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{reason}</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${(count / Math.max(...Object.values(alertSummary.supportByReason))) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Farmers Needing Support */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Farmers Needing Support
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Farmers that require intervention or assistance
            </p>
          </div>
          <Link
            to="/farmers?needsSupport=true"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <EyeIcon className="-ml-0.5 mr-1 h-4 w-4" />
            View All
          </Link>
        </div>
        
        {loading && farmersNeedingSupport.length === 0 ? (
          <div className="p-6 flex justify-center">
            <Loader size="md" />
          </div>
        ) : farmersNeedingSupport.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Support Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {farmersNeedingSupport.slice(0, 5).map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                          <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {farmer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {farmer.contactNumber || 'No contact'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{farmer.region.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{farmer.province}, {farmer.ward}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{farmer.supportReason || 'No reason specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/farmers/${farmer.id}`}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleResolveSupport(farmer)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <HandRaisedIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p>No farmers currently need support</p>
          </div>
        )}
      </div>
      
      {/* At-Risk Contracts */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              At-Risk Contracts
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Contracts that are behind schedule or at risk of default
            </p>
          </div>
          <Link
            to="/contracts?atRisk=true"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <EyeIcon className="-ml-0.5 mr-1 h-4 w-4" />
            View All
          </Link>
        </div>
        
        {loading && atRiskContracts.length === 0 ? (
          <div className="p-6 flex justify-center">
            <Loader size="md" />
          </div>
        ) : atRiskContracts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contract
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Delivery Progress
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Days Remaining
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {atRiskContracts.slice(0, 5).map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {contract.contractNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contract.farmerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatWeight(contract.actualDeliveryKg)} / {formatWeight(contract.expectedDeliveryKg)}
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full mt-1 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-yellow-500"
                          style={{ width: `${Math.min(100, contract.completionPercentage)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatPercentage(contract.completionPercentage)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {contract.remainingDays} days
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        End date: {formatDate(contract.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/contracts/${contract.id}`}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p>No contracts are currently at risk</p>
          </div>
        )}
      </div>
      
      {/* Farmers with Repayment Issues */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Farmers with Repayment Issues
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Farmers with defaulted contracts or repayment challenges
            </p>
          </div>
        </div>
        
        {loading && farmersWithRepaymentIssues.length === 0 ? (
          <div className="p-6 flex justify-center">
            <Loader size="md" />
          </div>
        ) : farmersWithRepaymentIssues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Farmer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Default Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {farmersWithRepaymentIssues.slice(0, 5).map((farmer) => (
                  <tr key={farmer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
                          <UserIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {farmer.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {farmer.contactNumber || 'No contact'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{farmer.region.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{farmer.province}, {farmer.ward}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200">
                        Defaulted
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/farmers/${farmer.id}`}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleMarkForSupport(farmer)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                      >
                        Mark for Support
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <p>No farmers with repayment issues</p>
          </div>
        )}
      </div>
      
      {/* Support Modal */}
      <Modal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        title="Mark Farmer for Support"
        size="md"
        footer={
          <>
            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              // onClick={handleSubmitSupport}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Mark for Support
            </button>
          </>
        }
      >
        {selectedFarmer && (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              You are about to mark the following farmer as needing support:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <p className="font-medium text-gray-900 dark:text-white">{selectedFarmer.name}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedFarmer.region.name}, {selectedFarmer.province}, {selectedFarmer.ward}
              </p>
            </div>
            <div>
              <label htmlFor="supportReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Support Reason
              </label>
              <textarea
                id="supportReason"
                // value={supportReason}
                // onChange={(e) => setSupportReason(e.target.value)}
                rows={3}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter the reason this farmer needs support..."
              />
            </div>
          </div>
        )}
      </Modal>
      
      {/* Resolution Modal */}
      <Modal
        isOpen={isResolutionModalOpen}
        onClose={() => setIsResolutionModalOpen(false)}
        title="Resolve Support Issue"
        size="md"
        footer={
          <>
            <button
              onClick={() => setIsResolutionModalOpen(false)}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitResolution}
              disabled={!resolutionNotes.trim()}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark as Resolved
            </button>
          </>
        }
      >
        {selectedFarmer && (
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              You are marking the support issue for the following farmer as resolved:
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
              <p className="font-medium text-gray-900 dark:text-white">{selectedFarmer.name}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                <strong>Current support reason:</strong> {selectedFarmer.supportReason || 'No reason specified'}
              </p>
            </div>
            <div>
              <label htmlFor="resolutionNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resolution Notes
              </label>
              <textarea
                id="resolutionNotes"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={3}
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter notes about how this issue was resolved..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AlertDashboard;