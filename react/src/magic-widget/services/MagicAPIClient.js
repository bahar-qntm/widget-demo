/**
 * Magic Widget API Client - Isolated React Implementation
 * 
 * This replaces the complex EnhancedCannabisAPIClient from vanilla JS
 * with a clean, modern implementation that works with the existing backend.
 */
export class MagicAPIClient {
  constructor(config = {}) {
    this.tenantId = config.tenantId || 'default';
    this.apiKey = config.apiKey || 'default-api-key';
    this.apiUrl = config.apiUrl || 'http://localhost:8000';
    
    // Validate configuration
    if (!this.tenantId || !this.apiKey) {
      console.warn('⚠️ MagicAPIClient: Missing tenantId or apiKey in config');
    }
    
    console.log('🔧 MagicAPIClient initialized:', {
      tenantId: this.tenantId,
      apiUrl: this.apiUrl,
      hasApiKey: !!this.apiKey
    });
  }

  /**
   * Get default headers for API requests
   */
  getHeaders(additionalHeaders = {}) {
    return {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
      ...additionalHeaders
    };
  }

  /**
   * Make API request with error handling
   */
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.headers || {})
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ API request failed:', error);
      throw error;
    }
  }

  /**
   * Create a new chat session for the widget
   */
  async createSession() {
    const url = `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat`;
    const payload = {
      message: "Initialize session", // Minimal message to trigger session creation
      experience_level: 'beginner'
    };
    
    console.log('🆔 Creating new session...');
    const result = await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    console.log('✅ Session created:', result.session_id);
    return result.session_id;
  }

  /**
   * Get category statistics for filter configuration
   */
  async getCategoryStats() {
    const url = `${this.apiUrl}/category-stats/${this.tenantId}/products/categories/stats`;
    
    console.log('📊 Fetching category stats...');
    const result = await this.makeRequest(url);
    console.log('✅ Category stats loaded:', Object.keys(result.categories || {}).length, 'categories');
    
    return result;
  }


  /**
   * Get product recommendations (for initial load)
   */
  async getRecommendations(query, profile, limit = 3) {
    const url = `${this.apiUrl}/product/${this.tenantId}/products/recommend`;
    const payload = { query, profile, limit };
    
    console.log('🎯 Fetching recommendations...');
    const result = await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    console.log('✅ Recommendations loaded:', result.results?.length || result.length || 0, 'products');
    return result;
  }

  /**
   * Update session parameters from UI filter changes
   */
  async updateSessionParameters(sessionId, filters, generateAIResponse = false) {
    const url = new URL(`${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat/session/${sessionId}/parameters`);
    
    if (generateAIResponse) {
      url.searchParams.append('generate_ai_response', 'true');
    }
    
    console.log('� Updating session parameters:', {
      sessionId,
      filters,
      generateAIResponse
    });
    
    const result = await this.makeRequest(url.toString(), {
      method: 'PUT',
      body: JSON.stringify(filters)
    });
    
    console.log('✅ Session parameters updated:', result.updated_count, 'parameters');
    return result;
  }

  /**
   * Send chat message (non-streaming) - for fallback
   */
  async sendChatMessage(message, sessionId, currentFilters) {
    const url = `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat`;
    const payload = {
      message: message.trim(),
      session_id: sessionId,
      current_filters: currentFilters || {},
      experience_level: 'beginner'
    };
    
    console.log('💬 Sending chat message (non-streaming):', message);
    const result = await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    console.log('✅ Chat response received:', {
      hasMessage: !!result.message,
      products: result.products?.length || 0,
      hasParameters: !!result.extracted_parameters
    });
    
    return result;
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId) {
    const url = `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat/${sessionId}/history`;
    
    console.log('📜 Fetching chat history for session:', sessionId);
    const result = await this.makeRequest(url);
    
    console.log('✅ Chat history loaded:', result.messages?.length || 0, 'messages');
    return result;
  }

  /**
   * Test API connectivity
   */
  async testConnection() {
    try {
      await this.getCategoryStats();
      console.log('✅ API connection test successful');
      return true;
    } catch (error) {
      console.error('❌ API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get streaming URL for EventSource connections
   */
  getStreamingUrl() {
    return `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat/stream`;
  }

  /**
   * Build streaming request payload
   */
  buildStreamingPayload(message, sessionId, currentFilters) {
    return {
      message: message.trim(),
      session_id: sessionId,
      current_filters: currentFilters || {},
      experience_level: 'beginner'
    };
  }

  /**
   * Validate configuration
   */
  isConfigValid() {
    const hasRequired = this.tenantId && this.apiKey && this.apiUrl;
    
    if (!hasRequired) {
      console.error('❌ Invalid MagicAPIClient configuration:', {
        hasTenantId: !!this.tenantId,
        hasApiKey: !!this.apiKey,
        hasApiUrl: !!this.apiUrl
      });
    }
    
    return hasRequired;
  }

  /**
   * Get debug info for troubleshooting
   */
  getDebugInfo() {
    return {
      tenantId: this.tenantId,
      apiUrl: this.apiUrl,
      hasApiKey: !!this.apiKey,
      isValid: this.isConfigValid(),
      endpoints: {
        categoryStats: `${this.apiUrl}/category-stats/${this.tenantId}/products/categories/stats`,
        productSearch: `${this.apiUrl}/product/${this.tenantId}/products/parametric-search`,
        recommendations: `${this.apiUrl}/product/${this.tenantId}/products/recommend`,
        chat: `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat`,
        streaming: `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat/stream`
      }
    };
  }
}

// Default export for convenience
export default MagicAPIClient;
