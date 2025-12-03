
class DiceRenderer {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        this.isInitialized = false;
        this.animationId = null;
        this.diceModels = null;
    }

    
    initialize(container) {
        this.container = container;

        try {
            
            if (typeof THREE === 'undefined') {
                console.warn('Three.js not available, using fallback 2D animation');
                return this.initializeFallback(container);
            }

            
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.renderer.setClearColor(0x000000, 0); 
            
            container.appendChild(this.renderer.domElement);

            
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            this.scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            this.scene.add(directionalLight);

            
            this.camera.position.z = 5;

            this.isInitialized = true;
            return true;

        } catch (error) {
            console.error('Failed to initialize 3D renderer:', error);
            return this.initializeFallback(container);
        }
    }

    
    initializeFallback(container) {
        console.log('Using 2D fallback animation');
        this.isInitialized = true;
        return true;
    }

    
    async animateRoll(diceConfig, results) {
        if (!this.isInitialized) {
            throw new Error('Renderer not initialized');
        }

        if (typeof THREE !== 'undefined' && this.renderer) {
            return this.animate3DRoll(diceConfig, results);
        } else {
            return this.animateFallbackRoll(diceConfig, results);
        }
    }

    
    async animateEnhancedRoll(diceConfig, results) {
        if (!this.isInitialized) {
            throw new Error('Renderer not initialized');
        }

        return new Promise((resolve) => {
            
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }

            
            if (!this.diceModels) {
                this.diceModels = new DiceModels();
                this.diceModels.initialize();
            }

            if (typeof THREE !== 'undefined' && this.renderer) {
                this.animatePhysicsRoll(diceConfig, results, resolve);
            } else {
                this.animateEnhancedFallback(diceConfig, results, resolve);
            }
        });
    }

    
    animatePhysicsRoll(diceConfig, results, resolve) {
        
        this.clearScene();

        
        const dice = this.diceModels.createMultipleDice(diceConfig.count, diceConfig.sides);
        
        
        dice.forEach(die => {
            if (die.type !== 'fallback') {
                this.scene.add(die);
            }
        });

        
        const startTime = Date.now();
        const rollDuration = 2000; 
        const settleDuration = 500;  
        const totalDuration = rollDuration + settleDuration;

        
        const dicePhysics = dice.map((die, index) => ({
            mesh: die,
            velocity: {
                x: (Math.random() - 0.5) * 10,
                y: Math.random() * 5 + 5,
                z: (Math.random() - 0.5) * 10
            },
            angularVelocity: {
                x: (Math.random() - 0.5) * 20,
                y: (Math.random() - 0.5) * 20,
                z: (Math.random() - 0.5) * 20
            },
            position: {
                x: (index - dice.length / 2) * 2,
                y: 0,
                z: 0
            },
            bounces: 0,
            settled: false
        }));

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / totalDuration, 1);
            const deltaTime = 0.016; 

            if (progress <= rollDuration / totalDuration) {
                
                this.updateDicePhysics(dicePhysics, deltaTime);
            } else {
                
                this.settleDiceToResults(dicePhysics, results, 
                    (progress - rollDuration / totalDuration) / (settleDuration / totalDuration));
            }

            
            if (this.renderer && this.scene && this.camera) {
                this.renderer.render(this.scene, this.camera);
            }

            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                
                resolve();
            }
        };

        animate();
    }

    
    updateDicePhysics(dicePhysics, deltaTime) {
        const gravity = -20;
        const damping = 0.8;
        const groundY = -2;

        dicePhysics.forEach(diePhysics => {
            if (diePhysics.mesh.type === 'fallback') return;

            const die = diePhysics.mesh;

            
            diePhysics.velocity.y += gravity * deltaTime;

            
            diePhysics.position.x += diePhysics.velocity.x * deltaTime;
            diePhysics.position.y += diePhysics.velocity.y * deltaTime;
            diePhysics.position.z += diePhysics.velocity.z * deltaTime;

            
            if (diePhysics.position.y <= groundY && diePhysics.velocity.y < 0) {
                diePhysics.position.y = groundY;
                diePhysics.velocity.y = -diePhysics.velocity.y * damping;
                diePhysics.velocity.x *= damping;
                diePhysics.velocity.z *= damping;
                diePhysics.angularVelocity.x *= damping;
                diePhysics.angularVelocity.y *= damping;
                diePhysics.angularVelocity.z *= damping;
                diePhysics.bounces++;
            }

            
            die.rotation.x += diePhysics.angularVelocity.x * deltaTime;
            die.rotation.y += diePhysics.angularVelocity.y * deltaTime;
            die.rotation.z += diePhysics.angularVelocity.z * deltaTime;

            
            die.position.x = diePhysics.position.x;
            die.position.y = diePhysics.position.y;
            die.position.z = diePhysics.position.z;

            
            diePhysics.angularVelocity.x *= 0.99;
            diePhysics.angularVelocity.y *= 0.99;
            diePhysics.angularVelocity.z *= 0.99;
        });
    }

    
    settleDiceToResults(dicePhysics, results, settleProgress) {
        const easeProgress = this.easeOutCubic(settleProgress);

        dicePhysics.forEach((diePhysics, index) => {
            if (diePhysics.mesh.type === 'fallback') return;

            const die = diePhysics.mesh;
            const targetY = -1.5;
            const targetX = (index - dicePhysics.length / 2) * 2.5;

            
            die.position.y = diePhysics.position.y + (targetY - diePhysics.position.y) * easeProgress;
            die.position.x = diePhysics.position.x + (targetX - diePhysics.position.x) * easeProgress;
            die.position.z = diePhysics.position.z * (1 - easeProgress);

            
            if (index < results.length) {
                const result = results[index];
                const targetRotationX = (result - 1) * Math.PI / 6;
                die.rotation.x = die.rotation.x + (targetRotationX - die.rotation.x) * easeProgress;
                die.rotation.y *= (1 - easeProgress);
                die.rotation.z *= (1 - easeProgress);
            }
        });
    }

    
    animateEnhancedFallback(diceConfig, results, resolve) {
        if (!this.container) {
            resolve();
            return;
        }

        
        this.container.innerHTML = '';

        const diceCount = Math.min(diceConfig.count, 4);
        const diceElements = [];

        
        for (let i = 0; i < diceCount; i++) {
            const diceWrapper = document.createElement('div');
            diceWrapper.className = 'enhanced-dice-wrapper';
            diceWrapper.style.cssText = `
                position: absolute;
                left: ${30 + i * 70}px;
                top: 50%;
                transform: translateY(-50%);
                perspective: 200px;
            `;

            const diceElement = document.createElement('div');
            diceElement.className = 'enhanced-dice';
            diceElement.textContent = '🎲';
            diceElement.style.cssText = `
                font-size: 36px;
                transform-style: preserve-3d;
                animation: enhancedRoll 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
            `;

            diceWrapper.appendChild(diceElement);
            this.container.appendChild(diceWrapper);
            diceElements.push({ wrapper: diceWrapper, element: diceElement });
        }

        
        this.addEnhancedFallbackCSS();

        
        diceElements.forEach((dice, index) => {
            setTimeout(() => {
                if (index < results.length) {
                    dice.element.textContent = results[index].toString();
                    dice.element.style.animation = 'resultReveal 0.5s ease-out';
                    dice.element.style.fontSize = '28px';
                    dice.element.style.background = 'linear-gradient(135deg, #4285f4, #34a853)';
                    dice.element.style.color = 'white';
                    dice.element.style.borderRadius = '12px';
                    dice.element.style.padding = '12px';
                    dice.element.style.minWidth = '40px';
                    dice.element.style.textAlign = 'center';
                    dice.element.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }
            }, 1800 + index * 100); 
        });

        
        setTimeout(() => {
            resolve();
        }, 2500);
    }

    
    addEnhancedFallbackCSS() {
        if (document.getElementById('dice-enhanced-fallback-css')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'dice-enhanced-fallback-css';
        style.textContent = `
            @keyframes enhancedRoll {
                0% { 
                    transform: translateY(-100px) rotateX(0deg) rotateY(0deg) scale(0.8);
                    opacity: 0;
                }
                20% { 
                    transform: translateY(-50px) rotateX(180deg) rotateY(90deg) scale(1.1);
                    opacity: 1;
                }
                40% { 
                    transform: translateY(-20px) rotateX(360deg) rotateY(180deg) scale(0.9);
                }
                60% { 
                    transform: translateY(-40px) rotateX(540deg) rotateY(270deg) scale(1.05);
                }
                80% { 
                    transform: translateY(-10px) rotateX(720deg) rotateY(360deg) scale(0.95);
                }
                100% { 
                    transform: translateY(0px) rotateX(720deg) rotateY(360deg) scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes resultReveal {
                0% { 
                    transform: scale(0.5) rotateY(90deg);
                    opacity: 0;
                }
                50% { 
                    transform: scale(1.2) rotateY(45deg);
                    opacity: 0.8;
                }
                100% { 
                    transform: scale(1) rotateY(0deg);
                    opacity: 1;
                }
            }
            
            .enhanced-dice {
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .enhanced-dice:hover {
                transform: scale(1.1) !important;
            }
        `;
        document.head.appendChild(style);
    }

    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    
    async animate3DRoll(diceConfig, results) {
        return new Promise((resolve) => {
            
            this.clearScene();

            
            const dice = this.createDiceModels(diceConfig, results);
            
            
            dice.forEach(die => this.scene.add(die));

            
            const startTime = Date.now();
            const duration = 2500; 

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                
                dice.forEach((die, index) => {
                    die.rotation.x = progress * Math.PI * 4 + index;
                    die.rotation.y = progress * Math.PI * 3 + index * 0.5;
                    die.rotation.z = progress * Math.PI * 2 + index * 0.3;
                    
                    
                    die.position.y = Math.abs(Math.sin(progress * Math.PI * 3)) * 2 - 1;
                });

                this.renderer.render(this.scene, this.camera);

                if (progress < 1) {
                    this.animationId = requestAnimationFrame(animate);
                } else {
                    
                    this.positionDiceForResults(dice, results);
                    this.renderer.render(this.scene, this.camera);
                    resolve();
                }
            };

            animate();
        });
    }

    
    async animateFallbackRoll(diceConfig, results) {
        return new Promise((resolve) => {
            if (!this.container) {
                resolve();
                return;
            }

            
            const diceCount = Math.min(diceConfig.count, 4); 
            const diceElements = [];

            
            this.container.innerHTML = '';

            
            for (let i = 0; i < diceCount; i++) {
                const diceElement = document.createElement('div');
                diceElement.className = 'fallback-dice';
                diceElement.textContent = '🎲';
                diceElement.style.cssText = `
                    position: absolute;
                    font-size: 32px;
                    left: ${20 + i * 60}px;
                    top: 50%;
                    transform: translateY(-50%);
                    animation: rollAnimation 2s ease-out;
                `;
                
                this.container.appendChild(diceElement);
                diceElements.push(diceElement);
            }

            
            this.addFallbackCSS();

            
            setTimeout(() => {
                diceElements.forEach((element, index) => {
                    if (index < results.length) {
                        element.textContent = results[index].toString();
                        element.style.animation = 'none';
                        element.style.fontSize = '24px';
                        element.style.background = '#4285f4';
                        element.style.color = 'white';
                        element.style.borderRadius = '8px';
                        element.style.padding = '8px';
                        element.style.minWidth = '32px';
                        element.style.textAlign = 'center';
                    }
                });
                resolve();
            }, 2000);
        });
    }

    
    addFallbackCSS() {
        if (document.getElementById('dice-fallback-css')) {
            return; 
        }

        const style = document.createElement('style');
        style.id = 'dice-fallback-css';
        style.textContent = `
            @keyframes rollAnimation {
                0% { transform: translateY(-50%) rotate(0deg) scale(1); }
                25% { transform: translateY(-80%) rotate(90deg) scale(1.2); }
                50% { transform: translateY(-50%) rotate(180deg) scale(1); }
                75% { transform: translateY(-20%) rotate(270deg) scale(0.8); }
                100% { transform: translateY(-50%) rotate(360deg) scale(1); }
            }
            .fallback-dice {
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    
    createDiceModels(diceConfig, results) {
        const dice = [];
        const diceCount = Math.min(diceConfig.count, 4); 

        for (let i = 0; i < diceCount; i++) {
            
            let geometry;
            switch (diceConfig.sides) {
                case 4:
                    geometry = new THREE.TetrahedronGeometry(1);
                    break;
                case 6:
                    geometry = new THREE.BoxGeometry(1, 1, 1);
                    break;
                case 8:
                    geometry = new THREE.OctahedronGeometry(1);
                    break;
                case 12:
                    geometry = new THREE.DodecahedronGeometry(1);
                    break;
                case 20:
                    geometry = new THREE.IcosahedronGeometry(1);
                    break;
                default:
                    geometry = new THREE.BoxGeometry(1, 1, 1); 
            }

            const material = new THREE.MeshLambertMaterial({ 
                color: 0x4285f4,
                transparent: true,
                opacity: 0.9
            });

            const die = new THREE.Mesh(geometry, material);
            die.position.x = (i - diceCount / 2) * 2;
            die.position.y = 0;
            die.position.z = 0;

            dice.push(die);
        }

        return dice;
    }

    
    positionDiceForResults(dice, results) {
        dice.forEach((die, index) => {
            
            die.rotation.x = 0;
            die.rotation.y = 0;
            die.rotation.z = 0;
            die.position.y = 0;
            
            
            
        });
    }

    
    clearScene() {
        if (!this.scene) return;

        
        const objectsToRemove = [];
        this.scene.traverse((child) => {
            if (child.isMesh && child !== this.scene) {
                objectsToRemove.push(child);
            }
        });

        objectsToRemove.forEach((object) => {
            this.scene.remove(object);
            if (object.geometry) object.geometry.dispose();
            if (object.material) object.material.dispose();
        });
    }

    
    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        this.clearScene();

        if (this.renderer) {
            this.renderer.dispose();
            if (this.container && this.renderer.domElement) {
                this.container.removeChild(this.renderer.domElement);
            }
        }

        
        if (this.container) {
            this.container.innerHTML = '';
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.container = null;
        this.isInitialized = false;
    }

    
    handleResize() {
        if (!this.renderer || !this.camera || !this.container) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    
    is3DAvailable() {
        return typeof THREE !== 'undefined' && this.isInitialized && this.renderer;
    }
}


if (typeof window !== 'undefined') {
    window.DiceRenderer = DiceRenderer;
}