import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createFarmer, 
  updateFarmer, 
  fetchFarmerById, 
  clearCurrentFarmer 
} from '../../store/slices/farmersSlice';
import useForm from '../../hooks/useForm';
import { useAlert } from '../../context/AlertContext';
import Input from '../../components/common/Input/Input';
import Alert from '../../components/common/Alert/Alert';
import Loader from '../../components/common/Loader/Loader';
import { 
  GENDER,
  LAND_OWNERSHIP_TYPE,
  COMPLIANCE_LEVEL,
  LAND_PREPARATION_TYPE,
  VISIT_FREQUENCY,
  VULNERABILITY_LEVEL,
  EDUCATION_LEVEL,
  MARITAL_STATUS,
  COMMON_FARMING_PRACTICES,
  COMMON_CONSERVATION_PRACTICES,
  COMMON_AGRONOMIC_PRACTICES,
  COMMON_CHALLENGES,
  COMMON_PESTS
} from '../../config/constants';
import { getRegions } from '../../api/regions.api';
import { getAeos } from '../../api/aeos.api';

const FarmerForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success, error } = useAlert();
  
  // Local state
  const [regions, setRegions] = useState([]);
  const [aeos, setAeos] = useState([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingAeos, setLoadingAeos] = useState(false);
  
  // Redux state
  const { currentFarmer, loading, error: farmerError } = useSelector((state) => state.farmers);
  
  // Initial form values
  const initialValues = {
    name: '',
    age: '',
    gender: GENDER.MALE,
    contactNumber: '',
    regionId: '',
    province: '',
    ward: '',
    naturalRegion: '',
    soilType: '',
    usesFertilizer: false,
    fertilizerType: '',
    manureAvailability: false,
    usesPloughing: false,
    usesPfumvudza: false,
    accessToCredit: false,
    landOwnershipType: LAND_OWNERSHIP_TYPE.OWNED,
    keepsFarmRecords: false,
    farmSizeHectares: '',
    previousPlantedCrop: '',
    previousSeasonYieldKg: '',
    averageYieldPerSeasonKg: '',
    farmingPractices: [],
    conservationPractices: [],
    complianceLevel: COMPLIANCE_LEVEL.MEDIUM,
    agronomicPractices: [],
    landPreparationType: LAND_PREPARATION_TYPE.MANUAL,
    soilTestingDone: false,
    plantingDate: '',
    observedOffTypes: false,
    herbicidesUsed: '',
    problematicPests: [],
    aeoVisitFrequency: VISIT_FREQUENCY.MONTHLY,
    challenges: [],
    hasCropInsurance: false,
    receivesGovtSubsidies: false,
    usesAgroforestry: false,
    inputCostPerSeason: '',
    mainSourceOfInputs: '',
    socialVulnerability: VULNERABILITY_LEVEL.LOW,
    educationLevel: EDUCATION_LEVEL.PRIMARY,
    householdSize: 1,
    numberOfDependents: 0,
    maritalStatus: MARITAL_STATUS.SINGLE,
    aeoId: '',
    needsSupport: false,
    supportReason: '',
  };
  
  // Validate form fields
  const validateForm = (values) => {
    const errors = {};
    
    if (!values.name) errors.name = 'Name is required';
    if (!values.age) errors.age = 'Age is required';
    else if (values.age < 15) errors.age = 'Age must be at least 15';
    else if (values.age > 120) errors.age = 'Age must be less than 120';
    
    if (!values.regionId) errors.regionId = 'Region is required';
    if (!values.province) errors.province = 'Province is required';
    if (!values.ward) errors.ward = 'Ward is required';
    
    if (!values.farmSizeHectares) errors.farmSizeHectares = 'Farm size is required';
    else if (values.farmSizeHectares <= 0) errors.farmSizeHectares = 'Farm size must be greater than 0';
    
    if (values.householdSize < 1) errors.householdSize = 'Household size must be at least 1';
    if (values.numberOfDependents < 0) errors.numberOfDependents = 'Number of dependents cannot be negative';
    
    if (values.contactNumber && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/.test(values.contactNumber)) {
      errors.contactNumber = 'Invalid phone number format';
    }
    
    return errors;
  };
  
  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await dispatch(updateFarmer({ id, farmerData: formData })).unwrap();
        success('Farmer updated successfully');
      } else {
        await dispatch(createFarmer(formData)).unwrap();
        success('Farmer created successfully');
      }
      navigate('/farmers');
    } catch (err) {
      error(err.message || 'Failed to save farmer');
    }
  };
  
  // Initialize form
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit: submitForm,
    setFieldValue,
    setMultipleValues,
  } = useForm(initialValues, validateForm, handleSubmit);
  
  // Fetch farmer data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchFarmerById(id));
    }
    
    return () => {
      dispatch(clearCurrentFarmer());
    };
  }, [dispatch, id, isEditMode]);
  
  // Fetch regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoadingRegions(true);
        const response = await getRegions();
        setRegions(response.data);
      } catch (err) {
        error('Failed to load regions');
      } finally {
        setLoadingRegions(false);
      }
    };
    
    fetchRegions();
  }, [error]);
  
  // Fetch AEOs
  useEffect(() => {
    const fetchAeos = async () => {
      try {
        setLoadingAeos(true);
        const response = await getAeos();
        setAeos(response.data);
      } catch (err) {
        error('Failed to load agricultural extension officers');
      } finally {
        setLoadingAeos(false);
      }
    };
    
    fetchAeos();
  }, [error]);
  
  // Set form values when currentFarmer changes (edit mode)
  useEffect(() => {
    if (currentFarmer && isEditMode) {
      const formattedData = {
        ...currentFarmer,
        regionId: currentFarmer.region.id,
        aeoId: currentFarmer.agriculturalExtensionOfficer?.id || '',
      };
      
      setMultipleValues(formattedData);
    }
  }, [currentFarmer, isEditMode, setMultipleValues]);
  
  // Handle checkbox change
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFieldValue(name, checked);
  };
  
  // Handle multi-select change
  const handleMultiSelectChange = (name, value) => {
    setFieldValue(name, value);
  };
  
  // Handle province change
  const handleProvinceChange = (e) => {
    const { value } = e.target;
    setFieldValue('province', value);
    
    // Filter regions by province
    const regionsByProvince = regions.filter(
      region => region.province.toLowerCase() === value.toLowerCase()
    );
    
    // Auto-select region if only one match
    if (regionsByProvince.length === 1) {
      setFieldValue('regionId', regionsByProvince[0].id);
    }
  };
  
  // Cancel form and navigate back
  const handleCancel = () => {
    navigate('/farmers');
  };
  
  if (loading && isEditMode) {
    return <Loader text="Loading farmer data..." />;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow dark:bg-gray-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? 'Edit Farmer' : 'Add New Farmer'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditMode 
            ? 'Update farmer information in the system' 
            : 'Register a new farmer in the system'}
        </p>
      </div>
      
      {farmerError && (
        <Alert 
          type="error" 
          message={farmerError.message || 'An error occurred'} 
          className="mb-4" 
        />
      )}
      
      <form onSubmit={submitForm} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Basic Information</h2>
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
              type="number"
              label="Age"
              name="age"
              value={values.age}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.age && errors.age}
              required
              min={15}
              max={120}
            />
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={values.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value={GENDER.MALE}>Male</option>
                <option value={GENDER.FEMALE}>Female</option>
                <option value={GENDER.OTHER}>Other</option>
              </select>
            </div>
            
            <Input
              label="Contact Number"
              name="contactNumber"
              value={values.contactNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.contactNumber && errors.contactNumber}
              placeholder="+263 77 123 4567"
            />
          </div>
        </div>
        
        {/* Location Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Province <span className="text-red-500">*</span>
              </label>
              <select
                name="province"
                value={values.province}
                onChange={handleProvinceChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="">Select Province</option>
                {/* Get unique provinces from regions */}
                {Array.from(new Set(regions.map(region => region.province))).map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
              {touched.province && errors.province && (
                <p className="mt-1 text-sm text-red-500">{errors.province}</p>
              )}
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Region <span className="text-red-500">*</span>
              </label>
              <select
                name="regionId"
                value={values.regionId}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
                disabled={loadingRegions}
              >
                <option value="">Select Region</option>
                {regions
                  .filter(region => !values.province || region.province === values.province)
                  .map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name} ({region.district})
                    </option>
                  ))}
              </select>
              {touched.regionId && errors.regionId && (
                <p className="mt-1 text-sm text-red-500">{errors.regionId}</p>
              )}
              {loadingRegions && <p className="mt-1 text-sm text-gray-500">Loading regions...</p>}
            </div>
            
            <Input
              label="Ward"
              name="ward"
              value={values.ward}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.ward && errors.ward}
              required
            />
            
            <Input
              label="Natural Region"
              name="naturalRegion"
              value={values.naturalRegion}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            
            <Input
              label="Soil Type"
              name="soilType"
              value={values.soilType}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
        
        {/* Farm Information Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Farm Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Land Ownership Type <span className="text-red-500">*</span>
              </label>
              <select
                name="landOwnershipType"
                value={values.landOwnershipType}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value={LAND_OWNERSHIP_TYPE.OWNED}>Owned</option>
                <option value={LAND_OWNERSHIP_TYPE.LEASED}>Leased</option>
                <option value={LAND_OWNERSHIP_TYPE.COMMUNAL}>Communal</option>
                <option value={LAND_OWNERSHIP_TYPE.RESETTLEMENT}>Resettlement</option>
                <option value={LAND_OWNERSHIP_TYPE.OTHER}>Other</option>
              </select>
            </div>
            
            <Input
              type="number"
              label="Farm Size (hectares)"
              name="farmSizeHectares"
              value={values.farmSizeHectares}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.farmSizeHectares && errors.farmSizeHectares}
              min={0.01}
              step={0.01}
              required
            />
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Land Preparation Type
              </label>
              <select
                name="landPreparationType"
                value={values.landPreparationType}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value={LAND_PREPARATION_TYPE.MANUAL}>Manual</option>
                <option value={LAND_PREPARATION_TYPE.MECHANIZED}>Mechanized</option>
                <option value={LAND_PREPARATION_TYPE.CONSERVATION_TILLAGE}>Conservation Tillage</option>
                <option value={LAND_PREPARATION_TYPE.ZERO_TILLAGE}>Zero Tillage</option>
                <option value={LAND_PREPARATION_TYPE.OTHER}>Other</option>
              </select>
            </div>
            
            <Input
              label="Previous Planted Crop"
              name="previousPlantedCrop"
              value={values.previousPlantedCrop}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            
            <Input
              type="number"
              label="Previous Season Yield (kg)"
              name="previousSeasonYieldKg"
              value={values.previousSeasonYieldKg}
              onChange={handleChange}
              onBlur={handleBlur}
              min={0}
              step={0.1}
            />
            
            <Input
              type="number"
              label="Average Yield Per Season (kg)"
              name="averageYieldPerSeasonKg"
              value={values.averageYieldPerSeasonKg}
              onChange={handleChange}
              onBlur={handleBlur}
              min={0}
              step={0.1}
            />
            
            <Input
              type="datetime-local"
              label="Planting Date"
              name="plantingDate"
              value={values.plantingDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            
            <Input
              type="number"
              label="Input Cost Per Season"
              name="inputCostPerSeason"
              value={values.inputCostPerSeason}
              onChange={handleChange}
              onBlur={handleBlur}
              min={0}
              step={0.01}
            />
            
            <Input
              label="Main Source of Inputs"
              name="mainSourceOfInputs"
              value={values.mainSourceOfInputs}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            
            <Input
              label="Herbicides Used"
              name="herbicidesUsed"
              value={values.herbicidesUsed}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            
            <div className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="usesFertilizer"
                    name="usesFertilizer"
                    checked={values.usesFertilizer}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="usesFertilizer" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Uses Fertilizer
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="manureAvailability"
                    name="manureAvailability"
                    checked={values.manureAvailability}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="manureAvailability" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Manure Available
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="usesPloughing"
                    name="usesPloughing"
                    checked={values.usesPloughing}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="usesPloughing" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Uses Ploughing
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="usesPfumvudza"
                    name="usesPfumvudza"
                    checked={values.usesPfumvudza}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="usesPfumvudza" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Uses Pfumvudza
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="accessToCredit"
                    name="accessToCredit"
                    checked={values.accessToCredit}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="accessToCredit" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Access to Credit
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="keepsFarmRecords"
                    name="keepsFarmRecords"
                    checked={values.keepsFarmRecords}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="keepsFarmRecords" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Keeps Farm Records
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="soilTestingDone"
                    name="soilTestingDone"
                    checked={values.soilTestingDone}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="soilTestingDone" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Soil Testing Done
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="observedOffTypes"
                    name="observedOffTypes"
                    checked={values.observedOffTypes}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="observedOffTypes" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Observed Off-Types
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="hasCropInsurance"
                    name="hasCropInsurance"
                    checked={values.hasCropInsurance}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="hasCropInsurance" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Has Crop Insurance
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="receivesGovtSubsidies"
                    name="receivesGovtSubsidies"
                    checked={values.receivesGovtSubsidies}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="receivesGovtSubsidies" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Receives Gov't Subsidies
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="usesAgroforestry"
                    name="usesAgroforestry"
                    checked={values.usesAgroforestry}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="usesAgroforestry" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Uses Agroforestry
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Farming Practices Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Farming Practices</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Farming Practices
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_FARMING_PRACTICES.map(practice => (
                  <div key={practice} className="form-check">
                    <input
                      type="checkbox"
                      id={`farming-${practice}`}
                      checked={values.farmingPractices.includes(practice)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const updatedPractices = isChecked
                          ? [...values.farmingPractices, practice]
                          : values.farmingPractices.filter(p => p !== practice);
                        
                        setFieldValue('farmingPractices', updatedPractices);
                      }}
                      className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor={`farming-${practice}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {practice}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Conservation Practices
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_CONSERVATION_PRACTICES.map(practice => (
                  <div key={practice} className="form-check">
                    <input
                      type="checkbox"
                      id={`conservation-${practice}`}
                      checked={values.conservationPractices.includes(practice)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const updatedPractices = isChecked
                          ? [...values.conservationPractices, practice]
                          : values.conservationPractices.filter(p => p !== practice);
                        
                        setFieldValue('conservationPractices', updatedPractices);
                      }}
                      className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor={`conservation-${practice}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {practice}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agronomic Practices
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_AGRONOMIC_PRACTICES.map(practice => (
                  <div key={practice} className="form-check">
                    <input
                      type="checkbox"
                      id={`agronomic-${practice}`}
                      checked={values.agronomicPractices.includes(practice)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const updatedPractices = isChecked
                          ? [...values.agronomicPractices, practice]
                          : values.agronomicPractices.filter(p => p !== practice);
                        
                        setFieldValue('agronomicPractices', updatedPractices);
                      }}
                      className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor={`agronomic-${practice}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {practice}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Problematic Pests
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_PESTS.map(pest => (
                  <div key={pest} className="form-check">
                    <input
                      type="checkbox"
                      id={`pest-${pest}`}
                      checked={values.problematicPests.includes(pest)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const updatedPests = isChecked
                          ? [...values.problematicPests, pest]
                          : values.problematicPests.filter(p => p !== pest);
                        
                        setFieldValue('problematicPests', updatedPests);
                      }}
                      className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor={`pest-${pest}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {pest}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Challenges
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {COMMON_CHALLENGES.map(challenge => (
                  <div key={challenge} className="form-check">
                    <input
                      type="checkbox"
                      id={`challenge-${challenge}`}
                      checked={values.challenges.includes(challenge)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        const updatedChallenges = isChecked
                          ? [...values.challenges, challenge]
                          : values.challenges.filter(c => c !== challenge);
                        
                        setFieldValue('challenges', updatedChallenges);
                      }}
                      className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor={`challenge-${challenge}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {challenge}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Compliance Level
              </label>
              <select
                name="complianceLevel"
                value={values.complianceLevel}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value={COMPLIANCE_LEVEL.LOW}>Low</option>
                <option value={COMPLIANCE_LEVEL.MEDIUM}>Medium</option>
                <option value={COMPLIANCE_LEVEL.HIGH}>High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                AEO Visit Frequency
              </label>
              <select
                name="aeoVisitFrequency"
                value={values.aeoVisitFrequency}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value={VISIT_FREQUENCY.WEEKLY}>Weekly</option>
                <option value={VISIT_FREQUENCY.BIWEEKLY}>Biweekly</option>
                <option value={VISIT_FREQUENCY.MONTHLY}>Monthly</option>
                <option value={VISIT_FREQUENCY.QUARTERLY}>Quarterly</option>
                <option value={VISIT_FREQUENCY.YEARLY}>Yearly</option>
                <option value={VISIT_FREQUENCY.NEVER}>Never</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Socioeconomic Information Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Socioeconomic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Social Vulnerability
              </label>
              <select
                name="socialVulnerability"
                value={values.socialVulnerability}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value={VULNERABILITY_LEVEL.LOW}>Low</option>
                <option value={VULNERABILITY_LEVEL.MEDIUM}>Medium</option>
                <option value={VULNERABILITY_LEVEL.HIGH}>High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Education Level
              </label>
              <select
                name="educationLevel"
                value={values.educationLevel}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value={EDUCATION_LEVEL.NONE}>None</option>
                <option value={EDUCATION_LEVEL.PRIMARY}>Primary</option>
                <option value={EDUCATION_LEVEL.SECONDARY}>Secondary</option>
                <option value={EDUCATION_LEVEL.TERTIARY}>Tertiary</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Marital Status
              </label>
              <select
                name="maritalStatus"
                value={values.maritalStatus}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value={MARITAL_STATUS.SINGLE}>Single</option>
                <option value={MARITAL_STATUS.MARRIED}>Married</option>
                <option value={MARITAL_STATUS.DIVORCED}>Divorced</option>
                <option value={MARITAL_STATUS.WIDOWED}>Widowed</option>
              </select>
            </div>
            
            <Input
              type="number"
              label="Household Size"
              name="householdSize"
              value={values.householdSize}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.householdSize && errors.householdSize}
              min={1}
            />
            
            <Input
              type="number"
              label="Number of Dependents"
              name="numberOfDependents"
              value={values.numberOfDependents}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.numberOfDependents && errors.numberOfDependents}
              min={0}
            />
          </div>
        </div>
        
        {/* Support Information Section */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Support & AEO Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agricultural Extension Officer
              </label>
              <select
                name="aeoId"
                value={values.aeoId}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-select block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                disabled={loadingAeos}
              >
                <option value="">Select AEO (Optional)</option>
                {aeos.map(aeo => (
                  <option key={aeo.id} value={aeo.id}>
                    {aeo.name} - {aeo.employeeId}
                  </option>
                ))}
              </select>
              {loadingAeos && <p className="mt-1 text-sm text-gray-500">Loading AEOs...</p>}
            </div>
            
            <div className="form-check mt-8">
              <input
                type="checkbox"
                id="needsSupport"
                name="needsSupport"
                checked={values.needsSupport}
                onChange={handleCheckboxChange}
                className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor="needsSupport" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Needs Support
              </label>
            </div>
            
            {values.needsSupport && (
              <div className="col-span-1 md:col-span-2">
                <Input
                  type="textarea"
                  label="Support Reason"
                  name="supportReason"
                  value={values.supportReason}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  placeholder="Describe why this farmer needs support"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Farmer' : 'Create Farmer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FarmerForm;