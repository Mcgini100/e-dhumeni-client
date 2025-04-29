/**
 * Application-wide constants
 */

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
export const API_TIMEOUT = 30000; // 30 seconds

// Authentication
export const AUTH_TOKEN_KEY = 'edhumeni_auth_token';
export const AUTH_USER_KEY = 'edhumeni_auth_user';
export const AUTH_EXPIRES_KEY = 'edhumeni_auth_expires';
export const AUTH_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

// Roles and Permissions
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  AEO: 'AEO',
  USER: 'USER',
};

// Contract Types (matching backend enum)
export const CONTRACT_TYPES = {
  BASIC: 'BASIC',
  PREMIUM: 'PREMIUM',
  COOPERATIVE: 'COOPERATIVE',
  CORPORATE: 'CORPORATE',
  GOVERNMENT: 'GOVERNMENT',
};

// Repayment Status (matching backend enum)
export const REPAYMENT_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  DEFAULTED: 'DEFAULTED',
  RENEGOTIATED: 'RENEGOTIATED',
};

// Delivery Quality Grades (matching backend enum)
export const QUALITY_GRADES = {
  A_PLUS: 'A_PLUS',
  A: 'A',
  B: 'B',
  C: 'C',
  REJECTED: 'REJECTED',
};

// Farmer data constants
export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
};

export const LAND_OWNERSHIP_TYPE = {
  OWNED: 'OWNED',
  LEASED: 'LEASED',
  COMMUNAL: 'COMMUNAL',
  RESETTLEMENT: 'RESETTLEMENT',
  OTHER: 'OTHER',
};

export const COMPLIANCE_LEVEL = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const LAND_PREPARATION_TYPE = {
  MANUAL: 'MANUAL',
  MECHANIZED: 'MECHANIZED',
  CONSERVATION_TILLAGE: 'CONSERVATION_TILLAGE',
  ZERO_TILLAGE: 'ZERO_TILLAGE',
  OTHER: 'OTHER',
};

export const VISIT_FREQUENCY = {
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  YEARLY: 'YEARLY',
  NEVER: 'NEVER',
};

export const VULNERABILITY_LEVEL = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const EDUCATION_LEVEL = {
  NONE: 'NONE',
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
  TERTIARY: 'TERTIARY',
};

export const MARITAL_STATUS = {
  SINGLE: 'SINGLE',
  MARRIED: 'MARRIED',
  DIVORCED: 'DIVORCED',
  WIDOWED: 'WIDOWED',
};

// Common farm practices
export const COMMON_FARMING_PRACTICES = [
  'Crop Rotation',
  'Intercropping',
  'Conservation Agriculture',
  'Organic Farming',
  'Conventional Farming',
  'Mixed Farming',
  'Monocropping',
  'Subsistence Farming',
  'Commercial Farming',
];

export const COMMON_CONSERVATION_PRACTICES = [
  'Mulching',
  'Terracing',
  'Contour Farming',
  'Water Harvesting',
  'Drip Irrigation',
  'Cover Crops',
  'No-till Farming',
  'Agroforestry',
  'Crop Residue Management',
];

export const COMMON_AGRONOMIC_PRACTICES = [
  'Seed Selection',
  'Soil Testing',
  'Precision Planting',
  'Irrigation Management',
  'Integrated Pest Management',
  'Fertilizer Application',
  'Weed Control',
  'Crop Monitoring',
  'Harvesting Techniques',
];

export const COMMON_CHALLENGES = [
  'Drought',
  'Flooding',
  'Pests and Diseases',
  'Market Access',
  'Input Costs',
  'Labor Shortages',
  'Equipment Access',
  'Climate Variability',
  'Soil Degradation',
  'Poor Infrastructure',
];

export const COMMON_PESTS = [
  'Fall Armyworm',
  'Aphids',
  'Cutworms',
  'Bollworms',
  'Whiteflies',
  'Thrips',
  'Stalk Borers',
  'Root-knot Nematodes',
  'Mealybugs',
  'Red Spider Mites',
];

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

// Date formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';
export const DISPLAY_DATE_FORMAT = 'DD MMM YYYY';
export const DISPLAY_DATETIME_FORMAT = 'DD MMM YYYY HH:mm';

// Map configuration
export const DEFAULT_MAP_CENTER = [-19.0154, 29.1549]; // Zimbabwe center
export const DEFAULT_MAP_ZOOM = 6;
export const MAP_TILE_LAYER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const MAP_ATTRIBUTION = '© OpenStreetMap contributors';

// Theme
export const THEME_KEY = 'edhumeni_theme';
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Media Queries
export const MEDIA_QUERIES = {
  SM: '(min-width: 640px)',
  MD: '(min-width: 768px)',
  LG: '(min-width: 1024px)',
  XL: '(min-width: 1280px)',
  DARK_MODE: '(prefers-color-scheme: dark)',
};

export default {
  API_BASE_URL,
  API_TIMEOUT,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  AUTH_EXPIRES_KEY,
  AUTH_REFRESH_THRESHOLD,
  USER_ROLES,
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
  COMMON_FARMING_PRACTICES,
  COMMON_CONSERVATION_PRACTICES,
  COMMON_AGRONOMIC_PRACTICES,
  COMMON_CHALLENGES,
  COMMON_PESTS,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  DATE_FORMAT,
  DATETIME_FORMAT,
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATETIME_FORMAT,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  MAP_TILE_LAYER_URL,
  MAP_ATTRIBUTION,
  THEME_KEY,
  THEMES,
  MEDIA_QUERIES,
};