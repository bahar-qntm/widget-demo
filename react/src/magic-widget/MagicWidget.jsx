import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductGrid from './components/ProductGrid';
import ChatInterface from './components/ChatInterface';
import FilterPanel from './components/FilterPanel';
import ParameterDisplay from './components/ParameterDisplay';
import DebugPanel from './components/DebugPanel';
import WidgetHeader from './components/WidgetHeader';
import { useMagicWidget } from './hooks/useMagicWidget';
import { useStreamingChat } from './hooks/useStreamingChat';
import { MagicAPIClient } from './services/MagicAPIClient';
import './styles/MagicWidget.css';

const MagicWidget = ({ config = {} }) => {
  // Core state management
  const {
    // Products and session
    products,
    setProducts,
    sessionId,
    setSessionId,
    
    // UI state
    isMiniView,
    setIsMiniView,
    showDebug,
    setShowDebug,
    
    // Filter state
    filters,
    setFilters,
    categoryStats,
    filtersToSearchCriteria,
    
    // Loading states
    loading,
    setLoading,
    
    // Parameter state
    extractedParams,
    setExtractedParams,
    accumulatedParams,
    setAccumulatedParams,
    
    // Initialization
    initialize,
    
    // API client
    apiClient,
    
    // Debug state
    debugState
  } = useMagicWidget(config);

  // Chat state
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your budtender. Tell me what you're looking for or ask me anything!",
      timestamp: new Date()
    }
  ]);

  // Helper function to detect if parameters affect products (must be defined before use)
  const hasProductAffectingParameters = useCallback((params) => {
    if (!params?.extracted) return false;
    
    const extracted = params.extracted;
    
    // Check for any parameter that would change product search results
    return !!(
      extracted.categories?.length > 0 ||
      extracted.effects?.length > 0 ||
      extracted.price_range?.length === 2 ||
      extracted.thc_range?.length === 2 ||
      extracted.cbd_range?.length === 2 ||
      extracted.brand ||
      extracted.potency_preference ||
      extracted.requires_products === true
    );
  }, []);

  // Elegant backend-to-React filter conversion (replaces vanilla JS complexity)
  const convertBackendToReactFilters = useCallback((backendFilters) => {
    const converted = {};
    
    // Convert category format: product_categories: ["flower"] → category: "Flower"
    if (backendFilters.product_categories?.length > 0) {
      const category = backendFilters.product_categories[0];
      // Capitalize first letter to match FilterPanel options
      converted.category = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Convert price range to midpoint: price_min: 64, price_max: 96 → price: 80
    if (backendFilters.price_min && backendFilters.price_max) {
      converted.price = (backendFilters.price_min + backendFilters.price_max) / 2;
    }
    
    // Convert effects format: desired_effects: ["relaxing"] → effects: "relaxing"
    if (backendFilters.desired_effects?.length > 0) {
      converted.effects = backendFilters.desired_effects[0];
    }
    
    // Convert THC range to midpoint: thc_min: 20, thc_max: 30 → thc: 25
    if (backendFilters.thc_min && backendFilters.thc_max) {
      converted.thc = (backendFilters.thc_min + backendFilters.thc_max) / 2;
    }
    
    // Convert CBD range to midpoint: cbd_min: 8, cbd_max: 12 → cbd: 10
    if (backendFilters.cbd_min && backendFilters.cbd_max) {
      converted.cbd = (backendFilters.cbd_min + backendFilters.cbd_max) / 2;
    }
    
    return converted;
  }, []);

  // Streaming chat hook
  const {
    sendStreamingMessage,
    streaming,
    progress,
    setProgress
  } = useStreamingChat({
    config,
    sessionId,
    setSessionId,
    currentFilters: filters,
    onMessage: useCallback((message) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'assistant',
        content: message,
        timestamp: new Date()
      }]);
    }, []),
    onProducts: useCallback((newProducts) => {
      // Update products from streaming response
      // This eliminates race conditions from vanilla JS
      if (newProducts && newProducts.length > 0) {
        console.log('🔄 Products updated from streaming chat:', newProducts.length);
        setProducts(newProducts);
      }
    }, [setProducts]),
    onParametersExtracted: useCallback((params) => {
      setExtractedParams(params);
      
      // Update accumulated parameters state
      if (params.accumulated) {
        setAccumulatedParams(params.accumulated);
        console.log('💾 Updated accumulated parameters:', params.accumulated);
      }
      
      // Show ALL filters if AI extracted any product-affecting parameters
      if (hasProductAffectingParameters(params) && isMiniView) {
        console.log('🎛️ Revealing filters - AI extracted product parameters:', params.extracted);
        setIsMiniView(false);
      }
    }, [setExtractedParams, setAccumulatedParams, hasProductAffectingParameters, isMiniView, setIsMiniView]),
    onFiltersUpdated: useCallback((backendFilters) => {
      // Elegant React sync: Convert backend format and update state
      // React automatically re-renders FilterPanel with new values!
      const reactFilters = convertBackendToReactFilters(backendFilters);
      console.log('🎛️ Converting backend filters to React format:', backendFilters, '→', reactFilters);
      setFilters(prev => ({ ...prev, ...reactFilters }));
    }, [setFilters, convertBackendToReactFilters])
  });

  // Initialize widget on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Handle chat message send
  const handleSendMessage = useCallback(async (message) => {
    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      role: 'user', 
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Send streaming request
    await sendStreamingMessage(message);
  }, [sendStreamingMessage]);

  // Handle filter changes from UI (single API call approach)
  const handleFilterChange = useCallback(async (newFilters, shouldSearch = true) => {
    // 1. Update React state immediately (instant UI feedback)
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    if (shouldSearch && !streaming && sessionId) {
      setLoading(true);
      try {
        // 2. Check if this is a significant filter change that warrants AI explanation
        const isSignificantChange = 
          (newFilters.category && newFilters.category !== filters.category) ||
          (newFilters.effects && newFilters.effects !== filters.effects) ||
          (newFilters.price && Math.abs((newFilters.price || 0) - (filters.price || 0)) > 20) ||
          (newFilters.thc !== undefined && Math.abs((newFilters.thc || 0) - (filters.thc || 0)) > 5) ||
          (newFilters.cbd !== undefined && Math.abs((newFilters.cbd || 0) - (filters.cbd || 0)) > 5);
        
        if (isSignificantChange) {
          console.log('💬 Significant filter change detected - using parameter endpoint with AI response');
          
          // Show typing indicator using same system as chat (consistent styling)
          setProgress({ 
            icon: '✏️', 
            message: 'Typing', 
            typing: true 
          });
        }
        
        // 3. SINGLE API call to parameter endpoint (handles both products AND session update)
        const sessionResponse = await apiClient.updateSessionParameters(
          sessionId, 
          updatedFilters, 
          isSignificantChange // generate_ai_response=true only for significant changes
        );
        
        // Clear typing indicator 
        setProgress(null);
        
        // 4. Update products from parameter endpoint response
        if (sessionResponse.products) {
          setProducts(sessionResponse.products);
          console.log('✅ Products updated from parameter endpoint:', sessionResponse.products.length);
        }
        
        // 5. Add AI response to chat if generated
        if (sessionResponse.ai_response) {
          const aiMessage = {
            id: Date.now(),
            role: 'assistant',
            content: sessionResponse.ai_response,
            timestamp: new Date(),
            isFilterResponse: true // Mark as filter-generated response
          };
          
          setMessages(prev => [...prev, aiMessage]);
          console.log('🤖 Added AI filter change explanation to chat');
        }
        
        // 6. Update accumulated parameters state from backend response
        if (sessionResponse.accumulated_parameters) {
          setAccumulatedParams(sessionResponse.accumulated_parameters);
          console.log('💾 Updated accumulated parameters from UI filter change:', sessionResponse.accumulated_parameters);
        }
        
      } catch (error) {
        // Clear typing indicator on error
        setProgress(null);
        console.error('❌ Failed to update filters and products:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [filters, setFilters, streaming, sessionId, setLoading, apiClient, setProducts, setMessages, setProgress, setAccumulatedParams]);

  // Handle mini view toggle
  const handleToggleMiniView = useCallback(() => {
    setIsMiniView(prev => !prev);
  }, [setIsMiniView]);

  // Handle debug toggle
  const handleToggleDebug = useCallback(() => {
    setShowDebug(prev => !prev);
  }, [setShowDebug]);

  // Adjust page layout on mount and mini view changes
  useEffect(() => {
    const adjustPageLayout = () => {
      const widget = document.querySelector('.magic-widget');
      if (widget) {
        document.body.style.paddingTop = `${widget.offsetHeight + 10}px`;
      }
    };
    
    adjustPageLayout();
    window.addEventListener('resize', adjustPageLayout);
    
    return () => {
      window.removeEventListener('resize', adjustPageLayout);
      document.body.style.paddingTop = '';
    };
  }, [isMiniView]);

  // Click handler for mini view expansion
  const handleWidgetClick = useCallback((event) => {
    if (!isMiniView) return;
    
    // Don't expand if clicking on interactive elements
    if (event.target.closest('.widget-header, .minimize-button')) {
      return;
    }
    
    event.stopPropagation();
    event.preventDefault();
    handleToggleMiniView();
  }, [isMiniView, handleToggleMiniView]);

  return (
    <div 
      className={`magic-widget ${isMiniView ? 'mini-view' : ''}`}
      onClick={handleWidgetClick}
    >
      <WidgetHeader
        isMiniView={isMiniView}
        showDebug={showDebug}
        onToggleMiniView={handleToggleMiniView}
        onToggleDebug={handleToggleDebug}
      />

      <div className="widget-content">
        {/* Products Section - Always visible */}
        <ProductGrid
          products={products}
          loading={loading || streaming}
          isMiniView={isMiniView}
        />

        {/* Expandable Sections - Hidden in mini view */}
        <div className={`expandable-sections ${isMiniView ? 'collapsed' : 'expanded'}`}>
          {/* Info Displays */}
          <div className="info-displays">
            {extractedParams && (
              <ParameterDisplay
                extractedParams={extractedParams}
                accumulatedParams={accumulatedParams}
              />
            )}
            
          </div>

          {/* Filter Panel */}
          <FilterPanel
            filters={filters}
            categoryStats={categoryStats}
            loading={loading || streaming}
            onFilterChange={handleFilterChange}
          />

          {/* Chat Interface */}
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            streaming={streaming}
            progress={progress}
            disabled={loading}
          />

          {/* Debug Panel */}
          {showDebug && (
            <DebugPanel
              debugState={debugState}
              filters={filters}
              extractedParams={extractedParams}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MagicWidget;
