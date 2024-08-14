// wasm.test.js

const { WASMCompiler } = require('../wasm.js');
const { expect } = require('chai');

describe('Butha WebAssembly Tests', function() {

    it('should compile and execute a simple WASM module', async function() {
        const code = `
            (module
                (func (export "add") (param i32 i32) (result i32)
                    local.get 0
                    local.get 1
                    i32.add
                )
            )
        `;
        const compiler = new WASMCompiler();
        const module = await compiler.compile(code);
        const instance = await compiler.instantiate(module);

        const add = instance.exports.add;
        const result = add(5, 10);
        
        expect(result).to.equal(15);
    });

    it('should handle WASM memory operations', async function() {
        const code = `
            (module
                (memory (export "mem") 1)
                (export "mem" (memory 0))
                (func (export "store") (param i32 i32)
                    local.get 0
                    local.get 1
                    i32.store
                )
                (func (export "load") (param i32) (result i32)
                    local.get 0
                    i32.load
                )
            )
        `;
        const compiler = new WASMCompiler();
        const module = await compiler.compile(code);
        const instance = await compiler.instantiate(module);

        const store = instance.exports.store;
        const load = instance.exports.load;
        const mem = instance.exports.mem;
        
        store(0, 42); // Store 42 at address 0
        const result = load(0); // Load from address 0
        
        expect(result).to.equal(42);
    });

    it('should handle WASM imports', async function() {
        const code = `
            (module
                (import "env" "importedFunc" (func $importedFunc (param i32) (result i32)))
                (func (export "callImported") (param i32) (result i32)
                    local.get 0
                    call $importedFunc
                )
            )
        `;
        const importedFunc = (value) => value + 1;
        const compiler = new WASMCompiler();
        const module = await compiler.compile(code);
        const instance = await compiler.instantiate(module, {
            env: {
                importedFunc
            }
        });

        const callImported = instance.exports.callImported;
        const result = callImported(10);
        
        expect(result).to.equal(11);
    });

    it('should handle WASM exceptions', async function() {
        const code = `
            (module
                (func (export "divide") (param i32 i32) (result i32)
                    local.get 0
                    local.get 1
                    i32.div_s
                )
            )
        `;
        const compiler = new WASMCompiler();
        const module = await compiler.compile(code);
        const instance = await compiler.instantiate(module);

        const divide = instance.exports.divide;
        
        expect(() => divide(10, 0)).to.throw();
    });

    it('should support dynamic linking in WASM', async function() {
        const code = `
            (module
                (import "env" "multiply" (func $multiply (param i32 i32) (result i32)))
                (func (export "calculate") (param i32 i32) (result i32)
                    local.get 0
                    local.get 1
                    call $multiply
                )
            )
        `;
        const multiply = (a, b) => a * b;
        const compiler = new WASMCompiler();
        const module = await compiler.compile(code);
        const instance = await compiler.instantiate(module, {
            env: {
                multiply
            }
        });

        const calculate = instance.exports.calculate;
        const result = calculate(3, 4);
        
        expect(result).to.equal(12);
    });

});
