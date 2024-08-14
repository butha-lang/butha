// analyzer.js

const { Parser } = require('./parser');
const { Evaluator } = require('./evaluator');
const { DynamicTypeError } = require('./dynamic');

// Class representing a symbol in the symbol table
class Symbol {
    constructor(name, type, value = null) {
        this.name = name;
        this.type = type;
        this.value = value;
    }
}

// Class representing the symbol table for scope management
class SymbolTable {
    constructor(parent = null) {
        this.symbols = new Map();
        this.parent = parent;
    }

    define(name, type, value = null) {
        if (this.symbols.has(name)) {
            throw new Error(`Symbol '${name}' is already defined.`);
        }
        this.symbols.set(name, new Symbol(name, type, value));
    }

    get(name) {
        if (this.symbols.has(name)) {
            return this.symbols.get(name);
        } else if (this.parent) {
            return this.parent.get(name);
        } else {
            throw new Error(`Symbol '${name}' is not defined.`);
        }
    }

    set(name, value) {
        if (this.symbols.has(name)) {
            this.symbols.get(name).value = value;
        } else if (this.parent) {
            this.parent.set(name, value);
        } else {
            throw new Error(`Symbol '${name}' is not defined.`);
        }
    }
}

// Class for analyzing and checking code
class Analyzer {
    constructor() {
        this.parser = new Parser();
        this.evaluator = new Evaluator();
        this.symbolTable = new SymbolTable();
    }

    analyze(code) {
        // Parse the code
        const ast = this.parser.parse(code);

        // Perform type checking and other static analysis
        this._analyzeAst(ast);

        // Evaluate the code if necessary (optional)
        // const result = this.evaluator.evaluate(ast);
        // return result;
    }

    _analyzeAst(ast) {
        // Analyze the AST recursively
        this._analyzeNode(ast);
    }

    _analyzeNode(node) {
        switch (node.type) {
            case 'Program':
                node.body.forEach(childNode => this._analyzeNode(childNode));
                break;
            case 'VariableDeclaration':
                this._analyzeVariableDeclaration(node);
                break;
            case 'FunctionDeclaration':
                this._analyzeFunctionDeclaration(node);
                break;
            case 'AssignmentExpression':
                this._analyzeAssignmentExpression(node);
                break;
            case 'BinaryExpression':
                this._analyzeBinaryExpression(node);
                break;
            case 'CallExpression':
                this._analyzeCallExpression(node);
                break;
            // Add more cases as needed
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    _analyzeVariableDeclaration(node) {
        const { name, type } = node;
        this.symbolTable.define(name, type);
        if (node.initializer) {
            const value = this._evaluateExpression(node.initializer);
            this.symbolTable.set(name, value);
        }
    }

    _analyzeFunctionDeclaration(node) {
        const { name, parameters, body } = node;
        this.symbolTable.define(name, 'function');
        // Create a new symbol table for the function scope
        const functionTable = new SymbolTable(this.symbolTable);
        parameters.forEach(param => functionTable.define(param.name, param.type));
        // Analyze function body
        body.forEach(statement => this._analyzeNode(statement));
    }

    _analyzeAssignmentExpression(node) {
        const { variable, value } = node;
        const symbol = this.symbolTable.get(variable);
        const evaluatedValue = this._evaluateExpression(value);
        if (typeof evaluatedValue !== symbol.type) {
            throw new DynamicTypeError(`Type mismatch: expected ${symbol.type}, got ${typeof evaluatedValue}`);
        }
        this.symbolTable.set(variable, evaluatedValue);
    }

    _analyzeBinaryExpression(node) {
        const { left, operator, right } = node;
        this._analyzeNode(left);
        this._analyzeNode(right);
        // Add type checking for binary operations
    }

    _analyzeCallExpression(node) {
        const { callee, arguments: args } = node;
        // Analyze the function call
        // Check argument types against the function signature
    }

    _evaluateExpression(expression) {
        // Placeholder for expression evaluation (could use evaluator)
        return expression; // Replace with actual evaluation logic
    }
}

// Example usage
const analyzer = new Analyzer();

const code = `
    let x = 10;
    let y = x + 5;
    function add(a, b) {
        return a + b;
    }
    let result = add(x, y);
`;

try {
    analyzer.analyze(code);
    console.log('Code analyzed successfully.');
} catch (error) {
    console.error('Analysis error:', error.message);
}

module.exports = {
    Analyzer,
    Symbol,
    SymbolTable
};
