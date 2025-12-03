#!/usr/bin/env node



const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ExtensionPackager {
    constructor() {
        this.rootDir = path.join(__dirname, '..');
        this.distDir = path.join(this.rootDir, 'dist');
        this.packageInfo = require('../package.json');
        this.version = this.packageInfo.version;
        this.zipName = `dice-roller-extension-v${this.version}.zip`;
    }

    
    async package() {
        console.log('🎲 Packaging Dice Roller Extension...');
        console.log(`📦 Version: ${this.version}`);
        
        try {
            this.createDistDirectory();
            this.copyFiles();
            this.validateManifest();
            this.createZip();
            this.generateChecksums();
            this.showSummary();
            
            console.log('✅ Packaging completed successfully!');
            
        } catch (error) {
            console.error('❌ Packaging failed:', error.message);
            process.exit(1);
        }
    }

    
    createDistDirectory() {
        console.log('📁 Creating distribution directory...');
        
        if (fs.existsSync(this.distDir)) {
            fs.rmSync(this.distDir, { recursive: true, force: true });
        }
        
        fs.mkdirSync(this.distDir, { recursive: true });
    }

    
    copyFiles() {
        console.log('📋 Copying files...');
        
        const filesToCopy = [
            'manifest.json',
            'content-script.js',
            'popup/',
            '3d-animation/',
            'utils/',
            'assets/',
            'README.md',
            'LICENSE',
            'INSTALL.md'
        ];

        const tempDir = path.join(this.distDir, 'dice-roller-extension');
        fs.mkdirSync(tempDir, { recursive: true });

        filesToCopy.forEach(file => {
            const sourcePath = path.join(this.rootDir, file);
            const destPath = path.join(tempDir, file);
            
            if (fs.existsSync(sourcePath)) {
                if (fs.statSync(sourcePath).isDirectory()) {
                    this.copyDirectory(sourcePath, destPath);
                } else {
                    fs.copyFileSync(sourcePath, destPath);
                }
                console.log(`  ✓ ${file}`);
            } else {
                console.warn(`  ⚠️  ${file} not found, skipping`);
            }
        });
    }

    
    copyDirectory(source, destination) {
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }

        const files = fs.readdirSync(source);
        
        files.forEach(file => {
            const sourcePath = path.join(source, file);
            const destPath = path.join(destination, file);
            
            if (fs.statSync(sourcePath).isDirectory()) {
                this.copyDirectory(sourcePath, destPath);
            } else {
                
                if (!this.shouldSkipFile(file)) {
                    fs.copyFileSync(sourcePath, destPath);
                }
            }
        });
    }

    
    shouldSkipFile(filename) {
        const skipPatterns = [
            /\.test\.js$/,
            /test-runner\.html$/,
            /\.gitkeep$/,
            /\.DS_Store$/,
            /Thumbs\.db$/
        ];

        return skipPatterns.some(pattern => pattern.test(filename));
    }

    
    validateManifest() {
        console.log('🔍 Validating manifest...');
        
        const manifestPath = path.join(this.distDir, 'dice-roller-extension', 'manifest.json');
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        
        const requiredFields = ['manifest_version', 'name', 'version', 'description'];
        const missingFields = requiredFields.filter(field => !manifest[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required manifest fields: ${missingFields.join(', ')}`);
        }

        
        if (manifest.version !== this.version) {
            console.warn(`⚠️  Version mismatch: package.json (${this.version}) vs manifest.json (${manifest.version})`);
        }

        
        if (!manifest.permissions || !manifest.permissions.includes('activeTab')) {
            throw new Error('Missing required activeTab permission');
        }

        console.log('  ✓ Manifest validation passed');
    }

    
    createZip() {
        console.log('🗜️  Creating ZIP file...');
        
        const zipPath = path.join(this.distDir, this.zipName);
        const sourceDir = path.join(this.distDir, 'dice-roller-extension');
        
        try {
            
            execSync(`cd "${this.distDir}" && zip -r "${this.zipName}" dice-roller-extension/`, { stdio: 'pipe' });
            console.log(`  ✓ Created ${this.zipName}`);
        } catch (error) {
            
            try {
                const powershellCmd = `Compress-Archive -Path "${sourceDir}" -DestinationPath "${zipPath}" -Force`;
                execSync(`powershell -Command "${powershellCmd}"`, { stdio: 'pipe' });
                console.log(`  ✓ Created ${this.zipName} (using PowerShell)`);
            } catch (psError) {
                throw new Error('Failed to create ZIP file. Please install zip utility or use PowerShell.');
            }
        }
    }

    
    generateChecksums() {
        console.log('🔐 Generating checksums...');
        
        const zipPath = path.join(this.distDir, this.zipName);
        const checksumPath = path.join(this.distDir, `${this.zipName}.checksums.txt`);
        
        try {
            
            let checksum;
            try {
                checksum = execSync(`sha256sum "${zipPath}"`, { encoding: 'utf8' }).trim();
            } catch (error) {
                
                try {
                    const output = execSync(`powershell -Command "Get-FileHash '${zipPath}' -Algorithm SHA256 | Select-Object Hash"`, { encoding: 'utf8' });
                    const hash = output.match(/([A-F0-9]{64})/i);
                    if (hash) {
                        checksum = `${hash[1].toLowerCase()}  ${this.zipName}`;
                    }
                } catch (psError) {
                    console.warn('  ⚠️  Could not generate checksum');
                    return;
                }
            }
            
            if (checksum) {
                fs.writeFileSync(checksumPath, checksum + '\n');
                console.log('  ✓ Generated SHA256 checksum');
            }
            
        } catch (error) {
            console.warn('  ⚠️  Could not generate checksum:', error.message);
        }
    }

    
    showSummary() {
        console.log('\n📊 Packaging Summary:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const zipPath = path.join(this.distDir, this.zipName);
        const stats = fs.statSync(zipPath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        
        console.log(`📦 Package: ${this.zipName}`);
        console.log(`📏 Size: ${sizeKB} KB`);
        console.log(`📍 Location: ${this.distDir}`);
        console.log(`🏷️  Version: ${this.version}`);
        
        console.log('\n📋 Installation Instructions:');
        console.log('1. Extract the ZIP file');
        console.log('2. Open Chrome and go to chrome://extensions/');
        console.log('3. Enable "Developer mode"');
        console.log('4. Click "Load unpacked" and select the extracted folder');
        console.log('5. Visit https://gemini.google.com to use the extension');
        
        console.log('\n🔗 Files included:');
        this.listPackageContents();
    }

    
    listPackageContents() {
        const sourceDir = path.join(this.distDir, 'dice-roller-extension');
        this.listDirectory(sourceDir, '');
    }

    
    listDirectory(dir, prefix) {
        const files = fs.readdirSync(dir).sort();
        
        files.forEach((file, index) => {
            const filePath = path.join(dir, file);
            const isLast = index === files.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            
            console.log(`${prefix}${connector}${file}`);
            
            if (fs.statSync(filePath).isDirectory()) {
                this.listDirectory(filePath, newPrefix);
            }
        });
    }
}


if (require.main === module) {
    const packager = new ExtensionPackager();
    packager.package().catch(error => {
        console.error('Packaging failed:', error);
        process.exit(1);
    });
}

module.exports = ExtensionPackager;