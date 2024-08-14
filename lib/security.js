// security.js

const crypto = require('crypto');

class SecurityManager {
    constructor() {
        this.algorithm = 'aes-256-cbc'; // Encryption algorithm
        this.key = crypto.randomBytes(32); // Secret key for encryption
        this.iv = crypto.randomBytes(16);  // Initialization vector
    }

    // Encrypt data using AES-256-CBC
    encrypt(data) {
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.key), this.iv);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return { iv: this.iv.toString('hex'), encryptedData: encrypted };
    }

    // Decrypt data using AES-256-CBC
    decrypt(encryptedData, iv) {
        const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    // Hash data using SHA-256
    hash(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    // Validate data against a given hash
    validate(data, hash) {
        const dataHash = this.hash(data);
        return dataHash === hash;
    }
}

// Example usage
const securityManager = new SecurityManager();

// Encrypt and decrypt example
const originalData = 'Sensitive information';
const { iv, encryptedData } = securityManager.encrypt(originalData);
console.log('Encrypted Data:', encryptedData);

const decryptedData = securityManager.decrypt(encryptedData, iv);
console.log('Decrypted Data:', decryptedData);

// Hash and validate example
const dataToHash = 'Password123';
const hash = securityManager.hash(dataToHash);
console.log('Hash:', hash);

const isValid = securityManager.validate(dataToHash, hash);
console.log('Is Valid:', isValid);

module.exports = {
    SecurityManager,
    securityManager
};
