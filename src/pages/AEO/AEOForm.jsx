import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import Card from '@components/common/Card/Card';
import Button from '@components/common/Button/Button';
import Input from '@components/common/Input/Input';
import Alert from '@components/common/Alert/Alert';
import Loader from '@components/common/Loader/Loader';

// This would be replaced with the actual API calls
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
    lastFieldVisit: '2023-12-15',
    address: '123 Farming Zone, Murehwa',
    qualifications: 'BSc in Agricultural Science',
    yearsOfExperience: 5,
    specializations: ['Crop Rotation', 'Pest Management', 'Soil Conservation'],
    notes: 'Excellent communication skills and well-respected by farmers.'
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
    lastFieldVisit: '2023-12-20',
    address: '45 Rural Extension Office, Guruve',
    qualifications: 'Diploma in Agriculture',
    yearsOfExperience: 8,
    specializations: ['Irrigation', 'Climate-Smart Agriculture'],
    notes: 'Highly skilled in farmer training and demonstrations.'
  }
];

// Mock regions for form dropdown
const mockRegions = [
  { id: '1', name: 'Mashonaland East', districts: ['Murehwa', 'Marondera', 'Mutoko'] },
  { id: '2', name: 'Mashonaland Central', districts: ['Guruve', 'Bindura', 'Mt Darwin'] },
  { id: '3', name: 'Manicaland', districts: ['Mutasa', 'Chipinge', 'Makoni'] },
  { id: '4', name: 'Masvingo', districts: ['Chivi', 'Gutu', 'Masvingo'] },
  { id: '5', name: 'Matabeleland North', districts: ['Lupane', 'Hwange', 'Binga'] },
  { id: '6', name: 'Matabeleland South', districts: ['Gwanda', 'Beitbridge', 'Plumtree'] },
  { id: '7', name: 'Mashonaland West', districts: ['Mhondoro', 'Chegutu', 'Kariba'] },
  { id: '8', name: 'Midlands', districts: ['Gokwe', 'Kwekwe', 'Zvishavane'] },
];

// Common agricultural specializations
const specializationOptions = [
  'Crop Rotation',
  'Pest Management',
  'Soil Conservation',
  'Irrigation',
  'Climate-Smart Agriculture',
  'Organic Farming',
  'Livestock Management',
  'Agroforestry',
  'Post-Harvest Handling',
  'Farm Business Management',
  'Agricultural Extension',
  'Sustainable Agriculture'
];

/**
 * AEOForm Component
 * Form for creating and editing Agricultural Extension Officers
 * @returns {JSX.Element} AEOForm component
 */
const AEOForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [currentAeo, setCurrentAeo] = useState(null);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [error, setError] = useState(null);

  // Validation schema for AEO form
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    employeeId: Yup.string().required('Employee ID is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/,
      'Invalid phone number format'
    ).required('Phone number is required'),
    region: Yup.string().required('Region is required'),
    district: Yup.string().required('District is required'),
    address: Yup.string().required('Address is required'),
    qualifications: Yup.string().required('Qualifications are required'),
    yearsOfExperience: Yup.number()
      .min(0, 'Years of experience must be positive')
      .max(50, 'Years of experience must be less than 50')
      .required('Years of experience is required'),
    specializations: Yup.array().min(1, 'Select at least one specialization'),
    active: Yup.boolean()
  });

  // Initialize form with default values
  const initialValues = {
    name: '',
    employeeId: '',
    email: '',
    phone: '',
    region: '',
    district: '',
    active: true,
    address: '',
    qualifications: '',
    yearsOfExperience: 0,
    specializations: [],
    notes: ''
  };

  // Fetch AEO data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchAeo = async () => {
        try {
          setIsLoading(true);
          // This would be replaced with an actual API call
          // const response = await AeoAPI.getAeoById(id);
          // setCurrentAeo(response.data);
          
          // Mock data for demonstration
          setTimeout(() => {
            const foundAeo = mockAeos.find(aeo => aeo.id === id);
            if (foundAeo) {
              setCurrentAeo(foundAeo);
              
              // Set available districts based on region
              if (foundAeo.region) {
                const regionData = mockRegions.find(r => r.name === foundAeo.region);
                if (regionData) {
                  setAvailableDistricts(regionData.districts);
                }
              }
            } else {
              setError('AEO not found');
              toast.error('AEO not found');
            }
            setIsLoading(false);
          }, 1000);
        } catch (error) {
          console.error('Error fetching AEO details:', error);
          setError('Failed to load AEO details');
          toast.error('Failed to load AEO details');
          setIsLoading(false);
        }
      };

      fetchAeo();
    }
  }, [id, isEditMode]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      
      if (isEditMode) {
        // This would be replaced with an actual API call
        // await AeoAPI.updateAeo(id, values);
        
        // For demonstration purposes
        console.log('Updating AEO:', values);
        toast.success('AEO updated successfully');
      } else {
        // This would be replaced with an actual API call
        // await AeoAPI.createAeo(values);
        
        // For demonstration purposes
        console.log('Creating new AEO:', values);
        toast.success('AEO created successfully');
      }
      
      navigate('/aeos');
    } catch (error) {
      console.error('Error saving AEO:', error);
      toast.error(error.toString() || 'Failed to save AEO');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle region change to update districts
  const handleRegionChange = (e, setFieldValue) => {
    const regionName = e.target.value;
    setFieldValue('region', regionName);
    setFieldValue('district', ''); // Reset district when region changes
    
    // Update available districts
    const regionData = mockRegions.find(r => r.name === regionName);
    if (regionData) {
      setAvailableDistricts(regionData.districts);
    } else {
      setAvailableDistricts([]);
    }
  };

  // Show loading state while fetching data
  if (isLoading) {
    return <Loader text="Loading AEO data..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit AEO' : 'Add New AEO'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode 
            ? 'Update Agricultural Extension Officer information in the system' 
            : 'Register a new Agricultural Extension Officer in the system'}
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-4"
        />
      )}

      <Card>
        <Formik
          initialValues={currentAeo || initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Basic Information Section */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                    required
                  />
                  
                  <Input
                    label="Employee ID"
                    name="employeeId"
                    value={values.employeeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.employeeId && errors.employeeId}
                    required
                  />
                  
                  <Input
                    type="email"
                    label="Email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                    required
                  />
                  
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone && errors.phone}
                    placeholder="+263 77 123 4567"
                    required
                  />
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="region"
                      value={values.region}
                      onChange={(e) => handleRegionChange(e, setFieldValue)}
                      onBlur={handleBlur}
                      className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select Region</option>
                      {mockRegions.map(region => (
                        <option key={region.id} value={region.name}>{region.name}</option>
                      ))}
                    </select>
                    {touched.region && errors.region && (
                      <p className="mt-1 text-sm text-red-500">{errors.region}</p>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="district"
                      value={values.district}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                      disabled={!values.region || availableDistricts.length === 0}
                    >
                      <option value="">Select District</option>
                      {availableDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {touched.district && errors.district && (
                      <p className="mt-1 text-sm text-red-500">{errors.district}</p>
                    )}
                  </div>
                  
                  <Input
                    label="Address"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.address && errors.address}
                    required
                  />
                  
                  <div className="form-check flex items-center h-full mt-8">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={values.active}
                      onChange={handleChange}
                      className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                      Active
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Professional Information Section */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Professional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Qualifications"
                    name="qualifications"
                    value={values.qualifications}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.qualifications && errors.qualifications}
                    placeholder="BSc in Agricultural Science"
                    required
                  />
                  
                  <Input
                    type="number"
                    label="Years of Experience"
                    name="yearsOfExperience"
                    value={values.yearsOfExperience}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.yearsOfExperience && errors.yearsOfExperience}
                    min={0}
                    max={50}
                    required
                  />
                  
                  <div className="form-group col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specializations <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {specializationOptions.map(specialization => (
                        <div key={specialization} className="form-check">
                          <input
                            type="checkbox"
                            id={`specialization-${specialization}`}
                            name="specializations"
                            value={specialization}
                            checked={values.specializations.includes(specialization)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFieldValue('specializations', [...values.specializations, specialization]);
                              } else {
                                setFieldValue(
                                  'specializations',
                                  values.specializations.filter(s => s !== specialization)
                                );
                              }
                            }}
                            className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                          />
                          <label htmlFor={`specialization-${specialization}`} className="ml-2 text-sm text-gray-700">
                            {specialization}
                          </label>
                        </div>
                      ))}
                    </div>
                    {touched.specializations && errors.specializations && (
                      <p className="mt-1 text-sm text-red-500">{errors.specializations}</p>
                    )}
                  </div>
                  
                  <Input
                    type="textarea"
                    label="Notes"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.notes && errors.notes}
                    placeholder="Additional information about the AEO"
                    rows={4}
                    className="col-span-2"
                  />
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/aeos')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (isEditMode ? 'Update AEO' : 'Create AEO')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default AEOForm;