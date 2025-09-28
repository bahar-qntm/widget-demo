import { useState, useCallback, useRef } from 'react';
import { MagicAPIClient } from '../services/MagicAPIClient';

export const useStreamingChat = ({
  config,
  sessionId,
  setSessionId,
  currentFilters,
  onMessage,
  onProducts,
  onParametersExtracted,
  onPsychologyGuidance,
  onFiltersUpdated
}) => {
  const [streaming, setStreaming] = useState(false);
  const [progress, setProgress] = useState(null);
  
  // Keep track of the active stream to allow cancellation
  const activeStreamRef = useRef(null);
  
  // API client
  const apiClient = new MagicAPIClient(config);

  const sendStreamingMessage = useCallback(async (message) => {
    // Prevent multiple concurrent streams
    if (streaming) {
      console.warn('🚫 Stream already in progress, ignoring new message');
      return;
    }

    setStreaming(true);
    setProgress({ icon: '🤖', message: 'Understanding your request...', typing: false });
    
    try {
      console.log('🌊 Starting streaming chat for message:', message);
      
      // Build request payload
      const payload = {
        message: message.trim(),
        session_id: sessionId,
        current_filters: currentFilters || {},
        experience_level: 'beginner'
      };

      // Get the streaming URL
      const streamUrl = `${apiClient.apiUrl}/chat-v2/tenant/${apiClient.tenantId}/chat/stream`;
      
      // Start EventSource for streaming
      const response = await fetch(streamUrl, {
        method: 'POST',
        headers: {
          'X-API-Key': apiClient.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Streaming failed: ${response.status} - ${errorText}`);
      }

      // Process streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      activeStreamRef.current = { reader };

      let streamedData = {
        message: '',
        session_id: sessionId,
        products: [],
        psychology_guidance: {},
        extracted_parameters: {},
        education_stage: 'awareness',
        trust_building_elements: [],
        updated_filters: {},
        accumulated_parameters: {}
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
                
                // Handle different types of streaming data
                switch (parsed.type) {
                  case 'progress':
                    setProgress({
                      icon: parsed.icon,
                      message: parsed.message,
                      typing: parsed.typing || false
                    });
                    console.log(`📡 Stream progress: ${parsed.icon} ${parsed.message}`);
                    break;

                  case 'session_id':
                    streamedData.session_id = parsed.session_id;
                    if (setSessionId) {
                      setSessionId(parsed.session_id);
                    }
                    console.log(`🆔 Session ID: ${parsed.session_id}`);
                    break;

                  case 'message_chunk':
                    streamedData.message += parsed.content;
                    break;

                  case 'products':
                    streamedData.products = parsed.products;
                    console.log(`📦 Products: ${parsed.products.length} items`);
                    break;

                  case 'psychology_guidance':
                    streamedData.psychology_guidance = parsed.psychology_guidance;
                    streamedData.education_stage = parsed.education_stage;
                    streamedData.trust_building_elements = parsed.trust_building_elements;
                    console.log(`🧠 Psychology guidance: ${parsed.education_stage} stage`);
                    break;

                  case 'extracted_parameters':
                    streamedData.extracted_parameters = parsed.extracted_parameters;
                    console.log(`🤖 Parameters extracted: ${Object.keys(parsed.extracted_parameters).length} params`);
                    break;

                  case 'filter_updates':
                    streamedData.updated_filters = parsed.filters;
                    console.log(`🎛️ Filter updates: ${Object.keys(parsed.filters).length} filters`);
                    break;

                  case 'accumulated_parameters':
                    streamedData.accumulated_parameters = parsed.accumulated_parameters;
                    console.log(`💾 Accumulated parameters: ${Object.keys(parsed.accumulated_parameters).length} params`);
                    break;

                  case 'error':
                    console.error('❌ Streaming error:', parsed.message);
                    throw new Error(parsed.message);

                  default:
                    console.log('📡 Unknown stream type:', parsed.type);
                }
              } catch (parseError) {
                // Skip invalid JSON chunks
                console.debug('Skipping invalid JSON chunk:', data);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
        activeStreamRef.current = null;
      }

      // Process complete streaming response
      console.log('✅ Streaming complete, processing results...');
      
      // Clear progress
      setProgress(null);
      
      // Call callbacks with streamed data
      if (streamedData.message && onMessage) {
        onMessage(streamedData.message);
      }
      
      if (streamedData.products && streamedData.products.length > 0 && onProducts) {
        onProducts(streamedData.products);
      }
      
      if (streamedData.extracted_parameters && Object.keys(streamedData.extracted_parameters).length > 0 && onParametersExtracted) {
        onParametersExtracted({
          extracted: streamedData.extracted_parameters,
          accumulated: streamedData.accumulated_parameters
        });
      }
      
      if (streamedData.psychology_guidance && Object.keys(streamedData.psychology_guidance).length > 0 && onPsychologyGuidance) {
        onPsychologyGuidance({
          psychology_guidance: streamedData.psychology_guidance,
          education_stage: streamedData.education_stage,
          trust_building_elements: streamedData.trust_building_elements
        });
      }
      
      if (streamedData.updated_filters && Object.keys(streamedData.updated_filters).length > 0 && onFiltersUpdated) {
        onFiltersUpdated(streamedData.updated_filters);
      }
      
      console.log('✅ Streaming chat completed successfully');
      
    } catch (error) {
      console.error('❌ Streaming chat error:', error);
      setProgress(null);
      
      // Show error message to user
      if (onMessage) {
        onMessage('Sorry, I encountered an error. Please try again.');
      }
    } finally {
      setStreaming(false);
      activeStreamRef.current = null;
    }
  }, [
    streaming,
    sessionId,
    setSessionId,
    currentFilters,
    onMessage,
    onProducts,
    onParametersExtracted,
    onPsychologyGuidance,
    onFiltersUpdated,
    apiClient,
    config
  ]);

  // Cancel active stream
  const cancelStream = useCallback(() => {
    if (activeStreamRef.current?.reader) {
      activeStreamRef.current.reader.cancel();
      activeStreamRef.current = null;
      setStreaming(false);
      setProgress(null);
      console.log('🚫 Stream cancelled');
    }
  }, []);

  return {
    sendStreamingMessage,
    streaming,
    progress,
    setProgress,
    cancelStream
  };
};
