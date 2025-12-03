
describe('RollEngine', ({ it, beforeEach }) => {
    let engine;
    
    beforeEach(() => {
        engine = new RollEngine();
    });
    
    it('should initialize correctly', () => {
        expect(engine).toBeTruthy();
        expect(engine.randomGenerator).toBeTruthy();
        expect(engine.parser).toBeTruthy();
    });
    
    it('should roll normal dice', () => {
        const result = engine.roll('1d6', 'normal');
        
        expect(result.format).toBe('1d6');
        expect(result.rollType).toBe('normal');
        expect(result.rolls.length).toBe(1);
        expect(result.selectedRolls.length).toBe(1);
        expect(result.finalResult).toBeGreaterThan(0);
        expect(result.finalResult).toBeLessThan(7);
        expect(result.modifier).toBe(0);
        expect(typeof result.explanation).toBe('string');
        expect(typeof result.isSecure).toBe('boolean');
    });
    
    it('should roll with modifier', () => {
        const result = engine.roll('1d6+3', 'normal');
        
        expect(result.modifier).toBe(3);
        expect(result.finalResult).toBeGreaterThan(3);
        expect(result.finalResult).toBeLessThan(10);
        expect(result.explanation).toContain('+3');
    });
    
    it('should roll with negative modifier', () => {
        const result = engine.roll('1d20-2', 'normal');
        
        expect(result.modifier).toBe(-2);
        expect(result.finalResult).toBeGreaterThan(-2);
        expect(result.finalResult).toBeLessThan(19);
        expect(result.explanation).toContain('-2');
    });
    
    it('should roll multiple dice', () => {
        const result = engine.roll('3d6', 'normal');
        
        expect(result.rolls.length).toBe(3);
        expect(result.selectedRolls.length).toBe(3);
        expect(result.finalResult).toBeGreaterThan(2);
        expect(result.finalResult).toBeLessThan(19);
    });
    
    it('should roll with advantage', () => {
        const result = engine.roll('1d20', 'advantage');
        
        expect(result.rollType).toBe('advantage');
        expect(result.rolls.length).toBe(1);
        expect(Array.isArray(result.rolls[0])).toBeTruthy();
        expect(result.rolls[0].length).toBe(2);
        expect(result.selectedRolls.length).toBe(1);
        expect(result.explanation).toContain('Vantagem');
        
        
        const [roll1, roll2] = result.rolls[0];
        expect(result.selectedRolls[0]).toBe(Math.max(roll1, roll2));
    });
    
    it('should roll with disadvantage', () => {
        const result = engine.roll('1d20', 'disadvantage');
        
        expect(result.rollType).toBe('disadvantage');
        expect(result.rolls.length).toBe(1);
        expect(Array.isArray(result.rolls[0])).toBeTruthy();
        expect(result.rolls[0].length).toBe(2);
        expect(result.selectedRolls.length).toBe(1);
        expect(result.explanation).toContain('Desvantagem');
        
        
        const [roll1, roll2] = result.rolls[0];
        expect(result.selectedRolls[0]).toBe(Math.min(roll1, roll2));
    });
    
    it('should roll multiple dice with advantage', () => {
        const result = engine.roll('2d6', 'advantage');
        
        expect(result.rolls.length).toBe(2);
        expect(result.selectedRolls.length).toBe(2);
        
        result.rolls.forEach((rollPair, index) => {
            expect(Array.isArray(rollPair)).toBeTruthy();
            expect(rollPair.length).toBe(2);
            expect(result.selectedRolls[index]).toBe(Math.max(rollPair[0], rollPair[1]));
        });
    });
    
    it('should roll multiple dice with disadvantage', () => {
        const result = engine.roll('2d6', 'disadvantage');
        
        expect(result.rolls.length).toBe(2);
        expect(result.selectedRolls.length).toBe(2);
        
        result.rolls.forEach((rollPair, index) => {
            expect(Array.isArray(rollPair)).toBeTruthy();
            expect(rollPair.length).toBe(2);
            expect(result.selectedRolls[index]).toBe(Math.min(rollPair[0], rollPair[1]));
        });
    });
    
    it('should format for chat correctly', () => {
        const result = engine.roll('1d6+2', 'normal');
        const chatText = engine.formatForChat(result);
        
        expect(chatText).toContain('🎲');
        expect(chatText).toContain('1d6+2');
        expect(chatText).toContain(result.finalResult.toString());
        expect(chatText).toContain(result.explanation);
    });
    
    it('should format advantage for chat', () => {
        const result = engine.roll('1d20', 'advantage');
        const chatText = engine.formatForChat(result);
        
        expect(chatText).toContain('Vantagem');
        expect(chatText).toContain('🎲');
    });
    
    it('should format disadvantage for chat', () => {
        const result = engine.roll('1d20', 'disadvantage');
        const chatText = engine.formatForChat(result);
        
        expect(chatText).toContain('Desvantagem');
        expect(chatText).toContain('🎲');
    });
    
    it('should throw error for invalid format', () => {
        expect(() => engine.roll('invalid')).toThrow();
        expect(() => engine.roll('')).toThrow();
        expect(() => engine.roll(null)).toThrow();
    });
    
    it('should handle edge cases', () => {
        const result = engine.roll('1d2', 'normal');
        expect(result.finalResult).toBeGreaterThan(0);
        expect(result.finalResult).toBeLessThan(3);
        
        const result100 = engine.roll('1d100', 'normal');
        expect(result100.finalResult).toBeGreaterThan(0);
        expect(result100.finalResult).toBeLessThan(101);
    });
    
    it('should provide security status', () => {
        const status = engine.getSecurityStatus();
        expect(typeof status).toBe('string');
        expect(status.length).toBeGreaterThan(0);
    });
    
    it('should calculate final result correctly', () => {
        
        const originalRoll = engine.randomGenerator.rollMultiple;
        engine.randomGenerator.rollMultiple = () => [3, 4, 5];
        
        const result = engine.roll('3d6+2', 'normal');
        expect(result.finalResult).toBe(14); 
        
        
        engine.randomGenerator.rollMultiple = originalRoll;
    });
    
    it('should handle zero modifier correctly', () => {
        const result = engine.roll('1d6+0', 'normal');
        expect(result.modifier).toBe(0);
        expect(result.explanation).not.toContain('+0');
        expect(result.explanation).not.toContain('-0');
    });
});