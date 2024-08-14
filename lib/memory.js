// memory.js

class MemoryManager {
    constructor() {
        this.memory = new Map(); // Stores memory addresses and their associated values
        this.nextAddress = 1; // Simple counter for memory addresses
    }

    // Allocate memory and return an address
    allocate(value) {
        const address = this.nextAddress++;
        this.memory.set(address, value);
        return address;
    }

    // Deallocate memory at a given address
    deallocate(address) {
        if (this.memory.has(address)) {
            this.memory.delete(address);
        } else {
            throw new Error(`Memory address ${address} not found.`);
        }
    }

    // Get the value stored at a given address
    get(address) {
        if (this.memory.has(address)) {
            return this.memory.get(address);
        } else {
            throw new Error(`Memory address ${address} not found.`);
        }
    }

    // Set a value at a given address
    set(address, value) {
        if (this.memory.has(address)) {
            this.memory.set(address, value);
        } else {
            throw new Error(`Memory address ${address} not found.`);
        }
    }

    // Dump the current state of memory
    dumpMemory() {
        console.log('Memory Dump:');
        for (const [address, value] of this.memory.entries()) {
            console.log(`Address ${address}: ${value}`);
        }
    }
}

// Example usage
const memoryManager = new MemoryManager();

// Allocate memory
const addr1 = memoryManager.allocate('Hello World');
const addr2 = memoryManager.allocate(42);

// Print memory dump
memoryManager.dumpMemory();

// Retrieve values
console.log(`Value at address ${addr1}: ${memoryManager.get(addr1)}`);
console.log(`Value at address ${addr2}: ${memoryManager.get(addr2)}`);

// Modify value
memoryManager.set(addr2, 100);
console.log(`Updated value at address ${addr2}: ${memoryManager.get(addr2)}`);

// Deallocate memory
memoryManager.deallocate(addr1);
memoryManager.dumpMemory();

module.exports = {
    MemoryManager,
    memoryManager
};
