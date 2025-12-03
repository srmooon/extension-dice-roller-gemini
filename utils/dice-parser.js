
class DiceParser {
    constructor() {
        
        this.simpleDicePattern = /^(\d+)d(\d+)([+-]\d+)?$/i;
        
        this.complexDicePattern = /(\d+)d(\d+)/gi;
        this.maxDice = Infinity;
        this.minSides = 2;
        this.maxSides = Infinity;
    }

    
    parse(input) {
        if (!input || typeof input !== 'string') {
            return null;
        }

        
        const trimmed = input.trim().replace(/\s+/g, '');
        
        
        const simpleMatch = this.simpleDicePattern.exec(trimmed);
        if (simpleMatch) {
            const count = parseInt(simpleMatch[1], 10);
            const sides = parseInt(simpleMatch[2], 10);
            const modifierStr = simpleMatch[3] || '+0';
            const modifier = parseInt(modifierStr, 10);

            
            if (count < 1 || count > this.maxDice) {
                return null;
            }
            
            if (sides < this.minSides || sides > this.maxSides) {
                return null;
            }

            return {
                count: count,
                sides: sides,
                modifier: modifier,
                originalFormat: trimmed,
                isComplex: false
            };
        }
        
        
        return this.parseComplex(trimmed);
    }
    
    
    parseComplex(input) {
        
        const diceMatches = [];
        let match;
        const pattern = new RegExp(this.complexDicePattern);
        
        while ((match = pattern.exec(input)) !== null) {
            const count = parseInt(match[1], 10);
            const sides = parseInt(match[2], 10);
            
            if (count < 1 || count > this.maxDice) {
                return null;
            }
            
            if (sides < this.minSides || sides > this.maxSides) {
                return null;
            }
            
            diceMatches.push({ count, sides });
        }
        
        
        if (diceMatches.length === 0) {
            return null;
        }
        
        
        const modifierMatch = input.match(/([+-]\d{1,3})(?!d)/);
        const modifier = modifierMatch ? parseInt(modifierMatch[1], 10) : 0;
        
        
        if (diceMatches.length === 1) {
            return {
                count: diceMatches[0].count,
                sides: diceMatches[0].sides,
                modifier: modifier,
                originalFormat: input,
                isComplex: false
            };
        }
        
        
        return {
            diceGroups: diceMatches,
            modifier: modifier,
            originalFormat: input,
            isComplex: true
        };
    }

    
    validate(input) {
        return this.parse(input) !== null;
    }

    
    getSupportedFormats() {
        return [
            '1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '1d100',
            '2d6', '3d8', '4d6',
            '1d20+5', '2d6-2', '1d8+3'
        ];
    }

    
    getErrorMessage(input) {
        if (!input || typeof input !== 'string' || input.trim() === '') {
            return 'Digite um formato de dados (ex: 2d6, 1d20+5)';
        }

        const trimmed = input.trim();
        const match = this.dicePattern.exec(trimmed);
        
        if (!match) {
            return 'Formato inválido. Use: [quantidade]d[lados] (ex: 2d6, 1d20+5)';
        }

        const count = parseInt(match[1], 10);
        const sides = parseInt(match[2], 10);

        if (count < 1 || count > this.maxDice) {
            return `Quantidade de dados deve ser entre 1 e ${this.maxDice}`;
        }
        
        if (sides < this.minSides || sides > this.maxSides) {
            return `Dados devem ter entre ${this.minSides} e ${this.maxSides} lados`;
        }

        return 'Formato inválido';
    }
}


if (typeof window !== 'undefined') {
    window.DiceParser = DiceParser;
}