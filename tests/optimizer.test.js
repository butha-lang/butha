// optimizer.test.js

const { Optimizer } = require('../optimizer.js');
const { expect } = require('chai');

describe('Butha Code Optimizer Tests', function() {

    it('should remove dead code', function() {
        const code = `
            var x = 5;
            var y = 10;
            var z = x + y;
            var unused = 20;
        `;
        const optimizer = new Optimizer();
        const optimizedCode = optimizer.optimize(code);

        expect(optimizedCode).to.not.include('unused');
    });

    it('should simplify expressions', function() {
        const code = `
            var result = (5 + 3) * (10 - 2);
        `;
        const optimizer = new Optimizer();
        const optimizedCode = optimizer.optimize(code);

        // Assuming the optimizer simplifies the expression
        expect(optimizedCode).to.include('result = 64');
    });

    it('should inline variables', function() {
        const code = `
            var x = 5;
            var y = x * 2;
            var z = y + 10;
        `;
        const optimizer = new Optimizer();
        const optimizedCode = optimizer.optimize(code);

        // Assuming the optimizer inlines variables
        expect(optimizedCode).to.include('var z = 20 + 10');
    });

    it('should handle function inlining', function() {
        const code = `
            function add(a, b) { return a + b; }
            var result = add(5, 10);
        `;
        const optimizer = new Optimizer();
        const optimizedCode = optimizer.optimize(code);

        // Assuming the optimizer inlines the function call
        expect(optimizedCode).to.include('var result = 15');
    });

    it('should not modify already optimized code', function() {
        const code = `
            var a = 1;
            var b = 2;
            var c = a + b;
        `;
        const optimizer = new Optimizer();
        const optimizedCode = optimizer.optimize(code);

        // Assuming no changes are made to already simple code
        expect(optimizedCode).to.equal(code);
    });

});
