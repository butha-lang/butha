// reflection.test.js

const { Reflector } = require('../reflection.js');
const { expect } = require('chai');

describe('Butha Reflection Tests', function() {

    it('should reflect on function names', function() {
        const code = `
            function greet(name) { return "Hello, " + name; }
            function farewell(name) { return "Goodbye, " + name; }
        `;
        const reflector = new Reflector();
        reflector.loadCode(code);

        const functions = reflector.getFunctionNames();
        expect(functions).to.include.members(['greet', 'farewell']);
    });

    it('should reflect on variable names', function() {
        const code = `
            var x = 5;
            var y = 10;
            var z = x + y;
        `;
        const reflector = new Reflector();
        reflector.loadCode(code);

        const variables = reflector.getVariableNames();
        expect(variables).to.include.members(['x', 'y', 'z']);
    });

    it('should reflect on function parameters', function() {
        const code = `
            function greet(name, age) { return "Hello, " + name + " aged " + age; }
        `;
        const reflector = new Reflector();
        reflector.loadCode(code);

        const params = reflector.getFunctionParameters('greet');
        expect(params).to.deep.equal(['name', 'age']);
    });

    it('should reflect on object properties', function() {
        const code = `
            var person = { name: 'John', age: 30 };
        `;
        const reflector = new Reflector();
        reflector.loadCode(code);

        const properties = reflector.getObjectProperties('person');
        expect(properties).to.include.members(['name', 'age']);
    });

    it('should reflect on method calls', function() {
        const code = `
            function greet() { return 'Hello'; }
            greet();
        `;
        const reflector = new Reflector();
        reflector.loadCode(code);

        const calls = reflector.getMethodCalls();
        expect(calls).to.include.members(['greet']);
    });

});
