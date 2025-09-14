/**
 * Cannabis Consultant Widget - Original Layout Restored
 */
class CannabisWidget {
  constructor(config) {
    this.config = config || {};
    this.state = { isExpanded: false, products: [], categoryStats: {}, sessionId: null };
    this.apiClient = new CannabisAPIClient(this.config);
  }

  async init() {
    try {
      this.injectStyles();
      this.createWidget();
      this.attachEventListeners();
      await this.loadCategoryStats();
      await this.loadInitialProducts();
      this.adjustPageLayout();
      console.log('🌿 Cannabis Widget - Original Layout Restored');
    } catch (error) {
      console.error('❌ Widget init failed:', error);
    }
  }

  injectStyles() {
    if (document.getElementById('cannabis-widget-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'cannabis-widget-styles';
    style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

      .cannabis-widget {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 95%;
          max-width: 1200px;
          background: white;
          border-radius: 0 0 8px 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 9999;
          font-family: 'Montserrat', sans-serif;
          border: 1px solid #e0e0e0;
          overflow: hidden;
      }

      .widget-header {
          background: linear-gradient(135deg, #2D5E3E, #8FBC8F);
          color: white;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
      }

      .widget-title {
          font-size: 18px;
          font-weight: 600;
      }

      .toggle-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
      }

      .products-section {
          padding: 20px;
          background: #f9f9f9;
      }

      .products-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(280px, 1fr));
          gap: 15px;
          width: 100%;
      }

      .product-card {
          background: white;
          border-radius: 8px;
          padding: 15px;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          transition: transform 0.2s ease;
          height: 120px;
          display: flex;
          gap: 10px;
      }

      .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .product-image {
          height: 100%;
          object-fit: cover;
          object-position: center;
          border: 1px solid #aaa;
          aspect-ratio: 1 / 1;
      }

      .product-info {
          flex: 1;
      }

      .product-name {
          font-weight: 600;
          color: #2D5E3E;
          margin-bottom: 5px;
      }

      .product-details {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
      }

      .product-price {
          font-weight: bold;
          color: #8FBC8F;
      }

      .expandable-section {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
      }

      .expandable-section.expanded {
          max-height: 600px;
      }

      .filters-section,
      .chat-section {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
      }

      .section-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #2D5E3E;
      }

      .filter-row {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
      }

