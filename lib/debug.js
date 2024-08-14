// debug.js

class Debugger {
    constructor() {
        this.logLevel = 'info'; // Default log level
        this.logLevels = ['error', 'warn', 'info', 'debug'];
    }

    // Set the log level
    setLogLevel(level) {
        if (this.logLevels.includes(level)) {
            this.logLevel = level;
        } else {
            throw new Error(`Invalid log level: ${level}. Valid levels are ${this.logLevels.join(', ')}.`);
        }
    }

    // Log a message based on the current log level
    log(level, message) {
        if (this.logLevels.indexOf(level) <= this.logLevels.indexOf(this.logLevel)) {
            console.log(`[${level.toUpperCase()}] ${message}`);
        }
    }

    // Log an error message
    error(message) {
        this.log('error', message);
    }

    // Log a warning message
    warn(message) {
        this.log('warn', message);
    }

    // Log an informational message
    info(message) {
        this.log('info', message);
    }

    // Log a debug message
    debug(message) {
        this.log('debug', message);
    }

    // Trace function calls
    traceFunctionCalls(fn) {
        return (...args) => {
            this.info(`Calling function ${fn.name} with arguments: ${JSON.stringify(args)}`);
            const result = fn(...args);
            this.info(`Function ${fn.name} returned: ${JSON.stringify(result)}`);
            return result;
        };
    }

    // Error handling with stack trace
    handleError(error) {
        this.error(`Error occurred: ${error.message}`);
        this.error(`Stack trace: ${error.stack}`);
    }
}

// Example usage
const debuggerInstance = new Debugger();

// Set log level
debuggerInstance.setLogLevel('debug');

// Log messages
debuggerInstance.error('This is an error message.');
debuggerInstance.warn('This is a warning message.');
debuggerInstance.info('This is an informational message.');
debuggerInstance.debug('This is a debug message.');

// Trace function calls
const add = debuggerInstance.traceFunctionCalls((a, b) => a + b);
add(2, 3);

// Error handling example
try {
    throw new Error('Something went wrong!');
} catch (error) {
    debuggerInstance.handleError(error);
}

module.exports = {
    Debugger,
    debuggerInstance
};
