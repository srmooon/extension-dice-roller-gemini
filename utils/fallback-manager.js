
class FallbackManager {
    constructor() {
        this.capabilities = {
            webgl: false,
            threejs: false,
            canvas: false,
            css3d: false
        };
        
        this.fallbackLevel = 0; 
        this.detectionComplete = false;
        
        this.detectCapabilities();
    }

    
    detectCapabilities() {
        try {
            
            this.capabilities.webgl = this.testWebGL();
            
            
            this.capabilities.threejs = typeof THREE !== 'undefined';
            
            
            this.capabilities.canvas = this.testCanvas();
            
            
            this.capabilities.css3d = this.testCSS3D();
            
            
            this.determineFallbackLevel();
            
            this.detectionComplete = true;
            console.log('🎲 Capabilities detected:', this.capabilities);
            console.log('🎲 Fallback level:', this.fallbackLevel);
            
        } catch (error) {
            console.error('🎲 Capability detection failed:', error);
            this.fallbackLevel = 3; 
            this.detectionComplete = true;
        }
    }

    
    testWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return gl !== null;
        } catch (error) {
            return false;
        }
    }

    
    testCanvas() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext && canvas.getContext('2d'));
        } catch (error) {
            return false;
        }
    }

    
    testCSS3D() {
        try {
            const testElement = document.createElement('div');
            testElement.style.transform = 'translateZ(0)';
            return testElement.style.transform !== '';
        } catch (error) {
            return false;
        }
    }

    
    determineFallbackLevel() {
        if (this.capabilities.webgl && this.capabilities.threejs) {
            this.fallbackLevel = 0; 
        } else if (this.capabilities.canvas) {
            this.fallbackLevel = 1; 
        } else if (this.capabilities.css3d) {
            this.fallbackLevel = 2; 
        } else {
            this.fallbackLevel = 3; 
        }
    }

    
    getRendererConfig() {
        const configs = {
            0: {
                type: '3d',
                name: 'Three.js WebGL',
                description: 'Renderização 3D completa com WebGL',
                features: ['physics', 'lighting', 'textures', 'shadows']
            },
            1: {
                type: 'canvas',
                name: '2D Canvas',
                description: 'Animação 2D com Canvas',
                features: ['smooth_animation', 'custom_drawing']
            },
            2: {
                type: 'css3d',
                name: 'CSS 3D',
                description: 'Animações CSS com transformações 3D',
                features: ['css_transforms', 'transitions']
            },
            3: {
                type: 'basic',
                name: 'Básico',
                description: 'Animações simples com CSS',
                features: ['basic_transitions']
            }
        };

        return configs[this.fallbackLevel];
    }

    
    createRenderer(container) {
        const config = this.getRendererConfig();
        
        switch (config.type) {
            case '3d':
                return new ThreeDRenderer(container);
            case 'canvas':
                return new CanvasRenderer(container);
            case 'css3d':
                return new CSS3DRenderer(container);
            default:
                return new BasicRenderer(container);
        }
    }

    
    handleRenderingError(error, container) {
        console.warn('🎲 Rendering error, falling back:', error);
        
        
        this.fallbackLevel = Math.min(this.fallbackLevel + 1, 3);
        
        
        this.showFallbackNotification(container, error);
        
        
        return this.createRenderer(container);
    }

    
    showFallbackNotification(container, error) {
        const config = this.getRendererConfig();
        
        
        const notification = document.createElement('div');
        notification.className = 'fallback-notification';
        notification.innerHTML = `
            <div class="fallback-message">
                <span class="fallback-icon">⚠️</span>
                <span class="fallback-text">Usando modo: ${config.name}</span>
            </div>
        `;
        
        
        notification.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(255, 193, 7, 0.9);
            color: #856404;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        
        this.addFallbackNotificationCSS();
        
        
        if (container.style.position !== 'relative') {
            container.style.position = 'relative';
        }
        container.appendChild(notification);
        
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    
    addFallbackNotificationCSS() {
        if (document.getElementById('fallback-notification-css')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'fallback-notification-css';
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-10px); }
                20% { opacity: 1; transform: translateY(0); }
                80% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-10px); }
            }
            
            .fallback-notification {
                pointer-events: none;
            }
            
            .fallback-message {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .fallback-icon {
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
    }

    
    getCapabilityReport() {
        return {
            webgl: {
                supported: this.capabilities.webgl,
                description: 'Hardware-accelerated 3D graphics'
            },
            threejs: {
                supported: this.capabilities.threejs,
                description: 'Three.js 3D library'
            },
            canvas: {
                supported: this.capabilities.canvas,
                description: '2D Canvas drawing'
            },
            css3d: {
                supported: this.capabilities.css3d,
                description: 'CSS 3D transforms'
            },
            currentLevel: this.fallbackLevel,
            currentConfig: this.getRendererConfig()
        };
    }

    
    hasFeature(feature) {
        const config = this.getRendererConfig();
        return config.features.includes(feature);
    }

    
    getPerformanceRecommendation() {
        const recommendations = {
            0: {
                maxDice: 6,
                animationDuration: 2500,
                quality: 'high',
                effects: ['shadows', 'reflections', 'particles']
            },
            1: {
                maxDice: 4,
                animationDuration: 2000,
                quality: 'medium',
                effects: ['smooth_transitions']
            },
            2: {
                maxDice: 3,
                animationDuration: 1500,
                quality: 'low',
                effects: ['basic_transforms']
            },
            3: {
                maxDice: 2,
                animationDuration: 1000,
                quality: 'minimal',
                effects: ['fade_transitions']
            }
        };

        return recommendations[this.fallbackLevel];
    }

    
    isReady() {
        return this.detectionComplete;
    }

    
    forceFallback(level) {
        if (level >= 0 && level <= 3) {
            this.fallbackLevel = level;
            console.log(`🎲 Forced fallback to level ${level}`);
        }
    }

    
    resetToOptimal() {
        this.determineFallbackLevel();
        console.log(`🎲 Reset to optimal fallback level ${this.fallbackLevel}`);
    }
}