      .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 140px;
      }

      .filter-label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
      }

      .filter-select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
      }

      .filter-input[type="range"] {
          width: 180px;
          padding: 0;
          border: none;
      }

      .chat-messages {
          max-height: 150px;
          overflow-y: auto;
          margin-bottom: 15px;
          padding: 10px;
          background: #f9f9f9;
          border-radius: 8px;
      }

      .chat-message {
          margin-bottom: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          max-width: 80%;
      }

      .chat-message.user {
          background: #2D5E3E;
          color: white;
          margin-left: auto;
      }

      .chat-message.assistant {
          background: white;
          border: 1px solid #e0e0e0;
      }

      .chat-input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
      }

      .chat-send-btn {
          background: #2D5E3E;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
      }

      .chat-input-container {
          display: flex;
          gap: 10px;
      }

      @media (max-width: 960px) {
          .cannabis-widget {
              width: 98%;
          }

          .products-grid {
              grid-template-columns: 1fr;
          }
      }
    `;
    
    document.head.appendChild(style);
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.className = 'cannabis-widget';
    
    widget.innerHTML = `
      <div class="widget-header" onclick="window.cannabisWidget.toggleExpanded()">
        <div class="widget-title">🌿 Cannabis Consultant</div>
        <button class="toggle-btn" id="toggle-btn">▼ More Options</button>
      </div>
      
      <div class="products-section">
        <div class="products-grid" id="products-grid">
          <div style="text-align: center; padding: 20px; color: #666; grid-column: 1 / -1;">Loading...</div>
        </div>
      </div>
      
      <div class="expandable-section" id="expandable-section">
        <div class="filters-section">
          <div class="section-title">Refine Your Search</div>
          <div class="filter-row">
            <div class="filter-group">
              <label class="filter-label">Category</label>
              <select class="filter-select" id="category-filter" onchange="window.cannabisWidget.onCategoryChange()">
                <option value="">Select Category...</option>
                <option value="Flower">Flower</option>
                <option value="Vapes">Vapes</option>
                <option value="Pre Rolls">Pre Rolls</option>
                <option value="Infused Pre Rolls">Infused Pre Rolls</option>
                <option value="Edibles">Edibles</option>
                <option value="Drinks">Drinks</option>
                <option value="Concentrates">Concentrates</option>
                <option value="Tinctures">Tinctures</option>
                <option value="Topicals">Topicals</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div class="filter-group">
              <label class="filter-label">Effects</label>
              <select class="filter-select" id="effects-filter" onchange="window.cannabisWidget.onFilterChange()" disabled>
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
          </div>
          <div class="filter-row">
            <div class="filter-group" id="thc-potency-group" style="display: none;">
              <label class="filter-label" id="thc-potency-label">THC Potency</label>
              <input type="range" id="thc-potency-range" min="0" max="100" value="20" oninput="window.cannabisWidget.onTHCPotencyChange()">
              <span id="thc-potency-value">0-20%</span>
            </div>
            <div class="filter-group" id="cbd-potency-group" style="display: none;">
              <label class="filter-label" id="cbd-potency-label">CBD Potency</label>
              <input type="range" id="cbd-potency-range" min="0" max="100" value="20" oninput="window.cannabisWidget.onCBDPotencyChange()">
              <span id="cbd-potency-value">0-20mg</span>
            </div>
            <div class="filter-group" id="price-group" style="display: none;">
              <label class="filter-label">Price</label>
              <input type="range" id="price-budget" min="10" max="200" value="60" oninput="window.cannabisWidget.onPriceChange()">
              <span id="price-value">$60</span>
            </div>
          </div>
        </div>
        
        <div class="chat-section">
          <div class="section-title">💬 Chat with Expert</div>
          <div class="chat-messages" id="chat-messages">
            <div class="chat-message assistant">Hi! How can I help you find products?</div>
          </div>
          <div class="chat-input-container">
            <input type="text" class="chat-input" id="chat-input" placeholder="Ask me anything..." onkeypress="if(event.key==='Enter') window.cannabisWidget.sendChat()">
            <button class="chat-send-btn" onclick="window.cannabisWidget.sendChat()">Send</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    this.widget = widget;
    window.cannabisWidget = this;
  }

  attachEventListeners() {
    // Events handled via onclick
  }

  toggleExpanded() {
    this.state.isExpanded = !this.state.isExpanded;
    const section = this.widget.querySelector('#expandable-section');
    const btn = this.widget.querySelector('#toggle-btn');
    
    if (this.state.isExpanded) {
      section.classList.add('expanded');
      btn.textContent = '▲ Less Options';
    } else {
      section.classList.remove('expanded');
      btn.textContent = '▼ More Options';
    }
  }

  async loadCategoryStats() {
    try {
      const response = await this.apiClient.getCategoryStats();
      this.state.categoryStats = response.categories || {};
    } catch (error) {
      console.error('Category stats error:', error);
    }
  }

  async loadInitialProducts() {
    try {
      const response = await this.apiClient.getRecommendations('', {}, 3);
      this.state.products = response.results || response || [];
      this.renderProducts();
    } catch (error) {
      console.error('Products error:', error);
      this.widget.querySelector('#products-grid').innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #666;">Unable to load products</div>';
    }
  }

  onCategoryChange() {
    const category = this.widget.querySelector('#category-filter').value;
    const effectsFilter = this.widget.querySelector('#effects-filter');
    const priceGroup = this.widget.querySelector('#price-group');
    const priceRange = this.widget.querySelector('#price-budget');
    const priceDisplay = this.widget.querySelector('#price-value');
    const thcPotencyGroup = this.widget.querySelector('#thc-potency-group');
    const cbdPotencyGroup = this.widget.querySelector('#cbd-potency-group');
    
    if (category) {
      // Show and enable filters when category is selected
      effectsFilter.disabled = false;
      priceGroup.style.display = 'block'; // Show price slider
      
      // Configure price slider with real category data
      const stats = this.state.categoryStats[category];
      if (stats && stats.price_stats) {
        const realMin = Math.floor(stats.price_stats.min);
        const realMax = Math.ceil(stats.price_stats.max);
        const realAvg = Math.round(stats.price_stats.avg);
        
        priceRange.min = realMin;
        priceRange.max = realMax;
        priceRange.value = realAvg;
        
        priceDisplay.textContent = `$${realAvg} (Range: $${realMin} - $${realMax})`;
        
        console.log(`💰 ${category} price range configured: $${realMin} - $${realMax} (avg: $${realAvg})`);
      }
      
      // Configure potency controls based on category
      if (category !== 'Accessories') {
        if (category === 'Tinctures') {
          // For Tinctures, show CBD potency slider (primary measure)
          thcPotencyGroup.style.display = 'none';
          cbdPotencyGroup.style.display = 'block';
          this.configureCBDPotencySlider(category, stats);
        } else {
          // For all other categories, show THC potency slider
          cbdPotencyGroup.style.display = 'none';
          thcPotencyGroup.style.display = 'block';
          this.configureTHCPotencySlider(category, stats);
        }
      } else {
        // Hide both potency sliders for Accessories
        thcPotencyGroup.style.display = 'none';
        cbdPotencyGroup.style.display = 'none';
      }
    } else {
      // Hide filters when no category selected
      effectsFilter.disabled = true;
      priceGroup.style.display = 'none';
      thcPotencyGroup.style.display = 'none';
      cbdPotencyGroup.style.display = 'none';
    }
    
    this.onFilterChange();
  }

  configureTHCPotencySlider(category, stats) {
    const thcPotencyLabel = this.widget.querySelector('#thc-potency-label');
    const thcPotencyRange = this.widget.querySelector('#thc-potency-range');
    
    // Set appropriate units and labels
    let unit = '%';
    if (['Drinks', 'Edibles', 'Tinctures', 'Topicals'].includes(category)) {
      unit = 'mg';
      thcPotencyLabel.textContent = 'THC Potency (mg)';
    } else {
      thcPotencyLabel.textContent = 'THC Potency (%)';
    }
    
    // Configure range with real THC potency stats
    if (stats && stats.thc_potency_stats && stats.thc_potency_stats.max > 0) {
      const realMin = Math.floor(stats.thc_potency_stats.min);
      const realMax = Math.ceil(stats.thc_potency_stats.max);
      const realAvg = Math.round(stats.thc_potency_stats.avg || realMax / 2);
      
      thcPotencyRange.min = realMin;
      thcPotencyRange.max = realMax;
      thcPotencyRange.value = realAvg;
      
      console.log(`📊 ${category} THC potency range configured: ${realMin}-${realMax}${unit} (avg: ${realAvg}${unit})`);
    }
    
    this.onTHCPotencyChange();
  }

  configureCBDPotencySlider(category, stats) {
    const cbdPotencyLabel = this.widget.querySelector('#cbd-potency-label');
    const cbdPotencyRange = this.widget.querySelector('#cbd-potency-range');
    
    // Set appropriate units and labels (Tinctures use mg)
    cbdPotencyLabel.textContent = 'CBD Potency (mg)';
    
    // Configure range with real CBD potency stats
    if (stats && stats.cbd_potency_stats && stats.cbd_potency_stats.max > 0) {
      const realMin = Math.floor(stats.cbd_potency_stats.min);
      const realMax = Math.ceil(stats.cbd_potency_stats.max);
      const realAvg = Math.round(stats.cbd_potency_stats.avg || realMax / 2);
      
      cbdPotencyRange.min = realMin;
      cbdPotencyRange.max = realMax;
      cbdPotencyRange.value = realAvg;
      
      console.log(`📊 ${category} CBD potency range configured: ${realMin}-${realMax}mg (avg: ${realAvg}mg)`);
    }
    
    this.onCBDPotencyChange();
  }

  onTHCPotencyChange() {
    const range = this.widget.querySelector('#thc-potency-range');
    const display = this.widget.querySelector('#thc-potency-value');
    const category = this.widget.querySelector('#category-filter').value;
    
    let unit = '%';
    if (['Drinks', 'Edibles', 'Tinctures', 'Topicals'].includes(category)) {
      unit = 'mg';
    }
    
    // Show enhanced potency display with range context
    if (category && this.state.categoryStats[category]) {
      const stats = this.state.categoryStats[category];
      if (stats.thc_potency_stats && stats.thc_potency_stats.max > 0) {
        const minPotency = Math.floor(stats.thc_potency_stats.min);
        const maxPotency = Math.ceil(stats.thc_potency_stats.max);
        display.textContent = `${range.value}${unit} (${category}: ${minPotency}-${maxPotency}${unit})`;
      } else {
        display.textContent = `${range.value}${unit}`;
      }
    } else {
      display.textContent = `${range.value}${unit}`;
    }
    
    clearTimeout(this.thcTimeout);
    this.thcTimeout = setTimeout(() => this.onFilterChange(), 500);
  }

  onCBDPotencyChange() {
    const range = this.widget.querySelector('#cbd-potency-range');
    const display = this.widget.querySelector('#cbd-potency-value');
    const category = this.widget.querySelector('#category-filter').value;
    
    // Show enhanced potency display with range context
    if (category && this.state.categoryStats[category]) {
      const stats = this.state.categoryStats[category];
      if (stats.cbd_potency_stats && stats.cbd_potency_stats.max > 0) {
        const minPotency = Math.floor(stats.cbd_potency_stats.min);
        const maxPotency = Math.ceil(stats.cbd_potency_stats.max);
        display.textContent = `${range.value}mg (${category}: ${minPotency}-${maxPotency}mg)`;
      } else {
        display.textContent = `${range.value}mg`;
      }
    } else {
      display.textContent = `${range.value}mg`;
    }
    
    clearTimeout(this.cbdTimeout);
    this.cbdTimeout = setTimeout(() => this.onFilterChange(), 500);
  }

  onPriceChange() {
    const range = this.widget.querySelector('#price-budget');
    const display = this.widget.querySelector('#price-value');
    const category = this.widget.querySelector('#category-filter').value;
    
    // Show enhanced price display with range context
    if (category && this.state.categoryStats[category]) {
      const stats = this.state.categoryStats[category];
      const minPrice = Math.floor(stats.price_stats.min);
      const maxPrice = Math.ceil(stats.price_stats.max);
      display.textContent = `$${range.value} (${category}: $${minPrice} - $${maxPrice})`;
    } else {
      display.textContent = `$${range.value}`;
    }
    
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.onFilterChange(), 500);
  }

  async onFilterChange() {
    const filters = {};
    
    const category = this.widget.querySelector('#category-filter').value;
    if (category) filters.product_categories = [category];
    
    const effects = this.widget.querySelector('#effects-filter').value;
    if (effects) filters.desired_effects = [effects];
    
    // Fix price validation
    const priceElement = this.widget.querySelector('#price-budget');
    const price = priceElement ? parseFloat(priceElement.value) : null;
    if (!isNaN(price) && price > 0) {
      filters.price_max = price;
    }
    
    // Add potency filtering based on which slider is visible
    if (category === 'Tinctures') {
      // For Tinctures, use CBD potency
      const cbdPotencyRange = this.widget.querySelector('#cbd-potency-range');
      const cbdPotencyGroup = this.widget.querySelector('#cbd-potency-group');
      if (cbdPotencyRange && cbdPotencyGroup && cbdPotencyGroup.style.display !== 'none') {
        const cbdMax = parseFloat(cbdPotencyRange.value);
        if (!isNaN(cbdMax) && cbdMax > 0) {
          filters.cbd_max = cbdMax;
          console.log(`🔍 Filtering with CBD max: ${cbdMax}mg`);
        }
      }
    } else if (category && category !== 'Accessories') {
      // For all other categories (except Accessories), use THC potency
      const thcPotencyRange = this.widget.querySelector('#thc-potency-range');
      const thcPotencyGroup = this.widget.querySelector('#thc-potency-group');
      if (thcPotencyRange && thcPotencyGroup && thcPotencyGroup.style.display !== 'none') {
        const thcMax = parseFloat(thcPotencyRange.value);
        if (!isNaN(thcMax) && thcMax > 0) {
          filters.thc_max = thcMax;
          console.log(`🔍 Filtering with THC max: ${thcMax}${['Drinks', 'Edibles', 'Topicals'].includes(category) ? 'mg' : '%'}`);
        }
      }
    }
    
    // Debug logging
    console.log('🐛 DEBUG: Sending filter request:', JSON.stringify(filters, null, 2));
    
    try {
      const response = await this.apiClient.getFilteredProducts(filters);
      this.state.products = response.products || [];
      this.state.lastResponse = response; // Store full response for special messaging
      this.renderProducts();
      console.log('✅ Filter request successful');
    } catch (error) {
      console.error('❌ Filter error:', error);
      console.error('🐛 Failed request payload:', JSON.stringify(filters, null, 2));
    }
  }

  renderProducts() {
    const grid = this.widget.querySelector('#products-grid');
    
    if (!this.state.products || this.state.products.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #666;">No products found</div>';
      return;
    }
    
    // Check if we have a special message from price-relaxed fallback
    let specialMessageHtml = '';
    if (this.state.lastResponse && this.state.lastResponse.message) {
      const message = this.state.lastResponse.message;
      // Check if this is a price-relaxed fallback message
      if (message.includes('found at $') && message.includes('but here are')) {
        specialMessageHtml = `
          <div style="grid-column: 1 / -1; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin-bottom: 15px; color: #856404;">
            <div style="font-weight: 600; margin-bottom: 5px;">💡 Price Adjusted</div>
            <div>${message}</div>
          </div>
        `;
      }
    }
    
    grid.innerHTML = specialMessageHtml + this.state.products.map(product => `
      <div class="product-card" onclick="window.open('${product.url || '#'}', '_blank')">
        ${product.image_url 
          ? `<img src="${product.image_url}" alt="${product.name || 'Cannabis Product'}" class="product-image" />`
          : '<div class="product-image">🌿</div>'
        }
        <div class="product-info">
          <div class="product-name">${product.name || 'Product'}</div>
          <div class="product-details">
            ${product.category || 'Cannabis'} • ${this.getProductEffects(product)}
          </div>
          <div class="product-details">
            THC: ${this.getProductTHC(product)}${this.getProductUnit(product)}
          </div>
          <div class="product-details">
            CBD: ${this.getProductCBD(product)}${this.getProductUnit(product)}
          </div>
          <div class="product-price">$${product.price || '0'}</div>
        </div>
      </div>
    `).join('');
  }

  async sendChat() {
    const input = this.widget.querySelector('#chat-input');
    const message = input.value.trim();
    if (!message) return;
    
    input.value = '';
    this.addChatMessage(message, 'user');
    
    try {
      const response = await this.apiClient.sendChatMessage(message, this.state.sessionId);
      this.addChatMessage(response.message || 'No response', 'assistant');
      if (response.session_id) this.state.sessionId = response.session_id;
    } catch (error) {
      this.addChatMessage('Error occurred', 'assistant');
    }
  }

  addChatMessage(message, sender) {
    const messages = this.widget.querySelector('#chat-messages');
    const div = document.createElement('div');
    div.className = `chat-message ${sender}`;
    div.textContent = message;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  getProductEffects(product) {
    if (product.attributes && product.attributes.effects) {
      return Array.isArray(product.attributes.effects) 
        ? product.attributes.effects[0] || 'Various'
        : product.attributes.effects || 'Various';
    }
    return 'Various';
  }

  getProductTHC(product) {
    if (product.attributes) {
      // Enhanced max(THC, THCa) logic
      const extractNumber = (value) => {
        if (!value) return 0;
        const numStr = String(value).replace(/[^\d.]/g, '');
        return parseFloat(numStr) || 0;
      };
      
      // Check direct attributes
      const thc = extractNumber(product.attributes.thc_content || product.attributes.thc);
      const thca = extractNumber(product.attributes.thca_content || product.attributes.thca);
      
      // Check nested cannabinoids object
      let nestedThc = 0;
      let nestedThca = 0;
      if (product.attributes.cannabinoids) {
        nestedThc = extractNumber(product.attributes.cannabinoids.THC);
        nestedThca = extractNumber(product.attributes.cannabinoids.THCa || product.attributes.cannabinoids.THCA);
      }
      
      return Math.max(thc, thca, nestedThc, nestedThca).toFixed(1);
    }
    return '0';
  }

  getProductCBD(product) {
    if (product.attributes) {
      // Enhanced max(CBD, CBDa) logic
      const extractNumber = (value) => {
        if (!value) return 0;
        const numStr = String(value).replace(/[^\d.]/g, '');
        return parseFloat(numStr) || 0;
      };
      
      // Check direct attributes
      const cbd = extractNumber(product.attributes.cbd_content || product.attributes.cbd);
      const cbda = extractNumber(product.attributes.cbda_content || product.attributes.cbda);
      
      // Check nested cannabinoids object
      let nestedCbd = 0;
      let nestedCbda = 0;
      if (product.attributes.cannabinoids) {
        nestedCbd = extractNumber(product.attributes.cannabinoids.CBD);
        nestedCbda = extractNumber(product.attributes.cannabinoids.CBDa || product.attributes.cannabinoids.CBDA);
      }
      
      return Math.max(cbd, cbda, nestedCbd, nestedCbda).toFixed(1);
    }
    return '0';
  }

  getProductUnit(product) {
    const category = product.category;
    if (['Drinks', 'Edibles', 'Tinctures', 'Topicals'].includes(category)) {
      return 'mg';
    }
    return '%';
  }

  adjustPageLayout() {
    document.body.style.paddingTop = `${this.widget.offsetHeight + 10}px`;
  }
}

