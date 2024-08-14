// system.js

const { ButhaError, RuntimeError } = require('./error');

// Class to represent system-level operations and environment settings
class System {
    constructor() {
        this.environment = {};
    }

    // Set an environment variable
    setEnvVariable(name, value) {
        this.environment[name] = value;
    }

    // Get an environment variable
    getEnvVariable(name) {
        if (name in this.environment) {
            return this.environment[name];
        } else {
            throw new RuntimeError(`Environment variable "${name}" is not set`);
        }
    }

    // Get all environment variables
    getAllEnvVariables() {
        return this.environment;
    }

    // Print system information
    printSystemInfo() {
        console.log('System Information:');
        console.log(`Environment Variables: ${JSON.stringify(this.environment, null, 2)}`);
        console.log(`Current Directory: ${process.cwd()}`);
        console.log(`Node.js Version: ${process.version}`);
    }

    // Execute a system command
    executeCommand(command, args = []) {
        const { execSync } = require('child_process');
        try {
            const result = execSync(`${command} ${args.join(' ')}`, { encoding: 'utf-8' });
            return result;
        } catch (error) {
            throw new RuntimeError(`Failed to execute command "${command}": ${error.message}`);
        }
    }
}

// Built-in system functions

// Function to print system information
function printSystemInfoFunction(runtime, args) {
    const system = runtime.getVariable('system');
    if (system instanceof System) {
        system.printSystemInfo();
    } else {
        throw new RuntimeError('System function is not available');
    }
}

// Function to set an environment variable
function setEnvVariableFunction(runtime, args) {
    if (args.length !== 2) {
        throw new RuntimeError('setEnvVariable requires exactly 2 arguments');
    }
    const [name, value] = args;
    const system = runtime.getVariable('system');
    if (system instanceof System) {
        system.setEnvVariable(name, value);
    } else {
        throw new RuntimeError('System function is not available');
    }
}

// Function to get an environment variable
function getEnvVariableFunction(runtime, args) {
    if (args.length !== 1) {
        throw new RuntimeError('getEnvVariable requires exactly 1 argument');
    }
    const [name] = args;
    const system = runtime.getVariable('system');
    if (system instanceof System) {
        return system.getEnvVariable(name);
    } else {
        throw new RuntimeError('System function is not available');
    }
}

// Function to execute a system command
function executeCommandFunction(runtime, args) {
    if (args.length < 1) {
        throw new RuntimeError('executeCommand requires at least 1 argument');
    }
    const [command, ...commandArgs] = args;
    const system = runtime.getVariable('system');
    if (system instanceof System) {
        return system.executeCommand(command, commandArgs);
    } else {
        throw new RuntimeError('System function is not available');
    }
}

// Initialize system object and add built-in functions
const system = new System();
const runtime = require('./runtime'); // Assuming runtime.js exports the runtime instance
runtime.addBuiltInFunction('printSystemInfo', printSystemInfoFunction);
runtime.addBuiltInFunction('setEnvVariable', setEnvVariableFunction);
runtime.addBuiltInFunction('getEnvVariable', getEnvVariableFunction);
runtime.addBuiltInFunction('executeCommand', executeCommandFunction);

// Example usage
try {
    runtime.setVariable('system', system);
    runtime.run([
        { type: 'ExpressionStatement', expression: { type: 'CallExpression', callee: 'printSystemInfo', arguments: [] } },
        { type: 'ExpressionStatement', expression: { type: 'CallExpression', callee: 'setEnvVariable', arguments: ['TEST_VAR', '123'] } },
        { type: 'ExpressionStatement', expression: { type: 'CallExpression', callee: 'getEnvVariable', arguments: ['TEST_VAR'] } }
    ]);
} catch (error) {
    console.error('System error:', error.toString());
}

module.exports = System;
