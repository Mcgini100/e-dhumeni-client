import { format, parseISO, isValid } from 'date-fns';
import { 
  CONTRACT_TYPES, 
  REPAYMENT_STATUS, 
  QUALITY_GRADES,
  GENDER,
  LAND_OWNERSHIP_TYPE,
  COMPLIANCE_LEVEL,
  LAND_PREPARATION_TYPE,
  VISIT_FREQUENCY,
  VULNERABILITY_LEVEL,
  EDUCATION_LEVEL,
  MARITAL_STATUS,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATETIME_FORMAT
} from '../config/constants';

/**
 * Formats a date string or Date object to a readable format
 * 
 * @param {string|Date} dateValue - The date to format
 * @param {string} formatStr - The format string to use
 * @returns {string} - The formatted date string
 */
export const formatDate = (dateValue, formatStr = DISPLAY_DATE_FORMAT) => {
  if (!dateValue) return '';
  
  let date;
  if (typeof dateValue === 'string') {
    date = parseISO(dateValue);
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else {
    return '';
  }
  
  if (!isValid(date)) return '';
  
  return format(date, formatStr);
};

/**
 * Formats a datetime string or Date object to a readable format
 * 
 * @param {string|Date} dateValue - The datetime to format
 * @returns {string} - The formatted datetime string
 */
export const formatDateTime = (dateValue) => {
  return formatDate(dateValue, DISPLAY_DATETIME_FORMAT);
};

/**
 * Formats a number as currency
 * 
 * @param {number} value - The value to format
 * @param {string} currency - The currency code
 * @param {string} locale - The locale to use
 * @returns {string} - The formatted currency string
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formats a number with appropriate decimal places
 * 
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - The locale to use
 * @returns {string} - The formatted number
 */
export const formatNumber = (value, decimals = 2, locale = 'en-US') => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Formats a weight value with the appropriate unit
 * 
 * @param {number} value - The weight in kg
 * @returns {string} - The formatted weight with unit
 */
export const formatWeight = (value) => {
  if (value === null || value === undefined) return '';
  
  return `${formatNumber(value)} kg`;
};

/**
 * Formats a number as a percentage
 * 
 * @param {number} value - The value to format (0-100 or 0-1)
 * @param {boolean} isDecimal - Whether the value is decimal (0-1) or percentage (0-100)
 * @returns {string} - The formatted percentage
 */
export const formatPercentage = (value, isDecimal = false) => {
  if (value === null || value === undefined) return '';
  
  // Convert decimal to percentage if needed
  const percentage = isDecimal ? value * 100 : value;
  
  return `${formatNumber(percentage, 1)}%`;
};

/**
 * Formats a hectare value
 * 
 * @param {number} value - The area in hectares
 * @returns {string} - The formatted area with unit
 */
export const formatHectares = (value) => {
  if (value === null || value === undefined) return '';
  
  return `${formatNumber(value, 2)} ha`;
};

/**
 * Formats a contract type to a readable string
 * 
 * @param {string} type - The contract type
 * @returns {string} - The readable contract type
 */
export const formatContractType = (type) => {
  if (!type) return '';
  
  const typeMap = {
    [CONTRACT_TYPES.BASIC]: 'Basic',
    [CONTRACT_TYPES.PREMIUM]: 'Premium',
    [CONTRACT_TYPES.COOPERATIVE]: 'Cooperative',
    [CONTRACT_TYPES.CORPORATE]: 'Corporate',
    [CONTRACT_TYPES.GOVERNMENT]: 'Government',
  };
  
  return typeMap[type] || type;
};

/**
 * Formats a repayment status to a readable string
 * 
 * @param {string} status - The repayment status
 * @returns {string} - The readable repayment status
 */
export const formatRepaymentStatus = (status) => {
  if (!status) return '';
  
  const statusMap = {
    [REPAYMENT_STATUS.NOT_STARTED]: 'Not Started',
    [REPAYMENT_STATUS.IN_PROGRESS]: 'In Progress',
    [REPAYMENT_STATUS.COMPLETED]: 'Completed',
    [REPAYMENT_STATUS.DEFAULTED]: 'Defaulted',
    [REPAYMENT_STATUS.RENEGOTIATED]: 'Renegotiated',
  };
  
  return statusMap[status] || status;
};

/**
 * Formats a quality grade to a readable string
 * 
 * @param {string} grade - The quality grade
 * @returns {string} - The readable quality grade
 */
export const formatQualityGrade = (grade) => {
  if (!grade) return '';
  
  const gradeMap = {
    [QUALITY_GRADES.A_PLUS]: 'A+',
    [QUALITY_GRADES.A]: 'A',
    [QUALITY_GRADES.B]: 'B',
    [QUALITY_GRADES.C]: 'C',
    [QUALITY_GRADES.REJECTED]: 'Rejected',
  };
  
  return gradeMap[grade] || grade;
};

/**
 * Formats a gender to a readable string
 * 
 * @param {string} gender - The gender
 * @returns {string} - The readable gender
 */
export const formatGender = (gender) => {
  if (!gender) return '';
  
  const genderMap = {
    [GENDER.MALE]: 'Male',
    [GENDER.FEMALE]: 'Female',
    [GENDER.OTHER]: 'Other',
  };
  
  return genderMap[gender] || gender;
};

/**
 * Formats a land ownership type to a readable string
 * 
 * @param {string} type - The land ownership type
 * @returns {string} - The readable land ownership type
 */
export const formatLandOwnershipType = (type) => {
  if (!type) return '';
  
  const typeMap = {
    [LAND_OWNERSHIP_TYPE.OWNED]: 'Owned',
    [LAND_OWNERSHIP_TYPE.LEASED]: 'Leased',
    [LAND_OWNERSHIP_TYPE.COMMUNAL]: 'Communal',
    [LAND_OWNERSHIP_TYPE.RESETTLEMENT]: 'Resettlement',
    [LAND_OWNERSHIP_TYPE.OTHER]: 'Other',
  };
  
  return typeMap[type] || type;
};

/**
 * Formats a compliance level to a readable string
 * 
 * @param {string} level - The compliance level
 * @returns {string} - The readable compliance level
 */
export const formatComplianceLevel = (level) => {
  if (!level) return '';
  
  const levelMap = {
    [COMPLIANCE_LEVEL.LOW]: 'Low',
    [COMPLIANCE_LEVEL.MEDIUM]: 'Medium',
    [COMPLIANCE_LEVEL.HIGH]: 'High',
  };
  
  return levelMap[level] || level;
};

/**
 * Formats a land preparation type to a readable string
 * 
 * @param {string} type - The land preparation type
 * @returns {string} - The readable land preparation type
 */
export const formatLandPreparationType = (type) => {
  if (!type) return '';
  
  const typeMap = {
    [LAND_PREPARATION_TYPE.MANUAL]: 'Manual',
    [LAND_PREPARATION_TYPE.MECHANIZED]: 'Mechanized',
    [LAND_PREPARATION_TYPE.CONSERVATION_TILLAGE]: 'Conservation Tillage',
    [LAND_PREPARATION_TYPE.ZERO_TILLAGE]: 'Zero Tillage',
    [LAND_PREPARATION_TYPE.OTHER]: 'Other',
  };
  
  return typeMap[type] || type;
};

/**
 * Formats a visit frequency to a readable string
 * 
 * @param {string} frequency - The visit frequency
 * @returns {string} - The readable visit frequency
 */
export const formatVisitFrequency = (frequency) => {
  if (!frequency) return '';
  
  const frequencyMap = {
    [VISIT_FREQUENCY.WEEKLY]: 'Weekly',
    [VISIT_FREQUENCY.BIWEEKLY]: 'Biweekly',
    [VISIT_FREQUENCY.MONTHLY]: 'Monthly',
    [VISIT_FREQUENCY.QUARTERLY]: 'Quarterly',
    [VISIT_FREQUENCY.YEARLY]: 'Yearly',
    [VISIT_FREQUENCY.NEVER]: 'Never',
  };
  
  return frequencyMap[frequency] || frequency;
};

/**
 * Formats a vulnerability level to a readable string
 * 
 * @param {string} level - The vulnerability level
 * @returns {string} - The readable vulnerability level
 */
export const formatVulnerabilityLevel = (level) => {
  if (!level) return '';
  
  const levelMap = {
    [VULNERABILITY_LEVEL.LOW]: 'Low',
    [VULNERABILITY_LEVEL.MEDIUM]: 'Medium',
    [VULNERABILITY_LEVEL.HIGH]: 'High',
  };
  
  return levelMap[level] || level;
};

/**
 * Formats an education level to a readable string
 * 
 * @param {string} level - The education level
 * @returns {string} - The readable education level
 */
export const formatEducationLevel = (level) => {
  if (!level) return '';
  
  const levelMap = {
    [EDUCATION_LEVEL.NONE]: 'None',
    [EDUCATION_LEVEL.PRIMARY]: 'Primary',
    [EDUCATION_LEVEL.SECONDARY]: 'Secondary',
    [EDUCATION_LEVEL.TERTIARY]: 'Tertiary',
  };
  
  return levelMap[level] || level;
};

/**
 * Formats a marital status to a readable string
 * 
 * @param {string} status - The marital status
 * @returns {string} - The readable marital status
 */
export const formatMaritalStatus = (status) => {
  if (!status) return '';
  
  const statusMap = {
    [MARITAL_STATUS.SINGLE]: 'Single',
    [MARITAL_STATUS.MARRIED]: 'Married',
    [MARITAL_STATUS.DIVORCED]: 'Divorced',
    [MARITAL_STATUS.WIDOWED]: 'Widowed',
  };
  
  return statusMap[status] || status;
};

/**
 * Truncates a string to a maximum length
 * 
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length
 * @returns {string} - The truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength - 3)}...`;
};

/**
 * Formats a phone number for display
 * 
 * @param {string} phone - The phone number to format
 * @returns {string} - The formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  } else if (cleaned.length === 11 && cleaned.charAt(0) === '1') {
    return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`;
  } else if (cleaned.length === 12 && cleaned.substring(0, 3) === '263') {
    // Zimbabwe format
    return `+263 ${cleaned.substring(3, 5)} ${cleaned.substring(5, 8)} ${cleaned.substring(8)}`;
  }
  
  // If no specific format applies, add the country code if missing
  if (cleaned.length > 9 && !phone.includes('+')) {
    return `+${cleaned}`;
  }
  
  // Otherwise return as is
  return phone;
};

/**
 * Formats a JSON object as a readable string
 * 
 * @param {Object} obj - The object to format
 * @returns {string} - The formatted JSON string
 */
export const formatJSON = (obj) => {
  if (!obj) return '';
  
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return String(obj);
  }
};

