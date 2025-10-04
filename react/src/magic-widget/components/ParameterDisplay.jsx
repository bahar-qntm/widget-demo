import React from 'react';

const ParameterDisplay = ({ extractedParams, accumulatedParams, onClearFilters }) => {
  // Always prioritize accumulated parameters as the authoritative source
  const displayParams = accumulatedParams && Object.keys(accumulatedParams).length > 0 
    ? accumulatedParams 
    : extractedParams?.extracted || {};

  // Don't show if no parameters to display
  if (!displayParams || Object.keys(displayParams).length === 0) return null;

  // Determine display type based on data source
  const isAccumulatedDisplay = accumulatedParams && Object.keys(accumulatedParams).length > 0;
  const confidence = isAccumulatedDisplay ? 100 : Math.round((extractedParams?.extracted?.confidence_score || 0) * 100);

  // Check if there are clearable parameters (anything besides category, price, thc, cbd)
  const hasClearableParams = Object.keys(displayParams).some(key => 
    !['category', 'price', 'thc', 'cbd'].includes(key)
  );

  console.log('🎯 ParameterDisplay - Using accumulated params:', isAccumulatedDisplay, displayParams);

  return (
    <div className="parameter-extraction-display show">
      <div className="extraction-title">
        🤖 AI Detected Your Preferences
        <span className={`confidence-score ${isAccumulatedDisplay ? 'accumulated' : ''}`}>
          {isAccumulatedDisplay ? 'Session' : `${confidence}%`}
        </span>
        {hasClearableParams && onClearFilters && (
          <button 
            className="clear-filters-btn" 
            onClick={onClearFilters}
            title="Clear AI-detected preferences (keeps category & sliders)"
          >
            Clear ×
          </button>
        )}
      </div>
      
      <div className="extracted-params">
        {/* Dynamically render ALL fields from accumulated_parameters */}
        {Object.entries(displayParams).map(([fieldName, fieldValue]) => {
          // Skip empty values
          if (!fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
            return null;
          }
          
          // Format field name for display (e.g., "desired_effects" → "Desired Effects")
          const displayName = fieldName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          // Format value based on type
          let displayValue;
          if (Array.isArray(fieldValue)) {
            displayValue = fieldValue.join(', ');
          } else if (typeof fieldValue === 'number') {
            // Format numbers nicely
            if (fieldName === 'price') {
              displayValue = `around $${Math.round(fieldValue)}`;
            } else if (fieldName === 'thc' || fieldName === 'cbd') {
              displayValue = `around ${Math.round(fieldValue * 10) / 10}${fieldName === 'thc' ? '%' : 'mg'}`;
            } else {
              displayValue = String(fieldValue);
            }
          } else {
            displayValue = String(fieldValue);
          }
          
          // Choose emoji based on field name
          let emoji = '🎯';
          if (fieldName === 'category') emoji = '📦';
          else if (fieldName === 'brand') emoji = '🏷️';
          else if (fieldName.includes('effect')) emoji = '✨';
          else if (fieldName.includes('flavor')) emoji = '🍃';
          else if (fieldName.includes('mood')) emoji = '😌';
          else if (fieldName.includes('texture')) emoji = '🔮';
          else if (fieldName.includes('activity')) emoji = '🎯';
          else if (fieldName === 'price') emoji = '💰';
          else if (fieldName === 'thc') emoji = '🌿';
          else if (fieldName === 'cbd') emoji = '💚';
          else if (fieldName === 'potency_preference') emoji = '⚡';
          else if (fieldName === 'time_of_use') emoji = '🕐';
          else if (fieldName === 'social_context') emoji = '👥';
          else if (fieldName === 'consumption_method') emoji = '💨';
          else if (fieldName === 'experience_level') emoji = '🎓';
          
          return (
            <span key={fieldName} className={`param-tag ${fieldName === 'brand' ? 'brand' : ''} ${fieldName === 'price' ? 'priority' : ''}`}>
              {emoji} {displayName}: {displayValue}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ParameterDisplay;
