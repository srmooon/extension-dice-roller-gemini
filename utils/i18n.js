
class I18n {
    constructor() {
        this.currentLanguage = this.loadLanguage();
        this.translations = {
            'pt-BR': {
                
                buttonLabel: 'Dados',
                
                
                popupTitle: 'Rolar Dados',
                playerCategory: 'PLAYER',
                npcCategory: 'NPC',
                dice1Title: 'Dado 1',
                dice2Title: 'Dado 2 (Opcional)',
                dice3Title: 'Dado 3 (Opcional)',
                dice4Title: 'Dado 4 (Opcional)',
                dice5Title: 'Dado 5',
                dice6Title: 'Dado 6 (Opcional)',
                dice7Title: 'Dado 7 (Opcional)',
                dice8Title: 'Dado 8 (Opcional)',
                optional: '(Opcional)',
                format: 'Formato:',
                firstDice: 'Primeiro Dado:',
                secondDice: 'Segundo Dado (opcional):',
                rollType: 'Tipo de Rolagem:',
                modifier: 'Modificador:',
                normal: 'Normal',
                advantage: 'Vantagem',
                disadvantage: 'Desvantagem',
                none: 'Nenhum',
                lucky: 'Sortudo',
                unlucky: 'Azarado',
                autoInsert: 'Inserir automaticamente no chat e enviar',
                luckyDice: 'Dado Sortudo (70% superiores)',
                luckyExplanation: 'Garante resultados nos 70% superiores do dado',
                unluckyDice: 'Dado Azarado (30% inferiores)',
                unluckyExplanation: 'Garante resultados nos 30% inferiores do dado',
                rollButton: 'Rolar Dados',
                insertButton: 'Inserir no Chat',
                clearButton: 'Limpar Tudo',
                rolling: 'Rolando...',
                inserting: 'Inserindo...',
                inserted: 'Inserido!',
                clickToRoll: 'Clique em "Rolar" para ver a animação',
                clickToRollAgain: 'Clique em "Rolar" para rolar novamente',
                rollingDice: 'Rolando dados...',
                
                
                normalDesc: 'Rolagem normal',
                advantageDesc: 'Rola dois dados e pega o maior resultado',
                disadvantageDesc: 'Rola dois dados e pega o menor resultado',
                
                
                secureRandom: 'Usando geração segura de números aleatórios',
                insecureRandom: 'Aviso: Usando geração menos segura de números aleatórios',
                
                
                invalidFormat: 'Formato inválido. Use: [quantidade]d[lados] (ex: 2d6, 1d20+5)',
                enterFormat: 'Digite um formato de dados (ex: 2d6, 1d20+5)',
                diceCountError: 'Quantidade de dados deve ser entre 1 e',
                diceSidesError: 'Dados devem ter entre',
                and: 'e',
                sides: 'lados',
                noResult: 'Nenhum resultado para inserir.',
                insertError: 'Erro ao inserir resultado no chat. Tente novamente.',
                
                
                result: 'RESULTADO',
                details: 'Detalhes',
                advantageType: '(Vantagem)',
                disadvantageType: '(Desvantagem)',
                
                
                language: 'Idioma:',
                portuguese: 'Português (PT-BR)',
                english: 'English (EN-US)',
                languageChanged: 'Idioma alterado! Recarregue a página para aplicar as mudanças.',
                reloadPage: 'Recarregar Página'
            },
            'en-US': {
                
                buttonLabel: 'Dice',
                
                
                popupTitle: 'Roll Dice',
                playerCategory: 'PLAYER',
                npcCategory: 'NPC',
                dice1Title: 'Die 1',
                dice2Title: 'Die 2 (Optional)',
                dice3Title: 'Die 3 (Optional)',
                dice4Title: 'Die 4 (Optional)',
                dice5Title: 'Die 5',
                dice6Title: 'Die 6 (Optional)',
                dice7Title: 'Die 7 (Optional)',
                dice8Title: 'Die 8 (Optional)',
                optional: '(Optional)',
                format: 'Format:',
                firstDice: 'First Die:',
                secondDice: 'Second Die (optional):',
                rollType: 'Roll Type:',
                modifier: 'Modifier:',
                normal: 'Normal',
                advantage: 'Advantage',
                disadvantage: 'Disadvantage',
                none: 'None',
                lucky: 'Lucky',
                unlucky: 'Unlucky',
                autoInsert: 'Automatically insert into chat and send',
                luckyDice: 'Lucky Die (top 70%)',
                luckyExplanation: 'Guarantees results in the top 70% of the die',
                unluckyDice: 'Unlucky Die (bottom 30%)',
                unluckyExplanation: 'Guarantees results in the bottom 30% of the die',
                rollButton: 'Roll Dice',
                insertButton: 'Insert into Chat',
                clearButton: 'Clear All',
                rolling: 'Rolling...',
                inserting: 'Inserting...',
                inserted: 'Inserted!',
                clickToRoll: 'Click "Roll" to see the animation',
                clickToRollAgain: 'Click "Roll" to roll again',
                rollingDice: 'Rolling dice...',
                
                
                normalDesc: 'Normal roll',
                advantageDesc: 'Roll two dice and take the higher result',
                disadvantageDesc: 'Roll two dice and take the lower result',
                
                
                secureRandom: 'Using secure random number generation',
                insecureRandom: 'Warning: Using less secure random number generation',
                
                
                invalidFormat: 'Invalid format. Use: [quantity]d[sides] (e.g., 2d6, 1d20+5)',
                enterFormat: 'Enter a dice format (e.g., 2d6, 1d20+5)',
                diceCountError: 'Dice count must be between 1 and',
                diceSidesError: 'Dice must have between',
                and: 'and',
                sides: 'sides',
                noResult: 'No result to insert.',
                insertError: 'Error inserting result into chat. Please try again.',
                
                
                result: 'RESULT',
                details: 'Details',
                advantageType: '(Advantage)',
                disadvantageType: '(Disadvantage)',
                
                
                language: 'Language:',
                portuguese: 'Português (PT-BR)',
                english: 'English (EN-US)',
                languageChanged: 'Language changed! Reload the page to apply changes.',
                reloadPage: 'Reload Page'
            }
        };
    }

    
    loadLanguage() {
        try {
            const saved = localStorage.getItem('diceRollerLanguage');
            return saved || 'en-US';
        } catch (error) {
            return 'en-US';
        }
    }

    
    saveLanguage(lang) {
        try {
            localStorage.setItem('diceRollerLanguage', lang);
            this.currentLanguage = lang;
        } catch (error) {
            console.warn('Could not save language preference:', error);
        }
    }

    
    t(key) {
        const translation = this.translations[this.currentLanguage];
        return translation[key] || key;
    }

    
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.saveLanguage(lang);
            return true;
        }
        return false;
    }

    
    getAvailableLanguages() {
        return Object.keys(this.translations);
    }
}


if (typeof window !== 'undefined') {
    window.I18n = I18n;
}
