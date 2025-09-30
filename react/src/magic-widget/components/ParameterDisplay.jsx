import React from 'react';

const ParameterDisplay = ({ extractedParams, accumulatedParams }) => {
  // Always prioritize accumulated parameters as the authoritative source
  const displayParams = accumulatedParams && Object.keys(accumulatedParams).length > 0 
    ? accumulatedParams 
    : extractedParams?.extracted || {};

  // Don't show if no parameters to display
  if (!displayParams || Object.keys(displayParams).length === 0) return null;

  // Determine display type based on data source
  const isAccumulatedDisplay = accumulatedParams && Object.keys(accumulatedParams).length > 0;
  const confidence = isAccumulatedDisplay ? 100 : Math.round((extractedParams?.extracted?.confidence_score || 0) * 100);

  console.log('🎯 ParameterDisplay - Using accumulated params:', isAccumulatedDisplay, displayParams);

  return (
    <div className="parameter-extraction-display show">
      <div className="extraction-title">
        🤖 AI Detected Your Preferences
        <span className={`confidence-score ${isAccumulatedDisplay ? 'accumulated' : ''}`}>
          {isAccumulatedDisplay ? 'Session' : `${confidence}%`}
        </span>
      </div>
      
      <div className="extracted-params">
        {/* Brand - Highest priority with special styling */}
        {displayParams.brand && (
          <span className="param-tag brand">
            🏷️ Brand: {displayParams.brand}
          </span>
        )}
        
        {/* Categories */}
        {displayParams.categories && displayParams.categories.length > 0 && (
          <span className="param-tag">
            📦 Categories: {Array.isArray(displayParams.categories) 
              ? displayParams.categories.join(', ') 
              : displayParams.categories}
          </span>
        )}
        
        {/* Effects */}
        {displayParams.effects && displayParams.effects.length > 0 && (
          <span className="param-tag">
            ✨ Effects: {Array.isArray(displayParams.effects) 
              ? displayParams.effects.join(', ') 
              : displayParams.effects}
          </span>
        )}
        
        {/* Flavor */}
        {displayParams.flavor && displayParams.flavor.length > 0 && (
          <span className="param-tag">
            🍃 Flavor: {Array.isArray(displayParams.flavor) 
              ? displayParams.flavor.join(', ') 
              : displayParams.flavor}
          </span>
        )}
        
        {/* Activity */}
        {displayParams.activity && displayParams.activity.length > 0 && (
          <span className="param-tag">
            🎯 Activity: {Array.isArray(displayParams.activity) 
              ? displayParams.activity.join(', ') 
              : displayParams.activity}
          </span>
        )}
        
        {/* Mood */}
        {displayParams.mood && displayParams.mood.length > 0 && (
          <span className="param-tag">
            😌 Mood: {Array.isArray(displayParams.mood) 
              ? displayParams.mood.join(', ') 
              : displayParams.mood}
          </span>
        )}
        
        {/* Setting */}
        {displayParams.setting && displayParams.setting.length > 0 && (
          <span className="param-tag">
            🏠 Setting: {Array.isArray(displayParams.setting) 
              ? displayParams.setting.join(', ') 
              : displayParams.setting}
          </span>
        )}
        
        {/* Experience */}
        {displayParams.experience && displayParams.experience.length > 0 && (
          <span className="param-tag">
            ✨ Experience: {Array.isArray(displayParams.experience) 
              ? displayParams.experience.join(', ') 
              : displayParams.experience}
          </span>
        )}
        
        {/* Price - Single value (new proximity system) */}
        {displayParams.price && (
          <span className="param-tag priority">
            💰 Price: around ${Math.round(displayParams.price)}
          </span>
        )}
        
        {/* Price range - Legacy support */}
        {!displayParams.price && displayParams.price_range && Array.isArray(displayParams.price_range) && displayParams.price_range.length === 2 && (
          <span className="param-tag priority">
            💰 Price: ${displayParams.price_range[0]}-$${displayParams.price_range[1]}
          </span>
        )}
        
        {/* THC - Single value (new proximity system) */}
        {displayParams.thc && (
          <span className="param-tag">
            🌿 THC: around {Math.round(displayParams.thc * 10) / 10}%
          </span>
        )}
        
        {/* THC range - Legacy support */}
        {!displayParams.thc && displayParams.thc_range && Array.isArray(displayParams.thc_range) && displayParams.thc_range.length === 2 && (
          <span className="param-tag">
            🌿 THC: {displayParams.thc_range[0]}-{displayParams.thc_range[1]}%
          </span>
        )}
        
        {/* CBD - Single value (new proximity system) */}
        {displayParams.cbd && (
          <span className="param-tag">
            💚 CBD: around {Math.round(displayParams.cbd * 10) / 10}mg
          </span>
        )}
        
        {/* CBD range - Legacy support */}
        {!displayParams.cbd && displayParams.cbd_range && Array.isArray(displayParams.cbd_range) && displayParams.cbd_range.length === 2 && (
          <span className="param-tag">
            💚 CBD: {displayParams.cbd_range[0]}-{displayParams.cbd_range[1]}mg
          </span>
        )}
        
        {/* Potency preference */}
        {displayParams.potency_preference && (
          <span className="param-tag">
            ⚡ Potency: {displayParams.potency_preference}
          </span>
        )}
        
        {/* Time of use */}
        {displayParams.time_of_use && (
          <span className="param-tag">
            🕐 Time: {displayParams.time_of_use}
          </span>
        )}
        
        {/* Social context */}
        {displayParams.social_context && (
          <span className="param-tag">
            👥 Context: {displayParams.social_context}
          </span>
        )}
        
        {/* Consumption method */}
        {displayParams.consumption_method && (
          <span className="param-tag">
            💨 Method: {displayParams.consumption_method}
          </span>
        )}
        
        {/* Experience level */}
        {displayParams.experience_level && (
          <span className="param-tag">
            🎓 Level: {displayParams.experience_level}
          </span>
        )}
      </div>
    </div>
  );
};

export default ParameterDisplay;
