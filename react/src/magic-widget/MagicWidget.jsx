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
    resetSession,
    
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
      extracted.category ||
      extracted.effects?.length > 0 ||
      extracted.price_range?.length === 2 ||
      extracted.thc_range?.length === 2 ||
      extracted.cbd_range?.length === 2 ||
      extracted.brand ||
      extracted.potency_preference ||
      extracted.requires_products === true
    );
  }, []);

  // Backend-to-React filter conversion using canonical field names
  const convertBackendToReactFilters = useCallback((backendFilters) => {
    const converted = {};
    
    // Category is already a string, just capitalize first letter
    if (backendFilters.category) {
      converted.category = backendFilters.category.charAt(0).toUpperCase() + backendFilters.category.slice(1);
    }
    
    // Convert effects format: effects: ["relaxing"] → effects: "relaxing"
    if (backendFilters.effects?.length > 0) {
      converted.effects = backendFilters.effects[0];
    }
    
    // Direct value mapping for single values
    if (backendFilters.price) {
      converted.price = backendFilters.price;
    }
    
    if (backendFilters.thc) {
      converted.thc = backendFilters.thc;
    }
    
    if (backendFilters.cbd) {
      converted.cbd = backendFilters.cbd;
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

  // Handle clearing AI-detected filters (preserving category + sliders)
  const handleClearFilters = useCallback(async () => {
    console.log('🧹 Clearing AI-detected filters (preserving category + sliders)...');
    
    // Preserve only UI-constrained fields (sliders + category)
    const preservedParams = {};
    
    if (accumulatedParams.category) {
      preservedParams.category = accumulatedParams.category;
    }
    if (accumulatedParams.price) {
      preservedParams.price = accumulatedParams.price;
    }
    if (accumulatedParams.thc) {
      preservedParams.thc = accumulatedParams.thc;
    }
    if (accumulatedParams.cbd) {
      preservedParams.cbd = accumulatedParams.cbd;
    }
    
    // Update accumulated params (clears all semantic fields)
    setAccumulatedParams(preservedParams);
    
    // Clear UI filters - keep slider values, clear dropdown
    const clearedFilters = {
      category: filters.category,
      effects: '',  // Clear dropdown
      price: filters.price,  // Keep slider
      thc: filters.thc,      // Keep slider
      cbd: filters.cbd       // Keep slider
    };
    
    setFilters(clearedFilters);
    
    // Trigger new search with cleared parameters using REPLACE mode
    if (sessionId && !streaming) {
      setLoading(true);
      try {
        const sessionResponse = await apiClient.updateSessionParameters(
          sessionId,
          preservedParams,
          false, // No AI response needed for clearing
          true   // ✅ REPLACE mode - don't merge with existing params
        );
        
        if (sessionResponse.products) {
          setProducts(sessionResponse.products);
          console.log('✅ Products updated after clearing filters:', sessionResponse.products.length);
        }
      } catch (error) {
        console.error('❌ Failed to clear filters:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [accumulatedParams, filters, setAccumulatedParams, setFilters, sessionId, streaming, setLoading, apiClient, setProducts]);

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

  // Handle session reset
  const handleResetSession = useCallback(async () => {
    console.log('🔄 Resetting widget session and chat...');
    
    // Clear messages immediately for instant UI feedback
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: "Hi! I'm your budtender. Tell me what you're looking for or ask me anything!",
        timestamp: new Date()
      }
    ]);
    
    // Reset session and all state
    await resetSession();
  }, [resetSession]);

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
        onResetSession={handleResetSession}
      />

      <div className={`widget-content ${showDebug ? 'debug-active' : ''}`}>
        {/* Main Content Area */}
        <div className="main-content-area">
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
                  onClearFilters={handleClearFilters}
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
          </div>
        </div>

        {/* Debug Sidebar - Right side when active */}
        {showDebug && (
          <div className="debug-sidebar">
            <DebugPanel
              debugState={debugState}
              filters={filters}
              extractedParams={extractedParams}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MagicWidget;
