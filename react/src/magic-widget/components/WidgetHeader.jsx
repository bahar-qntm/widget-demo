import React from 'react';

const WidgetHeader = ({ 
  isMiniView, 
  showDebug, 
  onToggleMiniView, 
  onToggleDebug,
  onResetSession 
}) => {
  return (
    <div className="widget-header">
      <div className="header-left">
        <div className="widget-title">🌿 Budtender</div>
      </div>
      
      <div className="header-right">
        <button 
          className="reset-toggle"
          onClick={onResetSession}
          title="Reset session and start fresh"
        >
          🔄 Reset
        </button>
        
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
      </div>
    </div>
  );
};

export default WidgetHeader;
