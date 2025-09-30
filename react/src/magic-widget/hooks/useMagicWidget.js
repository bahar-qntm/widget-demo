import { useState, useCallback, useMemo } from 'react';
import { MagicAPIClient } from '../services/MagicAPIClient';

export const useMagicWidget = (config = {}) => {
  // Core state - replaces the complex CannabisWidgetStateManager
  const [products, setProducts] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [categoryStats, setCategoryStats] = useState({});
  
  // UI state - simple React state instead of manual DOM manipulation
  const [isMiniView, setIsMiniView] = useState(true); // Start in mini view for auto-expand demo
  const [showDebug, setShowDebug] = useState(false);
  
  // Filter state - eliminates race conditions from vanilla JS
  const [filters, setFilters] = useState({
    category: '',
    effects: '',
    price: null,
    thc: null,
    cbd: null
  });
  
  // Loading states - replaces complex operation tracking
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  
  // Parameter state - replaces manual parameter extraction handling
  const [extractedParams, setExtractedParams] = useState(null);
  const [psychologyGuidance, setPsychologyGuidance] = useState(null);
  const [accumulatedParams, setAccumulatedParams] = useState({});

  // API client instance
  const apiClient = useMemo(() => new MagicAPIClient(config), [config]);

  // Initialize widget - replaces complex init method
  const initialize = useCallback(async () => {
    try {
      setInitializing(true);
      
      // Load category stats
      const stats = await apiClient.getCategoryStats();
      setCategoryStats(stats.categories || {});
      
      // Load initial products
      const response = await apiClient.getRecommendations('', {}, 3);
      setProducts(response.results || response || []);
      
      console.log('✅ Magic Widget initialized successfully');
    } catch (error) {
      console.error('❌ Magic Widget initialization failed:', error);
      setProducts([]);
    } finally {
      setInitializing(false);
    }
  }, [apiClient]);

  // Legacy updateProducts function removed - now handled by parameter endpoint

  // Calculate filter ranges using midpoint ±20% logic
  const calculateRange = useCallback((midpoint, percentage = 20) => {
    if (!midpoint || midpoint <= 0) return null;
    
    const delta = (midpoint * percentage) / 100;
    return {
      min: Math.max(0, midpoint - delta),
      max: midpoint + delta,
      midpoint: midpoint,
      display: `${Math.round(midpoint - delta)}-${Math.round(midpoint + delta)}`
    };
  }, []);

  // Convert filters to search criteria - uses single values for proximity scoring
  const filtersToSearchCriteria = useCallback((currentFilters) => {
    const criteria = {};
    
    // Category
    if (currentFilters.category) {
      criteria.product_categories = [currentFilters.category];
    }
    
    // Effects
    if (currentFilters.effects) {
      criteria.desired_effects = [currentFilters.effects];
    }
    
    // Single price value (proximity-based scoring)
    if (currentFilters.price) {
      criteria.price = currentFilters.price;
    }
    
    // Single THC value (proximity-based scoring)
    if (currentFilters.thc) {
      criteria.thc = currentFilters.thc;
    }
    
    // Single CBD value (proximity-based scoring)
    if (currentFilters.cbd) {
      criteria.cbd = currentFilters.cbd;
    }
    
    return criteria;
  }, []);

  // Debug state for development - replaces complex debug tracking
  const debugState = useMemo(() => ({
    products: products.length,
    sessionId,
    filters,
    accumulatedParams,
    loading,
    initializing,
    hasExtractedParams: !!extractedParams,
    hasPsychologyGuidance: !!psychologyGuidance,
    categoryStatsLoaded: Object.keys(categoryStats).length > 0
  }), [
    products.length,
    sessionId,
    filters,
    accumulatedParams,
    loading,
    initializing,
    extractedParams,
    psychologyGuidance,
    categoryStats
  ]);

  return {
    // Core data
    products,
    setProducts,
    sessionId,
    setSessionId,
    categoryStats,
    
    // UI state
    isMiniView,
    setIsMiniView,
    showDebug,
    setShowDebug,
    
    // Filter state
    filters,
    setFilters,
    filtersToSearchCriteria,
    
    // Loading states
    loading,
    setLoading,
    initializing,
    
    // Parameter state
    extractedParams,
    setExtractedParams,
    psychologyGuidance,
    setPsychologyGuidance,
    accumulatedParams,
    setAccumulatedParams,
    
    // Actions
    initialize,
    calculateRange,
    
    // API client
    apiClient,
    
    // Debug
    debugState
  };
};
