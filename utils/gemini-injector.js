
class GeminiInjector {
    constructor() {
        this.observer = null;
        this.diceButton = null;
        this.isInjected = false;
        this.retryCount = 0;
        this.maxRetries = 10;
    }

    
    findTextInput() {
        
        const selectors = [
            '.ql-editor[contenteditable="true"]',
            'rich-textarea .ql-editor',
            '[data-placeholder*="Ask Gemini"]',
            '[data-placeholder*="Enter a prompt"]',
            '.text-input-field_textarea .ql-editor',
            'div[contenteditable="true"][role="textbox"]',
            '[class*="ql-editor"]',
            'textarea[placeholder*="Ask"]',
            '[aria-label*="prompt"]',
            '[aria-label*="Enter"]'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && this.isValidTextInput(element)) {
                console.log(`🎲 Found text input with selector: ${selector}`);
                return element;
            }
        }

        
        console.log('🎲 Available text inputs:', document.querySelectorAll('[contenteditable="true"], textarea, input[type="text"]'));
        return null;
    }

    
    isValidTextInput(element) {
        if (!element) return false;
        
        
        if (element.isContentEditable || element.getAttribute('contenteditable') === 'true') {
            return true;
        }
        
        
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            return true;
        }
        
        
        if (element.getAttribute('role') === 'textbox' || 
            element.classList.contains('ql-editor') ||
            element.hasAttribute('data-placeholder')) {
            return true;
        }
        
        return false;
    }

    
    findToolboxDrawer() {
        const selectors = [
            'toolbox-drawer .toolbox-drawer-container',
            '.toolbox-drawer-container',
            '[class*="toolbox-drawer"]',
            '.leading-actions-wrapper toolbox-drawer',
            '.leading-actions-wrapper',
            '[class*="leading-actions"]',
            '[class*="toolbox"]',
            '.uploader-button-container'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && this.isValidToolboxDrawer(element)) {
                console.log(`🎲 Found toolbox drawer with selector: ${selector}`);
                return element;
            }
        }

        
        console.log('🎲 Available toolbox elements:', document.querySelectorAll('[class*="toolbox"], [class*="drawer"], [class*="leading"]'));
        return null;
    }

    
    isValidToolboxDrawer(element) {
        return element && 
               (element.classList.contains('toolbox-drawer-container') ||
                element.querySelector('toolbox-drawer-item') ||
                element.querySelector('[class*="toolbox-drawer-item"]'));
    }

    
    insertText(text) {
        const textInput = this.findTextInput();
        if (!textInput) {
            console.error('🎲 Could not find text input field');
            return false;
        }

        try {
            console.log('🎲 Inserting text into:', textInput);


            if (textInput.tagName === 'TEXTAREA' || textInput.tagName === 'INPUT') {

                textInput.value = text;
                textInput.focus();
                this.triggerInputEvents(textInput, text);
            } else if (textInput.isContentEditable) {


                textInput.focus();


                this.dispatchBeforeInputEvent(textInput, text);


                textInput.innerHTML = '';
                const paragraph = document.createElement('p');
                const textNode = document.createTextNode(text);
                paragraph.appendChild(textNode);
                textInput.appendChild(paragraph);


                if (textInput.classList.contains('ql-blank')) {
                    textInput.classList.remove('ql-blank');
                }


                this.triggerInputEvents(textInput, text);


                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(textInput);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);

            } else {

                textInput.textContent = text;
                textInput.focus();
                this.triggerInputEvents(textInput, text);
            }

            console.log('🎲 Text inserted successfully');
            return true;
        } catch (error) {
            console.error('🎲 Error inserting text:', error);
            return false;
        }
    }


    dispatchBeforeInputEvent(element, text) {
        try {
            const beforeInputEvent = new InputEvent('beforeinput', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText',
                data: text
            });
            element.dispatchEvent(beforeInputEvent);
        } catch (e) {
            console.warn('🎲 Could not dispatch beforeinput event:', e);
        }
    }


    triggerInputEvents(element, text) {

        try {
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: false,
                inputType: 'insertText',
                data: text
            });
            element.dispatchEvent(inputEvent);
        } catch (e) {
            console.warn('🎲 Could not dispatch input event:', e);
        }


        const additionalEvents = [
            'change',
            'keyup',
            'textInput'
        ];

        additionalEvents.forEach(eventType => {
            try {
                let event;
                if (eventType === 'keyup') {
                    event = new KeyboardEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        key: text.charAt(text.length - 1),
                        code: 'Key' + text.charAt(text.length - 1).toUpperCase()
                    });
                } else if (eventType === 'textInput') {
                    event = new InputEvent(eventType, {
                        bubbles: true,
                        cancelable: true,
                        data: text
                    });
                } else {
                    event = new Event(eventType, {
                        bubbles: true,
                        cancelable: true
                    });
                }
                element.dispatchEvent(event);
            } catch (e) {
                console.warn(`🎲 Could not trigger ${eventType} event:`, e);
            }
        });


        try {
            element.focus();
        } catch (e) {
            console.warn('🎲 Could not focus element:', e);
        }
    }

    
    createDiceButton() {
        const button = document.createElement('toolbox-drawer-item');
        button.className = 'mat-mdc-tooltip-trigger toolbox-drawer-item-button ng-star-inserted dice-roller-button';
        button.setAttribute('_nghost-ng-c3522974133', '');
        button.style.cssText = '';

        const innerButton = document.createElement('button');
        innerButton.className = 'mat-ripple mat-mdc-tooltip-trigger toolbox-drawer-item-button gds-label-l ng-star-inserted';
        innerButton.setAttribute('matripple', '');
        innerButton.setAttribute('aria-pressed', 'false');
        innerButton.setAttribute('jslog', '255044;track:generic_click');

        const icon = document.createElement('span');
        icon.className = 'mat-icon notranslate mat-mdc-list-item-icon menu-icon gds-icon-l mdc-list-item__start ng-star-inserted';
        icon.setAttribute('role', 'img');
        icon.setAttribute('aria-hidden', 'true');
        icon.style.cssText = 'font-size: 20px; display: inline-flex; align-items: center; justify-content: center;';
        icon.textContent = '🎲'; 

        const label = document.createElement('div');
        label.className = 'toolbox-drawer-button-label label';
        
        const i18n = new I18n();
        label.textContent = i18n.t('buttonLabel');

        innerButton.appendChild(icon);
        innerButton.appendChild(label);
        button.appendChild(innerButton);

        return button;
    }

    
    injectDiceButton(clickHandler) {
        if (this.isInjected && this.diceButton && this.diceButton.parentNode) {
            return true; 
        }

        const toolboxDrawer = this.findToolboxDrawer();
        if (!toolboxDrawer) {
            console.log('Toolbox drawer not found, retrying...');
            return false;
        }

        try {
            this.diceButton = this.createDiceButton();
            
            
            const button = this.diceButton.querySelector('button');
            if (button && clickHandler) {
                button.addEventListener('click', clickHandler);
            }

            
            const existingButtons = toolboxDrawer.querySelectorAll('toolbox-drawer-item');
            if (existingButtons.length > 0) {
                const lastButton = existingButtons[existingButtons.length - 1];
                lastButton.parentNode.insertBefore(this.diceButton, lastButton.nextSibling);
            } else {
                toolboxDrawer.appendChild(this.diceButton);
            }

            this.isInjected = true;
            console.log('Dice button injected successfully');
            return true;
        } catch (error) {
            console.error('Error injecting dice button:', error);
            return false;
        }
    }

    
    observeGeminiChanges(clickHandler) {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.observer = new MutationObserver((mutations) => {
            let shouldReinject = false;

            mutations.forEach((mutation) => {
                
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const removedNodes = Array.from(mutation.removedNodes);
                    
                    
                    const hasToolboxDrawer = addedNodes.some(node => 
                        node.nodeType === Node.ELEMENT_NODE &&
                        (node.matches && node.matches('toolbox-drawer, [class*="toolbox-drawer"]') ||
                         node.querySelector && node.querySelector('toolbox-drawer, [class*="toolbox-drawer"]'))
                    );

                    
                    const buttonRemoved = removedNodes.some(node =>
                        node === this.diceButton ||
                        (node.nodeType === Node.ELEMENT_NODE && 
                         node.querySelector && node.querySelector('.dice-roller-button'))
                    );

                    if (hasToolboxDrawer || buttonRemoved) {
                        shouldReinject = true;
                    }
                }
            });

            if (shouldReinject) {
                setTimeout(() => {
                    this.attemptInjection(clickHandler);
                }, 100);
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    
    attemptInjection(clickHandler) {
        if (this.retryCount >= this.maxRetries) {
            console.error('🎲 Max injection retries reached, implementing recovery strategies');
            this.implementRecoveryStrategies(clickHandler);
            return;
        }

        if (!this.injectDiceButton(clickHandler)) {
            this.retryCount++;
            console.log(`🎲 Injection attempt ${this.retryCount}/${this.maxRetries} failed, retrying...`);
            
            
            const delay = (1000 * this.retryCount) + (Math.random() * 500);
            setTimeout(() => {
                this.attemptInjection(clickHandler);
            }, delay);
        } else {
            console.log('🎲 Injection successful after', this.retryCount, 'retries');
            this.retryCount = 0; 
        }
    }

    
    implementRecoveryStrategies(clickHandler) {
        console.log('🎲 Implementing DOM injection recovery strategies...');
        
        
        this.tryAlternativeSelectors(clickHandler) ||
        
        this.createFloatingButton(clickHandler) ||
        
        this.setupKeyboardShortcut(clickHandler) ||
        
        this.showManualInstructions();
    }

    
    tryAlternativeSelectors(clickHandler) {
        console.log('🎲 Trying alternative selectors...');
        
        const alternativeSelectors = [
            
            '.leading-actions-wrapper',
            '.text-input-field',
            '.input-buttons-wrapper-bottom',
            '[class*="toolbox"]',
            '[class*="drawer"]',
            
            '.mat-mdc-form-field',
            '.text-input-field-main-area',
            'form',
            'main'
        ];

        for (const selector of alternativeSelectors) {
            try {
                const container = document.querySelector(selector);
                if (container && this.isValidInjectionTarget(container)) {
                    console.log(`🎲 Found alternative container: ${selector}`);
                    return this.injectIntoAlternativeContainer(container, clickHandler);
                }
            } catch (error) {
                console.warn(`🎲 Alternative selector ${selector} failed:`, error);
            }
        }

        return false;
    }

    
    isValidInjectionTarget(element) {
        return element && 
               element.offsetParent !== null && 
               element.clientWidth > 0 && 
               element.clientHeight > 0;
    }

    
    injectIntoAlternativeContainer(container, clickHandler) {
        try {
            this.diceButton = this.createAlternativeDiceButton();
            
            
            const button = this.diceButton.querySelector('button');
            if (button && clickHandler) {
                button.addEventListener('click', clickHandler);
            }

            
            container.style.position = 'relative';
            this.diceButton.style.position = 'absolute';
            this.diceButton.style.top = '10px';
            this.diceButton.style.right = '10px';
            this.diceButton.style.zIndex = '1000';
            
            container.appendChild(this.diceButton);
            this.isInjected = true;
            
            console.log('🎲 Alternative injection successful');
            return true;
            
        } catch (error) {
            console.error('🎲 Alternative injection failed:', error);
            return false;
        }
    }

    
    createAlternativeDiceButton() {
        const button = document.createElement('div');
        button.className = 'dice-roller-alternative-button';
        button.innerHTML = `
            <button class="dice-alt-btn" title="Rolar Dados">
                🎲
            </button>
        `;
        
        
        button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10000;
        `;
        
        const innerButton = button.querySelector('button');
        innerButton.style.cssText = `
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
        `;
        
        
        innerButton.addEventListener('mouseenter', () => {
            innerButton.style.transform = 'scale(1.1)';
            innerButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });
        
        innerButton.addEventListener('mouseleave', () => {
            innerButton.style.transform = 'scale(1)';
            innerButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        });
        
        return button;
    }

    
    createFloatingButton(clickHandler) {
        console.log('🎲 Creating floating dice button...');
        
        try {
            this.diceButton = document.createElement('div');
            this.diceButton.className = 'dice-roller-floating-button';
            this.diceButton.innerHTML = `
                <button class="dice-float-btn" title="Rolar Dados - Extensão Dice Roller">
                    🎲
                </button>
            `;
            
            
            this.diceButton.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                background: #4285f4;
                border-radius: 50%;
                box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                animation: floatPulse 2s ease-in-out infinite;
            `;
            
            const button = this.diceButton.querySelector('button');
            button.style.cssText = `
                background: transparent;
                color: white;
                border: none;
                width: 56px;
                height: 56px;
                font-size: 24px;
                cursor: pointer;
                border-radius: 50%;
                transition: all 0.2s ease;
            `;
            
            
            if (clickHandler) {
                button.addEventListener('click', clickHandler);
            }
            
            
            this.addFloatingButtonCSS();
            
            document.body.appendChild(this.diceButton);
            this.isInjected = true;
            
            console.log('🎲 Floating button created successfully');
            return true;
            
        } catch (error) {
            console.error('🎲 Floating button creation failed:', error);
            return false;
        }
    }

    
    addFloatingButtonCSS() {
        if (document.getElementById('dice-floating-css')) return;
        
        const style = document.createElement('style');
        style.id = 'dice-floating-css';
        style.textContent = `
            @keyframes floatPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .dice-roller-floating-button:hover {
                transform: scale(1.1) !important;
            }
            
            .dice-roller-floating-button:active {
                transform: scale(0.95) !important;
            }
        `;
        document.head.appendChild(style);
    }

    
    setupKeyboardShortcut(clickHandler) {
        console.log('🎲 Setting up keyboard shortcut (Ctrl+Shift+D)...');
        
        try {
            const keyboardHandler = (event) => {
                if (event.ctrlKey && event.shiftKey && event.key === 'D') {
                    event.preventDefault();
                    console.log('🎲 Keyboard shortcut activated');
                    if (clickHandler) {
                        clickHandler();
                    }
                }
            };
            
            document.addEventListener('keydown', keyboardHandler);
            
            
            this.keyboardHandler = keyboardHandler;
            
            
            this.showKeyboardShortcutNotification();
            
            return true;
            
        } catch (error) {
            console.error('🎲 Keyboard shortcut setup failed:', error);
            return false;
        }
    }

    
    showKeyboardShortcutNotification() {
        const notification = document.createElement('div');
        notification.className = 'dice-keyboard-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">🎲</span>
                <span class="notification-text">Dice Roller ativo! Use Ctrl+Shift+D para rolar dados</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4285f4;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10001;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            margin-left: 8px;
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
        
        document.body.appendChild(notification);
        this.addNotificationCSS();
    }

    
    addNotificationCSS() {
        if (document.getElementById('dice-notification-css')) return;
        
        const style = document.createElement('style');
        style.id = 'dice-notification-css';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .notification-icon {
                font-size: 16px;
            }
            
            .notification-text {
                flex: 1;
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    
    showManualInstructions() {
        console.log('🎲 Showing manual instructions...');
        
        const instructions = document.createElement('div');
        instructions.className = 'dice-manual-instructions';
        instructions.innerHTML = `
            <div class="instructions-content">
                <h3>🎲 Dice Roller Extension</h3>
                <p>A extensão não conseguiu se integrar automaticamente ao Gemini.</p>
                <p><strong>Como usar:</strong></p>
                <ul>
                    <li>Pressione <kbd>Ctrl+Shift+D</kbd> para abrir o rolador de dados</li>
                    <li>Ou procure pelo botão flutuante 🎲 na tela</li>
                </ul>
                <button class="instructions-close">Entendi</button>
            </div>
        `;
        
        instructions.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            z-index: 10002;
            max-width: 400px;
            padding: 24px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        
        const content = instructions.querySelector('.instructions-content');
        content.style.textAlign = 'center';
        
        const closeBtn = instructions.querySelector('.instructions-close');
        closeBtn.style.cssText = `
            background: #4285f4;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 16px;
        `;
        
        closeBtn.addEventListener('click', () => {
            instructions.remove();
        });
        
        document.body.appendChild(instructions);
        
        return true;
    }

    
    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.diceButton && this.diceButton.parentNode) {
            this.diceButton.parentNode.removeChild(this.diceButton);
        }

        
        if (this.keyboardHandler) {
            document.removeEventListener('keydown', this.keyboardHandler);
            this.keyboardHandler = null;
        }

        
        const notifications = document.querySelectorAll('.dice-keyboard-notification, .dice-manual-instructions');
        notifications.forEach(notification => notification.remove());

        this.diceButton = null;
        this.isInjected = false;
        this.retryCount = 0;
    }

    
    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        if (this.diceButton && this.diceButton.parentNode) {
            this.diceButton.parentNode.removeChild(this.diceButton);
        }

        this.diceButton = null;
        this.isInjected = false;
        this.retryCount = 0;
    }

    
    findSendButton() {
        const selectors = [
            'button[aria-label*="Send"]',
            'button[aria-label*="send"]',
            'button[aria-label*="Enviar"]',
            '.send-button',
            '[class*="send-button"]',
            'button[jslog*="173899"]', 
            'button .mat-icon[fonticon="send"]',
            'button:has(.mat-icon[fonticon="send"])'
        ];

        for (const selector of selectors) {
            try {
                const element = document.querySelector(selector);
                if (element && this.isValidSendButton(element)) {
                    console.log(`🎲 Found send button with selector: ${selector}`);
                    return element;
                }
            } catch (e) {
                
                continue;
            }
        }

        
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            if (this.isValidSendButton(button)) {
                console.log('🎲 Found send button by icon detection');
                return button;
            }
        }

        console.log('🎲 Send button not found');
        return null;
    }

    
    isValidSendButton(element) {
        if (!element || element.disabled) return false;
        
        
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel && (ariaLabel.toLowerCase().includes('send') || ariaLabel.toLowerCase().includes('enviar'))) {
            return true;
        }
        
        
        const sendIcon = element.querySelector('.mat-icon[fonticon="send"], [data-mat-icon-name="send"]');
        if (sendIcon) {
            return true;
        }
        
        
        if (element.className.includes('send')) {
            return true;
        }
        
        return false;
    }

    
    isGeminiReady() {
        return this.findTextInput() !== null && this.findToolboxDrawer() !== null;
    }
}


if (typeof window !== 'undefined') {
    window.GeminiInjector = GeminiInjector;
}