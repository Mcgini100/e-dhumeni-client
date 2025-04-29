import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '@components/common/Card/Card';
import Button from '@components/common/Button/Button';
import { mockRegions } from '@pages/Farmers/mockData';
import { MapContainer, TileLayer, Circle, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * RegionMap Component
 * Interactive map showing all regions with farmer statistics
 * @returns {JSX.Element} RegionMap component
 */
const RegionMap = () => {
  const [regions, setRegions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const navigate = useNavigate();

  // Fetch regions data
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with an actual API call
        // const response = await RegionAPI.getRegionsForMap();
        // setRegions(response.data);

        // Mock data for demonstration
        setTimeout(() => {
          setRegions(mockRegions);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching regions for map:', error);
        toast.error('Failed to load map data');
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // Handle region click
  const handleRegionClick = (region) => {
    setSelectedRegion(region);
  };

  // Navigate to region detail
  const goToRegionDetail = (regionId) => {
    navigate(`/regions/${regionId}`);
  };

  // Find center coordinates for the map view
  const getMapCenter = () => {
    if (regions.length === 0) {
      // Default to Zimbabwe's approximate center if no regions
      return [-19.015438, 29.154857];
    }

    // Find the average of all region coordinates
    const validRegions = regions.filter(r => r.centerLatitude && r.centerLongitude);
    if (validRegions.length === 0) {
      return [-19.015438, 29.154857];
    }

    const sumLat = validRegions.reduce((sum, r) => sum + r.centerLatitude, 0);
    const sumLng = validRegions.reduce((sum, r) => sum + r.centerLongitude, 0);
    return [sumLat / validRegions.length, sumLng / validRegions.length];
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">Loading map data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Region Map</h1>
          <p className="mt-1 text-sm text-gray-500">
            Interactive map showing all regions with farmer statistics
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to="/regions">
            <Button variant="outline">
              List View
            </Button>
          </Link>
          <Link to="/regions/create">
            <Button variant="primary">
              Add Region
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Map Card - takes up more space */}
        <Card className="md:col-span-3 h-96">
          <MapContainer
            center={getMapCenter()}
            zoom={7}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {regions.map((region) => (
              region.centerLatitude && region.centerLongitude ? (
                <Circle
                  key={region.id}
                  center={[region.centerLatitude, region.centerLongitude]}
                  pathOptions={{
                    fillColor: region.farmersNeedingSupportCount > 0 ? '#ef4444' : '#10b981',
                    fillOpacity: 0.6,
                    color: region.farmersNeedingSupportCount > 0 ? '#b91c1c' : '#047857',
                    weight: 2
                  }}
                  radius={15000} // 15km radius for visibility
                  eventHandlers={{
                    click: () => handleRegionClick(region)
                  }}
                >
                  <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                    <span className="font-medium">{region.name}</span>
                    <br />
                    Farmers: {region.farmerCount}
                    <br />
                    Need Support: {region.farmersNeedingSupportCount}
                  </Tooltip>
                  {selectedRegion && selectedRegion.id === region.id && (
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-medium text-lg">{region.name}</h3>
                        <p className="text-sm text-gray-500">{region.province}, {region.district}</p>
                        <div className="mt-2 text-sm">
                          <p>Farmers: {region.farmerCount}</p>
                          <p>Need Support: {region.farmersNeedingSupportCount}</p>
                        </div>
                        <button
                          onClick={() => goToRegionDetail(region.id)}
                          className="mt-2 px-4 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                        >
                          View Details
                        </button>
                      </div>
                    </Popup>
                  )}
                </Circle>
              ) : null
            ))}
          </MapContainer>
        </Card>

        {/* Legend and Stats */}
        <Card title="Map Legend" className="md:col-span-1">
          <div className="space-y-4">
            <div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Good Standing</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Regions with no farmers requiring support
              </p>
            </div>
            <div>
              <div className="flex items-center">
                <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">Needs Attention</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Regions with farmers requiring support
              </p>
            </div>

            {/* Summary Stats */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Summary</h4>
              <dl className="grid grid-cols-1 gap-y-2">
                <div>
                  <dt className="text-xs text-gray-500">Total Regions</dt>
                  <dd className="text-lg font-medium text-gray-900">{regions.length}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Regions Needing Support</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {regions.filter(r => r.farmersNeedingSupportCount > 0).length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Total Farmers</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {regions.reduce((sum, r) => sum + r.farmerCount, 0)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Farmers Needing Support</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {regions.reduce((sum, r) => sum + r.farmersNeedingSupportCount, 0)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegionMap;