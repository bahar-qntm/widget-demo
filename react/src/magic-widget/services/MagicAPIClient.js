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
   * Get filtered products using streaming-first approach with automatic fallback
   */
  async getFilteredProducts(filters, sessionId = null, onProgress = null) {
    // Create a synthetic query for the unified search system
    const filterDescription = [];
    if (filters.product_categories?.length > 0) {
      filterDescription.push(`category: ${filters.product_categories.join(', ')}`);
    }
    if (filters.price) {
      filterDescription.push(`price: around $${filters.price}`);
    }
    if (filters.thc) {
      filterDescription.push(`THC: around ${filters.thc}%`);
    }
    if (filters.cbd) {
      filterDescription.push(`CBD: around ${filters.cbd}mg`);
    }
    if (filters.desired_effects?.length > 0) {
      filterDescription.push(`effects: ${filters.desired_effects.join(', ')}`);
    }
    
    const syntheticQuery = filterDescription.length > 0 
      ? `Show me products with ${filterDescription.join(', ')}`
      : 'Show me products';
    
    console.log('🔍 Filter interaction using streaming-first approach:', syntheticQuery);
    
    try {
      // Try streaming first for optimal mobile UX
      if (onProgress) onProgress({ icon: '🎯', message: 'Updating filters...' });
      
      return await this._streamingFilterRequest(syntheticQuery, sessionId, filters, onProgress);
    } catch (streamingError) {
      console.log('🔄 Streaming failed, falling back to regular endpoint:', streamingError.message);
      
      // Automatic fallback to regular endpoint for reliability
      if (onProgress) onProgress({ icon: '🔄', message: 'Retrying...' });
      
      return await this._regularFilterRequest(syntheticQuery, sessionId, filters);
    }
  }

  /**
   * Streaming filter request (primary method)
   */
  async _streamingFilterRequest(syntheticQuery, sessionId, filters, onProgress) {
    const streamUrl = `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat/stream`;
    const payload = {
      message: syntheticQuery,
      session_id: sessionId,
      current_filters: filters,
      experience_level: 'beginner'
    };

    const response = await fetch(streamUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Streaming failed: ${response.status}`);
    }

    // Process streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    let streamedData = {
      products: [],
      updated_filters: {},
      psychology_guidance: {},
      education_stage: 'awareness',
      trust_building_elements: []
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
              
              switch (parsed.type) {
                case 'progress':
                  if (onProgress) {
                    onProgress({
                      icon: parsed.icon,
                      message: parsed.message,
                      typing: parsed.typing || false
                    });
                  }
                  break;

                case 'products':
                  streamedData.products = parsed.products;
                  break;

                case 'filter_updates':
                  streamedData.updated_filters = parsed.filters;
                  break;

                case 'psychology_guidance':
                  streamedData.psychology_guidance = parsed.psychology_guidance;
                  streamedData.education_stage = parsed.education_stage;
                  streamedData.trust_building_elements = parsed.trust_building_elements;
                  break;

                case 'error':
                  throw new Error(parsed.message);
              }
            } catch (parseError) {
              // Skip invalid JSON chunks
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      if (onProgress) onProgress(null); // Clear progress
    }

    console.log('✅ Streaming filter request completed:', streamedData.products?.length || 0, 'products');
    return streamedData;
  }

  /**
   * Regular filter request (fallback method)
   */
  async _regularFilterRequest(syntheticQuery, sessionId, filters) {
    const url = `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat`;
    const payload = {
      message: syntheticQuery,
      session_id: sessionId,
      current_filters: filters,
      experience_level: 'beginner'
    };
    
    console.log('🔄 Using regular endpoint fallback for filters');
    const result = await this.makeRequest(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    console.log('✅ Regular filter request completed:', result.products?.length || 0, 'products');
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
    
    console.log('💾 Updating session parameters:', {
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
