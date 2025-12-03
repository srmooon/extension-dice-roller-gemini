
class ExtensionPopup {
    constructor() {
        this.currentRollType = 'normal';
        this.lastResult = null;
        this.rollEngine = null;
        this.errorHandler = null;
        this.storageKey = 'diceRollerState';
        this.autoInsert = true;
        
        this.init();
    }

    
    init() {
        try {
            
            this.rollEngine = new RollEngine();
            this.errorHandler = new ErrorHandler();
            
            
            this.loadState();
            
            
            this.bindEvents();
            
            
            this.updateSecurityStatus();
            
            console.log('🎲 Extension popup initialized');
        } catch (error) {
            console.error('🎲 Extension popup initialization failed:', error);
        }
    }

    
    bindEvents() {
        
        const diceFormatInput = document.getElementById('dice-format');
        diceFormatInput.addEventListener('input', () => {
            this.validateInput();
            this.saveState();
        });
        diceFormatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.rollDice();
            }
        });

        
        document.querySelectorAll('.example').forEach(example => {
            example.addEventListener('click', () => {
                diceFormatInput.value = example.dataset.format;
                this.validateInput();
                diceFormatInput.focus();
            });
        });

        
        document.querySelectorAll('.roll-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setRollType(btn.dataset.type);
                this.saveState();
            });
        });

        
        document.getElementById('roll-dice').addEventListener('click', () => this.rollDice());
        
        
        const insertBtn = document.getElementById('insert-gemini');
        if (insertBtn) {
            insertBtn.addEventListener('click', () => this.insertIntoGemini());
        }
        
        const copyBtn = document.getElementById('copy-result');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyToClipboard());
        }
        
        
        const autoInsertCheckbox = document.getElementById('auto-insert');
        if (autoInsertCheckbox) {
            autoInsertCheckbox.addEventListener('change', (e) => {
                this.autoInsert = e.target.checked;
                this.saveState();
            });
        }
    }

    
    validateInput() {
        const input = document.getElementById('dice-format');
        const rollButton = document.getElementById('roll-dice');
        const value = input.value.trim();

        this.clearErrors();

        if (!value) {
            rollButton.disabled = true;
            return false;
        }

        const isValid = this.rollEngine.parser.validate(value);
        rollButton.disabled = !isValid;

        if (!isValid && value) {
            this.errorHandler.handleValidationError(value, this.rollEngine.parser, 
                document.getElementById('error-container'));
        }

        return isValid;
    }

    
    setRollType(type) {
        this.currentRollType = type;

        
        document.querySelectorAll('.roll-type-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });

        
        const descriptions = {
            normal: 'Rolagem normal',
            advantage: 'Rola dois dados e pega o maior resultado',
            disadvantage: 'Rola dois dados e pega o menor resultado'
        };

        document.getElementById('roll-type-desc').textContent = descriptions[type];
    }

    
    async rollDice() {
        if (!this.validateInput()) {
            return;
        }

        const diceFormat = document.getElementById('dice-format').value.trim();
        const rollButton = document.getElementById('roll-dice');
        const animationContainer = document.getElementById('dice-animation-container');

        try {
            
            rollButton.disabled = true;
            rollButton.textContent = 'Rolando...';

            
            this.hideResult();
            this.clearErrors();

            
            this.showRollingAnimation(animationContainer);

            
            await this.sleep(1500);

            
            const result = this.rollEngine.roll(diceFormat, this.currentRollType);
            this.lastResult = result;

            
            this.showResult(result);
            
            
            this.saveState();

            
            this.hideRollingAnimation(animationContainer);
            
            
            if (this.autoInsert) {
                setTimeout(() => {
                    this.insertIntoGeminiAndSend();
                }, 500); 
            }

        } catch (error) {
            this.errorHandler.handleRuntimeError(error, document.getElementById('error-container'));
            this.hideRollingAnimation(animationContainer);
        } finally {
            
            rollButton.disabled = false;
            rollButton.textContent = 'Rolar Dados';
        }
    }

    
    showRollingAnimation(container) {
        container.innerHTML = `
            <div class="animation-placeholder">
                <div class="dice-icon" style="animation: spin 0.5s linear infinite;">🎲</div>
                <p>Rolando dados...</p>
            </div>
        `;
        
        
        if (!document.getElementById('spin-animation')) {
            const style = document.createElement('style');
            style.id = 'spin-animation';
            style.textContent = `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    
    hideRollingAnimation(container) {
        container.innerHTML = `
            <div class="animation-placeholder">
                <div class="dice-icon">🎲</div>
                <p>Clique em "Rolar" para rolar novamente</p>
            </div>
        `;
    }

    
    showResult(result) {
        document.getElementById('result-number').textContent = result.finalResult;
        document.getElementById('result-explanation').textContent = result.explanation;
        
        document.querySelector('.result-section').classList.remove('hidden');
        
        
        const insertBtn = document.getElementById('insert-gemini');
        const copyBtn = document.getElementById('copy-result');
        
        if (insertBtn) {
            insertBtn.classList.remove('hidden');
            insertBtn.disabled = false;
        }
        
        if (copyBtn) {
            copyBtn.classList.remove('hidden');
            copyBtn.disabled = false;
        }
    }

    
    hideResult() {
        document.querySelector('.result-section').classList.add('hidden');
        
        
        const insertBtn = document.getElementById('insert-gemini');
        const copyBtn = document.getElementById('copy-result');
        
        if (insertBtn) {
            insertBtn.classList.add('hidden');
            insertBtn.disabled = true;
        }
        
        if (copyBtn) {
            copyBtn.classList.add('hidden');
            copyBtn.disabled = true;
        }
    }

    
    clearErrors() {
        this.errorHandler.clearError(document.getElementById('error-container'));
    }

    
    updateSecurityStatus() {
        const statusElement = document.getElementById('security-status');
        if (statusElement && this.rollEngine) {
            const statusText = this.rollEngine.getSecurityStatus();
            statusElement.innerHTML = `<small>${statusText}</small>`;
        }
    }

    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    
    saveState() {
        try {
            const state = {
                diceFormat: document.getElementById('dice-format').value,
                rollType: this.currentRollType,
                lastResult: this.lastResult,
                autoInsert: this.autoInsert,
                timestamp: Date.now()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (error) {
            console.warn('🎲 Could not save state:', error);
        }
    }

    
    loadState() {
        try {
            const savedState = localStorage.getItem(this.storageKey);
            if (savedState) {
                const state = JSON.parse(savedState);
                
                
                if (Date.now() - state.timestamp < 24 * 60 * 60 * 1000) {
                    
                    if (state.diceFormat) {
                        document.getElementById('dice-format').value = state.diceFormat;
                        this.validateInput();
                    }
                    
                    
                    if (state.rollType) {
                        this.setRollType(state.rollType);
                    }
                    
                    
                    if (state.lastResult) {
                        this.lastResult = state.lastResult;
                        this.showResult(state.lastResult);
                    }
                    
                    
                    if (typeof state.autoInsert === 'boolean') {
                        this.autoInsert = state.autoInsert;
                        const checkbox = document.getElementById('auto-insert');
                        if (checkbox) {
                            checkbox.checked = state.autoInsert;
                        }
                    }
                    
                    console.log('🎲 State restored from previous session');
                }
            }
        } catch (error) {
            console.warn('🎲 Could not load state:', error);
        }
    }

    
    async insertIntoGemini() {
        if (!this.lastResult) {
            this.showError('Nenhum resultado para inserir no Gemini');
            return;
        }

        try {
            
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('gemini.google.com')) {
                
                chrome.tabs.create({ url: 'https://gemini.google.com' });
                this.showSuccess('Abrindo Gemini... Role os dados novamente lá!');
                return;
            }

            
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'insertDiceResult',
                result: this.lastResult,
                formattedText: this.formatResultForGemini(this.lastResult),
                autoSend: false
            });

            if (response && response.success) {
                this.showSuccess('Resultado inserido no Gemini!');
                
                setTimeout(() => window.close(), 1000);
            } else {
                this.showError('Erro ao inserir no Gemini. Tente usar Ctrl+C para copiar.');
            }

        } catch (error) {
            console.error('🎲 Error inserting into Gemini:', error);
            this.showError('Erro ao comunicar com o Gemini. Tente copiar o resultado.');
        }
    }

    
    async insertIntoGeminiAndSend() {
        if (!this.lastResult) {
            this.showError('Nenhum resultado para inserir no Gemini');
            return;
        }

        try {
            
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('gemini.google.com')) {
                
                chrome.tabs.create({ url: 'https://gemini.google.com' });
                this.showSuccess('Abrindo Gemini... Role os dados novamente lá!');
                return;
            }

            
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'insertDiceResult',
                result: this.lastResult,
                formattedText: this.formatResultForGemini(this.lastResult),
                autoSend: true
            });

            if (response && response.success) {
                this.showSuccess('Resultado inserido e enviado no Gemini!');
                
                setTimeout(() => window.close(), 1500);
            } else {
                this.showError('Erro ao inserir no Gemini. Tente usar Ctrl+C para copiar.');
            }

        } catch (error) {
            console.error('🎲 Error inserting into Gemini:', error);
            this.showError('Erro ao comunicar com o Gemini. Tente copiar o resultado.');
        }
    }

    
    formatResultForGemini(result) {
        let text = `🎲 ${result.format}: ${result.finalResult}`;
        
        if (result.rollType === 'advantage') {
            text += ' (Vantagem)';
        } else if (result.rollType === 'disadvantage') {
            text += ' (Desvantagem)';
        }
        
        text += `\n${result.explanation}`;
        return text;
    }

    
    async copyToClipboard() {
        if (!this.lastResult) {
            this.showError('Nenhum resultado para copiar');
            return;
        }

        try {
            const text = this.formatResultForGemini(this.lastResult);
            await navigator.clipboard.writeText(text);
            this.showSuccess('Resultado copiado! Cole no Gemini com Ctrl+V');
        } catch (error) {
            console.error('🎲 Error copying to clipboard:', error);
            this.showError('Erro ao copiar. Tente selecionar o texto manualmente.');
        }
    }

    
    showSuccess(message) {
        const container = document.getElementById('error-container');
        container.innerHTML = `<div class="dice-success-message">${message}</div>`;
        setTimeout(() => {
            container.innerHTML = '';
        }, 3000);
    }

    
    showError(message) {
        const container = document.getElementById('error-container');
        container.innerHTML = `<div class="dice-error-message">${message}</div>`;
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new ExtensionPopup();
});