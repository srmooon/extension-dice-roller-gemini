
class DicePopup {
    constructor() {
        this.isVisible = false;
        this.lastResult = null;
        this.rollEngine = null;
        this.errorHandler = null;
        this.geminiInjector = null;
        this.autoInsert = true;
        this.storageKey = 'diceRollerGeminiState';
        this.i18n = new I18n();
        
        
        
        this.dice1 = { rollType: 'normal', modifier: 'none' };
        this.dice2 = { rollType: 'normal', modifier: 'none' };
        this.dice3 = { rollType: 'normal', modifier: 'none' };
        this.dice4 = { rollType: 'normal', modifier: 'none' };
        
        this.dice5 = { rollType: 'normal' };
        this.dice6 = { rollType: 'normal' };
        this.dice7 = { rollType: 'normal' };
        this.dice8 = { rollType: 'normal' };
        
        this.initializeComponents();
        this.createPopupHTML();
        this.updateUILanguage();
        this.bindEvents();
        this.updateSecurityStatus();
        this.loadState();
    }

    
    initializeComponents() {
        this.rollEngine = new RollEngine();
        this.errorHandler = new ErrorHandler();
        this.geminiInjector = new GeminiInjector();
    }

    
    createPopupHTML() {
        
        const existingPopup = document.getElementById('dice-popup-overlay');
        if (existingPopup) {
            existingPopup.remove();
        }

        
        const popupHTML = `
            <div id="dice-popup-overlay" class="popup-overlay hidden">
                <div id="dice-popup-container" class="popup-container">
                    <div class="popup-header">
                        <h3>🎲 Rolar Dados</h3>
                        <div class="header-buttons">
                            <button id="info-button" class="info-button" title="Ajuda"></button>
                            <button id="close-popup" class="close-button">&times;</button>
                        </div>
                    </div>
                    
                    <div class="popup-content">
                        <!-- SEÇÃO PLAYER -->
                        <div class="category-section">
                            <h3 class="category-title">👤 PLAYER</h3>
                            
                            <!-- DADO 1 -->
                            <div class="dice-config-section dice-1-section">
                            <h4 class="dice-section-title">🎲 Dado 1</h4>
                            
                            <div class="input-section">
                                <label for="dice-format">Formato:</label>
                                <input type="text" id="dice-format" placeholder="Ex: 2d6, 1d20+5" autocomplete="off">
                            </div>

                            <div class="roll-type-section">
                                <label>Tipo de Rolagem:</label>
                                <div class="roll-type-buttons">
                                    <button class="roll-type-btn active" data-type="normal" data-dice="1">Normal</button>
                                    <button class="roll-type-btn" data-type="advantage" data-dice="1">Vantagem</button>
                                    <button class="roll-type-btn" data-type="disadvantage" data-dice="1">Desvantagem</button>
                                </div>
                            </div>

                            <div class="modifier-section">
                                <label>Modificador:</label>
                                <div class="modifier-buttons">
                                    <button class="modifier-btn active" data-modifier="none" data-dice="1">Nenhum</button>
                                    <button class="modifier-btn" data-modifier="lucky" data-dice="1">🍀 Sortudo</button>
                                    <button class="modifier-btn" data-modifier="unlucky" data-dice="1">💀 Azarado</button>
                                </div>
                            </div>
                        </div>

                        <!-- DADO 2 -->
                        <div class="dice-config-section dice-2-section">
                            <h4 class="dice-section-title">🎲 Dado 2 (Opcional)</h4>
                            
                            <div class="input-section">
                                <label for="dice-format-2">Formato:</label>
                                <input type="text" id="dice-format-2" placeholder="Ex: 1d6, 1d4+2" autocomplete="off">
                            </div>

                            <div class="roll-type-section">
                                <label>Tipo de Rolagem:</label>
                                <div class="roll-type-buttons">
                                    <button class="roll-type-btn active" data-type="normal" data-dice="2">Normal</button>
                                    <button class="roll-type-btn" data-type="advantage" data-dice="2">Vantagem</button>
                                    <button class="roll-type-btn" data-type="disadvantage" data-dice="2">Desvantagem</button>
                                </div>
                            </div>

                            <div class="modifier-section">
                                <label>Modificador:</label>
                                <div class="modifier-buttons">
                                    <button class="modifier-btn active" data-modifier="none" data-dice="2">Nenhum</button>
                                    <button class="modifier-btn" data-modifier="lucky" data-dice="2">🍀 Sortudo</button>
                                    <button class="modifier-btn" data-modifier="unlucky" data-dice="2">💀 Azarado</button>
                                </div>
                            </div>
                        </div>

                        <!-- DADO 3 -->
                        <div class="dice-config-section dice-3-section">
                            <h4 class="dice-section-title">🎲 Dado 3 (Opcional)</h4>
                            
                            <div class="input-section">
                                <label for="dice-format-3">Formato:</label>
                                <input type="text" id="dice-format-3" placeholder="Ex: 1d6, 1d4+2" autocomplete="off">
                            </div>

                            <div class="roll-type-section">
                                <label>Tipo de Rolagem:</label>
                                <div class="roll-type-buttons">
                                    <button class="roll-type-btn active" data-type="normal" data-dice="3">Normal</button>
                                    <button class="roll-type-btn" data-type="advantage" data-dice="3">Vantagem</button>
                                    <button class="roll-type-btn" data-type="disadvantage" data-dice="3">Desvantagem</button>
                                </div>
                            </div>

                            <div class="modifier-section">
                                <label>Modificador:</label>
                                <div class="modifier-buttons">
                                    <button class="modifier-btn active" data-modifier="none" data-dice="3">Nenhum</button>
                                    <button class="modifier-btn" data-modifier="lucky" data-dice="3">🍀 Sortudo</button>
                                    <button class="modifier-btn" data-modifier="unlucky" data-dice="3">💀 Azarado</button>
                                </div>
                            </div>
                        </div>

                        <!-- DADO 4 -->
                        <div class="dice-config-section dice-4-section">
                            <h4 class="dice-section-title">🎲 Dado 4 (Opcional)</h4>
                            
                            <div class="input-section">
                                <label for="dice-format-4">Formato:</label>
                                <input type="text" id="dice-format-4" placeholder="Ex: 1d6, 1d4+2" autocomplete="off">
                            </div>

                            <div class="roll-type-section">
                                <label>Tipo de Rolagem:</label>
                                <div class="roll-type-buttons">
                                    <button class="roll-type-btn active" data-type="normal" data-dice="4">Normal</button>
                                    <button class="roll-type-btn" data-type="advantage" data-dice="4">Vantagem</button>
                                    <button class="roll-type-btn" data-type="disadvantage" data-dice="4">Desvantagem</button>
                                </div>
                            </div>

                            <div class="modifier-section">
                                <label>Modificador:</label>
                                <div class="modifier-buttons">
                                    <button class="modifier-btn active" data-modifier="none" data-dice="4">Nenhum</button>
                                    <button class="modifier-btn" data-modifier="lucky" data-dice="4">🍀 Sortudo</button>
                                    <button class="modifier-btn" data-modifier="unlucky" data-dice="4">💀 Azarado</button>
                                </div>
                            </div>
                        </div>
                        </div>

                        <!-- SEÇÃO NPC -->
                        <div class="category-section">
                            <h3 class="category-title">🎭 NPC</h3>
                            
                            <!-- DADO 5 (NPC 1) -->
                            <div class="dice-config-section dice-5-section">
                                <h4 class="dice-section-title">🎲 Dado 5</h4>
                                
                                <div class="input-section">
                                    <label for="dice-format-5">Formato:</label>
                                    <input type="text" id="dice-format-5" placeholder="Ex: 2d6, 1d20+5" autocomplete="off">
                                </div>

                                <div class="roll-type-section">
                                    <label>Tipo de Rolagem:</label>
                                    <div class="roll-type-buttons">
                                        <button class="roll-type-btn active" data-type="normal" data-dice="5">Normal</button>
                                        <button class="roll-type-btn" data-type="advantage" data-dice="5">Vantagem</button>
                                        <button class="roll-type-btn" data-type="disadvantage" data-dice="5">Desvantagem</button>
                                    </div>
                                </div>
                            </div>

                            <!-- DADO 6 (NPC 2) -->
                            <div class="dice-config-section dice-6-section">
                                <h4 class="dice-section-title">🎲 Dado 6 (Opcional)</h4>
                                
                                <div class="input-section">
                                    <label for="dice-format-6">Formato:</label>
                                    <input type="text" id="dice-format-6" placeholder="Ex: 1d6, 1d4+2" autocomplete="off">
                                </div>

                                <div class="roll-type-section">
                                    <label>Tipo de Rolagem:</label>
                                    <div class="roll-type-buttons">
                                        <button class="roll-type-btn active" data-type="normal" data-dice="6">Normal</button>
                                        <button class="roll-type-btn" data-type="advantage" data-dice="6">Vantagem</button>
                                        <button class="roll-type-btn" data-type="disadvantage" data-dice="6">Desvantagem</button>
                                    </div>
                                </div>
                            </div>

                            <!-- DADO 7 (NPC 3) -->
                            <div class="dice-config-section dice-7-section">
                                <h4 class="dice-section-title">🎲 Dado 7 (Opcional)</h4>
                                
                                <div class="input-section">
                                    <label for="dice-format-7">Formato:</label>
                                    <input type="text" id="dice-format-7" placeholder="Ex: 1d6, 1d4+2" autocomplete="off">
                                </div>

                                <div class="roll-type-section">
                                    <label>Tipo de Rolagem:</label>
                                    <div class="roll-type-buttons">
                                        <button class="roll-type-btn active" data-type="normal" data-dice="7">Normal</button>
                                        <button class="roll-type-btn" data-type="advantage" data-dice="7">Vantagem</button>
                                        <button class="roll-type-btn" data-type="disadvantage" data-dice="7">Desvantagem</button>
                                    </div>
                                </div>
                            </div>

                            <!-- DADO 8 (NPC 4) -->
                            <div class="dice-config-section dice-8-section">
                                <h4 class="dice-section-title">🎲 Dado 8 (Opcional)</h4>
                                
                                <div class="input-section">
                                    <label for="dice-format-8">Formato:</label>
                                    <input type="text" id="dice-format-8" placeholder="Ex: 1d6, 1d4+2" autocomplete="off">
                                </div>

                                <div class="roll-type-section">
                                    <label>Tipo de Rolagem:</label>
                                    <div class="roll-type-buttons">
                                        <button class="roll-type-btn active" data-type="normal" data-dice="8">Normal</button>
                                        <button class="roll-type-btn" data-type="advantage" data-dice="8">Vantagem</button>
                                        <button class="roll-type-btn" data-type="disadvantage" data-dice="8">Desvantagem</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="auto-insert-section">
                            <label class="checkbox-container">
                                <input type="checkbox" id="auto-insert" checked>
                                <span class="checkmark"></span>
                                Inserir automaticamente no chat e enviar
                            </label>
                        </div>

                        <div class="language-section">
                            <label for="language-select" id="language-label">Idioma:</label>
                            <select id="language-select" class="language-select">
                                <option value="pt-BR">Português (PT-BR)</option>
                                <option value="en-US">English (EN-US)</option>
                            </select>
                            <div class="language-warning hidden" id="language-warning">
                                <small id="language-warning-text">Idioma alterado! Recarregue a página para aplicar as mudanças.</small>
                                <button id="reload-page-btn" class="reload-button">Recarregar Página</button>
                            </div>
                        </div>

                        <div class="result-section hidden">
                            <div class="result-display">
                                <div class="result-number" id="result-number">0</div>
                                <div class="result-explanation" id="result-explanation"></div>
                            </div>
                        </div>

                        <div class="error-container" id="error-container">
                            <!-- Error messages will appear here -->
                        </div>
                    </div>

                    <div class="popup-footer">
                        <div class="footer-left">
                            <button id="clear-all" class="clear-button" title="Limpar todos os campos">🗑️ Limpar Tudo</button>
                            <div class="security-status" id="security-status">
                                <small>Carregando...</small>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <button id="roll-dice" class="roll-button" disabled>Rolar Dados</button>
                            <button id="insert-result" class="insert-button hidden" disabled>Inserir no Chat</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- POPUP DE AJUDA -->
            <div id="help-popup-overlay" class="help-popup-overlay hidden">
                <div class="help-popup-container">
                    <div class="help-popup-header">
                        <h3>ℹ️ <span id="help-title">Ajuda - Como Usar</span></h3>
                        <button id="close-help-popup" class="close-button">&times;</button>
                    </div>
                    <div class="help-popup-content">
                        <div class="help-section">
                            <h4 id="help-format-title">📝 Formatos de Dados</h4>
                            <ul id="help-format-list">
                                <li><code>1d20</code> - Rola 1 dado de 20 lados</li>
                                <li><code>2d6</code> - Rola 2 dados de 6 lados</li>
                                <li><code>3d6</code> - Rola 3 dados de 6 lados (GURPS)</li>
                                <li><code>1d8+3</code> - Rola 1d8 e adiciona 3</li>
                                <li><code>4d6-2</code> - Rola 4d6 e subtrai 2</li>
                            </ul>
                        </div>
                        
                        <div class="help-section">
                            <h4 id="help-rolltype-title">🎲 Tipos de Rolagem</h4>
                            <ul id="help-rolltype-list">
                                <li><strong id="help-normal">Normal:</strong> <span id="help-normal-desc">Rolagem padrão</span></li>
                                <li><strong id="help-advantage">Vantagem:</strong> <span id="help-advantage-desc">Rola 2 dados e pega o maior</span></li>
                                <li><strong id="help-disadvantage">Desvantagem:</strong> <span id="help-disadvantage-desc">Rola 2 dados e pega o menor</span></li>
                            </ul>
                        </div>
                        
                        <div class="help-section">
                            <h4 id="help-modifier-title">✨ Modificadores</h4>
                            <ul id="help-modifier-list">
                                <li><strong id="help-none">Nenhum:</strong> <span id="help-none-desc">Sem modificador</span></li>
                                <li><strong id="help-lucky">🍀 Sortudo:</strong> <span id="help-lucky-desc">Garante resultados nos 70% superiores (d6: 4-6, d20: 14-20)</span></li>
                                <li><strong id="help-unlucky">💀 Azarado:</strong> <span id="help-unlucky-desc">Garante resultados nos 30% inferiores (d6: 1-3, d20: 1-6)</span></li>
                            </ul>
                        </div>
                        
                        <div class="help-section">
                            <h4 id="help-player-title">👤 PLAYER (Dados 1 e 2)</h4>
                            <p id="help-player-desc">Dados do jogador com todos os modificadores disponíveis:</p>
                            <ul id="help-player-list">
                                <li>Vantagem, Desvantagem ou Normal</li>
                                <li>Modificadores: Sortudo (70% superiores) ou Azarado (30% inferiores)</li>
                                <li>Pelo menos o Dado 1 OU Dado 5 deve estar preenchido</li>
                            </ul>
                        </div>
                        
                        <div class="help-section">
                            <h4 id="help-npc-title">🎭 NPC (Dados 3 e 4)</h4>
                            <p id="help-npc-desc">Dados de NPCs/Inimigos sem modificadores especiais:</p>
                            <ul id="help-npc-list">
                                <li>Apenas Vantagem, Desvantagem ou Normal</li>
                                <li>Sem modificadores Sortudo/Azarado</li>
                                <li>Resultados aparecem separados dos dados do Player</li>
                            </ul>
                        </div>
                        <div style="height: 60px;"></div>
                    </div>
                </div>
            </div>
        `;

        
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }

    
    updateUILanguage() {
        
        const title = document.querySelector('.popup-header h3');
        if (title) title.textContent = `🎲 ${this.i18n.t('popupTitle')}`;
        
        
        // Títulos das categorias
        const categoryTitles = document.querySelectorAll('.category-title');
        if (categoryTitles[0]) categoryTitles[0].textContent = `👤 ${this.i18n.t('playerCategory')}`;
        if (categoryTitles[1]) categoryTitles[1].textContent = `🎭 ${this.i18n.t('npcCategory')}`;

        // Títulos dos dados
        const dice1Title = document.querySelector('.dice-1-section .dice-section-title');
        if (dice1Title) dice1Title.textContent = `🎲 ${this.i18n.t('dice1Title')}`;
        
        const dice2Title = document.querySelector('.dice-2-section .dice-section-title');
        if (dice2Title) dice2Title.textContent = `🎲 ${this.i18n.t('dice2Title')}`;

        const dice3Title = document.querySelector('.dice-3-section .dice-section-title');
        if (dice3Title) dice3Title.textContent = `🎲 ${this.i18n.t('dice3Title')}`;

        const dice4Title = document.querySelector('.dice-4-section .dice-section-title');
        if (dice4Title) dice4Title.textContent = `🎲 ${this.i18n.t('dice4Title')}`;

        const dice5Title = document.querySelector('.dice-5-section .dice-section-title');
        if (dice5Title) dice5Title.textContent = `🎲 ${this.i18n.t('dice5Title')}`;

        const dice6Title = document.querySelector('.dice-6-section .dice-section-title');
        if (dice6Title) dice6Title.textContent = `🎲 ${this.i18n.t('dice6Title')}`;

        const dice7Title = document.querySelector('.dice-7-section .dice-section-title');
        if (dice7Title) dice7Title.textContent = `🎲 ${this.i18n.t('dice7Title')}`;

        const dice8Title = document.querySelector('.dice-8-section .dice-section-title');
        if (dice8Title) dice8Title.textContent = `🎲 ${this.i18n.t('dice8Title')}`;
        
        
        document.querySelectorAll('.input-section > label').forEach(label => {
            const forAttr = label.getAttribute('for');
            if (forAttr && forAttr.startsWith('dice-format')) {
                label.textContent = this.i18n.t('format');
            }
        });
        
        
        document.querySelectorAll('.roll-type-section > label').forEach(label => {
            label.textContent = this.i18n.t('rollType');
        });
        
        
        document.querySelectorAll('.modifier-section > label').forEach(label => {
            label.textContent = this.i18n.t('modifier');
        });
        
        
        const rollTypeBtns = document.querySelectorAll('.roll-type-btn');
        rollTypeBtns.forEach(btn => {
            const type = btn.dataset.type;
            btn.textContent = this.i18n.t(type);
        });
        
        
        const modifierBtns = document.querySelectorAll('.modifier-btn');
        modifierBtns.forEach(btn => {
            const modifier = btn.dataset.modifier;
            if (modifier === 'none') {
                btn.textContent = this.i18n.t('none');
            } else if (modifier === 'lucky') {
                btn.textContent = `🍀 ${this.i18n.t('lucky')}`;
            } else if (modifier === 'unlucky') {
                btn.textContent = `💀 ${this.i18n.t('unlucky')}`;
            }
        });
        
        
        const autoInsertLabel = document.querySelector('.auto-insert-section .checkbox-container');
        if (autoInsertLabel) {
            const checkbox = autoInsertLabel.querySelector('input');
            const checkmark = autoInsertLabel.querySelector('.checkmark');
            autoInsertLabel.innerHTML = '';
            autoInsertLabel.appendChild(checkbox);
            autoInsertLabel.appendChild(checkmark);
            const text = document.createTextNode(this.i18n.t('autoInsert'));
            autoInsertLabel.appendChild(text);
        }
        
        
        const luckyLabel = document.getElementById('lucky-dice-label');
        if (luckyLabel) luckyLabel.textContent = `🍀 ${this.i18n.t('luckyDice')}`;
        
        const luckyExplanation = document.getElementById('lucky-dice-explanation');
        if (luckyExplanation) luckyExplanation.textContent = this.i18n.t('luckyExplanation');
        
        
        const unluckyLabel = document.getElementById('unlucky-dice-label');
        if (unluckyLabel) unluckyLabel.textContent = `💀 ${this.i18n.t('unluckyDice')}`;
        
        const unluckyExplanation = document.getElementById('unlucky-dice-explanation');
        if (unluckyExplanation) unluckyExplanation.textContent = this.i18n.t('unluckyExplanation');
        
        
        const languageLabel = document.getElementById('language-label');
        if (languageLabel) languageLabel.textContent = this.i18n.t('language');
        
        const languageWarningText = document.getElementById('language-warning-text');
        if (languageWarningText) languageWarningText.textContent = this.i18n.t('languageChanged');
        
        const reloadBtn = document.getElementById('reload-page-btn');
        if (reloadBtn) reloadBtn.textContent = this.i18n.t('reloadPage');
        
        
        const rollButton = document.getElementById('roll-dice');
        if (rollButton && !rollButton.disabled) {
            rollButton.textContent = this.i18n.t('rollButton');
        }
        
        const insertButton = document.getElementById('insert-result');
        if (insertButton) insertButton.textContent = this.i18n.t('insertButton');

        const clearButton = document.getElementById('clear-all');
        if (clearButton) clearButton.textContent = `🗑️ ${this.i18n.t('clearButton')}`;
        
        
        const animationPlaceholder = document.querySelector('.animation-placeholder p');
        if (animationPlaceholder) {
            animationPlaceholder.textContent = this.i18n.t('clickToRoll');
        }
    }
    
    
    bindEvents() {
        
        document.getElementById('close-popup').addEventListener('click', () => this.hide());
        document.getElementById('dice-popup-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'dice-popup-overlay') {
                this.hide();
            }
        });

        
        document.getElementById('info-button').addEventListener('click', () => this.showHelp());
        document.getElementById('close-help-popup').addEventListener('click', () => this.hideHelp());
        document.getElementById('help-popup-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'help-popup-overlay') {
                this.hideHelp();
            }
        });

        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const helpOverlay = document.getElementById('help-popup-overlay');
                if (helpOverlay && !helpOverlay.classList.contains('hidden')) {
                    this.hideHelp();
                } else if (this.isVisible) {
                    this.hide();
                }
            }
        });

        
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

        
        const diceFormat2Input = document.getElementById('dice-format-2');
        if (diceFormat2Input) {
            diceFormat2Input.addEventListener('input', () => {
                this.validateInput();
                this.saveState();
            });
            diceFormat2Input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.rollDice();
                }
            });
        }

        
        const diceFormat3Input = document.getElementById('dice-format-3');
        if (diceFormat3Input) {
            diceFormat3Input.addEventListener('input', () => {
                this.validateInput();
                this.saveState();
            });
            diceFormat3Input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.rollDice();
                }
            });
        }

        
        const diceFormat4Input = document.getElementById('dice-format-4');
        if (diceFormat4Input) {
            diceFormat4Input.addEventListener('input', () => {
                this.validateInput();
                this.saveState();
            });
            diceFormat4Input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.rollDice();
                }
            });
        }

        const diceFormat5Input = document.getElementById('dice-format-5');
        if (diceFormat5Input) {
            diceFormat5Input.addEventListener('input', () => {
                this.validateInput();
                this.saveState();
            });
            diceFormat5Input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.rollDice();
                }
            });
        }

        const diceFormat6Input = document.getElementById('dice-format-6');
        if (diceFormat6Input) {
            diceFormat6Input.addEventListener('input', () => {
                this.validateInput();
                this.saveState();
            });
            diceFormat6Input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.rollDice();
                }
            });
        }

        const diceFormat7Input = document.getElementById('dice-format-7');
        if (diceFormat7Input) {
            diceFormat7Input.addEventListener('input', () => {
                this.validateInput();
                this.saveState();
            });
            diceFormat7Input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.rollDice();
                }
            });
        }

        const diceFormat8Input = document.getElementById('dice-format-8');
        if (diceFormat8Input) {
            diceFormat8Input.addEventListener('input', () => {
                this.validateInput();
                this.saveState();
            });
            diceFormat8Input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.rollDice();
                }
            });
        }

        
        document.querySelectorAll('.roll-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const diceNum = btn.dataset.dice;
                const type = btn.dataset.type;
                this.setRollType(type, diceNum);
                this.saveState();
            });
        });

        
        document.querySelectorAll('.modifier-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const diceNum = btn.dataset.dice;
                const modifier = btn.dataset.modifier;
                this.setModifier(modifier, diceNum);
                this.saveState();
            });
        });

        
        document.getElementById('roll-dice').addEventListener('click', () => this.rollDice());
        document.getElementById('insert-result').addEventListener('click', () => this.insertResult());
        document.getElementById('clear-all').addEventListener('click', () => this.clearAllFields());
        
        
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.i18n.getCurrentLanguage();
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
        
        
        const reloadBtn = document.getElementById('reload-page-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                window.location.reload();
            });
        }
        
        
        const autoInsertCheckbox = document.getElementById('auto-insert');
        if (autoInsertCheckbox) {
            autoInsertCheckbox.addEventListener('change', (e) => {
                this.autoInsert = e.target.checked;
                this.saveState();
            });
        }
    }

    
    show() {
        const overlay = document.getElementById('dice-popup-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.isVisible = true;
            
            
            setTimeout(() => {
                document.getElementById('dice-format').focus();
            }, 100);
        }
    }

    
    hide() {
        const overlay = document.getElementById('dice-popup-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            this.isVisible = false;
            this.clearErrors();
        }
    }

    
    validateInput() {
        const input = document.getElementById('dice-format');
        const input2 = document.getElementById('dice-format-2');
        const input3 = document.getElementById('dice-format-3');
        const input4 = document.getElementById('dice-format-4');
        const input5 = document.getElementById('dice-format-5');
        const input6 = document.getElementById('dice-format-6');
        const input7 = document.getElementById('dice-format-7');
        const input8 = document.getElementById('dice-format-8');
        const rollButton = document.getElementById('roll-dice');
        
        const value = input.value.trim();
        const value2 = input2 ? input2.value.trim() : '';
        const value3 = input3 ? input3.value.trim() : '';
        const value4 = input4 ? input4.value.trim() : '';
        const value5 = input5 ? input5.value.trim() : '';
        const value6 = input6 ? input6.value.trim() : '';
        const value7 = input7 ? input7.value.trim() : '';
        const value8 = input8 ? input8.value.trim() : '';

        this.clearErrors();

        
        if (!value && !value5) {
            rollButton.disabled = true;
            return false;
        }

        
        const isValid = !value || this.rollEngine.parser.validate(value);
        const isValid2 = !value2 || this.rollEngine.parser.validate(value2);
        const isValid3 = !value3 || this.rollEngine.parser.validate(value3);
        const isValid4 = !value4 || this.rollEngine.parser.validate(value4);
        const isValid5 = !value5 || this.rollEngine.parser.validate(value5);
        const isValid6 = !value6 || this.rollEngine.parser.validate(value6);
        const isValid7 = !value7 || this.rollEngine.parser.validate(value7);
        const isValid8 = !value8 || this.rollEngine.parser.validate(value8);

        rollButton.disabled = !(isValid && isValid2 && isValid3 && isValid4 && isValid5 && isValid6 && isValid7 && isValid8);

        
        if (!isValid && value) {
            this.errorHandler.handleValidationError(value, this.rollEngine.parser, 
                document.getElementById('error-container'));
        } else if (!isValid2 && value2) {
            this.errorHandler.handleValidationError(value2, this.rollEngine.parser, 
                document.getElementById('error-container'));
        } else if (!isValid3 && value3) {
            this.errorHandler.handleValidationError(value3, this.rollEngine.parser, 
                document.getElementById('error-container'));
        } else if (!isValid4 && value4) {
            this.errorHandler.handleValidationError(value4, this.rollEngine.parser, 
                document.getElementById('error-container'));
        } else if (!isValid5 && value5) {
            this.errorHandler.handleValidationError(value5, this.rollEngine.parser, 
                document.getElementById('error-container'));
        } else if (!isValid6 && value6) {
            this.errorHandler.handleValidationError(value6, this.rollEngine.parser, 
                document.getElementById('error-container'));
        } else if (!isValid7 && value7) {
            this.errorHandler.handleValidationError(value7, this.rollEngine.parser, 
                document.getElementById('error-container'));
        } else if (!isValid8 && value8) {
            this.errorHandler.handleValidationError(value8, this.rollEngine.parser, 
                document.getElementById('error-container'));
        }

        return isValid && isValid2 && isValid3 && isValid4 && isValid5 && isValid6 && isValid7 && isValid8;
    }

    
    setRollType(type, diceNum) {
        
        if (diceNum === '1') this.dice1.rollType = type;
        else if (diceNum === '2') this.dice2.rollType = type;
        else if (diceNum === '3') this.dice3.rollType = type;
        else if (diceNum === '4') this.dice4.rollType = type;
        else if (diceNum === '5') this.dice5.rollType = type;
        else if (diceNum === '6') this.dice6.rollType = type;
        else if (diceNum === '7') this.dice7.rollType = type;
        else if (diceNum === '8') this.dice8.rollType = type;

        
        document.querySelectorAll(`.roll-type-btn[data-dice="${diceNum}"]`).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
    }

    setModifier(modifier, diceNum) {
        
        
        if (diceNum === '1') this.dice1.modifier = modifier;
        else if (diceNum === '2') this.dice2.modifier = modifier;
        else if (diceNum === '3') this.dice3.modifier = modifier;
        else if (diceNum === '4') this.dice4.modifier = modifier;
        

        
        document.querySelectorAll(`.modifier-btn[data-dice="${diceNum}"]`).forEach(btn => {
            btn.classList.toggle('active', btn.dataset.modifier === modifier);
        });
    }

    
    async rollDice() {
        if (!this.validateInput()) {
            return;
        }

        const diceFormat = document.getElementById('dice-format').value.trim();
        const diceFormat2 = document.getElementById('dice-format-2').value.trim();
        const diceFormat3 = document.getElementById('dice-format-3').value.trim();
        const diceFormat4 = document.getElementById('dice-format-4').value.trim();
        const diceFormat5 = document.getElementById('dice-format-5').value.trim();
        const diceFormat6 = document.getElementById('dice-format-6').value.trim();
        const diceFormat7 = document.getElementById('dice-format-7').value.trim();
        const diceFormat8 = document.getElementById('dice-format-8').value.trim();
        const rollButton = document.getElementById('roll-dice');

        try {
            
            rollButton.disabled = true;
            rollButton.textContent = this.i18n.t('rolling');

            
            this.hideResult();
            this.clearErrors();

            
            let playerResults = [];
            if (diceFormat) {
                const isLucky1 = this.dice1.modifier === 'lucky';
                const isUnlucky1 = this.dice1.modifier === 'unlucky';
                const result1 = this.rollEngine.roll(diceFormat, this.dice1.rollType, isLucky1, isUnlucky1);
                result1.category = 'PLAYER';
                result1.diceNum = 1;
                playerResults.push(result1);
            }
            
            if (diceFormat2) {
                const isLucky2 = this.dice2.modifier === 'lucky';
                const isUnlucky2 = this.dice2.modifier === 'unlucky';
                const result2 = this.rollEngine.roll(diceFormat2, this.dice2.rollType, isLucky2, isUnlucky2);
                result2.category = 'PLAYER';
                result2.diceNum = 2;
                playerResults.push(result2);
            }

            if (diceFormat3) {
                const isLucky3 = this.dice3.modifier === 'lucky';
                const isUnlucky3 = this.dice3.modifier === 'unlucky';
                const result3 = this.rollEngine.roll(diceFormat3, this.dice3.rollType, isLucky3, isUnlucky3);
                result3.category = 'PLAYER';
                result3.diceNum = 3;
                playerResults.push(result3);
            }

            if (diceFormat4) {
                const isLucky4 = this.dice4.modifier === 'lucky';
                const isUnlucky4 = this.dice4.modifier === 'unlucky';
                const result4 = this.rollEngine.roll(diceFormat4, this.dice4.rollType, isLucky4, isUnlucky4);
                result4.category = 'PLAYER';
                result4.diceNum = 4;
                playerResults.push(result4);
            }

            
            let npcResults = [];
            if (diceFormat5) {
                const result5 = this.rollEngine.roll(diceFormat5, this.dice5.rollType, false, false);
                result5.category = 'NPC';
                result5.diceNum = 5;
                npcResults.push(result5);
            }
            
            if (diceFormat6) {
                const result6 = this.rollEngine.roll(diceFormat6, this.dice6.rollType, false, false);
                result6.category = 'NPC';
                result6.diceNum = 6;
                npcResults.push(result6);
            }

            if (diceFormat7) {
                const result7 = this.rollEngine.roll(diceFormat7, this.dice7.rollType, false, false);
                result7.category = 'NPC';
                result7.diceNum = 7;
                npcResults.push(result7);
            }

            if (diceFormat8) {
                const result8 = this.rollEngine.roll(diceFormat8, this.dice8.rollType, false, false);
                result8.category = 'NPC';
                result8.diceNum = 8;
                npcResults.push(result8);
            }

            
            this.lastPlayerResults = playerResults;
            this.lastNpcResults = npcResults;

            
            await this.animateRolling(playerResults, npcResults);
            
            
            this.showResult(playerResults, npcResults);
            
            
            this.saveState();
            
            
            if (this.autoInsert) {
                setTimeout(() => {
                    this.insertResultAndSend();
                }, 500); 
            }

        } catch (error) {
            console.error('Dice roll error:', error);
            this.errorHandler.handleRuntimeError(error, document.getElementById('error-container'));
        } finally {
            
            rollButton.disabled = false;
            rollButton.textContent = this.i18n.t('rollButton');
        }
    }

    
    async showEnhancedAnimation(container, parsed, result, diceFormat2, result2) {
        try {
            
            if (this.diceRenderer && this.diceRenderer.isInitialized) {
                await this.diceRenderer.animateEnhancedRoll(parsed, result.selectedRolls);
            } else {
                
                await this.showEnhanced2DAnimation(container, parsed, result, diceFormat2, result2);
            }
        } catch (error) {
            console.warn('Animation error, using simple fallback:', error);
            await this.showSimpleAnimation(container);
        }
    }

    
    async showEnhanced2DAnimation(container, parsed, result, diceFormat2, result2) {
        return new Promise((resolve) => {
            
            container.innerHTML = '';

            
            const hasTwoDice = diceFormat2 && result2;
            const totalDice = hasTwoDice ? 2 : Math.min(parsed.count, 4);
            const diceElements = [];

            if (hasTwoDice) {
                
                container.style.cssText = `
                    min-height: 180px;
                    border: 2px dashed #e0e0e0;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #fafafa;
                    position: relative;
                    overflow: visible;
                    gap: 15px;
                    padding: 10px;
                `;
                
                
                const dice1Wrapper = document.createElement('div');
                dice1Wrapper.className = 'enhanced-dice-wrapper';
                dice1Wrapper.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    perspective: 200px;
                    width: 100%;
                    min-height: 60px;
                `;

                const dice1Element = document.createElement('div');
                dice1Element.className = 'enhanced-dice rolling';
                dice1Element.textContent = this.getDiceEmoji(parsed.sides);
                dice1Element.style.cssText = `
                    font-size: 32px;
                    transform-style: preserve-3d;
                    animation: enhancedRoll 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                    transition: all 0.3s ease;
                `;

                dice1Wrapper.appendChild(dice1Element);
                container.appendChild(dice1Wrapper);
                diceElements.push({ 
                    wrapper: dice1Wrapper, 
                    element: dice1Element, 
                    index: 0, 
                    result: result,
                    color: 'linear-gradient(135deg, #4285f4, #34a853)' 
                });

                
                const divider = document.createElement('div');
                divider.style.cssText = `
                    width: 80%;
                    height: 1px;
                    background: linear-gradient(to right, transparent, #e0e0e0, transparent);
                `;
                container.appendChild(divider);

                
                const parsed2 = this.rollEngine.parser.parse(diceFormat2);
                const dice2Wrapper = document.createElement('div');
                dice2Wrapper.className = 'enhanced-dice-wrapper';
                dice2Wrapper.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    perspective: 200px;
                    width: 100%;
                    min-height: 60px;
                `;

                const dice2Element = document.createElement('div');
                dice2Element.className = 'enhanced-dice rolling';
                dice2Element.textContent = this.getDiceEmoji(parsed2.sides);
                dice2Element.style.cssText = `
                    font-size: 32px;
                    transform-style: preserve-3d;
                    animation: enhancedRoll 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                    transition: all 0.3s ease;
                `;

                dice2Wrapper.appendChild(dice2Element);
                container.appendChild(dice2Wrapper);
                diceElements.push({ 
                    wrapper: dice2Wrapper, 
                    element: dice2Element, 
                    index: 0, 
                    result: result2,
                    color: 'linear-gradient(135deg, #ea4335, #fbbc04)' 
                });

            } else {
                
                for (let i = 0; i < totalDice; i++) {
                    const diceWrapper = document.createElement('div');
                    diceWrapper.className = 'enhanced-dice-wrapper';
                    diceWrapper.style.cssText = `
                        position: absolute;
                        left: ${20 + i * 60}px;
                        top: 50%;
                        transform: translateY(-50%);
                        perspective: 200px;
                    `;

                    const diceElement = document.createElement('div');
                    diceElement.className = 'enhanced-dice rolling';
                    diceElement.textContent = this.getDiceEmoji(parsed.sides);
                    diceElement.style.cssText = `
                        font-size: 32px;
                        transform-style: preserve-3d;
                        animation: enhancedRoll 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                        transition: all 0.3s ease;
                    `;

                    diceWrapper.appendChild(diceElement);
                    container.appendChild(diceWrapper);
                    diceElements.push({ 
                        wrapper: diceWrapper, 
                        element: diceElement, 
                        index: i,
                        result: result,
                        color: 'linear-gradient(135deg, #4285f4, #34a853)'
                    });
                }
            }

            
            this.addEnhancedAnimationCSS();

            
            setTimeout(() => {
                diceElements.forEach((dice, index) => {
                    setTimeout(() => {
                        const diceResult = dice.result;
                        if (diceResult && dice.index < diceResult.selectedRolls.length) {
                            const rollValue = diceResult.selectedRolls[dice.index];
                            dice.element.textContent = rollValue.toString();
                            dice.element.className = 'enhanced-dice result';
                            dice.element.style.cssText = `
                                font-size: 24px;
                                font-weight: bold;
                                background: ${dice.color};
                                color: white;
                                border-radius: 12px;
                                padding: 8px 12px;
                                min-width: 32px;
                                text-align: center;
                                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                                animation: resultReveal 0.5s ease-out;
                                transform: scale(1);
                            `;
                        }
                    }, index * 100);
                });

                
                setTimeout(resolve, diceElements.length * 100 + 500);
            }, 1800);
        });
    }

    
    async showSimpleAnimation(container) {
        return new Promise((resolve) => {
            this.showRollingAnimation(container);
            setTimeout(() => {
                this.hideRollingAnimation(container);
                resolve();
            }, 2000);
        });
    }

    
    getDiceEmoji(sides) {
        const emojiMap = {
            4: '🔺',
            6: '🎲',
            8: '🔶',
            10: '🔟',
            12: '⬢',
            20: '🎯',
            100: '💯'
        };
        return emojiMap[sides] || '🎲';
    }

    
    addEnhancedAnimationCSS() {
        if (document.getElementById('dice-enhanced-animation-css')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'dice-enhanced-animation-css';
        style.textContent = `
            @keyframes enhancedRoll {
                0% { 
                    transform: translateY(-80px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.5);
                    opacity: 0;
                }
                15% { 
                    transform: translateY(-60px) rotateX(180deg) rotateY(90deg) rotateZ(45deg) scale(1.2);
                    opacity: 1;
                }
                30% { 
                    transform: translateY(-40px) rotateX(360deg) rotateY(180deg) rotateZ(90deg) scale(0.8);
                }
                45% { 
                    transform: translateY(-60px) rotateX(540deg) rotateY(270deg) rotateZ(135deg) scale(1.1);
                }
                60% { 
                    transform: translateY(-30px) rotateX(720deg) rotateY(360deg) rotateZ(180deg) scale(0.9);
                }
                75% { 
                    transform: translateY(-40px) rotateX(900deg) rotateY(450deg) rotateZ(225deg) scale(1.05);
                }
                90% { 
                    transform: translateY(-10px) rotateX(1080deg) rotateY(540deg) rotateZ(270deg) scale(0.95);
                }
                100% { 
                    transform: translateY(0px) rotateX(1080deg) rotateY(540deg) rotateZ(360deg) scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes resultReveal {
                0% { 
                    transform: scale(0.3) rotateY(180deg);
                    opacity: 0;
                }
                50% { 
                    transform: scale(1.3) rotateY(90deg);
                    opacity: 0.7;
                }
                100% { 
                    transform: scale(1) rotateY(0deg);
                    opacity: 1;
                }
            }
            
            .enhanced-dice.rolling {
                animation-iteration-count: 1;
                animation-fill-mode: forwards;
            }
            
            .enhanced-dice.result {
                animation-iteration-count: 1;
                animation-fill-mode: forwards;
            }
            
            .enhanced-dice-wrapper:hover .enhanced-dice {
                transform: scale(1.1) !important;
                filter: brightness(1.1);
            }
        `;
        document.head.appendChild(style);
    }

    
    showRollingAnimation(container) {
        container.innerHTML = `
            <div class="animation-placeholder">
                <div class="dice-icon dice-rolling">🎲</div>
                <p>Rolando dados...</p>
            </div>
        `;
    }

    
    hideRollingAnimation(container) {
        container.innerHTML = `
            <div class="animation-placeholder">
                <div class="dice-icon">🎲</div>
                <p>Clique em "Rolar" para rolar novamente</p>
            </div>
        `;
    }

    
    async animateRolling(playerResults, npcResults) {
        
        document.querySelector('.result-section').classList.remove('hidden');
        
        const resultNumber = document.getElementById('result-number');
        resultNumber.classList.add('rolling');
        
        const duration = 2000; 
        const interval = 50; 
        const steps = duration / interval;
        
        for (let i = 0; i < steps; i++) {
            let animatedText = '';
            
            
            if (playerResults.length > 0) {
                const randomValues = playerResults.map(r => {
                    const max = parseInt(r.format.match(/d(\d+)/)?.[1] || 20);
                    return Math.floor(Math.random() * max) + 1;
                });
                animatedText += randomValues.join(' | ');
            }
            
            
            if (npcResults.length > 0) {
                if (animatedText) animatedText += '\n';
                const randomValues = npcResults.map(r => {
                    const max = parseInt(r.format.match(/d(\d+)/)?.[1] || 20);
                    return Math.floor(Math.random() * max) + 1;
                });
                animatedText += randomValues.join(' | ');
            }
            
            resultNumber.textContent = animatedText;
            
            
            await new Promise(resolve => setTimeout(resolve, interval));
        }
        
        
        resultNumber.classList.remove('rolling');
    }

    showResult(playerResults, npcResults) {
        let displayText = '';
        let explanationText = '';
        
        
        if (playerResults.length > 0) {
            const playerValues = playerResults.map(r => r.finalResult).join(' | ');
            displayText += playerValues;
            
            explanationText += '👤 PLAYER:\n';
            playerResults.forEach(r => {
                explanationText += `  ${r.format}: ${r.explanation}\n`;
            });
        }
        
        
        if (npcResults.length > 0) {
            if (displayText) displayText += '\n';
            const npcValues = npcResults.map(r => r.finalResult).join(' | ');
            displayText += npcValues;
            
            if (explanationText) explanationText += '\n';
            explanationText += '🎭 NPC:\n';
            npcResults.forEach(r => {
                explanationText += `  ${r.format}: ${r.explanation}\n`;
            });
        }
        
        document.getElementById('result-number').textContent = displayText;
        
        document.getElementById('result-explanation').textContent = '';
        
        document.querySelector('.result-section').classList.remove('hidden');
        document.getElementById('insert-result').classList.remove('hidden');
        document.getElementById('insert-result').disabled = false;
        
        
        setTimeout(() => {
            const popupContent = document.querySelector('.popup-content');
            if (popupContent) {
                popupContent.scrollTo({
                    top: popupContent.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 200);
    }

    
    hideResult() {
        document.querySelector('.result-section').classList.add('hidden');
        document.getElementById('insert-result').classList.add('hidden');
    }

    
    async insertResult() {
        if (!this.lastPlayerResults && !this.lastNpcResults) {
            this.errorHandler.showError('Nenhum resultado para inserir.', 
                document.getElementById('error-container'));
            return;
        }

        const insertButton = document.getElementById('insert-result');
        
        try {
            
            insertButton.disabled = true;
            insertButton.textContent = this.i18n.t('inserting');

            
            let chatText = '';
            
            
            if (this.lastPlayerResults && this.lastPlayerResults.length > 0) {
                chatText += '👤 PLAYER:\n';
                this.lastPlayerResults.forEach(result => {
                    chatText += this.formatResultForChat(result) + '\n';
                });
            }
            
            
            if (this.lastNpcResults && this.lastNpcResults.length > 0) {
                if (chatText) chatText += '\n';
                chatText += '🎭 NPC:\n';
                this.lastNpcResults.forEach(result => {
                    chatText += this.formatResultForChat(result) + '\n';
                });
            }
            
            
            const success = this.geminiInjector.insertText(chatText.trim());

            if (success) {
                
                insertButton.textContent = this.i18n.t('inserted');
                insertButton.style.background = '#34a853';
                
                
                setTimeout(() => {
                    this.hide();
                }, 1000);
                
            } else {
                throw new Error('Failed to insert text into chat');
            }

        } catch (error) {
            console.error('Insert result error:', error);
            this.errorHandler.showError('Erro ao inserir resultado no chat. Tente novamente.', 
                document.getElementById('error-container'));
            
            
            insertButton.textContent = this.i18n.t('insertButton');
            insertButton.style.background = '#34a853';
            insertButton.disabled = false;
        }
    }

    
    async insertResultAndSend() {
        if (!this.lastPlayerResults && !this.lastNpcResults) {
            return;
        }

        try {
            
            let chatText = '';
            
            
            if (this.lastPlayerResults && this.lastPlayerResults.length > 0) {
                chatText += '👤 PLAYER:\n';
                this.lastPlayerResults.forEach(result => {
                    chatText += this.formatResultForChat(result) + '\n';
                });
            }
            
            
            if (this.lastNpcResults && this.lastNpcResults.length > 0) {
                if (chatText) chatText += '\n';
                chatText += '🎭 NPC:\n';
                this.lastNpcResults.forEach(result => {
                    chatText += this.formatResultForChat(result) + '\n';
                });
            }
            
            
            const success = this.geminiInjector.insertText(chatText.trim());

            if (success) {
                console.log('🎲 Result inserted, attempting to send...');
                
                
                setTimeout(() => {
                    try {
                        
                        const sendButton = this.geminiInjector.findSendButton();
                        if (sendButton) {
                            sendButton.click();
                            console.log('🎲 Message sent automatically');
                            
                            
                            setTimeout(() => {
                                this.hide();
                            }, 1000);
                        } else {
                            console.warn('🎲 Send button not found, trying Enter key');
                            
                            const textInput = this.geminiInjector.findTextInput();
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
                                
                                
                                setTimeout(() => {
                                    this.hide();
                                }, 1000);
                            }
                        }
                    } catch (sendError) {
                        console.error('🎲 Error sending message:', sendError);
                    }
                }, 300); 
                
            } else {
                console.error('🎲 Failed to insert text for auto-send');
            }

        } catch (error) {
            console.error('🎲 Auto insert and send error:', error);
        }
    }

    
    formatResultForChat(result) {
        
        let typeText = '';
        if (result.rollType === 'advantage') {
            typeText = ` ${this.i18n.t('advantageType')}`;
        } else if (result.rollType === 'disadvantage') {
            typeText = ` ${this.i18n.t('disadvantageType')}`;
        }
        
        
        let modifierEmoji = '';
        if (result.isLucky) {
            modifierEmoji = ' 🍀';
        } else if (result.isUnlucky) {
            modifierEmoji = ' 💀';
        }
        
        
        let chatText = `🎲 ${result.format}${typeText}${modifierEmoji} ➜ ${this.i18n.t('result')}: ${result.finalResult}\n`;
        chatText += `📊 ${this.i18n.t('details')}: ${result.explanation}`;
        
        
        if (!result.isSecure) {
            chatText += ` ⚠️`;
        }
        
        return chatText;
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

    
    isPopupVisible() {
        return this.isVisible;
    }

    
    showHelp() {
        const helpOverlay = document.getElementById('help-popup-overlay');
        if (helpOverlay) {
            helpOverlay.classList.remove('hidden');
            this.updateHelpLanguage();
        }
    }

    
    hideHelp() {
        const helpOverlay = document.getElementById('help-popup-overlay');
        if (helpOverlay) {
            helpOverlay.classList.add('hidden');
        }
    }

    
    updateHelpLanguage() {
        const lang = this.i18n.getCurrentLanguage();
        
        if (lang === 'pt-BR') {
            document.getElementById('help-title').textContent = 'Ajuda - Como Usar';
            document.getElementById('help-format-title').textContent = '📝 Formatos de Dados';
            document.getElementById('help-rolltype-title').textContent = '🎲 Tipos de Rolagem';
            document.getElementById('help-modifier-title').textContent = '✨ Modificadores';
            document.getElementById('help-player-title').textContent = '👤 PLAYER (Dados 1 e 2)';
            document.getElementById('help-npc-title').textContent = '🎭 NPC (Dados 3 e 4)';
            
            document.getElementById('help-normal').textContent = 'Normal:';
            document.getElementById('help-normal-desc').textContent = 'Rolagem padrão';
            document.getElementById('help-advantage').textContent = 'Vantagem:';
            document.getElementById('help-advantage-desc').textContent = 'Rola 2 dados e pega o maior';
            document.getElementById('help-disadvantage').textContent = 'Desvantagem:';
            document.getElementById('help-disadvantage-desc').textContent = 'Rola 2 dados e pega o menor';
            
            document.getElementById('help-none').textContent = 'Nenhum:';
            document.getElementById('help-none-desc').textContent = 'Sem modificador';
            document.getElementById('help-lucky').textContent = '🍀 Sortudo:';
            document.getElementById('help-lucky-desc').textContent = 'Garante resultados nos 70% superiores (d6: 4-6, d20: 14-20)';
            document.getElementById('help-unlucky').textContent = '💀 Azarado:';
            document.getElementById('help-unlucky-desc').textContent = 'Garante resultados nos 30% inferiores (d6: 1-3, d20: 1-6)';
            
            document.getElementById('help-player-desc').textContent = 'Dados do jogador com todos os modificadores disponíveis:';
            document.getElementById('help-npc-desc').textContent = 'Dados de NPCs/Inimigos sem modificadores especiais:';
        } else {
            document.getElementById('help-title').textContent = 'Help - How to Use';
            document.getElementById('help-format-title').textContent = '📝 Dice Formats';
            document.getElementById('help-rolltype-title').textContent = '🎲 Roll Types';
            document.getElementById('help-modifier-title').textContent = '✨ Modifiers';
            document.getElementById('help-player-title').textContent = '👤 PLAYER (Dice 1 & 2)';
            document.getElementById('help-npc-title').textContent = '🎭 NPC (Dice 3 & 4)';
            
            document.getElementById('help-normal').textContent = 'Normal:';
            document.getElementById('help-normal-desc').textContent = 'Standard roll';
            document.getElementById('help-advantage').textContent = 'Advantage:';
            document.getElementById('help-advantage-desc').textContent = 'Roll 2 dice and take the higher';
            document.getElementById('help-disadvantage').textContent = 'Disadvantage:';
            document.getElementById('help-disadvantage-desc').textContent = 'Roll 2 dice and take the lower';
            
            document.getElementById('help-none').textContent = 'None:';
            document.getElementById('help-none-desc').textContent = 'No modifier';
            document.getElementById('help-lucky').textContent = '🍀 Lucky:';
            document.getElementById('help-lucky-desc').textContent = 'Guarantees results in top 70% (d6: 4-6, d20: 14-20)';
            document.getElementById('help-unlucky').textContent = '💀 Unlucky:';
            document.getElementById('help-unlucky-desc').textContent = 'Guarantees results in bottom 30% (d6: 1-3, d20: 1-6)';
            
            document.getElementById('help-player-desc').textContent = 'Player dice with all modifiers available:';
            document.getElementById('help-npc-desc').textContent = 'NPC/Enemy dice without special modifiers:';
        }
    }

    
    saveState() {
        try {
            const state = {
                diceFormat: document.getElementById('dice-format').value,
                diceFormat2: document.getElementById('dice-format-2').value,
                diceFormat3: document.getElementById('dice-format-3').value,
                diceFormat4: document.getElementById('dice-format-4').value,
                diceFormat5: document.getElementById('dice-format-5').value,
                diceFormat6: document.getElementById('dice-format-6').value,
                diceFormat7: document.getElementById('dice-format-7').value,
                diceFormat8: document.getElementById('dice-format-8').value,
                dice1: this.dice1,
                dice2: this.dice2,
                dice3: this.dice3,
                dice4: this.dice4,
                dice5: this.dice5,
                dice6: this.dice6,
                dice7: this.dice7,
                dice8: this.dice8,
                autoInsert: this.autoInsert,
                timestamp: Date.now()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (error) {
            console.warn('🎲 Could not save Gemini popup state:', error);
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
                    }
                    
                    if (state.diceFormat2) {
                        document.getElementById('dice-format-2').value = state.diceFormat2;
                    }
                    
                    if (state.diceFormat3) {
                        document.getElementById('dice-format-3').value = state.diceFormat3;
                    }
                    
                    if (state.diceFormat4) {
                        document.getElementById('dice-format-4').value = state.diceFormat4;
                    }

                    if (state.diceFormat5) {
                        document.getElementById('dice-format-5').value = state.diceFormat5;
                    }

                    if (state.diceFormat6) {
                        document.getElementById('dice-format-6').value = state.diceFormat6;
                    }

                    if (state.diceFormat7) {
                        document.getElementById('dice-format-7').value = state.diceFormat7;
                    }

                    if (state.diceFormat8) {
                        document.getElementById('dice-format-8').value = state.diceFormat8;
                    }
                    
                    this.validateInput();
                    
                    
                    
                    if (state.dice1) {
                        this.dice1 = state.dice1;
                        this.setRollType(state.dice1.rollType, '1');
                        this.setModifier(state.dice1.modifier, '1');
                    }
                    
                    
                    if (state.dice2) {
                        this.dice2 = state.dice2;
                        this.setRollType(state.dice2.rollType, '2');
                        this.setModifier(state.dice2.modifier, '2');
                    }
                    
                    
                    if (state.dice3) {
                        this.dice3 = state.dice3;
                        this.setRollType(state.dice3.rollType, '3');
                        if (state.dice3.modifier) {
                            this.setModifier(state.dice3.modifier, '3');
                        }
                    }
                    
                    
                    if (state.dice4) {
                        this.dice4 = state.dice4;
                        this.setRollType(state.dice4.rollType, '4');
                        if (state.dice4.modifier) {
                            this.setModifier(state.dice4.modifier, '4');
                        }
                    }

                    
                    if (state.dice5) {
                        this.dice5 = state.dice5;
                        this.setRollType(state.dice5.rollType, '5');
                    }

                    
                    if (state.dice6) {
                        this.dice6 = state.dice6;
                        this.setRollType(state.dice6.rollType, '6');
                    }

                    
                    if (state.dice7) {
                        this.dice7 = state.dice7;
                        this.setRollType(state.dice7.rollType, '7');
                    }

                    
                    if (state.dice8) {
                        this.dice8 = state.dice8;
                        this.setRollType(state.dice8.rollType, '8');
                    }
                    
                    
                    if (state.lastResult) {
                        this.lastResult = state.lastResult;
                        this.lastResult2 = state.lastResult2;
                        this.showResult(state.lastResult, state.lastResult2);
                    }
                    
                    
                    if (typeof state.autoInsert === 'boolean') {
                        this.autoInsert = state.autoInsert;
                        const checkbox = document.getElementById('auto-insert');
                        if (checkbox) {
                            checkbox.checked = state.autoInsert;
                        }
                    }
                    
                    console.log('🎲 Gemini popup state restored');
                }
            }
        } catch (error) {
            console.warn('🎲 Could not load Gemini popup state:', error);
        }
    }

    
    changeLanguage(lang) {
        this.i18n.setLanguage(lang);
        
        
        const warning = document.getElementById('language-warning');
        if (warning) {
            warning.classList.remove('hidden');
        }
    }

    
    clearAllFields() {
        
        document.getElementById('dice-format').value = '';
        document.getElementById('dice-format-2').value = '';
        document.getElementById('dice-format-3').value = '';
        document.getElementById('dice-format-4').value = '';
        document.getElementById('dice-format-5').value = '';
        document.getElementById('dice-format-6').value = '';
        document.getElementById('dice-format-7').value = '';
        document.getElementById('dice-format-8').value = '';

        
        this.dice1 = { rollType: 'normal', modifier: 'none' };
        this.dice2 = { rollType: 'normal', modifier: 'none' };
        this.dice3 = { rollType: 'normal', modifier: 'none' };
        this.dice4 = { rollType: 'normal', modifier: 'none' };
        this.dice5 = { rollType: 'normal' };
        this.dice6 = { rollType: 'normal' };
        this.dice7 = { rollType: 'normal' };
        this.dice8 = { rollType: 'normal' };

        
        for (let i = 1; i <= 8; i++) {
            document.querySelectorAll(`.roll-type-btn[data-dice="${i}"]`).forEach(btn => {
                btn.classList.toggle('active', btn.dataset.type === 'normal');
            });
        }

        
        for (let i = 1; i <= 4; i++) {
            document.querySelectorAll(`.modifier-btn[data-dice="${i}"]`).forEach(btn => {
                btn.classList.toggle('active', btn.dataset.modifier === 'none');
            });
        }

        
        this.hideResult();
        this.clearErrors();

        
        this.validateInput();

        
        this.saveState();

        console.log('🎲 Todos os campos foram limpos');
    }
    
    
    cleanup() {
        const overlay = document.getElementById('dice-popup-overlay');
        if (overlay) {
            overlay.remove();
        }
        this.isVisible = false;
        this.lastResult = null;
    }
}


if (typeof window !== 'undefined') {
    window.DicePopup = DicePopup;
}