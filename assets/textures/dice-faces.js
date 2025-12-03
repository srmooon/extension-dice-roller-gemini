
class DiceFaceTextures {
    constructor() {
        this.textures = {};
        this.patterns = {};
        this.initialized = false;
    }

    
    initialize() {
        this.createD6Faces();
        this.createD20Faces();
        this.createD4Faces();
        this.createD8Faces();
        this.createD10Faces();
        this.createD12Faces();
        this.createD100Faces();
        
        this.initialized = true;
        console.log('🎲 Dice face textures initialized');
    }

    
    createD6Faces() {
        this.textures.d6 = {};
        
        for (let i = 1; i <= 6; i++) {
            this.textures.d6[i] = this.createNumberTexture(i, 64, '#ffffff', '#000000');
        }
    }

    
    createD20Faces() {
        this.textures.d20 = {};
        
        for (let i = 1; i <= 20; i++) {
            this.textures.d20[i] = this.createNumberTexture(i, 32, '#ffffff', '#000000');
        }
    }

    
    createD4Faces() {
        this.textures.d4 = {};
        
        for (let i = 1; i <= 4; i++) {
            this.textures.d4[i] = this.createNumberTexture(i, 48, '#ffffff', '#000000');
        }
    }

    
    createD8Faces() {
        this.textures.d8 = {};
        
        for (let i = 1; i <= 8; i++) {
            this.textures.d8[i] = this.createNumberTexture(i, 48, '#ffffff', '#000000');
        }
    }

    
    createD10Faces() {
        this.textures.d10 = {};
        
        for (let i = 0; i <= 9; i++) {
            this.textures.d10[i] = this.createNumberTexture(i, 48, '#ffffff', '#000000');
        }
    }

    
    createD12Faces() {
        this.textures.d12 = {};
        
        for (let i = 1; i <= 12; i++) {
            this.textures.d12[i] = this.createNumberTexture(i, 40, '#ffffff', '#000000');
        }
    }

    
    createD100Faces() {
        this.textures.d100 = {};
        
        
        for (let i = 0; i <= 9; i++) {
            const value = i * 10;
            const displayValue = value === 0 ? '00' : value.toString();
            this.textures.d100[value] = this.createNumberTexture(displayValue, 40, '#ffffff', '#000000');
        }
    }

    
    createNumberTexture(number, size, bgColor, textColor) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);

        
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, size - 2, size - 2);

        
        ctx.fillStyle = textColor;
        ctx.font = `bold ${Math.floor(size * 0.6)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(number.toString(), size / 2, size / 2);

        return canvas;
    }

    
    createDotTexture(dots, size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, size - 2, size - 2);

        
        ctx.fillStyle = '#000000';
        const dotSize = size * 0.08;
        const margin = size * 0.2;
        const center = size / 2;

        switch (dots) {
            case 1:
                this.drawDot(ctx, center, center, dotSize);
                break;
            case 2:
                this.drawDot(ctx, margin, margin, dotSize);
                this.drawDot(ctx, size - margin, size - margin, dotSize);
                break;
            case 3:
                this.drawDot(ctx, margin, margin, dotSize);
                this.drawDot(ctx, center, center, dotSize);
                this.drawDot(ctx, size - margin, size - margin, dotSize);
                break;
            case 4:
                this.drawDot(ctx, margin, margin, dotSize);
                this.drawDot(ctx, size - margin, margin, dotSize);
                this.drawDot(ctx, margin, size - margin, dotSize);
                this.drawDot(ctx, size - margin, size - margin, dotSize);
                break;
            case 5:
                this.drawDot(ctx, margin, margin, dotSize);
                this.drawDot(ctx, size - margin, margin, dotSize);
                this.drawDot(ctx, center, center, dotSize);
                this.drawDot(ctx, margin, size - margin, dotSize);
                this.drawDot(ctx, size - margin, size - margin, dotSize);
                break;
            case 6:
                this.drawDot(ctx, margin, margin, dotSize);
                this.drawDot(ctx, size - margin, margin, dotSize);
                this.drawDot(ctx, margin, center, dotSize);
                this.drawDot(ctx, size - margin, center, dotSize);
                this.drawDot(ctx, margin, size - margin, dotSize);
                this.drawDot(ctx, size - margin, size - margin, dotSize);
                break;
        }

        return canvas;
    }

    
    drawDot(ctx, x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    
    getTexture(dieType, value) {
        if (!this.initialized) {
            this.initialize();
        }

        if (this.textures[dieType] && this.textures[dieType][value]) {
            return this.textures[dieType][value];
        }

        return null;
    }

    
    createThreeTexture(canvas) {
        if (typeof THREE === 'undefined') {
            return null;
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        return texture;
    }

    
    getAllTextures(dieType) {
        if (!this.initialized) {
            this.initialize();
        }

        return this.textures[dieType] || {};
    }

    
    createMaterial(dieType, value, materialOptions = {}) {
        if (typeof THREE === 'undefined') {
            return null;
        }

        const canvas = this.getTexture(dieType, value);
        if (!canvas) {
            return null;
        }

        const texture = this.createThreeTexture(canvas);
        
        const defaultOptions = {
            map: texture,
            transparent: false,
            opacity: 1.0
        };

        const options = { ...defaultOptions, ...materialOptions };
        return new THREE.MeshLambertMaterial(options);
    }

    
    getAvailableDieTypes() {
        return ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
    }

    
    dispose() {
        
        Object.values(this.textures).forEach(dieTextures => {
            Object.values(dieTextures).forEach(texture => {
                if (texture && texture.dispose) {
                    texture.dispose();
                }
            });
        });

        this.textures = {};
        this.patterns = {};
        this.initialized = false;
    }
}


if (typeof window !== 'undefined') {
    window.DiceFaceTextures = DiceFaceTextures;
}