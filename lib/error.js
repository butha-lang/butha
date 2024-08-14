// error.js

// Base class for all Butha errors
class ButhaError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

// Syntax errors, e.g., for invalid syntax or unexpected tokens
class SyntaxError extends ButhaError {
    constructor(message, lineNumber = null) {
        super(message);
        this.lineNumber = lineNumber;
    }

    toString() {
        return this.lineNumber 
            ? `${this.name} (Line ${this.lineNumber}): ${this.message}`
            : `${this.name}: ${this.message}`;
    }
}

// Type errors, e.g., for type mismatches or invalid operations
class TypeError extends ButhaError {
    constructor(message, expectedType = null, receivedType = null) {
        super(message);
        this.expectedType = expectedType;
        this.receivedType = receivedType;
    }

    toString() {
        return this.expectedType && this.receivedType
            ? `${this.name}: ${this.message} (Expected type: ${this.expectedType}, Received type: ${this.receivedType})`
            : `${this.name}: ${this.message}`;
    }
}

// Reference errors, e.g., for undefined variables or uninitialized references
class ReferenceError extends ButhaError {
    constructor(message, referenceName = null) {
        super(message);
        this.referenceName = referenceName;
    }

    toString() {
        return this.referenceName 
            ? `${this.name}: ${this.message} (Reference: ${this.referenceName})`
            : `${this.name}: ${this.message}`;
    }
}

// Runtime errors, e.g., for execution issues
class RuntimeError extends ButhaError {
    constructor(message, details = null) {
        super(message);
        this.details = details;
    }

    toString() {
        return this.details 
            ? `${this.name}: ${this.message} (Details: ${this.details})`
            : `${this.name}: ${this.message}`;
    }
}

// Transform errors, e.g., for issues during code transformation or refactoring
class TransformError extends ButhaError {
    constructor(message) {
        super(message);
    }
}

// Error class for dynamic type issues
class DynamicTypeError extends TypeError {
    constructor(message) {
        super(message);
        this.name = 'DynamicTypeError';
    }
}

// Example usage
try {
    throw new SyntaxError('Unexpected token', 10);
} catch (error) {
    console.error(error.toString());
}

try {
    throw new TypeError('Type mismatch', 'number', 'string');
} catch (error) {
    console.error(error.toString());
}

try {
    throw new ReferenceError('Undefined variable', 'x');
} catch (error) {
    console.error(error.toString());
}

try {
    throw new RuntimeError('Execution failed', 'Null pointer exception');
} catch (error) {
    console.error(error.toString());
}

try {
    throw new TransformError('Transformation failed');
} catch (error) {
    console.error(error.toString());
}

module.exports = {
    ButhaError,
    SyntaxError,
    TypeError,
    ReferenceError,
    RuntimeError,
    TransformError,
    DynamicTypeError
};
