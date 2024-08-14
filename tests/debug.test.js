// debug.test.js

const { Debugger } = require('../debug.js');
const { expect } = require('chai');

describe('Butha Debugger Tests', function() {

    it('should set and hit a breakpoint', function() {
        const code = `
            function add(a, b) {
                return a + b;
            }
            var result = add(5, 10);
        `;
        const debuggerInstance = new Debugger();
        debuggerInstance.loadCode(code);
        
        debuggerInstance.setBreakpoint('add', 1); // Setting breakpoint at line 1 in 'add' function
        const hitBreakpoint = debuggerInstance.stepOver();
        
        expect(hitBreakpoint).to.equal('Breakpoint hit at add:1');
    });

    it('should inspect variables at a breakpoint', function() {
        const code = `
            function multiply(a, b) {
                var result = a * b;
                return result;
            }
            var value = multiply(3, 4);
        `;
        const debuggerInstance = new Debugger();
        debuggerInstance.loadCode(code);
        
        debuggerInstance.setBreakpoint('multiply', 2); // Setting breakpoint at line 2 in 'multiply' function
        debuggerInstance.stepOver(); // Execute to breakpoint
        const variables = debuggerInstance.inspectVariables();
        
        expect(variables).to.have.property('a', 3);
        expect(variables).to.have.property('b', 4);
        expect(variables).to.have.property('result');
    });

    it('should step through code line by line', function() {
        const code = `
            var x = 10;
            var y = 20;
            var z = x + y;
        `;
        const debuggerInstance = new Debugger();
        debuggerInstance.loadCode(code);
        
        debuggerInstance.setBreakpoint(null, 3); // Setting breakpoint at line 3
        debuggerInstance.stepOver(); // Execute to line 3
        const currentLine = debuggerInstance.getCurrentLine();
        
        expect(currentLine).to.equal(3);
    });

    it('should support stepping into functions', function() {
        const code = `
            function divide(a, b) {
                return a / b;
            }
            var result = divide(20, 5);
        `;
        const debuggerInstance = new Debugger();
        debuggerInstance.loadCode(code);
        
        debuggerInstance.setBreakpoint('divide', 1); // Setting breakpoint in 'divide' function
        debuggerInstance.stepInto(); // Step into function
        const currentLine = debuggerInstance.getCurrentLine();
        
        expect(currentLine).to.equal(1);
    });

    it('should continue execution after hitting a breakpoint', function() {
        const code = `
            function subtract(a, b) {
                var result = a - b;
                return result;
            }
            var difference = subtract(15, 5);
        `;
        const debuggerInstance = new Debugger();
        debuggerInstance.loadCode(code);
        
        debuggerInstance.setBreakpoint('subtract', 2); // Setting breakpoint at line 2
        debuggerInstance.stepOver(); // Execute to breakpoint
        debuggerInstance.continue(); // Continue execution
        const finalResult = debuggerInstance.getVariable('difference');
        
        expect(finalResult).to.equal(10);
    });

});
