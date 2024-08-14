// dynamic.js

class DynamicTypeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DynamicTypeError';
    }
}

class TypeUtils {
    static isString(value) {
        return typeof value === 'string';
    }

    static isNumber(value) {
        return typeof value === 'number' && !isNaN(value);
    }

    static isBoolean(value) {
        return typeof value === 'boolean';
    }

    static isArray(value) {
        return Array.isArray(value);
    }

    static isObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    static isFunction(value) {
        return typeof value === 'function';
    }

    static assertType(value, type) {
        switch (type) {
            case 'string':
                if (!TypeUtils.isString(value)) {
                    throw new DynamicTypeError(`Expected a string but got ${typeof value}`);
                }
                break;
            case 'number':
                if (!TypeUtils.isNumber(value)) {
                    throw new DynamicTypeError(`Expected a number but got ${typeof value}`);
                }
                break;
            case 'boolean':
                if (!TypeUtils.isBoolean(value)) {
                    throw new DynamicTypeError(`Expected a boolean but got ${typeof value}`);
                }
                break;
            case 'array':
                if (!TypeUtils.isArray(value)) {
                    throw new DynamicTypeError(`Expected an array but got ${typeof value}`);
                }
                break;
            case 'object':
                if (!TypeUtils.isObject(value)) {
                    throw new DynamicTypeError(`Expected an object but got ${typeof value}`);
                }
                break;
            case 'function':
                if (!TypeUtils.isFunction(value)) {
                    throw new DynamicTypeError(`Expected a function but got ${typeof value}`);
                }
                break;
            default:
                throw new DynamicTypeError(`Unknown type: ${type}`);
        }
    }

    static coerceType(value, type) {
        switch (type) {
            case 'string':
                return String(value);
            case 'number':
                return Number(value);
            case 'boolean':
                return Boolean(value);
            case 'array':
                if (TypeUtils.isArray(value)) {
                    return value;
                }
                return [value];
            case 'object':
                if (TypeUtils.isObject(value)) {
                    return value;
                }
                return { value };
            case 'function':
                if (TypeUtils.isFunction(value)) {
                    return value;
                }
                throw new DynamicTypeError(`Cannot coerce to function from ${typeof value}`);
            default:
                throw new DynamicTypeError(`Unknown type for coercion: ${type}`);
        }
    }
}

// Example usage
try {
    const value1 = 'Hello';
    TypeUtils.assertType(value1, 'string'); // Valid

    const value2 = 123;
    TypeUtils.assertType(value2, 'number'); // Valid

    const value3 = true;
    TypeUtils.assertType(value3, 'boolean'); // Valid

    const value4 = [1, 2, 3];
    TypeUtils.assertType(value4, 'array'); // Valid

    const value5 = { key: 'value' };
    TypeUtils.assertType(value5, 'object'); // Valid

    const value6 = () => {};
    TypeUtils.assertType(value6, 'function'); // Valid

    const coercedString = TypeUtils.coerceType(123, 'string');
    console.log(`Coerced to string: ${coercedString}`); // "123"

    const coercedArray = TypeUtils.coerceType(123, 'array');
    console.log(`Coerced to array: ${JSON.stringify(coercedArray)}`); // [123]

    const coercedObject = TypeUtils.coerceType(123, 'object');
    console.log(`Coerced to object: ${JSON.stringify(coercedObject)}`); // {"value":123}

} catch (error) {
    if (error instanceof DynamicTypeError) {
        console.error(`Dynamic type error: ${error.message}`);
    } else {
        console.error(`Unexpected error: ${error.message}`);
    }
}

module.exports = {
    TypeUtils,
    DynamicTypeError
};
