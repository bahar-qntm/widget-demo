import React, { useState } from 'react';

const DebugPanel = ({ 
  debugState, 
  filters, 
  extractedParams, 
  psychologyGuidance 
}) => {
  const [activeTab, setActiveTab] = useState('state');

  return (
    <div className="debug-section">
      <div className="section-title">🐛 Debug Information</div>
      
      {/* Debug Tabs */}
      <div className="debug-tabs">
        <button 
          className={`debug-tab ${activeTab === 'state' ? 'active' : ''}`}
          onClick={() => setActiveTab('state')}
        >
          State
        </button>
        <button 
          className={`debug-tab ${activeTab === 'filters' ? 'active' : ''}`}
          onClick={() => setActiveTab('filters')}
        >
          Filters
        </button>
        <button 
          className={`debug-tab ${activeTab === 'parameters' ? 'active' : ''}`}
          onClick={() => setActiveTab('parameters')}
        >
          Parameters
        </button>
        <button 
          className={`debug-tab ${activeTab === 'psychology' ? 'active' : ''}`}
          onClick={() => setActiveTab('psychology')}
        >
          Psychology
        </button>
      </div>
      
      {/* Debug Content */}
      <div className="debug-content">
        {activeTab === 'state' && (
          <div className="debug-item">
            <h4>Widget State & Session</h4>
            <pre>
              {JSON.stringify({
                products: debugState?.products || 0,
                sessionId: debugState?.sessionId || null,
                loading: debugState?.loading || false,
                initializing: debugState?.initializing || false,
                hasExtractedParams: debugState?.hasExtractedParams || false,
                hasPsychologyGuidance: debugState?.hasPsychologyGuidance || false,
                categoryStatsLoaded: debugState?.categoryStatsLoaded || false,
                timestamp: new Date().toISOString()
              }, null, 2)}
            </pre>
          </div>
        )}
        
        {activeTab === 'filters' && (
          <div className="debug-item">
            <h4>Current Filters</h4>
            <pre>
              {JSON.stringify(filters || {}, null, 2)}
            </pre>
          </div>
        )}
        
        {activeTab === 'parameters' && (
          <div className="debug-item">
            <h4>Extracted Parameters</h4>
            <pre>
              {JSON.stringify({
                extracted: extractedParams?.extracted || null,
                accumulated: extractedParams?.accumulated || debugState?.accumulatedParams || null,
                confidence: extractedParams?.extracted?.confidence_score || null,
                query_intent: extractedParams?.extracted?.query_intent || null,
                search_strategy: extractedParams?.extracted?.search_strategy || null
              }, null, 2)}
            </pre>
          </div>
        )}
        
        {activeTab === 'psychology' && (
          <div className="debug-item">
            <h4>Psychology Guidance</h4>
            <pre>
              {JSON.stringify({
                psychology_guidance: psychologyGuidance?.psychology_guidance || null,
                education_stage: psychologyGuidance?.education_stage || null,
                trust_building_elements: psychologyGuidance?.trust_building_elements || null
              }, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      {/* Quick Stats */}
      <div className="debug-stats">
        <div className="debug-stat">
          <span className="stat-label">Products:</span>
          <span className="stat-value">{debugState?.products || 0}</span>
        </div>
        <div className="debug-stat">
          <span className="stat-label">Session:</span>
          <span className="stat-value">{debugState?.sessionId ? '✅' : '❌'}</span>
        </div>
        <div className="debug-stat">
          <span className="stat-label">Loading:</span>
          <span className="stat-value">{debugState?.loading ? '🔄' : '✅'}</span>
        </div>
        <div className="debug-stat">
          <span className="stat-label">Parameters:</span>
          <span className="stat-value">{debugState?.hasExtractedParams ? '✅' : '❌'}</span>
        </div>
        <div className="debug-stat">
          <span className="stat-label">Psychology:</span>
          <span className="stat-value">{debugState?.hasPsychologyGuidance ? '✅' : '❌'}</span>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
