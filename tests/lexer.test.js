// lexer.test.js

const { tokenize } = require('../lexer.js');
const { expect } = require('chai');

describe('Butha Lexer Tests', function() {

    it('should tokenize simple expressions', function() {
        const code = 'var x = 5;';
        const result = tokenize(code);
        expect(result).to.deep.equal([
            { type: 'Keyword', value: 'var' },
            { type: 'Identifier', value: 'x' },
            { type: 'Operator', value: '=' },
            { type: 'Number', value: '5' },
            { type: 'Punctuation', value: ';' }
        ]);
    });

    it('should tokenize function declarations', function() {
        const code = 'function greet(name) { return "Hello, " + name; }';
        const result = tokenize(code);
        expect(result).to.deep.equal([
            { type: 'Keyword', value: 'function' },
            { type: 'Identifier', value: 'greet' },
            { type: 'Punctuation', value: '(' },
            { type: 'Identifier', value: 'name' },
            { type: 'Punctuation', value: ')' },
            { type: 'Punctuation', value: '{' },
            { type: 'Keyword', value: 'return' },
            { type: 'String', value: '"Hello, "' },
            { type: 'Operator', value: '+' },
            { type: 'Identifier', value: 'name' },
            { type: 'Punctuation', value: ';' },
            { type: 'Punctuation', value: '}' }
        ]);
    });

    it('should tokenize if statements', function() {
        const code = 'if (x > 10) { y = 20; }';
        const result = tokenize(code);
        expect(result).to.deep.equal([
            { type: 'Keyword', value: 'if' },
            { type: 'Punctuation', value: '(' },
            { type: 'Identifier', value: 'x' },
            { type: 'Operator', value: '>' },
            { type: 'Number', value: '10' },
            { type: 'Punctuation', value: ')' },
            { type: 'Punctuation', value: '{' },
            { type: 'Identifier', value: 'y' },
            { type: 'Operator', value: '=' },
            { type: 'Number', value: '20' },
            { type: 'Punctuation', value: ';' },
            { type: 'Punctuation', value: '}' }
        ]);
    });

    it('should handle unknown characters', function() {
        const code = 'var x = $;';
        expect(() => tokenize(code)).to.throw(Error, /Unexpected token/);
    });

    it('should tokenize arrays', function() {
        const code = 'var arr = [1, 2, 3];';
        const result = tokenize(code);
        expect(result).to.deep.equal([
            { type: 'Keyword', value: 'var' },
            { type: 'Identifier', value: 'arr' },
            { type: 'Operator', value: '=' },
            { type: 'Punctuation', value: '[' },
            { type: 'Number', value: '1' },
            { type: 'Punctuation', value: ',' },
            { type: 'Number', value: '2' },
            { type: 'Punctuation', value: ',' },
            { type: 'Number', value: '3' },
            { type: 'Punctuation', value: ']' },
            { type: 'Punctuation', value: ';' }
        ]);
    });

    it('should tokenize objects', function() {
        const code = 'var obj = {a: 1, b: 2};';
        const result = tokenize(code);
        expect(result).to.deep.equal([
            { type: 'Keyword', value: 'var' },
            { type: 'Identifier', value: 'obj' },
            { type: 'Operator', value: '=' },
            { type: 'Punctuation', value: '{' },
            { type: 'Identifier', value: 'a' },
            { type: 'Punctuation', value: ':' },
            { type: 'Number', value: '1' },
            { type: 'Punctuation', value: ',' },
            { type: 'Identifier', value: 'b' },
            { type: 'Punctuation', value: ':' },
            { type: 'Number', value: '2' },
            { type: 'Punctuation', value: '}' },
            { type: 'Punctuation', value: ';' }
        ]);
    });

});
