
describe('Integration Tests', ({ it, beforeEach }) => {
    let mockContainer;
    let dicePopup;
    let geminiInjector;
    
    beforeEach(() => {
        
        mockContainer = document.createElement('div');
        mockContainer.id = 'test-container';
        mockContainer.style.width = '400px';
        mockContainer.style.height = '300px';
        document.body.appendChild(mockContainer);
        
        
        const mockToolbox = document.createElement('div');
        mockToolbox.className = 'toolbox-drawer-container';
        mockContainer.appendChild(mockToolbox);
        
        const mockTextInput = document.createElement('div');
        mockTextInput.className = 'ql-editor';
        mockTextInput.setAttribute('contenteditable', 'true');
        mockTextInput.setAttribute('role', 'textbox');
        mockContainer.appendChild(mockTextInput);
    });
    
    afterEach(() => {
        
        if (mockContainer && mockContainer.parentNode) {
            mockContainer.parentNode.removeChild(mockContainer);
        }
        if (dicePopup) {
            dicePopup.cleanup();
        }
        if (geminiInjector) {
            geminiInjector.cleanup();
        }
    });
    
    it('should complete full dice rolling workflow', async () => {
        
        dicePopup = new DicePopup();
        geminiInjector = new GeminiInjector();
        
        
        expect(dicePopup).toBeTruthy();
        expect(document.getElementById('dice-popup-overlay')).toBeTruthy();
        
        
        dicePopup.show();
        expect(dicePopup.isPopupVisible()).toBeTruthy();
        
        dicePopup.hide();
        expect(dicePopup.isPopupVisible()).toBeFalsy();
        
        
        dicePopup.show();
        const formatInput = document.getElementById('dice-format');
        formatInput.value = '1d20';
        
        const isValid = dicePopup.validateInput();
        expect(isValid).toBeTruthy();
        
        
        dicePopup.setRollType('advantage');
        expect(dicePopup.currentRollType).toBe('advantage');
        
        
        const originalSleep = dicePopup.sleep;
        dicePopup.sleep = (ms) => Promise.resolve(); 
        
        await dicePopup.rollDice();
        
        expect(dicePopup.lastResult).toBeTruthy();
        expect(dicePopup.lastResult.rollType).toBe('advantage');
        
        
        dicePopup.sleep = originalSleep;
    });
    
    it('should handle Gemini DOM injection workflow', () => {
        geminiInjector = new GeminiInjector();
        
        
        const toolbox = geminiInjector.findToolboxDrawer();
        expect(toolbox).toBeTruthy();
        
        const textInput = geminiInjector.findTextInput();
        expect(textInput).toBeTruthy();
        
        
        const clickHandler = () => console.log('Button clicked');
        const success = geminiInjector.injectDiceButton(clickHandler);
        expect(success).toBeTruthy();
        expect(geminiInjector.isInjected).toBeTruthy();
        
        
        const testText = 'Test dice result: 15';
        const insertSuccess = geminiInjector.insertText(testText);
        expect(insertSuccess).toBeTruthy();
        
        const insertedText = textInput.textContent;
        expect(insertedText).toBe(testText);
    });
    
    it('should handle error scenarios gracefully', () => {
        dicePopup = new DicePopup();
        
        
        dicePopup.show();
        const formatInput = document.getElementById('dice-format');
        formatInput.value = 'invalid';
        
        const isValid = dicePopup.validateInput();
        expect(isValid).toBeFalsy();
        
        
        const errorContainer = document.getElementById('error-container');
        const errorMessage = errorContainer.querySelector('.dice-error-message');
        expect(errorMessage).toBeTruthy();
        
        
        dicePopup.clearErrors();
        const clearedError = errorContainer.querySelector('.dice-error-message');
        expect(clearedError).toBeFalsy();
    });
    
    it('should integrate with fallback manager', () => {
        const fallbackManager = new FallbackManager();
        const renderer = fallbackManager.createRenderer(mockContainer);
        
        expect(renderer).toBeTruthy();
        expect(typeof renderer.animate).toBe('function');
        
        
        const report = fallbackManager.getCapabilityReport();
        expect(report.canvas.supported).toBeTruthy(); 
        
        
        const recommendation = fallbackManager.getPerformanceRecommendation();
        expect(recommendation.maxDice).toBeGreaterThan(0);
        expect(recommendation.animationDuration).toBeGreaterThan(0);
    });
    
    it('should handle complete roll-to-chat workflow', async () => {
        dicePopup = new DicePopup();
        geminiInjector = new GeminiInjector();
        
        
        dicePopup.show();
        const formatInput = document.getElementById('dice-format');
        formatInput.value = '2d6+3';
        dicePopup.validateInput();
        
        
        const originalSleep = dicePopup.sleep;
        dicePopup.sleep = (ms) => Promise.resolve();
        
        
        await dicePopup.rollDice();
        expect(dicePopup.lastResult).toBeTruthy();
        
        
        const chatText = dicePopup.formatResultForChat(dicePopup.lastResult);
        expect(chatText).toContain('🎲');
        expect(chatText).toContain('2d6+3');
        expect(chatText).toContain(dicePopup.lastResult.finalResult.toString());
        
        
        const insertSuccess = geminiInjector.insertText(chatText);
        expect(insertSuccess).toBeTruthy();
        
        
        const textInput = geminiInjector.findTextInput();
        expect(textInput.textContent).toContain('🎲');
        
        
        dicePopup.sleep = originalSleep;
    });
    
    it('should handle advantage/disadvantage workflows', async () => {
        dicePopup = new DicePopup();
        
        
        dicePopup.show();
        const formatInput = document.getElementById('dice-format');
        formatInput.value = '1d20';
        dicePopup.setRollType('advantage');
        dicePopup.validateInput();
        
        
        const originalSleep = dicePopup.sleep;
        dicePopup.sleep = (ms) => Promise.resolve();
        
        await dicePopup.rollDice();
        
        expect(dicePopup.lastResult.rollType).toBe('advantage');
        expect(dicePopup.lastResult.rolls[0].length).toBe(2); 
        expect(dicePopup.lastResult.explanation).toContain('Vantagem');
        
        
        dicePopup.setRollType('disadvantage');
        await dicePopup.rollDice();
        
        expect(dicePopup.lastResult.rollType).toBe('disadvantage');
        expect(dicePopup.lastResult.rolls[0].length).toBe(2); 
        expect(dicePopup.lastResult.explanation).toContain('Desvantagem');
        
        
        dicePopup.sleep = originalSleep;
    });
    
    it('should handle DOM observer and re-injection', () => {
        geminiInjector = new GeminiInjector();
        
        const clickHandler = () => console.log('Button clicked');
        
        
        const success = geminiInjector.injectDiceButton(clickHandler);
        expect(success).toBeTruthy();
        
        
        geminiInjector.observeGeminiChanges(clickHandler);
        expect(geminiInjector.observer).toBeTruthy();
        
        
        const toolbox = geminiInjector.findToolboxDrawer();
        const parent = toolbox.parentNode;
        parent.removeChild(toolbox);
        
        
        setTimeout(() => {
            parent.appendChild(toolbox);
        }, 10);
        
        
        
        expect(geminiInjector.observer).toBeTruthy();
    });
    
    it('should handle multiple dice with animation', async () => {
        dicePopup = new DicePopup();
        
        dicePopup.show();
        const formatInput = document.getElementById('dice-format');
        formatInput.value = '4d6';
        dicePopup.validateInput();
        
        
        const originalShowEnhanced = dicePopup.showEnhancedAnimation;
        let animationCalled = false;
        dicePopup.showEnhancedAnimation = async (container, parsed, result) => {
            animationCalled = true;
            expect(parsed.count).toBe(4);
            expect(parsed.sides).toBe(6);
            expect(result.selectedRolls.length).toBe(4);
            return Promise.resolve();
        };
        
        await dicePopup.rollDice();
        
        expect(animationCalled).toBeTruthy();
        expect(dicePopup.lastResult.selectedRolls.length).toBe(4);
        
        
        dicePopup.showEnhancedAnimation = originalShowEnhanced;
    });
    
    it('should handle security status reporting', () => {
        const rollEngine = new RollEngine();
        const status = rollEngine.getSecurityStatus();
        
        expect(typeof status).toBe('string');
        expect(status.length).toBeGreaterThan(0);
        
        
        const result = rollEngine.roll('1d6', 'normal');
        expect(typeof result.isSecure).toBe('boolean');
        
        
        if (!result.isSecure) {
            const chatText = rollEngine.formatForChat(result);
            expect(chatText).toContain('menos segura');
        }
    });
    
    it('should handle cleanup properly', () => {
        dicePopup = new DicePopup();
        geminiInjector = new GeminiInjector();
        
        
        dicePopup.show();
        geminiInjector.injectDiceButton(() => {});
        
        
        expect(document.getElementById('dice-popup-overlay')).toBeTruthy();
        expect(geminiInjector.diceButton).toBeTruthy();
        
        
        dicePopup.cleanup();
        geminiInjector.cleanup();
        
        
        expect(document.getElementById('dice-popup-overlay')).toBeFalsy();
        expect(geminiInjector.diceButton).toBeFalsy();
        expect(geminiInjector.isInjected).toBeFalsy();
    });
});