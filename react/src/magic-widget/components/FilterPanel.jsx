import React, { useState, useEffect, useCallback } from 'react';

const FilterPanel = ({ 
  filters, 
  categoryStats, 
  loading, 
  onFilterChange 
}) => {
  // Local state for immediate UI feedback
  const [localFilters, setLocalFilters] = useState(filters);
  const [syncingFilters, setSyncingFilters] = useState(new Set());

  // Update local filters when props change (from chat sync)
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Debounced filter change handler
  const debouncedChange = useCallback(
    debounce((newFilters) => {
      onFilterChange(newFilters, true);
    }, 500),
    [onFilterChange]
  );

  // Handle filter change with visual sync indicator
  const handleFilterChange = useCallback((filterKey, value, immediate = false) => {
    const newFilters = { ...localFilters, [filterKey]: value };
    setLocalFilters(newFilters);

    if (immediate) {
      // Immediate update (e.g., category change)
      onFilterChange(newFilters, true);
      
      // Show sync indicator
      setSyncingFilters(prev => new Set(prev).add(filterKey));
      setTimeout(() => {
        setSyncingFilters(prev => {
          const newSet = new Set(prev);
          newSet.delete(filterKey);
          return newSet;
        });
      }, 1000);
    } else {
      // Debounced update (e.g., slider changes)
      debouncedChange(newFilters);
    }
  }, [localFilters, onFilterChange, debouncedChange]);

  // Category change handler - triggers immediate filter visibility changes
  const handleCategoryChange = useCallback((category) => {
    handleFilterChange('category', category, true);
  }, [handleFilterChange]);

  // Calculate single value display (no more ±20% ranges)
  const calculateSingleValueDisplay = useCallback((value, unit = '') => {
    if (!value || value <= 0) return `0${unit}`;
    return `${Math.round(value)}${unit}`;
  }, []);

  // Get category stats for current selection
  const getCurrentCategoryStats = useCallback(() => {
    return categoryStats[localFilters.category] || {};
  }, [categoryStats, localFilters.category]);

  // Determine if filter groups should be visible
  const showPriceFilter = localFilters.category;
  const showEffectsFilter = localFilters.category;
  const showTHCFilter = localFilters.category && localFilters.category !== 'Accessories';
  const showCBDFilter = localFilters.category === 'Tinctures';

  // Get potency unit based on category
  const getPotencyUnit = useCallback((category) => {
    if (['Drinks', 'Edibles', 'Tinctures', 'Topicals'].includes(category)) {
      return 'mg';
    }
    return '%';
  }, []);

  return (
    <div className="filters-section">
      <div className="section-title">
        🎯 Smart Filters
        {(loading || syncingFilters.size > 0) && (
          <span className="sync-indicator"></span>
        )}
      </div>
      
      <div className="filter-rows">
        {/* Row 1: Category and Effects */}
        <div className="filter-row">
          {/* Category Filter - Always visible */}
          <div className={`filter-group ${syncingFilters.has('category') ? 'syncing' : ''}`}>
            <label className="filter-label">Category</label>
            <select
              className="filter-select"
              value={localFilters.category || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={loading}
            >
              <option value="">Select Category...</option>
              <option value="Flower">Flower</option>
              <option value="Vapes">Vapes</option>
              <option value="Pre-Rolls">Pre-Rolls</option>
              <option value="Infused Pre-Rolls">Infused Pre-Rolls</option>
              <option value="Edibles">Edibles</option>
              <option value="Drinks">Drinks</option>
              <option value="Concentrates">Concentrates</option>
              <option value="Tinctures">Tinctures</option>
              <option value="Topicals">Topicals</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>

          {/* Effects Filter - Visible when category is selected */}
          {showEffectsFilter && (
            <div className={`filter-group ${syncingFilters.has('effects') ? 'syncing' : ''}`}>
              <label className="filter-label">Effects</label>
              <select
                className="filter-select"
                value={localFilters.effects || ''}
                onChange={(e) => handleFilterChange('effects', e.target.value)}
                disabled={loading}
              >
                <option value="">Any Effects</option>
                <option value="body relief">Body Relief</option>
                <option value="creative">Creative</option>
                <option value="energetic">Energetic</option>
                <option value="euphoric">Euphoric</option>
                <option value="focused">Focused</option>
                <option value="relaxing">Relaxing</option>
                <option value="sedating">Sedating</option>
              </select>
            </div>
          )}
        </div>

        {/* Row 2: Range Filters */}
        <div className="filter-row">
          {/* Price Filter - Midpoint ±20% */}
          {showPriceFilter && (
            <div className={`filter-group range-filter ${syncingFilters.has('price') ? 'syncing' : ''}`}>
              <label className="filter-label">Price (Around)</label>
              <input
                type="range"
                className="filter-range"
                min={getCurrentCategoryStats().price_stats?.min || 10}
                max={getCurrentCategoryStats().price_stats?.max || 200}
                value={localFilters.price || getCurrentCategoryStats().price_stats?.avg || 60}
                onChange={(e) => handleFilterChange('price', parseFloat(e.target.value))}
                disabled={loading}
              />
              <span className="range-display">
                ${calculateSingleValueDisplay(localFilters.price || getCurrentCategoryStats().price_stats?.avg || 60)}
              </span>
            </div>
          )}

          {/* THC Filter - Midpoint ±20% */}
          {showTHCFilter && (
            <div className={`filter-group range-filter ${syncingFilters.has('thc') ? 'syncing' : ''}`}>
              <label className="filter-label">
                THC Potency ({getPotencyUnit(localFilters.category)})
              </label>
              <input
                type="range"
                className="filter-range"
                min={getCurrentCategoryStats().thc_potency_stats?.min || 0}
                max={getCurrentCategoryStats().thc_potency_stats?.max || 100}
                value={localFilters.thc || getCurrentCategoryStats().thc_potency_stats?.avg || 20}
                onChange={(e) => handleFilterChange('thc', parseFloat(e.target.value))}
                disabled={loading}
              />
              <span className="range-display">
                {calculateSingleValueDisplay(
                  localFilters.thc || getCurrentCategoryStats().thc_potency_stats?.avg || 20,
                  getPotencyUnit(localFilters.category)
                )}
              </span>
            </div>
          )}

          {/* CBD Filter - Midpoint ±20% (Tinctures only) */}
          {showCBDFilter && (
            <div className={`filter-group range-filter ${syncingFilters.has('cbd') ? 'syncing' : ''}`}>
              <label className="filter-label">CBD Potency (mg)</label>
              <input
                type="range"
                className="filter-range"
                min={getCurrentCategoryStats().cbd_potency_stats?.min || 0}
                max={getCurrentCategoryStats().cbd_potency_stats?.max || 100}
                value={localFilters.cbd || getCurrentCategoryStats().cbd_potency_stats?.avg || 10}
                onChange={(e) => handleFilterChange('cbd', parseFloat(e.target.value))}
                disabled={loading}
              />
              <span className="range-display">
                {calculateSingleValueDisplay(
                  localFilters.cbd || getCurrentCategoryStats().cbd_potency_stats?.avg || 10,
                  'mg'
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default FilterPanel;
