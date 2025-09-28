# Magic Widget - React v2.0

## ✨ Modern React Implementation

This is the React version of the Magic Widget that **eliminates all race conditions and complexity issues** from the vanilla JavaScript implementation. Built with React 18, modern hooks, and streaming API integration.

## 🚀 Quick Start

### Option 1: Auto-Initialize (Recommended)
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Site with Magic Widget</title>
    <!-- Include React dependencies -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Include Magic Widget styles -->
    <link rel="stylesheet" href="dist/style.css">
</head>
<body>
    <!-- Widget auto-initializes on this div -->
    <div 
        id="magic-widget-container"
        data-tenant-id="your-tenant-id"
        data-api-key="your-api-key"
        data-api-url="https://your-api-url.com"
    ></div>
    
    <!-- Include Magic Widget script -->
    <script src="dist/magic-widget.umd.js"></script>
</body>
</html>
```

### Option 2: Manual Initialize
```html
<div id="my-magic-widget"></div>

<script>
// Initialize manually with custom config
const container = document.getElementById('my-magic-widget');
const widget = MagicWidget.init(container, {
    tenantId: 'your-tenant-id',
    apiKey: 'your-api-key',
    apiUrl: 'https://your-api-url.com'
});

// Cleanup when needed
// widget.cleanup();
</script>
```

## 🏗️ Development Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Build widget bundle
npm run build-widget
```

## ✅ React Migration Benefits

### Eliminated Issues from Vanilla JS:
- ❌ **Race Conditions**: Fixed double product updates and competing API calls
- ❌ **Manual State Management**: No more complex CannabisWidgetStateManager
- ❌ **DOM Manipulation Bugs**: No more manual DOM updates
- ❌ **Parameter Extraction Issues**: Clean state handling prevents edge cases
- ❌ **Complex Event Coordination**: React lifecycle manages updates automatically

### New React Advantages:
- ✅ **Automatic Re-renders**: React reconciliation handles UI updates
- ✅ **Modern Hooks**: Clean state management with useState, useEffect, useCallback
- ✅ **Component Isolation**: Each feature is a separate, testable component
- ✅ **Developer Experience**: React DevTools, better debugging, TypeScript ready
- ✅ **Streaming Integration**: Clean EventSource handling with hooks

## 🔧 Architecture

### Component Structure
```
<MagicWidget>
├── <WidgetHeader />
├── <ProductGrid />
├── <FilterPanel />          // Handles midpoint ±20% ranges
├── <ChatInterface />        // Streaming chat with progress
├── <ParameterDisplay />     // AI-extracted parameters
├── <PsychologyGuidance />   // Behavioral psychology
└── <DebugPanel />          // Development debugging
```

### Key Hooks
- `useMagicWidget`: Main state management (replaces CannabisWidgetStateManager)
- `useStreamingChat`: Real-time streaming chat integration
- Custom hooks eliminate all manual subscription complexity

### API Client
- `MagicAPIClient`: Modern fetch-based client
- Same backend compatibility as vanilla JS
- Cleaner error handling and configuration

## 🎯 Filter System

### Midpoint ±20% Range Logic
All sliders use **midpoint ±20%** calculations:
- **Price**: $60 → $48-72 range
- **THC**: 25% → 20-30% range  
- **CBD**: 10mg → 8-12mg range

### Smart Filter Synchronization
- **Chat → UI**: AI extracts parameters and syncs filters automatically
- **UI → Chat**: Filter changes update session parameters
- **Visual Feedback**: Animated sync indicators show updates
- **No Race Conditions**: React's reconciliation prevents conflicts

## 🌊 Streaming Integration

### Real-time Progress Updates
```javascript
const {
  sendStreamingMessage,
  streaming,
  progress
} = useStreamingChat({
  onMessage: (message) => addChatMessage(message),
  onProducts: (products) => updateProducts(products),
  onParametersExtracted: (params) => showParameters(params),
  onPsychologyGuidance: (guidance) => showGuidance(guidance)
});
```

### Server-Sent Events
- **Progress indicators** with typing animations
- **Parameter extraction** in real-time
- **Product updates** without race conditions
- **Psychology guidance** with education stage tracking

## 🧠 AI Features (Preserved from Backend)

### Parameter Extraction
- Natural language processing of user queries
- Confidence scoring and intent classification
- Session-aware parameter accumulation
- Brand, category, price, potency extraction

### Psychology Guidance
- Education stage progression (awareness → consideration → decision)
- Trust building elements
- Personalized messaging strategies
- Behavioral psychology integration

## 🐛 Debug Panel

Enable debug mode to see:
- **Widget State**: Products, session, loading status
- **Filter State**: Current filter values and ranges
- **Parameters**: AI-extracted and accumulated parameters  
- **Psychology**: Education stage and guidance data

## 📦 File Structure

```
widget/react/
├── src/
│   ├── magic-widget/
│   │   ├── MagicWidget.jsx           # Main component
│   │   ├── components/               # React components
│   │   ├── hooks/                    # Custom hooks
│   │   ├── services/                 # API client
│   │   └── styles/                   # CSS styles
│   ├── index.js                      # Development entry
│   └── index.umd.js                  # UMD bundle entry
├── public/
│   └── demo.html                     # Demo page
├── dist/                             # Built files
├── package.json                      # Dependencies
└── vite.config.js                    # Build configuration
```

## 🔄 Migration from Vanilla JS

The React version maintains **100% backend compatibility** while eliminating frontend complexity:

### Same APIs:
- `/chat-v2/tenant/{id}/chat/stream` - Streaming chat
- `/chat-v2/tenant/{id}/chat/session/{id}/parameters` - Session management  
- `/product/{id}/products/parametric-search` - Product search
- `/category-stats/{id}/products/categories/stats` - Category stats

### Same Features:
- All filter types (category, effects, price, THC, CBD)
- AI parameter extraction with confidence scoring
- Psychology guidance with education stages
- Session-aware parameter accumulation
- Multi-session support
- Debug capabilities

### Eliminated Complexity:
- **6+ vanilla JS files** → **1 clean React component tree**
- **Complex manual state** → **Simple React hooks**
- **Race condition prevention** → **Automatic React reconciliation**
- **Manual DOM updates** → **Declarative rendering**

## 🚀 Performance

- **Bundle size**: 67.53 kB (gzipped: 12.87 kB)
- **CSS size**: 12.38 kB (gzipped: 3.09 kB)
- **Load time**: Comparable to vanilla JS with better UX
- **Memory usage**: More efficient with React's reconciliation
- **No memory leaks**: Automatic cleanup with React lifecycle

## 🎨 Customization

The widget can be easily customized by modifying:
- `MagicWidget.css` for styles
- Component props for behavior
- API client configuration
- Debug panel visibility

## ✅ Browser Support

- Modern browsers with ES6+ support
- React 18 compatible environments
- Same browser support as vanilla JS version

---

**Magic Widget React v2.0** - Modern, reliable, maintainable ✨
