
describe('RandomGenerator', ({ it, beforeEach }) => {
    let generator;
    
    beforeEach(() => {
        generator = new RandomGenerator();
    });
    
    it('should initialize correctly', () => {
        expect(generator).toBeTruthy();
        expect(typeof generator.isSecure()).toBe('boolean');
    });
    
    it('should roll single die within range', () => {
        for (let i = 0; i < 100; i++) {
            const result = generator.rollDie(6);
            expect(result).toBeGreaterThan(0);
            expect(result).toBeLessThan(7);
            expect(Number.isInteger(result)).toBeTruthy();
        }
    });
    
    it('should roll different die sizes', () => {
        const d4Result = generator.rollDie(4);
        expect(d4Result).toBeGreaterThan(0);
        expect(d4Result).toBeLessThan(5);
        
        const d20Result = generator.rollDie(20);
        expect(d20Result).toBeGreaterThan(0);
        expect(d20Result).toBeLessThan(21);
        
        const d100Result = generator.rollDie(100);
        expect(d100Result).toBeGreaterThan(0);
        expect(d100Result).toBeLessThan(101);
    });
    
    it('should roll multiple dice', () => {
        const results = generator.rollMultiple(3, 6);
        expect(results.length).toBe(3);
        
        results.forEach(result => {
            expect(result).toBeGreaterThan(0);
            expect(result).toBeLessThan(7);
            expect(Number.isInteger(result)).toBeTruthy();
        });
    });
    
    it('should handle edge cases for rollDie', () => {
        expect(generator.rollDie(2)).toBeGreaterThan(0);
        expect(generator.rollDie(2)).toBeLessThan(3);
        
        expect(generator.rollDie(100)).toBeGreaterThan(0);
        expect(generator.rollDie(100)).toBeLessThan(101);
    });
    
    it('should throw error for invalid die sides', () => {
        expect(() => generator.rollDie(1)).toThrow();
        expect(() => generator.rollDie(101)).toThrow();
        expect(() => generator.rollDie(-1)).toThrow();
        expect(() => generator.rollDie(0)).toThrow();
    });
    
    it('should throw error for invalid dice count', () => {
        expect(() => generator.rollMultiple(0, 6)).toThrow();
        expect(() => generator.rollMultiple(11, 6)).toThrow();
        expect(() => generator.rollMultiple(-1, 6)).toThrow();
    });
    
    it('should provide security status', () => {
        const status = generator.getSecurityStatus();
        expect(typeof status).toBe('string');
        expect(status.length).toBeGreaterThan(0);
    });
    
    it('should test distribution (statistical)', () => {
        const stats = generator.testDistribution(6, 600);
        expect(stats.counts.length).toBe(6);
        expect(stats.expected).toBe(100);
        
        
        stats.counts.forEach(count => {
            expect(count).toBeGreaterThan(0);
        });
        
        
        stats.counts.forEach(count => {
            expect(count).toBeGreaterThan(70);
            expect(count).toBeLessThan(130);
        });
    });
    
    it('should generate different results', () => {
        const results = [];
        for (let i = 0; i < 10; i++) {
            results.push(generator.rollDie(20));
        }
        
        
        const uniqueResults = [...new Set(results)];
        expect(uniqueResults.length).toBeGreaterThan(2);
    });
    
    it('should handle large dice counts', () => {
        const results = generator.rollMultiple(10, 6);
        expect(results.length).toBe(10);
        
        results.forEach(result => {
            expect(result).toBeGreaterThan(0);
            expect(result).toBeLessThan(7);
        });
    });
    
    it('should maintain consistency in security check', () => {
        const isSecure1 = generator.isSecure();
        const isSecure2 = generator.isSecure();
        expect(isSecure1).toBe(isSecure2);
    });
});