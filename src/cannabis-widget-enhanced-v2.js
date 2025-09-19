/**
 * Cannabis Consultant Widget - Enhanced with Phase 1 & 2 AI Features
 * Features: Chat API v2, Parameter Extraction, Behavioral Psychology, Filter Sync
 */
class CannabisWidgetEnhanced {
  constructor(config) {
    this.config = config || {};
    this.state = { 
      isMiniView: false, 
      products: [], 
      categoryStats: {}, 
      sessionId: null,
      userProfile: {},
      lastExtractedParameters: null,
      lastPsychologyGuidance: null,
      filterSyncInProgress: false,
      showDebugPanel: this.config.showDebug || false
    };
    this.apiClient = new EnhancedCannabisAPIClient(this.config);
  }

  async init() {
    try {
      this.injectStyles();
      this.createWidget();
      this.attachEventListeners();
      await this.loadCategoryStats();
      await this.loadInitialProducts();
      this.adjustPageLayout();
      console.log('🌿 Cannabis Widget Enhanced v2 - AI-Powered with Behavioral Psychology');
    } catch (error) {
      console.error('❌ Widget init failed:', error);
    }
  }

  injectStyles() {
    if (document.getElementById('cannabis-widget-styles-v2')) return;
    
    const style = document.createElement('style');
    style.id = 'cannabis-widget-styles-v2';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');

      .cannabis-widget-enhanced {
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

      .widget-header-enhanced {
          background: linear-gradient(135deg, #2D5E3E, #8FBC8F);
          color: white;
          padding: 15px 20px;
          height: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
      }

      .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
      }

      .widget-title-enhanced {
          font-size: 18px;
          font-weight: 600;
      }

      .education-stage-badge {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          text-transform: capitalize;
      }

      .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
      }

      .debug-toggle {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
      }

      .toggle-btn-enhanced {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
      }

      .products-section-enhanced {
          padding: 20px;
          background: #f9f9f9;
      }

      .products-grid-enhanced {
          display: grid;
          grid-template-columns: repeat(3, minmax(280px, 1fr));
          gap: 15px;
          width: 100%;
      }

      .product-card-enhanced {
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

      .product-card-enhanced:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .product-image-enhanced {
          height: 100%;
          object-fit: cover;
          object-position: center;
          border: 1px solid #aaa;
          aspect-ratio: 1 / 1;
      }

      .product-info-enhanced {
          flex: 1;
      }

      .product-name-enhanced {
          font-weight: 600;
          color: #2D5E3E;
          margin-bottom: 5px;
      }

      .product-details-enhanced {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
      }

      .product-price-enhanced {
          font-weight: bold;
          color: #8FBC8F;
      }

      .expandable-section-enhanced {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
      }

      .expandable-section-enhanced.expanded {
          max-height: 800px;
      }

      .filters-section-enhanced,
      .chat-section-enhanced,
      .debug-section {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
      }

      .section-title-enhanced {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #2D5E3E;
          display: flex;
          align-items: center;
          gap: 10px;
      }

      .sync-indicator {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #28a745;
          animation: pulse 1s infinite;
      }

      @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
      }

      .parameter-extraction-display {
          background: #e3f2fd;
          border: 1px solid #1976d2;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 15px;
          display: none;
      }

      .parameter-extraction-display.show {
          display: block;
          animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
      }

      .extraction-title {
          font-weight: 600;
          color: #1976d2;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
      }

      .confidence-score {
          background: rgba(25, 118, 210, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
      }

      .extracted-params {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
      }

      .param-tag {
          background: #2D5E3E;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
      }

      .psychology-guidance-display {
          background: #f3e5f5;
          border: 1px solid #9c27b0;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 15px;
          display: none;
      }

      .psychology-guidance-display.show {
          display: block;
          animation: slideIn 0.3s ease;
      }

      .guidance-title {
          font-weight: 600;
          color: #9c27b0;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
      }

      .trust-elements {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
      }

      .trust-tag {
          background: rgba(156, 39, 176, 0.1);
          color: #9c27b0;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
      }

      .filter-row-enhanced {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          flex-wrap: wrap;
      }

      .filter-group-enhanced {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 140px;
          position: relative;
      }

      .filter-group-enhanced.syncing {
          background: rgba(40, 167, 69, 0.1);
          border-radius: 8px;
          padding: 8px;
          animation: highlight 1s ease;
      }

      @keyframes highlight {
          0% { background: rgba(40, 167, 69, 0.3); }
          100% { background: rgba(40, 167, 69, 0.1); }
      }

      .filter-label-enhanced {
          font-size: 14px;
          font-weight: 500;
          color: #333;
      }

      .filter-select-enhanced {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
      }

      .filter-input-enhanced[type="range"] {
          width: 180px;
          padding: 0;
          border: none;
      }

      .chat-messages-enhanced {
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 15px;
          padding: 10px;
          background: #f9f9f9;
          border-radius: 8px;
      }

      .chat-message-enhanced {
          margin-bottom: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          max-width: 80%;
      }

      .chat-message-enhanced.user {
          background: #2D5E3E;
          color: white;
          margin-left: auto;
      }

      .chat-message-enhanced.assistant {
          background: white;
          border: 1px solid #e0e0e0;
      }

      .chat-message-enhanced ul {
          margin: 8px 0;
          padding-left: 20px;
      }

      .chat-message-enhanced li {
          margin: 4px 0;
          list-style-type: disc;
      }

      .chat-message-enhanced ul ul {
          margin: 4px 0;
          padding-left: 20px;
      }

      .chat-message-enhanced ul ul li {
          list-style-type: circle;
      }

      .progress-message {
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 8px 12px;
          margin-bottom: 10px;
          max-width: 80%;
          font-style: italic;
          color: #666;
          display: flex;
          align-items: center;
          gap: 8px;
      }

      .typing-dots {
          display: inline-flex;
          gap: 2px;
      }

      .typing-dots span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #666;
          animation: typing 1.4s infinite ease-in-out;
      }

      .typing-dots span:nth-child(1) { animation-delay: 0.0s; }
      .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
      .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-10px); opacity: 1; }
      }

      .progress-icon {
          font-size: 16px;
          animation: pulse 2s infinite;
      }

      .chat-input-enhanced {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
      }

      .chat-send-btn-enhanced {
          background: #2D5E3E;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
      }

      .chat-input-container-enhanced {
          display: flex;
          gap: 10px;
      }

      .debug-section {
          background: #f8f9fa;
          border: 2px dashed #6c757d;
          display: none;
      }

      .debug-section.show {
          display: block;
      }

      .debug-item {
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 10px;
      }

      .debug-item h4 {
          margin: 0 0 8px 0;
          color: #495057;
          font-size: 14px;
      }

      .debug-item pre {
          margin: 0;
          font-size: 12px;
          background: #f8f9fa;
          padding: 8px;
          border-radius: 4px;
          overflow-x: auto;
      }

      .minimize-button-enhanced {
          background: rgba(255, 255, 255, 0.2);
          font-size: 1.5rem;
          padding: 5px;
          aspect-ratio: 1 / 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          border-radius: 6px;
          user-select: none;
      }

      .hidden {
          display: none;
      }

      @media (max-width: 960px) {
          .cannabis-widget-enhanced {
              width: 98%;
          }

          .products-grid-enhanced {
              grid-template-columns: 1fr !important;
          }
      }
    `;
    
    document.head.appendChild(style);
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.className = 'cannabis-widget-enhanced';
    
    widget.innerHTML = `
      <div class="widget-header-enhanced">
        <div class="header-left">
          <div class="widget-title-enhanced">🧠 AI Cannabis Consultant</div>
          <div class="education-stage-badge" id="education-stage-badge">awareness</div>
        </div>
        <div class="header-right">
          <div class="debug-toggle" onclick="window.cannabisWidgetEnhanced.toggleDebug()">🐛 Debug</div>
          <div class="minimize-button-enhanced hidden">×</div>
        </div>
      </div>
      
      <div class="products-section-enhanced">
        <div class="products-grid-enhanced" id="products-grid-enhanced">
          <div style="text-align: center; padding: 20px; color: #666; grid-column: 1 / -1;">Loading...</div>
        </div>
      </div>
      
      <div class="expandable-section-enhanced" id="expandable-section-enhanced">
        <div class="filters-section-enhanced">
          <div class="section-title-enhanced">
            🎯 Smart Filters
            <span class="sync-indicator hidden" id="sync-indicator"></span>
          </div>
          
          <div class="parameter-extraction-display" id="parameter-extraction-display">
            <div class="extraction-title">
              🤖 AI Detected Your Preferences
              <span class="confidence-score" id="confidence-score">95%</span>
            </div>
            <div class="extracted-params" id="extracted-params"></div>
          </div>
          
          <div class="psychology-guidance-display" id="psychology-guidance-display">
            <div class="guidance-title">
              🧠 Personalized Guidance
            </div>
            <div id="guidance-content"></div>
            <div class="trust-elements" id="trust-elements"></div>
          </div>
          
          <div class="filter-row-enhanced">
            <div class="filter-group-enhanced" id="category-filter-group">
              <label class="filter-label-enhanced">Category</label>
              <select class="filter-select-enhanced" id="category-filter-enhanced" onchange="window.cannabisWidgetEnhanced.onCategoryChange()">
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
            <div class="filter-group-enhanced" id="effects-filter-group">
              <label class="filter-label-enhanced">Effects</label>
              <select class="filter-select-enhanced" id="effects-filter-enhanced" onchange="window.cannabisWidgetEnhanced.onFilterChange()" disabled>
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
          <div class="filter-row-enhanced">
            <div class="filter-group-enhanced" id="thc-potency-group-enhanced" style="display: none;">
              <label class="filter-label-enhanced" id="thc-potency-label-enhanced">THC Potency</label>
              <input type="range" id="thc-potency-range-enhanced" min="0" max="100" value="20" oninput="window.cannabisWidgetEnhanced.onTHCPotencyChange()">
              <span id="thc-potency-value-enhanced">0-20%</span>
            </div>
            <div class="filter-group-enhanced" id="cbd-potency-group-enhanced" style="display: none;">
              <label class="filter-label-enhanced" id="cbd-potency-label-enhanced">CBD Potency</label>
              <input type="range" id="cbd-potency-range-enhanced" min="0" max="100" value="20" oninput="window.cannabisWidgetEnhanced.onCBDPotencyChange()">
              <span id="cbd-potency-value-enhanced">0-20mg</span>
            </div>
            <div class="filter-group-enhanced" id="price-group-enhanced" style="display: none;">
              <label class="filter-label-enhanced">Price</label>
              <input type="range" id="price-budget-enhanced" min="10" max="200" value="60" oninput="window.cannabisWidgetEnhanced.onPriceChange()">
              <span id="price-value-enhanced">$60</span>
            </div>
          </div>
        </div>
        
        <div class="chat-section-enhanced">
          <div class="section-title-enhanced">💬 AI Chat Assistant</div>
          <div class="chat-messages-enhanced" id="chat-messages-enhanced">
            <div class="chat-message-enhanced assistant">Hi! I'm your AI cannabis consultant. Tell me what you're looking for or ask me anything!</div>
          </div>
          <div class="chat-input-container-enhanced">
            <input type="text" class="chat-input-enhanced" id="chat-input-enhanced" placeholder="Ask me anything..." onkeypress="if(event.key==='Enter') window.cannabisWidgetEnhanced.sendChat()">
            <button class="chat-send-btn-enhanced" onclick="window.cannabisWidgetEnhanced.sendChat()">Send</button>
          </div>
        </div>
        
        <div class="debug-section" id="debug-section">
          <div class="section-title-enhanced">🐛 Debug Information</div>
          <div class="debug-item">
            <h4>User Profile & Session</h4>
            <pre id="debug-user-profile">{}</pre>
          </div>
          <div class="debug-item">
            <h4>Last Parameter Extraction</h4>
            <pre id="debug-parameters">{}</pre>
          </div>
          <div class="debug-item">
            <h4>Psychology Guidance</h4>
            <pre id="debug-psychology">{}</pre>
          </div>
          <div class="debug-item">
            <h4>Current Filters</h4>
            <pre id="debug-filters">{}</pre>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
    this.widget = widget;
    window.cannabisWidgetEnhanced = this;

    const minimizeButton = this.widget.querySelector('.minimize-button-enhanced');
    minimizeButton.addEventListener('click', this.toggleMiniView.bind(this));

    this.toggleMiniView();
  }

  attachEventListeners() {
    // Events handled via onclick attributes
  }

  toggleDebug() {
    this.state.showDebugPanel = !this.state.showDebugPanel;
    const debugSection = this.widget.querySelector('#debug-section');
    debugSection.classList.toggle('show', this.state.showDebugPanel);
    
    if (this.state.showDebugPanel) {
      this.updateDebugInfo();
    }
  }

  updateDebugInfo() {
    if (!this.state.showDebugPanel) return;
    
    document.getElementById('debug-user-profile').textContent = JSON.stringify(this.state.userProfile, null, 2);
    document.getElementById('debug-parameters').textContent = JSON.stringify(this.state.lastExtractedParameters, null, 2);
    document.getElementById('debug-psychology').textContent = JSON.stringify(this.state.lastPsychologyGuidance, null, 2);
    
    const currentFilters = this.getCurrentFilters();
    document.getElementById('debug-filters').textContent = JSON.stringify(currentFilters, null, 2);
  }

  getCurrentFilters() {
    const filters = {};
    
    const category = this.widget.querySelector('#category-filter-enhanced').value;
    if (category) filters.product_categories = [category];
    
    const effects = this.widget.querySelector('#effects-filter-enhanced').value;
    if (effects) filters.desired_effects = [effects];
    
    const priceElement = this.widget.querySelector('#price-budget-enhanced');
    const price = priceElement ? parseFloat(priceElement.value) : null;
    if (!isNaN(price) && price > 0) {
      filters.price_max = price;
    }
    
    return filters;
  }

  toggleMiniView() {
    this.state.isMiniView = !this.state.isMiniView;
    this.renderProducts();
    
    this.widget.style.width = this.state.isMiniView ? '700px' : '95%';

    const minimizeButton = this.widget.querySelector('.minimize-button-enhanced');
    minimizeButton.classList.toggle('hidden', this.state.isMiniView);
    
    const productSection = this.widget.querySelector('.products-section-enhanced');
    productSection.style.padding = this.state.isMiniView ? '10px' : '20px';
    
    const productsGrid = this.widget.querySelector('.products-grid-enhanced');
    productsGrid.style.gridTemplateColumns = this.state.isMiniView ? 'repeat(3, minmax(212px, 1fr))' : 'repeat(3, minmax(280px, 1fr))';
    
    const productCards = this.widget.querySelectorAll('.product-card-enhanced');
    productCards.forEach(card => {
      card.style.height = this.state.isMiniView ? '80px' : '120px';
      card.style.pointerEvents = this.state.isMiniView ? 'none' : 'auto';
    });

    const expandableSection = this.widget.querySelector('#expandable-section-enhanced');
    expandableSection.classList.toggle('expanded', !this.state.isMiniView);

    if (!this.state.isMiniView) {
      return;
    }

    this.widget.addEventListener('click', this.onWidgetClickExpand.bind(this));
  }

  onWidgetClickExpand(event) {
    if (event.target.closest('.minimize-button-enhanced')) return;
    event.stopPropagation();
    event.preventDefault();
    if (!this.state.isMiniView) return;
    this.toggleMiniView();
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
      this.widget.querySelector('#products-grid-enhanced').innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #666;">Unable to load products</div>';
    }
  }

  showParameterExtraction(extractedData) {
    if (!extractedData || !extractedData.extracted_parameters) return;
    
    const display = this.widget.querySelector('#parameter-extraction-display');
    const confidenceSpan = this.widget.querySelector('#confidence-score');
    const paramsContainer = this.widget.querySelector('#extracted-params');
    
    const params = extractedData.extracted_parameters;
    const confidence = Math.round((params.confidence_score || 0) * 100);
    
    confidenceSpan.textContent = `${confidence}%`;
    
    // Create parameter tags
    paramsContainer.innerHTML = '';
    
    if (params.effects && params.effects.length > 0) {
      const tag = document.createElement('span');
      tag.className = 'param-tag';
      tag.textContent = `Effects: ${params.effects.join(', ')}`;
      paramsContainer.appendChild(tag);
    }
    
    if (params.categories && params.categories.length > 0) {
      const tag = document.createElement('span');
      tag.className = 'param-tag';
      tag.textContent = `Categories: ${params.categories.join(', ')}`;
      paramsContainer.appendChild(tag);
    }
    
    if (params.potency_preference) {
      const tag = document.createElement('span');
      tag.className = 'param-tag';
      tag.textContent = `Potency: ${params.potency_preference}`;
      paramsContainer.appendChild(tag);
    }
    
    display.classList.add('show');
    this.state.lastExtractedParameters = params;
    this.updateDebugInfo();
  }

  showPsychologyGuidance(guidanceData) {
    if (!guidanceData || !guidanceData.psychology_guidance) return;
    
    const display = this.widget.querySelector('#psychology-guidance-display');
    const contentDiv = this.widget.querySelector('#guidance-content');
    const trustElements = this.widget.querySelector('#trust-elements');
    
    const guidance = guidanceData.psychology_guidance;
    
    // Update education stage badge
    const badge = this.widget.querySelector('#education-stage-badge');
    if (guidanceData.education_stage) {
      badge.textContent = guidanceData.education_stage;
    }
    
    // Show guidance content
    contentDiv.innerHTML = `
      <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
        <strong>Focus:</strong> ${guidance.primary_focus || 'General guidance'}
      </div>
      <div style="font-size: 12px; color: #888;">
        ${guidance.messaging_strategy?.approach || 'Personalized recommendations'}
      </div>
    `;
    
    // Show trust building elements
    trustElements.innerHTML = '';
    if (guidanceData.trust_building_elements) {
      guidanceData.trust_building_elements.slice(0, 3).forEach(element => {
        const tag = document.createElement('span');
        tag.className = 'trust-tag';
        tag.textContent = element;
        trustElements.appendChild(tag);
      });
    }
    
    display.classList.add('show');
    this.state.lastPsychologyGuidance = guidance;
    this.updateDebugInfo();
  }

  async syncFiltersFromChat(filterUpdates, skipProductUpdate = false) {
    if (!filterUpdates) return;
    
    this.state.filterSyncInProgress = true;
    const syncIndicator = this.widget.querySelector('#sync-indicator');
    syncIndicator.classList.remove('hidden');
    
    // Update effects filter
    if (filterUpdates.desired_effects && filterUpdates.desired_effects.length > 0) {
      const effectsSelect = this.widget.querySelector('#effects-filter-enhanced');
      const effectsGroup = this.widget.querySelector('#effects-filter-group');
      
      // Map AI effects to our select options
      const effectMapping = {
        'relaxation': 'relaxing',
        'energy': 'energetic',
        'creativity': 'creative',
        'focus': 'focused',
        'euphoria': 'euphoric',
        'pain relief': 'body relief',
        'sleep': 'sedating'
      };
      
      const aiEffect = filterUpdates.desired_effects[0];
      const mappedEffect = effectMapping[aiEffect] || aiEffect;
      
      // Find matching option
      const option = Array.from(effectsSelect.options).find(opt => 
        opt.value === mappedEffect || opt.text.toLowerCase().includes(aiEffect.toLowerCase())
      );
      
      if (option) {
        effectsSelect.value = option.value;
        effectsGroup.classList.add('syncing');
        setTimeout(() => effectsGroup.classList.remove('syncing'), 1000);
      }
    }
    
    // Update category filter
    if (filterUpdates.product_categories && filterUpdates.product_categories.length > 0) {
      const categorySelect = this.widget.querySelector('#category-filter-enhanced');
      const categoryGroup = this.widget.querySelector('#category-filter-group');
      
      const aiCategory = filterUpdates.product_categories[0];
      
      // Find matching option (case insensitive)
      const option = Array.from(categorySelect.options).find(opt => 
        opt.value.toLowerCase() === aiCategory.toLowerCase()
      );
      
      if (option) {
        categorySelect.value = option.value;
        categoryGroup.classList.add('syncing');
        setTimeout(() => categoryGroup.classList.remove('syncing'), 1000);
      }
    }
    
    setTimeout(() => {
      this.state.filterSyncInProgress = false;
      syncIndicator.classList.add('hidden');
    }, 2000);
    
    // Only trigger filter change for manual UI changes, not streaming responses
    if (!skipProductUpdate) {
      await this.onFilterChange();
    } else {
      console.log('🔄 Skipping product update - using streaming products');
    }
  }

  onCategoryChange() {
    const category = this.widget.querySelector('#category-filter-enhanced').value;
    const effectsFilter = this.widget.querySelector('#effects-filter-enhanced');
    const priceGroup = this.widget.querySelector('#price-group-enhanced');
    const priceRange = this.widget.querySelector('#price-budget-enhanced');
    const priceDisplay = this.widget.querySelector('#price-value-enhanced');
    const thcPotencyGroup = this.widget.querySelector('#thc-potency-group-enhanced');
    const cbdPotencyGroup = this.widget.querySelector('#cbd-potency-group-enhanced');
    
    if (category) {
      effectsFilter.disabled = false;
      priceGroup.style.display = 'block';
      
      const stats = this.state.categoryStats[category];
      if (stats && stats.price_stats) {
        const realMin = Math.floor(stats.price_stats.min);
        const realMax = Math.ceil(stats.price_stats.max);
        const realAvg = Math.round(stats.price_stats.avg);
        
        priceRange.min = realMin;
        priceRange.max = realMax;
        priceRange.value = realAvg;
        priceDisplay.textContent = `$${realAvg} (Range: $${realMin} - $${realMax})`;
      }
      
      if (category !== 'Accessories') {
        if (category === 'Tinctures') {
          thcPotencyGroup.style.display = 'none';
          cbdPotencyGroup.style.display = 'block';
          this.configureCBDPotencySlider(category, stats);
        } else {
          cbdPotencyGroup.style.display = 'none';
          thcPotencyGroup.style.display = 'block';
          this.configureTHCPotencySlider(category, stats);
        }
      } else {
        thcPotencyGroup.style.display = 'none';
        cbdPotencyGroup.style.display = 'none';
      }
    } else {
      effectsFilter.disabled = true;
      priceGroup.style.display = 'none';
      thcPotencyGroup.style.display = 'none';
      cbdPotencyGroup.style.display = 'none';
    }
    
    this.onFilterChange();
  }

  configureTHCPotencySlider(category, stats) {
    const thcPotencyLabel = this.widget.querySelector('#thc-potency-label-enhanced');
    const thcPotencyRange = this.widget.querySelector('#thc-potency-range-enhanced');
    
    let unit = '%';
    if (['Drinks', 'Edibles', 'Tinctures', 'Topicals'].includes(category)) {
      unit = 'mg';
      thcPotencyLabel.textContent = 'THC Potency (mg)';
    } else {
      thcPotencyLabel.textContent = 'THC Potency (%)';
    }
    
    if (stats && stats.thc_potency_stats && stats.thc_potency_stats.max > 0) {
      const realMin = Math.floor(stats.thc_potency_stats.min);
      const realMax = Math.ceil(stats.thc_potency_stats.max);
      const realAvg = Math.round(stats.thc_potency_stats.avg || realMax / 2);
      
      thcPotencyRange.min = realMin;
      thcPotencyRange.max = realMax;
      thcPotencyRange.value = realAvg;
    }
    
    this.onTHCPotencyChange();
  }

  configureCBDPotencySlider(category, stats) {
    const cbdPotencyLabel = this.widget.querySelector('#cbd-potency-label-enhanced');
    const cbdPotencyRange = this.widget.querySelector('#cbd-potency-range-enhanced');
    
    cbdPotencyLabel.textContent = 'CBD Potency (mg)';
    
    if (stats && stats.cbd_potency_stats && stats.cbd_potency_stats.max > 0) {
      const realMin = Math.floor(stats.cbd_potency_stats.min);
      const realMax = Math.ceil(stats.cbd_potency_stats.max);
      const realAvg = Math.round(stats.cbd_potency_stats.avg || realMax / 2);
      
      cbdPotencyRange.min = realMin;
      cbdPotencyRange.max = realMax;
      cbdPotencyRange.value = realAvg;
    }
    
    this.onCBDPotencyChange();
  }

  onTHCPotencyChange() {
    const range = this.widget.querySelector('#thc-potency-range-enhanced');
    const display = this.widget.querySelector('#thc-potency-value-enhanced');
    const category = this.widget.querySelector('#category-filter-enhanced').value;
    
    let unit = '%';
    if (['Drinks', 'Edibles', 'Tinctures', 'Topicals'].includes(category)) {
      unit = 'mg';
    }
    
    display.textContent = `${range.value}${unit}`;
    clearTimeout(this.thcTimeout);
    this.thcTimeout = setTimeout(() => this.onFilterChange(), 500);
  }

  onCBDPotencyChange() {
    const range = this.widget.querySelector('#cbd-potency-range-enhanced');
    const display = this.widget.querySelector('#cbd-potency-value-enhanced');
    
    display.textContent = `${range.value}mg`;
    clearTimeout(this.cbdTimeout);
    this.cbdTimeout = setTimeout(() => this.onFilterChange(), 500);
  }

  onPriceChange() {
    const range = this.widget.querySelector('#price-budget-enhanced');
    const display = this.widget.querySelector('#price-value-enhanced');
    
    display.textContent = `$${range.value}`;
    clearTimeout(this.priceTimeout);
    this.priceTimeout = setTimeout(() => this.onFilterChange(), 500);
  }

  async onFilterChange() {
    const filters = this.getCurrentFilters();
    
    try {
      const response = await this.apiClient.getFilteredProducts(filters);
      this.state.products = response.products || [];
      this.state.lastResponse = response;
      this.renderProducts();
    } catch (error) {
      console.error('❌ Filter error:', error);
    }
  }

  renderProducts() {
    const grid = this.widget.querySelector('#products-grid-enhanced');
    
    if (!this.state.products || this.state.products.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 20px; color: #666;">No products found</div>';
      return;
    }
    
    grid.innerHTML = this.state.products.map(product => `
      <div class="product-card-enhanced" ${this.state.isMiniView ? 'style="height: 80px;"' : ''}  data-url="${product.url || '#'}">
        ${product.image_url 
          ? `<img src="${product.image_url}" alt="${product.name || 'Cannabis Product'}" class="product-image-enhanced" />`
          : '<div class="product-image-enhanced">🌿</div>'
        }
        <div class="product-info-enhanced">
          <div class="product-name-enhanced">${product.name || 'Product'}</div>
          ${ this.state.isMiniView ? '' : `
          <div class="product-details-enhanced">
            ${product.category || 'Cannabis'} • ${this.getProductEffects(product)}
          </div>
          <div class="product-details-enhanced">
            THC: ${this.getProductTHC(product)}${this.getProductUnit(product)}
          </div>
          <div class="product-details-enhanced">
            CBD: ${this.getProductCBD(product)}${this.getProductUnit(product)}
          </div>
          `}
          <div class="product-price-enhanced">$${product.price || '0'}</div>
        </div>
      </div>
    `).join('');

    let productCards = grid.querySelectorAll('.product-card-enhanced');
    
    productCards.forEach(card => {
      card.addEventListener('click', (event) => {
        if (this.state.isMiniView) return;
        window.open(card.getAttribute('data-url'), '_blank');
      });
    });
  }

  async sendChat() {
    const input = this.widget.querySelector('#chat-input-enhanced');
    const message = input.value.trim();
    if (!message) return;
    
    input.value = '';
    this.addChatMessage(message, 'user');
    
    let progressElement = null;
    
    try {
      const currentFilters = this.getCurrentFilters();
      
      console.log('🚀 Starting streaming chat request...');
      console.log('URL:', `${this.apiClient.apiUrl}/chat-v2/tenant/${this.apiClient.tenantId}/chat/stream`);
      console.log('Payload:', { message, current_filters: currentFilters });
      
      // Use real-time streaming for immediate progress updates
      const response = await fetch(`${this.apiClient.apiUrl}/chat-v2/tenant/${this.apiClient.tenantId}/chat/stream`, {
        method: 'POST',
        headers: { 'X-API-Key': this.apiClient.apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message, 
          session_id: this.state.sessionId,
          current_filters: currentFilters,
          experience_level: "beginner"
        })
      });
      
      console.log('📡 Streaming response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Streaming API Error:', errorText);
        throw new Error(`Streaming Chat API failed: ${response.status} - ${errorText}`);
      }
      
      // Process real-time streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedData = {
        message: '',
        session_id: this.state.sessionId,
        products: [],
        psychology_guidance: {},
        extracted_parameters: {},
        education_stage: 'awareness',
        trust_building_elements: [],
        updated_filters: {}
      };
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                
                // Handle real-time progress updates from server
                if (parsed.type === 'progress') {
                  if (progressElement) {
                    this.updateProgressMessage(progressElement, parsed.icon, parsed.message, parsed.typing || false);
                  } else {
                    progressElement = this.showProgressMessage(parsed.icon, parsed.message, parsed.typing || false);
                  }
                  console.log(`📡 Streaming Progress: ${parsed.icon} ${parsed.message}`);
                  
                } else if (parsed.type === 'message_chunk') {
                  streamedData.message += parsed.content;
                  
                } else if (parsed.type === 'products') {
                  streamedData.products = parsed.products;
                  console.log(`📦 Streaming Products: ${parsed.products.length} products received`);
                  
                } else if (parsed.type === 'psychology_guidance') {
                  streamedData.psychology_guidance = parsed.psychology_guidance;
                  streamedData.education_stage = parsed.education_stage;
                  streamedData.trust_building_elements = parsed.trust_building_elements;
                  console.log(`🧠 Streaming Psychology: ${parsed.education_stage} stage`);
                  
                } else if (parsed.type === 'extracted_parameters') {
                  streamedData.extracted_parameters = parsed.extracted_parameters;
                  console.log(`🤖 Streaming Parameters: requires_products=${parsed.extracted_parameters.requires_products}`);
                  
                } else if (parsed.type === 'filter_updates') {
                  streamedData.updated_filters = parsed.filters;
                  console.log(`🎛️ Streaming Filters: ${Object.keys(parsed.filters).length} updates`);
                  
                } else if (parsed.type === 'session_id') {
                  streamedData.session_id = parsed.session_id;
                  this.state.sessionId = parsed.session_id;
                  console.log(`🆔 Streaming Session: ${parsed.session_id}`);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
      
      // Remove final progress message and display results
      if (progressElement) {
        this.removeProgressMessage(progressElement);
      }
      
      // Handle the complete streaming response
      if (streamedData.message) {
        this.addChatMessage(streamedData.message, 'assistant');
      }
      
      if (streamedData.session_id) {
        this.state.sessionId = streamedData.session_id;
      }
      
      if (streamedData.extracted_parameters && Object.keys(streamedData.extracted_parameters).length > 0) {
        this.showParameterExtraction({extracted_parameters: streamedData.extracted_parameters});
      }
      
      if (streamedData.psychology_guidance && Object.keys(streamedData.psychology_guidance).length > 0) {
        this.showPsychologyGuidance({
          psychology_guidance: streamedData.psychology_guidance,
          education_stage: streamedData.education_stage,
          trust_building_elements: streamedData.trust_building_elements
        });
      }
      
      if (streamedData.updated_filters && Object.keys(streamedData.updated_filters).length > 0) {
        this.syncFiltersFromChat(streamedData.updated_filters, true);  // Skip product update to prevent race condition
      }
      
      if (streamedData.products && streamedData.products.length > 0) {
        this.state.products = streamedData.products;
        this.renderProducts();
      }
      
    } catch (error) {
      console.error('Streaming chat error:', error);
      if (progressElement) {
        this.removeProgressMessage(progressElement);
      }
      this.addChatMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    }
  }

  showProgressMessage(icon, message, showTypingDots = false) {
    const messages = this.widget.querySelector('#chat-messages-enhanced');
    const div = document.createElement('div');
    div.className = 'progress-message';
    
    if (showTypingDots) {
      div.innerHTML = `
        <span class="progress-icon">${icon}</span>
        <span>${message}</span>
        <span class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </span>
      `;
    } else {
      div.innerHTML = `
        <span class="progress-icon">${icon}</span>
        <span>${message}</span>
      `;
    }
    
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    
    return div;
  }

  updateProgressMessage(progressElement, icon, message, showTypingDots = false) {
    if (!progressElement) return;
    
    if (showTypingDots) {
      progressElement.innerHTML = `
        <span class="progress-icon">${icon}</span>
        <span>${message}</span>
        <span class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </span>
      `;
    } else {
      progressElement.innerHTML = `
        <span class="progress-icon">${icon}</span>
        <span>${message}</span>
      `;
    }
  }

  removeProgressMessage(progressElement) {
    if (progressElement && progressElement.parentNode) {
      progressElement.parentNode.removeChild(progressElement);
    }
  }

  addChatMessage(message, sender) {
    const messages = this.widget.querySelector('#chat-messages-enhanced');
    const div = document.createElement('div');
    div.className = `chat-message-enhanced ${sender}`;
    
    // Parse and render markdown formatting
    const formattedMessage = this.parseMarkdown(message);
    div.innerHTML = formattedMessage;
    
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  parseMarkdown(text) {
    if (!text) return '';
    
    let formatted = text
      // Convert bold text: **text** → <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // Convert main bullet points: • text → <li>text</li>
      .replace(/^• (.*$)/gm, '<li>$1</li>')
      
      // Convert indented sub-bullets: - text → <li class="sub">text</li>
      .replace(/^- (.*$)/gm, '<li class="sub">$1</li>')
      
      // Convert spaced sub-bullets:   • text → <li class="sub">text</li>
      .replace(/^  • (.*$)/gm, '<li class="sub">$1</li>')
      
      // Convert line breaks to HTML breaks
      .replace(/\n/g, '<br>');
    
    // Handle nested list structure properly
    formatted = this.createNestedLists(formatted);
    
    // Convert double line breaks to paragraph breaks
    formatted = formatted
      .replace(/<br><br>/g, '</p><p>')
      .replace(/^(.*)$/s, function(match) {
        if (match.includes('</p><p>')) {
          return '<p>' + match + '</p>';
        }
        return match;
      });
    
    return formatted;
  }

  createNestedLists(text) {
    const lines = text.split('<br>');
    let result = [];
    let inList = false;
    let inSubList = false;
    
    for (let line of lines) {
      if (line.includes('<li>') && !line.includes('class="sub"')) {
        // Main bullet point
        if (inSubList) {
          result.push('</ul>');
          inSubList = false;
        }
        if (!inList) {
          result.push('<ul>');
          inList = true;
        }
        result.push(line);
      } else if (line.includes('<li class="sub">')) {
        // Sub bullet point
        if (!inSubList) {
          result.push('<ul>');
          inSubList = true;
        }
        result.push(line.replace(' class="sub"', ''));
      } else {
        // Regular text
        if (inSubList) {
          result.push('</ul>');
          inSubList = false;
        }
        if (inList) {
          result.push('</ul>');
          inList = false;
        }
        if (line.trim()) {
          result.push(line);
        }
      }
    }
    
    // Close any open lists
    if (inSubList) {
      result.push('</ul>');
    }
    if (inList) {
      result.push('</ul>');
    }
    
    return result.join('');
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
      const extractNumber = (value) => {
        if (!value) return 0;
        const numStr = String(value).replace(/[^\d.]/g, '');
        return parseFloat(numStr) || 0;
      };
      
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
  }

  getProductCBD(product) {
    if (product.attributes) {
      const extractNumber = (value) => {
        if (!value) return 0;
        const numStr = String(value).replace(/[^\d.]/g, '');
        return parseFloat(numStr) || 0;
      };
      
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

class EnhancedCannabisAPIClient {
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
    
    const response = await fetch(`${this.apiUrl}/product/${this.tenantId}/products/parametric-search`, {
      method: 'POST',
      headers: { 'X-API-Key': this.apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response.json();
  }

  async getRecommendations(query, profile, limit = 3) {
    const response = await fetch(`${this.apiUrl}/product/${this.tenantId}/products/recommend`, {
      method: 'POST',
      headers: { 'X-API-Key': this.apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, profile, limit })
    });
    return response.json();
  }

  async sendEnhancedChatMessage(message, sessionId, currentFilters) {
    // Use streaming endpoint for real-time progress updates
    const response = await fetch(`${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat/stream`, {
      method: 'POST',
      headers: { 'X-API-Key': this.apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: message, 
        session_id: sessionId,
        current_filters: currentFilters,
        experience_level: "beginner"
      })
    });
    
    if (!response.ok) {
      throw new Error(`Streaming Chat API failed: ${response.status}`);
    }
    
    // Process streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let streamedData = {
      message: '',
      session_id: sessionId,
      products: [],
      psychology_guidance: {},
      extracted_parameters: {},
      education_stage: 'awareness',
      trust_building_elements: [],
      updated_filters: {}
    };
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'message_chunk') {
                streamedData.message += parsed.content;
              } else if (parsed.type === 'products') {
                streamedData.products = parsed.products;
              } else if (parsed.type === 'psychology_guidance') {
                streamedData.psychology_guidance = parsed.psychology_guidance;
                streamedData.education_stage = parsed.education_stage;
                streamedData.trust_building_elements = parsed.trust_building_elements;
              } else if (parsed.type === 'extracted_parameters') {
                streamedData.extracted_parameters = parsed.extracted_parameters;
              } else if (parsed.type === 'filter_updates') {
                streamedData.updated_filters = parsed.filters;
              } else if (parsed.type === 'session_id') {
                streamedData.session_id = parsed.session_id;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
    
    return streamedData;
  }
}

window.CannabisWidgetEnhanced = CannabisWidgetEnhanced;
