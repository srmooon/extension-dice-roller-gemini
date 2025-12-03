
class LuckyDiceTest {
    constructor() {
        this.testResults = [];
        this.passed = 0;
        this.failed = 0;
    }

    runAllTests() {
        console.log('🧪 Iniciando testes do Dado Sortudo...\n');
        
        this.testLuckyDieRoll();
        this.testLuckyMultipleRolls();
        this.testLuckyAdvantage();
        this.testLuckyDisadvantage();
        this.testLuckyModifier();
        this.testLuckyEdgeCases();
        
        this.printResults();
    }

    testLuckyDieRoll() {
        console.log('🎯 Testando rolagem de dado único sortudo...');
        
        const randomGenerator = new RandomGenerator();
        const results = [];
        
        
        for (let i = 0; i < 100; i++) {
            results.push(randomGenerator.rollDie(20, true));
        }
        
        const avgResult = results.reduce((a, b) => a + b, 0) / results.length;
        const expectedAvg = 10.5; 
        
        console.log(`   Média dos resultados: ${avgResult.toFixed(2)}`);
        console.log(`   Média esperada (normal): ${expectedAvg}`);
        console.log(`   Diferença: ${(avgResult - expectedAvg).toFixed(2)}`);
        
        
        if (avgResult > expectedAvg) {
            console.log('   ✅ Dado sortudo funcionando - média aumentada');
            this.passed++;
        } else {
            console.log('   ❌ Dado sortudo não está funcionando como esperado');
            this.failed++;
        }
        
        console.log('');
    }

    testLuckyMultipleRolls() {
        console.log('🎯 Testando múltiplos dados sortudos...');
        
        const randomGenerator = new RandomGenerator();
        const results = [];
        
        
        for (let i = 0; i < 50; i++) {
            const roll = randomGenerator.rollMultiple(3, 6, true);
            results.push(roll.reduce((a, b) => a + b, 0));
        }
        
        const avgResult = results.reduce((a, b) => a + b, 0) / results.length;
        const expectedAvg = 10.5; 
        
        console.log(`   Média dos resultados: ${avgResult.toFixed(2)}`);
        console.log(`   Média esperada (normal): ${expectedAvg}`);
        console.log(`   Diferença: ${(avgResult - expectedAvg).toFixed(2)}`);
        
        if (avgResult > expectedAvg) {
            console.log('   ✅ Múltiplos dados sortudos funcionando');
            this.passed++;
        } else {
            console.log('   ❌ Múltiplos dados sortudos não funcionando');
            this.failed++;
        }
        
        console.log('');
    }

    testLuckyAdvantage() {
        console.log('🎯 Testando vantagem com dado sortudo...');
        
        const rollEngine = new RollEngine();
        const results = [];
        
        
        for (let i = 0; i < 50; i++) {
            const result = rollEngine.roll('1d20', 'advantage', true);
            results.push(result.finalResult);
        }
        
        const avgResult = results.reduce((a, b) => a + b, 0) / results.length;
        const expectedAvg = 13.825; 
        
        console.log(`   Média dos resultados: ${avgResult.toFixed(2)}`);
        console.log(`   Média esperada (vantagem normal): ${expectedAvg}`);
        console.log(`   Diferença: ${(avgResult - expectedAvg).toFixed(2)}`);
        
        if (avgResult > expectedAvg) {
            console.log('   ✅ Vantagem com dado sortudo funcionando');
            this.passed++;
        } else {
            console.log('   ❌ Vantagem com dado sortudo não funcionando');
            this.failed++;
        }
        
        console.log('');
    }

    testLuckyDisadvantage() {
        console.log('🎯 Testando desvantagem com dado sortudo...');
        
        const rollEngine = new RollEngine();
        const results = [];
        
        
        for (let i = 0; i < 50; i++) {
            const result = rollEngine.roll('1d20', 'disadvantage', true);
            results.push(result.finalResult);
        }
        
        const avgResult = results.reduce((a, b) => a + b, 0) / results.length;
        const expectedAvg = 7.175; 
        
        console.log(`   Média dos resultados: ${avgResult.toFixed(2)}`);
        console.log(`   Média esperada (desvantagem normal): ${expectedAvg}`);
        console.log(`   Diferença: ${(avgResult - expectedAvg).toFixed(2)}`);
        
        if (avgResult > expectedAvg) {
            console.log('   ✅ Desvantagem com dado sortudo funcionando');
            this.passed++;
        } else {
            console.log('   ❌ Desvantagem com dado sortudo não funcionando');
            this.failed++;
        }
        
        console.log('');
    }

    testLuckyModifier() {
        console.log('🎯 Testando dado sortudo com modificadores...');
        
        const rollEngine = new RollEngine();
        const results = [];
        
        
        for (let i = 0; i < 50; i++) {
            const result = rollEngine.roll('1d20+5', 'normal', true);
            results.push(result.finalResult);
        }
        
        const avgResult = results.reduce((a, b) => a + b, 0) / results.length;
        const expectedAvg = 15.5; 
        
        console.log(`   Média dos resultados: ${avgResult.toFixed(2)}`);
        console.log(`   Média esperada (normal): ${expectedAvg}`);
        console.log(`   Diferença: ${(avgResult - expectedAvg).toFixed(2)}`);
        
        if (avgResult > expectedAvg) {
            console.log('   ✅ Dado sortudo com modificadores funcionando');
            this.passed++;
        } else {
            console.log('   ❌ Dado sortudo com modificadores não funcionando');
            this.failed++;
        }
        
        console.log('');
    }

    testLuckyEdgeCases() {
        console.log('🎯 Testando casos extremos do dado sortudo...');
        
        const randomGenerator = new RandomGenerator();
        let passed = 0;
        
        
        const testCases = [2, 4, 6, 8, 10, 12, 20, 100];
        
        for (const sides of testCases) {
            const results = [];
            for (let i = 0; i < 20; i++) {
                results.push(randomGenerator.rollDie(sides, true));
            }
            
            const avgResult = results.reduce((a, b) => a + b, 0) / results.length;
            const expectedAvg = (sides + 1) / 2;
            
            if (avgResult > expectedAvg) {
                passed++;
            }
        }
        
        if (passed === testCases.length) {
            console.log('   ✅ Todos os casos extremos passaram');
            this.passed++;
        } else {
            console.log(`   ❌ ${passed}/${testCases.length} casos extremos passaram`);
            this.failed++;
        }
        
        console.log('');
    }

    printResults() {
        console.log('📊 RESULTADOS DOS TESTES DO DADO SORTUDO');
        console.log('==========================================');
        console.log(`✅ Testes passaram: ${this.passed}`);
        console.log(`❌ Testes falharam: ${this.failed}`);
        console.log(`📈 Taxa de sucesso: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
        
        if (this.failed === 0) {
            console.log('\n🎉 Todos os testes passaram! O dado sortudo está funcionando perfeitamente!');
        } else {
            console.log('\n⚠️ Alguns testes falharam. Verifique a implementação.');
        }
    }
}


if (typeof window !== 'undefined') {
    window.LuckyDiceTest = LuckyDiceTest;
    
    
    if (window.RandomGenerator && window.RollEngine) {
        const test = new LuckyDiceTest();
        test.runAllTests();
    }
}
