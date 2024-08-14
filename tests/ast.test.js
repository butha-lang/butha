// ast.test.js

const { parse } = require('../parser.js');
const { expect } = require('chai');

describe('Butha AST Tests', function() {

    it('should produce an AST for simple expressions', function() {
        const code = 'var x = 5;';
        const ast = parse(code);
        expect(ast).to.deep.equal({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: { type: 'Identifier', name: 'x' },
                            init: { type: 'Literal', value: 5 }
                        }
                    ],
                    kind: 'var'
                }
            ]
        });
    });

    it('should produce an AST for function declarations', function() {
        const code = 'function greet(name) { return "Hello, " + name; }';
        const ast = parse(code);
        expect(ast).to.deep.equal({
            type: 'Program',
            body: [
                {
                    type: 'FunctionDeclaration',
                    id: { type: 'Identifier', name: 'greet' },
                    params: [
                        { type: 'Identifier', name: 'name' }
                    ],
                    body: {
                        type: 'BlockStatement',
                        body: [
                            {
                                type: 'ReturnStatement',
                                argument: {
                                    type: 'BinaryExpression',
                                    operator: '+',
                                    left: { type: 'Literal', value: 'Hello, ' },
                                    right: { type: 'Identifier', name: 'name' }
                                }
                            }
                        ]
                    }
                }
            ]
        });
    });

    it('should produce an AST for if statements', function() {
        const code = 'if (x > 10) { y = 20; }';
        const ast = parse(code);
        expect(ast).to.deep.equal({
            type: 'Program',
            body: [
                {
                    type: 'IfStatement',
                    test: {
                        type: 'BinaryExpression',
                        operator: '>',
                        left: { type: 'Identifier', name: 'x' },
                        right: { type: 'Literal', value: 10 }
                    },
                    consequent: {
                        type: 'BlockStatement',
                        body: [
                            {
                                type: 'ExpressionStatement',
                                expression: {
                                    type: 'AssignmentExpression',
                                    operator: '=',
                                    left: { type: 'Identifier', name: 'y' },
                                    right: { type: 'Literal', value: 20 }
                                }
                            }
                        ]
                    },
                    alternate: null
                }
            ]
        });
    });

    it('should produce an AST for while loops', function() {
        const code = 'while (x < 3) { x = x + 1; }';
        const ast = parse(code);
        expect(ast).to.deep.equal({
            type: 'Program',
            body: [
                {
                    type: 'WhileStatement',
                    test: {
                        type: 'BinaryExpression',
                        operator: '<',
                        left: { type: 'Identifier', name: 'x' },
                        right: { type: 'Literal', value: 3 }
                    },
                    body: {
                        type: 'BlockStatement',
                        body: [
                            {
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
                            }
                        ]
                    }
                }
            ]
        });
    });

    it('should produce an AST for array literals', function() {
        const code = 'var arr = [1, 2, 3];';
        const ast = parse(code);
        expect(ast).to.deep.equal({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
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
                        }
                    ],
                    kind: 'var'
                }
            ]
        });
    });

    it('should produce an AST for object literals', function() {
        const code = 'var obj = {a: 1, b: 2};';
        const ast = parse(code);
        expect(ast).to.deep.equal({
            type: 'Program',
            body: [
                {
                    type: 'VariableDeclaration',
                    declarations: [
                        {
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
                        }
                    ],
                    kind: 'var'
                }
            ]
        });
    });

});
