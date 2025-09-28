# Magic Widget

A modern React-based widget that provides cannabis product recommendations and AI chat functionality for any website.

## 🌟 Current Implementation: React v2.0

This widget is now **exclusively** built with React 18, providing a modern, reliable, and maintainable solution. The vanilla JavaScript implementation has been **removed** as of this version.

## 📁 File Structure

```
widget/
├── react/                          # Complete React implementation
│   ├── src/                        # React source code
│   ├── dist/                       # Built files ready for deployment
│   ├── public/demo.html            # Demo and testing page
│   ├── package.json                # Dependencies and build scripts
│   └── README.md                   # Detailed React documentation
└── README.md                       # This overview (you are here)
```

## 🚀 Quick Start

Navigate to the React implementation for full documentation:

```bash
cd widget/react/
npm install
npm run dev
```

Then visit `http://localhost:3001/demo.html` to see the widget in action.

## ✨ Features

- **Modern React Architecture**: Built with React 18, hooks, and modern patterns
- **Real-time Streaming**: Server-sent events for instant AI responses
- **Smart Filter Synchronization**: Bidirectional chat ↔ UI sync with midpoint ±20% ranges
- **AI Parameter Extraction**: Advanced NLP to extract user preferences
- **Eliminates Race Conditions**: React reconciliation prevents vanilla JS complexity
- **Mobile Responsive**: Works seamlessly on all devices
- **Zero Configuration**: Auto-initializes with data attributes
- **Production Ready**: Minified bundle with source maps

## 🔄 Migration from Vanilla JS (Completed)

The vanilla JavaScript implementation has been **completely removed** to eliminate:
- ❌ Race conditions and complex state management
- ❌ Manual DOM manipulation bugs  
- ❌ Parameter extraction edge cases
- ❌ Complex event coordination issues

The React version provides:
- ✅ **100% Backend Compatibility** - Same APIs, same features
- ✅ **Better Performance** - React reconciliation handles updates efficiently  
- ✅ **Improved Developer Experience** - Modern tooling and debugging
- ✅ **Maintainable Codebase** - Component-based architecture

## 📚 Documentation

For complete documentation, installation instructions, and API details, see:

**[widget/react/README.md](react/README.md)**

This contains:
- Detailed installation instructions
- Component architecture overview
- API integration documentation
- Development and deployment guides
- Troubleshooting and debug information

## 🛠️ Development

```bash
cd widget/react/

# Development
npm run dev                 # Start dev server on port 3001
npm run build              # Build for production
npm run build-widget      # Build distributable widget bundle

# Testing
open http://localhost:3001/demo.html
```

## 🚀 Deployment

The React widget builds to:
- `widget/react/dist/magic-widget.umd.js` - Main widget bundle
- `widget/react/dist/style.css` - Widget styles

Deploy these files to your CDN and include them in customer sites.

## 🎯 Current Status

- ✅ **Vanilla JS Implementation**: Removed (simplified codebase)
- ✅ **React Implementation**: Active and production-ready
- ✅ **Backend Compatibility**: 100% maintained
- ✅ **Feature Parity**: All features preserved and improved

---

**For all technical details, visit [widget/react/README.md](react/README.md)**
