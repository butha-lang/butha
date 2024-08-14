// runtime.js

const { SymbolTable, Scope } = require('./analyzer');
const { ButhaError, ReferenceError, RuntimeError } = require('./error');
const { evaluateExpression } = require('./evaluator');
const { executeStatement } = require('./executor');

// Class to represent the runtime environment of the Butha language
class Runtime {
    constructor() {
        this.globalScope = new Scope();
        this.currentScope = this.globalScope;
        this.symbolTable = new SymbolTable();
    }

    // Execute a list of statements in the current scope
    run(statements) {
        try {
            statements.forEach(statement => {
                executeStatement(this, statement);
            });
        } catch (error) {
            console.error('Runtime error:', error.toString());
        }
    }

    // Set a variable in the current scope
    setVariable(name, value) {
        if (this.currentScope.has(name)) {
            this.currentScope.set(name, value);
        } else {
            throw new ReferenceError(`Variable "${name}" is not defined`);
        }
    }

    // Get a variable from the current scope
    getVariable(name) {
        if (this.currentScope.has(name)) {
            return this.currentScope.get(name);
        } else {
            throw new ReferenceError(`Variable "${name}" is not defined`);
        }
    }

    // Create a new scope
    createScope() {
        this.currentScope = new Scope(this.currentScope);
    }

    // Exit the current scope
    exitScope() {
        if (this.currentScope.parent) {
            this.currentScope = this.currentScope.parent;
        } else {
            throw new RuntimeError('No parent scope to exit');
        }
    }

    // Evaluate an expression in the current scope
    evaluate(expression) {
        try {
            return evaluateExpression(this, expression);
        } catch (error) {
            console.error('Evaluation error:', error.toString());
        }
    }

    // Add a built-in function to the global scope
    addBuiltInFunction(name, func) {
        this.globalScope.set(name, func);
    }
}

// Example built-in functions
function printFunction(runtime, args) {
    console.log(args.map(arg => runtime.evaluate(arg)).join(' '));
}

function addFunction(runtime, args) {
    const [a, b] = args.map(arg => runtime.evaluate(arg));
    return a + b;
}

// Initialize runtime with built-in functions
const runtime = new Runtime();
runtime.addBuiltInFunction('print', printFunction);
runtime.addBuiltInFunction('add', addFunction);

// Example usage
const exampleCode = [
    { type: 'VariableDeclaration', name: 'x', value: '5' },
    { type: 'VariableDeclaration', name: 'y', value: '10' },
    { type: 'ExpressionStatement', expression: { type: 'CallExpression', callee: 'print', arguments: ['"The sum is: "', { type: 'CallExpression', callee: 'add', arguments: ['x', 'y'] }] } }
];

try {
    runtime.run(exampleCode);
} catch (error) {
    console.error('Execution error:', error.toString());
}

module.exports = Runtime;
