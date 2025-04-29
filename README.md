# e-Dhumeni Frontend

## Overview

This is the React frontend for the e-Dhumeni Agricultural Performance Tracking System. It provides a modern, responsive user interface for managing farmers, contracts, deliveries, and regions in the agricultural tracking ecosystem.

## Technology Stack

- **Framework**: React 18 with Vite for fast development and production builds
- **State Management**: Context API for authentication and application state
- **Routing**: React Router v6 for navigation
- **Forms & Validation**: Formik and Yup for form management and validation
- **Styling**: TailwindCSS for utility-first styling
- **HTTP Client**: Axios for API communication
- **Charts & Data Visualization**: Chart.js with React-Chartjs-2
- **Maps**: React-Leaflet for interactive mapping features

## Project Structure

The project follows a modular, feature-based structure:

```
e-dhumeni-client/
├── public/                   # Static assets
├── src/
│   ├── api/                  # API client and service modules
│   ├── assets/               # Images, styles, and other assets
│   ├── components/           # Reusable components
│   │   ├── common/           # Shared UI components
│   │   └── layout/           # Layout components (Header, Sidebar, etc.)
│   ├── context/              # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Page components
│   ├── services/             # Business logic services
│   ├── store/                # State management (Redux/Context)
│   ├── utils/                # Utility functions
│   ├── App.jsx               # Main App component
│   ├── routes.jsx            # Application routes configuration
│   └── index.jsx             # Application entry point
└── ...                       # Configuration files
```

## Features Implemented

- **Authentication**
  - Login with JWT token storage
  - Password reset functionality
  - Role-based access control

- **Layout**
  - Responsive main layout with header and sidebar
  - Mobile support with collapsible navigation
  - Role-based UI elements

- **Common Components**
  - Button with variants (primary, secondary, outline, etc.)
  - Card for content organization
  - Table with sorting, filtering, and pagination
  - Form elements with validation

- **Farmers Management**
  - List and search farmers
  - Detailed farmer profile view with tabs
  - Support status management
  - Farming practices visualization

- **Regions**
  - Region listing with search and filtering
  - Interactive map view with Leaflet integration
  - Region statistics and support rate visualization

- **Data Visualization**
  - Charts using Chart.js
  - Color-coded indicators and badges
  - Progress indicators
  - Interactive maps

## Implementation Details

### Authentication Flow

We're using JWT tokens for authentication with secure storage in localStorage. The auth context provides login/logout functionality and user role information throughout the application. API requests automatically include the authentication token via Axios interceptors.

The authentication system includes:
- Token-based authentication
- Role-based access control
- Session timeout handling
- Secure HTTP-only cookies for sensitive data

### SOLID Design Principles

The application follows SOLID principles:

1. **Single Responsibility Principle**
   - Each component has a single responsibility (e.g., Button component only handles button rendering and behavior)
   - API services are separated by domain (auth.api.js, farmers.api.js, etc.)

2. **Open/Closed Principle**
   - Components are designed for extension without modification (e.g., Button accepts variant props)
   - Hook composition allows extending behavior without changing core functionality

3. **Liskov Substitution Principle**
   - Components with similar interfaces can be used interchangeably (e.g., various form input components)
   - All API calls follow consistent patterns and error handling

4. **Interface Segregation Principle**
   - Components only depend on props they actually use
   - Context providers expose only relevant functions to consumers

5. **Dependency Inversion Principle**
   - High-level components depend on abstractions, not concrete implementations
   - API services depend on an abstract apiClient rather than directly on Axios

### Component Architecture

The component hierarchy follows a composable pattern:

- **Page Components**: Integrate multiple feature components
- **Feature Components**: Implement specific business functionality
- **Common Components**: Provide reusable UI elements

Components use a unidirectional data flow pattern, and state management follows these principles:
- Local state for UI-specific state
- Context API for shared state (authentication, alerts)
- Prop drilling avoided through careful component composition

### Performance Considerations

The application implements several performance optimizations:

- Code splitting with React.lazy and Suspense
- Memoization with useMemo and useCallback hooks
- Efficient rendering with key-based lists
- Optimized re-renders with proper dependency arrays in hooks

### Accessibility

Accessibility features include:

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader-friendly implementations

### API Integration

The API integration layer follows these patterns:

- Centralized API client with interceptors
- Service-based organization by domain
- Consistent error handling
- Mock data for development without backend

## Development Guidelines

### Adding New Features

1. Create API service in the appropriate domain file
2. Add page component in the pages directory
3. Create any necessary common components
4. Update routes.jsx to include the new page
5. Add navigation items in Sidebar.jsx if needed

### Styling Guide

The application uses Tailwind CSS with a custom configuration:

- Custom color scheme based on brand colors
- Extended components using @apply directives
- Responsive design with Tailwind's breakpoint system
- Custom animation classes for transitions

### Testing Strategy

Components should be tested using:

- Unit tests for utility functions and hooks
- Component tests for UI components
- Integration tests for complete features
- End-to-end tests for critical workflows

## Deployment

The application is built using Vite and can be deployed in several ways:

1. Static hosting (Netlify, Vercel, etc.)
2. Containerized deployment with the backend
3. Traditional server deployment

Build commands:
```
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```