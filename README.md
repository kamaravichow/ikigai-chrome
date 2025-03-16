# IKIGAI HOME - Custom New Tab Chrome Extension

A beautiful and minimalist Chrome extension that replaces the default new tab page with a clean, modern interface featuring a search bar with suggestions.

## Features

- Clean, modern design with a beautiful background
- Google search with suggestions via DuckDuckGo API
- URL detection for direct navigation
- Keyboard navigation for search suggestions
- Responsive layout that works on all screen sizes
- Accessibility-friendly design

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top right corner
4. Click "Load unpacked" and select the directory containing this extension
5. Open a new tab to see your custom page

## Project Structure

```
ikigai/
├── icons/                # Extension icons
├── images/               # Background images
├── manifest.json         # Extension configuration
├── newtab.html           # Main HTML structure
├── newtab.js             # JavaScript functionality
├── styles.css            # CSS styling
└── README.md             # Documentation
```

## Code Organization

### JavaScript (newtab.js)

The JavaScript code follows a modular pattern with a main namespace `IkigaiApp` to avoid global scope pollution. Key components:

- **DOM Element Caching**: All DOM elements are cached for better performance
- **Event Binding**: Centralized event handling
- **Configuration**: Easily adjustable settings
- **Error Handling**: Proper error handling for API requests
- **Utility Functions**: Reusable helper functions

### CSS (styles.css)

The CSS is organized with:

- **CSS Variables**: For consistent theming and easy customization
- **Logical Sections**: Code is divided into clear sections with comments
- **Responsive Design**: Media queries for different screen sizes
- **Accessibility**: Helper classes for screen readers

### HTML (newtab.html)

The HTML structure uses:

- **Semantic Elements**: Proper use of semantic HTML5 elements
- **Accessibility Attributes**: ARIA roles and labels
- **Clean Structure**: Logical organization of elements

## Customization

You can customize the extension by modifying the following:

### Change the Background

1. Replace the image in the `images/` directory
2. Update the image reference in `styles.css`

### Modify Colors and Theme

1. Edit the CSS variables in the `:root` section of `styles.css`

### Change Search Engine

1. Modify the form action in `newtab.html`
2. Update the search URL in the `handleFormSubmit` function in `newtab.js`

## Icons

Before publishing your extension, replace the placeholder icons in the `icons` directory with your own icons in the following sizes:
- 16x16 pixels (icon16.png)
- 48x48 pixels (icon48.png)
- 128x128 pixels (icon128.png)

## Maintenance Guidelines

To keep the codebase maintainable:

1. **Follow the established patterns** when adding new features
2. **Use the existing CSS variables** for consistent styling
3. **Document new functions** with JSDoc comments
4. **Test on multiple screen sizes** for responsive design
5. **Check accessibility** with screen readers and keyboard navigation

## License

This project is open source and available under the MIT License. 