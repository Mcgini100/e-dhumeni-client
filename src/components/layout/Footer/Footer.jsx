import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Copyright */}
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm dark:text-gray-300">
              &copy; {currentYear} e-Dhumeni. All rights reserved.
            </p>
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap items-center space-x-4">
            <a 
              href="#help" 
              className="text-gray-600 text-sm hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              Help
            </a>
            <a 
              href="#privacy" 
              className="text-gray-600 text-sm hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              Privacy Policy
            </a>
            <a 
              href="#terms" 
              className="text-gray-600 text-sm hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              Terms of Service
            </a>
            <a 
              href="#contact" 
              className="text-gray-600 text-sm hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400"
            >
              Contact
            </a>
          </div>
          
          {/* Version */}
          <div className="mt-4 md:mt-0">
            <span className="text-gray-500 text-xs dark:text-gray-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;