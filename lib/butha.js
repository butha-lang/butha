// butha.js

const fs = require('fs');
const path = require('path');
const { Lexer } = require('./lexer');
const { Parser } = require('./parser');
const { Evaluator } = require('./evaluator');
const { Optimizer } = require('./optimizer');
const { JITCompiler } = require('./jit');
const { ErrorHandler } = require('./error');
const { Runtime } = require('./runtime');
const { DynamicCodeExecutor } = require('./dynamic');
const { MemoryManager } = require('./memory');
const { PackageManager } = require('./api');
const { ConcurrencyManager } = require('./concurrency');
const { WebAssemblySupport } = require('./wasm');
const { MachineLearning } = require('./ml');
const { Collaboration } = require('./collaboration');
const { VersionControl } = require('./versionControl');

// Butha Class
class Butha {
    constructor() {
        this.lexer = new Lexer();
        this.parser = new Parser();
        this.evaluator = new Evaluator();
        this.optimizer = new Optimizer();
        this.jitCompiler = new JITCompiler();
        this.errorHandler = new ErrorHandler();
        this.runtime = new Runtime();
        this.dynamicCodeExecutor = new DynamicCodeExecutor();
        this.memoryManager = new MemoryManager();
        this.packageManager = new PackageManager();
        this.concurrencyManager = new ConcurrencyManager();
        this.webAssemblySupport = new WebAssemblySupport();
        this.machineLearning = new MachineLearning();
        this.collaboration = new Collaboration();
        this.versionControl = new VersionControl();
    }

    // Main method to run Butha code
    async run(filePath) {
        try {
            const code = fs.readFileSync(filePath, 'utf8');
            const tokens = this.lexer.tokenize(code);
            const ast = this.parser.parse(tokens);
            const optimizedAst = this.optimizer.optimize(ast);
            let bytecode;

            if (this.jitCompiler.isEnabled()) {
                bytecode = this.jitCompiler.compile(optimizedAst);
            } else {
                bytecode = this.runtime.generateBytecode(optimizedAst);
            }

            const result = await this.dynamicCodeExecutor.execute(bytecode);
            console.log('Execution Result:', result);
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    // Add dynamic code at runtime
    async addDynamicCode(code) {
        try {
            const tokens = this.lexer.tokenize(code);
            const ast = this.parser.parse(tokens);
            const optimizedAst = this.optimizer.optimize(ast);
            const bytecode = this.jitCompiler.compile(optimizedAst);
            await this.dynamicCodeExecutor.execute(bytecode);
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    // Load and execute a package
    async loadPackage(packagePath) {
        try {
            const packageCode = fs.readFileSync(packagePath, 'utf8');
            await this.packageManager.install(packageCode);
            console.log('Package loaded successfully');
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    // Manage memory
    manageMemory() {
        try {
            this.memoryManager.optimize();
            console.log('Memory managed successfully');
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    // Handle concurrency
    handleConcurrency() {
        try {
            this.concurrencyManager.manage();
            console.log('Concurrency handled successfully');
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    // Compile to WebAssembly
    async compileToWASM(sourceCode, outputPath) {
        try {
            this.webAssemblySupport.compileToWASM(sourceCode, outputPath);
            console.log('Compiled to WebAssembly successfully');
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    // Machine learning operations
    async trainModel(data, labels) {
        try {
            const model = await this.machineLearning.trainModel(data, labels);
            console.log('Model trained successfully');
            return model;
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    async predict(model, input) {
        try {
            const prediction = await this.machineLearning.predict(model, input);
            console.log('Prediction:', prediction);
            return prediction;
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    // Real-time collaboration
    startCollaboration(port) {
        try {
            this.collaboration.start(port);
            console.log('Collaboration started');
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    // Version control operations
    async commitChanges(message) {
        try {
            await this.versionControl.commitChanges(message);
            console.log('Changes committed');
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    async pushChanges(branch) {
        try {
            await this.versionControl.pushChanges(branch);
            console.log('Changes pushed');
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }

    async pullChanges(branch) {
        try {
            await this.versionControl.pullChanges(branch);
            console.log('Changes pulled');
        } catch (error) {
            this.errorHandler.handle(error);
        }
    }
}

// Export the Butha class
module.exports = { Butha };