class ThreeDRenderer {
    constructor(container) {
        this.container = container;
        this.type = '3d';
    }

    async animate(diceConfig, results) {
        
        const renderer = new DiceRenderer();
        renderer.initialize(this.container);
        return renderer.animateEnhancedRoll(diceConfig, results);
    }
}


class CanvasRenderer {
    constructor(container) {
        this.container = container;
        this.type = 'canvas';
        this.canvas = null;
        this.ctx = null;
    }

    async animate(diceConfig, results) {
        return new Promise((resolve) => {
            this.setupCanvas();
            this.animateCanvasDice(diceConfig, results, resolve);
        });
    }

    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.ctx = this.canvas.getContext('2d');
        
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
    }

    animateCanvasDice(diceConfig, results, resolve) {
        const startTime = Date.now();
        const duration = 2000;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            this.drawFrame(progress, diceConfig, results);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                resolve();
            }
        };
        
        animate();
    }

    drawFrame(progress, diceConfig, results) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const diceCount = Math.min(diceConfig.count, 4);
        const centerY = this.canvas.height / 2;
        
        for (let i = 0; i < diceCount; i++) {
            const x = (this.canvas.width / (diceCount + 1)) * (i + 1);
            const y = centerY + Math.sin(progress * Math.PI * 4 + i) * 20;
            
            this.drawDie(x, y, progress, i < results.length ? results[i] : '?');
        }
    }

    drawDie(x, y, progress, value) {
        const size = 30;
        const rotation = progress * Math.PI * 4;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        
        this.ctx.fillStyle = '#4285f4';
        this.ctx.fillRect(-size/2, -size/2, size, size);
        
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-size/2, -size/2, size, size);
        
        
        if (progress > 0.8) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(value.toString(), 0, 0);
        }
        
        this.ctx.restore();
    }
}


