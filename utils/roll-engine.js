
class RollEngine {
    constructor() {
        this.randomGenerator = new RandomGenerator();
        this.parser = new DiceParser();
    }

    
    roll(diceFormat, rollType = 'normal', isLucky = false, isUnlucky = false) {
        const parsed = this.parser.parse(diceFormat);
        if (!parsed) {
            throw new Error('Invalid dice format');
        }

        
        if (parsed.isComplex) {
            return this.rollComplex(parsed, rollType, isLucky, isUnlucky);
        }

        let rollResults;
        let finalResult;
        let explanation;

        switch (rollType) {
            case 'advantage':
                rollResults = this.rollWithAdvantage(parsed, isLucky, isUnlucky);
                finalResult = this.calculateFinalResult(rollResults.selected, parsed.modifier);
                explanation = this.formatAdvantageResult(rollResults, parsed.modifier);
                break;
                
            case 'disadvantage':
                rollResults = this.rollWithDisadvantage(parsed, isLucky, isUnlucky);
                finalResult = this.calculateFinalResult(rollResults.selected, parsed.modifier);
                explanation = this.formatDisadvantageResult(rollResults, parsed.modifier);
                break;
                
            default: 
                rollResults = this.rollNormal(parsed, isLucky, isUnlucky);
                finalResult = this.calculateFinalResult(rollResults.rolls, parsed.modifier);
                explanation = this.formatNormalResult(rollResults.rolls, parsed.modifier);
                break;
        }

        return {
            format: parsed.originalFormat,
            rollType: rollType,
            rolls: rollResults.rolls || rollResults.all,
            selectedRolls: rollResults.selected || rollResults.rolls,
            finalResult: finalResult,
            modifier: parsed.modifier,
            explanation: explanation,
            isLucky: isLucky,
            isSecure: this.randomGenerator.isSecure()
        };
    }
    
    
    rollComplex(parsed, rollType, isLucky, isUnlucky) {
        const allRolls = [];
        let total = 0;
        const explanationParts = [];
        
        
        for (const group of parsed.diceGroups) {
            const rolls = this.randomGenerator.rollMultiple(group.count, group.sides, isLucky, isUnlucky);
            const sum = rolls.reduce((a, b) => a + b, 0);
            
            allRolls.push(...rolls);
            total += sum;
            
            explanationParts.push(`${group.count}d${group.sides}:[${rolls.join(', ')}]`);
        }
        
        
        total += parsed.modifier;
        
        
        let explanation = explanationParts.join(' + ');
        if (parsed.modifier !== 0) {
            const modStr = parsed.modifier > 0 ? `+${parsed.modifier}` : `${parsed.modifier}`;
            explanation += ` ${modStr}`;
        }
        
        return {
            format: parsed.originalFormat,
            rollType: rollType,
            rolls: allRolls,
            selectedRolls: allRolls,
            finalResult: total,
            modifier: parsed.modifier,
            explanation: explanation,
            isLucky: isLucky,
            isUnlucky: isUnlucky,
            isSecure: this.randomGenerator.isSecure()
        };
    }

    
    rollNormal(parsed, isLucky = false, isUnlucky = false) {
        const rolls = this.randomGenerator.rollMultiple(parsed.count, parsed.sides, isLucky, isUnlucky);
        return {
            rolls: rolls
        };
    }

    
    rollWithAdvantage(parsed, isLucky = false, isUnlucky = false) {
        
        const allRolls = [];
        const selectedRolls = [];

        for (let i = 0; i < parsed.count; i++) {
            const roll1 = this.randomGenerator.rollDie(parsed.sides, isLucky, isUnlucky);
            const roll2 = this.randomGenerator.rollDie(parsed.sides, isLucky, isUnlucky);
            
            allRolls.push([roll1, roll2]);
            selectedRolls.push(Math.max(roll1, roll2));
        }

        return {
            all: allRolls,
            selected: selectedRolls
        };
    }

    
    rollWithDisadvantage(parsed, isLucky = false, isUnlucky = false) {
        
        const allRolls = [];
        const selectedRolls = [];

        for (let i = 0; i < parsed.count; i++) {
            const roll1 = this.randomGenerator.rollDie(parsed.sides, isLucky, isUnlucky);
            const roll2 = this.randomGenerator.rollDie(parsed.sides, isLucky, isUnlucky);
            
            allRolls.push([roll1, roll2]);
            selectedRolls.push(Math.min(roll1, roll2));
        }

        return {
            all: allRolls,
            selected: selectedRolls
        };
    }

    
    calculateFinalResult(rolls, modifier) {
        const sum = rolls.reduce((total, roll) => total + roll, 0);
        return sum + modifier;
    }

    
    formatNormalResult(rolls, modifier, isLucky = false) {
        let explanation = `[${rolls.join(', ')}]`;
        
        if (modifier !== 0) {
            const modStr = modifier > 0 ? `+${modifier}` : `${modifier}`;
            explanation += ` ${modStr}`;
        }
        
        return explanation;
    }

    
    formatAdvantageResult(rollResults, modifier, isLucky = false) {
        const pairs = rollResults.all.map(pair => `(${pair[0]}, ${pair[1]})`).join(', ');
        let explanation = `Vantagem: ${pairs} → [${rollResults.selected.join(', ')}]`;
        
        if (modifier !== 0) {
            const modStr = modifier > 0 ? `+${modifier}` : `${modifier}`;
            explanation += ` ${modStr}`;
        }
        
        return explanation;
    }

    
    formatDisadvantageResult(rollResults, modifier, isLucky = false) {
        const pairs = rollResults.all.map(pair => `(${pair[0]}, ${pair[1]})`).join(', ');
        let explanation = `Desvantagem: ${pairs} → [${rollResults.selected.join(', ')}]`;
        
        if (modifier !== 0) {
            const modStr = modifier > 0 ? `+${modifier}` : `${modifier}`;
            explanation += ` ${modStr}`;
        }
        
        return explanation;
    }

    
    formatForChat(result) {
        let chatText = `🎲 ${result.format}: ${result.finalResult}`;
        
        if (result.rollType !== 'normal') {
            chatText += ` (${result.rollType === 'advantage' ? 'Vantagem' : 'Desvantagem'})`;
        }
        
        if (result.isLucky) {
            chatText += ` 🍀`;
        }
        
        chatText += `\n${result.explanation}`;
        
        return chatText;
    }

    
    getSecurityStatus() {
        return this.randomGenerator.getSecurityStatus();
    }
}


if (typeof window !== 'undefined') {
    window.RollEngine = RollEngine;
}