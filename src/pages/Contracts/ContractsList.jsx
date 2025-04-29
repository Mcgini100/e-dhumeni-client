import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  fetchContracts,
  fetchAtRiskContracts
} from '../../store/slices/contractsSlice';
import { useAlert } from '../../context/AlertContext';
import { 
  CONTRACT_TYPES,
  REPAYMENT_STATUS
} from '../../config/constants';
import { formatDate, formatCurrency, formatPercentage, formatWeight } from '../../utils/formatters';
import Loader from '../../components/common/Loader/Loader';
import Alert from '../../components/common/Alert/Alert';
import Pagination from '../../components/common/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';
import { 
  DocumentTextIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const ContractsList = () => {
  const dispatch = useDispatch();
  const { error: showError } = useAlert();
  
  // Component state
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterActive, setFilterActive] = useState(true);
  const [showAtRisk, setShowAtRisk] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Redux state
  const { contracts, atRiskContracts, loading, error } = useSelector((state) => state.contracts);
  
  // Pagination
  const {
    page,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changePageSize,
    getCurrentItems
  } = usePagination({
    initialPageSize: 10,
    totalItems: contracts.length,
  });

  // Load contracts on mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (showAtRisk) {
          await dispatch(fetchAtRiskContracts()).unwrap();
        } else {
          await dispatch(fetchContracts({
            type: filterType || undefined,
            active: filterActive === '' ? undefined : filterActive,
            repaymentStatus: filterStatus || undefined
          })).unwrap();
        }
      } catch (err) {
        showError(err.message || 'Failed to load contracts');
      }
    };
    
    fetchData();
  }, [dispatch, showAtRisk, filterType, filterStatus, filterActive, showError]);
  
  // Filter and sort contracts for display
  const filteredContracts = React.useMemo(() => {
    const displayContracts = showAtRisk ? atRiskContracts : contracts;
    
    if (!displayContracts.length) return [];
    
    return displayContracts.filter(contract => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          contract.contractNumber.toLowerCase().includes(searchLower) ||
          contract.farmer.name.toLowerCase().includes(searchLower)
        );
      }
      return true;
    }).sort((a, b) => {
      // Sort by end date (closest first)
      return new Date(a.endDate) - new Date(b.endDate);
    });
  }, [contracts, atRiskContracts, showAtRisk, searchTerm]);
  
  // Get current page items
  const currentContracts = getCurrentItems(filteredContracts);
  
  // Reset to first page when filters change
  useEffect(() => {
    goToPage(1);
  }, [showAtRisk, filterType, filterStatus, filterActive, searchTerm, goToPage]);
  
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    // Reset to first page
    goToPage(1);
    
    // Update filter
    switch (filterName) {
      case 'type':
        setFilterType(value);
        break;
      case 'status':
        setFilterStatus(value);
        break;
      case 'active':
        setFilterActive(value);
        break;
      default:
        break;
    }
  };
  
  // Toggle at-risk view
  const toggleAtRiskView = () => {
    setShowAtRisk(prev => !prev);
    goToPage(1);
  };
  
  // Render contract status icon
  const renderStatusIcon = (status, isBehindSchedule) => {
    switch (status) {
      case REPAYMENT_STATUS.COMPLETED:
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case REPAYMENT_STATUS.IN_PROGRESS:
        return isBehindSchedule 
          ? <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
          : <ClockIcon className="h-5 w-5 text-blue-500" />;
      case REPAYMENT_STATUS.DEFAULTED:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case REPAYMENT_STATUS.RENEGOTIATED:
        return <CurrencyDollarIcon className="h-5 w-5 text-purple-500" />;
      default: // NOT_STARTED
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (loading && !contracts.length) {
    return <Loader text="Loading contracts..." />;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
          {showAtRisk ? 'At-Risk Contracts' : 'Contracts'}
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={toggleAtRiskView}
            className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm ${
              showAtRisk 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200' 
                : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <ExclamationTriangleIcon className="h-4 w-4 inline-block mr-1" />
            {showAtRisk ? 'Show All Contracts' : 'Show At-Risk Only'}
          </button>
          
          <Link
            to="/contracts/new"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span>+ Add Contract</span>
          </Link>
        </div>
      </div>
      
      {error && (
        <Alert 
          type="error" 
          message={error.message || 'Failed to load contracts'} 
          className="mb-4" 
        />
      )}
      
      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by contract # or farmer"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="filterType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contract Type
            </label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">All Types</option>
              <option value={CONTRACT_TYPES.BASIC}>Basic</option>
              <option value={CONTRACT_TYPES.PREMIUM}>Premium</option>
              <option value={CONTRACT_TYPES.COOPERATIVE}>Cooperative</option>
              <option value={CONTRACT_TYPES.CORPORATE}>Corporate</option>
              <option value={CONTRACT_TYPES.GOVERNMENT}>Government</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Repayment Status
            </label>
            <select
              id="filterStatus"
              value={filterStatus}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">All Statuses</option>
              <option value={REPAYMENT_STATUS.NOT_STARTED}>Not Started</option>
              <option value={REPAYMENT_STATUS.IN_PROGRESS}>In Progress</option>
              <option value={REPAYMENT_STATUS.COMPLETED}>Completed</option>
              <option value={REPAYMENT_STATUS.DEFAULTED}>Defaulted</option>
              <option value={REPAYMENT_STATUS.RENEGOTIATED}>Renegotiated</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filterActive" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              id="filterActive"
              value={filterActive}
              onChange={(e) => handleFilterChange('active', e.target.value === '' ? '' : e.target.value === 'true')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Contracts Table */}
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
                Period
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Delivery
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {currentContracts.length > 0 ? (
              currentContracts.map((contract) => (
                <tr key={contract.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${contract.behindSchedule ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {contract.contractNumber}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {contract.hasLoanComponent ? 'Includes Loan/Advances' : 'No Loan/Advances'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {contract.farmer.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {contract.farmer.province}, {contract.farmer.ward}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(contract.startDate)} - {formatDate(contract.endDate)}
                    </div>
                    {contract.active ? (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Active
                      </div>
                    ) : (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        Inactive
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      contract.type === CONTRACT_TYPES.BASIC 
                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        : contract.type === CONTRACT_TYPES.PREMIUM
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200'
                          : contract.type === CONTRACT_TYPES.COOPERATIVE
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                            : contract.type === CONTRACT_TYPES.CORPORATE
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                    }`}>
                      {contract.type === CONTRACT_TYPES.BASIC ? 'Basic' :
                       contract.type === CONTRACT_TYPES.PREMIUM ? 'Premium' :
                       contract.type === CONTRACT_TYPES.COOPERATIVE ? 'Cooperative' :
                       contract.type === CONTRACT_TYPES.CORPORATE ? 'Corporate' : 'Government'}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {contract.pricePerKg ? formatCurrency(contract.pricePerKg) + '/kg' : 'No price set'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {formatWeight(contract.totalDeliveredKg)} / {formatWeight(contract.expectedDeliveryKg)}
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mt-1 dark:bg-gray-700">
                      <div 
                        className={`h-2 rounded-full ${
                          contract.deliveryCompletionPercentage >= 100 
                            ? 'bg-green-500' 
                            : contract.behindSchedule 
                              ? 'bg-yellow-500' 
                              : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(100, contract.deliveryCompletionPercentage)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatPercentage(contract.deliveryCompletionPercentage)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderStatusIcon(contract.repaymentStatus, contract.behindSchedule)}
                      <span className="ml-1.5 text-sm text-gray-900 dark:text-gray-100">
                        {contract.repaymentStatus === REPAYMENT_STATUS.NOT_STARTED ? 'Not Started' :
                         contract.repaymentStatus === REPAYMENT_STATUS.IN_PROGRESS ? 'In Progress' :
                         contract.repaymentStatus === REPAYMENT_STATUS.COMPLETED ? 'Completed' :
                         contract.repaymentStatus === REPAYMENT_STATUS.DEFAULTED ? 'Defaulted' : 'Renegotiated'}
                      </span>
                    </div>
                    {contract.hasLoanComponent && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatCurrency(contract.totalRepaidAmount)} / {formatCurrency(contract.totalOwedAmount)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/contracts/${contract.id}`}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      to={`/contracts/${contract.id}/edit`}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  {loading ? (
                    <div className="flex justify-center">
                      <Loader size="sm" />
                    </div>
                  ) : (
                    <>
                      {searchTerm || filterType || filterStatus || filterActive !== '' ? (
                        <div>
                          <p>No contracts match your filters</p>
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setFilterType('');
                              setFilterStatus('');
                              setFilterActive(true);
                              setShowAtRisk(false);
                            }}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mt-2"
                          >
                            Clear filters
                          </button>
                        </div>
                      ) : (
                        <p>No contracts found</p>
                      )}
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredContracts.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={goToPage}
            pageSize={pageSize}
            onPageSizeChange={changePageSize}
            totalItems={filteredContracts.length}
          />
        </div>
      )}
    </div>
  );
};

export default ContractsList;