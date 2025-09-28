import React from 'react';

const ProductGrid = ({ products, loading, isMiniView }) => {
  // Loading state
  if (loading && (!products || products.length === 0)) {
    return (
      <div className="products-section">
        <div className="products-grid">
          <div className="loading-message">Loading products...</div>
        </div>
      </div>
    );
  }

  // No products state
  if (!products || products.length === 0) {
    return (
      <div className="products-section">
        <div className="products-grid">
          <div className="no-products-message">No products found</div>
        </div>
      </div>
    );
  }

  // Helper functions for product data extraction
  const getProductEffects = (product) => {
    if (product.attributes?.effects) {
      return Array.isArray(product.attributes.effects) 
        ? product.attributes.effects[0] || 'Various'
        : product.attributes.effects || 'Various';
    }
    return 'Various';
  };

  const extractNumber = (value) => {
    if (!value) return 0;
    const numStr = String(value).replace(/[^\d.]/g, '');
    return parseFloat(numStr) || 0;
  };

  const getProductTHC = (product) => {
    if (product.attributes) {
      const thc = extractNumber(product.attributes.thc_content || product.attributes.thc);
      const thca = extractNumber(product.attributes.thca_content || product.attributes.thca);
      
      let nestedThc = 0;
      let nestedThca = 0;
      if (product.attributes.cannabinoids) {
        nestedThc = extractNumber(product.attributes.cannabinoids.THC);
        nestedThca = extractNumber(product.attributes.cannabinoids.THCa || product.attributes.cannabinoids.THCA);
      }
      
      return Math.max(thc, thca, nestedThc, nestedThca).toFixed(1);
    }
    return '0';
  };

  const getProductCBD = (product) => {
    if (product.attributes) {
      const cbd = extractNumber(product.attributes.cbd_content || product.attributes.cbd);
      const cbda = extractNumber(product.attributes.cbda_content || product.attributes.cbda);
      
      let nestedCbd = 0;
      let nestedCbda = 0;
      if (product.attributes.cannabinoids) {
        nestedCbd = extractNumber(product.attributes.cannabinoids.CBD);
        nestedCbda = extractNumber(product.attributes.cannabinoids.CBDa || product.attributes.cannabinoids.CBDA);
      }
      
      return Math.max(cbd, cbda, nestedCbd, nestedCbda).toFixed(1);
    }
    return '0';
  };

  const getProductUnit = (product) => {
    const category = product.category;
    if (['Drinks', 'Edibles', 'Tinctures', 'Topicals'].includes(category)) {
      return 'mg';
    }
    return '%';
  };

  const handleProductClick = (product) => {
    if (isMiniView) return; // Disable clicks in mini view
    
    const url = product.url || '#';
    if (url !== '#') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="products-section">
      <div className={`products-grid ${loading ? 'loading' : ''}`}>
        {products.map((product, index) => (
          <div
            key={product.id || index}
            className={`product-card ${isMiniView ? 'mini-view' : ''}`}
            onClick={() => handleProductClick(product)}
            style={{
              cursor: isMiniView ? 'default' : 'pointer',
              pointerEvents: isMiniView ? 'none' : 'auto'
            }}
          >
            {/* Product Image */}
            <div className="product-image-container">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name || 'Cannabis Product'}
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OTk5OSI+8J+MvzwvdGV4dD4KPHN2Zz4K';
                  }}
                />
              ) : (
                <div className="product-image-placeholder">🌿</div>
              )}
            </div>

            {/* Product Info */}
            <div className="product-info">
              <div className="product-name">
                {product.name || 'Product'}
              </div>
              
              {!isMiniView && (
                <>
                  <div className="product-details">
                    {product.category || 'Cannabis'} • {getProductEffects(product)}
                  </div>
                  <div className="product-details">
                    THC: {getProductTHC(product)}{getProductUnit(product)}
                  </div>
                  <div className="product-details">
                    CBD: {getProductCBD(product)}{getProductUnit(product)}
                  </div>
                </>
              )}
              
              <div className="product-price">
                ${product.price || '0'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