/**
 * Formats a list of items as a comma-separated string
 * 
 * @param {Array} items - The array of items
 * @param {string} emptyMessage - Message to show if array is empty
 * @returns {string} - The formatted string
 */
export const formatList = (items, emptyMessage = 'None') => {
  if (!items || !items.length) return emptyMessage;
  
  return items.join(', ');
};

/**
 * Format file size in a human-readable way
 * 
 * @param {number} bytes - The file size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formats a boolean value as Yes/No
 * 
 * @param {boolean} value - The boolean value
 * @returns {string} - 'Yes' or 'No'
 */
export const formatYesNo = (value) => {
  return value ? 'Yes' : 'No';
};

/**
 * Gets the initials from a name
 * 
 * @param {string} name - The name
 * @returns {string} - The initials
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

export default {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatNumber,
  formatWeight,
  formatPercentage,
  formatHectares,
  formatContractType,
  formatRepaymentStatus,
  formatQualityGrade,
  formatGender,
  formatLandOwnershipType,
  formatComplianceLevel,
  formatLandPreparationType,
  formatVisitFrequency,
  formatVulnerabilityLevel,
  formatEducationLevel,
  formatMaritalStatus,
  truncateText,
  formatPhoneNumber,
  formatJSON,
  formatList,
  formatFileSize,
  formatYesNo,
  getInitials,
};