class CannabisAPIClient {
  constructor(config) {
    this.tenantId = config.tenantId;
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl || 'http://localhost:8000';
  }

  async getCategoryStats() {
    const response = await fetch(`${this.apiUrl}/category-stats/${this.tenantId}/products/categories/stats`, {
      headers: { 'X-API-Key': this.apiKey }
    });
    return response.json();
  }

  async getFilteredProducts(filters) {
    const payload = { ...filters, limit: 3 };
    console.log('🌐 API Request payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${this.apiUrl}/product/${this.tenantId}/products/parametric-search`, {
      method: 'POST',
      headers: { 'X-API-Key': this.apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error ${response.status}:`, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response received:', data.products?.length || 0, 'products');
    return data;
  }

  async getRecommendations(query, profile, limit = 3) {
    const response = await fetch(`${this.apiUrl}/product/${this.tenantId}/products/recommend`, {
      method: 'POST',
      headers: { 'X-API-Key': this.apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, profile, limit })
    });
    return response.json();
  }

  async sendChatMessage(message, sessionId) {
    const response = await fetch(`${this.apiUrl}/chat/tenant/${this.tenantId}/chat`, {
      method: 'POST',
      headers: { 'X-API-Key': this.apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: message, session_id: sessionId })
    });
    return response.json();
  }
}

window.CannabisWidget = CannabisWidget;