class CSS3DRenderer {
    constructor(container) {
        this.container = container;
        this.type = 'css3d';
    }

    async animate(diceConfig, results) {
        return new Promise((resolve) => {
            this.container.innerHTML = '';
            this.createCSS3DDice(diceConfig, results, resolve);
        });
    }

    createCSS3DDice(diceConfig, results, resolve) {
        const diceCount = Math.min(diceConfig.count, 3);
        
        for (let i = 0; i < diceCount; i++) {
            const diceElement = this.createCSS3DDie(i, diceCount);
            this.container.appendChild(diceElement);
            
            
            setTimeout(() => {
                if (i < results.length) {
                    diceElement.textContent = results[i].toString();
                    diceElement.style.animation = 'none';
                    diceElement.style.background = '#4285f4';
                    diceElement.style.color = 'white';
                }
            }, 1800);
        }
        
        setTimeout(resolve, 2500);
    }

    createCSS3DDie(index, total) {
        const die = document.createElement('div');
        die.className = 'css3d-die';
        die.textContent = '🎲';
        die.style.cssText = `
            position: absolute;
            left: ${30 + index * 60}px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 28px;
            animation: css3dRoll 2s ease-out;
            transform-style: preserve-3d;
        `;
        
        this.addCSS3DStyles();
        return die;
    }

    addCSS3DStyles() {
        if (document.getElementById('css3d-dice-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'css3d-dice-styles';
        style.textContent = `
            @keyframes css3dRoll {
                0% { transform: translateY(-50%) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
                25% { transform: translateY(-70%) rotateX(90deg) rotateY(90deg) rotateZ(45deg); }
                50% { transform: translateY(-50%) rotateX(180deg) rotateY(180deg) rotateZ(90deg); }
                75% { transform: translateY(-60%) rotateX(270deg) rotateY(270deg) rotateZ(135deg); }
                100% { transform: translateY(-50%) rotateX(360deg) rotateY(360deg) rotateZ(180deg); }
            }
        `;
        document.head.appendChild(style);
    }
}


class BasicRenderer {
    constructor(container) {
        this.container = container;
        this.type = 'basic';
    }

    async animate(diceConfig, results) {
        return new Promise((resolve) => {
            this.container.innerHTML = '';
            this.createBasicDice(diceConfig, results, resolve);
        });
    }

    createBasicDice(diceConfig, results, resolve) {
        const diceCount = Math.min(diceConfig.count, 2);
        
        for (let i = 0; i < diceCount; i++) {
            const diceElement = this.createBasicDie(i);
            this.container.appendChild(diceElement);
            
            setTimeout(() => {
                if (i < results.length) {
                    diceElement.textContent = results[i].toString();
                    diceElement.style.background = '#4285f4';
                    diceElement.style.color = 'white';
                }
            }, 1000 + i * 200);
        }
        
        setTimeout(resolve, 2000);
    }

    createBasicDie(index) {
        const die = document.createElement('div');
        die.textContent = '🎲';
        die.style.cssText = `
            display: inline-block;
            margin: 0 10px;
            font-size: 24px;
            padding: 8px;
            border-radius: 4px;
            animation: basicPulse 1s ease-in-out infinite;
        `;
        
        this.addBasicStyles();
        return die;
    }

    addBasicStyles() {
        if (document.getElementById('basic-dice-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'basic-dice-styles';
        style.textContent = `
            @keyframes basicPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
    }
}


if (typeof window !== 'undefined') {
    window.FallbackManager = FallbackManager;
    window.ThreeDRenderer = ThreeDRenderer;
    window.CanvasRenderer = CanvasRenderer;
    window.CSS3DRenderer = CSS3DRenderer;
    window.BasicRenderer = BasicRenderer;
}