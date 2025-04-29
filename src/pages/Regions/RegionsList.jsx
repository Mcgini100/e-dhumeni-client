import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@components/common/Card/Card';
import Button from '@components/common/Button/Button';
import { mockRegions } from '@pages/Farmers/mockData';

/**
 * RegionsList Component
 * Displays a list of geographical regions with filtering options
 * @returns {JSX.Element} RegionsList component
 */
const RegionsList = () => {
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRegions, setFilteredRegions] = useState([]);

  // Fetch regions data
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with an actual API call
        // const response = await RegionAPI.getRegions();
        // setRegions(response.data);
        
        // Mock data for demonstration
        setTimeout(() => {
          setRegions(mockRegions);
          setFilteredRegions(mockRegions);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching regions:', error);
        toast.error('Failed to load regions data');
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // Filter regions based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRegions(regions);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filtered = regions.filter(
        region =>
          region.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          region.province.toLowerCase().includes(lowerCaseSearchTerm) ||
          region.district.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredRegions(filtered);
    }
  }, [searchTerm, regions]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Loading regions data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regions</h1>
          <p className="mt-1 text-sm text-gray-500">
            A list of all geographical regions with farmer statistics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/regions/create">
            <Button variant="primary">Add Region</Button>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white shadow rounded-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search regions..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <Link to="/regions/map" className="inline-flex items-center">
            <Button variant="secondary">
              <svg
                className="h-5 w-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              View Map
            </Button>
          </Link>
        </div>
      </div>

      {/* Regions Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRegions.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No regions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No regions match your search criteria. Try adjusting your search.
            </p>
          </div>
        ) : (
          filteredRegions.map((region) => (
            <Card key={region.id}>
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    <Link to={`/regions/${region.id}`} className="text-primary-600 hover:text-primary-900">
                      {region.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500">
                    {region.province}, {region.district}
                  </p>
                </div>
                {region.farmersNeedingSupportCount > 0 && (
                  <div className="h-10 w-10 bg-red-100 text-red-800 rounded-full flex items-center justify-center" title="Farmers needing support">
                    <span className="font-medium text-sm">{region.farmersNeedingSupportCount}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Farmers</dt>
                    <dd className="mt-1 text-sm text-gray-900">{region.farmerCount}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Support Rate</dt>
                    <dd className="mt-1 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (region.farmersNeedingSupportCount / region.farmerCount) > 0.2
                          ? 'bg-red-100 text-red-800'
                          : (region.farmersNeedingSupportCount / region.farmerCount) > 0.1
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {Math.round((region.farmersNeedingSupportCount / region.farmerCount) * 100)}%
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Coordinates</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {region.centerLatitude ? `${region.centerLatitude.toFixed(4)}, ${region.centerLongitude.toFixed(4)}` : 'Not set'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-4 flex space-x-2">
                <Link to={`/regions/${region.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                <Link to={`/regions/edit/${region.id}`}>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default RegionsList;