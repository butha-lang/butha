// parser.test.js

const { parse } = require('../parser.js');
const { expect } = require('chai');

describe('Butha Parser Tests', function() {

    it('should parse simple expressions', function() {
        const code = 'var x = 5;';
        const result = parse(code);
        expect(result).to.deep.equal({
            type: 'Program',
            body: [{
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'x' },
                    init: { type: 'Literal', value: 5 }
                }]
            }]
        });
    });

    it('should parse function declarations', function() {
        const code = `
            function greet(name) {
                return "Hello, " + name;
            }
        `;
        const result = parse(code);
        expect(result).to.deep.equal({
            type: 'Program',
            body: [{
                type: 'FunctionDeclaration',
                id: { type: 'Identifier', name: 'greet' },
                params: [{ type: 'Identifier', name: 'name' }],
                body: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ReturnStatement',
                        argument: {
                            type: 'BinaryExpression',
                            operator: '+',
                            left: { type: 'Literal', value: 'Hello, ' },
                            right: { type: 'Identifier', name: 'name' }
                        }
                    }]
                }
            }]
        });
    });

    it('should parse if statements', function() {
        const code = `
            if (x > 10) {
                y = 20;
            } else {
                y = 30;
            }
        `;
        const result = parse(code);
        expect(result).to.deep.equal({
            type: 'Program',
            body: [{
                type: 'IfStatement',
                test: {
                    type: 'BinaryExpression',
                    operator: '>',
                    left: { type: 'Identifier', name: 'x' },
                    right: { type: 'Literal', value: 10 }
                },
                consequent: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'AssignmentExpression',
                            operator: '=',
                            left: { type: 'Identifier', name: 'y' },
                            right: { type: 'Literal', value: 20 }
                        }
                    }]
                },
                alternate: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'AssignmentExpression',
                            operator: '=',
                            left: { type: 'Identifier', name: 'y' },
                            right: { type: 'Literal', value: 30 }
                        }
                    }]
                }
            }]
        });
    });

    it('should handle syntax errors', function() {
        const code = 'var x = ;'; // Syntax error
        expect(() => parse(code)).to.throw(Error, /Unexpected token/);
    });

    it('should parse while loops', function() {
        const code = `
            while (x < 10) {
                x = x + 1;
            }
        `;
        const result = parse(code);
        expect(result).to.deep.equal({
            type: 'Program',
            body: [{
                type: 'WhileStatement',
                test: {
                    type: 'BinaryExpression',
                    operator: '<',
                    left: { type: 'Identifier', name: 'x' },
                    right: { type: 'Literal', value: 10 }
                },
                body: {
                    type: 'BlockStatement',
                    body: [{
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'AssignmentExpression',
                            operator: '=',
                            left: { type: 'Identifier', name: 'x' },
                            right: {
                                type: 'BinaryExpression',
                                operator: '+',
                                left: { type: 'Identifier', name: 'x' },
                                right: { type: 'Literal', value: 1 }
                            }
                        }
                    }]
                }
            }]
        });
    });

    it('should parse arrays', function() {
        const code = 'var arr = [1, 2, 3];';
        const result = parse(code);
        expect(result).to.deep.equal({
            type: 'Program',
            body: [{
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'arr' },
                    init: {
                        type: 'ArrayExpression',
                        elements: [
                            { type: 'Literal', value: 1 },
                            { type: 'Literal', value: 2 },
                            { type: 'Literal', value: 3 }
                        ]
                    }
                }]
            }]
        });
    });

    it('should parse objects', function() {
        const code = 'var obj = {a: 1, b: 2};';
        const result = parse(code);
        expect(result).to.deep.equal({
            type: 'Program',
            body: [{
                type: 'VariableDeclaration',
                kind: 'var',
                declarations: [{
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'obj' },
                    init: {
                        type: 'ObjectExpression',
                        properties: [
                            {
                                type: 'Property',
                                key: { type: 'Identifier', name: 'a' },
                                value: { type: 'Literal', value: 1 },
                                kind: 'init'
                            },
                            {
                                type: 'Property',
                                key: { type: 'Identifier', name: 'b' },
                                value: { type: 'Literal', value: 2 },
                                kind: 'init'
                            }
                        ]
                    }
                }]
            }]
        });
    });

});
