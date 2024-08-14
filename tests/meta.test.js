// meta.test.js

const { Meta } = require('../meta.js');
const { expect } = require('chai');

describe('Butha Meta Programming Tests', function() {

    it('should retrieve metadata for functions', function() {
        const code = `
            function greet(name) { return "Hello, " + name; }
        `;
        const meta = new Meta();
        meta.loadCode(code);

        const metadata = meta.getFunctionMetadata('greet');
        expect(metadata).to.include.keys(['name', 'parameters', 'body']);
        expect(metadata.name).to.equal('greet');
        expect(metadata.parameters).to.deep.equal(['name']);
    });

    it('should retrieve metadata for variables', function() {
        const code = `
            var x = 5;
            var y = 10;
        `;
        const meta = new Meta();
        meta.loadCode(code);

        const xMetadata = meta.getVariableMetadata('x');
        const yMetadata = meta.getVariableMetadata('y');
        expect(xMetadata).to.include.keys(['name', 'value']);
        expect(xMetadata.name).to.equal('x');
        expect(xMetadata.value).to.equal(5);
        expect(yMetadata.name).to.equal('y');
        expect(yMetadata.value).to.equal(10);
    });

    it('should retrieve metadata for object properties', function() {
        const code = `
            var person = { name: 'John', age: 30 };
        `;
        const meta = new Meta();
        meta.loadCode(code);

        const properties = meta.getObjectPropertyMetadata('person');
        expect(properties).to.include.keys(['name', 'age']);
        expect(properties.name).to.equal('John');
        expect(properties.age).to.equal(30);
    });

    it('should handle metadata for complex expressions', function() {
        const code = `
            var result = (5 + 3) * (10 - 2);
        `;
        const meta = new Meta();
        meta.loadCode(code);

        const resultMetadata = meta.getVariableMetadata('result');
        expect(resultMetadata).to.include.keys(['name', 'value']);
        expect(resultMetadata.name).to.equal('result');
        expect(resultMetadata.value).to.equal(64); // Assuming evaluation is done
    });

    it('should update metadata dynamically', function() {
        const code = `
            var a = 1;
            a = a + 2;
        `;
        const meta = new Meta();
        meta.loadCode(code);

        meta.updateVariable('a', 3);
        const updatedMetadata = meta.getVariableMetadata('a');
        expect(updatedMetadata.value).to.equal(3);
    });

});
