
class DiceRollerExtension {
    constructor() {
        this.geminiInjector = null;
        this.dicePopup = null;
        this.diceRenderer = null;
        this.errorHandler = null;
        this.isInitialized = false;
        this.retryCount = 0;
        this.maxRetries = 5;
        
        this.init();
    }

    
    async init() {
        try {
            console.log('🎲 Dice Roller Extension: Initializing...');
            
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            } else {
                await this.initializeComponents();
            }
            
        } catch (error) {
            console.error('🎲 Dice Roller Extension: Initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    
    async initializeComponents() {
        try {
            
            this.errorHandler = new ErrorHandler();
            
            
            this.geminiInjector = new GeminiInjector();
            
            
            this.dicePopup = new DicePopup();
            
            
            this.diceRenderer = new DiceRenderer();
            
            
            await this.waitForGeminiReady();
            
            
            await this.injectDiceButton();
            
            
            this.startDOMObserver();
            
            this.isInitialized = true;
            console.log('🎲 Dice Roller Extension: Successfully initialized');
            
        } catch (error) {
            console.error('🎲 Dice Roller Extension: Component initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    
    async waitForGeminiReady() {
        return new Promise((resolve, reject) => {
            const checkReady = () => {
                // Verifica se está no Gemini Chat ou AI Studio
                const isGeminiPage = window.location.hostname === 'gemini.google.com' && 
                                   (window.location.pathname.includes('/app') || 
                                    window.location.pathname === '/' ||
                                    window.location.pathname.startsWith('/u/'));
                
                const isAIStudio = window.location.hostname === 'aistudio.google.com';
                
                if (!isGeminiPage && !isAIStudio) {
                    console.log('🎲 Not on a Gemini or AI Studio page, skipping injection');
                    resolve(); 
                    return;
                }
                
                console.log(`🎲 Detected platform: ${isAIStudio ? 'AI Studio' : 'Gemini Chat'}`);
                
                if (this.geminiInjector.isGeminiReady()) {
                    console.log('🎲 Interface ready');
                    resolve();
                } else if (this.retryCount < this.maxRetries) {
                    this.retryCount++;
                    console.log(`🎲 Waiting for interface... (${this.retryCount}/${this.maxRetries})`);
                    setTimeout(checkReady, 1000);
                } else {
                    console.log('🎲 Interface not ready, will try fallback methods');
                    resolve(); 
                }
            };
            
            checkReady();
        });
    }

    
    async injectDiceButton() {
        const clickHandler = () => this.handleDiceButtonClick();
        
        const success = this.geminiInjector.injectDiceButton(clickHandler);
        if (success) {
            console.log('🎲 Dice button injected successfully');
        } else {
            throw new Error('Failed to inject dice button');
        }
    }

    
    startDOMObserver() {
        const clickHandler = () => this.handleDiceButtonClick();
        this.geminiInjector.observeGeminiChanges(clickHandler);
        console.log('🎲 DOM observer started');
    }

    
    handleDiceButtonClick() {
        try {
            console.log('🎲 Dice button clicked');
            
            if (this.dicePopup) {
                this.dicePopup.show();
            } else {
                console.error('🎲 Dice popup not initialized');
                this.showError('Erro interno: Popup não inicializado');
            }
            
        } catch (error) {
            console.error('🎲 Error handling dice button click:', error);
            this.handleRuntimeError(error);
        }
    }

    
    handleInitializationError(error) {
        console.error('🎲 Initialization error:', error);
        
        
        if (this.errorHandler) {
            this.showError('Erro ao inicializar extensão de dados. Recarregue a página.');
        }
        
        
        setTimeout(() => {
            if (!this.isInitialized && this.retryCount < this.maxRetries) {
                console.log('🎲 Attempting to recover from initialization error...');
                this.retryCount++;
                this.init();
            }
        }, 3000);
    }

    
    handleRuntimeError(error) {
        console.error('🎲 Runtime error:', error);
        
        if (this.errorHandler) {
            
            const container = document.body;
            this.errorHandler.handleRuntimeError(error, container);
        }
    }

    
    showError(message) {
        if (this.errorHandler) {
            const container = document.body;
            this.errorHandler.showError(message, container);
        } else {
            
            console.error('🎲 Error:', message);
            alert(`Dice Roller Extension Error: ${message}`);
        }
    }

    
    async performEnhancedRoll(diceFormat, rollType = 'normal') {
        try {
            
            if (!this.dicePopup || !this.dicePopup.rollEngine) {
                throw new Error('Roll engine not available');
            }

            const rollEngine = this.dicePopup.rollEngine;
            const result = rollEngine.roll(diceFormat, rollType);

            
            if (this.diceRenderer && this.diceRenderer.isInitialized) {
                const parsed = rollEngine.parser.parse(diceFormat);
                if (parsed) {
                    await this.diceRenderer.animateEnhancedRoll(parsed, result.selectedRolls);
                }
            }

            return result;
            
        } catch (error) {
            console.error('🎲 Enhanced roll error:', error);
            throw error;
        }
    }

    
    getStatus() {
        return {
            initialized: this.isInitialized,
            geminiReady: this.geminiInjector ? this.geminiInjector.isGeminiReady() : false,
            popupAvailable: this.dicePopup !== null,
            rendererAvailable: this.diceRenderer !== null,
            rendererInitialized: this.diceRenderer ? this.diceRenderer.isInitialized : false,
            is3DAvailable: this.diceRenderer ? this.diceRenderer.is3DAvailable() : false,
            retryCount: this.retryCount
        };
    }

    
    cleanup() {
        try {
            console.log('🎲 Cleaning up Dice Roller Extension...');
            
            if (this.geminiInjector) {
                this.geminiInjector.cleanup();
            }
            
            if (this.dicePopup) {
                this.dicePopup.cleanup();
            }
            
            if (this.diceRenderer) {
                this.diceRenderer.cleanup();
            }
            
            this.isInitialized = false;
            console.log('🎲 Cleanup completed');
            
        } catch (error) {
            console.error('🎲 Cleanup error:', error);
        }
    }

    
    async restart() {
        console.log('🎲 Restarting Dice Roller Extension...');
        this.cleanup();
        this.retryCount = 0;
        await this.init();
    }

    
    healthCheck() {
        const status = this.getStatus();
        return status.initialized && 
               status.geminiReady && 
               status.popupAvailable;
    }
}


let diceRollerExtension = null;


try {
    diceRollerExtension = new DiceRollerExtension();
    
    
    if (typeof window !== 'undefined') {
        window.diceRollerExtension = diceRollerExtension;
    }
    
} catch (error) {
    console.error('🎲 Failed to create Dice Roller Extension:', error);
}


window.addEventListener('beforeunload', () => {
    if (diceRollerExtension) {
        diceRollerExtension.cleanup();
    }
});


if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'getDiceRollerStatus') {
            const status = diceRollerExtension ? diceRollerExtension.getStatus() : { error: 'Extension not initialized' };
            sendResponse(status);
        } else if (request.action === 'restartDiceRoller') {
            if (diceRollerExtension) {
                diceRollerExtension.restart().then(() => {
                    sendResponse({ success: true });
                }).catch(error => {
                    sendResponse({ success: false, error: error.message });
                });
            } else {
                sendResponse({ success: false, error: 'Extension not initialized' });
            }
        } else if (request.action === 'insertDiceResult') {
            
            try {
                const geminiInjector = diceRollerExtension ? diceRollerExtension.geminiInjector : new GeminiInjector();
                const success = geminiInjector.insertText(request.formattedText);
                
                console.log('🎲 Dice result insertion requested:', request.formattedText);
                console.log('🎲 Insertion result:', success);
                console.log('🎲 Auto-send requested:', request.autoSend);
                
                
                if (success && request.autoSend) {
                    setTimeout(() => {
                        try {
                            
                            const sendButton = geminiInjector.findSendButton();
                            if (sendButton) {
                                sendButton.click();
                                console.log('🎲 Message sent automatically');
                            } else {
                                console.warn('🎲 Send button not found, trying Enter key');
                                
                                const textInput = geminiInjector.findTextInput();
                                if (textInput) {
                                    const enterEvent = new KeyboardEvent('keydown', {
                                        key: 'Enter',
                                        code: 'Enter',
                                        keyCode: 13,
                                        which: 13,
                                        bubbles: true,
                                        cancelable: true
                                    });
                                    textInput.dispatchEvent(enterEvent);
                                    console.log('🎲 Enter key pressed');
                                }
                            }
                        } catch (sendError) {
                            console.error('🎲 Error sending message:', sendError);
                        }
                    }, 500); 
                }
                
                sendResponse({ success: success });
            } catch (error) {
                console.error('🎲 Error inserting dice result:', error);
                sendResponse({ success: false, error: error.message });
            }
        }
        return true; 
    });
}

console.log('🎲 Dice Roller Extension content script loaded');