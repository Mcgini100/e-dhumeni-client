import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Card from '@components/common/Card/Card';
import Button from '@components/common/Button/Button';
import Table from '@components/common/Table/Table';
import Loader from '@components/common/Loader/Loader';
import Alert from '@components/common/Alert/Alert';

// This would be replaced with the actual API call
// Mock data for development
const mockAeos = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    name: 'Tendai Moyo',
    employeeId: 'AEO-001',
    email: 'tendai.moyo@edhumeni.org',
    phone: '+263 77 123 4567',
    region: 'Mashonaland East',
    district: 'Murehwa',
    active: true,
    farmerCount: 45,
    lastFieldVisit: '2023-12-15'
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    name: 'Grace Mutasa',
    employeeId: 'AEO-002',
    email: 'grace.mutasa@edhumeni.org',
    phone: '+263 77 234 5678',
    region: 'Mashonaland Central',
    district: 'Guruve',
    active: true,
    farmerCount: 38,
    lastFieldVisit: '2023-12-20'
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    name: 'Farai Chitauro',
    employeeId: 'AEO-003',
    email: 'farai.chitauro@edhumeni.org',
    phone: '+263 77 345 6789',
    region: 'Manicaland',
    district: 'Mutasa',
    active: true,
    farmerCount: 52,
    lastFieldVisit: '2023-12-18'
  },
  {
    id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    name: 'Blessing Manyika',
    employeeId: 'AEO-004',
    email: 'blessing.manyika@edhumeni.org',
    phone: '+263 77 456 7890',
    region: 'Masvingo',
    district: 'Chivi',
    active: true,
    farmerCount: 33,
    lastFieldVisit: '2023-12-10'
  },
  {
    id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    name: 'Simbarashe Ndlovu',
    employeeId: 'AEO-005',
    email: 'simbarashe.ndlovu@edhumeni.org',
    phone: '+263 77 567 8901',
    region: 'Matabeleland North',
    district: 'Lupane',
    active: true,
    farmerCount: 29,
    lastFieldVisit: '2023-12-05'
  },
  {
    id: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
    name: 'Tatenda Gumbo',
    employeeId: 'AEO-006',
    email: 'tatenda.gumbo@edhumeni.org',
    phone: '+263 77 678 9012',
    region: 'Mashonaland West',
    district: 'Mhondoro',
    active: false,
    farmerCount: 0,
    lastFieldVisit: '2023-11-15'
  }
];

/**
 * AEOList Component
 * Displays a list of Agricultural Extension Officers with filtering and search
 * @returns {JSX.Element} AEOList component
 */
const AEOList = () => {
  const [aeos, setAeos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch AEOs data
  useEffect(() => {
    const fetchAeos = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with an actual API call
        // const response = await AeoAPI.getAeos();
        // setAeos(response.data);
        
        // Mock data for demonstration
        setTimeout(() => {
          setAeos(mockAeos);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching AEOs:', error);
        setError('Failed to load AEOs data');
        toast.error('Failed to load AEOs data');
        setIsLoading(false);
      }
    };

    fetchAeos();
  }, []);

  // Handle row click to navigate to AEO details
  const handleRowClick = (aeo) => {
    navigate(`/aeos/${aeo.id}`);
  };

  // Filter AEOs based on selected filter
  const filteredAeos = useMemo(() => {
    switch (selectedFilter) {
      case 'active':
        return aeos.filter(aeo => aeo.active);
      case 'inactive':
        return aeos.filter(aeo => !aeo.active);
      case 'highFarmers':
        return aeos.filter(aeo => aeo.farmerCount > 40);
      case 'recentVisit':
        // Filter AEOs who have visited farmers in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return aeos.filter(aeo => {
          const visitDate = new Date(aeo.lastFieldVisit);
          return visitDate >= sevenDaysAgo;
        });
      default:
        return aeos;
    }
  }, [aeos, selectedFilter]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value, row }) => (
          <div className="flex items-center">
            <span className={`mr-2 w-2 h-2 rounded-full ${row.original.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="font-medium text-gray-900">{value}</span>
          </div>
        ),
      },
      {
        Header: 'Employee ID',
        accessor: 'employeeId',
      },
      {
        Header: 'Contact',
        accessor: 'email',
        Cell: ({ value, row }) => (
          <div>
            <div className="text-sm text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.original.phone}</div>
          </div>
        ),
      },
      {
        Header: 'Region',
        accessor: 'region',
        Cell: ({ value, row }) => (
          <div>
            <div className="text-sm text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{row.original.district}</div>
          </div>
        ),
      },
      {
        Header: 'Farmers',
        accessor: 'farmerCount',
        Cell: ({ value }) => (
          <span className="text-sm text-gray-900">{value}</span>
        ),
      },
      {
        Header: 'Last Field Visit',
        accessor: 'lastFieldVisit',
        Cell: ({ value }) => (
          <span className="text-sm text-gray-900">{formatDate(value)}</span>
        ),
      },
      {
        Header: 'Status',
        accessor: 'active',
        Cell: ({ value }) => (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {value ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <Link
              to={`/aeos/${row.original.id}`}
              className="text-primary-600 hover:text-primary-900"
              onClick={(e) => e.stopPropagation()}
            >
              View
            </Link>
            <Link
              to={`/aeos/edit/${row.original.id}`}
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
          <h1 className="text-2xl font-bold text-gray-900">AEO Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            A list of all Agricultural Extension Officers in your system including their details.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/aeos/create">
            <Button variant="primary">
              Add AEO
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-4"
        />
      )}

      <Card>
        {/* Filter buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedFilter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
          >
            All AEOs
          </Button>
          <Button
            variant={selectedFilter === 'active' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={selectedFilter === 'inactive' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('inactive')}
          >
            Inactive
          </Button>
          <Button
            variant={selectedFilter === 'highFarmers' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('highFarmers')}
          >
            High Farmer Count
          </Button>
          <Button
            variant={selectedFilter === 'recentVisit' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('recentVisit')}
          >
            Recent Field Visits
          </Button>
        </div>

        {/* AEOs table */}
        <Table
          columns={columns}
          data={filteredAeos}
          isPaginated={true}
          defaultPageSize={10}
          onRowClick={handleRowClick}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default AEOList;