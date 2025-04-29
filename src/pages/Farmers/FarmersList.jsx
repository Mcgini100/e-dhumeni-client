import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Card from '@components/common/Card/Card';
import Button from '@components/common/Button/Button';
import Table from '@components/common/Table/Table';

// This would be replaced with the actual API call
import { mockFarmers } from './mockData';

/**
 * FarmersList Component
 * Displays a list of farmers with filtering and pagination
 * @returns {JSX.Element} FarmersList component
 */
const FarmersList = () => {
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();

  // Fetch farmers data
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with an actual API call
        // const response = await FarmerAPI.getFarmers();
        // setFarmers(response.data);
        
        // Mock data for demonstration
        setTimeout(() => {
          setFarmers(mockFarmers);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching farmers:', error);
        toast.error('Failed to load farmers data');
        setIsLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  // Handle row click to navigate to farmer details
  const handleRowClick = (farmer) => {
    navigate(`/farmers/${farmer.id}`);
  };

  // Filter farmers based on selected filter
  const filteredFarmers = useMemo(() => {
    switch (selectedFilter) {
      case 'needsSupport':
        return farmers.filter(farmer => farmer.needsSupport);
      case 'noAeo':
        return farmers.filter(farmer => !farmer.aeoName);
      case 'highCompliance':
        return farmers.filter(farmer => farmer.complianceLevel === 'HIGH');
      case 'lowCompliance':
        return farmers.filter(farmer => farmer.complianceLevel === 'LOW');
      default:
        return farmers;
    }
  }, [farmers, selectedFilter]);

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value, row }) => (
          <div className="flex items-center">
            <span className={`mr-2 w-2 h-2 rounded-full ${row.original.needsSupport ? 'bg-red-500' : 'bg-green-500'}`}></span>
            <span className="font-medium text-gray-900">{value}</span>
          </div>
        ),
      },
      {
        Header: 'Age',
        accessor: 'age',
        Cell: ({ value }) => value || '-',
      },
      {
        Header: 'Gender',
        accessor: 'gender',
      },
      {
        Header: 'Region',
        accessor: 'region',
      },
      {
        Header: 'Ward',
        accessor: 'ward',
      },
      {
        Header: 'Farm Size (ha)',
        accessor: 'farmSizeHectares',
        Cell: ({ value }) => value.toFixed(2),
      },
      {
        Header: 'AEO',
        accessor: 'aeoName',
        Cell: ({ value }) => value || <span className="text-gray-400">Not Assigned</span>,
      },
      {
        Header: 'Compliance',
        accessor: 'complianceLevel',
        Cell: ({ value }) => {
          let color;
          switch (value) {
            case 'HIGH':
              color = 'bg-green-100 text-green-800';
              break;
            case 'MEDIUM':
              color = 'bg-yellow-100 text-yellow-800';
              break;
            case 'LOW':
              color = 'bg-red-100 text-red-800';
              break;
            default:
              color = 'bg-gray-100 text-gray-800';
          }
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
              {value}
            </span>
          );
        },
      },
      {
        Header: 'Status',
        accessor: 'needsSupport',
        Cell: ({ value }) => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {value ? 'Needs Support' : 'Good Standing'}
          </span>
        ),
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <Link
              to={`/farmers/${row.original.id}`}
              className="text-primary-600 hover:text-primary-900"
              onClick={(e) => e.stopPropagation()}
            >
              View
            </Link>
            <Link
              to={`/farmers/edit/${row.original.id}`}
              className="text-secondary-600 hover:text-secondary-900"
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Farmers</h1>
          <p className="mt-1 text-sm text-gray-500">
            A list of all the farmers in your system including their details.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/farmers/create">
            <Button variant="primary">
              Add Farmer
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        {/* Filter buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            All Farmers
          </Button>
          <Button
            variant={selectedFilter === 'needsSupport' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('needsSupport')}
          >
            Needs Support
          </Button>
          <Button
            variant={selectedFilter === 'noAeo' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('noAeo')}
          >
            No AEO Assigned
          </Button>
          <Button
            variant={selectedFilter === 'highCompliance' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('highCompliance')}
          >
            High Compliance
          </Button>
          <Button
            variant={selectedFilter === 'lowCompliance' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('lowCompliance')}
          >
            Low Compliance
          </Button>
        </div>

        {/* Farmers table */}
        <Table
          columns={columns}
          data={filteredFarmers}
          isPaginated={true}
          defaultPageSize={10}
          onRowClick={handleRowClick}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default FarmersList;