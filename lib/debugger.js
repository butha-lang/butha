// debugger.js

const fs = require('fs');
const path = require('path');
const { ButhaError, RuntimeError } = require('./error');

// Class to represent the Debugger
class Debugger {
    constructor(baseDir) {
        this.baseDir = baseDir;
        this.breakpoints = new Map(); // Map to store breakpoints with file paths and line numbers
        this.currentFile = null;
        this.currentLine = null;
        this.isPaused = false;
        this.callStack = [];
    }

    // Load a file for debugging
    loadFile(filePath) {
        const fullPath = path.join(this.baseDir, filePath);
        if (!fs.existsSync(fullPath)) {
            throw new ButhaError(`File ${filePath} does not exist`);
        }
        return fs.readFileSync(fullPath, 'utf-8');
    }

    // Set a breakpoint in a file at a specific line
    setBreakpoint(filePath, lineNumber) {
        if (!this.breakpoints.has(filePath)) {
            this.breakpoints.set(filePath, new Set());
        }
        this.breakpoints.get(filePath).add(lineNumber);
    }

    // Remove a breakpoint from a file at a specific line
    removeBreakpoint(filePath, lineNumber) {
        if (this.breakpoints.has(filePath)) {
            this.breakpoints.get(filePath).delete(lineNumber);
            if (this.breakpoints.get(filePath).size === 0) {
                this.breakpoints.delete(filePath);
            }
        }
    }

    // List all breakpoints
    listBreakpoints() {
        return Array.from(this.breakpoints.entries());
    }

    // Start debugging a file
    startDebugging(filePath) {
        const content = this.loadFile(filePath);
        this.currentFile = filePath;
        this.currentLine = 1; // Start from the first line
        this.isPaused = false;
        this.callStack = [];
        console.log(`Starting debugging for ${filePath}`);
        this.executeLine(content, this.currentLine);
    }

    // Execute a specific line of code
    executeLine(content, lineNumber) {
        if (this.isPaused) return;

        const lines = content.split('\n');
        if (lineNumber < 1 || lineNumber > lines.length) {
            throw new RuntimeError(`Line ${lineNumber} is out of range`);
        }

        const line = lines[lineNumber - 1];
        console.log(`Executing line ${lineNumber}: ${line}`);

        // Check for breakpoints
        if (this.breakpoints.has(this.currentFile) &&
            this.breakpoints.get(this.currentFile).has(lineNumber)) {
            this.pause();
            console.log(`Breakpoint hit at ${this.currentFile}:${lineNumber}`);
            return;
        }

        // Simulate line execution
        this.callStack.push({ file: this.currentFile, line: lineNumber, code: line });

        // Move to the next line
        this.currentLine += 1;

        if (this.currentLine <= lines.length) {
            this.executeLine(content, this.currentLine);
        } else {
            console.log('End of file reached');
        }
    }

    // Pause execution
    pause() {
        this.isPaused = true;
    }

    // Resume execution
    resume() {
        if (!this.isPaused) {
            throw new RuntimeError('Debugger is not paused');
        }
        this.isPaused = false;
        if (this.currentFile) {
            const content = this.loadFile(this.currentFile);
            this.executeLine(content, this.currentLine);
        }
    }

    // Step over the current line
    stepOver() {
        if (!this.isPaused) {
            throw new RuntimeError('Debugger is not paused');
        }
        if (this.currentFile) {
            const content = this.loadFile(this.currentFile);
            this.executeLine(content, this.currentLine);
        }
    }

    // Step into a function call (stub implementation)
    stepInto() {
        // For simplicity, this is a stub. Implementing actual step-into functionality
        // would require parsing and executing functions in detail.
        console.log('Step into functionality is not yet implemented');
    }

    // Step out of a function call (stub implementation)
    stepOut() {
        // For simplicity, this is a stub. Implementing actual step-out functionality
        // would require tracking call stack and execution context.
        console.log('Step out functionality is not yet implemented');
    }

    // Print the current call stack
    printCallStack() {
        console.log('Call Stack:');
        this.callStack.forEach((frame, index) => {
            console.log(`${index}: ${frame.file}:${frame.line} - ${frame.code}`);
        });
    }

    // Print a variable's value (stub implementation)
    printVariable(name) {
        // For simplicity, this is a stub. Implementing actual variable inspection
        // would require maintaining variable states and scopes.
        console.log(`Variable ${name}: (Value inspection not implemented)`);
    }
}

// Example usage
const debuggerInstance = new Debugger(__dirname);

try {
    // Set breakpoints
    debuggerInstance.setBreakpoint('example.butha', 2);

    // Start debugging a file
    debuggerInstance.startDebugging('example.butha');

    // Step over the current line
    debuggerInstance.stepOver();

    // Print call stack
    debuggerInstance.printCallStack();

    // Print variable value
    debuggerInstance.printVariable('exampleVar');

    // Resume execution
    debuggerInstance.resume();
} catch (error) {
    console.error('Debugger error:', error.toString());
}

module.exports = Debugger;
