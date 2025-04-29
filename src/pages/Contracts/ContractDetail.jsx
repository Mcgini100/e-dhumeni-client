import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchContractById,
  deactivateContract,
  deleteContract
} from '../../store/slices/contractsSlice';
import { useAlert } from '../../context/AlertContext';
import {
  formatDate,
  formatCurrency,
  formatPercentage,
  formatWeight,
  formatContractType,
  formatRepaymentStatus
} from '../../utils/formatters';
import Loader from '../../components/common/Loader/Loader';
import Alert from '../../components/common/Alert/Alert';
import Modal from '../../components/common/Modal/Modal';
import { getDeliveriesByContract } from '../../api/deliveries.api';
import {
  DocumentTextIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  MinusCircleIcon,
  PencilSquareIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const ContractDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: showError } = useAlert();
  
  // Component state
  const [deliveries, setDeliveries] = useState([]);
  const [loadingDeliveries, setLoadingDeliveries] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Redux state
  const { currentContract, loading, error } = useSelector(state => state.contracts);
  
  // Fetch contract data on mount
  useEffect(() => {
    dispatch(fetchContractById(id));
  }, [dispatch, id]);
  
  // Fetch deliveries for contract
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoadingDeliveries(true);
        const response = await getDeliveriesByContract(id);
        setDeliveries(response.data);
      } catch (err) {
        showError('Failed to load delivery history');
      } finally {
        setLoadingDeliveries(false);
      }
    };
    
    if (id) {
      fetchDeliveries();
    }
  }, [id, showError]);
  
  // Handle deactivate contract
  const handleDeactivate = async () => {
    try {
      await dispatch(deactivateContract(id)).unwrap();
      success('Contract deactivated successfully');
      setIsDeactivateModalOpen(false);
    } catch (err) {
      showError(err.message || 'Failed to deactivate contract');
    }
  };
  
  // Handle delete contract
  const handleDelete = async () => {
    try {
      await dispatch(deleteContract(id)).unwrap();
      success('Contract deleted successfully');
      navigate('/contracts');
    } catch (err) {
      showError(err.message || 'Failed to delete contract');
      setIsDeleteModalOpen(false);
    }
  };
  
  // Calculate days remaining
  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Render status badges
  const renderStatusBadge = (contract) => {
    if (!contract) return null;
    
    const { repaymentStatus, behindSchedule, active } = contract;
    
    if (!active) {
      return (
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Inactive
        </div>
      );
    }
    
    switch (repaymentStatus) {
      case 'COMPLETED':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Completed
          </div>
        );
      case 'IN_PROGRESS':
        return behindSchedule ? (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
            At Risk
          </div>
        ) : (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CalendarIcon className="h-4 w-4 mr-1" />
            In Progress
          </div>
        );
      case 'DEFAULTED':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Defaulted
          </div>
        );
      case 'RENEGOTIATED':
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
            Renegotiated
          </div>
        );
      default: // NOT_STARTED
        return (
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CalendarIcon className="h-4 w-4 mr-1" />
            Not Started
          </div>
        );
    }
  };
  
  if (loading && !currentContract) {
    return <Loader text="Loading contract details..." />;
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <Alert
          type="error"
          title="Error loading contract"
          message={error.message || 'Failed to load contract details'}
        />
        <div className="mt-4">
          <button
            onClick={() => navigate('/contracts')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }
  
  if (!currentContract) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <Alert
          type="error"
          title="Contract not found"
          message="The requested contract could not be found"
        />
        <div className="mt-4">
          <button
            onClick={() => navigate('/contracts')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Contract: {currentContract.contractNumber}
              </h2>
              <div className="ml-3">
                {renderStatusBadge(currentContract)}
              </div>
            </div>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Created on {formatDate(currentContract.createdAt)}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to={`/deliveries/new?contractId=${id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Record Delivery
            </Link>
            
            <Link
              to={`/contracts/${id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <PencilSquareIcon className="h-4 w-4 mr-1" />
              Edit
            </Link>
            
            {currentContract.active && (
              <button
                onClick={() => setIsDeactivateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <MinusCircleIcon className="h-4 w-4 mr-1" />
                Deactivate
              </button>
            )}
          </div>
        </div>
        
        {/* Alert for at-risk contracts */}
        {currentContract.behindSchedule && currentContract.active && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 dark:bg-yellow-900/20 dark:border-yellow-500">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  This contract is at risk of not meeting delivery targets. Current completion is {formatPercentage(currentContract.deliveryCompletionPercentage)} with {calculateDaysRemaining(currentContract.endDate)} days remaining.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Contract Details */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200 sm:dark:divide-gray-700">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                Farmer
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                <Link 
                  to={`/farmers/${currentContract.farmer.id}`} 
                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                >
                  {currentContract.farmer.name}
                </Link>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  {currentContract.farmer.region}, {currentContract.farmer.province}, {currentContract.farmer.ward}
                </div>
              </dd>
            </div>
            
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                Contract Period
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                {formatDate(currentContract.startDate)} to {formatDate(currentContract.endDate)}
                {currentContract.active && (
                  <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {calculateDaysRemaining(currentContract.endDate)} days remaining
                  </div>
                )}
              </dd>
            </div>
            
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-400" />
                Contract Type & Terms
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${currentContract.type === 'BASIC' 
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    : currentContract.type === 'PREMIUM'
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200'
                      : currentContract.type === 'COOPERATIVE'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                        : currentContract.type === 'CORPORATE'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                }`}>
                  {formatContractType(currentContract.type)}
                </span>
                
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-gray-500 dark:text-gray-400">Expected Delivery:</div>
                  <div>{formatWeight(currentContract.expectedDeliveryKg)}</div>
                  
                  <div className="text-gray-500 dark:text-gray-400">Price Per Kg:</div>
                  <div>{currentContract.pricePerKg ? formatCurrency(currentContract.pricePerKg) : 'Not set'}</div>
                  
                  {currentContract.signingBonus && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">Signing Bonus:</div>
                      <div>{formatCurrency(currentContract.signingBonus)}</div>
                    </>
                  )}
                  
                  {currentContract.advancePayment && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">Advance Payment:</div>
                      <div>{formatCurrency(currentContract.advancePayment)}</div>
                    </>
                  )}
                  
                  {currentContract.inputSupportValue && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">Input Support Value:</div>
                      <div>{formatCurrency(currentContract.inputSupportValue)}</div>
                    </>
                  )}
                  
                  {currentContract.challengesMeetingTerms && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">Challenges Meeting Terms:</div>
                      <div className="col-span-2 text-sm">{currentContract.challengesMeetingTerms}</div>
                    </>
                  )}
                </div>
              </dd>
            </div>
            
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-gray-400" />
                Delivery Progress
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                <div className="flex justify-between mb-1">
                  <span>
                    {formatWeight(currentContract.totalDeliveredKg)} of {formatWeight(currentContract.expectedDeliveryKg)} 
                    ({formatPercentage(currentContract.deliveryCompletionPercentage)})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    className={`h-2.5 rounded-full ${
                      currentContract.deliveryCompletionPercentage >= 100 
                        ? 'bg-green-500' 
                        : currentContract.behindSchedule 
                          ? 'bg-yellow-500' 
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, currentContract.deliveryCompletionPercentage)}%` }}
                  ></div>
                </div>
                
                <div className="mt-2">
                  <Link
                    to={`/deliveries?contractId=${currentContract.id}`}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    View all deliveries
                  </Link>
                </div>
              </dd>
            </div>
            
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                Financial Status
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="text-gray-500 dark:text-gray-400">Repayment Status:</div>
                  <div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      currentContract.repaymentStatus === 'COMPLETED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                        : currentContract.repaymentStatus === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                          : currentContract.repaymentStatus === 'DEFAULTED'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                            : currentContract.repaymentStatus === 'RENEGOTIATED'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {formatRepaymentStatus(currentContract.repaymentStatus)}
                    </span>
                  </div>
                  
                  {(currentContract.hasLoanComponent || currentContract.advancePayment || currentContract.inputSupportValue) && (
                    <>
                      <div className="text-gray-500 dark:text-gray-400">Total Owed:</div>
                      <div>{formatCurrency(currentContract.totalOwedAmount)}</div>
                      
                      <div className="text-gray-500 dark:text-gray-400">Total Repaid:</div>
                      <div>{formatCurrency(currentContract.totalRepaidAmount)}</div>
                      
                      {currentContract.totalOwedAmount > 0 && (
                        <>
                          <div className="text-gray-500 dark:text-gray-400">Repayment Progress:</div>
                          <div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div 
                                className="h-2.5 rounded-full bg-blue-500"
                                style={{ width: `${Math.min(100, (currentContract.totalRepaidAmount / currentContract.totalOwedAmount) * 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs mt-1">
                              {formatPercentage((currentContract.totalRepaidAmount / currentContract.totalOwedAmount) * 100)}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Recent Deliveries */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Recent Deliveries
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Latest deliveries for this contract
          </p>
        </div>
        
        {loadingDeliveries ? (
          <div className="p-6 flex justify-center">
            <Loader text="Loading deliveries..." />
          </div>
        ) : deliveries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quality
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {deliveries.slice(0, 5).map((delivery) => (
                  <tr key={delivery.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(delivery.deliveryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatWeight(delivery.quantityKg)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        delivery.qualityGrade === 'A_PLUS'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                          : delivery.qualityGrade === 'A'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
                            : delivery.qualityGrade === 'B'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                              : delivery.qualityGrade === 'C'
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                      }`}>
                        {delivery.qualityGrade === 'A_PLUS' ? 'A+' : delivery.qualityGrade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {delivery.totalAmountPaid ? formatCurrency(delivery.totalAmountPaid) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/deliveries/${delivery.id}`}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {deliveries.length > 5 && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                <Link
                  to={`/deliveries?contractId=${currentContract.id}`}
                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                >
                  View all {deliveries.length} deliveries
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <p>No deliveries recorded yet</p>
            <Link
              to={`/deliveries/new?contractId=${id}`}
              className="mt-2 inline-block text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Record First Delivery
            </Link>
          </div>
        )}
      </div>
      
      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg leading-6 font-medium text-red-600 dark:text-red-400">
            Danger Zone
          </h3>
        </div>
        <div className="p-6">
          <div className="flex flex-col space-y-4">
            {currentContract.active && (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Deactivate Contract</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Mark this contract as inactive. This will not delete any data.
                  </p>
                </div>
                <button
                  onClick={() => setIsDeactivateModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Deactivate
                </button>
              </div>
            )}
            
            {currentContract.deliveries.length === 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Delete Contract</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Permanently delete this contract. This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            )}
            
            {currentContract.deliveries.length > 0 && (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Delete Contract</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This contract has deliveries and cannot be deleted.
                  </p>
                </div>
                <button
                  disabled
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-300 dark:bg-red-900 cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Deactivate Modal */}
      <Modal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        title="Deactivate Contract"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setIsDeactivateModalOpen(false)}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDeactivate}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Deactivate
            </button>
          </>
        }
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to deactivate this contract? This will mark the contract as inactive, but all data will be preserved.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          Contract: <span className="font-medium">{currentContract.contractNumber}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-1">
          Farmer: <span className="font-medium">{currentContract.farmer.name}</span>
        </p>
      </Modal>
      
      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Contract"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this contract? This action cannot be undone.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          Contract: <span className="font-medium">{currentContract.contractNumber}</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-1">
          Farmer: <span className="font-medium">{currentContract.farmer.name}</span>
        </p>
      </Modal>
    </div>
  );
};

export default ContractDetail;