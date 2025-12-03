
describe('DiceParser', ({ it, beforeEach }) => {
    let parser;
    
    beforeEach(() => {
        parser = new DiceParser();
    });
    
    it('should parse valid dice format 1d6', () => {
        const result = parser.parse('1d6');
        expect(result).toBeTruthy();
        expect(result.count).toBe(1);
        expect(result.sides).toBe(6);
        expect(result.modifier).toBe(0);
        expect(result.originalFormat).toBe('1d6');
    });
    
    it('should parse dice format with modifier 1d20+5', () => {
        const result = parser.parse('1d20+5');
        expect(result).toBeTruthy();
        expect(result.count).toBe(1);
        expect(result.sides).toBe(20);
        expect(result.modifier).toBe(5);
        expect(result.originalFormat).toBe('1d20+5');
    });
    
    it('should parse dice format with negative modifier 2d6-2', () => {
        const result = parser.parse('2d6-2');
        expect(result).toBeTruthy();
        expect(result.count).toBe(2);
        expect(result.sides).toBe(6);
        expect(result.modifier).toBe(-2);
        expect(result.originalFormat).toBe('2d6-2');
    });
    
    it('should parse multiple dice 4d8', () => {
        const result = parser.parse('4d8');
        expect(result).toBeTruthy();
        expect(result.count).toBe(4);
        expect(result.sides).toBe(8);
        expect(result.modifier).toBe(0);
    });
    
    it('should handle case insensitive input', () => {
        const result = parser.parse('2D6');
        expect(result).toBeTruthy();
        expect(result.count).toBe(2);
        expect(result.sides).toBe(6);
    });
    
    it('should trim whitespace', () => {
        const result = parser.parse('  1d20+3  ');
        expect(result).toBeTruthy();
        expect(result.originalFormat).toBe('1d20+3');
    });
    
    it('should reject invalid format', () => {
        expect(parser.parse('invalid')).toBeNull();
        expect(parser.parse('d6')).toBeNull();
        expect(parser.parse('1d')).toBeNull();
        expect(parser.parse('1x6')).toBeNull();
    });
    
    it('should reject too many dice', () => {
        expect(parser.parse('11d6')).toBeNull();
        expect(parser.parse('99d6')).toBeNull();
    });
    
    it('should reject invalid sides count', () => {
        expect(parser.parse('1d1')).toBeNull();
        expect(parser.parse('1d101')).toBeNull();
        expect(parser.parse('1d999')).toBeNull();
    });
    
    it('should validate correctly', () => {
        expect(parser.validate('1d6')).toBeTruthy();
        expect(parser.validate('2d20+5')).toBeTruthy();
        expect(parser.validate('invalid')).toBeFalsy();
        expect(parser.validate('')).toBeFalsy();
        expect(parser.validate(null)).toBeFalsy();
    });
    
    it('should return supported formats', () => {
        const formats = parser.getSupportedFormats();
        expect(formats).toBeTruthy();
        expect(formats.length).toBeGreaterThan(0);
        expect(formats).toContain('1d20');
        expect(formats).toContain('2d6');
    });
    
    it('should provide appropriate error messages', () => {
        expect(parser.getErrorMessage('')).toContain('Digite um formato');
        expect(parser.getErrorMessage('invalid')).toContain('Formato inválido');
        expect(parser.getErrorMessage('11d6')).toContain('Quantidade de dados');
        expect(parser.getErrorMessage('1d1')).toContain('Dados devem ter');
    });
    
    it('should handle edge cases', () => {
        expect(parser.parse('10d100')).toBeTruthy();
        expect(parser.parse('1d2')).toBeTruthy();
        expect(parser.parse('1d20+0')).toBeTruthy();
        expect(parser.parse('1d6-0')).toBeTruthy();
    });
});