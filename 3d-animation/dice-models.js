
class DiceModels {
    constructor() {
        this.materials = {};
        this.geometries = {};
        this.textures = {};
        this.initialized = false;
    }

    
    initialize() {
        try {
            if (typeof THREE !== 'undefined') {
                this.initializeThreeJSModels();
            } else {
                this.initializeFallbackModels();
            }
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Failed to initialize dice models:', error);
            return false;
        }
    }

    
    initializeThreeJSModels() {
        
        this.geometries = {
            d4: new THREE.TetrahedronGeometry(1, 0),
            d6: new THREE.BoxGeometry(1, 1, 1),
            d8: new THREE.OctahedronGeometry(1, 0),
            d10: this.createD10Geometry(),
            d12: new THREE.DodecahedronGeometry(1, 0),
            d20: new THREE.IcosahedronGeometry(1, 0),
            d100: new THREE.BoxGeometry(1, 1, 1) 
        };

        
        const colors = {
            d4: 0xff6b6b,   
            d6: 0x4ecdc4,   
            d8: 0x45b7d1,   
            d10: 0x96ceb4,  
            d12: 0xfeca57,  
            d20: 0xff9ff3,  
            d100: 0x54a0ff  
        };

        Object.keys(colors).forEach(dieType => {
            this.materials[dieType] = new THREE.MeshLambertMaterial({
                color: colors[dieType],
                transparent: true,
                opacity: 0.9
            });
        });

        
        this.createDiceTextures();
    }

    
    initializeFallbackModels() {
        
        this.fallbackModels = {
            d4: { emoji: '🔺', color: '#ff6b6b' },
            d6: { emoji: '🎲', color: '#4ecdc4' },
            d8: { emoji: '🔶', color: '#45b7d1' },
            d10: { emoji: '🔟', color: '#96ceb4' },
            d12: { emoji: '⬢', color: '#feca57' },
            d20: { emoji: '🎯', color: '#ff9ff3' },
            d100: { emoji: '💯', color: '#54a0ff' }
        };
    }

    
    createD10Geometry() {
        if (typeof THREE === 'undefined') {
            return null;
        }

        
        const geometry = new THREE.ConeGeometry(1, 2, 10);
        return geometry;
    }

    
    createDiceTextures() {
        if (typeof THREE === 'undefined') {
            return;
        }

        
        Object.keys(this.geometries).forEach(dieType => {
            const sides = this.getDieSides(dieType);
            this.textures[dieType] = this.createNumberTexture(sides);
        });
    }

    
    createNumberTexture(maxNumber) {
        if (typeof THREE === 'undefined') {
            return null;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');

        
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 64, 64);

        
        context.strokeStyle = '#000000';
        context.lineWidth = 2;
        context.strokeRect(0, 0, 64, 64);

        
        context.fillStyle = '#000000';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(maxNumber.toString(), 32, 32);

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    
    getDieSides(dieType) {
        const sideMap = {
            d4: 4, d6: 6, d8: 8, d10: 10, 
            d12: 12, d20: 20, d100: 100
        };
        return sideMap[dieType] || 6;
    }

    
    createDiceMesh(sides, position = 0) {
        const dieType = this.getDieTypeFromSides(sides);
        
        if (typeof THREE !== 'undefined' && this.geometries[dieType]) {
            const geometry = this.geometries[dieType].clone();
            const material = this.materials[dieType].clone();
            
            const mesh = new THREE.Mesh(geometry, material);
            
            
            mesh.position.x = (position - 1) * 2.5;
            mesh.position.y = 0;
            mesh.position.z = 0;
            
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            
            return mesh;
        } else {
            
            return this.createFallbackDice(dieType, position);
        }
    }

    
    createFallbackDice(dieType, position) {
        const model = this.fallbackModels[dieType] || this.fallbackModels.d6;
        
        return {
            type: 'fallback',
            dieType: dieType,
            emoji: model.emoji,
            color: model.color,
            position: position,
            element: null 
        };
    }

    
    getDieTypeFromSides(sides) {
        const typeMap = {
            4: 'd4', 6: 'd6', 8: 'd8', 10: 'd10',
            12: 'd12', 20: 'd20', 100: 'd100'
        };
        return typeMap[sides] || 'd6';
    }

    
    createMultipleDice(count, sides) {
        const dice = [];
        const maxVisualDice = Math.min(count, 6); 
        
        for (let i = 0; i < maxVisualDice; i++) {
            const die = this.createDiceMesh(sides, i);
            dice.push(die);
        }
        
        return dice;
    }

    
    getMaterial(dieType) {
        if (this.materials[dieType]) {
            return this.materials[dieType];
        }
        return this.fallbackModels[dieType] || this.fallbackModels.d6;
    }

    
    getGeometry(dieType) {
        return this.geometries[dieType] || null;
    }

    
    animateToResult(dice, result, duration = 1000) {
        return new Promise((resolve) => {
            if (dice.type === 'fallback') {
                
                this.animateFallbackToResult(dice, result, duration).then(resolve);
            } else {
                
                this.animate3DToResult(dice, result, duration).then(resolve);
            }
        });
    }

    
    animate3DToResult(dice, result, duration) {
        return new Promise((resolve) => {
            const startRotation = {
                x: dice.rotation.x,
                y: dice.rotation.y,
                z: dice.rotation.z
            };

            
            
            
            const targetRotation = {
                x: (result - 1) * Math.PI / 3,
                y: 0,
                z: 0
            };

            const startTime = Date.now();

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = this.easeOutCubic(progress);

                
                dice.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * easeProgress;
                dice.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * easeProgress;
                dice.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * easeProgress;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };

            animate();
        });
    }

    
    animateFallbackToResult(dice, result, duration) {
        return new Promise((resolve) => {
            if (dice.element) {
                
                dice.element.style.transition = `all ${duration}ms ease-out`;
                dice.element.textContent = result.toString();
                dice.element.style.transform = 'scale(1.2)';
                
                setTimeout(() => {
                    dice.element.style.transform = 'scale(1)';
                    resolve();
                }, duration);
            } else {
                resolve();
            }
        });
    }

    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    
    dispose() {
        
        Object.values(this.geometries).forEach(geometry => {
            if (geometry && geometry.dispose) {
                geometry.dispose();
            }
        });

        
        Object.values(this.materials).forEach(material => {
            if (material && material.dispose) {
                material.dispose();
            }
        });

        
        Object.values(this.textures).forEach(texture => {
            if (texture && texture.dispose) {
                texture.dispose();
            }
        });

        this.geometries = {};
        this.materials = {};
        this.textures = {};
        this.initialized = false;
    }

    
    isInitialized() {
        return this.initialized;
    }

    
    getAvailableDieTypes() {
        return ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
    }
}


if (typeof window !== 'undefined') {
    window.DiceModels = DiceModels;
}