// wasmInterop.js

const { WebAssemblyManager } = require('./wasm');
const { ButhaError, RuntimeError } = require('./error');

class WasmInterop {
    constructor() {
        this.wasmManager = new WebAssemblyManager();
    }

    // Load a WebAssembly module
    async loadWasmModule(filePath) {
        try {
            await this.wasmManager.loadModule(filePath);
            console.log(`Loaded WASM module: ${filePath}`);
        } catch (error) {
            console.error(`Failed to load WASM module: ${error.message}`);
        }
    }

    // Call a WASM function with Butha arguments
    callWasmFunction(modulePath, functionName, ...buthaArgs) {
        try {
            const wasmArgs = this.convertButhaArgsToWasm(buthaArgs);
            const result = this.wasmManager.callFunction(modulePath, functionName, ...wasmArgs);
            return this.convertWasmResultToButha(result);
        } catch (error) {
            throw new RuntimeError(`Error during WASM function call: ${error.message}`);
        }
    }

    // Unload a WebAssembly module
    unloadWasmModule(filePath) {
        try {
            this.wasmManager.unloadModule(filePath);
            console.log(`Unloaded WASM module: ${filePath}`);
        } catch (error) {
            console.error(`Failed to unload WASM module: ${error.message}`);
        }
    }

    // Convert Butha arguments to WebAssembly-compatible format
    convertButhaArgsToWasm(buthaArgs) {
        // For simplicity, assuming Butha arguments are numbers
        return buthaArgs.map(arg => {
            if (typeof arg === 'number') return arg;
            if (typeof arg === 'string') return parseFloat(arg);
            throw new ButhaError('Unsupported argument type for WASM');
        });
    }

    // Convert WebAssembly results to Butha-compatible format
    convertWasmResultToButha(result) {
        // For simplicity, assuming WASM returns numbers
        if (typeof result === 'number') return result;
        throw new ButhaError('Unsupported result type from WASM');
    }
}

// Example usage
async function exampleUsage() {
    const wasmInterop = new WasmInterop();

    try {
        // Load a WASM module
        await wasmInterop.loadWasmModule('example.wasm');

        // Call a function from the loaded WASM module
        const result = wasmInterop.callWasmFunction('example.wasm', 'exampleFunction', 42, 3.14);
        console.log('WASM function result:', result);

        // Unload the WASM module
        wasmInterop.unloadWasmModule('example.wasm');
    } catch (error) {
        console.error('WASM Interop error:', error.toString());
    }
}

exampleUsage();

module.exports = WasmInterop;
