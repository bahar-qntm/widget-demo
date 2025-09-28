import React from 'react';
import { createRoot } from 'react-dom/client';
import MagicWidget from './magic-widget/MagicWidget';

/**
 * Automatically detect the appropriate API URL based on environment
 * @returns {string} The API URL to use
 */
function getAutoApiUrl() {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    return 'http://localhost:8000';  // Local development
  } else {
    return 'https://budtender.cannafax.com';  // Production (GitHub Pages/Azure)
  }
}

// Default configuration - can be overridden when initializing
const DEFAULT_CONFIG = {
  tenantId: '5388610a-535a-4d3f-92e5-9ae6527f9283',
  apiKey: 'aa7cfcf7b7403d6fb3513b1d3dda2825',
  apiUrl: getAutoApiUrl()  // Automatically detect environment
};

/**
 * Initialize Magic Widget on a page (UMD version)
 * @param {HTMLElement} container - DOM element to render the widget in
 * @param {Object} config - Configuration object
 * @returns {Object} Widget instance with cleanup method
 */
export function initMagicWidget(container, config = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  console.log('🚀 Initializing Magic Widget with config:', finalConfig);
  console.log('🌐 Auto-detected API URL:', finalConfig.apiUrl);
  
  // Create React root and render using React.createElement instead of JSX
  const root = createRoot(container);
  root.render(React.createElement(MagicWidget, { config: finalConfig }));
  
  // Return widget instance with cleanup
  return {
    config: finalConfig,
    cleanup: () => {
      root.unmount();
      console.log('🧹 Magic Widget cleaned up');
    }
  };
}

/**
 * Auto-initialize widget if container exists on page load
 */
function autoInit() {
  // Look for magic-widget-container div
  const container = document.getElementById('magic-widget-container');
  if (container) {
    // Get config from data attributes with automatic API URL detection
    const config = {
      tenantId: container.dataset.tenantId || DEFAULT_CONFIG.tenantId,
      apiKey: container.dataset.apiKey || DEFAULT_CONFIG.apiKey,
      apiUrl: container.dataset.apiUrl || getAutoApiUrl()  // Auto-detect if not specified
    };
    
    console.log('🔍 Auto-initializing Magic Widget');
    console.log('🌐 Environment detected:', window.location.hostname);
    console.log('🔌 Using API URL:', config.apiUrl);
    
    return initMagicWidget(container, config);
  }
  
  console.log('ℹ️ No magic-widget-container found for auto-init');
  return null;
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }
}

// Export for global access (UMD build)
if (typeof window !== 'undefined') {
  window.MagicWidget = {
    init: initMagicWidget,
    autoInit
  };
}

// Export for module usage
export default MagicWidget;
export { MagicWidget };
