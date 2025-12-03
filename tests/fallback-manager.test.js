
describe('FallbackManager', ({ it, beforeEach }) => {
    let manager;
    
    beforeEach(() => {
        manager = new FallbackManager();
    });
    
    it('should initialize correctly', () => {
        expect(manager).toBeTruthy();
        expect(typeof manager.capabilities).toBe('object');
        expect(typeof manager.fallbackLevel).toBe('number');
        expect(manager.fallbackLevel).toBeGreaterThan(-1);
        expect(manager.fallbackLevel).toBeLessThan(4);
    });
    
    it('should detect capabilities', () => {
        expect(typeof manager.capabilities.webgl).toBe('boolean');
        expect(typeof manager.capabilities.threejs).toBe('boolean');
        expect(typeof manager.capabilities.canvas).toBe('boolean');
        expect(typeof manager.capabilities.css3d).toBe('boolean');
    });
    
    it('should be ready after initialization', () => {
        expect(manager.isReady()).toBeTruthy();
    });
    
    it('should provide renderer config', () => {
        const config = manager.getRendererConfig();
        expect(config).toBeTruthy();
        expect(typeof config.type).toBe('string');
        expect(typeof config.name).toBe('string');
        expect(typeof config.description).toBe('string');
        expect(Array.isArray(config.features)).toBeTruthy();
    });
    
    it('should create appropriate renderer', () => {
        const container = document.createElement('div');
        const renderer = manager.createRenderer(container);
        expect(renderer).toBeTruthy();
        expect(typeof renderer.type).toBe('string');
    });
    
    it('should provide capability report', () => {
        const report = manager.getCapabilityReport();
        expect(report).toBeTruthy();
        expect(typeof report.webgl).toBe('object');
        expect(typeof report.threejs).toBe('object');
        expect(typeof report.canvas).toBe('object');
        expect(typeof report.css3d).toBe('object');
        expect(typeof report.currentLevel).toBe('number');
        expect(typeof report.currentConfig).toBe('object');
    });
    
    it('should check features correctly', () => {
        const config = manager.getRendererConfig();
        config.features.forEach(feature => {
            expect(manager.hasFeature(feature)).toBeTruthy();
        });
        
        expect(manager.hasFeature('nonexistent_feature')).toBeFalsy();
    });
    
    it('should provide performance recommendations', () => {
        const recommendation = manager.getPerformanceRecommendation();
        expect(recommendation).toBeTruthy();
        expect(typeof recommendation.maxDice).toBe('number');
        expect(typeof recommendation.animationDuration).toBe('number');
        expect(typeof recommendation.quality).toBe('string');
        expect(Array.isArray(recommendation.effects)).toBeTruthy();
    });
    
    it('should handle forced fallback', () => {
        const originalLevel = manager.fallbackLevel;
        
        manager.forceFallback(2);
        expect(manager.fallbackLevel).toBe(2);
        
        manager.forceFallback(-1); 
        expect(manager.fallbackLevel).toBe(2); 
        
        manager.forceFallback(5); 
        expect(manager.fallbackLevel).toBe(2); 
        
        manager.resetToOptimal();
        
        expect(manager.fallbackLevel).toBeGreaterThan(-1);
        expect(manager.fallbackLevel).toBeLessThan(4);
    });
    
    it('should handle rendering errors', () => {
        const container = document.createElement('div');
        const error = new Error('Test rendering error');
        
        const originalLevel = manager.fallbackLevel;
        const fallbackRenderer = manager.handleRenderingError(error, container);
        
        expect(fallbackRenderer).toBeTruthy();
        expect(manager.fallbackLevel).toBeGreaterThan(originalLevel - 1);
    });
    
    it('should test WebGL detection', () => {
        const webglSupported = manager.testWebGL();
        expect(typeof webglSupported).toBe('boolean');
        expect(webglSupported).toBe(manager.capabilities.webgl);
    });
    
    it('should test Canvas detection', () => {
        const canvasSupported = manager.testCanvas();
        expect(typeof canvasSupported).toBe('boolean');
        expect(canvasSupported).toBe(manager.capabilities.canvas);
        
        expect(canvasSupported).toBeTruthy();
    });
    
    it('should test CSS 3D detection', () => {
        const css3dSupported = manager.testCSS3D();
        expect(typeof css3dSupported).toBe('boolean');
        expect(css3dSupported).toBe(manager.capabilities.css3d);
    });
    
    it('should create different renderer types', () => {
        const container = document.createElement('div');
        
        
        for (let level = 0; level <= 3; level++) {
            manager.forceFallback(level);
            const renderer = manager.createRenderer(container);
            expect(renderer).toBeTruthy();
            
            const config = manager.getRendererConfig();
            expect(renderer.type).toBe(config.type);
        }
    });
    
    it('should show fallback notification', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        const error = new Error('Test error');
        manager.showFallbackNotification(container, error);
        
        
        const notification = container.querySelector('.fallback-notification');
        expect(notification).toBeTruthy();
        
        
        document.body.removeChild(container);
    });
    
    it('should handle different renderer types', () => {
        const container = document.createElement('div');
        
        
        const threeDRenderer = new ThreeDRenderer(container);
        expect(threeDRenderer.type).toBe('3d');
        
        
        const canvasRenderer = new CanvasRenderer(container);
        expect(canvasRenderer.type).toBe('canvas');
        
        
        const css3dRenderer = new CSS3DRenderer(container);
        expect(css3dRenderer.type).toBe('css3d');
        
        
        const basicRenderer = new BasicRenderer(container);
        expect(basicRenderer.type).toBe('basic');
    });
});