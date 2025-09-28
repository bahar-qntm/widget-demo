import React from 'react';
import { createRoot } from 'react-dom/client';
import MagicWidget from './magic-widget/MagicWidget';

// Default configuration - can be overridden when initializing
const DEFAULT_CONFIG = {
  tenantId: 'gold-leaf-app',
  apiKey: 'dev_key_12345',
  apiUrl: 'http://localhost:8000'
};

/**
 * Initialize Magic Widget on a page
 * @param {HTMLElement} container - DOM element to render the widget in
 * @param {Object} config - Configuration object
 * @returns {Object} Widget instance with cleanup method
 */
export function initMagicWidget(container, config = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  console.log('🚀 Initializing Magic Widget with config:', finalConfig);
  
  // Create React root and render
  const root = createRoot(container);
  root.render(<MagicWidget config={finalConfig} />);
  
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
    // Get config from data attributes
    const config = {
      tenantId: container.dataset.tenantId || DEFAULT_CONFIG.tenantId,
      apiKey: container.dataset.apiKey || DEFAULT_CONFIG.apiKey,
      apiUrl: container.dataset.apiUrl || DEFAULT_CONFIG.apiUrl
    };
    
    console.log('🔍 Auto-initializing Magic Widget');
    return initMagicWidget(container, config);
  }
  
  console.log('ℹ️ No magic-widget-container found for auto-init');
  return null;
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
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
