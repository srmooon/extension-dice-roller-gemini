# 🎲 Dice Roller for Gemini Chat

A Chrome extension that adds dice rolling functionality to Google Gemini Chat with beautiful animations and advanced features.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-extension-orange.svg)

## ✨ Features

### 🎯 Core Features
- **Integrated Button**: Seamlessly integrated dice button in Gemini Chat interface
- **Dual Dice Rolling**: Roll two different dice simultaneously (e.g., 1d20 + 1d8)
- **Multiple Formats**: Support for various dice formats (1d20, 2d6, 3d8+5, etc.)
- **Animated Results**: Beautiful 2D animations showing dice rolling
- **Auto-Insert**: Automatically insert results into chat and send

### 🎮 Advanced Mechanics
- **Advantage/Disadvantage**: D&D 5e style advantage and disadvantage rolls
- **Lucky Die Mode**: Guarantees results in the top 70% range (7-10 on d10, 14-20 on d20)
- **Modifiers**: Support for positive and negative modifiers (+5, -2, etc.)
- **Secure Random**: Uses Web Crypto API for cryptographically secure random numbers

### 🌍 Internationalization
- **Bilingual Support**: Full support for Portuguese (PT-BR) and English (EN-US)
- **Dynamic Language Switching**: Change language on-the-fly with page reload
- **Translated Output**: Dice results are formatted in the selected language

### 🎨 User Interface
- **Material Design**: Follows Google's Material Design guidelines
- **Dark Theme Compatible**: Matches Gemini's dark theme
- **Responsive**: Works on all screen sizes
- **Accessible**: Keyboard navigation and screen reader support

## 📦 Installation

### From Chrome Web Store
*Coming soon*

### Manual Installation (Developer Mode)

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/dice-roller-gemini.git
   cd dice-roller-gemini
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder

3. **Start Using**
   - Go to [gemini.google.com](https://gemini.google.com)
   - Look for the 🎲 Dice button next to the Tools button
   - Click and start rolling!

## 🎲 How to Use

### Basic Rolling

1. Click the 🎲 **Dice** button in Gemini Chat
2. Enter your dice format (e.g., `1d20`, `2d6+3`)
3. Click **Roll Dice**
4. Result is automatically inserted into chat

### Dice Format Examples

| Format | Description |
|--------|-------------|
| `1d20` | Roll one 20-sided die |
| `2d6` | Roll two 6-sided dice |
| `3d8+5` | Roll three 8-sided dice and add 5 |
| `1d12-2` | Roll one 12-sided die and subtract 2 |
| `4d6` | Roll four 6-sided dice |
| `1d8+2d6` | Roll 1d8 and 2d6, sum all results |
| `1d20 + 1d6 + 3` | Roll 1d20, 1d6, and add 3 (with spaces) |
| `3d6+2d8+5` | Roll 3d6, 2d8, and add 5 |
| `200d6` | Roll 200 six-sided dice |

### Advanced Features

#### Two Dice at Once
- **First Die**: `1d20` (attack roll)
- **Second Die**: `1d8` (damage roll)
- Both results appear in chat

#### Advantage/Disadvantage
- **Normal**: Standard roll
- **Advantage**: Roll 2 dice, take the higher
- **Disadvantage**: Roll 2 dice, take the lower

#### Lucky Die Mode 🍀
- Activate "Lucky Die" checkbox
- Guarantees results in top 70% range
- Works with all dice types
- Example: 1d10 always rolls 7-10

### Language Selection

1. Open the dice roller popup
2. Scroll to the bottom
3. Select your language (PT-BR or EN-US)
4. Click "Reload Page" to apply changes

## 🛠️ Technical Details

### Supported Dice
- **Sides**: 2 to unlimited sides
- **Quantity**: 1 to unlimited dice per roll
- **Modifiers**: unlimited
- **Spaces**: Accepts spaces in format (e.g., `1d20 + 1d6`)

### Random Number Generation
- **Primary**: Web Crypto API (cryptographically secure)
- **Fallback**: Math.random() (if Crypto API unavailable)

### Browser Compatibility
- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## 📁 Project Structure

```
dice-roller-gemini/
├── manifest.json           # Extension manifest
├── content-script.js       # Main content script
├── utils/
│   ├── i18n.js            # Internationalization
│   ├── dice-parser.js     # Dice format parser
│   ├── random-generator.js # Random number generation
│   ├── roll-engine.js     # Dice rolling logic
│   ├── error-handler.js   # Error handling
│   ├── gemini-injector.js # UI injection
│   └── fallback-manager.js # Fallback strategies
├── popup/
│   ├── dice-popup.js      # Popup logic
│   └── dice-popup.css     # Popup styles
├── styles/
│   └── dice-button.css    # Button styles
├── 3d-animation/
│   ├── dice-models.js     # 3D dice models
│   └── dice-renderer.js   # 3D rendering
├── assets/
│   └── icons/             # Extension icons
└── tests/
    └── lucky-dice-verification.html # Testing page
```

## 🎯 Features in Detail

### Lucky Die System
The Lucky Die feature uses a re-roll mechanism to guarantee favorable results:

```javascript
// For 1d10: Guarantees 7-10
// For 1d20: Guarantees 14-20
// For 1d6: Guarantees 5-6
```

The system calculates 70% of the maximum value and re-rolls until achieving a result in that range.

### Output Format

**Portuguese (PT-BR):**
```
🎲 1d20 ➜ RESULTADO: 18
📊 Detalhes: [18]
```

**English (EN-US):**
```
🎲 1d20 ➜ RESULT: 18
📊 Details: [18]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Clone the repository
2. Make your changes
3. Test in Chrome (Developer Mode)
4. Submit a PR with a clear description

### Code Style
- Use ES6+ features
- Follow existing code structure
- Add comments for complex logic
- Test all features before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub with:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)
- Browser version

## 💡 Feature Requests

Have an idea? Open an issue with the "enhancement" label and describe:
- The feature you'd like
- Why it would be useful
- How it should work

## 📧 Contact

- **GitHub**: [Your GitHub Profile](https://github.com/yourusername)
- **Issues**: [GitHub Issues](https://github.com/yourusername/dice-roller-gemini/issues)

## 🙏 Acknowledgments

- Google Gemini for the amazing AI chat platform
- Material Design for the design guidelines
- The RPG community for inspiration

## 📊 Stats

- **Lines of Code**: ~3,000+
- **Files**: 20+
- **Languages**: JavaScript, CSS, HTML
- **Supported Languages**: Portuguese, English

---

**Made with 🎲 for the RPG and gaming community**

*Enjoy rolling your dice in Gemini Chat!*
