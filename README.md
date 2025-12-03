# 🎲 Dice Roller for Gemini Chat

[Português](README.pt-BR.md) | **English**

A Chrome extension that adds advanced dice rolling functionality to Google Gemini Chat with beautiful animations and RPG-focused features.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-extension-orange.svg)

## ✨ Features

### 🎯 Core Features
- **8 Simultaneous Dice**: Roll up to 8 different dice at once
- **Player vs NPC System**: 4 dice for players (with modifiers) + 4 dice for NPCs
- **Multiple Formats**: Support for various dice formats (1d20, 2d6, 3d8+5, etc.)
- **Complex Expressions**: Roll multiple dice types in one expression (1d20+2d6+5)
- **Auto-Insert**: Automatically insert results into chat and send
- **Clear All Button**: Quickly clear all 8 dice fields at once

### 🎮 Advanced Mechanics
- **Advantage/Disadvantage**: D&D 5e style advantage and disadvantage rolls
- **Lucky Die Mode** 🍀: Guarantees results in the top 70% range (Player dice only)
- **Unlucky Die Mode** 💀: Guarantees results in the bottom 30% range (Player dice only)
- **Modifiers**: Support for positive and negative modifiers (+5, -2, etc.)
- **Secure Random**: Uses Web Crypto API for cryptographically secure random numbers

### 👤 Player Dice (1-4)
- Full modifier support (Lucky/Unlucky)
- Advantage/Disadvantage/Normal roll types
- Color-coded: Blue, Red, Green, Purple

### 🎭 NPC Dice (5-8)
- Advantage/Disadvantage/Normal roll types only
- No Lucky/Unlucky modifiers
- Color-coded: Red, Yellow, Orange, Brown
- Perfect for enemy/NPC rolls

### 🌍 Internationalization
- **Bilingual Support**: Full support for English (EN-US) and Portuguese (PT-BR)
- **Dynamic Language Switching**: Change language on-the-fly
- **Persistent Settings**: Language preference saved in localStorage
- **Default Language**: English (EN-US)

### 🎨 User Interface
- **Material Design**: Follows Google's Material Design guidelines
- **Dark Theme Compatible**: Matches Gemini's dark theme
- **Responsive**: Works on all screen sizes
- **Organized Layout**: Player and NPC dice in separate sections

## 📦 Installation

### Manual Installation (Developer Mode)

1. **Download the Extension**
   ```bash
   git clone https://github.com/srmooon/extension-dice-roller-gemini.git
   cd extension-dice-roller-gemini
   ```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the extension folder

3. **Start Using**
   - Go to [gemini.google.com](https://gemini.google.com)
   - Look for the 🎲 Dice button next to the chat input
   - Click and start rolling!

## 🎲 How to Use

### Basic Rolling

1. Click the 🎲 **Dice** button in Gemini Chat
2. Enter your dice format in any of the 8 fields
3. Select roll type (Normal/Advantage/Disadvantage)
4. For Player dice: optionally select Lucky/Unlucky modifier
5. Click **Roll Dice**
6. Results are automatically inserted into chat

### Dice Format Examples

| Format | Description |
|--------|-------------|
| `1d20` | Roll one 20-sided die |
| `2d6` | Roll two 6-sided dice |
| `3d8+5` | Roll three 8-sided dice and add 5 |
| `1d12-2` | Roll one 12-sided die and subtract 2 |
| `4d6` | Roll four 6-sided dice |
| `1d20+2d6+3` | Roll 1d20, 2d6, and add 3 |
| `3d6+2d8+5` | Roll 3d6, 2d8, and add 5 |

### Advanced Features

#### Multiple Dice Rolling
- **Die 1-4 (Player)**: With Lucky/Unlucky modifiers
- **Die 5-8 (NPC)**: Without special modifiers
- Roll any combination simultaneously
- Results are grouped by category (PLAYER/NPC)

#### Roll Types
- **Normal**: Standard roll
- **Advantage**: Roll 2 dice per die, take the higher
- **Disadvantage**: Roll 2 dice per die, take the lower

#### Modifiers (Player Dice Only)
- **None**: Standard roll
- **Lucky** 🍀: Guarantees results in top 70% range
- **Unlucky** 💀: Guarantees results in bottom 30% range

### Language Selection

1. Open the dice roller popup
2. Scroll to the bottom
3. Select your language (EN-US or PT-BR)
4. Click "Reload Page" to apply changes
5. Language preference is saved automatically

## 🛠️ Technical Details

### Supported Dice
- **Sides**: 2 to 100 sides
- **Quantity**: 1 to 200 dice per roll
- **Modifiers**: Unlimited
- **Complex Expressions**: Multiple dice types in one roll

### Random Number Generation
- **Primary**: Web Crypto API (cryptographically secure)
- **Fallback**: Math.random() (if Crypto API unavailable)
- **Lucky/Unlucky**: Re-roll mechanism for guaranteed ranges

### Browser Compatibility
- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## 📁 Project Structure

```
extension-dice-roller-gemini/
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
├── assets/
│   └── icons/             # Extension icons
└── tests/                 # Test files
```

## 🎯 Features in Detail

### Lucky/Unlucky System
The modifier system uses a re-roll mechanism:

**Lucky Die** 🍀:
- d6: Guarantees 5-6
- d10: Guarantees 7-10
- d20: Guarantees 14-20
- Other dice: Top 70% range

**Unlucky Die** 💀:
- d6: Guarantees 1-3
- d10: Guarantees 1-3
- d20: Guarantees 1-6
- Other dice: Bottom 30% range

### Output Format

**English (EN-US):**
```
👤 PLAYER
🎲 Die 1: 1d20 ➜ 18 (Advantage)
🎲 Die 2: 2d6+3 ➜ 11 🍀

🎭 NPC
🎲 Die 5: 1d20 ➜ 12
```

**Portuguese (PT-BR):**
```
👤 PLAYER
🎲 Dado 1: 1d20 ➜ 18 (Vantagem)
🎲 Dado 2: 2d6+3 ➜ 11 🍀

🎭 NPC
🎲 Dado 5: 1d20 ➜ 12
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Clone the repository
2. Make your changes
3. Test in Chrome (Developer Mode)
4. Submit a PR with a clear description

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports & Feature Requests

- **Issues**: [GitHub Issues](https://github.com/srmooon/extension-dice-roller-gemini/issues)

## 📧 Contact

- **GitHub**: [@srmooon](https://github.com/srmooon)
- **Repository**: [extension-dice-roller-gemini](https://github.com/srmooon/extension-dice-roller-gemini)

## 🙏 Acknowledgments

- Google Gemini for the amazing AI chat platform
- Material Design for the design guidelines
- The RPG and D&D community for inspiration

---

**Made with 🎲 for the RPG and gaming community**

*Enjoy rolling your dice in Gemini Chat!*
