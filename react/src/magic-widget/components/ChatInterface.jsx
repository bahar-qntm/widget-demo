import React, { useState, useRef, useEffect } from 'react';

const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  streaming, 
  progress, 
  disabled 
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, progress]);

  // Focus input when not disabled
  useEffect(() => {
    if (!disabled && !streaming) {
      inputRef.current?.focus();
    }
  }, [disabled, streaming]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const message = inputValue.trim();
    if (!message || streaming || disabled) return;
    
    setInputValue(''); // Clear input immediately for better UX
    await onSendMessage(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Format message content with markdown-like parsing
  const formatMessage = (content) => {
    if (!content) return '';
    
    // Convert markdown-style formatting to HTML
    let formatted = content
      // Bold text: **text** → <strong>text</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      
      // Main bullet points: • text → <li>text</li>
      .replace(/^• (.*$)/gm, '<li>$1</li>')
      
      // Indented sub-bullets: - text → <li class="sub">text</li>
      .replace(/^- (.*$)/gm, '<li class="sub">$1</li>')
      
      // Spaced sub-bullets:   • text → <li class="sub">text</li>
      .replace(/^  • (.*$)/gm, '<li class="sub">$1</li>')
      
      // Line breaks to HTML breaks
      .replace(/\n/g, '<br>');

    // Handle nested list structure
    formatted = createNestedLists(formatted);
    
    // Convert double breaks to paragraph breaks
    formatted = formatted
      .replace(/<br><br>/g, '</p><p>')
      .replace(/^(.*)$/s, function(match) {
        if (match.includes('</p><p>')) {
          return '<p>' + match + '</p>';
        }
        return match;
      });

    return formatted;
  };

  const createNestedLists = (text) => {
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
  };

  return (
    <div className="chat-section">
      <div className="section-title">💬 AI Chat Assistant</div>
      
      {/* Messages Container */}
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.role} ${message.isFilterResponse ? 'filter-response' : ''}`}
          >
            {message.isFilterResponse && (
              <span className="filter-response-icon" title="Auto-generated response based on filter update">
                🎛️
              </span>
            )}
            <div
              className="message-content"
              dangerouslySetInnerHTML={{
                __html: formatMessage(message.content)
              }}
            />
            {message.timestamp && (
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
        
        {/* Progress Message */}
        {progress && (
          <div className="progress-message">
            <span className="progress-icon">{progress.icon}</span>
            <span className="progress-text">{progress.message}</span>
            {progress.typing && (
              <span className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
            )}
          </div>
        )}
        
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Container */}
      <form 
        onSubmit={handleSubmit}
        className={`chat-input-container ${(streaming || disabled) ? 'disabled' : ''}`}
      >
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder={
            streaming 
              ? "AI is responding..." 
              : disabled 
                ? "Please wait..." 
                : "Ask me anything..."
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={streaming || disabled}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={streaming || disabled || !inputValue.trim()}
        >
          {streaming ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
