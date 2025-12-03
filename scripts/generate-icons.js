#!/usr/bin/env node



const fs = require('fs');
const path = require('path');


class IconGenerator {
    constructor() {
        this.iconsDir = path.join(__dirname, '..', 'assets', 'icons');
        this.sizes = [16, 32, 48, 128];
    }

    
    async generateIcons() {
        console.log('🎲 Generating extension icons...');
        
        
        if (!fs.existsSync(this.iconsDir)) {
            fs.mkdirSync(this.iconsDir, { recursive: true });
        }

        
        try {
            await this.generateCanvasIcons();
        } catch (error) {
            console.log('Canvas not available, generating SVG icons...');
            await this.generateSVGIcons();
        }

        console.log('✅ Icons generated successfully!');
    }

    
    async generateCanvasIcons() {
        let Canvas, createCanvas;
        
        try {
            
            const canvas = require('canvas');
            Canvas = canvas;
            createCanvas = canvas.createCanvas;
        } catch (error) {
            throw new Error('Canvas package not available');
        }

        for (const size of this.sizes) {
            const canvas = createCanvas(size, size);
            const ctx = canvas.getContext('2d');
            
            this.drawDiceIcon(ctx, size);
            
            const buffer = canvas.toBuffer('image/png');
            const filename = `dice-${size}.png`;
            const filepath = path.join(this.iconsDir, filename);
            
            fs.writeFileSync(filepath, buffer);
            console.log(`  ✓ Generated ${filename}`);
        }
    }

    
    async generateSVGIcons() {
        for (const size of this.sizes) {
            const svg = this.createSVGIcon(size);
            const filename = `dice-${size}.png`;
            const filepath = path.join(this.iconsDir, filename);
            
            
            
            const pngData = this.createSimplePNG(size);
            fs.writeFileSync(filepath, pngData);
            console.log(`  ✓ Generated ${filename} (placeholder)`);
        }
    }

    
    drawDiceIcon(ctx, size) {
        
        ctx.clearRect(0, 0, size, size);
        
        
        const padding = Math.max(2, size * 0.1);
        const cornerRadius = Math.max(2, size * 0.1);
        
        
        ctx.fillStyle = '#4285f4';
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
        ctx.fill();
        
        
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1, size * 0.02);
        
        
        const diceX = padding;
        const diceY = padding;
        const diceWidth = size - (padding * 2) * 0.7;
        const diceHeight = size - (padding * 2) * 0.7;
        const diceCornerRadius = Math.max(1, size * 0.05);
        
        this.drawRoundedRect(ctx, diceX, diceY, diceWidth, diceHeight, diceCornerRadius);
        ctx.fill();
        
        
        ctx.fillStyle = '#4285f4';
        const dotSize = Math.max(1, size * 0.04);
        const dotSpacing = diceWidth / 4;
        
        if (size >= 32) {
            
            const centerX = diceX + diceWidth / 2;
            const centerY = diceY + diceHeight / 2;
            
            
            this.drawDot(ctx, centerX, centerY, dotSize);
            
            
            this.drawDot(ctx, diceX + dotSpacing, diceY + dotSpacing, dotSize);
            this.drawDot(ctx, diceX + diceWidth - dotSpacing, diceY + dotSpacing, dotSize);
            this.drawDot(ctx, diceX + dotSpacing, diceY + diceHeight - dotSpacing, dotSize);
            this.drawDot(ctx, diceX + diceWidth - dotSpacing, diceY + diceHeight - dotSpacing, dotSize);
        } else {
            
            const centerX = diceX + diceWidth / 2;
            const centerY = diceY + diceHeight / 2;
            
            this.drawDot(ctx, centerX - dotSpacing / 2, centerY - dotSpacing / 2, dotSize);
            this.drawDot(ctx, centerX, centerY, dotSize);
            this.drawDot(ctx, centerX + dotSpacing / 2, centerY + dotSpacing / 2, dotSize);
        }
    }

    
    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    
    drawDot(ctx, x, y, size) {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }

    
    createSVGIcon(size) {
        return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${size/2}" cy="${size/2}" r="${size/2-1}" fill="#4285f4"/>
            <rect x="${size*0.2}" y="${size*0.2}" width="${size*0.6}" height="${size*0.6}" rx="${size*0.05}" fill="white"/>
            <circle cx="${size*0.35}" cy="${size*0.35}" r="${size*0.03}" fill="#4285f4"/>
            <circle cx="${size*0.5}" cy="${size*0.5}" r="${size*0.03}" fill="#4285f4"/>
            <circle cx="${size*0.65}" cy="${size*0.65}" r="${size*0.03}" fill="#4285f4"/>
        </svg>`;
    }

    
    createSimplePNG(size) {
        
        
        const width = size;
        const height = size;
        
        
        const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
        
        
        const ihdr = Buffer.alloc(25);
        ihdr.writeUInt32BE(13, 0); 
        ihdr.write('IHDR', 4);
        ihdr.writeUInt32BE(width, 8);
        ihdr.writeUInt32BE(height, 12);
        ihdr.writeUInt8(8, 16); 
        ihdr.writeUInt8(2, 17); 
        ihdr.writeUInt8(0, 18); 
        ihdr.writeUInt8(0, 19); 
        ihdr.writeUInt8(0, 20); 
        
        
        const crc = require('crypto').createHash('crc32');
        
        ihdr.writeUInt32BE(0, 21);
        
        
        const iend = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82]);
        
        
        
        return Buffer.concat([signature, ihdr, iend]);
    }
}


if (require.main === module) {
    const generator = new IconGenerator();
    generator.generateIcons().catch(error => {
        console.error('Failed to generate icons:', error.message);
        process.exit(1);
    });
}

module.exports = IconGenerator;