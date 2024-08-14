// evaluator.test.js

const { evaluate } = require('../evaluator.js');
const { expect } = require('chai');

describe('Butha Evaluator Tests', function() {

    it('should evaluate simple expressions', function() {
        const code = 'var x = 5; x;';
        const result = evaluate(code);
        expect(result).to.deep.equal({ x: 5 });
    });

    it('should evaluate function calls', function() {
        const code = `
            function add(a, b) {
                return a + b;
            }
            var result = add(3, 4);
            result;
        `;
        const result = evaluate(code);
        expect(result).to.deep.equal({ result: 7 });
    });

    it('should evaluate if statements', function() {
        const code = `
            var x = 15;
            var y;
            if (x > 10) {
                y = 20;
            } else {
                y = 30;
            }
            y;
        `;
        const result = evaluate(code);
        expect(result).to.deep.equal({ x: 15, y: 20 });
    });

    it('should evaluate while loops', function() {
        const code = `
            var x = 0;
            while (x < 3) {
                x = x + 1;
            }
            x;
        `;
        const result = evaluate(code);
        expect(result).to.deep.equal({ x: 3 });
    });

    it('should handle syntax errors gracefully', function() {
        const code = 'var x = ;'; // Syntax error
        expect(() => evaluate(code)).to.throw(Error, /Syntax Error/);
    });

    it('should evaluate arrays', function() {
        const code = 'var arr = [1, 2, 3]; arr;';
        const result = evaluate(code);
        expect(result).to.deep.equal({ arr: [1, 2, 3] });
    });

    it('should evaluate objects', function() {
        const code = 'var obj = {a: 1, b: 2}; obj;';
        const result = evaluate(code);
        expect(result).to.deep.equal({ obj: { a: 1, b: 2 } });
    });

});
