# Cannabis Consultant Widget

A distributable vanilla JavaScript widget that provides cannabis product recommendations and AI chat functionality for any website.

## 🌿 Features

- **Top-Center Positioning**: Maximum visibility and psychological impact
- **Two-State Design**: Always shows 3 products, expandable for filters & chat
- **Real-Time Filtering**: Instant product updates using parametric search
- **AI Chat Integration**: Streaming responses from cannabis consultant
- **Fully Customizable**: Theming, colors, and branding options
- **Mobile Responsive**: Works seamlessly on all devices
- **Zero Dependencies**: Pure vanilla JavaScript, no frameworks required
- **Cross-Domain Ready**: Works on any website with simple script inclusion

## 📁 File Structure

```
widget/
├── src/
│   └── cannabis-widget.js      # Main widget implementation
├── demo/
│   └── index.html              # Local testing and demo page
└── README.md                   # This documentation
```

## 🚀 Quick Start

### For Customers (Simple Installation)

```html
<!-- Include the widget script -->
<script src="https://your-cdn.com/cannabis-widget.js"></script>

<!-- Initialize the widget -->
<script>
  const widget = new CannabisWidget({
    tenantId: 'your-tenant-id',
    apiKey: 'your-api-key',
    apiUrl: 'https://your-api.com'
  });
  widget.init();
</script>
```

### For Development and Testing

1. **Start your FastAPI backend:**
   ```bash
   cd /path/to/magic2
   npm run dev
   ```

2. **Open the demo page:**
   ```bash
   cd widget/demo
   open index.html  # or serve with a local HTTP server
   ```

3. **Configure and test:**
   - Update tenant ID and API key in the demo
   - Click "Test API Connection" to verify backend connectivity
   - Click "Initialize Widget" to load the widget
   - Test all functionality (products, filters, chat)

## ⚙️ Configuration Options

```javascript
const widget = new CannabisWidget({
  // Required
  tenantId: 'your-tenant-id',           // Your tenant identifier
  apiKey: 'your-api-key',               // API authentication key
  
  // Optional
  apiUrl: 'http://localhost:8000',      // Backend API URL
  position: 'top-center',               // Widget positioning
  
  // Theming
  theme: {
    primaryColor: '#2D5E3E',            // Main brand color
    accentColor: '#8FBC8F',             // Secondary accent color
    fontFamily: 'Arial, sans-serif',    // Font family
    borderRadius: '8px'                 // Border radius for rounded corners
  }
});
```

## 🎨 Customization Examples

### Custom Branding
```javascript
const widget = new CannabisWidget({
  tenantId: 'dispensary-123',
  apiKey: 'your-key',
  theme: {
    primaryColor: '#4A5D23',      // Dark green
    accentColor: '#7FB069',       // Light green
    fontFamily: 'Helvetica, sans-serif'
  }
});
```

### Different Color Schemes
```javascript
// Purple theme
theme: {
  primaryColor: '#6B46C1',
  accentColor: '#A78BFA'
}

// Blue theme  
theme: {
  primaryColor: '#1E40AF',
  accentColor: '#60A5FA'
}

// Orange theme
theme: {
  primaryColor: '#EA580C',
  accentColor: '#FB923C'
}
```

## 🔌 API Integration

The widget integrates with your FastAPI backend using these endpoints:

### Product Endpoints
- `POST /product/{tenant_id}/products/recommend` - Initial product loading
- `POST /product/{tenant_id}/products/parametric-search` - Filter-based search

### Chat Endpoints  
- `POST /chat/tenant/{tenant_id}/chat` - Send chat messages
- `POST /chat/tenant/{tenant_id}/chat-stream` - Streaming responses (future)

### Expected API Response Formats

**Product Response:**
```json
{
  "products": [
    {
      "id": "product-123",
      "name": "Blue Dream",
      "category": "flower",
      "price": 35.99,
      "url": "https://shop.com/products/blue-dream",
      "attributes": {
        "effects": ["relaxing", "creative"],
        "thc_content": "18",
        "cbd_content": "1"
      }
    }
  ]
}
```

**Chat Response:**
```json
{
  "response": "Based on your preferences, I recommend...",
  "session_id": "session-abc-123"
}
```

## 📱 Widget Behavior

### Default State (Always Visible)
- Shows header with "Cannabis Consultant" branding
- Displays 3 featured/recommended products
- "More Options" button to expand additional features

### Expanded State (On User Click)
- **Filters Section**: Category, effects, THC range, price filters
- **Chat Section**: AI-powered cannabis consultant chat
- **Live Updates**: Products update instantly when filters change

### Mobile Responsiveness
- Adjusts width for mobile screens (98% width vs 95% desktop)
- Single-column product layout on mobile
- Vertical filter layout for better touch interaction

## 🧪 Testing Checklist

When testing the widget, verify:

- [ ] **Initial Load**: 3 products appear automatically
- [ ] **Expansion**: Header click toggles expandable sections
- [ ] **Product Filtering**: Changing filters updates products in real-time
- [ ] **Chat Functionality**: Messages send and receive responses
- [ ] **Theming**: Custom colors apply correctly
- [ ] **Mobile**: Widget works and looks good on mobile devices
- [ ] **Cross-Domain**: Widget works when embedded on different domains
- [ ] **Error Handling**: Graceful behavior when API is unavailable

## 🚢 Deployment Workflow

### Development Process
1. Make changes to `src/cannabis-widget.js`
2. Test using `demo/index.html`
3. Commit changes to version control

### Production Deployment
1. Minify the JavaScript file for production
2. Upload to CDN (CloudFlare, AWS CloudFront, Azure CDN)
3. Update customer installation URLs
4. Version control with semantic versioning (v1.0.0, v1.1.0, etc.)

### CDN Structure
```
https://your-cdn.com/cannabis-widget/
├── v1/
│   ├── cannabis-widget.min.js     # Latest v1.x
│   └── cannabis-widget.js         # Unminified for debugging
├── v1.2.3/
│   └── cannabis-widget.min.js     # Specific version
└── latest/
    └── cannabis-widget.min.js     # Always current
```

## 🔒 Security Considerations

- **API Keys**: Use limited-scope read-only keys for frontend
- **CORS**: Ensure backend allows cross-origin requests
- **Input Sanitization**: All user inputs are sanitized before API calls
- **Error Handling**: No sensitive information exposed in error messages

## 📊 Analytics & Monitoring

Track these metrics for business insights:
- Widget installation count
- Product click-through rates
- Chat engagement rates
- Filter usage patterns
- Conversion attribution

## 🆘 Troubleshooting

### Common Issues

**Widget not loading:**
- Check browser console for JavaScript errors
- Verify API URL and credentials
- Test API connectivity separately

**Products not displaying:**
- Confirm tenant has products in database
- Check API response format matches expected structure
- Verify CORS headers on backend

**Chat not working:**
- Test chat API endpoint directly
- Check for WebSocket/streaming connection issues
- Verify OpenAI API key configuration

**Styling conflicts:**
- Widget uses CSS custom properties with `--cw-` prefix
- Styles are scoped to `.cannabis-widget` class
- Consider using Shadow DOM for complete isolation

### Debug Mode

Enable debug logging:
```javascript
// Add this before widget initialization
window.CannabisWidgetDebug = true;

const widget = new CannabisWidget({...});
widget.init();
```

## 📄 License

[Your License Here]

## 🤝 Support

For technical support or integration questions:
- Email: support@your-domain.com
- Documentation: https://docs.your-domain.com
- GitHub Issues: [Repository URL]
