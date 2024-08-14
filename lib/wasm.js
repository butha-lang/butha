// wasm.js

const fs = require('fs');
const path = require('path');
const { ButhaError, RuntimeError } = require('./error');

// Class to handle WebAssembly integration
class WebAssemblyManager {
    constructor() {
        this.modules = new Map(); // Map to store loaded WebAssembly modules
    }

    // Load a WebAssembly module from a file
    async loadModule(filePath) {
        try {
            const fullPath = path.resolve(filePath);
            if (!fs.existsSync(fullPath)) {
                throw new ButhaError(`WASM file ${filePath} does not exist`);
            }

            const wasmBuffer = fs.readFileSync(fullPath);
            const wasmModule = await WebAssembly.compile(wasmBuffer);
            const wasmInstance = await WebAssembly.instantiate(wasmModule);

            this.modules.set(filePath, wasmInstance);
            console.log(`WASM module ${filePath} loaded successfully`);
            return wasmInstance;
        } catch (error) {
            throw new RuntimeError(`Error loading WASM module: ${error.message}`);
        }
    }

    // Call a function from a loaded WebAssembly module
    callFunction(modulePath, functionName, ...args) {
        const wasmInstance = this.modules.get(modulePath);
        if (!wasmInstance) {
            throw new ButhaError(`WASM module ${modulePath} is not loaded`);
        }

        if (!(functionName in wasmInstance.instance.exports)) {
            throw new ButhaError(`Function ${functionName} does not exist in WASM module ${modulePath}`);
        }

        try {
            const func = wasmInstance.instance.exports[functionName];
            return func(...args);
        } catch (error) {
            throw new RuntimeError(`Error calling function ${functionName}: ${error.message}`);
        }
    }

    // Unload a WebAssembly module
    unloadModule(filePath) {
        if (!this.modules.has(filePath)) {
            throw new ButhaError(`WASM module ${filePath} is not loaded`);
        }

        this.modules.delete(filePath);
        console.log(`WASM module ${filePath} unloaded successfully`);
    }
}

// Example usage
const wasmManager = new WebAssemblyManager();

async function exampleUsage() {
    try {
        // Load a WASM module
        await wasmManager.loadModule('example.wasm');

        // Call a function from the loaded WASM module
        const result = wasmManager.callFunction('example.wasm', 'exampleFunction', 42, 3.14);
        console.log('Function result:', result);

        // Unload the WASM module
        wasmManager.unloadModule('example.wasm');
    } catch (error) {
        console.error('WASM error:', error.toString());
    }
}

exampleUsage();

module.exports = WebAssemblyManager;
