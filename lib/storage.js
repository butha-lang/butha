// storage.js

const fs = require('fs');
const path = require('path');

class StorageManager {
    constructor(storageDir = './storage') {
        this.storageDir = storageDir;
        // Ensure the storage directory exists
        if (!fs.existsSync(this.storageDir)) {
            fs.mkdirSync(this.storageDir, { recursive: true });
        }
    }

    // Save data to a file
    save(key, data) {
        const filePath = path.join(this.storageDir, this._getFileName(key));
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    // Load data from a file
    load(key) {
        const filePath = path.join(this.storageDir, this._getFileName(key));
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } else {
            throw new Error(`Data with key "${key}" not found.`);
        }
    }

    // Delete a file
    delete(key) {
        const filePath = path.join(this.storageDir, this._getFileName(key));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        } else {
            throw new Error(`Data with key "${key}" not found.`);
        }
    }

    // Check if data exists
    exists(key) {
        const filePath = path.join(this.storageDir, this._getFileName(key));
        return fs.existsSync(filePath);
    }

    // List all stored keys
    listKeys() {
        return fs.readdirSync(this.storageDir).map(file => this._getKeyFromFileName(file));
    }

    // Helper method to generate file name from key
    _getFileName(key) {
        return `${key}.json`;
    }

    // Helper method to extract key from file name
    _getKeyFromFileName(fileName) {
        return fileName.replace('.json', '');
    }
}

// Example usage
const storageManager = new StorageManager();

// Save data
storageManager.save('user1', { name: 'Alice', age: 30 });
storageManager.save('user2', { name: 'Bob', age: 25 });

// Load data
try {
    const user1 = storageManager.load('user1');
    console.log('User1:', user1);
} catch (error) {
    console.error(error.message);
}

// Check existence
console.log('Does user2 exist?', storageManager.exists('user2'));

// List all keys
console.log('Stored keys:', storageManager.listKeys());

// Delete data
try {
    storageManager.delete('user1');
    console.log('User1 deleted successfully.');
} catch (error) {
    console.error(error.message);
}

// List all keys again
console.log('Stored keys after deletion:', storageManager.listKeys());

module.exports = {
    StorageManager,
    storageManager
};
