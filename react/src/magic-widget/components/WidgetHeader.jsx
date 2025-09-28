import React from 'react';

const WidgetHeader = ({ 
  educationStage, 
  isMiniView, 
  showDebug, 
  onToggleMiniView, 
  onToggleDebug 
}) => {
  return (
    <div className="widget-header">
      <div className="header-left">
        <div className="widget-title">🧠 AI Magic Consultant</div>
        <div className="education-stage-badge">
          {educationStage || 'awareness'}
        </div>
      </div>
      
      <div className="header-right">
        <button 
          className="debug-toggle"
          onClick={onToggleDebug}
          title="Toggle debug panel"
        >
          🐛 Debug
        </button>
        
        <button
          className="toggle-btn"
          onClick={onToggleMiniView}
          title={isMiniView ? 'Expand widget' : 'Minimize widget'}
        >
          {isMiniView ? '⬆️' : '⬇️'}
        </button>
        
        <button
          className="minimize-button"
          onClick={onToggleMiniView}
          style={{ display: isMiniView ? 'none' : 'flex' }}
          title="Minimize widget"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default WidgetHeader;
