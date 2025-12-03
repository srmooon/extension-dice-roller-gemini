
class RandomGenerator {
    constructor() {
        this.isSecureAvailable = this.checkSecureRandomAvailability();
        if (!this.isSecureAvailable) {
            console.warn('Web Crypto API not available, falling back to Math.random()');
        }
    }

    
    checkSecureRandomAvailability() {
        return typeof window !== 'undefined' && 
               window.crypto && 
               window.crypto.getRandomValues &&
               typeof window.crypto.getRandomValues === 'function';
    }

    
    getSecureRandomBytes(byteCount) {
        if (this.isSecureAvailable) {
            const array = new Uint8Array(byteCount);
            window.crypto.getRandomValues(array);
            return array;
        } else {
            
            const array = new Uint8Array(byteCount);
            for (let i = 0; i < byteCount; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
            return array;
        }
    }

    
    randomInt(max) {
        if (max < 1 || max > 256) {
            throw new Error('Max value must be between 1 and 256');
        }

        
        const bytesNeeded = Math.ceil(Math.log2(max) / 8);
        const maxValidValue = Math.floor(256 ** bytesNeeded / max) * max;
        
        let randomValue;
        do {
            const bytes = this.getSecureRandomBytes(bytesNeeded);
            randomValue = 0;
            for (let i = 0; i < bytesNeeded; i++) {
                randomValue = (randomValue << 8) + bytes[i];
            }
        } while (randomValue >= maxValidValue);
        
        return (randomValue % max) + 1;
    }

    
    rollDie(sides, isLucky = false, isUnlucky = false) {
        if (sides < 2 || sides > 100) {
            throw new Error('Die must have between 2 and 100 sides');
        }
        
        let result = this.randomInt(sides);
        
        if (isLucky) {
            result = this.applyLuckyModifier(result, sides);
        } else if (isUnlucky) {
            result = this.applyUnluckyModifier(result, sides);
        }
        
        return result;
    }

    applyLuckyModifier(result, sides) {
        
        
        let minLuckyResult;
        
        if (sides === 6) {
            minLuckyResult = 4; 
        } else {
            minLuckyResult = Math.ceil(sides * 0.7); 
        }
        
        
        let maxRerolls = 100; 
        let rerollCount = 0;
        
        while (result < minLuckyResult && rerollCount < maxRerolls) {
            result = this.randomInt(sides);
            rerollCount++;
        }
        
        
        if (rerollCount > 0) {
            console.log(`🍀 Dado sortudo re-rolou ${rerollCount}x para conseguir ${result}/${sides}`);
        }
        
        return result;
    }

    applyUnluckyModifier(result, sides) {
        
        
        let maxUnluckyResult;
        
        if (sides === 6) {
            maxUnluckyResult = 3; 
        } else {
            maxUnluckyResult = Math.ceil(sides * 0.3); 
        }
        
        
        let maxRerolls = 100; 
        let rerollCount = 0;
        
        while (result > maxUnluckyResult && rerollCount < maxRerolls) {
            result = this.randomInt(sides);
            rerollCount++;
        }
        
        
        if (rerollCount > 0) {
            console.log(`💀 Dado azarado re-rolou ${rerollCount}x para conseguir ${result}/${sides}`);
        }
        
        return result;
    }

    
    rollMultiple(count, sides, isLucky = false, isUnlucky = false) {
        if (count < 1) {
            throw new Error('Must roll at least 1 die');
        }
        
        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(this.rollDie(sides, isLucky, isUnlucky));
        }
        
        return results;
    }

    
    isSecure() {
        return this.isSecureAvailable;
    }

    
    getSecurityStatus() {
        if (this.isSecureAvailable) {
            return 'Usando geração segura de números aleatórios';
        } else {
            return 'Aviso: Usando geração menos segura de números aleatórios';
        }
    }

    
    testDistribution(sides = 6, rolls = 1000) {
        const counts = new Array(sides).fill(0);
        
        for (let i = 0; i < rolls; i++) {
            const result = this.rollDie(sides);
            counts[result - 1]++;
        }
        
        const expected = rolls / sides;
        const statistics = {
            counts: counts,
            expected: expected,
            deviations: counts.map(count => Math.abs(count - expected))
        };
        
        return statistics;
    }
}


if (typeof window !== 'undefined') {
    window.RandomGenerator = RandomGenerator;
}