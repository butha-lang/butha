// packageManager.js

const fs = require('fs');
const path = require('path');
const { ButhaError, PackageError } = require('./error');

// Class to represent the Package Manager
class PackageManager {
    constructor(baseDir) {
        this.baseDir = baseDir;
        this.packagesDir = path.join(baseDir, 'packages');
        this.metadataFile = path.join(this.baseDir, 'package.json');
        this.init();
    }

    // Initialize the package manager
    init() {
        if (!fs.existsSync(this.packagesDir)) {
            fs.mkdirSync(this.packagesDir, { recursive: true });
        }
        if (!fs.existsSync(this.metadataFile)) {
            fs.writeFileSync(this.metadataFile, JSON.stringify({ dependencies: {} }, null, 2));
        }
    }

    // Load package metadata
    loadMetadata() {
        try {
            const data = fs.readFileSync(this.metadataFile);
            return JSON.parse(data);
        } catch (error) {
            throw new PackageError('Failed to load package metadata');
        }
    }

    // Save package metadata
    saveMetadata(metadata) {
        try {
            fs.writeFileSync(this.metadataFile, JSON.stringify(metadata, null, 2));
        } catch (error) {
            throw new PackageError('Failed to save package metadata');
        }
    }

    // Install a package
    install(packageName, version) {
        const metadata = this.loadMetadata();
        if (metadata.dependencies[packageName]) {
            throw new ButhaError(`Package ${packageName} is already installed`);
        }

        // Simulate package installation
        this.downloadPackage(packageName, version);
        metadata.dependencies[packageName] = version;
        this.saveMetadata(metadata);
    }

    // Update a package
    update(packageName, newVersion) {
        const metadata = this.loadMetadata();
        if (!metadata.dependencies[packageName]) {
            throw new ButhaError(`Package ${packageName} is not installed`);
        }

        // Simulate package update
        this.downloadPackage(packageName, newVersion);
        metadata.dependencies[packageName] = newVersion;
        this.saveMetadata(metadata);
    }

    // Remove a package
    remove(packageName) {
        const metadata = this.loadMetadata();
        if (!metadata.dependencies[packageName]) {
            throw new ButhaError(`Package ${packageName} is not installed`);
        }

        // Simulate package removal
        this.deletePackage(packageName);
        delete metadata.dependencies[packageName];
        this.saveMetadata(metadata);
    }

    // Download a package (simulation)
    downloadPackage(packageName, version) {
        console.log(`Downloading package ${packageName} version ${version}...`);
        // Here, you would implement the actual download logic
    }

    // Delete a package (simulation)
    deletePackage(packageName) {
        console.log(`Deleting package ${packageName}...`);
        // Here, you would implement the actual delete logic
    }

    // List all installed packages
    listInstalledPackages() {
        const metadata = this.loadMetadata();
        return metadata.dependencies;
    }
}

// Example usage
const packageManager = new PackageManager(__dirname);

try {
    // Install a new package
    packageManager.install('example-package', '1.0.0');

    // Update an existing package
    packageManager.update('example-package', '1.1.0');

    // List all installed packages
    console.log('Installed packages:', packageManager.listInstalledPackages());

    // Remove a package
    packageManager.remove('example-package');
} catch (error) {
    console.error('Package Manager error:', error.toString());
}

module.exports = PackageManager;
