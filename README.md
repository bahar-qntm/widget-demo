# Magic Widget - React Demo

🧠 AI-powered cannabis consultation widget built with React

## 🚀 Automated Deployment

This repository uses **GitHub Actions** to automatically build and deploy the React widget to GitHub Pages.

### How it Works

1. **Push Changes**: Make changes to React code in `react/` folder
2. **Auto-Build**: GitHub Actions automatically runs `npm run build-widget`
3. **Auto-Deploy**: Built files are copied to `docs/` folder and deployed to GitHub Pages
4. **Live Update**: Your demo is automatically updated at the live URL

### Live Demo

**🌐 Live URL**: `https://bahar-qntm.github.io/widget-demo/docs/demo.html`

### Workflow Triggers

- ✅ Pushes to `main` branch
- ✅ Pull requests to `main` branch

### What Gets Built

- `react/dist/demo.html` → `docs/demo.html`
- `react/dist/magic-widget.umd.js` → `docs/magic-widget.umd.js`
- `react/dist/style.css` → `docs/style.css`
- `react/dist/magic-widget.umd.js.map` → `docs/magic-widget.umd.js.map`

## 📁 Repository Structure

```
widget/
├── .github/workflows/
│   └── deploy-widget.yml     # GitHub Actions workflow
├── react/                    # React widget source code
│   ├── src/                  # Widget components and logic
│   ├── public/               # Demo HTML template
│   ├── package.json          # Dependencies and scripts
│   └── dist/                 # Built files (auto-generated)
├── docs/                     # GitHub Pages deployment (auto-generated)
│   ├── demo.html            # Live demo page
│   ├── magic-widget.umd.js  # Widget bundle
│   └── style.css            # Widget styles
└── README.md                # This file
```

## 🛠️ Development Workflow

### Making Changes

1. Edit React code in `react/src/` folder
2. Test locally: `cd react && npm run dev`
3. Commit and push changes
4. GitHub Actions automatically builds and deploys

### No Manual Building Required!

❌ **Before**: Manual process
```bash
cd react
npm run build-widget
cp dist/* ../docs/
git add docs/
git commit -m "Update built files"
git push
```

✅ **Now**: Automatic process
```bash
# Just edit your React code and push!
git add react/src/
git commit -m "Update widget features"
git push  # 🎉 Automatic build and deploy!
```

## 📋 Configuration

### API Configuration

The widget connects to: `https://budtender.cannafax.com`

To change API endpoint, edit `react/public/demo.html`:
```html
<div 
    id="magic-widget-container"
    data-api-url="https://your-api-domain.com"
    data-tenant-id="your-tenant-id"
    data-api-key="your-api-key"
></div>
```

### GitHub Pages Setup

1. Go to repository Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages` (auto-created by workflow)
4. Folder: `/` (root)

## 🔧 Troubleshooting

### Workflow Not Running?
- Check Actions tab in GitHub repository
- Ensure you're pushing to `main` branch
- Check workflow permissions in Settings → Actions

### Build Failures?
- Check Actions logs for detailed error messages
- Ensure `package.json` and dependencies are correct
- Test build locally: `cd react && npm run build-widget`

### CORS Issues?
Add your GitHub Pages domain to backend CORS settings:
`https://bahar-qntm.github.io`

## 🎯 Benefits of This Setup

- ✅ **No Manual Builds**: Push React code, get deployed widget
- ✅ **Always Current**: Docs folder always matches latest React code
- ✅ **Version Control**: Built files are tracked and versioned
- ✅ **Rollback Ready**: Easy to revert to previous versions
- ✅ **Consistent**: Same build environment every time
- ✅ **Fast**: Automated deployment in ~2-3 minutes

---

*This automated setup eliminates the manual build steps that were required with vanilla JS development.*
